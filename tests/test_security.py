from __future__ import annotations

import asyncio
import base64
from pathlib import Path
import sys
import tempfile
import types

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))


def _install_ha_stubs() -> None:
    if "aiohttp" not in sys.modules:
        aiohttp = types.ModuleType("aiohttp")
        web = types.ModuleType("aiohttp.web")

        class _FakeResponse:
            def __init__(
                self,
                *,
                status: int = 200,
                body: bytes | None = None,
                text: str | None = None,
                content_type: str | None = None,
                headers: dict[str, str] | None = None,
            ) -> None:
                self.status = status
                self.body = body
                self.text = text
                self.content_type = content_type
                self.headers = dict(headers or {})

        web.Request = object
        web.StreamResponse = _FakeResponse
        web.Response = _FakeResponse
        aiohttp.web = web
        sys.modules["aiohttp"] = aiohttp
        sys.modules["aiohttp.web"] = web

    if "voluptuous" not in sys.modules:
        vol = types.ModuleType("voluptuous")
        vol.Required = lambda k: k
        sys.modules["voluptuous"] = vol

    if "homeassistant" not in sys.modules:
        ha = types.ModuleType("homeassistant")
        comps = types.ModuleType("homeassistant.components")
        frontend = types.ModuleType("homeassistant.components.frontend")
        frontend.async_register_built_in_panel = lambda *a, **kw: None
        frontend.async_remove_panel = lambda *a, **kw: None

        http = types.ModuleType("homeassistant.components.http")

        class _HomeAssistantView:
            requires_auth = True

        http.HomeAssistantView = _HomeAssistantView
        http_auth = types.ModuleType("homeassistant.components.http.auth")
        http_auth.async_sign_path = (
            lambda hass, path, expiration, *, refresh_token_id=None: (
                f"{path}?authSig=sig_{refresh_token_id or 'anon'}_{int(expiration.total_seconds())}"
            )
        )
        http.auth = http_auth

        ws = types.ModuleType("homeassistant.components.websocket_api")
        ws.ActiveConnection = object
        ws.websocket_command = lambda schema: (lambda fn: fn)
        ws.async_response = lambda fn: fn

        def _require_admin(fn):
            fn._require_admin = True
            return fn

        ws.require_admin = _require_admin
        ws.async_register_command = lambda *a, **kw: None

        comps.frontend = frontend
        comps.http = http
        comps.websocket_api = ws
        cfg_entries = types.ModuleType("homeassistant.config_entries")
        cfg_entries.ConfigEntry = object
        core = types.ModuleType("homeassistant.core")
        core.HomeAssistant = object
        helpers = types.ModuleType("homeassistant.helpers")
        cv = types.ModuleType("homeassistant.helpers.config_validation")
        cv.config_entry_only_config_schema = lambda domain: (lambda cfg: cfg)
        helpers.config_validation = cv
        storage = types.ModuleType("homeassistant.helpers.storage")
        storage.Store = object

        sys.modules["homeassistant"] = ha
        sys.modules["homeassistant.components"] = comps
        sys.modules["homeassistant.components.frontend"] = frontend
        sys.modules["homeassistant.components.http"] = http
        sys.modules["homeassistant.components.http.auth"] = http_auth
        sys.modules["homeassistant.components.websocket_api"] = ws
        sys.modules["homeassistant.config_entries"] = cfg_entries
        sys.modules["homeassistant.core"] = core
        sys.modules["homeassistant.helpers"] = helpers
        sys.modules["homeassistant.helpers.config_validation"] = cv
        sys.modules["homeassistant.helpers.storage"] = storage


_install_ha_stubs()
import custom_components.smarthome_hub as hub  # noqa: E402


class FakeStore:
    def __init__(self, initial: dict | None = None) -> None:
        self.data = dict(initial or {})
        self.save_count = 0

    async def async_load(self) -> dict:
        return dict(self.data)

    async def async_save(self, data: dict) -> None:
        self.data = dict(data)
        self.save_count += 1


class FakeHass:
    def __init__(self, store: FakeStore) -> None:
        self.data = {hub.DOMAIN: {"store": store}}
        self.bus = types.SimpleNamespace(async_fire=lambda *a, **kw: None)


class FakeConnection:
    def __init__(self) -> None:
        self.results: list[tuple[int, dict]] = []

    def send_result(self, msg_id: int, payload: dict) -> None:
        self.results.append((msg_id, payload))


def test_require_admin_decorators() -> None:
    assert getattr(hub.ws_save_config, "_require_admin", False) is True
    assert getattr(hub.ws_upload_image, "_require_admin", False) is True


def test_ws_save_and_verify_pin_preserves_hash_on_mask() -> None:
    store = FakeStore()
    hass = FakeHass(store)
    conn = FakeConnection()

    # 1. Neue PIN speichern -> wird als Hash gespeichert, nicht im Klartext
    asyncio.run(hub.ws_save_config(hass, conn, {"id": 1, "config": {"pinCode": "1234", "sidebarTitle": "Hub"}}))
    assert "pinCode" not in store.data
    saved_hash = store.data["_pinHash"]
    assert saved_hash == hub._hash_pin("1234")
    assert store.data["_pinLen"] == 4

    # 2. ws_get_config gibt nur Maske zurück
    asyncio.run(hub.ws_get_config(hass, conn, {"id": 2}))
    client_cfg = conn.results[-1][1]["config"]
    assert client_cfg["pinCode"] == "****"
    assert "_pinHash" not in client_cfg

    # 3. Erneutes Speichern mit unveränderter Maske "****" behält _pinHash bei
    asyncio.run(hub.ws_save_config(hass, conn, {"id": 3, "config": {"pinCode": "****", "sidebarTitle": "Hub 2"}}))
    assert store.data["_pinHash"] == saved_hash

    # 4. ws_verify_pin prüft korrekt gegen den gespeicherten Hash
    asyncio.run(hub.ws_verify_pin(hass, conn, {"id": 4, "pin": "1234"}))
    assert conn.results[-1][1] == {"valid": True}
    asyncio.run(hub.ws_verify_pin(hass, conn, {"id": 5, "pin": "0000"}))
    assert conn.results[-1][1] == {"valid": False}


def test_ws_verify_pin_legacy_plaintext_fallback() -> None:
    store = FakeStore({"pinCode": "9876"})
    hass = FakeHass(store)
    conn = FakeConnection()

    asyncio.run(hub.ws_verify_pin(hass, conn, {"id": 1, "pin": "9876"}))
    assert conn.results[-1][1] == {"valid": True}
    asyncio.run(hub.ws_verify_pin(hass, conn, {"id": 2, "pin": "1111"}))
    assert conn.results[-1][1] == {"valid": False}


def test_save_uploaded_file_validation(tmp_path=None) -> None:
    if tmp_path is None:
        tmp_path = tempfile.mkdtemp()
    valid_png = b"\x89PNG\r\n\x1a\n" + b"\x00" * 32
    b64_png = base64.b64encode(valid_png).decode("ascii")

    # Gültiges PNG wird gespeichert
    url = hub._save_uploaded_file(str(tmp_path), "room.png", b64_png)
    assert url.startswith(f"{hub.UPLOAD_API_URL}/") and url.endswith("_room.png")

    # Ungültige Dateiendung wird abgewiesen
    try:
        hub._save_uploaded_file(str(tmp_path), "exploit.svg", b64_png)
        raise AssertionError("Expected ValueError for .svg")
    except ValueError as err:
        assert "Ungültiges Dateiformat" in str(err)

    # Falsche Magic-Bytes (PNG-Bytes als .jpg) werden abgewiesen
    try:
        hub._save_uploaded_file(str(tmp_path), "fake.jpg", b64_png)
        raise AssertionError("Expected ValueError for mismatched magic bytes")
    except ValueError as err:
        assert "stimmt nicht mit Dateiendung" in str(err)


def test_assets_hash_computed_in_executor_and_cached() -> None:
    class FakeSetupHass:
        def __init__(self, tmp_dir: str) -> None:
            self.data: dict = {}
            self.executor_calls: list = []
            self.registered_views: list = []
            self.bus = types.SimpleNamespace(async_fire=lambda *a, **kw: None)
            self.http = types.SimpleNamespace(
                register_static_path=lambda *a, **kw: None,
                register_view=lambda view: self.registered_views.append(view),
            )
            self.config = types.SimpleNamespace(
                path=lambda *parts: str(Path(tmp_dir).joinpath(*parts))
            )

        async def async_add_executor_job(self, func, *args):
            self.executor_calls.append(func)
            return func(*args)

    store = FakeStore()
    conn = FakeConnection()
    registered_panels: list[dict] = []
    hash_calls = 0

    def fake_hash() -> str:
        nonlocal hash_calls
        hash_calls += 1
        return "abc1234567"

    orig_store = hub.Store
    orig_register_panel = hub.frontend.async_register_built_in_panel
    orig_get_assets_hash = hub._get_assets_hash

    try:
        hub.Store = lambda *a, **kw: store
        hub.frontend.async_register_built_in_panel = lambda *a, **kw: registered_panels.append(kw)
        hub._get_assets_hash = fake_hash

        with tempfile.TemporaryDirectory() as tmp_dir:
            hass = FakeSetupHass(tmp_dir)
            asyncio.run(hub.async_setup_entry(hass, types.SimpleNamespace(title="Test Hub")))

            assert fake_hash in hass.executor_calls
            assert hash_calls == 1
            assert hass.data[hub.DOMAIN]["asset_hash"] == "abc1234567"
            assert any(isinstance(v, hub.SmartHomeHubUploadView) for v in hass.registered_views)
            assert Path(tmp_dir, hub.UPLOAD_SUBDIR).is_dir()
            assert not Path(tmp_dir, "www").exists()
            expected_url = f"{hub.STATIC_URL}/index.html?v={hub.VERSION}&b=abc1234567"
            assert registered_panels[-1]["config"]["url"] == expected_url

            hass.executor_calls.clear()
            asyncio.run(hub.ws_get_config(hass, conn, {"id": 1}))
            asyncio.run(
                hub.ws_save_config(
                    hass, conn, {"id": 2, "config": {"sidebarTitle": "Updated"}}
                )
            )

            get_payload = conn.results[0][1]
            assert get_payload["asset_hash"] == "abc1234567"
            assert get_payload["version"] == hub.VERSION
            assert hash_calls == 1
            assert hass.executor_calls == []
            assert registered_panels[-1]["config"]["url"] == expected_url
    finally:
        hub.Store = orig_store
        hub.frontend.async_register_built_in_panel = orig_register_panel
        hub._get_assets_hash = orig_get_assets_hash


def test_upload_view_auth_and_serving() -> None:
    assert hub.SmartHomeHubUploadView.requires_auth is True
    assert hub.SmartHomeHubUploadView.url == f"{hub.UPLOAD_API_URL}/{{filename}}"

    class FakeUploadHass:
        def __init__(self, tmp_dir: str) -> None:
            self.executor_calls: list = []
            self.config = types.SimpleNamespace(
                path=lambda *parts: str(Path(tmp_dir).joinpath(*parts))
            )

        async def async_add_executor_job(self, func, *args):
            self.executor_calls.append(func)
            return func(*args)

    valid_png = b"\x89PNG\r\n\x1a\n" + b"\x00" * 32
    b64_png = base64.b64encode(valid_png).decode("ascii")

    with tempfile.TemporaryDirectory() as tmp_dir:
        hass = FakeUploadHass(tmp_dir)
        conn = FakeConnection()
        conn.refresh_token_id = "tok_99"

        asyncio.run(
            hub.ws_upload_image(
                hass, conn, {"id": 1, "filename": "living_room.png", "data": b64_png}
            )
        )
        returned_url = conn.results[-1][1]["url"]
        assert returned_url.startswith(f"{hub.UPLOAD_API_URL}/")
        assert "?authSig=sig_tok_99_3600" in returned_url

        saved_filename = returned_url.split("/")[-1].split("?", 1)[0]
        assert (Path(tmp_dir) / hub.UPLOAD_SUBDIR / saved_filename).is_file()
        assert not (Path(tmp_dir) / "www").exists()

        hass.executor_calls.clear()
        view = hub.SmartHomeHubUploadView(hass)
        resp = asyncio.run(view.get(object(), saved_filename))
        assert resp.status == 200
        assert resp.body == valid_png
        assert resp.content_type == "image/png"
        assert resp.headers["Cache-Control"] == "private, max-age=3600"
        assert resp.headers["X-Content-Type-Options"] == "nosniff"
        assert hub._read_uploaded_file in hass.executor_calls

        for bad_name in ("../secret.png", "sub/file.png", "evil.svg", "missing.png"):
            bad_resp = asyncio.run(view.get(object(), bad_name))
            assert bad_resp.status == 404


def test_config_strips_auth_sig_on_save_and_resigns_on_get() -> None:
    store = FakeStore()
    hass = FakeHass(store)
    conn = FakeConnection()
    conn.refresh_token_id = "tok_42"

    asyncio.run(
        hub.ws_save_config(
            hass,
            conn,
            {
                "id": 1,
                "config": {
                    "rooms": [
                        {
                            "name": "Wohnzimmer",
                            "image": f"{hub.UPLOAD_API_URL}/abc_room.png?authSig=expired",
                        },
                        {
                            "name": "Garten",
                            "image": "https://example.com/img.png?size=lg",
                        },
                    ]
                },
            },
        )
    )
    assert store.data["rooms"][0]["image"] == f"{hub.UPLOAD_API_URL}/abc_room.png"
    assert store.data["rooms"][1]["image"] == "https://example.com/img.png?size=lg"

    asyncio.run(hub.ws_get_config(hass, conn, {"id": 2}))
    fetched = conn.results[-1][1]["config"]
    assert (
        fetched["rooms"][0]["image"]
        == f"{hub.UPLOAD_API_URL}/abc_room.png?authSig=sig_tok_42_3600"
    )
    assert fetched["rooms"][1]["image"] == "https://example.com/img.png?size=lg"
    assert store.data["rooms"][0]["image"] == f"{hub.UPLOAD_API_URL}/abc_room.png"


def test_legacy_uploads_migration_at_setup() -> None:
    class FakeSetupHass:
        def __init__(self, tmp_dir: str) -> None:
            self.data: dict = {}
            self.executor_calls: list = []
            self.registered_views: list = []
            self.bus = types.SimpleNamespace(async_fire=lambda *a, **kw: None)
            self.http = types.SimpleNamespace(
                register_static_path=lambda *a, **kw: None,
                register_view=lambda view: self.registered_views.append(view),
            )
            self.config = types.SimpleNamespace(
                path=lambda *parts: str(Path(tmp_dir).joinpath(*parts))
            )

        async def async_add_executor_job(self, func, *args):
            self.executor_calls.append(func)
            return func(*args)

    living_png = b"\x89PNG\r\n\x1a\n" + b"living-bytes"
    old_dup_jpg = b"\xff\xd8\xff" + b"old-dup"
    new_dup_jpg = b"\xff\xd8\xff" + b"new-private"

    store = FakeStore(
        {
            "_pinHash": "keep-hash",
            "rooms": [
                {
                    "name": "Wohnzimmer",
                    "image": f"{hub.LEGACY_UPLOAD_URL}/abc123_living.png",
                },
                {
                    "name": "Küche",
                    "image": f"{hub.LEGACY_UPLOAD_URL}/dup_kitchen.jpg?v=1",
                },
                {
                    "name": "Garten",
                    "image": "/local/custom/garden.png",
                },
                {
                    "name": "Bad",
                    "image": f"{hub.LEGACY_UPLOAD_URL}/../escape.png",
                },
            ],
        }
    )

    orig_store = hub.Store
    orig_register_panel = hub.frontend.async_register_built_in_panel
    try:
        hub.Store = lambda *a, **kw: store
        hub.frontend.async_register_built_in_panel = lambda *a, **kw: None

        with tempfile.TemporaryDirectory() as tmp_dir:
            legacy_dir = Path(tmp_dir, "www", hub.UPLOAD_SUBDIR)
            upload_dir = Path(tmp_dir, hub.UPLOAD_SUBDIR)
            legacy_dir.mkdir(parents=True)
            upload_dir.mkdir(parents=True)
            (legacy_dir / "abc123_living.png").write_bytes(living_png)
            (legacy_dir / "dup_kitchen.jpg").write_bytes(old_dup_jpg)
            (upload_dir / "dup_kitchen.jpg").write_bytes(new_dup_jpg)

            hass = FakeSetupHass(tmp_dir)
            asyncio.run(hub.async_setup_entry(hass, types.SimpleNamespace(title="Hub")))

            assert hub._migrate_legacy_uploads in hass.executor_calls
            assert (upload_dir / "abc123_living.png").read_bytes() == living_png
            assert (upload_dir / "dup_kitchen.jpg").read_bytes() == new_dup_jpg
            assert not legacy_dir.exists()
            assert store.save_count == 1
            assert store.data["_pinHash"] == "keep-hash"
            assert (
                store.data["rooms"][0]["image"]
                == f"{hub.UPLOAD_API_URL}/abc123_living.png"
            )
            assert (
                store.data["rooms"][1]["image"]
                == f"{hub.UPLOAD_API_URL}/dup_kitchen.jpg"
            )
            assert store.data["rooms"][2]["image"] == "/local/custom/garden.png"
            assert (
                store.data["rooms"][3]["image"]
                == f"{hub.LEGACY_UPLOAD_URL}/../escape.png"
            )

            conn = FakeConnection()
            conn.refresh_token_id = "tok_mig"
            asyncio.run(hub.ws_get_config(hass, conn, {"id": 1}))
            fetched = conn.results[-1][1]["config"]
            assert (
                fetched["rooms"][0]["image"]
                == f"{hub.UPLOAD_API_URL}/abc123_living.png?authSig=sig_tok_mig_3600"
            )

            view = hub.SmartHomeHubUploadView(hass)
            resp = asyncio.run(view.get(object(), "abc123_living.png"))
            assert resp.status == 200
            assert resp.body == living_png

            # Zweiter Setup-Lauf ist idempotent (kein erneutes Speichern)
            asyncio.run(hub.async_setup_entry(hass, types.SimpleNamespace(title="Hub")))
            assert store.save_count == 1

            # ws_save_config normalisiert Legacy-URLs aus alten Backups/Tabs ebenfalls
            asyncio.run(
                hub.ws_save_config(
                    hass,
                    conn,
                    {
                        "id": 2,
                        "config": {
                            "rooms": [
                                {"image": f"{hub.LEGACY_UPLOAD_URL}/abc123_living.png"}
                            ]
                        },
                    },
                )
            )
            assert (
                store.data["rooms"][0]["image"]
                == f"{hub.UPLOAD_API_URL}/abc123_living.png"
            )

            # Nicht-Bild-Dateien bleiben unberührt und der Ordner bleibt erhalten
            mixed_legacy = Path(tmp_dir, "mixed_legacy")
            mixed_target = Path(tmp_dir, "mixed_target")
            mixed_legacy.mkdir()
            (mixed_legacy / "notes.txt").write_text("keep", encoding="utf-8")
            (mixed_legacy / "photo.png").write_bytes(living_png)
            moved = hub._migrate_legacy_uploads(str(mixed_legacy), str(mixed_target))
            assert moved == 1
            assert (mixed_target / "photo.png").read_bytes() == living_png
            assert not (mixed_legacy / "photo.png").exists()
            assert (mixed_legacy / "notes.txt").is_file()
            assert mixed_legacy.is_dir()
    finally:
        hub.Store = orig_store
        hub.frontend.async_register_built_in_panel = orig_register_panel


if __name__ == "__main__":
    test_require_admin_decorators()
    test_ws_save_and_verify_pin_preserves_hash_on_mask()
    test_ws_verify_pin_legacy_plaintext_fallback()
    test_save_uploaded_file_validation()
    test_assets_hash_computed_in_executor_and_cached()
    test_upload_view_auth_and_serving()
    test_config_strips_auth_sig_on_save_and_resigns_on_get()
    test_legacy_uploads_migration_at_setup()
    print("8 passed")


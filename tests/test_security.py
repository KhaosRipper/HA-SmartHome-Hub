from __future__ import annotations

import asyncio
import base64
from pathlib import Path
import sys
import tempfile
import types

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))


def _install_ha_stubs() -> None:
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

    async def async_load(self) -> dict:
        return dict(self.data)

    async def async_save(self, data: dict) -> None:
        self.data = dict(data)


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
    assert url.startswith(f"/local/{hub.UPLOAD_SUBDIR}/") and url.endswith("_room.png")

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


if __name__ == "__main__":
    test_require_admin_decorators()
    test_ws_save_and_verify_pin_preserves_hash_on_mask()
    test_ws_verify_pin_legacy_plaintext_fallback()
    test_save_uploaded_file_validation()
    print("4 passed")


# Datei: custom_components/smarthome_hub/__init__.py
from __future__ import annotations

import base64
import binascii
from datetime import timedelta
import hashlib
import hmac
import logging
import os
import re
import shutil
import time
from typing import Any
import uuid
from aiohttp import web
import voluptuous as vol

from homeassistant.components import frontend, websocket_api
from homeassistant.components.http import HomeAssistantView
from homeassistant.components.http.auth import async_sign_path
try:
    from homeassistant.components.http import StaticPathConfig
    HAS_STATIC_PATH_CONFIG = True
except ImportError:
    HAS_STATIC_PATH_CONFIG = False

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.storage import Store

DOMAIN = "smarthome_hub"
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)
VERSION = "3.7.9"
PANEL_URL_PATH = "smarthome-hub"
STORAGE_KEY = f"{DOMAIN}_config"
STORAGE_VERSION = 1
STATIC_URL = f"/{DOMAIN}_static"
UPLOAD_SUBDIR = "smarthome_hub_uploads"
UPLOAD_API_URL = f"/api/{DOMAIN}/uploads"
LEGACY_UPLOAD_URL = f"/local/{UPLOAD_SUBDIR}"
UPLOAD_URL_SIGN_TTL = timedelta(hours=1)
MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10 MB max. Bildgröße
ALLOWED_IMAGE_EXTENSIONS = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
}
_LOGGER = logging.getLogger(__name__)


def _get_assets_hash() -> str:
    """Berechnet einen kurzen Hash über die Panel-Dateien für zuverlässiges Cache-Busting."""
    panel_dir = os.path.join(os.path.dirname(__file__), "panel")
    h = hashlib.md5()
    try:
        for fname in sorted(os.listdir(panel_dir)):
            if fname.endswith((".js", ".css", ".html")):
                fpath = os.path.join(panel_dir, fname)
                st = os.stat(fpath)
                h.update(f"{fname}:{int(st.st_mtime)}:{st.st_size};".encode())
        return h.hexdigest()[:10]
    except OSError:
        return VERSION


def _register_panel(hass: HomeAssistant, title: str, icon: str) -> None:
    """Registriert oder aktualisiert das Seitenleisten-Panel via update=True."""
    asset_hash = hass.data.get(DOMAIN, {}).get("asset_hash", VERSION)
    frontend.async_register_built_in_panel(
        hass,
        component_name="iframe",
        sidebar_title=title or "Smart Home Hub",
        sidebar_icon=icon or "mdi:home-automation",
        frontend_url_path=PANEL_URL_PATH,
        config={"url": f"{STATIC_URL}/index.html?v={VERSION}&b={asset_hash}"},
        require_admin=False,
        update=True,
    )


async def async_setup(hass: HomeAssistant, config: dict[str, Any]) -> bool:
    """Initialisiert die Komponente."""
    hass.data.setdefault(DOMAIN, {})
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Richtet das Seitenleisten-Panel, den Bildupload-Ordner und die WebSocket-API ein."""
    hass.data.setdefault(DOMAIN, {})
    store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
    hass.data[DOMAIN]["store"] = store

    panel_dir = os.path.join(os.path.dirname(__file__), "panel")
    if not hass.data[DOMAIN].get("static_paths_registered"):
        if HAS_STATIC_PATH_CONFIG:
            await hass.http.async_register_static_paths(
                [StaticPathConfig(STATIC_URL, panel_dir, cache_headers=False)]
            )
        else:
            hass.http.register_static_path(STATIC_URL, panel_dir, cache_headers=False)
        hass.data[DOMAIN]["static_paths_registered"] = True

    upload_dir = hass.config.path(UPLOAD_SUBDIR)
    legacy_upload_dir = hass.config.path("www", UPLOAD_SUBDIR)
    await hass.async_add_executor_job(
        _migrate_legacy_uploads, legacy_upload_dir, upload_dir
    )

    if not hass.data[DOMAIN].get("upload_view_registered"):
        hass.http.register_view(SmartHomeHubUploadView(hass))
        hass.data[DOMAIN]["upload_view_registered"] = True

    hass.data[DOMAIN]["asset_hash"] = await hass.async_add_executor_job(_get_assets_hash)

    saved = await store.async_load() or {}
    if saved:
        migrated, changed = _migrate_legacy_upload_urls(saved)
        if changed:
            await store.async_save(migrated)
            saved = migrated
    sidebar_title = saved.get("sidebarTitle", entry.title or "Smart Home Hub")
    sidebar_icon = saved.get("sidebarIcon", "mdi:home-automation")
    _register_panel(hass, sidebar_title, sidebar_icon)

    if not hass.data[DOMAIN].get("commands_registered"):
        websocket_api.async_register_command(hass, ws_get_config)
        websocket_api.async_register_command(hass, ws_save_config)
        websocket_api.async_register_command(hass, ws_verify_pin)
        websocket_api.async_register_command(hass, ws_upload_image)
        hass.data[DOMAIN]["commands_registered"] = True

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Entfernt das Panel beim Deinstallieren der Integration."""
    frontend.async_remove_panel(hass, PANEL_URL_PATH)
    return True


def _hash_pin(pin: str) -> str:
    """Erzeugt einen SHA-256-Hash für die Dashboard-PIN."""
    return hashlib.sha256(f"{DOMAIN}_pin:{pin}".encode("utf-8")).hexdigest()


def _sanitize_config_for_client(data: dict[str, Any] | None) -> dict[str, Any] | None:
    """Entfernt Klartext-PIN und PIN-Hash aus der Client-Antwort (sendet nur Maske in PIN-Länge)."""
    if not data or not isinstance(data, dict):
        return data
    clean = dict(data)
    raw_pin = str(clean.pop("pinCode", "") or "").strip()
    pin_hash = clean.pop("_pinHash", None)
    pin_len = int(clean.pop("_pinLen", 0) or len(raw_pin) or 4)
    clean["pinCode"] = ("*" * pin_len) if (pin_hash or raw_pin) else ""
    return clean


def _is_valid_upload_filename(filename: str) -> bool:
    """Prüft, ob ein Dateiname ein gültiges, pfadsicheres Upload-Bild ist."""
    return (
        bool(filename)
        and "/" not in filename
        and "\\" not in filename
        and "\x00" not in filename
        and os.path.basename(filename) == filename
        and os.path.splitext(filename)[1].lower() in ALLOWED_IMAGE_EXTENSIONS
    )


def _migrate_legacy_uploads(legacy_dir: str, upload_dir: str) -> int:
    """Verschiebt Alt-Uploads einmalig aus /config/www/smarthome_hub_uploads nach /config/smarthome_hub_uploads."""
    os.makedirs(upload_dir, exist_ok=True)
    abs_upload_dir = os.path.realpath(upload_dir)
    if not os.path.isdir(legacy_dir) or os.path.islink(legacy_dir):
        return 0
    abs_legacy_dir = os.path.realpath(legacy_dir)
    if abs_legacy_dir == abs_upload_dir:
        return 0

    try:
        with os.scandir(abs_legacy_dir) as it:
            entries = list(it)
    except OSError as err:
        _LOGGER.warning("Konnte Alt-Upload-Ordner %s nicht lesen: %s", legacy_dir, err)
        return 0

    moved = 0
    for entry in entries:
        if (
            entry.is_symlink()
            or not entry.is_file(follow_symlinks=False)
            or not _is_valid_upload_filename(entry.name)
        ):
            continue
        src_path = os.path.realpath(entry.path)
        target_path = os.path.realpath(os.path.join(abs_upload_dir, entry.name))
        if not src_path.startswith(abs_legacy_dir + os.sep) or not target_path.startswith(
            abs_upload_dir + os.sep
        ):
            continue
        try:
            if os.path.exists(target_path):
                os.remove(src_path)
            else:
                shutil.move(src_path, target_path)
            moved += 1
        except OSError as err:
            _LOGGER.warning("Alt-Upload %s konnte nicht migriert werden: %s", entry.name, err)

    try:
        os.rmdir(abs_legacy_dir)
    except OSError:
        pass

    if moved:
        _LOGGER.info("%d Alt-Upload(s) nach %s migriert", moved, upload_dir)
    return moved


def _migrate_legacy_upload_urls(value: Any) -> tuple[Any, bool]:
    """Schreibt gespeicherte /local/smarthome_hub_uploads/...-URLs rekursiv auf die authentifizierte Upload-URL um."""
    if isinstance(value, dict):
        changed = False
        out: dict[Any, Any] = {}
        for k, v in value.items():
            new_v, item_changed = _migrate_legacy_upload_urls(v)
            out[k] = new_v
            changed = changed or item_changed
        return out, changed
    if isinstance(value, list):
        changed = False
        out_list: list[Any] = []
        for item in value:
            new_item, item_changed = _migrate_legacy_upload_urls(item)
            out_list.append(new_item)
            changed = changed or item_changed
        return out_list, changed
    legacy_prefix = f"{LEGACY_UPLOAD_URL}/"
    if isinstance(value, str) and value.startswith(legacy_prefix):
        filename = value[len(legacy_prefix) :].split("?", 1)[0]
        if _is_valid_upload_filename(filename):
            return f"{UPLOAD_API_URL}/{filename}", True
    return value, False


def _map_upload_urls(value: Any, transform: Any) -> Any:
    """Wendet eine Transformation rekursiv auf alle Upload-URLs in dict/list-Strukturen an."""
    if isinstance(value, dict):
        return {k: _map_upload_urls(v, transform) for k, v in value.items()}
    if isinstance(value, list):
        return [_map_upload_urls(item, transform) for item in value]
    if isinstance(value, str) and value.startswith(f"{UPLOAD_API_URL}/"):
        return transform(value.split("?", 1)[0])
    return value


def _strip_upload_signature(value: Any) -> Any:
    """Entfernt temporäre authSig-Query-Parameter aus Upload-URLs vor dem Speichern."""
    return _map_upload_urls(value, lambda clean: clean)


def _sign_upload_urls(
    hass: HomeAssistant, value: Any, refresh_token_id: str | None = None
) -> Any:
    """Signiert alle Upload-URLs einer Konfiguration für authentifizierte <img>/CSS-Abrufe."""
    return _map_upload_urls(
        value,
        lambda clean: async_sign_path(
            hass,
            clean,
            UPLOAD_URL_SIGN_TTL,
            refresh_token_id=refresh_token_id,
        ),
    )


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/get_config"})
@websocket_api.async_response
async def ws_get_config(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Lädt die gespeicherte Dashboard-Konfiguration aus .storage."""
    store: Store = hass.data[DOMAIN]["store"]
    data = await store.async_load()
    client_cfg = _sanitize_config_for_client(data)
    client_cfg = _sign_upload_urls(
        hass,
        client_cfg,
        refresh_token_id=getattr(connection, "refresh_token_id", None),
    )
    connection.send_result(
        msg["id"],
        {
            "config": client_cfg,
            "version": VERSION,
            "asset_hash": hass.data[DOMAIN].get("asset_hash", VERSION),
        },
    )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/save_config",
        vol.Required("config"): dict,
    }
)
@websocket_api.async_response
async def ws_save_config(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Speichert die Konfiguration, aktualisiert die HA-Seitenleiste und benachrichtigt alle Clients live."""
    store: Store = hass.data[DOMAIN]["store"]
    old = await store.async_load() or {}
    cfg, _ = _migrate_legacy_upload_urls(_strip_upload_signature(dict(msg["config"])))
    raw_pin = str(cfg.pop("pinCode", "") or "").strip()
    if not raw_pin:
        cfg.pop("_pinHash", None)
        cfg.pop("_pinLen", None)
    elif set(raw_pin) == {"*"} and (old.get("_pinHash") or old.get("pinCode")):
        old_raw = str(old.get("pinCode") or "").strip()
        cfg["_pinHash"] = old.get("_pinHash") or _hash_pin(old_raw)
        cfg["_pinLen"] = int(old.get("_pinLen") or len(old_raw) or len(raw_pin))
    else:
        cfg["_pinHash"] = _hash_pin(raw_pin)
        cfg["_pinLen"] = len(raw_pin)

    updated_at = int(time.time() * 1000)
    cfg["_updatedAt"] = updated_at
    await store.async_save(cfg)

    _register_panel(
        hass,
        cfg.get("sidebarTitle", "Smart Home Hub"),
        cfg.get("sidebarIcon", "mdi:home-automation"),
    )
    hass.bus.async_fire(
        f"{DOMAIN}_config_updated",
        {
            "updated_at": updated_at,
            "sidebar_title": cfg.get("sidebarTitle", "Smart Home Hub"),
            "sidebar_icon": cfg.get("sidebarIcon", "mdi:home-automation"),
        },
    )
    connection.send_result(msg["id"], {"status": "ok", "updated_at": updated_at})


@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/verify_pin",
        vol.Required("pin"): str,
    }
)
@websocket_api.async_response
async def ws_verify_pin(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Prüft eine eingegebene PIN gegen den gespeicherten Hash im Backend."""
    store: Store = hass.data[DOMAIN]["store"]
    data = await store.async_load() or {}
    candidate = str(msg.get("pin") or "").strip()
    expected_hash = data.get("_pinHash")
    if not expected_hash:
        legacy_pin = str(data.get("pinCode") or "").strip()
        expected_hash = _hash_pin(legacy_pin) if legacy_pin else ""
    valid = bool(expected_hash) and hmac.compare_digest(_hash_pin(candidate), expected_hash)
    connection.send_result(msg["id"], {"valid": valid})


def _validate_image_magic(data: bytes, ext: str) -> bool:
    """Überprüft die Magic Bytes der Datei gegen die erlaubte Bild-Erweiterung."""
    if ext in {".jpg", ".jpeg"}:
        return data.startswith(b"\xff\xd8\xff")
    if ext == ".png":
        return data.startswith(b"\x89PNG\r\n\x1a\n")
    if ext == ".gif":
        return data.startswith(b"GIF87a") or data.startswith(b"GIF89a")
    if ext == ".webp":
        return len(data) >= 12 and data.startswith(b"RIFF") and data[8:12] == b"WEBP"
    return False


def _save_uploaded_file(upload_dir: str, filename: str, b64_data: str) -> str:
    """Speichert ein validiertes Bild unter /config/smarthome_hub_uploads/."""
    # Dateiendung prüfen
    _, raw_ext = os.path.splitext(filename)
    ext = raw_ext.lower().strip()
    if ext not in ALLOWED_IMAGE_EXTENSIONS:
        raise ValueError(
            f"Ungültiges Dateiformat '{ext}'. Erlaubt sind nur: {', '.join(sorted(ALLOWED_IMAGE_EXTENSIONS))}"
        )

    # Base64 bereinigen und dekodieren
    if "," in b64_data:
        b64_data = b64_data.split(",", 1)[1]
    b64_data = b64_data.strip()

    try:
        raw = base64.b64decode(b64_data, validate=True)
    except (binascii.Error, ValueError) as err:
        raise ValueError("Base64-Dekodierung fehlgeschlagen") from err

    # Größenbegrenzung
    if len(raw) > MAX_UPLOAD_SIZE:
        raise ValueError(f"Datei ist zu groß (max. {MAX_UPLOAD_SIZE // (1024 * 1024)} MB erlaubt)")

    # Magic Bytes Verifikation
    if not _validate_image_magic(raw, ext):
        raise ValueError(f"Dateiinhalt stimmt nicht mit Dateiendung '{ext}' überein")

    # Sicheren Dateinamen erzeugen (UUID-Präfix + bereinigter Basisname)
    base_name = re.sub(r"[^a-zA-Z0-9_-]", "_", os.path.splitext(os.path.basename(filename))[0])[:32]
    safe_name = f"{uuid.uuid4().hex[:12]}_{base_name}{ext}"

    # Path-Traversal-Schutz & Zielordner sicherstellen
    abs_upload_dir = os.path.abspath(upload_dir)
    os.makedirs(abs_upload_dir, exist_ok=True)
    target_path = os.path.abspath(os.path.join(abs_upload_dir, safe_name))
    if not target_path.startswith(abs_upload_dir + os.sep):
        raise ValueError("Ungültiger Zielpfad für Bildupload")

    with open(target_path, "wb") as f:
        f.write(raw)

    return f"{UPLOAD_API_URL}/{safe_name}"


def _read_uploaded_file(upload_dir: str, filename: str) -> tuple[bytes, str] | None:
    """Liest ein hochgeladenes Bild sicher aus dem privaten Upload-Ordner (Executor)."""
    if not _is_valid_upload_filename(filename):
        return None
    content_type = ALLOWED_IMAGE_EXTENSIONS[os.path.splitext(filename)[1].lower()]
    abs_upload_dir = os.path.realpath(upload_dir)
    target_path = os.path.realpath(os.path.join(abs_upload_dir, filename))
    if not target_path.startswith(abs_upload_dir + os.sep) or not os.path.isfile(target_path):
        return None
    try:
        with open(target_path, "rb") as f:
            return f.read(), content_type
    except OSError:
        return None


class SmartHomeHubUploadView(HomeAssistantView):
    """Authentifizierter HTTP-Endpunkt zum Ausliefern hochgeladener Raum-Bilder."""

    url = f"{UPLOAD_API_URL}/{{filename}}"
    name = f"api:{DOMAIN}:uploads"
    requires_auth = True

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass

    async def get(self, request: web.Request, filename: str) -> web.StreamResponse:
        """Liefert ein hochgeladenes Bild ausschließlich für authentifizierte/signierte Anfragen."""
        result = await self.hass.async_add_executor_job(
            _read_uploaded_file, self.hass.config.path(UPLOAD_SUBDIR), filename
        )
        if result is None:
            return web.Response(status=404, text="Not Found")
        data, content_type = result
        return web.Response(
            body=data,
            content_type=content_type,
            headers={
                "Cache-Control": "private, max-age=3600",
                "X-Content-Type-Options": "nosniff",
            },
        )


@websocket_api.require_admin
@websocket_api.websocket_command(
    {
        vol.Required("type"): f"{DOMAIN}/upload_image",
        vol.Required("filename"): str,
        vol.Required("data"): str,
    }
)
@websocket_api.async_response
async def ws_upload_image(
    hass: HomeAssistant,
    connection: websocket_api.ActiveConnection,
    msg: dict[str, Any],
) -> None:
    """Nimmt einen Base64-Bildupload entgegen, validiert ihn und gibt die signierte URL zurück."""
    upload_dir = hass.config.path(UPLOAD_SUBDIR)
    try:
        canonical_path = await hass.async_add_executor_job(
            _save_uploaded_file, upload_dir, msg["filename"], msg["data"]
        )
        signed_url = async_sign_path(
            hass,
            canonical_path,
            UPLOAD_URL_SIGN_TTL,
            refresh_token_id=getattr(connection, "refresh_token_id", None),
        )
        connection.send_result(msg["id"], {"url": signed_url})
    except Exception as err:
        connection.send_error(msg["id"], "upload_error", str(err))

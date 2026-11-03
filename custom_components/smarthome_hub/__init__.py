# Datei: custom_components/smarthome_hub/__init__.py
from __future__ import annotations

import base64
import binascii
import os
import re
from typing import Any
import uuid
import voluptuous as vol

from homeassistant.components import frontend, websocket_api
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

DOMAIN = "smarthome_hub"
VERSION = "2.0.9"
STORAGE_KEY = f"{DOMAIN}_config"
STORAGE_VERSION = 1
STATIC_URL = f"/{DOMAIN}_static"
UPLOAD_SUBDIR = "smarthome_hub_uploads"
MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10 MB max. Bildgröße
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}


def _register_panel(hass: HomeAssistant, title: str, icon: str) -> None:
    """Registriert oder aktualisiert das Seitenleisten-Panel via update=True."""
    frontend.async_register_built_in_panel(
        hass,
        component_name="iframe",
        sidebar_title=title or "Smart Home Hub",
        sidebar_icon=icon or "mdi:home-automation",
        frontend_url_path=DOMAIN,
        config={"url": f"{STATIC_URL}/index.html?v={VERSION}"},
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

    panel_dir = hass.config.path("custom_components", DOMAIN, "panel")
    if not hass.data[DOMAIN].get("static_paths_registered"):
        await hass.http.async_register_static_paths(
            [StaticPathConfig(STATIC_URL, panel_dir, cache_headers=False)]
        )
        hass.data[DOMAIN]["static_paths_registered"] = True

    upload_dir = hass.config.path("www", UPLOAD_SUBDIR)
    await hass.async_add_executor_job(
        lambda: os.makedirs(upload_dir, exist_ok=True)
    )

    saved = await store.async_load() or {}
    sidebar_title = saved.get("sidebarTitle", entry.title or "Smart Home Hub")
    sidebar_icon = saved.get("sidebarIcon", "mdi:home-automation")
    _register_panel(hass, sidebar_title, sidebar_icon)

    if not hass.data[DOMAIN].get("commands_registered"):
        websocket_api.async_register_command(hass, ws_get_config)
        websocket_api.async_register_command(hass, ws_save_config)
        websocket_api.async_register_command(hass, ws_upload_image)
        hass.data[DOMAIN]["commands_registered"] = True

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Entfernt das Panel beim Deinstallieren der Integration."""
    frontend.async_remove_panel(hass, DOMAIN)
    return True


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
    connection.send_result(msg["id"], {"config": data})


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
    """Speichert die Konfiguration und aktualisiert Name/Icon der HA-Seitenleiste."""
    store: Store = hass.data[DOMAIN]["store"]
    cfg = msg["config"]
    await store.async_save(cfg)

    _register_panel(
        hass,
        cfg.get("sidebarTitle", "Smart Home Hub"),
        cfg.get("sidebarIcon", "mdi:home-automation"),
    )
    connection.send_result(msg["id"], {"status": "ok"})


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
    """Speichert ein validiertes Bild unter /config/www/smarthome_hub_uploads/."""
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

    # Path-Traversal-Schutz
    abs_upload_dir = os.path.abspath(upload_dir)
    target_path = os.path.abspath(os.path.join(abs_upload_dir, safe_name))
    if not target_path.startswith(abs_upload_dir + os.sep):
        raise ValueError("Ungültiger Zielpfad für Bildupload")

    with open(target_path, "wb") as f:
        f.write(raw)

    return f"/local/{UPLOAD_SUBDIR}/{safe_name}"


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
    """Nimmt einen Base64-Bildupload entgegen, validiert ihn und gibt die URL zurück."""
    upload_dir = hass.config.path("www", UPLOAD_SUBDIR)
    try:
        url_path = await hass.async_add_executor_job(
            _save_uploaded_file, upload_dir, msg["filename"], msg["data"]
        )
        connection.send_result(msg["id"], {"url": url_path})
    except Exception as err:
        connection.send_error(msg["id"], "upload_error", str(err))

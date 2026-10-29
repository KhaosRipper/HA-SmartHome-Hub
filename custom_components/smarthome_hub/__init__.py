# Datei: custom_components/smarthome_hub/__init__.py
from __future__ import annotations

import base64
import os
import re
from typing import Any
import voluptuous as vol

from homeassistant.components import frontend, websocket_api
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

DOMAIN = "smarthome_hub"
STORAGE_KEY = f"{DOMAIN}_config"
STORAGE_VERSION = 1
STATIC_URL = f"/{DOMAIN}_static"
UPLOAD_SUBDIR = "smarthome_hub_uploads"


def _register_panel(hass: HomeAssistant, title: str, icon: str) -> None:
    """Registriert oder aktualisiert das Seitenleisten-Panel via update=True."""
    frontend.async_register_built_in_panel(
        hass,
        component_name="iframe",
        sidebar_title=title or "Smart Home Hub",
        sidebar_icon=icon or "mdi:home-automation",
        frontend_url_path=DOMAIN,
        config={"url": f"{STATIC_URL}/index.html?v=2.0.8"},
        require_admin=False,
        update=True,
    )


async def async_setup(hass: HomeAssistant, config: dict[str, Any]) -> bool:
    """Initialisiert die Komponente."""
    hass.data.setdefault(DOMAIN, {})
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Richtet das Seitenleisten-Panel, den Bildupload-Ordner und die WebSocket-API ein."""
    store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
    hass.data[DOMAIN]["store"] = store

    panel_dir = hass.config.path("custom_components", DOMAIN, "panel")
    await hass.http.async_register_static_paths(
        [StaticPathConfig(STATIC_URL, panel_dir, cache_headers=False)]
    )

    upload_dir = hass.config.path("www", UPLOAD_SUBDIR)
    await hass.async_add_executor_job(
        lambda: os.makedirs(upload_dir, exist_ok=True)
    )

    saved = await store.async_load() or {}
    sidebar_title = saved.get("sidebarTitle", entry.title or "Smart Home Hub")
    sidebar_icon = saved.get("sidebarIcon", "mdi:home-automation")
    _register_panel(hass, sidebar_title, sidebar_icon)

    websocket_api.async_register_command(hass, ws_get_config)
    websocket_api.async_register_command(hass, ws_save_config)
    websocket_api.async_register_command(hass, ws_upload_image)

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
    """LÃ¤dt die gespeicherte Dashboard-Konfiguration aus .storage."""
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


def _save_uploaded_file(upload_dir: str, filename: str, b64_data: str) -> str:
    """Speichert ein hochgeladenes Bild unter /config/www/smarthome_hub_uploads/."""
    safe_name = re.sub(r"[^a-zA-Z0-9._-]", "_", filename)
    if "," in b64_data:
        b64_data = b64_data.split(",", 1)[1]
    raw = base64.b64decode(b64_data)
    target_path = os.path.join(upload_dir, safe_name)
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
    """Nimmt einen Base64-Bildupload entgegen und gibt die lokale URL zurÃ¼ck."""
    upload_dir = hass.config.path("www", UPLOAD_SUBDIR)
    url_path = await hass.async_add_executor_job(
        _save_uploaded_file, upload_dir, msg["filename"], msg["data"]
    )
    connection.send_result(msg["id"], {"url": url_path})

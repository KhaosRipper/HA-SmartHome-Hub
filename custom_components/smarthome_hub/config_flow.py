from __future__ import annotations
from typing import Any
from homeassistant import config_entries
from homeassistant.data_entry_flow import FlowResult

DOMAIN = "smarthome_hub"


class SmartHomeHubConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Config Flow für die 1-Klick-Installation über die Home Assistant UI."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Erstellt den Eintrag, sofern noch nicht vorhanden."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        if user_input is not None:
            return self.async_create_entry(title="Smart Home Hub", data={})

        return self.async_show_form(step_id="user")

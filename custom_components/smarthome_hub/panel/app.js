const ICONS = {
  home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
  devices:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  auto:'<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M6 8.5v3.5a3 3 0 0 0 3 3h6.5"/>',
  bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  scenes:'<path d="M12 3l2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 16.9 6.4 20.1l1.4-6.3L3 9.5l6.4-.6z"/>',
  cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  settings:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
  bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
  thermo:'<path d="M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0z"/>',
  tv:'<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>',
  speaker:'<rect x="6" y="3" width="12" height="18" rx="2"/><circle cx="12" cy="14" r="3"/>',
  camera:'<path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="12.5" r="3.5"/>',
  plug:'<path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0zM12 17v5"/>',
  drop:'<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  blinds:'<path d="M4 4h16M6 4v16M18 4v16M8 8h8M8 12h8M8 16h8"/>',
  up:'<path d="M18 15l-6-6-6 6"/>',
  down:'<path d="M6 9l6 6 6-6"/>',
  stop:'<rect x="6" y="6" width="12" height="12" rx="1.5"/>',
  mower:'<rect x="4" y="9" width="13" height="7" rx="2"/><circle cx="7.5" cy="18" r="2"/><circle cx="15" cy="18" r="2"/><path d="M17 11h3l1 5"/>',
  lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  unlock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/>',
  window:'<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M12 3v18M4 12h16"/>',
  leaf:'<path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15zM5 19l8-8"/>',
  fan:'<circle cx="12" cy="12" r="1.6"/><path d="M12 10.4C12 6 14 3 17 4s2 5-3.4 7M13.6 12c4.4 0 7.4 2 6.4 5s-5 2-7-3.4M12 13.6c0 4.4-2 7.4-5 6.4s-2-5 3.4-7M10.4 12C6 12 3 10 4 7s5-2 7 3.4"/>',
  sun:'<circle cx="12" cy="12" r="3.5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
  filter:'<path d="M4 6h16M7 12h10M10 18h4"/>',
  expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  fire:'<path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3 1-5 1-8z"/>',
  radiator:'<path d="M6 5v14M10 5v14M14 5v14M18 5v14M3 8h3M18 8h3M3 16h3M18 16h3"/>',
  ac:'<rect x="3" y="5" width="18" height="8" rx="2"/><path d="M7 17c0 1 1 2 1 3M12 17c0 1 1 2 1 3M17 17c0 1 1 2 1 3"/>',
  sofa:'<path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3z"/>',
  bed:'<path d="M3 18V6M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="1.5"/>',
  shower:'<path d="M5 12a7 7 0 0 1 14 0zM12 5V3M8 16v1.5M12 16v2.5M16 16v1.5"/>',
  teddy:'<circle cx="12" cy="13" r="7"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="6.5" r="2.5"/><circle cx="9.5" cy="12" r=".6"/><circle cx="14.5" cy="12" r=".6"/><path d="M10 16a3 3 0 0 0 4 0"/>',
  chart:'<path d="M3 3v18h18"/><path d="M7 14l4-4 4 3 5-7"/>',
  race:'<path d="M5 21V4"/><path d="M5 4h13l-2 4 2 4H5"/><path d="M9 7h2M13 9h2"/>',
  soccer:'<circle cx="12" cy="12" r="9"/><path d="M9 9l3-2 3 2-1 4h-4zM9 9l-3-1M15 9l3-1M10 13l-2 4M14 13l2 4M8 17l-4 1M16 17l4 1"/>',
  tasks:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8l1.5 1.5L12 7M14 9h3M8 15l1.5 1.5L12 14M14 16h3"/>',
  battery:'<rect x="3" y="7" width="17" height="10" rx="2"/><path d="M22 10v4M7 10v4M10 10v4M13 10v4"/>',
  dishwasher:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 8h16M8 5.5h.01M11 5.5h.01"/><circle cx="12" cy="14" r="4"/>',
  washing:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 8h16M8 5.5h.01M11 5.5h.01"/><circle cx="12" cy="14" r="4"/>',
  trash:'<path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 10v7M14 10v7"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  batteryClock:'<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10h2"/><circle cx="17" cy="17" r="4"/><path d="M17 15v2l1.5 1"/>',
  batteryCharge:'<rect x="3" y="6" width="17" height="12" rx="2"/><path d="M20 10h2v4h-2M11 8l-3 5h3l-1 3 4-6h-3z"/>'
};
const ic = (n, s = 18) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[n] || ICONS.plug}</svg>`;

/* ---------- Helfer ---------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dom = id => String(id || '').split('.')[0];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const fmt = (v, d = 1) => v == null || isNaN(v) ? '—' : v.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: d });
const pad = n => String(n).padStart(2, '0');
const fmtDur = ms => { const s = Math.max(0, Math.floor(ms / 1000)); return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s % 3600 / 60))}:${pad(s % 60)}`; };
const HVAC_DE = { heat:'Heizen', cool:'Kühlen', auto:'Auto', off:'Aus', dry:'Entfeuchten', fan_only:'Lüfter', heat_cool:'Auto' };
const PRESET_DE = { boost:'Boost', eco:'Eco', comfort:'Komfort', away:'Abwesend', home:'Zuhause', sleep:'Schlafen', activity:'Aktiv', none:'Normal' };
const safeId = s => String(s).replace(/[^a-z0-9]/gi, '_');

const WEATHER_CONDITIONS_DE = {
  'clear-night': 'Klare Nacht', cloudy: 'Bewölkt', exceptional: 'Besondere Wetterlage', fog: 'Nebelig', hail: 'Hagel',
  lightning: 'Gewitter', 'lightning-rainy': 'Gewitter mit Regen', partlycloudy: 'Teilweise bewölkt', pouring: 'Starker Regen',
  rainy: 'Regen', snowy: 'Schnee', 'snowy-rainy': 'Schneeregen', sunny: 'Sonnig', windy: 'Windig', 'windy-variant': 'Windig'
};
const WEATHER_SYMBOLS = {
  'clear-night': '🌙', cloudy: '☁️', exceptional: '🌡️', fog: '🌫️', hail: '🌨️', lightning: '🌩️',
  'lightning-rainy': '⛈️', partlycloudy: '🌤️', pouring: '🌧️', rainy: '🌧️', snowy: '❄️',
  'snowy-rainy': '🌨️', sunny: '☀️', windy: '💨', 'windy-variant': '💨'
};

function moveItem(arr, idx, dir) {
  const target = idx + dir;
  if (!Array.isArray(arr) || target < 0 || target >= arr.length) return;
  const tmp = arr[idx];
  arr[idx] = arr[target];
  arr[target] = tmp;
}

function getLocksList(secObj = CONFIG.security) {
  const sec = secObj || {};
  if (Array.isArray(sec.locks) && sec.locks.length) return sec.locks.filter(l => l && l.entity);
  if (sec.lock) return [{ name: 'Haustür', entity: sec.lock }];
  return [];
}

function ensureConfigDefaults(cfg) {
  if (!cfg.security) cfg.security = { lock: '', locks: [], windows: [], cameras: [] };
  if (!Array.isArray(cfg.security.locks)) {
    cfg.security.locks = cfg.security.lock ? [{ name: 'Haustür', entity: cfg.security.lock }] : [];
  }
  if (!Array.isArray(cfg.deviceTabs) || !cfg.deviceTabs.length) {
    cfg.deviceTabs = [
      { id: 'geraete', name: 'Geräte' },
      { id: 'covers', name: 'Rolläden' }
    ];
  }
  if (!Array.isArray(cfg.metrics)) cfg.metrics = [];
  if (!Array.isArray(cfg.rooms)) cfg.rooms = [{ name: 'Home', image: '', color: '#2a2370', chips: [] }];
  cfg.rooms.forEach(r => {
    if (!Array.isArray(r.chips)) r.chips = [];
    if (r.showLiveBadge === undefined) r.showLiveBadge = true;
    if (!Array.isArray(r.camButtons)) {
      r.camButtons = (r.webrtc || r.camera)
        ? [{ name: 'Vergrößern', icon: 'expand', stream: '', entity: '' }]
        : [];
    }
  });

  if (!cfg.weather) cfg.weather = {};
  if (cfg.weather.showCard === undefined) cfg.weather.showCard = true;
  if (cfg.weather.title === undefined) cfg.weather.title = 'Wetter';
  if (cfg.weather.label === undefined) cfg.weather.label = 'Zuhause';
  if (cfg.weather.tempUnit === undefined) cfg.weather.tempUnit = '°C';
  if (cfg.weather.showForecast === undefined) cfg.weather.showForecast = false;
  if (!cfg.weather.forecastTitle) cfg.weather.forecastTitle = 'Wettervorhersage · 7 Tage';
  if (!Array.isArray(cfg.weather.items)) {
    cfg.weather.items = [
      { label: 'Luftfeuchtigkeit', entity: '', attr: 'humidity',      unit: '%',    icon: 'drop',   decimals: 0 },
      { label: 'Wind',             entity: '', attr: 'wind_speed',    unit: 'km/h', icon: 'fan',    decimals: 1 },
      { label: 'Luftdruck',        entity: '', attr: 'pressure',      unit: 'hPa',  icon: 'thermo', decimals: 0 },
      { label: 'Niederschlag',     entity: '', attr: 'precipitation', unit: 'mm',   icon: 'drop',   decimals: 1 }
    ];
  }
  return cfg;
}

function getHass() {
  try { const ha = window.parent.document.querySelector('home-assistant'); if (ha && ha.hass) return ha.hass; } catch (e) {}
  return null;
}
let DEMO = !getHass();

/* ---------- Theme, Kiosk-Modus & HA-Seitenleiste Live-Update ---------- */
function applyTheme() {
  const th = CONFIG.theme || {};
  const r = document.documentElement.style;
  if (th.bg) r.setProperty('--bg', th.bg);
  if (th.acc) r.setProperty('--acc', th.acc);
  if (th.acc2) r.setProperty('--acc2', th.acc2);
  if (th.ok) r.setProperty('--ok', th.ok);
  if (th.warn) r.setProperty('--warn', th.warn);
  if (th.cool) r.setProperty('--cool', th.cool);
}

function syncHASidebarDOM(title, icon) {
  try {
    const ha = window.parent.document.querySelector('home-assistant');
    if (ha && ha.hass && ha.hass.panels && ha.hass.panels.smarthome_hub) {
      ha.hass.panels.smarthome_hub.title = title || 'Smart Home Hub';
      ha.hass.panels.smarthome_hub.icon = icon || 'mdi:home-automation';
    }
    const main = ha && ha.shadowRoot && ha.shadowRoot.querySelector('home-assistant-main');
    const drawer = main && main.shadowRoot && main.shadowRoot.querySelector('ha-drawer');
    const sidebar = (drawer && drawer.querySelector('ha-sidebar')) || (main && main.shadowRoot && main.shadowRoot.querySelector('ha-sidebar'));
    if (sidebar && sidebar.shadowRoot) {
      const link = sidebar.shadowRoot.querySelector('a[href="/smarthome_hub"], paper-icon-item[data-panel="smarthome_hub"], ha-md-list-item[href="/smarthome_hub"]');
      if (link) {
        const textEl = link.querySelector('.item-text, span[slot="headline"], span');
        if (textEl) textEl.textContent = title || 'Smart Home Hub';
        const iconEl = link.querySelector('ha-icon');
        if (iconEl && icon) iconEl.setAttribute('icon', icon);
      }
    }
  } catch (e) { console.warn('Sidebar-DOM-Sync:', e); }
}

function applyKioskMode(enable) {
  try {
    const ha = window.parent.document.querySelector('home-assistant');
    const main = ha && ha.shadowRoot && ha.shadowRoot.querySelector('home-assistant-main');
    const drawer = main && main.shadowRoot && main.shadowRoot.querySelector('ha-drawer');
    if (main) {
      if (enable) main.setAttribute('narrow', '');
      else main.removeAttribute('narrow');
    }
    if (drawer && drawer.shadowRoot) {
      const aside = drawer.shadowRoot.querySelector('aside, .mdc-drawer');
      if (aside) aside.style.display = enable ? 'none' : '';
    }
  } catch (e) { console.warn('Kiosk-Steuerung nicht möglich:', e); }
}

/* ---------- PIN-Schutz ---------- */
const pinState = { buffer: '', onSuccess: null, title: '' };

function requirePin(featureKey, actionFn, title = 'PIN erforderlich') {
  const pin = String(CONFIG.pinCode || '').trim();
  const protect = CONFIG.pinProtect || {};
  if (!pin || !protect[featureKey]) { actionFn(); return; }
  pinState.buffer = '';
  pinState.onSuccess = actionFn;
  pinState.title = title;
  renderPinModal();
  document.getElementById('pinmodal').classList.add('show');
}

function renderPinModal() {
  const len = Math.max(4, String(CONFIG.pinCode || '').length);
  const dots = Array.from({ length: len }, (_, i) => `<div class="pin-dot ${i < pinState.buffer.length ? 'filled' : ''}"></div>`).join('');
  const keys = ['1','2','3','4','5','6','7','8','9','C','0','⌫'].map(k => `<button class="pin-key" data-act="pinkey" data-k="${k}">${k}</button>`).join('');
  document.getElementById('pinsheet').innerHTML = `
    <div class="smh"><b>${esc(pinState.title)}</b><button class="x2" data-act="pinClose">✕</button></div>
    <div class="pin-dots">${dots}</div>
    <div class="pin-pad">${keys}</div>`;
}

function handlePinKey(k) {
  const target = String(CONFIG.pinCode || '').trim();
  if (k === 'C') pinState.buffer = '';
  else if (k === '⌫') pinState.buffer = pinState.buffer.slice(0, -1);
  else pinState.buffer += k;
  renderPinModal();
  if (pinState.buffer === target) {
    document.getElementById('pinmodal').classList.remove('show');
    const cb = pinState.onSuccess;
    pinState.onSuccess = null;
    if (cb) cb();
  } else if (pinState.buffer.length >= target.length) {
    toast('Falsche PIN');
    pinState.buffer = '';
    setTimeout(renderPinModal, 250);
  }
}

/* ---------- Konfiguration laden / speichern ---------- */
async function loadConfigFromServer() {
  const h = getHass();
  DEMO = !h;
  if (h && typeof h.callWS === 'function') {
    try {
      const res = await h.callWS({ type: 'smarthome_hub/get_config' });
      if (res && res.config && Object.keys(res.config).length > 0) {
        CONFIG = ensureConfigDefaults(Object.assign(JSON.parse(JSON.stringify(EMPTY_CONFIG)), res.config));
      } else {
        const local = localStorage.getItem('smarthome_hub_backup_cfg');
        if (local) CONFIG = ensureConfigDefaults(Object.assign(JSON.parse(JSON.stringify(EMPTY_CONFIG)), JSON.parse(local)));
      }
    } catch (e) {
      const local = localStorage.getItem('smarthome_hub_backup_cfg');
      if (local) CONFIG = ensureConfigDefaults(Object.assign(JSON.parse(JSON.stringify(EMPTY_CONFIG)), JSON.parse(local)));
    }
    populateEntityDatalist();
  }
  ensureConfigDefaults(CONFIG);
  applyTheme();
  applyKioskMode(!!CONFIG.kioskMode);
  syncHASidebarDOM(CONFIG.sidebarTitle, CONFIG.sidebarIcon);
}

async function saveConfigToServer(newCfg) {
  CONFIG = ensureConfigDefaults(newCfg);
  localStorage.setItem('smarthome_hub_backup_cfg', JSON.stringify(CONFIG));
  applyTheme();
  applyKioskMode(!!CONFIG.kioskMode);
  syncHASidebarDOM(CONFIG.sidebarTitle, CONFIG.sidebarIcon);
  const h = getHass();
  if (h && typeof h.callWS === 'function') {
    try {
      await h.callWS({ type: 'smarthome_hub/save_config', config: CONFIG });
      syncHASidebarDOM(CONFIG.sidebarTitle, CONFIG.sidebarIcon);
      toast('Konfiguration in Home Assistant gespeichert');
    } catch (e) {
      toast('Lokal gespeichert (Backend-Verbindung prüfen)');
    }
  } else {
    toast('Konfiguration im Browser gespeichert (Demo)');
  }
  rebuildEntitiesList();
  refreshSeries();
  refreshWeatherForecast(true);
  refreshHomeCalendars(true);
  tick(true);
}

function populateEntityDatalist() {
  const h = getHass();
  const dl = document.getElementById('ha-entities-list');
  if (!h || !h.states || !dl) return;
  dl.innerHTML = Object.keys(h.states).sort().map(id => {
    const fn = h.states[id].attributes && h.states[id].attributes.friendly_name;
    return `<option value="${esc(id)}">${esc(fn || id)}</option>`;
  }).join('');
}

/* ---------- Auto-Discovery ---------- */
async function autoDiscoverFromHA() {
  const h = getHass();
  if (!h) { toast('Keine Verbindung zu Home Assistant'); return; }
  try {
    const [areas, devices, entities] = await Promise.all([
      h.callWS({ type: 'config/area_registry/list' }),
      h.callWS({ type: 'config/device_registry/list' }),
      h.callWS({ type: 'config/entity_registry/list' })
    ]);
    const devArea = {};
    devices.forEach(d => { if (d.area_id) devArea[d.id] = d.area_id; });

    const newRooms = [{ name: 'Home', image: '', color: '#2a2370', showLiveBadge: true, camButtons: [], chips: [] }];
    const areaMap = {};
    areas.forEach(a => {
      areaMap[a.area_id] = a.name;
      newRooms.push({ name: a.name, image: '', color: '#2a2350', showLiveBadge: true, camButtons: [], chips: [] });
    });

    const newDevs = [];
    const newCovers = [];
    entities.forEach(e => {
      if (e.disabled_by) return;
      const aId = e.area_id || devArea[e.device_id];
      const roomName = areaMap[aId] || 'Home';
      const d = dom(e.entity_id);
      const st = h.states[e.entity_id];
      const name = (st && st.attributes && st.attributes.friendly_name) || e.name || e.entity_id;
      if (['light', 'switch', 'climate', 'media_player', 'fan', 'lawn_mower'].includes(d)) {
        newDevs.push({ name, room: roomName, entity: e.entity_id, tab: 'geraete' });
        if (d === 'climate') {
          const rObj = newRooms.find(r => r.name === roomName);
          if (rObj && !rObj.climate) rObj.climate = e.entity_id;
        }
      } else if (d === 'cover') {
        newCovers.push({ name, entity: e.entity_id });
      }
    });

    cfgDraft.rooms = newRooms;
    cfgDraft.devices = newDevs.slice(0, 60);
    cfgDraft.covers = newCovers;
    renderCfgModal(true);
    toast(`${newRooms.length} Räume & ${newDevs.length} Geräte erkannt!`);
  } catch (e) {
    toast('Fehler beim Auto-Import: ' + e.message);
  }
}

/* ---------- Demo-Status & HA-Zugriff ---------- */
function demoState(id) {
  const d = dom(id), n = id.toLowerCase();
  const code = [...id].reduce((a, c) => a + c.charCodeAt(0), 0);
  let state = 'on', attributes = { friendly_name: id };
  if (d === 'sensor') {
    if (/temp/.test(n)) state = '22.4';
    else if (/feucht|humid/.test(n)) state = '45';
    else if (/percent|ladestand/.test(n)) state = '65';
    else if (/kwh|energie|energy|verbrauch_heute/.test(n)) state = '12.4';
    else if (/wasser|water/.test(n)) state = '180';
    else if (/leist|power|watt|verbrauch/.test(n)) state = String(Math.round(530 + Math.sin(Date.now() / 60000) * 150));
    else state = 'Gut';
  } else if (d === 'climate') {
    state = /klimaanlage/.test(n) ? 'off' : 'heat';
    attributes = { current_temperature: 21.8, temperature: 21.5, target_temp_step: 0.5, min_temp: 5, max_temp: 30, hvac_modes: ['heat','cool','auto','off'], hvac_action: 'heating', preset_modes: ['none','boost'], preset_mode: 'none', fan_modes: ['auto','low','medium','high'], fan_mode: 'auto' };
  } else if (d === 'binary_sensor') state = 'off';
  else if (d === 'lock') state = 'locked';
  else if (d === 'camera') state = 'idle';
  else if (d === 'weather') { state = 'partlycloudy'; attributes = { friendly_name: id, temperature: 16.8, temperature_unit: '°C', humidity: 68, humidity_unit: '%', pressure: 1015, pressure_unit: 'hPa', wind_speed: 12, wind_speed_unit: 'km/h', precipitation: 0, precipitation_unit: 'mm' }; }
  else if (d === 'cover') { state = code % 2 ? 'open' : 'closed'; attributes = { current_position: code % 2 ? 100 : 0 }; }
  else state = code % 3 ? 'on' : 'off';
  return { state, attributes, last_changed: new Date(Date.now() - (code % 5 + 1) * 3600e3).toISOString() };
}
function S(id) {
  if (!id) return undefined;
  if (DEMO) return demoState(id);
  const h = getHass();
  return h && h.states[id];
}
const num = id => { const s = S(id); const v = parseFloat(s && s.state); return isNaN(v) ? null : v; };

function call(domain, service, data, refresh = true) {
  if (DEMO) { toast(`Demo: ${domain}.${service}`); return; }
  const h = getHass();
  if (h) h.callService(domain, service, data);
  if (refresh) setTimeout(() => tick(true), 500);
}
function navigate(path) {
  try { window.parent.history.pushState(null, '', path); window.parent.dispatchEvent(new CustomEvent('location-changed')); }
  catch (e) { window.open(path, '_blank'); }
}
let toastT;
function toast(msg) {
  const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ---------- UI-Zustand ---------- */
const coverDrag = { active: false, el: null, entity: null, pointerId: null, lastSentAt: 0, lastSentPos: null };
const ui = {
  room: 0,
  view: localStorage.getItem('hub_view') || 'dashboard',
  showAll: false,
  unlockArmedEntity: null,
  unlockArmedUntil: 0,
  seriesVer: 0
};
const series = {};
const yesterdayMetricVals = {};

/* ---------- Wettervorhersage-State (Täglich & Stündlich für Popup) ---------- */
const weatherForecastState = {
  loading: false, loadedAt: 0, entity: '',
  days: [], hourly: [], error: '',
  tab: 'temp', selectedDay: 0
};

async function refreshWeatherForecast(force = false) {
  const wCfg = CONFIG.weather || {};
  const fcEntity = (wCfg.forecastEntity || wCfg.entity || '').trim();
  if (!fcEntity) return;
  if (!force && weatherForecastState.entity === fcEntity && weatherForecastState.loadedAt && Date.now() - weatherForecastState.loadedAt < 15 * 60 * 1000) return;

  if (DEMO) {
    const conds = ['rainy', 'rainy', 'cloudy', 'partlycloudy', 'partlycloudy', 'sunny', 'partlycloudy', 'partlycloudy'];
    const now = new Date();
    weatherForecastState.days = Array.from({ length: 8 }, (_, i) => {
      const d = new Date(now.getTime() + i * 86400000);
      return {
        datetime: d.toISOString(),
        condition: conds[i % conds.length],
        temperature: [12, 14, 13, 19, 14, 15, 14, 13][i],
        templow: [8, 9, 8, 8, 6, 5, 4, 4][i],
        precipitation_probability: [68, 75, 25, 15, 40, 10, 15, 20][i],
        precipitation: [1.7, 9.1, 0.1, 0, 1.2, 0, 0, 0][i],
        wind_speed: [18, 24, 15, 12, 20, 14, 11, 13][i],
        wind_bearing: [210, 225, 190, 180, 240, 90, 85, 110][i]
      };
    });
    weatherForecastState.hourly = Array.from({ length: 8 * 24 }, (_, idx) => {
      const t = new Date(now.getTime() + idx * 3600000);
      const hr = t.getHours();
      return {
        datetime: t.toISOString(),
        condition: conds[Math.floor(idx / 24) % conds.length],
        temperature: Math.round(10 + Math.sin((hr - 6) / 24 * Math.PI * 2) * 4),
        precipitation_probability: Math.round(clamp(35 + Math.sin(idx / 4) * 35, 0, 100)),
        precipitation: Math.max(0, +(Math.sin(idx / 5) * 1.2).toFixed(1)),
        wind_speed: Math.round(14 + Math.sin(idx / 3) * 12),
        wind_bearing: (180 + idx * 15) % 360
      };
    });
    weatherForecastState.entity = fcEntity;
    weatherForecastState.error = '';
    weatherForecastState.loadedAt = Date.now();
    return;
  }

  const h = getHass();
  if (!h || weatherForecastState.loading) return;
  weatherForecastState.loading = true;
  weatherForecastState.error = '';

  const fetchType = async (fType) => {
    if (typeof h.callWS === 'function') {
      try {
        const res = await h.callWS({
          type: 'call_service',
          domain: 'weather',
          service: 'get_forecasts',
          service_data: { type: fType },
          target: { entity_id: fcEntity },
          return_response: true
        });
        const resp = (res && res.response) || res || {};
        const entData = resp[fcEntity] || Object.values(resp)[0];
        if (entData && Array.isArray(entData.forecast) && entData.forecast.length) return entData.forecast;
      } catch (_) {}
    }
    if (typeof h.callApi === 'function') {
      try {
        const res = await h.callApi('POST', 'services/weather/get_forecasts?return_response', { entity_id: fcEntity, type: fType });
        const resp = (res && res.service_response) || res || {};
        const entData = resp[fcEntity] || Object.values(resp)[0];
        if (entData && Array.isArray(entData.forecast) && entData.forecast.length) return entData.forecast;
      } catch (_) {}
    }
    return [];
  };

  try {
    let [dailyList, hourlyList] = await Promise.all([fetchType('daily'), fetchType('hourly')]);
    if (!dailyList.length) dailyList = await fetchType('twice_daily');
    if (!dailyList.length) {
      const st = S(fcEntity);
      if (st && st.attributes && Array.isArray(st.attributes.forecast)) dailyList = st.attributes.forecast;
    }

    // Falls nur stündliche Daten existieren, Tageswerte daraus berechnen
    if (!dailyList.length && hourlyList.length) {
      const byDay = new Map();
      hourlyList.forEach(item => {
        const dayKey = String(item.datetime || '').slice(0, 10);
        if (!dayKey) return;
        if (!byDay.has(dayKey)) {
          byDay.set(dayKey, { ...item, templow: item.templow ?? item.temperature });
        } else {
          const cur = byDay.get(dayKey);
          if (item.temperature != null) {
            cur.temperature = Math.max(cur.temperature ?? item.temperature, item.temperature);
            cur.templow = Math.min(cur.templow ?? item.temperature, item.templow ?? item.temperature);
          }
          if (item.precipitation != null) cur.precipitation = (cur.precipitation || 0) + Number(item.precipitation || 0);
          if (item.precipitation_probability != null) cur.precipitation_probability = Math.max(cur.precipitation_probability || 0, item.precipitation_probability);
          if (item.wind_speed != null) cur.wind_speed = Math.max(cur.wind_speed || 0, item.wind_speed);
        }
      });
      dailyList = Array.from(byDay.values());
    }

    weatherForecastState.days = dailyList.slice(0, 8);
    weatherForecastState.hourly = hourlyList;
    weatherForecastState.entity = fcEntity;
    weatherForecastState.loadedAt = Date.now();
    if (weatherForecastState.selectedDay >= weatherForecastState.days.length) weatherForecastState.selectedDay = 0;
  } catch (err) {
    weatherForecastState.error = `Vorhersage nicht abrufbar (${fcEntity}).`;
    weatherForecastState.loadedAt = Date.now();
  } finally {
    weatherForecastState.loading = false;
    if (sm.open && sm.mode === 'weather') renderWeatherModal();
    tick(true);
  }
}

/* Baut 8 Zeitpunkte (3-Stunden-Raster) für den ausgewählten Tag im Popup */
function getSlotsForSelectedDay() {
  const days = weatherForecastState.days || [];
  const selDay = days[weatherForecastState.selectedDay] || days[0];
  if (!selDay) return [];

  const targetDateStr = String(selDay.datetime || '').slice(0, 10);
  const hourly = weatherForecastState.hourly || [];

  let dayHours = hourly.filter(h => String(h.datetime || '').slice(0, 10) === targetDateStr);
  if (weatherForecastState.selectedDay === 0 && dayHours.length < 6 && hourly.length >= 8) {
    dayHours = hourly.slice(0, 24);
  }

  if (dayHours.length >= 4) {
    const out = [];
    const step = Math.max(1, Math.floor(dayHours.length / 8));
    for (let i = 0; i < dayHours.length && out.length < 8; i += step) {
      const it = dayHours[i];
      const dt = new Date(it.datetime);
      out.push({
        time: `${pad(dt.getHours())}:00`,
        temp: Math.round(Number(it.temperature ?? selDay.temperature ?? 15)),
        rainPct: it.precipitation_probability != null
          ? Math.round(Number(it.precipitation_probability))
          : (it.precipitation != null ? Math.min(100, Math.round(Number(it.precipitation) * 25)) : 0),
        rainMm: Number(it.precipitation ?? 0),
        wind: Math.round(Number(it.wind_speed ?? selDay.wind_speed ?? 10)),
        bearing: Number(it.wind_bearing ?? selDay.wind_bearing ?? 200),
        condition: it.condition || selDay.condition
      });
    }
    return out;
  }

  // Fallback: Aus Tages-Min/Max eine realistische Tageskurve (8 Zeitpunkte) generieren
  const tMax = Number(selDay.temperature ?? 16);
  const tMin = Number(selDay.templow ?? (tMax - 6));
  const baseRainPct = selDay.precipitation_probability != null
    ? Number(selDay.precipitation_probability)
    : (selDay.precipitation ? Math.min(95, Math.round(Number(selDay.precipitation) * 20)) : 10);
  const baseWind = Number(selDay.wind_speed ?? 14);
  const baseBear = Number(selDay.wind_bearing ?? 215);
  const hours = ['01:00', '04:00', '07:00', '10:00', '13:00', '16:00', '19:00', '22:00'];
  const curve = [0.15, 0.0, 0.25, 0.65, 0.95, 1.0, 0.65, 0.3];

  return hours.map((hStr, i) => ({
    time: hStr,
    temp: Math.round(tMin + (tMax - tMin) * curve[i]),
    rainPct: Math.round(clamp(baseRainPct * (0.6 + Math.sin(i) * 0.4), 0, 100)),
    rainMm: +(Number(selDay.precipitation || 0) / 8).toFixed(1),
    wind: Math.round(baseWind * (0.75 + curve[i] * 0.4)),
    bearing: (baseBear + (i - 3) * 10 + 360) % 360,
    condition: selDay.condition
  }));
}

function renderWeatherChartSVG(slots, tab) {
  if (!slots.length) return '<div class="mut sm" style="padding:30px 0;text-align:center">Keine Verlaufsdaten verfügbar</div>';
  const W = 680, H = 140, padL = 32, padR = 32, padT = 28, padB = 28;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const X = i => padL + (i * plotW / Math.max(1, slots.length - 1));

  if (tab === 'temp') {
    const temps = slots.map(s => s.temp);
    const minT = Math.min(...temps) - 2, maxT = Math.max(...temps) + 2;
    const Y = v => padT + plotH * (1 - (v - minT) / Math.max(1, maxT - minT));
    const pts = slots.map((s, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(s.temp).toFixed(1)}`).join(' ');
    const area = `${pts} L${X(slots.length - 1).toFixed(1)},${H - padB} L${X(0).toFixed(1)},${H - padB} Z`;
    const labels = slots.map((s, i) => `
      <text x="${X(i).toFixed(1)}" y="${(Y(s.temp) - 10).toFixed(1)}" text-anchor="middle" fill="#f2f3fa" font-size="12" font-weight="700">${s.temp}</text>
      <text x="${X(i).toFixed(1)}" y="${H - 6}" text-anchor="middle" fill="#8b8fa8" font-size="11">${s.time}</text>`).join('');
    return `<div class="wfc-chart-wrap"><svg viewBox="0 0 ${W} ${H}">
      <defs><linearGradient id="wfcTempG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f59e0b" stop-opacity=".38"/><stop offset="1" stop-color="#f59e0b" stop-opacity=".03"/></linearGradient></defs>
      <path d="${area}" fill="url(#wfcTempG)"/>
      <path d="${pts}" fill="none" stroke="#facc15" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      ${labels}
    </svg></div>`;
  }

  if (tab === 'rain') {
    const colW = plotW / slots.length;
    const bars = slots.map((s, i) => {
      const pct = clamp(s.rainPct, 0, 100);
      const bh = Math.max(3, (pct / 100) * plotH);
      const x0 = padL + i * colW;
      const y0 = padT + (plotH - bh);
      const cx = x0 + colW / 2;
      return `
        <rect x="${(x0 + 2).toFixed(1)}" y="${y0.toFixed(1)}" width="${(colW - 4).toFixed(1)}" height="${bh.toFixed(1)}" fill="rgba(56,189,248,.18)"/>
        <line x1="${(x0 + 2).toFixed(1)}" x2="${(x0 + colW - 2).toFixed(1)}" y1="${y0.toFixed(1)}" y2="${y0.toFixed(1)}" stroke="#38bdf8" stroke-width="2.5"/>
        <text x="${cx.toFixed(1)}" y="${padT - 8}" text-anchor="middle" fill="#7dd3fc" font-size="11" font-weight="700">${pct}%</text>
        <text x="${cx.toFixed(1)}" y="${H - 6}" text-anchor="middle" fill="#8b8fa8" font-size="11">${s.time}</text>`;
    }).join('');
    return `<div class="wfc-chart-wrap"><svg viewBox="0 0 ${W} ${H}">${bars}</svg></div>`;
  }

  // Wind-Ansicht mit Richtungspfeilen
  const cols = slots.map(s => `
    <div class="wfc-wind-col">
      <div class="wfc-wind-val">${s.wind} km/h</div>
      <div class="wfc-wind-arr" style="transform:rotate(${(s.bearing + 180) % 360}deg)" title="Windrichtung ${Math.round(s.bearing)}°">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
      </div>
      <div class="wfc-wind-time">${s.time}</div>
    </div>`).join('');
  return `<div class="wfc-wind-grid">${cols}</div>`;
}

function renderWeatherModal() {
  const wCfg = CONFIG.weather || {};
  const fcEntity = (wCfg.forecastEntity || wCfg.entity || '').trim();
  const s = fcEntity ? S(fcEntity) : null;
  const a = (s && s.attributes) || {};

  const days = weatherForecastState.days || [];
  const selIdx = clamp(weatherForecastState.selectedDay, 0, Math.max(0, days.length - 1));
  const selDay = days[selIdx] || {};
  const slots = getSlotsForSelectedDay();

  // Aktuelle bzw. ausgewählte Kopfwerte
  let topTemp = selIdx === 0 && wCfg.tempEntity && num(wCfg.tempEntity) != null
    ? num(wCfg.tempEntity)
    : (selIdx === 0 && a.temperature != null ? Number(a.temperature) : Number(selDay.temperature ?? 15));
  const topCond = selDay.condition || (s && s.state) || 'partlycloudy';
  const topSym = WEATHER_SYMBOLS[topCond] || '🌤️';
  const topCondText = WEATHER_CONDITIONS_DE[topCond] || topCond;

  const rainProb = selDay.precipitation_probability != null
    ? `${fmt(Number(selDay.precipitation_probability), 0)}%`
    : (selDay.precipitation != null ? `${fmt(Number(selDay.precipitation), 1)} mm` : '0%');
  const humid = selIdx === 0 && a.humidity != null ? `${fmt(Number(a.humidity), 0)}%` : (selDay.humidity != null ? `${fmt(Number(selDay.humidity), 0)}%` : '—');
  const windVal = selDay.wind_speed != null ? `${fmt(Number(selDay.wind_speed), 0)} ${a.wind_speed_unit || 'km/h'}` : (a.wind_speed != null ? `${fmt(Number(a.wind_speed), 0)} km/h` : '—');

  const dtObj = selDay.datetime ? new Date(selDay.datetime) : new Date();
  const dayLong = selIdx === 0
    ? dtObj.toLocaleDateString('de-DE', { weekday: 'long' }) + ', ' + new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    : dtObj.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit' });

  const daysStrip = days.slice(0, 8).map((d, i) => {
    const dt = d.datetime ? new Date(d.datetime) : new Date(Date.now() + i * 86400000);
    const shortDay = dt.toLocaleDateString('de-DE', { weekday: 'short' });
    const sym = WEATHER_SYMBOLS[d.condition] || '🌤️';
    const hi = d.temperature != null ? `${fmt(Number(d.temperature), 0)}°` : '—';
    const lo = d.templow != null ? `<span>${fmt(Number(d.templow), 0)}°</span>` : '';
    return `<button class="wfc-day ${i === selIdx ? 'on' : ''}" data-act="wfcDay" data-i="${i}">
      <div class="wfc-day-name">${esc(shortDay)}</div>
      <div class="wfc-day-ico">${sym}</div>
      <div class="wfc-day-t">${hi}${lo}</div>
    </button>`;
  }).join('');

  const sheet = document.getElementById('smsheet');
  sheet.classList.add('wfc-wide');
  sheet.innerHTML = `
    <div class="smh" style="margin-bottom:10px">
      <b>${esc(wCfg.forecastTitle || 'Wettervorhersage')}</b>
      <button class="x2" data-act="smClose">✕</button>
    </div>
    <div class="wfc-top">
      <div class="wfc-top-left">
        <div class="wfc-big-ico">${topSym}</div>
        <div class="wfc-big-temp">${fmt(topTemp, 0)}<sup>${esc(wCfg.tempUnit || '°C')}</sup></div>
        <div class="wfc-meta">
          <span>Niederschlag: ${esc(rainProb)}</span>
          <span>Luftfeuchte: ${esc(humid)}</span>
          <span>Wind: ${esc(windVal)}</span>
        </div>
      </div>
      <div class="wfc-top-right">
        <h3>${esc(wCfg.title || 'Wetter')}${wCfg.label ? ' · ' + esc(wCfg.label) : ''}</h3>
        <div>${esc(dayLong)}</div>
        <div>${esc(topCondText)}</div>
      </div>
    </div>
    <div class="wfc-tabs">
      <button class="wfc-tab ${weatherForecastState.tab === 'temp' ? 'on' : ''}" data-act="wfcTab" data-tab="temp">Temperatur</button>
      <button class="wfc-tab ${weatherForecastState.tab === 'rain' ? 'on' : ''}" data-act="wfcTab" data-tab="rain">Niederschlag</button>
      <button class="wfc-tab ${weatherForecastState.tab === 'wind' ? 'on' : ''}" data-act="wfcTab" data-tab="wind">Wind</button>
    </div>
    ${renderWeatherChartSVG(slots, weatherForecastState.tab)}
    <div class="wfc-days">${daysStrip || '<div class="mut sm">Lade Vorhersagedaten…</div>'}</div>`;
}

function openWeatherModal() {
  sm.mode = 'weather';
  sm.open = true;
  refreshWeatherForecast();
  renderWeatherModal();
  document.getElementById('sm').classList.add('show');
}

/* ---------- Verlaufsdaten ---------- */
async function loadSeries(id, mode, hours, attr, offsetDays = 0) {
  if (!id) return null;
  const realNow = new Date();
  const now = new Date(realNow.getTime() - (offsetDays * 86400000));
  const start = new Date(now);
  if (hours) { start.setTime(now.getTime() - hours * 3600e3); start.setMinutes(0, 0, 0); }
  else { start.setHours(0, 0, 0, 0); }
  const n = hours ? hours + 1 : realNow.getHours() + 1;

  if (DEMO) {
    let v = 5;
    return Array.from({ length: n }, (_, i) => hours ? 21 + Math.sin((i + offsetDays * 10) / 3) * 1.5 : mode === 'last' ? (v += 8) : 300 + Math.sin(i / 2) * 180);
  }
  const h = getHass(); if (!h) return null;
  const url = `history/period/${start.toISOString()}?filter_entity_id=${id}&end_time=${encodeURIComponent(now.toISOString())}${attr ? '' : '&minimal_response&no_attributes'}`;
  const res = await h.callApi('GET', url);
  const arr = (res && res[0]) || [];
  const pts = arr.map(p => ({
    t: new Date(p.last_changed || p.last_updated).getTime(),
    v: parseFloat(attr ? (p.attributes && p.attributes[attr]) : p.state)
  })).filter(p => !isNaN(p.v));
  if (!pts.length) return null;
  const out = []; let prev = null;
  for (let i = 0; i < n; i++) {
    const a = start.getTime() + i * 3600e3, b = a + 3600e3;
    const inB = pts.filter(p => p.t >= a && p.t < b);
    const before = pts.filter(p => p.t < a).pop();
    if (before) prev = before.v;
    let val = prev;
    if (inB.length) val = mode === 'last' ? inB[inB.length - 1].v : inB.reduce((s, p) => s + p.v, 0) / inB.length;
    if (val != null) prev = val;
    out.push(val);
  }
  return out;
}

async function loadYesterdayMetric(m) {
  if (m.yesterdayEntity) {
    const val = num(m.yesterdayEntity);
    if (val != null) return val;
  }
  if (DEMO) return m.id === 'energy' ? 13.48 : 171.4;
  const h = getHass(); if (!h || !m.entity) return null;
  const end = new Date(Date.now() - 24 * 3600e3);
  const start = new Date(end.getTime() - 24 * 3600e3);
  const url = `history/period/${start.toISOString()}?filter_entity_id=${m.entity}&end_time=${encodeURIComponent(end.toISOString())}&minimal_response&no_attributes`;
  const res = await h.callApi('GET', url);
  const arr = (res && res[0]) || [];
  const pts = arr.map(p => parseFloat(p.state)).filter(v => Number.isFinite(v));
  return pts.length ? pts[pts.length - 1] : null;
}

async function refreshSeries() {
  for (const m of CONFIG.metrics || []) {
    if (m.chart) {
      try {
        series[m.chart] = await loadSeries(m.chart, m.mode || 'avg');
        series[m.chart + '_yest'] = await loadSeries(m.chart, m.mode || 'avg', 0, null, 1);
      } catch (e) {}
    }
    if (m.subButtons) {
      for (const btn of m.subButtons) {
        for (const ent of btn.entities || []) {
          if (ent.chart && ent.entity) {
            try { series['sub:' + ent.entity] = await loadSeries(ent.entity, 'avg'); } catch (e) {}
          }
        }
      }
    }
    try { yesterdayMetricVals[m.id] = await loadYesterdayMetric(m); } catch (e) {}
  }
  for (const r of CONFIG.climateRooms || []) for (const c of r.charts || []) {
    const key = '24:' + c.entity + (c.attr ? ':' + c.attr : '');
    try { series[key] = await loadSeries(c.entity, 'avg', 24, c.attr); } catch (e) {}
  }
  await refreshCustomPageSeries(false);
  ui.seriesVer++;
  tick(true);
}

async function refreshCustomPageSeries(redraw = true) {
  const statWidgets = (CONFIG.customPages || []).flatMap(p => p.widgets || []).filter(w => w.type === 'stat_group');
  const statItems = statWidgets.flatMap(w => w.items || []);
  await Promise.all(statItems.map(async item => {
    if (!item.entity) return;
    const key = 'stats:' + item.entity + (item.attr ? ':' + item.attr : '');
    try { series[key] = await loadSeries(item.entity, item.mode || 'avg', 24, item.attr); } catch (e) {}
  }));
  if (redraw) { ui.seriesVer++; tick(true); }
}

/* ---------- Geräte-Status ---------- */
function devInfo(d) {
  const s = S(d.entity), dm = dom(d.entity), st = s ? s.state : 'unavailable';
  let on = false, label = 'Aus', cls = 'off';
  if (!s || st === 'unavailable' || st === 'unknown') { label = 'Nicht verfügbar'; }
  else if (dm === 'climate') {
    if (st !== 'off') {
      on = true; const a = s.attributes.hvac_action;
      if (a === 'heating') { label = 'Heizt'; cls = 'warn'; }
      else if (a === 'cooling') { label = 'Kühlt'; cls = 'cool'; }
      else if (a === 'idle' || a === 'off') { label = 'Standby'; cls = 'idle'; }
      else { label = 'An'; cls = 'on'; }
    }
  }
  else if (dm === 'cover') { on = st !== 'closed'; label = st === 'opening' ? 'Öffnet' : st === 'closing' ? 'Schließt' : on ? 'Offen' : 'Geschlossen'; cls = on ? 'on' : 'off'; }
  else if (dm === 'lawn_mower') { on = st === 'mowing'; label = ({ mowing:'Mäht', docked:'Station', paused:'Pause', returning:'Rückfahrt', error:'Fehler' })[st] || st; cls = on ? 'on' : st === 'error' ? 'warn' : 'off'; }
  else if (dm === 'lock') { on = st === 'unlocked'; label = on ? 'Offen' : 'Verriegelt'; cls = on ? 'warn' : 'on'; }
  else if (dm === 'camera') { on = st !== 'off'; label = on ? 'Aktiv' : 'Aus'; cls = on ? 'on' : 'off'; }
  else if (dm === 'media_player') {
    if (st === 'standby') { label = 'Standby'; cls = 'idle'; }
    else if (st !== 'off') { on = true; label = st === 'playing' ? 'Spielt' : 'An'; cls = 'on'; }
  }
  else { on = st === 'on' || st === 'open'; label = on ? 'An' : 'Aus'; cls = on ? 'on' : 'off'; }
  return { s, on, label, cls, st };
}
function devIcon(d) {
  if (d.icon && ICONS[d.icon]) return d.icon;
  return ({ light:'bulb', climate:'thermo', media_player:'tv', camera:'camera', switch:'plug', cover:'blinds', lawn_mower:'mower', fan:'fan', lock:'lock' })[dom(d.entity)] || 'plug';
}
function toggleDevice(e) {
  const dm = dom(e), st = (S(e) || {}).state, info = devInfo((CONFIG.devices || []).find(x => x.entity === e) || { entity: e });
  if (dm === 'camera') return;
  if (dm === 'cover') call('cover', 'toggle', { entity_id: e });
  else if (dm === 'climate') call('climate', info.on ? 'turn_off' : 'turn_on', { entity_id: e });
  else if (dm === 'lawn_mower') call('lawn_mower', st === 'mowing' ? 'dock' : 'start_mowing', { entity_id: e });
  else if (dm === 'lock') {
    if (st === 'locked') requirePin('doorUnlock', () => call('lock', 'unlock', { entity_id: e }), 'Türschloss entriegeln');
    else call('lock', 'lock', { entity_id: e });
  }
  else call('homeassistant', 'toggle', { entity_id: e });
}

/* ---------- Render-Komponenten ---------- */
function rightTopStatus() {
  const sec = CONFIG.security || {}, problems = [];
  const locks = getLocksList(sec);
  locks.forEach(l => {
    const lk = S(l.entity);
    if (lk && lk.state !== 'locked') problems.push(`${l.name || 'Tür'} entriegelt`);
  });
  const openW = (sec.windows || []).filter(w => { const s = S(w); return s && s.state === 'on'; }).length;
  if (openW) problems.push(`${openW} Fenster offen`);

  const lockPills = locks.map(l => {
    const lk = S(l.entity);
    const locked = !lk || lk.state === 'locked';
    const armed = ui.unlockArmedEntity === l.entity && ui.unlockArmedUntil > Date.now();
    return `<div class="lockpill" title="${esc(l.name)}">
      ${locks.length > 1 ? `<span class="mut sm" style="padding:0 6px">${esc(l.name)}</span>` : ''}
      <button class="${locked ? 'on' : ''}" data-act="lockEntity" data-e="${esc(l.entity)}" title="${esc(l.name)} verriegeln">${ic('lock')}</button>
      <span class="dots">›››</span>
      <button class="${!locked ? 'open' : ''} ${armed ? 'armed' : ''}" data-act="unlockEntity" data-e="${esc(l.entity)}" data-name="${esc(l.name)}" title="${esc(l.name)} entriegeln">${ic('unlock')}</button>
    </div>`;
  }).join('');

  return `<div class="stat">
    <div class="t"><b class="${problems.length ? 'warn' : 'ok'}">${problems.length ? 'Achtung' : 'Zuhause ist gesichert'}</b><span class="mut sm">${problems.length ? esc(problems.join(' · ')) : 'Alle Systeme normal'}</span></div>
    ${lockPills}
  </div>`;
}

function heroOverlayContent() {
  const now = new Date();
  const dtOpts = { timeZone: CONFIG.dateTimeTimeZone || 'Europe/Berlin' };
  const dateText = now.toLocaleDateString(CONFIG.dateTimeLocale || 'de-DE', { ...dtOpts, weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  const timeText = now.toLocaleTimeString(CONFIG.dateTimeLocale || 'de-DE', { ...dtOpts, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const hour = Number(now.toLocaleString('en-US', { ...dtOpts, hour: '2-digit', hourCycle: 'h23' }));
  const greet = hour < 5 ? 'Gute Nacht' : hour < 11 ? 'Guten Morgen' : hour < 17 ? 'Guten Tag' : 'Guten Abend';
  const hs = getHass();
  const name = CONFIG.userName || (hs && hs.user && hs.user.name ? hs.user.name.split(' ')[0] : 'Gast');

  const gs = CONFIG.greetingEntity ? S(CONFIG.greetingEntity) : null;
  const ign = (CONFIG.greetingIgnore || []).map(x => String(x).toLowerCase());
  const attrText = gs && gs.attributes && typeof gs.attributes.text === 'string' ? gs.attributes.text.trim() : '';
  const stateText = gs && gs.state ? String(gs.state).trim() : '';
  const invalid = ['unknown', 'unavailable', 'none', ''];
  const validAttrText = attrText && !invalid.includes(attrText.toLowerCase()) && !ign.includes(attrText.toLowerCase());
  const validStateText = stateText && !invalid.includes(stateText.toLowerCase()) && !ign.includes(stateText.toLowerCase());
  const gtxt = validAttrText ? attrText : validStateText ? stateText : 'Das passiert gerade bei dir zuhause.';

  const rooms = CONFIG.rooms && CONFIG.rooms.length ? CONFIG.rooms : [{ name: 'Home', chips: [] }];
  const r = rooms[ui.room] || rooms[0];
  const showHomeBadges = ui.view === 'dashboard' && ui.room === 0;
  const chips = (r.chips || []).filter(c => c && c.entity).map(c => {
    const s = S(c.entity);
    const rawVal = s ? (c.attr ? (s.attributes && s.attributes[c.attr]) : s.state) : undefined;
    const n = rawVal != null ? parseFloat(rawVal) : NaN;
    const txt = !s || rawVal == null ? '—' : isNaN(n) ? esc(rawVal) : `${fmt(n, c.decimals ?? 1)} ${esc(c.unit || '')}`;
    let cls = c.cls || '';
    if (cls === 'battery') cls = isNaN(n) ? '' : n <= 20 ? 'red' : n <= 40 ? 'amber' : 'green';
    return `<span class="chip ${esc(cls)}">${ic(c.icon || 'plug', 14)}${txt}</span>`;
  }).join('');
  const pills = rooms.map((x, i) => `<button class="pill ${i === ui.room ? 'on' : ''}" data-act="room" data-i="${i}">${esc(x.name)}</button>`).join('');

  const hasWebRtc = !!r.webrtc && !!CONFIG.go2rtcHost && !DEMO;
  const hasCam = !hasWebRtc && !!r.camera && !DEMO && !!S(r.camera);
  const isBgLiveStream = hasWebRtc || hasCam;
  const showLive = isBgLiveStream && r.showLiveBadge !== false;

  const camBtns = (r.camButtons || []).map(b => {
    const btnIcon = b.icon || 'expand';
    const btnName = b.name != null ? String(b.name).trim() : '';
    const stream = b.stream || '';
    const entity = b.entity || '';
    return `<button class="expand" data-act="camBig" data-webrtc="${esc(stream)}" data-cam="${esc(entity)}" data-title="${esc(btnName)}">${ic(btnIcon, 14)}${btnName ? esc(btnName) : ''}</button>`;
  }).join('');

  return `<div class="hero-top">
      <div class="hi">${greet},</div>
      <div class="name-row"><div class="name">${esc(name)} 👋</div></div>
      <div class="greet">${esc(gtxt)}</div>
      ${showHomeBadges ? homeHeaderBadges() : ''}
      ${CONFIG.showDateTime ? `<div class="datetime"><span id="hub-date">${esc(dateText)}</span><span class="sep">•</span><span><span id="hub-time">${esc(timeText)}</span> Uhr</span></div>` : ''}
    </div>
    <div class="hero-bottom">
      <div class="pills">${pills}</div>
      <h2>${esc(r.name)}</h2>
      <div class="hero-bar">
        <div class="chips">${chips}</div>
        ${(showLive || camBtns) ? `<div class="camtools">${showLive ? '<span class="live">● LIVE</span>' : ''}${camBtns}</div>` : ''}
      </div>
    </div>`;
}

function devicesCard(customFilterRoom = null, customTitle = 'Geräteübersicht', tabFilter = 'geraete') {
  const rooms = CONFIG.rooms && CONFIG.rooms.length ? CONFIG.rooms : [{ name: 'Home' }];
  const r = rooms[ui.room] || rooms[0];
  const targetRoom = customFilterRoom !== null ? customFilterRoom : r.name;
  const list = (CONFIG.devices || []).filter(d => {
    const dTab = d.tab || 'geraete';
    if (tabFilter && dTab !== tabFilter) return false;
    return (customFilterRoom === '' || ui.showAll) ? true : d.room === targetRoom;
  });
  if (tabFilter !== 'geraete' && !list.length) return '';
  const infos = list.map(d => ({ d, i: devInfo(d) }));
  const active = infos.filter(x => x.i.on).length;
  const today = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
  const rows = infos.map(({ d, i }) => {
    const p = d.power ? num(d.power) : null, e = d.energy ? num(d.energy) : null;
    const since = i.on && i.s && i.s.last_changed ? Date.parse(i.s.last_changed) : 0;
    const canToggle = dom(d.entity) !== 'camera' && i.s && i.st !== 'unavailable';
    return `<div class="tr">
      <div class="dv"><div class="dvi ${i.on ? 'on' : ''}">${ic(devIcon(d), 17)}</div><div style="min-width:0"><b>${esc(d.name)}</b><small>${esc(d.room || '')}</small></div></div>
      <div class="st ${i.cls}"><i></i>${esc(i.label)}</div>
      <div>${p == null ? '—' : fmt(p, 0) + ' W'}</div>
      <div>${since ? `<span class="rt" data-since="${since}">${fmtDur(Date.now() - since)}</span>` : '—'}</div>
      <div>${e == null ? '—' : fmt(e, 1) + ' kWh'}</div>
      <div class="sw ${i.on ? 'on' : ''} ${canToggle ? '' : 'dis'}" data-act="dev" data-e="${esc(d.entity)}"><i></i></div></div>`;
  }).join('');
  return `<section class="card"><div class="ch"><div><b>${esc(customTitle)}</b> <span class="mut sm" style="color:var(--acc2)">&nbsp;${active} aktiv</span></div>
    <div style="display:flex;gap:8px">${customFilterRoom === null && tabFilter === 'geraete' ? `<button class="iconbtn ${ui.showAll ? 'on' : ''}" data-act="all">${ic('filter', 14)}${ui.showAll ? 'Alle Räume' : 'Dieser Raum'}</button>` : ''}<span class="iconbtn">${today}</span></div></div>
    <div class="tr h"><div>Gerät</div><div>Status</div><div>Leistung</div><div>Laufzeit</div><div>Heute</div><div></div></div>
    ${rows || '<div class="mut" style="padding:18px 6px">Keine Geräte für diesen Raum konfiguriert.</div>'}</section>`;
}

function extraDeviceTabsCards() {
  const extraTabs = (CONFIG.deviceTabs || []).filter(t => t.id !== 'geraete' && t.id !== 'covers');
  return extraTabs.map(t => devicesCard(null, t.name, t.id)).join('');
}

function coversCard() {
  const list = CONFIG.covers || [];
  if (!list.length) return '';
  const openCount = list.filter(c => devInfo(c).on).length;
  const rows = list.map(c => {
    const i = devInfo(c);
    const pos = i.s && i.s.attributes && i.s.attributes.current_position != null ? i.s.attributes.current_position : null;
    const barWidth = pos != null ? pos : (i.on ? 100 : 0);
    const subTxt = pos != null ? `${pos} %` : i.label;
    return `<div class="cover-row">
      <div class="dv"><div class="dvi ${i.on ? 'open' : ''}">${ic('blinds', 17)}</div><div style="min-width:0"><b>${esc(c.name)}</b><small>${esc(subTxt)}</small></div></div>
      <div class="st ${i.cls}"><i></i>${esc(i.label)}</div>
      <div class="cover-bar" data-act="cPos" data-e="${esc(c.entity)}" role="slider" aria-valuenow="${Math.round(barWidth)}" tabindex="0"><div class="cover-bar-fill" style="width:${barWidth}%"></div></div>
      <div class="cover-btns">
        <button class="cbtn" data-act="cUp" data-e="${esc(c.entity)}">${ic('up', 16)}</button>
        <button class="cbtn" data-act="cStop" data-e="${esc(c.entity)}">${ic('stop', 13)}</button>
        <button class="cbtn" data-act="cDown" data-e="${esc(c.entity)}">${ic('down', 16)}</button>
      </div>
    </div>`;
  }).join('');
  return `<section class="card"><div class="ch"><div><b>Rolladen</b> <span class="mut sm" style="color:var(--acc2)">&nbsp;${openCount} offen</span></div></div>
    <div class="cover-row h"><div>Rolladen</div><div>Status</div><div>Position</div><div style="text-align:right">Steuerung</div></div>
    ${rows}</section>`;
}

function arc(cx, cy, r, a0, a1) {
  const p = a => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${(a1 - a0) > 180 ? 1 : 0} 1 ${x1.toFixed(1)},${y1.toFixed(1)}`;
}
function activeClimate() {
  const r = (CONFIG.rooms || [])[ui.room] || {};
  if (r.climate) {
    const s = S(r.climate);
    if (s && !['unknown', 'unavailable'].includes(s.state)) {
      return { ...(CONFIG.climate || {}), entity: r.climate, name: r.name, type: 'climate' };
    }
  }
  return { ...(CONFIG.weather || {}), name: (CONFIG.weather && CONFIG.weather.label) || '', type: 'weather' };
}

/* ---------- Wetter-Kachel mit Popup-Button für 7-Tage-Vorhersage ---------- */
function weatherCard(c) {
  if (c.showCard === false) return '';
  const hasWeatherEnt = !!c.entity;
  const hasCustomTemp = !!c.tempEntity;
  const hasAnyItemEnt = (c.items || []).some(it => it && it.entity);
  if (!hasWeatherEnt && !hasCustomTemp && !hasAnyItemEnt) return '';

  const s = hasWeatherEnt ? S(c.entity) : null;
  const a = (s && s.attributes) || {};
  const title = `${c.title || 'Wetter'}${c.name ? ' · ' + c.name : ''}`;

  let tempVal = null;
  if (c.tempEntity) {
    const ts = S(c.tempEntity);
    if (ts && !['unknown', 'unavailable'].includes(ts.state)) tempVal = parseFloat(ts.state);
  }
  if ((tempVal == null || isNaN(tempVal)) && a.temperature != null) {
    tempVal = Number(a.temperature);
  }
  const tempUnit = c.tempUnit || a.temperature_unit || '°C';
  const condState = s && !['unknown', 'unavailable'].includes(s.state) ? s.state : '';
  const condText = condState ? (WEATHER_CONDITIONS_DE[condState] || condState) : (c.label || 'Aktuell');
  const symbol = WEATHER_SYMBOLS[condState] || '🌤️';

  const itemsList = Array.isArray(c.items) ? c.items : [];
  const detailsHtml = itemsList.map(it => {
    let raw = null;
    let unit = it.unit || '';
    if (it.entity) {
      const is = S(it.entity);
      if (is && !['unknown', 'unavailable'].includes(is.state)) {
        raw = it.attr && is.attributes && is.attributes[it.attr] != null ? is.attributes[it.attr] : is.state;
        if (!unit && is.attributes && is.attributes.unit_of_measurement) unit = is.attributes.unit_of_measurement;
      }
    } else if (s && it.attr && a[it.attr] != null) {
      raw = a[it.attr];
    }
    const numVal = raw != null && raw !== '' ? Number(raw) : NaN;
    const formatted = Number.isFinite(numVal)
      ? `${fmt(numVal, it.decimals ?? 0)} ${esc(unit)}`
      : (raw != null && raw !== '' ? `${esc(raw)} ${esc(unit)}` : '—');
    return `<div class="mini">${ic(it.icon || 'drop', 18)}<span><small>${esc(it.label)}</small>${formatted}</span></div>`;
  }).join('');

  const fcBtnHtml = c.showForecast
    ? `<button class="iconbtn wfc-open-btn" data-act="wfcOpen">${ic('calendar', 15)}<span>${esc(c.forecastTitle || '7-Tage-Wettervorhersage öffnen')}</span></button>`
    : '';

  return `<section class="card"><div class="ch"><b>${esc(title)}</b><span class="mut sm">Aktuell</span></div>
    <div class="weather-now"><div class="weather-symbol">${symbol}</div><div><div class="weather-temp">${tempVal == null || isNaN(tempVal) ? '—' : fmt(tempVal, 1)}<sup>${esc(tempUnit)}</sup></div><div class="mut sm">${esc(condText)}</div></div></div>
    ${detailsHtml ? `<div class="two">${detailsHtml}</div>` : ''}
    ${fcBtnHtml}</section>`;
}

/* ---------- 7-Tage-Vorhersage als Kachel (klickbar -> Popup) ---------- */
function weatherForecastCard(customTitle) {
  const wCfg = CONFIG.weather || {};
  if (!(wCfg.forecastEntity || wCfg.entity)) return '';
  const days = (weatherForecastState.days || []).slice(0, 7);
  const rows = days.map((d, i) => {
    const dt = d.datetime ? new Date(d.datetime) : new Date(Date.now() + i * 86400000);
    const name = i === 0 ? 'Heute' : dt.toLocaleDateString('de-DE', { weekday: 'short' });
    const sym = WEATHER_SYMBOLS[d.condition] || '🌤️';
    const hi = d.temperature != null ? `${fmt(Number(d.temperature), 0)}°` : '—';
    const lo = d.templow != null ? `${fmt(Number(d.templow), 0)}°` : '';
    const rain = d.precipitation_probability != null ? `${fmt(Number(d.precipitation_probability), 0)}%` : (d.precipitation != null ? `${fmt(Number(d.precipitation), 1)} mm` : '');
    return `<button class="wfc-row" data-act="wfcOpenDay" data-i="${i}">
      <span class="wfc-row-d">${esc(name)}</span><span class="wfc-row-i">${sym}</span>
      <span class="wfc-row-r">${esc(rain)}</span><span class="wfc-row-t"><b>${hi}</b>${lo ? `<small>${lo}</small>` : ''}</span></button>`;
  }).join('');
  const body = rows || `<div class="mut sm" style="padding:10px 2px">${weatherForecastState.error ? esc(weatherForecastState.error) : (DEMO ? 'Vorhersage im HA-Modus aktiv.' : 'Lade Vorhersagedaten…')}</div>`;
  return `<section class="card"><div class="ch"><b>${esc(customTitle || wCfg.forecastTitle || 'Wettervorhersage · 7 Tage')}</b><span class="mut sm">Antippen für Details</span></div><div class="wfc-list">${body}</div></section>`;
}


function climateCard() {
  const c = activeClimate();
  if (c.type === 'weather') return weatherCard(c);
  if (!c.entity) return '';
  const s = S(c.entity);
  const title = `${c.title || 'Raumklima'}${c.name ? ' · ' + c.name : ''}`;
  if (!s) return `<section class="card"><div class="ch"><b>${esc(title)}</b></div><div class="mut">Entität „${esc(c.entity)}“ nicht gefunden.</div></section>`;
  const a = s.attributes || {}, cur = a.current_temperature, tgt = a.temperature;
  const min = c.min ?? 16, max = c.max ?? 30;
  const f = v => clamp(((v ?? min) - min) / (max - min), 0.001, 1);
  const A0 = 135, SW = 270, curA = A0 + SW * f(cur), tgtA = A0 + SW * f(tgt);
  const k = [100 + 78 * Math.cos(tgtA * Math.PI / 180), 100 + 78 * Math.sin(tgtA * Math.PI / 180)];
  let label = 'Aus';
  if (s.state !== 'off') label = cur == null || tgt == null ? '—' : cur < tgt - 1 ? 'Zu kalt' : cur > tgt + 1 ? 'Zu warm' : 'Komfortabel';
  const hv = HVAC_DE[s.state] || s.state;
  return `<section class="card"><div class="ch"><b>${esc(title)}</b><span class="mut sm">Aktuell</span></div>
    <div class="gauge"><svg viewBox="0 0 200 175"><defs><linearGradient id="gg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="var(--ok)"/><stop offset="1" stop-color="var(--acc)"/></linearGradient></defs>
      <path d="${arc(100, 100, 78, A0, A0 + SW)}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="9" stroke-linecap="round"/>
      <path d="${arc(100, 100, 78, A0, curA)}" fill="none" stroke="url(#gg)" stroke-width="9" stroke-linecap="round"/>
      ${tgt != null ? `<circle cx="${k[0].toFixed(1)}" cy="${k[1].toFixed(1)}" r="6" fill="#fff" stroke="var(--acc)" stroke-width="3"/>` : ''}</svg>
      <div class="gc"><div class="v">${fmt(cur, 1)}<sup>°C</sup></div><div class="mut sm">${label}${tgt != null ? ' · Soll ' + fmt(tgt, 1) + '°' : ''}</div>
        <div class="b"><button data-act="tmin">−</button><button data-act="tplus">+</button></div></div></div>
    <div class="two"><button class="mini" data-act="hvac">${ic('sun', 18)}<span><small>Modus</small>${esc(hv)}</span></button>
    <button class="mini" data-act="fan">${ic('fan', 18)}<span><small>Lüfter</small>${esc(a.fan_mode ? a.fan_mode : '—')}</span></button></div></section>`;
}

function spark(ser, id, opt = {}, ser2 = null) {
  const ok1 = ser && ser.filter(v => v != null).length >= 2;
  const ok2 = ser2 && ser2.filter(v => v != null).length >= 2;
  if (!ok1 && !ok2) return '<div class="mut sm" style="padding:30px 0;text-align:right">Keine Daten</div>';
  const getVals = s => {
    if (!s) return [];
    let last = s.find(v => v != null);
    return s.map(v => { if (v != null) last = v; return last; });
  };
  const vals1 = getVals(ser), vals2 = getVals(ser2), allVals = [...vals1, ...vals2];
  const mn0 = Math.min(...allVals), mx0 = Math.max(...allVals);
  let lo, hi;
  if (opt.fit) {
    if (opt.min != null && opt.max != null) { lo = Math.min(opt.min, mn0); hi = Math.max(opt.max, mx0); }
    else { const p = ((mx0 - mn0) || 1) * 0.2; lo = mn0 - p; hi = mx0 + p; }
  } else { lo = Math.min(0, mn0); hi = mx0 === lo ? lo + 1 : mx0 * 1.1; }

  const W = opt.W || 190, H = opt.H || 84, pr = 34, pt = 8, pb = 8;
  const dec = opt.dec ?? ((opt.fit ? hi - lo : hi) > 20 ? 0 : 1), pw = W - pr, gid = 'sg' + safeId(id);
  const lineColor = opt.color || '#8f81ff', fillColor = opt.color || '#7c6cf0';
  const Y = v => pt + (H - pt - pb) * (1 - (v - lo) / (hi - lo));

  let svgContent = [hi, (hi + lo) / 2, lo].map(v => `<line x1="0" x2="${pw}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}" stroke="rgba(255,255,255,.07)"/><text x="${W}" y="${(Y(v) + 3).toFixed(1)}" text-anchor="end" fill="#8b8fa8" font-size="9">${fmt(v, dec)}</text>`).join('');
  if (vals2.length) {
    const X2 = i => i * pw / (vals2.length - 1 || 1);
    const line2 = vals2.map((v, i) => `${i ? 'L' : 'M'}${X2(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
    svgContent += `<path d="${line2}" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="2" stroke-dasharray="4 5" stroke-linejoin="round"/>`;
  }
  if (vals1.length) {
    const X1 = i => i * pw / (vals1.length - 1 || 1);
    const line1 = vals1.map((v, i) => `${i ? 'L' : 'M'}${X1(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
    const area1 = `${line1} L${X1(vals1.length - 1).toFixed(1)},${H - pb} L0,${H - pb} Z`;
    const lx = X1(vals1.length - 1), ly = Y(vals1[vals1.length - 1]);
    svgContent += `<path d="${area1}" fill="url(#${gid})"/><path d="${line1}" fill="none" stroke="${lineColor}" stroke-width="2" stroke-linejoin="round"/><circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="3.5" fill="#fff" stroke="${fillColor}" stroke-width="2"/>`;
  }
  return `<svg viewBox="0 0 ${W} ${H}"><defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${fillColor}" stop-opacity=".45"/><stop offset="1" stop-color="${fillColor}" stop-opacity="0"/></linearGradient></defs>${svgContent}</svg>`;
}

function metricCard(m) {
  const v = num(m.entity);
  const yVal = m.yesterdayEntity ? num(m.yesterdayEntity) : yesterdayMetricVals[m.id];
  let trendHtml = `<div class="m-trend flat">– kein Vergleichswert</div>`;
  if (v != null && yVal != null && yVal > 0) {
    const pct = Math.round(((v - yVal) / yVal) * 100), absPct = Math.abs(pct);
    const text = pct < 0 ? `${absPct}% weniger als gestern` : pct > 0 ? `${absPct}% mehr als gestern` : `Gleich wie gestern`;
    const arrow = pct < 0 ? '↓' : pct > 0 ? '↑' : '±';
    const cls = pct < 0 ? 'down' : pct > 0 ? 'up' : 'flat';
    trendHtml = `<div class="m-trend ${cls}">${arrow} ${text}</div>`;
  }
  let headRight = 'Heute', liveText = '', extraHTML = '';
  if (m.subButtons && m.subButtons.length) {
    const cv = num(m.chart);
    if (m.chart) liveText = `<div class="mut sm" style="margin-top:6px">Aktuell: ${cv != null ? fmt(cv, 0) + ' ' + (m.chartUnit || 'W') : '—'}</div>`;
    const btns = m.subButtons.map(b => `<button class="iconbtn" style="flex:1;justify-content:center;border-color:transparent;background:rgba(255,255,255,.04);color:var(--${b.color || 'acc2'})" data-act="energymodal" data-mid="${esc(m.id)}" data-bid="${esc(b.id)}">${ic(b.icon, 15)} <span style="color:var(--txt)">${esc(b.name)}</span></button>`).join('');
    extraHTML = `<div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap">${btns}</div>`;
  } else if (m.mode !== 'last' && m.chart && m.chartUnit) {
    const cv = num(m.chart);
    if (cv != null) headRight = `Heute · ${fmt(cv, 0)} ${esc(m.chartUnit)}`;
  }
  return `<section class="card"><div class="ch"><b>${esc(m.title)}</b><span class="mut sm">${headRight}</span></div>
    <div class="mv"><div><span class="big">${fmt(v, m.decimals ?? 1)}</span><span class="unit">${esc(m.unit)}</span><div class="m-sub">${trendHtml}${liveText}</div></div>
    <div class="chart">${spark(series[m.chart], m.id, {}, series[m.chart + '_yest'])}</div></div>${extraHTML}</section>`;
}

function securityCard() {
  const sec = CONFIG.security || {};
  const locks = getLocksList(sec);
  if (!locks.length && !(sec.windows && sec.windows.length) && !(sec.cameras && sec.cameras.length)) return '';
  const openW = (sec.windows || []).filter(w => { const s = S(w); return s && s.state === 'on'; }).length;
  const camOn = (sec.cameras || []).filter(c => { const s = S(c); return s && s.state !== 'unavailable' && s.state !== 'off'; }).length;
  const allLocksOk = locks.every(l => { const s = S(l.entity); return !s || s.state === 'locked'; });
  const allOk = allLocksOk && !openW;

  const lockTiles = locks.map(l => {
    const lk = S(l.entity);
    const locked = !lk || lk.state === 'locked';
    return `<button class="tile ${locked ? '' : 'warn'}" data-act="doorEntity" data-e="${esc(l.entity)}" data-name="${esc(l.name)}">${ic(locked ? 'lock' : 'unlock', 18)}<span style="min-width:0"><b>${esc(l.name || 'Tür')}</b><small>${locked ? 'Verriegelt' : 'Entriegelt'}</small></span></button>`;
  }).join('');

  return `<section class="card"><div class="ch"><div><b>Sicherheit</b><div class="sm" style="color:${allOk ? 'var(--ok)' : 'var(--warn)'}">${allOk ? 'Alle Systeme aktiv' : 'Bitte prüfen'}</div></div></div>
    <div class="tiles">
      ${lockTiles}
      <div class="tile ${openW ? 'warn' : ''}">${ic('window', 18)}<span><b>Fenster</b><small>${openW ? openW + ' offen' : 'Geschlossen'}</small></span></div>
      <button class="tile" data-act="nav" data-view="kameras">${ic('camera', 18)}<span><b>Kameras</b><small>${camOn} aktiv</small></span></button></div></section>`;
}

function groupInfo(g) { const on = (g.entities || []).filter(e => { const s = S(e); return s && s.state === 'on'; }).length; return { on, total: (g.entities || []).length }; }
function lightsCard() {
  const gs = CONFIG.lights || [];
  if (!gs.length) return '';
  const main = groupInfo(gs[0]);
  const tiles = gs.map((g, i) => { const gi = groupInfo(g); return `<button class="tile ${gi.on ? 'on' : ''}" data-act="lgrp" data-i="${i}">${ic('bulb', 18)}<span><b>${esc(g.name)}</b><small>${gi.on}/${gi.total} an</small></span></button>`; }).join('');
  return `<section class="card"><div class="ch"><b>Lichter</b><div class="sw ${main.on ? 'on' : ''}" data-act="lgrp" data-i="0"><i></i></div></div><div class="tiles">${tiles}</div></section>`;
}

function getCoreNav() {
  const pages = [
    { label: 'Dashboard', icon: 'home', view: 'dashboard' },
    { label: 'Klima', icon: 'thermo', view: 'klima' },
    { label: 'Kameras', icon: 'camera', view: 'kameras' }
  ];
  (CONFIG.customPages || []).forEach(p => {
    pages.push({ label: p.label, icon: p.icon || 'chart', view: 'page:' + p.id });
  });
  return pages;
}

function sidebar() {
  const hs = getHass(), name = CONFIG.userName || (hs && hs.user && hs.user.name) || 'Gast';
  const mainItems = getCoreNav().map(n => `<button class="nav ${n.view === ui.view ? 'on' : ''}" data-act="nav" data-view="${esc(n.view)}">${ic(n.icon, 18)}${esc(n.label)}</button>`).join('');
  const sysItems = (!CONFIG.hideSystemLinks && CONFIG.systemLinks && CONFIG.systemLinks.length)
    ? `<div class="nav-sep"></div>` + CONFIG.systemLinks.map(n => `<button class="nav" data-act="sysnav" data-path="${esc(n.path)}">${ic(n.icon, 18)}${esc(n.label)}</button>`).join('')
    : '';
  return `<aside class="side"><div class="logo"><div class="lg">${ic('home', 20)}</div>${esc(CONFIG.title || 'Home')}</div><div class="sub">${esc(CONFIG.subtitle || 'Home Assistant')}</div>
    ${mainItems}${sysItems}
    <div class="me">
      <div class="me-user"><div class="av">${esc(name.charAt(0).toUpperCase())}</div><div style="min-width:0"><b>${esc(name)}</b><small>${esc(CONFIG.role || '')}</small></div></div>
      <div class="me-actions">
        <button class="me-btn" data-act="toggleKiosk" title="Vollbild / HA-Seitenleiste umschalten">${ic('expand', 14)}</button>
        <button class="me-btn" data-act="cfgOpen" title="Dashboard konfigurieren">${ic('settings', 15)}</button>
      </div>
    </div></aside>`;
}

const mtabs = () => `<div class="mtabs">${getCoreNav().map(n => `<button class="pill ${ui.view === n.view ? 'on' : ''}" data-act="nav" data-view="${esc(n.view)}">${esc(n.label)}</button>`).join('')}<button class="pill" data-act="cfgOpen">⚙️</button></div>`;

/* ---------- Klima-Ansicht ---------- */
function kDevice(d) {
  const E = esc(d.entity), s = S(d.entity), ico = d.icon || 'thermo';
  if (!s) return `<div class="kd"><div class="kdl"><div class="kdi">${ic(ico, 17)}</div><div><b>${esc(d.name)}</b><small>Entität nicht gefunden</small></div></div></div>`;
  const a = s.attributes || {}, off = ['off', 'unavailable', 'unknown'].includes(s.state);
  const act = a.hvac_action, cur = a.current_temperature, tgt = a.temperature;
  let label = HVAC_DE[s.state] || s.state, cls = '';
  if (off) label = s.state === 'off' ? 'Aus' : 'Nicht verfügbar';
  else if (act === 'heating') { label = 'Heizt'; cls = 'warn'; }
  else if (act === 'cooling') { label = 'Kühlt'; cls = 'cool'; }
  else if (act === 'idle') { label = 'Bereit'; cls = 'on'; }
  else cls = 'on';
  const sub = `${label}${cur != null ? ' · ' + fmt(cur, 1) + '° ist' : ''}`;
  let ctrl = '';
  if (tgt != null && !off) {
    ctrl += d.readonly ? `<b class="mut">Soll ${fmt(tgt, 1)}°</b>`
      : `<div class="step"><button data-act="kstep" data-e="${E}" data-d="-1">−</button><b>${fmt(tgt, 1)}°</b><button data-act="kstep" data-e="${E}" data-d="1">+</button></div>`;
  }
  if (d.toggle) ctrl += `<div class="sw ${off ? '' : 'on'}" data-act="ktog" data-e="${E}"><i></i></div>`;
  const presets = (d.presets || []).filter(p => !a.preset_modes || a.preset_modes.includes(p));
  const pre = presets.length && !d.readonly ? `<div class="kdp">${presets.map(p => `<button class="pb ${a.preset_mode === p ? 'on' : ''}" data-act="kpre" data-e="${E}" data-p="${esc(p)}">${esc(PRESET_DE[p] || p)}</button>`).join('')}</div>` : '';
  return `<div class="kd"><div class="kdl"><div class="kdi ${cls}">${ic(ico, 17)}</div><div><b>${esc(d.name)}</b><small>${esc(sub)}</small></div></div><div class="kdr">${ctrl}</div>${pre}</div>`;
}
function klimaView() {
  const cards = (CONFIG.climateRooms || []).map((r, i) => {
    const sens = (r.sensors || []).map(x => {
      const s = S(x.entity);
      const rawVal = s ? (x.attr ? (s.attributes && s.attributes[x.attr]) : s.state) : undefined;
      const n = rawVal != null ? parseFloat(rawVal) : NaN;
      return `<span class="chip">${ic(x.icon || 'thermo', 14)}${isNaN(n) ? '—' : fmt(n, x.decimals ?? 1) + ' ' + esc(x.unit || '')}</span>`;
    }).join('');
    let boost = '';
    if (r.boost && r.boost.entity) { const b = S(r.boost.entity); boost = `<button class="boost ${b && b.state === 'on' ? 'on' : ''}" data-act="kboost" data-e="${esc(r.boost.entity)}">${ic('fire', 14)}${esc(r.boost.name || 'Boost')}</button>`; }
    const set = r.settings && r.settings.groups && r.settings.groups.length ? `<button class="iconbtn" data-act="smOpen" data-i="${i}">${ic('settings', 14)}Einstellungen</button>` : '';
    const devs = (r.devices || []).map(kDevice).join('');
    const charts = (r.charts || []).map(c => {
      const key = '24:' + c.entity + (c.attr ? ':' + c.attr : '');
      return `<div class="kc"><div class="kct"><span>${esc(c.title || '')}</span><span class="mut sm">24 h</span></div>${spark(series[key], 'k' + c.entity + (c.attr || ''), { fit: true, min: c.min, max: c.max, W: 320, H: 90, dec: c.decimals })}</div>`;
    }).join('');
    return `<section class="card"><div class="kh"><div class="khl"><div class="kic">${ic(r.icon || 'home', 20)}</div><b>${esc(r.name)}</b></div><div class="khr">${boost}${set}</div></div>
      ${sens ? `<div class="chips" style="margin-top:12px">${sens}</div>` : ''}${devs}${charts}</section>`;
  }).join('');
  return `<div class="ktop"><div class="hi">Klima</div><div class="name">Heizung &amp; Klimaanlagen</div><div class="greet">Temperaturen, Heizungen und Klimaanlagen aller Räume – direkt steuerbar.</div></div><div class="kgrid">${cards || '<div class="mut">Noch keine Klima-Räume angelegt.</div>'}</div>`;
}

/* ---------- Kameras ---------- */
let camObserver = null;
function teardownCamObserver() { if (camObserver) { camObserver.disconnect(); camObserver = null; } }
function initCamObserver() {
  teardownCamObserver();
  const rootEl = document.querySelector('.main');
  camObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const wrap = entry.target;
      const streamUrl = wrap.dataset.src;
      const camEntity = wrap.dataset.entity;
      const badge = wrap.closest('.cam-card').querySelector('.cam-badge');
      if (entry.isIntersecting) {
        if (streamUrl && !wrap.querySelector('iframe')) {
          const iframe = document.createElement('iframe');
          iframe.src = streamUrl;
          iframe.allow = 'autoplay';
          wrap.innerHTML = '';
          wrap.appendChild(iframe);
          if (badge) { badge.className = 'cam-badge live'; badge.textContent = '● LIVE'; }
        } else if (!streamUrl && camEntity && !wrap.querySelector('img')) {
          const u = camUrl(camEntity, true) || camUrl(camEntity, false);
          if (u) {
            wrap.innerHTML = `<img src="${esc(u)}" alt="">`;
            if (badge) { badge.className = 'cam-badge live'; badge.textContent = '● LIVE'; }
          }
        }
      } else {
        wrap.innerHTML = `<div class="cam-placeholder">${ic('camera', 26)}<span>Stream pausiert</span></div>`;
        if (badge) { badge.className = 'cam-badge standby'; badge.textContent = 'STANDBY'; }
      }
    });
  }, { root: rootEl, threshold: 0.35 });
  document.querySelectorAll('.cam-wrap').forEach(el => camObserver.observe(el));
}
function kamerasView() {
  const cards = (CONFIG.webrtcCameras || []).map(c => {
    const hasGo2 = !!CONFIG.go2rtcHost && !!c.stream;
    const srcUrl = hasGo2 ? `${CONFIG.go2rtcHost}/stream.html?src=${encodeURIComponent(c.stream)}&mode=webrtc` : '';
    return `<section class="cam-card">
      <div class="cam-hdr"><span>${esc(c.name)}</span><span class="cam-badge standby">STANDBY</span></div>
      <div class="cam-wrap" data-src="${esc(srcUrl)}" data-entity="${esc(c.entity || '')}">
        <div class="cam-placeholder">${ic('camera', 26)}<span>Wird bei Sichtbarkeit geladen…</span></div>
      </div>
    </section>`;
  }).join('');
  return `<div class="ktop"><div class="hi">Sicherheit</div><div class="name">Kamera-Streams</div><div class="greet">Livebilder via go2rtc oder nativem Home Assistant Kamera-Stream.</div></div><div class="cam-grid">${cards || '<div class="mut">Keine Kameras konfiguriert.</div>'}</div>`;
}

/* ---------- Baukasten für Eigene Seiten ---------- */
function pageHeader(eyebrow, title, intro) {
  return `<div class="page-head"><div class="hi">${esc(eyebrow || '')}</div><div class="name">${esc(title || '')}</div><div class="greet">${esc(intro || '')}</div></div>`;
}
function compactValue(v) {
  if (v == null || v === '') return '—';
  if (typeof v === 'object') { try { const x = JSON.stringify(v); return x.length > 180 ? x.slice(0, 177) + '…' : x; } catch (_) { return String(v); } }
  return String(v);
}
function niceKey(k) { return String(k).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); }

function entityInfoCard(entity, title, preferredFields = []) {
  const s = S(entity);
  if (!s || ['unknown', 'unavailable'].includes(s.state)) {
    return `<section class="card"><div class="ch"><b>${esc(title)}</b><span class="mut sm">${esc(entity)}</span></div><div class="mut sm">Entität derzeit nicht verfügbar.</div></section>`;
  }
  const a = s.attributes || {};
  const rows = [];
  for (const field of preferredFields) {
    const key = Array.isArray(field) ? field[0] : field;
    const label = Array.isArray(field) ? field[1] : niceKey(field);
    if (a[key] != null && a[key] !== '') rows.push([label, compactValue(a[key])]);
  }
  if (!rows.length) {
    Object.entries(a).filter(([k,v]) => !['friendly_name','entity_picture','icon','supported_features','attribution'].includes(k) && v != null && typeof v !== 'function')
      .slice(0, 8).forEach(([k,v]) => rows.push([niceKey(k), compactValue(v)]));
  }
  return `<section class="card"><div class="ch"><div><b>${esc(title)}</b><div class="mut sm">${esc(entity)}</div></div><span class="iconbtn">${esc(compactValue(s.state))}</span></div>
    ${rows.length ? `<div class="data-list">${rows.map(([k,v]) => `<div class="data-row"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('')}</div>` : '<div class="mut sm">Keine Zusatzattribute vorhanden.</div>'}</section>`;
}

function statChartCard(group) {
  const rows = (group.items || []).map(item => {
    const st = S(item.entity), a = st && st.attributes || {};
    const rawVal = st && !['unknown','unavailable'].includes(st.state) ? (item.attr ? a[item.attr] : st.state) : undefined;
    const raw = rawVal != null ? parseFloat(rawVal) : NaN;
    const unit = item.unit || a.unit_of_measurement || '';
    const val = Number.isFinite(raw) ? `${fmt(raw, item.decimals ?? 1)} ${unit}` : (st && !item.attr ? st.state : '—');
    const key = 'stats:' + item.entity + (item.attr ? ':' + item.attr : '');
    return `<div class="stat-line"><div><div class="sm mut">${esc(item.name)}</div><div class="stat-value">${esc(val)}</div></div><div class="chart">${spark(series[key], 'stats-' + item.entity + (item.attr || ''), { fit: true, W: 320, H: 65, dec: item.decimals ?? 1, color: item.color })}</div></div>`;
  }).join('');
  return `<section class="card"><div class="ch"><div style="display:flex;align-items:center;gap:9px">${ic(group.icon || 'chart', 18)}<b>${esc(group.title)}</b></div><span class="mut sm">24 h</span></div>${rows}</section>`;
}

function powerFlowCard(title = 'Power Flow') {
  const list = CONFIG.powerFlow || [];
  if (!list.length) return '';
  const rows = list.map(item => {
    const st = S(item.entity), value = st && !['unknown','unavailable'].includes(st.state) ? parseFloat(st.state) : NaN;
    const unit = (st && st.attributes && st.attributes.unit_of_measurement) || item.unit || 'W';
    return `<div class="mini">${ic(item.icon || 'bolt', 17)}<span><small>${esc(item.label)}</small>${Number.isFinite(value) ? `${fmt(value, 0)} ${esc(unit)}` : '—'}</span></div>`;
  }).join('');
  return `<section class="card"><div class="ch"><b>${esc(title)}</b><span class="mut sm">Aktuelle Leistung</span></div><div class="two">${rows}</div></section>`;
}

function normalizeKey(v) { return String(v ?? '').toLowerCase().replace(/[^a-z0-9]/g, ''); }
function findChildPayload(root, child) {
  const names = [normalizeKey(child.id), normalizeKey(child.name)];
  const seen = new Set();
  function walk(node, depth = 0) {
    if (node == null || depth > 8 || typeof node !== 'object' || seen.has(node)) return null;
    seen.add(node);
    if (Array.isArray(node)) {
      for (const item of node) {
        if (item && typeof item === 'object') {
          const id = item.child_id ?? item.childId ?? item.child ?? item.child_name ?? item.childName;
          if (names.includes(normalizeKey(id))) return item;
        }
      }
      for (const item of node) { const found = walk(item, depth + 1); if (found) return found; }
      return null;
    }
    for (const [k,v] of Object.entries(node)) if (names.includes(normalizeKey(k))) return v;
    const id = node.child_id ?? node.childId ?? node.child ?? node.child_name ?? node.childName;
    if (names.includes(normalizeKey(id))) return node;
    for (const v of Object.values(node)) { const found = walk(v, depth + 1); if (found) return found; }
    return null;
  }
  return walk(root);
}
function taskmateChildCard(entity, child) {
  const s = S(entity || 'sensor.taskmate_overview');
  const payload = s ? findChildPayload({ state: s.state, attributes: s.attributes || {} }, child) : null;
  let tasks = null;
  if (Array.isArray(payload)) tasks = payload;
  else if (payload && typeof payload === 'object') {
    for (const k of ['tasks','items','entries','todo','todos','actions']) if (Array.isArray(payload[k])) { tasks = payload[k]; break; }
  }
  const taskRows = tasks ? tasks.slice(0, 20).map((task, i) => {
    if (typeof task !== 'object' || task == null) return `<div class="match-row"><b>${esc(compactValue(task))}</b></div>`;
    const title = task.title || task.name || task.task_name || task.task || task.text || task.label || `Aufgabe ${i + 1}`;
    const secondary = [task.due || task.due_date || task.date, task.description, task.status || task.state].filter(Boolean).map(compactValue).join(' · ');
    return `<div class="match-row"><b>${esc(title)}</b>${secondary ? `<small>${esc(secondary)}</small>` : ''}</div>`;
  }).join('') : '';
  return `<section class="card"><div class="ch"><div style="display:flex;align-items:center;gap:9px">${ic('tasks',18)}<b>${esc(child.name)}</b></div><span class="mut sm">Aufgaben</span></div>
    ${taskRows ? `<div class="match-list">${taskRows}</div>` : `<div class="page-note">Keine offenen Aufgaben gefunden.</div>`}</section>`;
}

function renderCustomWidget(w) {
  if (w.type === 'entity_info') {
    const fields = String(w.fields || '').split(',').map(x => x.trim()).filter(Boolean).map(pair => pair.includes(':') ? pair.split(':') : pair);
    return entityInfoCard(w.entity, w.title || w.entity, fields);
  }
  if (w.type === 'stat_group') return statChartCard(w);
  if (w.type === 'power_flow') return powerFlowCard(w.title || 'Power Flow');
  if (w.type === 'weather_forecast') return weatherForecastCard(w.title);
  if (w.type === 'devices') return devicesCard(w.room || '', w.title || 'Geräte', '');
  if (w.type === 'calendar') return homeCalendarCard(w.days || 14, w.title);
  if (w.type === 'trash') return homeTrashCard(w.days || 30, w.maxItems || 25, w.subtitle || 'Nächste 30 Tage');
  if (w.type === 'todo') {
    if (w.mode === 'taskmate') {
      return (w.children || []).map(c => taskmateChildCard(w.entity, c)).join('');
    }
    return entityInfoCard(w.entity, w.title || 'To-Do Liste');
  }
  if (w.type === 'iframe') {
    return `<section class="card"><div class="ch"><b>${esc(w.title || 'Einbettung')}</b></div><iframe class="iframe-widget" src="${esc(w.url || '')}"></iframe></section>`;
  }
  return '';
}

function customPageView(pageId) {
  const page = (CONFIG.customPages || []).find(p => p.id === pageId);
  if (!page) return `<div class="mut">Seite nicht gefunden.</div>`;
  const widgetsHtml = (page.widgets || []).map(renderCustomWidget).join('');
  return `${pageHeader(page.eyebrow, page.title || page.label, page.intro)}<div class="page-grid">${widgetsHtml || '<div class="mut">Noch keine Widgets auf dieser Seite.</div>'}</div>`;
}

/* ---------- Modal für Klima-Einstellungen & Energie ---------- */
const sm = { open: false, mode: null, room: null, metricId: null, energyBtn: null };

function smItem(it) {
  const E = esc(it.entity), s = S(it.entity), d = dom(it.entity);
  const name = esc(it.name || (s && s.attributes && s.attributes.friendly_name) || it.entity);
  if (!s) return `<div class="sr"><span>${name}</span><span class="mut sm">nicht gefunden</span></div>`;
  const a = s.attributes || {};
  if (d === 'input_number' || d === 'number') {
    const unit = a.unit_of_measurement || '';
    return `<div class="sr col"><div class="srl"><span>${name}</span><b class="sv" data-v="${E}">${fmt(parseFloat(s.state), 2)} ${esc(unit)}</b></div>
      <input type="range" data-ent="${E}" data-kind="num" data-unit="${esc(unit)}" min="${a.min ?? 0}" max="${a.max ?? 100}" step="${a.step ?? 1}" value="${esc(s.state)}"></div>`;
  }
  if (d === 'input_datetime') {
    const t = a.has_time && !a.has_date ? 'time' : a.has_date && !a.has_time ? 'date' : 'datetime-local';
    let v = String(s.state);
    if (t === 'time') v = v.slice(0, 5); else if (t === 'datetime-local') v = v.replace(' ', 'T').slice(0, 16);
    return `<div class="sr"><span>${name}</span><input type="${t}" data-ent="${E}" data-kind="dt" data-t="${t}" value="${esc(v)}"></div>`;
  }
  if (d === 'input_boolean' || d === 'switch') return `<div class="sr"><span>${name}</span><div class="sw ${s.state === 'on' ? 'on' : ''}" data-act="smTog" data-e="${E}"><i></i></div></div>`;
  if (d === 'input_select' || d === 'select') {
    const opts = (a.options || []).map(o => `<option value="${esc(o)}" ${o === s.state ? 'selected' : ''}>${esc(o)}</option>`).join('');
    return `<div class="sr"><span>${name}</span><select data-ent="${E}" data-kind="sel">${opts}</select></div>`;
  }
  const n = parseFloat(s.state);
  return `<div class="sr"><span>${name}</span><b>${isNaN(n) ? esc(s.state) : fmt(n, 1) + ' ' + esc(a.unit_of_measurement || '')}</b></div>`;
}

function renderSM() {
  const r = (CONFIG.climateRooms || [])[sm.room]; if (!r || !r.settings) return;
  const groups = (r.settings.groups || []).map(g => `<div class="sg"><div class="sgt">${esc(g.title)}</div>${(g.items || []).map(smItem).join('')}</div>`).join('');
  document.getElementById('smsheet').innerHTML = `<div class="smh"><b>${esc(r.settings.title || r.name + ' Einstellungen')}</b><button class="x2" data-act="smClose">✕</button></div>${groups}`;
}
function openSM(i) { sm.mode = 'room'; sm.room = i; sm.open = true; renderSM(); document.getElementById('sm').classList.add('show'); }

function openEnergyModal(metricId, btnId, isUpdate = false) {
  const metric = (CONFIG.metrics || []).find(x => x.id === metricId) || (CONFIG.metrics || [])[0];
  if (!metric || !metric.subButtons) return;
  const btn = metric.subButtons.find(x => x.id === btnId);
  if (!btn) return;
  sm.mode = 'energy'; sm.metricId = metric.id; sm.energyBtn = btnId; sm.open = true;
  const rows = (btn.entities || []).map(ent => {
    const s = S(ent.entity);
    const v = s && s.state && !['unknown','unavailable'].includes(s.state) ? parseFloat(s.state) : NaN;
    const valStr = !isNaN(v) ? `${fmt(v, 1)} ${ent.unit || ''}` : (s ? s.state : '—');
    const chartHtml = ent.chart ? `<div class="chart" style="margin-top:12px">${spark(series['sub:' + ent.entity], 'sub' + ent.entity, { fit: true, W: 320, H: 65, color: `var(--${btn.color || 'acc'})` })}</div>` : '';
    return `<div class="sr col" style="background:rgba(255,255,255,.03);padding:14px;border-radius:14px;border:1px solid var(--line);margin-bottom:12px;align-items:stretch;gap:6px;">
      <div class="srl" style="display:flex;justify-content:space-between;align-items:center;width:100%;"><span class="mut sm" style="font-size:12px;color:#c4c7dc">${esc(ent.name)}</span><b style="font-size:16px">${esc(valStr)}</b></div>${chartHtml}</div>`;
  }).join('');
  document.getElementById('smsheet').innerHTML = `<div class="smh" style="margin-bottom:18px;"><div style="display:flex;align-items:center;gap:10px;color:var(--${btn.color || 'acc'})">${ic(btn.icon, 22)} <b style="color:var(--txt)">${esc(btn.name)}</b></div><button class="x2" data-act="smClose">✕</button></div>${rows}`;
  if (!isUpdate) document.getElementById('sm').classList.add('show');
}
function closeSM() {
  sm.open = false;
  document.getElementById('smsheet').classList.remove('wfc-wide');
  document.getElementById('sm').classList.remove('show');
}

/* ---------- Persistente Hero-Kamera & Lightbox ---------- */
const heroMediaState = { type: null, key: null, el: null, timer: null };
function camUrl(id, stream) {
  const s = S(id), tok = s && s.attributes && s.attributes.access_token;
  if (!tok) return null;
  return stream ? `/api/camera_proxy_stream/${id}?token=${tok}` : `/api/camera_proxy/${id}?token=${tok}&t=${Date.now()}`;
}
function dropHeroMedia() {
  clearInterval(heroMediaState.timer);
  if (heroMediaState.el) {
    if (heroMediaState.type === 'webrtc') heroMediaState.el.src = 'about:blank';
    else { heroMediaState.el.onerror = null; heroMediaState.el.removeAttribute('src'); }
    heroMediaState.el.remove();
  }
  heroMediaState.type = null; heroMediaState.key = null; heroMediaState.el = null;
}
function syncHeroMedia(r) {
  const slot = document.getElementById('hero-bg-slot'), bg = document.getElementById('hero-bg'), banner = document.getElementById('hero-banner');
  if (!slot || !bg || !banner) return;
  banner.style.setProperty('--c', r.color || '#2a2350');
  const hasWebRtc = !!r.webrtc && !!CONFIG.go2rtcHost && !DEMO;
  const hasCam = !hasWebRtc && !!r.camera && !DEMO && !!S(r.camera);

  if (hasWebRtc) {
    bg.style.backgroundImage = 'none';
    if (heroMediaState.type !== 'webrtc' || heroMediaState.key !== r.webrtc || !slot.contains(heroMediaState.el)) {
      dropHeroMedia();
      const iframe = document.createElement('iframe');
      iframe.src = `${CONFIG.go2rtcHost}/stream.html?src=${encodeURIComponent(r.webrtc)}&mode=webrtc`;
      iframe.allow = 'autoplay';
      slot.innerHTML = ''; slot.appendChild(iframe);
      heroMediaState.type = 'webrtc'; heroMediaState.key = r.webrtc; heroMediaState.el = iframe;
    }
  } else if (hasCam) {
    bg.style.backgroundImage = 'none';
    const mode = r.cameraMode || 'stream', key = `${r.camera}:${mode}`;
    if (heroMediaState.type !== 'cam' || heroMediaState.key !== key || !slot.contains(heroMediaState.el)) {
      dropHeroMedia();
      const img = document.createElement('img'); img.alt = '';
      slot.innerHTML = ''; slot.appendChild(img);
      heroMediaState.type = 'cam'; heroMediaState.key = key; heroMediaState.el = img;
      const poll = () => {
        clearInterval(heroMediaState.timer);
        const go = () => { const u = camUrl(r.camera, false); if (u) img.src = u; };
        heroMediaState.timer = setInterval(go, 2000); go();
      };
      if (mode === 'snapshot') poll();
      else { img.onerror = poll; const u = camUrl(r.camera, true); if (u) img.src = u; else poll(); }
    }
  } else {
    dropHeroMedia();
    slot.innerHTML = '';
    bg.style.backgroundImage = r.image ? `url('${r.image}')` : 'none';
  }
}

const lbs = { timer: null };
function openLB(id, mode, title) {
  const lb = document.getElementById('lb'), body = document.getElementById('lbbody');
  document.getElementById('lbcap').textContent = title || '';
  clearInterval(lbs.timer);
  body.innerHTML = `<img src="" style="max-width:100%;max-height:85vh;border-radius:12px;object-fit:contain;" />`;
  const img = body.querySelector('img');
  const poll = () => {
    clearInterval(lbs.timer);
    const go = () => { const u = camUrl(id, false); if (u) img.src = u; };
    lbs.timer = setInterval(go, 1000); go();
  };
  if (mode === 'snapshot') poll();
  else { img.onerror = poll; const u = camUrl(id, true); if (u) img.src = u; else poll(); }
  lb.classList.add('show');
}
function openLBWebRtc(stream, title) {
  const lb = document.getElementById('lb'), body = document.getElementById('lbbody');
  document.getElementById('lbcap').textContent = title || '';
  clearInterval(lbs.timer);
  const hdStream = String(stream || '').replace(/-sub$/i, '');
  const srcUrl = `${CONFIG.go2rtcHost}/stream.html?src=${encodeURIComponent(hdStream)}&mode=webrtc`;
  body.innerHTML = `<iframe src="${srcUrl}" style="width:90vw;height:85vh;max-width:1280px;border:0;border-radius:12px;" allow="autoplay"></iframe>`;
  lb.classList.add('show');
}
function closeLB() { clearInterval(lbs.timer); document.getElementById('lbbody').innerHTML = ''; document.getElementById('lb').classList.remove('show'); }

/* ---------- Header-Badges & Kalender ---------- */
const homeCalendarState = { loading: false, loadedAt: 0, family: [], trash: [], error: false };
function stateIsUsable(s) { return !!s && !['unknown', 'unavailable', 'none', 'None', ''].includes(String(s.state)); }
function formatCountdown(entity, fallback = '') {
  if (!entity) return fallback;
  const s = S(entity);
  if (!stateIsUsable(s)) return fallback;
  const ms = Date.parse(String(s.state || '').trim());
  if (!Number.isFinite(ms)) return fallback;
  const diff = ms - Date.now();
  if (diff <= 0) return 'Jetzt';
  const mins = Math.floor(diff / 60000), hours = Math.floor(mins / 60), rest = mins % 60;
  return `${hours > 0 ? `${hours}h ` : ''}${rest}m`;
}
function wasteType(summary) {
  const value = String(summary || '');
  if (/strauchgut/i.test(value)) return { label: 'Strauchgut', icon: 'leaf', color: '#84cc16' };
  if (/grüne tonne|papier/i.test(value)) return { label: 'Papier', icon: 'cal', color: '#60a5fa' };
  if (/gelber sack/i.test(value)) return { label: 'Gelber Sack', icon: 'trash', color: '#fbbf24' };
  if (/graue tonne|restmüll|restmuell/i.test(value)) return { label: 'Restmüll', icon: 'trash', color: '#9ca3af' };
  if (/sperrmüll|sperrmuell/i.test(value)) return { label: 'Sperrmüll', icon: 'trash', color: '#c084fc' };
  return { label: 'Abfall', icon: 'trash', color: '#9ca3af' };
}
function getUpcomingTrashItems(maxDays = 2) {
  const now = new Date(), today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const afterCutoff = now.getHours() >= 14;
  return homeCalendarState.trash.filter(ev => {
    const day = new Date(ev.startMs); day.setHours(0, 0, 0, 0);
    const days = Math.round((day.getTime() - today) / 86400000);
    if (days < 0 || days > maxDays) return false;
    if (days === 0 && afterCutoff) return false;
    return true;
  }).map(ev => {
    const day = new Date(ev.startMs); day.setHours(0, 0, 0, 0);
    const days = Math.round((day.getTime() - today) / 86400000);
    const when = days === 0 ? 'Heute' : days === 1 ? 'Morgen' : day.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
    return { ...ev, days, when, type: wasteType(ev.summary) };
  });
}

function homeHeaderBadges() {
  const hb = CONFIG.headerBadges || {};
  const badges = [];
  const discharge = hb.batteryDischargePower ? num(hb.batteryDischargePower) : null;
  const charge = hb.batteryChargePower ? num(hb.batteryChargePower) : null;
  if (discharge != null && Math.abs(discharge) > 0.01 && hb.batteryEmptyTime) {
    const left = formatCountdown(hb.batteryEmptyTime);
    if (left && left !== 'Jetzt') badges.push({ icon: 'batteryClock', cls: 'orange', title: 'Akku leer in', value: left });
  } else if (charge != null && Math.abs(charge) > 0.01 && hb.batteryFullTime) {
    const full = formatCountdown(hb.batteryFullTime);
    if (full && full !== 'Jetzt') badges.push({ icon: 'batteryCharge', cls: 'green', title: 'Akku voll in', value: full });
  }
  (hb.appliances || []).forEach(app => {
    if (app.progressEntity) {
      const prog = num(app.progressEntity);
      if (prog != null && prog > 0 && prog < 100) {
        const fin = formatCountdown(app.endEntity, app.runningText || 'Läuft …');
        badges.push({ icon: app.icon || 'plug', cls: 'blue', title: app.name, value: fin === 'Jetzt' ? 'Fertig' : fin });
      }
    } else if (app.endEntity && stateIsUsable(S(app.endEntity))) {
      const fin = formatCountdown(app.endEntity, app.runningText || 'Läuft …');
      badges.push({ icon: app.icon || 'plug', cls: 'blue', title: app.name, value: fin === 'Jetzt' ? 'Fertig' : fin });
    }
  });
  getUpcomingTrashItems(2).forEach(item => {
    badges.push({ icon: item.type.icon, cls: 'trash', style: `--trash-c:${item.type.color}`, title: item.summary, value: item.when });
  });
  if (!badges.length) return '';
  return `<div class="home-header-badges">${badges.map(b => `<span class="home-header-badge ${b.cls}" ${b.style ? `style="${esc(b.style)}"` : ''}>${ic(b.icon, 13)}<span>${esc(b.title)}: ${esc(b.value)}</span></span>`).join('')}</div>`;
}

function parseCalendarDate(value) {
  if (value && typeof value === 'object') value = value.dateTime || value.date || value.timestamp || '';
  const raw = String(value || '');
  return raw ? Date.parse(/^\d{4}-\d{2}-\d{2}$/.test(raw) ? `${raw}T00:00:00` : raw) : NaN;
}
function normalizeCalendarEvent(event, entity) {
  const startRaw = event.start ?? event.start_time ?? event.startTime ?? '';
  const startMs = parseCalendarDate(startRaw);
  const startString = typeof startRaw === 'object' ? (startRaw.dateTime || startRaw.date || '') : String(startRaw);
  return {
    entity, summary: event.summary || event.message || event.title || 'Termin',
    description: event.description || '', location: event.location || '',
    startRaw: startString, startMs,
    endMs: parseCalendarDate(event.end ?? event.end_time ?? event.endTime ?? ''),
    allDay: /^\d{4}-\d{2}-\d{2}$/.test(startString)
  };
}
async function refreshHomeCalendars(force = false) {
  if (DEMO || homeCalendarState.loading) return;
  if (!force && homeCalendarState.loadedAt && Date.now() - homeCalendarState.loadedAt < 5 * 60 * 1000) return;
  const ha = getHass(); if (!ha || typeof ha.callApi !== 'function') return;
  const calCfg = CONFIG.calendars || {};
  const entities = [
    ...(calCfg.familyEntities || []).map(e => ({ entity: e, group: 'family' })),
    ...(calCfg.trashEntities || []).map(e => ({ entity: e, group: 'trash' }))
  ];
  if (!entities.length) return;
  homeCalendarState.loading = true;
  const now = new Date(), start = new Date(now); start.setHours(0, 0, 0, 0);
  const end = new Date(start.getTime() + 30 * 24 * 3600 * 1000);
  try {
    const results = await Promise.all(entities.map(async ({ entity, group }) => {
      try {
        const res = await ha.callApi('GET', `calendars/${entity}?start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}`);
        const arr = Array.isArray(res) ? res : (res && Array.isArray(res.events) ? res.events : []);
        return { group, ok: true, events: arr.map(ev => normalizeCalendarEvent(ev, entity)).filter(ev => Number.isFinite(ev.startMs)) };
      } catch (e) { return { group, ok: false, events: [] }; }
    }));
    const dedupe = list => {
      const seen = new Set();
      return list.filter(ev => { const k = `${ev.summary}|${ev.startRaw}`; if (seen.has(k)) return false; seen.add(k); return true; }).sort((a, b) => a.startMs - b.startMs);
    };
    homeCalendarState.family = dedupe(results.filter(x => x.group === 'family').flatMap(x => x.events));
    homeCalendarState.trash = dedupe(results.filter(x => x.group === 'trash').flatMap(x => x.events));
    homeCalendarState.loadedAt = Date.now();
  } finally {
    homeCalendarState.loading = false;
    tick(true);
  }
}
function homeCalendarCard(daysCount = 7, customTitle = null) {
  const calCfg = CONFIG.calendars || {};
  if (!(calCfg.familyEntities && calCfg.familyEntities.length)) return '';
  const now = new Date(), today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekEnd = new Date(today); weekEnd.setDate(weekEnd.getDate() + daysCount);
  const upcoming = homeCalendarState.family.filter(ev => ev.allDay ? (ev.startMs >= today.getTime() && ev.startMs < weekEnd.getTime()) : (ev.startMs >= now.getTime() && ev.startMs < weekEnd.getTime()));
  const dayRows = Array.from({ length: daysCount }, (_, i) => {
    const day = new Date(today); day.setDate(day.getDate() + i);
    const events = upcoming.filter(ev => { const d = new Date(ev.startMs); return d.getFullYear() === day.getFullYear() && d.getMonth() === day.getMonth() && d.getDate() === day.getDate(); });
    const dayLabel = i === 0 ? 'Heute' : i === 1 ? 'Morgen' : day.toLocaleDateString('de-DE', { weekday: 'short' });
    const dateLabel = day.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
    const eventHtml = events.length ? events.map(ev => `<div class="home-agenda-event"><b>${esc(ev.summary)}</b><small>${ev.allDay ? 'Ganztags' : new Date(ev.startMs).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr'}</small></div>`).join('') : '<small>Keine Termine</small>';
    return `<div class="home-agenda-row" style="--agenda-accent:#F1C40F"><div class="home-agenda-date">${dayLabel}<br>${dateLabel}</div><div class="home-agenda-main">${eventHtml}</div></div>`;
  }).join('');
  return `<section class="card home-agenda"><div class="ch"><b>${esc(customTitle || `Familienkalender · ${daysCount} Tage`)}</b></div><div class="home-agenda-list">${DEMO ? '<div class="home-agenda-empty">Kalender im HA-Modus aktiv.</div>' : dayRows}</div></section>`;
}
function homeTrashCard(maxDays = 2, maxItems = 6, subtitle = 'Nächste 3 Tage') {
  const calCfg = CONFIG.calendars || {};
  if (!(calCfg.trashEntities && calCfg.trashEntities.length)) return '';
  const items = getUpcomingTrashItems(maxDays).slice(0, maxItems);
  const rows = items.map(ev => `<div class="home-agenda-row" style="--agenda-accent:${ev.type.color}"><div class="home-agenda-date">${esc(ev.when)}</div><div class="home-agenda-main"><span class="home-trash-type">${ic(ev.type.icon, 13)} ${esc(ev.type.label)}</span><b>${esc(ev.summary)}</b></div></div>`).join('');
  return `<section class="card home-agenda"><div class="ch"><b>Abfallkalender</b><span class="mut sm">${esc(subtitle)}</span></div><div class="home-agenda-list">${rows || `<div class="home-agenda-empty">Keine Abholung (${esc(subtitle)}).</div>`}</div></section>`;
}

/* ---------- Visueller In-App Konfigurations-Editor ---------- */
let cfgDraft = null;
let cfgTab = 'allgemein';
let cfgDevSubTab = 'geraete';

const CHIP_ICON_OPTIONS = [
  ['expand', '⛶ Vergrößern (expand)'],
  ['camera', '📷 Kamera (camera)'],
  ['shield', '🛡️ Sicherheit (shield)'],
  ['home', '🏠 Haus (home)'],
  ['thermo', '🌡️ Temperatur (thermo)'],
  ['drop', '💧 Luftfeuchte / Wasser (drop)'],
  ['bolt', '⚡ Leistung / Strom (bolt)'],
  ['sun', '☀️ Solar / Sonne (sun)'],
  ['battery', '🔋 Batterie (battery)'],
  ['plug', '🔌 Stecker (plug)'],
  ['bulb', '💡 Licht (bulb)'],
  ['fire', '🔥 Heizung / Feuer (fire)'],
  ['fan', '🌀 Lüfter / Wind (fan)']
];

const CHIP_COLOR_OPTIONS = [
  ['', 'Standard (Lila)'],
  ['blue', 'Blau'],
  ['amber', 'Gelb / Orange'],
  ['green', 'Grün'],
  ['red', 'Rot'],
  ['battery', 'Batterie-Automatik (Rot/Gelb/Grün)']
];

function openCfgEditor() {
  requirePin('editor', () => {
    cfgDraft = ensureConfigDefaults(JSON.parse(JSON.stringify(CONFIG)));
    if (!cfgDraft.deviceTabs.some(t => t.id === cfgDevSubTab)) cfgDevSubTab = cfgDraft.deviceTabs[0].id;
    renderCfgModal(false);
    document.getElementById('cfgmodal').classList.add('show');
  }, 'Dashboard-Editor entsperren');
}

function renderCfgModal(preserveScroll = true) {
  const prevBody = document.querySelector('#cfgsheet .cfg-body');
  const prevScroll = (preserveScroll && prevBody) ? prevBody.scrollTop : 0;

  const tabs = [
    ['allgemein', 'Allgemein & Wetter'],
    ['raeume', 'Räume & Badges'],
    ['geraete', 'Geräte & Rolläden'],
    ['klima', 'Klima-Baukasten'],
    ['energie', 'Metriken & Energie'],
    ['kameras', 'Kameras & Sicherheit'],
    ['seiten', 'Eigene Seiten (Widgets)'],
    ['backup', 'Import / Backup']
  ];
  const tabBtns = tabs.map(([id, label]) => `<button class="pill ${cfgTab === id ? 'on' : ''}" data-act="cfgtab" data-tab="${id}">${label}</button>`).join('');
  let body = '';

  if (cfgTab === 'allgemein') {
    const th = cfgDraft.theme || {};
    const pp = cfgDraft.pinProtect || {};
    const w = cfgDraft.weather || {};
    const wItems = w.items || [];
    const wItemsHtml = wItems.map((it, wi) => `
      <div class="cfg-row" style="background:rgba(255,255,255,.025);padding:8px;border-radius:8px;border:1px solid var(--line)">
        <div class="cfg-field"><label>Bezeichnung</label><input class="cfg-in" placeholder="z. B. Luftfeuchtigkeit" data-wi-i="${wi}" data-wi-k="label" value="${esc(it.label || '')}"></div>
        <div class="cfg-field"><label>Eigene Entität (leer = aus Wetter-Entität)</label><input class="cfg-in" list="ha-entities-list" placeholder="sensor.*" data-wi-i="${wi}" data-wi-k="entity" value="${esc(it.entity || '')}"></div>
        <div class="cfg-field"><label>Attribut (z. B. humidity / wind_speed)</label><input class="cfg-in" placeholder="humidity" data-wi-i="${wi}" data-wi-k="attr" value="${esc(it.attr || '')}"></div>
        <div class="cfg-field"><label>Einheit</label><input class="cfg-in" placeholder="% / km/h / hPa" data-wi-i="${wi}" data-wi-k="unit" value="${esc(it.unit || '')}"></div>
        <div class="cfg-field"><label>Nachkommastellen</label><input type="number" min="0" max="3" class="cfg-in" data-wi-i="${wi}" data-wi-k="decimals" value="${it.decimals ?? 0}"></div>
        <div class="cfg-field"><label>Icon</label>
          <select class="cfg-in" data-wi-i="${wi}" data-wi-k="icon">
            ${CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(it.icon || 'drop') === val ? 'selected' : ''}>${lab}</option>`).join('')}
          </select>
        </div>
        <div class="order-btns" style="justify-self:end;align-self:end">
          <button class="btn-move" data-act="cfgMoveWItem" data-i="${wi}" data-dir="-1" ${wi === 0 ? 'disabled' : ''}>▲</button>
          <button class="btn-move" data-act="cfgMoveWItem" data-i="${wi}" data-dir="1" ${wi === wItems.length - 1 ? 'disabled' : ''}>▼</button>
          <button class="btn-danger" data-act="cfgDelWItem" data-i="${wi}">✕</button>
        </div>
      </div>`).join('');

    body = `
      <div class="cfg-box">
        <b>Seitenleiste & Darstellung</b>
        <div class="cfg-row">
          <div class="cfg-field"><label>HA-Seitenleisten-Titel</label><input class="cfg-in" data-cpath="sidebarTitle" value="${esc(cfgDraft.sidebarTitle)}"></div>
          <div class="cfg-field"><label>HA-Seitenleisten-Icon</label><input class="cfg-in" data-cpath="sidebarIcon" value="${esc(cfgDraft.sidebarIcon)}" placeholder="mdi:home-automation"></div>
          <div class="cfg-field"><label>Dashboard-Titel</label><input class="cfg-in" data-cpath="title" value="${esc(cfgDraft.title)}"></div>
          <div class="cfg-field"><label>Untertitel</label><input class="cfg-in" data-cpath="subtitle" value="${esc(cfgDraft.subtitle)}"></div>
          <div class="cfg-field"><label>Begrüßungs-Name</label><input class="cfg-in" data-cpath="userName" value="${esc(cfgDraft.userName)}"></div>
          <div class="cfg-field"><label>Rolle</label><input class="cfg-in" data-cpath="role" value="${esc(cfgDraft.role)}"></div>
          <div class="cfg-field"><label>Begrüßungstext-Entität (optional)</label><input class="cfg-in" list="ha-entities-list" data-cpath="greetingEntity" value="${esc(cfgDraft.greetingEntity)}"></div>
        </div>
      </div>
      <div class="cfg-box">
        <b>Wetter-Kachel & 7-Tage-Vorhersage (frei konfigurierbar)</b>
        <div class="cfg-row">
          <label><input type="checkbox" data-cbool="weather.showCard" ${w.showCard !== false ? 'checked' : ''}> Aktuelle Wetter-Kachel anzeigen</label>
          <label><input type="checkbox" data-cbool="weather.showForecast" ${w.showForecast ? 'checked' : ''}> 7-Tage-Wettervorhersage-Kachel anzeigen</label>
        </div>
        <div class="cfg-row">
          <div class="cfg-field"><label>Kachel-Titel (z. B. Wetter)</label><input class="cfg-in" data-cpath="weather.title" value="${esc(w.title || 'Wetter')}"></div>
          <div class="cfg-field"><label>Ort / Zusatz (z. B. Zimmern)</label><input class="cfg-in" data-cpath="weather.label" value="${esc(w.label || '')}"></div>
          <div class="cfg-field"><label>Haupt-Wetter-Entität (weather.* für Symbol/Zustand)</label><input class="cfg-in" list="ha-entities-list" data-cpath="weather.entity" value="${esc(w.entity || '')}" placeholder="weather.zuhause"></div>
          <div class="cfg-field"><label>Eigene Temperatur-Entität (optional statt Wetter-Attribut)</label><input class="cfg-in" list="ha-entities-list" data-cpath="weather.tempEntity" value="${esc(w.tempEntity || '')}" placeholder="sensor.aussentemperatur"></div>
          <div class="cfg-field"><label>Temperatur-Einheit</label><input class="cfg-in" data-cpath="weather.tempUnit" value="${esc(w.tempUnit || '°C')}"></div>
          <div class="cfg-field"><label>Vorhersage-Entität (leer = Haupt-Wetter-Entität)</label><input class="cfg-in" list="ha-entities-list" data-cpath="weather.forecastEntity" value="${esc(w.forecastEntity || '')}" placeholder="weather.zuhause"></div>
        </div>
        <div style="margin-top:6px;display:flex;flex-direction:column;gap:8px">
          <span class="mut sm" style="font-weight:600">Detail-Felder in der Wetter-Kachel (Luftfeuchtigkeit, Wind, Luftdruck, Niederschlag usw.):</span>
          ${wItemsHtml}
          <div><button class="iconbtn" data-act="cfgAddWItem">+ Weiteres Wetter-Detailfeld hinzufügen</button></div>
        </div>
      </div>
      <div class="cfg-box">
        <b>Farbschema (Theme)</b>
        <div class="cfg-row">
          <div class="cfg-field"><label>Hintergrund (--bg)</label><input type="color" class="cfg-in" data-cpath="theme.bg" value="${esc(th.bg || '#080912')}"></div>
          <div class="cfg-field"><label>Primärfarbe (--acc)</label><input type="color" class="cfg-in" data-cpath="theme.acc" value="${esc(th.acc || '#7c6cf0')}"></div>
          <div class="cfg-field"><label>Akzent hell (--acc2)</label><input type="color" class="cfg-in" data-cpath="theme.acc2" value="${esc(th.acc2 || '#a99bff')}"></div>
          <div class="cfg-field"><label>OK / Grün (--ok)</label><input type="color" class="cfg-in" data-cpath="theme.ok" value="${esc(th.ok || '#34d399')}"></div>
          <div class="cfg-field"><label>Warnung (--warn)</label><input type="color" class="cfg-in" data-cpath="theme.warn" value="${esc(th.warn || '#f59e0b')}"></div>
          <div class="cfg-field"><label>Kühl / Blau (--cool)</label><input type="color" class="cfg-in" data-cpath="theme.cool" value="${esc(th.cool || '#38bdf8')}"></div>
        </div>
      </div>
      <div class="cfg-box">
        <b>Kiosk-Modus, Systemlinks & PIN-Sperre</b>
        <div class="cfg-row">
          <label><input type="checkbox" data-cbool="kioskMode" ${cfgDraft.kioskMode ? 'checked' : ''}> Kiosk-Vollbildmodus (HA-Seitenleiste ausblenden)</label>
          <label><input type="checkbox" data-cbool="hideSystemLinks" ${cfgDraft.hideSystemLinks ? 'checked' : ''}> Untere HA-Systemlinks in Sidebar ausblenden</label>
          <div class="cfg-field"><label>PIN-Code (leer = kein PIN-Schutz)</label><input type="password" class="cfg-in" data-cpath="pinCode" value="${esc(cfgDraft.pinCode)}"></div>
        </div>
        <div class="cfg-row">
          <label><input type="checkbox" data-cbool="pinProtect.editor" ${pp.editor ? 'checked' : ''}> PIN für Dashboard-Editor</label>
          <label><input type="checkbox" data-cbool="pinProtect.systemLinks" ${pp.systemLinks ? 'checked' : ''}> PIN für HA-Systemlinks</label>
          <label><input type="checkbox" data-cbool="pinProtect.kioskExit" ${pp.kioskExit ? 'checked' : ''}> PIN zum Verlassen des Kiosk-Modus</label>
          <label><input type="checkbox" data-cbool="pinProtect.doorUnlock" ${pp.doorUnlock ? 'checked' : ''}> PIN zum Türschloss-Entriegeln</label>
        </div>
      </div>`;
  } else if (cfgTab === 'raeume') {
    const total = (cfgDraft.rooms || []).length;
    const list = (cfgDraft.rooms || []).map((r, i) => {
      const chips = r.chips || [];
      const chipsHtml = chips.map((ch, ci) => `
        <div class="cfg-row" style="background:rgba(255,255,255,.025);padding:8px;border-radius:8px;border:1px solid var(--line)">
          <div class="cfg-field"><label>Icon</label>
            <select class="cfg-in" data-chip-ri="${i}" data-chip-ci="${ci}" data-chip-k="icon">
              ${CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(ch.icon || 'thermo') === val ? 'selected' : ''}>${lab}</option>`).join('')}
            </select>
          </div>
          <div class="cfg-field"><label>Sensor / Entität</label><input class="cfg-in" list="ha-entities-list" placeholder="sensor.*" data-chip-ri="${i}" data-chip-ci="${ci}" data-chip-k="entity" value="${esc(ch.entity || '')}"></div>
          <div class="cfg-field"><label>Attribut (optional)</label><input class="cfg-in" placeholder="z. B. current_temperature" data-chip-ri="${i}" data-chip-ci="${ci}" data-chip-k="attr" value="${esc(ch.attr || '')}"></div>
          <div class="cfg-field"><label>Einheit</label><input class="cfg-in" placeholder="°C / W / %" data-chip-ri="${i}" data-chip-ci="${ci}" data-chip-k="unit" value="${esc(ch.unit || '')}"></div>
          <div class="cfg-field"><label>Nachkommastellen</label><input type="number" class="cfg-in" min="0" max="3" data-chip-ri="${i}" data-chip-ci="${ci}" data-chip-k="decimals" value="${ch.decimals ?? 1}"></div>
          <div class="cfg-field"><label>Farbe</label>
            <select class="cfg-in" data-chip-ri="${i}" data-chip-ci="${ci}" data-chip-k="cls">
              ${CHIP_COLOR_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(ch.cls || '') === val ? 'selected' : ''}>${lab}</option>`).join('')}
            </select>
          </div>
          <div class="order-btns" style="justify-self:end;align-self:end">
            <button class="btn-move" data-act="cfgMoveChip" data-ri="${i}" data-ci="${ci}" data-dir="-1" ${ci === 0 ? 'disabled' : ''} title="Links/Hoch">▲</button>
            <button class="btn-move" data-act="cfgMoveChip" data-ri="${i}" data-ci="${ci}" data-dir="1" ${ci === chips.length - 1 ? 'disabled' : ''} title="Rechts/Runter">▼</button>
            <button class="btn-danger" data-act="cfgDelChip" data-ri="${i}" data-ci="${ci}">✕</button>
          </div>
        </div>`).join('');

      const camBtns = r.camButtons || [];
      const camBtnsHtml = camBtns.map((cb, bi) => `
        <div class="cfg-row" style="background:rgba(255,255,255,.025);padding:8px;border-radius:8px;border:1px solid var(--line)">
          <div class="cfg-field"><label>Button-Name</label><input class="cfg-in" placeholder="z. B. Vergrößern / Hof" data-cb-ri="${i}" data-cb-bi="${bi}" data-cb-k="name" value="${esc(cb.name || '')}"></div>
          <div class="cfg-field"><label>Icon</label>
            <select class="cfg-in" data-cb-ri="${i}" data-cb-bi="${bi}" data-cb-k="icon">
              ${CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(cb.icon || 'expand') === val ? 'selected' : ''}>${lab}</option>`).join('')}
            </select>
          </div>
          <div class="cfg-field"><label>go2rtc Stream (leer = Raum-Kamera)</label><input class="cfg-in" placeholder="z. B. Eingang / Hof-sub" data-cb-ri="${i}" data-cb-bi="${bi}" data-cb-k="stream" value="${esc(cb.stream || '')}"></div>
          <div class="cfg-field"><label>HA Kamera-Entität (leer = Raum-Kamera)</label><input class="cfg-in" list="ha-entities-list" placeholder="camera.*" data-cb-ri="${i}" data-cb-bi="${bi}" data-cb-k="entity" value="${esc(cb.entity || '')}"></div>
          <div class="order-btns" style="justify-self:end;align-self:end">
            <button class="btn-move" data-act="cfgMoveCamBtn" data-ri="${i}" data-bi="${bi}" data-dir="-1" ${bi === 0 ? 'disabled' : ''} title="Links/Hoch">▲</button>
            <button class="btn-move" data-act="cfgMoveCamBtn" data-ri="${i}" data-bi="${bi}" data-dir="1" ${bi === camBtns.length - 1 ? 'disabled' : ''} title="Rechts/Runter">▼</button>
            <button class="btn-danger" data-act="cfgDelCamBtn" data-ri="${i}" data-bi="${bi}">✕</button>
          </div>
        </div>`).join('');

      const hasBgStream = !!(r.webrtc || r.camera);

      return `<div class="cfg-box">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
          <b>Raum #${i + 1}: ${esc(r.name)}</b>
          <div class="order-btns">
            <button class="btn-move" data-act="cfgMoveRoom" data-i="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''} title="Nach oben">▲</button>
            <button class="btn-move" data-act="cfgMoveRoom" data-i="${i}" data-dir="1" ${i === total - 1 ? 'disabled' : ''} title="Nach unten">▼</button>
            <button class="btn-danger" data-act="cfgDelRoom" data-i="${i}">Löschen</button>
          </div>
        </div>
        <div class="cfg-row">
          <div class="cfg-field"><label>Raumname</label><input class="cfg-in" data-r-i="${i}" data-r-k="name" value="${esc(r.name)}"></div>
          <div class="cfg-field"><label>Klima-Entität</label><input class="cfg-in" list="ha-entities-list" data-r-i="${i}" data-r-k="climate" value="${esc(r.climate || '')}"></div>
          <div class="cfg-field"><label>Hintergrund Kamera-Entität (HA)</label><input class="cfg-in" list="ha-entities-list" data-r-i="${i}" data-r-k="camera" value="${esc(r.camera || '')}"></div>
          <div class="cfg-field"><label>Hintergrund go2rtc Stream (optional)</label><input class="cfg-in" data-r-i="${i}" data-r-k="webrtc" value="${esc(r.webrtc || '')}"></div>
          <div class="cfg-field"><label>Hintergrundbild URL</label><input class="cfg-in" data-r-i="${i}" data-r-k="image" value="${esc(r.image || '')}"></div>
          <div class="cfg-field"><label>Eigenes Bild hochladen</label><input type="file" accept="image/*" class="cfg-in" data-act="uploadRoomImg" data-i="${i}"></div>
        </div>
        <div style="margin-top:4px">
          <label class="${hasBgStream ? '' : 'mut'}"><input type="checkbox" data-r-bool-i="${i}" data-r-bool-k="showLiveBadge" ${r.showLiveBadge !== false ? 'checked' : ''} ${hasBgStream ? '' : 'disabled'}> Rotes „● LIVE“-Badge im Banner anzeigen (nur aktiv, wenn im Hintergrund ein Livestream läuft)</label>
        </div>
        <div style="margin-top:8px;display:flex;flex-direction:column;gap:8px">
          <span class="mut sm" style="font-weight:600">Kamera- / Vergrößerungs-Buttons unten rechts im Banner (auch ohne Livestream-Hintergrund nutzbar):</span>
          ${camBtnsHtml || '<span class="mut sm">Keine Kamera-Buttons für diesen Raum angelegt.</span>'}
          <div><button class="iconbtn" data-act="cfgAddCamBtn" data-ri="${i}">+ Kamera-Button zu „${esc(r.name)}“ hinzufügen</button></div>
        </div>
        <div style="margin-top:8px;display:flex;flex-direction:column;gap:8px">
          <span class="mut sm" style="font-weight:600">Kleine Raum-Badges unten links im Banner (°C, W, % usw.):</span>
          ${chipsHtml || '<span class="mut sm">Keine Badges für diesen Raum angelegt.</span>'}
          <div><button class="iconbtn" data-act="cfgAddChip" data-ri="${i}">+ Badge (°C / W / %) zu „${esc(r.name)}“ hinzufügen</button></div>
        </div>
      </div>`;
    }).join('');
    body = `${list}<button class="iconbtn" data-act="cfgAddRoom">+ Neuen Raum hinzufügen</button>`;
  } else if (cfgTab === 'geraete') {
    const dTabs = cfgDraft.deviceTabs || [];
    if (!dTabs.some(t => t.id === cfgDevSubTab)) cfgDevSubTab = dTabs[0] ? dTabs[0].id : 'geraete';
    const activeTabObj = dTabs.find(t => t.id === cfgDevSubTab) || { id: 'geraete', name: 'Geräte' };
    const isCustomTab = activeTabObj.id !== 'geraete' && activeTabObj.id !== 'covers';

    const subTabBar = `<div class="cfg-subtabs">
      ${dTabs.map((t, ti) => `<div style="display:inline-flex;align-items:center;gap:3px">
        <button class="pill ${cfgDevSubTab === t.id ? 'on' : ''}" data-act="cfgDevTab" data-id="${esc(t.id)}">${esc(t.name)}</button>
        ${dTabs.length > 2 ? `<button class="btn-move" data-act="cfgMoveDevTab" data-i="${ti}" data-dir="-1" ${ti === 0 ? 'disabled' : ''} title="Reiter nach links">◀</button><button class="btn-move" data-act="cfgMoveDevTab" data-i="${ti}" data-dir="1" ${ti === dTabs.length - 1 ? 'disabled' : ''} title="Reiter nach rechts">▶</button>` : ''}
      </div>`).join('')}
      <button class="iconbtn" data-act="cfgAddDevTab">+ Weiteren Reiter erstellen (z. B. Lichter / Steckdosen)</button>
    </div>`;

    let subBody = '';
    if (cfgDevSubTab === 'covers') {
      const totalCov = (cfgDraft.covers || []).length;
      const covs = (cfgDraft.covers || []).map((c, i) => `
        <div class="cfg-row" style="border-bottom:1px solid var(--line);padding-bottom:8px">
          <input class="cfg-in" placeholder="Rolladen Name" data-cv-i="${i}" data-cv-k="name" value="${esc(c.name)}">
          <input class="cfg-in" list="ha-entities-list" placeholder="cover.*" data-cv-i="${i}" data-cv-k="entity" value="${esc(c.entity)}">
          <div class="order-btns" style="justify-self:end">
            <button class="btn-move" data-act="cfgMoveCov" data-i="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''} title="Nach oben">▲</button>
            <button class="btn-move" data-act="cfgMoveCov" data-i="${i}" data-dir="1" ${i === totalCov - 1 ? 'disabled' : ''} title="Nach unten">▼</button>
            <button class="btn-danger" data-act="cfgDelCov" data-i="${i}">✕</button>
          </div>
        </div>`).join('');
      subBody = `<div class="cfg-box"><b>Rolläden (Covers) – Reihenfolge mit ▲/▼ anpassbar</b>${covs}<button class="iconbtn" data-act="cfgAddCov">+ Rolladen hinzufügen</button></div>`;
    } else {
      const tabHeader = isCustomTab ? `
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:6px">
          <div class="cfg-field" style="flex:1"><label>Name dieses Reiters (erscheint als eigene Kachel im Dashboard)</label>
            <input class="cfg-in" data-devtab-name="${esc(activeTabObj.id)}" value="${esc(activeTabObj.name)}">
          </div>
          <button class="btn-danger" data-act="cfgDelDevTab" data-id="${esc(activeTabObj.id)}">Reiter löschen</button>
        </div>` : `<b>Schaltbare Elemente im Reiter „${esc(activeTabObj.name)}“ (Reihenfolge mit ▲/▼ anpassbar)</b>`;

      const filteredDevs = (cfgDraft.devices || []).map((d, i) => ({ d, i })).filter(x => (x.d.tab || 'geraete') === activeTabObj.id);
      const devRows = filteredDevs.map(({ d, i }, posIdx) => `
        <div class="cfg-row" style="border-bottom:1px solid var(--line);padding-bottom:8px">
          <input class="cfg-in" placeholder="Name" data-d-i="${i}" data-d-k="name" value="${esc(d.name)}">
          <input class="cfg-in" placeholder="Raum" data-d-i="${i}" data-d-k="room" value="${esc(d.room)}">
          <input class="cfg-in" list="ha-entities-list" placeholder="Entität (switch/light/...)" data-d-i="${i}" data-d-k="entity" value="${esc(d.entity)}">
          <input class="cfg-in" list="ha-entities-list" placeholder="Leistung (W) optional" data-d-i="${i}" data-d-k="power" value="${esc(d.power || '')}">
          <div class="order-btns" style="justify-self:end">
            <button class="btn-move" data-act="cfgMoveDevInTab" data-tab="${esc(activeTabObj.id)}" data-pos="${posIdx}" data-dir="-1" ${posIdx === 0 ? 'disabled' : ''} title="Nach oben">▲</button>
            <button class="btn-move" data-act="cfgMoveDevInTab" data-tab="${esc(activeTabObj.id)}" data-pos="${posIdx}" data-dir="1" ${posIdx === filteredDevs.length - 1 ? 'disabled' : ''} title="Nach unten">▼</button>
            <button class="btn-danger" data-act="cfgDelDev" data-i="${i}">✕</button>
          </div>
        </div>`).join('');

      subBody = `<div class="cfg-box">${tabHeader}${devRows}<button class="iconbtn" data-act="cfgAddDev" data-tab="${esc(activeTabObj.id)}">+ Element zu „${esc(activeTabObj.name)}“ hinzufügen</button></div>`;
    }
    body = `${subTabBar}${subBody}`;
  } else if (cfgTab === 'klima') {
    const totalCR = (cfgDraft.climateRooms || []).length;
    const cRooms = (cfgDraft.climateRooms || []).map((cr, i) => {
      const helpers = ((cr.settings && cr.settings.groups && cr.settings.groups[0] && cr.settings.groups[0].items) || []).map(x => `${x.entity}:${x.name || ''}`).join('\n');
      return `<div class="cfg-box">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <b>Klima-Raum #${i + 1}: ${esc(cr.name)}</b>
          <div class="order-btns">
            <button class="btn-move" data-act="cfgMoveCRoom" data-i="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''} title="Nach oben">▲</button>
            <button class="btn-move" data-act="cfgMoveCRoom" data-i="${i}" data-dir="1" ${i === totalCR - 1 ? 'disabled' : ''} title="Nach unten">▼</button>
            <button class="btn-danger" data-act="cfgDelCRoom" data-i="${i}">Löschen</button>
          </div>
        </div>
        <div class="cfg-row">
          <div class="cfg-field"><label>Name</label><input class="cfg-in" data-cr-i="${i}" data-cr-k="name" value="${esc(cr.name)}"></div>
          <div class="cfg-field"><label>Haupt-Thermostat (climate.*)</label><input class="cfg-in" list="ha-entities-list" data-cr-i="${i}" data-cr-k="dev0" value="${esc(cr.devices && cr.devices[0] ? cr.devices[0].entity : '')}"></div>
          <div class="cfg-field"><label>Boost-Helfer (optional)</label><input class="cfg-in" list="ha-entities-list" data-cr-i="${i}" data-cr-k="boost" value="${esc(cr.boost ? cr.boost.entity : '')}"></div>
        </div>
        <div class="cfg-field"><label>Baukasten für Einstellungs-Helfer (je Zeile: entity_id:Anzeigename)</label>
          <textarea class="cfg-in" rows="4" data-cr-i="${i}" data-cr-k="helpers">${esc(helpers)}</textarea>
        </div>
      </div>`;
    }).join('');
    body = `${cRooms}<button class="iconbtn" data-act="cfgAddCRoom">+ Klima-Raum hinzufügen</button>`;
  } else if (cfgTab === 'energie') {
    const metrics = cfgDraft.metrics || [];
    const metricsHtml = metrics.map((m, mi) => {
      const subBtns = m.subButtons || [];
      const subBtnsHtml = subBtns.map((sb, sbi) => {
        const sbEnts = (sb.entities || []).map(e => `${e.entity}:${e.name || ''}:${e.unit || 'W'}:${e.chart ? '1' : '0'}`).join('\n');
        return `<div class="cfg-box" style="background:rgba(255,255,255,.025)">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <b>Popup-Button #${sbi + 1}: ${esc(sb.name)}</b>
            <div class="order-btns">
              <button class="btn-move" data-act="cfgMoveSubBtn" data-mi="${mi}" data-sbi="${sbi}" data-dir="-1" ${sbi === 0 ? 'disabled' : ''}>▲</button>
              <button class="btn-move" data-act="cfgMoveSubBtn" data-mi="${mi}" data-sbi="${sbi}" data-dir="1" ${sbi === subBtns.length - 1 ? 'disabled' : ''}>▼</button>
              <button class="btn-danger" data-act="cfgDelSubBtn" data-mi="${mi}" data-sbi="${sbi}">✕</button>
            </div>
          </div>
          <div class="cfg-row">
            <div class="cfg-field"><label>Button-Name</label><input class="cfg-in" data-sb-mi="${mi}" data-sb-i="${sbi}" data-sb-k="name" value="${esc(sb.name || '')}"></div>
            <div class="cfg-field"><label>Icon</label>
              <select class="cfg-in" data-sb-mi="${mi}" data-sb-i="${sbi}" data-sb-k="icon">
                ${CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(sb.icon || 'sun') === val ? 'selected' : ''}>${lab}</option>`).join('')}
              </select>
            </div>
            <div class="cfg-field"><label>Akzentfarbe</label>
              <select class="cfg-in" data-sb-mi="${mi}" data-sb-i="${sbi}" data-sb-k="color">
                ${[['warn','Gelb / Orange (warn)'],['ok','Grün (ok)'],['cool','Blau (cool)'],['acc2','Lila (acc2)']].map(([val, lab]) => `<option value="${val}" ${(sb.color || 'warn') === val ? 'selected' : ''}>${lab}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="cfg-field"><label>Entitäten im Popup (je Zeile: entity_id:Anzeigename:Einheit:Chart 1 oder 0)</label>
            <textarea class="cfg-in" rows="3" data-sb-mi="${mi}" data-sb-i="${sbi}" data-sb-k="entitiesText">${esc(sbEnts)}</textarea>
          </div>
        </div>`;
      }).join('');

      return `<div class="cfg-box">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <b>Metrik-Kachel #${mi + 1}: ${esc(m.title || 'Neue Kachel')}</b>
          <div class="order-btns">
            <button class="btn-move" data-act="cfgMoveMetric" data-i="${mi}" data-dir="-1" ${mi === 0 ? 'disabled' : ''} title="Nach oben">▲</button>
            <button class="btn-move" data-act="cfgMoveMetric" data-i="${mi}" data-dir="1" ${mi === metrics.length - 1 ? 'disabled' : ''} title="Nach unten">▼</button>
            <button class="btn-danger" data-act="cfgDelMetric" data-i="${mi}">Kachel löschen</button>
          </div>
        </div>
        <div class="cfg-row">
          <div class="cfg-field"><label>Titel (z. B. Energieverbrauch, Wasser, Gas)</label><input class="cfg-in" data-m-i="${mi}" data-m-k="title" value="${esc(m.title || '')}"></div>
          <div class="cfg-field"><label>Haupt-Entität (Tageswert)</label><input class="cfg-in" list="ha-entities-list" data-m-i="${mi}" data-m-k="entity" value="${esc(m.entity || '')}"></div>
          <div class="cfg-field"><label>Einheit (z. B. kWh, m³, L)</label><input class="cfg-in" data-m-i="${mi}" data-m-k="unit" value="${esc(m.unit || '')}"></div>
          <div class="cfg-field"><label>Nachkommastellen</label><input type="number" class="cfg-in" min="0" max="3" data-m-i="${mi}" data-m-k="decimals" value="${m.decimals ?? 1}"></div>
        </div>
        <div class="cfg-row">
          <div class="cfg-field"><label>Verlaufs-/Live-Entität (für Diagramm)</label><input class="cfg-in" list="ha-entities-list" data-m-i="${mi}" data-m-k="chart" value="${esc(m.chart || '')}"></div>
          <div class="cfg-field"><label>Live-Einheit (z. B. W, L/h)</label><input class="cfg-in" data-m-i="${mi}" data-m-k="chartUnit" value="${esc(m.chartUnit || '')}"></div>
          <div class="cfg-field"><label>Berechnungsmodus</label>
            <select class="cfg-in" data-m-i="${mi}" data-m-k="mode">
              <option value="avg" ${(m.mode || 'avg') === 'avg' ? 'selected' : ''}>Durchschnitt (avg – z. B. Leistung W)</option>
              <option value="last" ${m.mode === 'last' ? 'selected' : ''}>Letzter Wert (last – z. B. Zählerstand)</option>
            </select>
          </div>
          <div class="cfg-field"><label>Gestern-Vergleichs-Entität (optional)</label><input class="cfg-in" list="ha-entities-list" data-m-i="${mi}" data-m-k="yesterdayEntity" value="${esc(m.yesterdayEntity || '')}"></div>
        </div>
        <div style="margin-top:6px;display:flex;flex-direction:column;gap:8px">
          <span class="mut sm" style="font-weight:600">Optionale Popup-Unterbuttons (z. B. Solar / Akku / Netz):</span>
          ${subBtnsHtml}
          <div><button class="iconbtn" data-act="cfgAddSubBtn" data-mi="${mi}">+ Popup-Button zu „${esc(m.title || 'Kachel')}“ hinzufügen</button></div>
        </div>
      </div>`;
    }).join('');

    const hb = cfgDraft.headerBadges || {};
    const cal = cfgDraft.calendars || {};
    const pf = (cfgDraft.powerFlow || []).map(x => `${x.label}:${x.entity}:${x.unit || 'W'}`).join('\n');
    body = `
      <div class="cfg-box">
        <b>Metrik-Kacheln auf der rechten Dashboard-Spalte (Energie, Wasser, Gas usw. frei anpassbar)</b>
        ${metricsHtml || '<span class="mut sm">Keine Metrik-Kacheln vorhanden.</span>'}
        <button class="btn-pri" data-act="cfgAddMetric">+ Neue Metrik-Kachel (z. B. Energie / Wasser / PV) erstellen</button>
      </div>
      <div class="cfg-box">
        <b>Header-Badges oben im Home-Banner (PV-Akku & Haushaltsgeräte)</b>
        <div class="cfg-row">
          <div class="cfg-field"><label>Batterie Entladeleistung (W)</label><input class="cfg-in" list="ha-entities-list" data-cpath="headerBadges.batteryDischargePower" value="${esc(hb.batteryDischargePower || '')}"></div>
          <div class="cfg-field"><label>Batterie Ladeleistung (W)</label><input class="cfg-in" list="ha-entities-list" data-cpath="headerBadges.batteryChargePower" value="${esc(hb.batteryChargePower || '')}"></div>
          <div class="cfg-field"><label>Sensor „Batterie leer um“</label><input class="cfg-in" list="ha-entities-list" data-cpath="headerBadges.batteryEmptyTime" value="${esc(hb.batteryEmptyTime || '')}"></div>
          <div class="cfg-field"><label>Sensor „Batterie voll um“</label><input class="cfg-in" list="ha-entities-list" data-cpath="headerBadges.batteryFullTime" value="${esc(hb.batteryFullTime || '')}"></div>
        </div>
      </div>
      <div class="cfg-box">
        <b>Power-Flow Entitäten (je Zeile: Name:entity_id:Einheit)</b>
        <textarea class="cfg-in" rows="5" id="cfg-pf-text">${esc(pf)}</textarea>
      </div>
      <div class="cfg-box">
        <b>Kalender- & Abfall-Entitäten (kommagetrennt)</b>
        <div class="cfg-row">
          <div class="cfg-field"><label>Familienkalender (calendar.*)</label><input class="cfg-in" id="cfg-cal-fam" value="${esc((cal.familyEntities || []).join(', '))}"></div>
          <div class="cfg-field"><label>Abfallkalender (calendar.*)</label><input class="cfg-in" id="cfg-cal-trash" value="${esc((cal.trashEntities || []).join(', '))}"></div>
        </div>
      </div>`;
  } else if (cfgTab === 'kameras') {
    const locks = cfgDraft.security.locks || [];
    const lockRows = locks.map((lk, i) => `
      <div class="cfg-row" style="border-bottom:1px solid var(--line);padding-bottom:8px">
        <input class="cfg-in" placeholder="Bezeichnung (z. B. Haustür, Garage)" data-lk-i="${i}" data-lk-k="name" value="${esc(lk.name || '')}">
        <input class="cfg-in" list="ha-entities-list" placeholder="lock.*" data-lk-i="${i}" data-lk-k="entity" value="${esc(lk.entity || '')}">
        <div class="order-btns" style="justify-self:end">
          <button class="btn-move" data-act="cfgMoveLock" data-i="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''} title="Nach oben">▲</button>
          <button class="btn-move" data-act="cfgMoveLock" data-i="${i}" data-dir="1" ${i === locks.length - 1 ? 'disabled' : ''} title="Nach unten">▼</button>
          <button class="btn-danger" data-act="cfgDelLock" data-i="${i}">✕</button>
        </div>
      </div>`).join('');

    const totalCams = (cfgDraft.webrtcCameras || []).length;
    const cams = (cfgDraft.webrtcCameras || []).map((c, i) => `
      <div class="cfg-row" style="border-bottom:1px solid var(--line);padding-bottom:8px">
        <input class="cfg-in" placeholder="Kamera Name" data-cam-i="${i}" data-cam-k="name" value="${esc(c.name)}">
        <input class="cfg-in" list="ha-entities-list" placeholder="HA camera.* (Standard)" data-cam-i="${i}" data-cam-k="entity" value="${esc(c.entity || '')}">
        <input class="cfg-in" placeholder="go2rtc Stream (optional)" data-cam-i="${i}" data-cam-k="stream" value="${esc(c.stream || '')}">
        <div class="order-btns" style="justify-self:end">
          <button class="btn-move" data-act="cfgMoveCam" data-i="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''} title="Nach oben">▲</button>
          <button class="btn-move" data-act="cfgMoveCam" data-i="${i}" data-dir="1" ${i === totalCams - 1 ? 'disabled' : ''} title="Nach unten">▼</button>
          <button class="btn-danger" data-act="cfgDelCam" data-i="${i}">✕</button>
        </div>
      </div>`).join('');
    body = `
      <div class="cfg-box">
        <b>Türschlösser (lock.*) – Reihenfolge mit ▲/▼ anpassbar</b>
        ${lockRows}
        <button class="iconbtn" data-act="cfgAddLock">+ Weiteres Türschloss hinzufügen</button>
      </div>
      <div class="cfg-box">
        <b>Fenstersensoren & go2rtc Server</b>
        <div class="cfg-row">
          <div class="cfg-field"><label>Fenstersensoren (kommagetrennt)</label><input class="cfg-in" id="cfg-sec-win" value="${esc((cfgDraft.security && cfgDraft.security.windows || []).join(', '))}"></div>
          <div class="cfg-field"><label>go2rtc Host (optional für WebRTC)</label><input class="cfg-in" data-cpath="go2rtcHost" value="${esc(cfgDraft.go2rtcHost || '')}" placeholder="http://192.168.178.4:1984"></div>
        </div>
      </div>
      <div class="cfg-box"><b>Kamera-Ansicht (Reihenfolge mit ▲/▼ anpassbar)</b>${cams}<button class="iconbtn" data-act="cfgAddCam">+ Kamera hinzufügen</button></div>`;
  } else if (cfgTab === 'seiten') {
    const totalPages = (cfgDraft.customPages || []).length;
    const pagesHtml = (cfgDraft.customPages || []).map((p, pi) => {
      const widgets = p.widgets || [];
      const wHtml = widgets.map((w, wi) => `
        <div class="cfg-row" style="background:rgba(255,255,255,.03);padding:8px;border-radius:8px">
          <select class="cfg-in" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="type">
            ${[['entity_info','A) Entitäts-Info'],['stat_group','B) 24h Statistik-Chart'],['devices','C) Geräteliste'],['calendar','D) Familienkalender'],['trash','D) Abfallkalender'],['todo','E) Aufgaben / To-Do'],['power_flow','Power Flow'],['weather_forecast','7-Tage Wettervorhersage'],['iframe','F) Webseite / Iframe']].map(([val, lab]) => `<option value="${val}" ${w.type === val ? 'selected' : ''}>${lab}</option>`).join('')}
          </select>
          <input class="cfg-in" placeholder="Titel" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="title" value="${esc(w.title || '')}">
          <input class="cfg-in" list="ha-entities-list" placeholder="Entität / URL / Raum" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="entity" value="${esc(w.entity || w.url || w.room || '')}">
          <div class="order-btns" style="justify-self:end">
            <button class="btn-move" data-act="cfgMoveWidget" data-pi="${pi}" data-wi="${wi}" data-dir="-1" ${wi === 0 ? 'disabled' : ''} title="Nach oben">▲</button>
            <button class="btn-move" data-act="cfgMoveWidget" data-pi="${pi}" data-wi="${wi}" data-dir="1" ${wi === widgets.length - 1 ? 'disabled' : ''} title="Nach unten">▼</button>
            <button class="btn-danger" data-act="cfgDelWidget" data-pi="${pi}" data-wi="${wi}">✕</button>
          </div>
        </div>`).join('');
      return `<div class="cfg-box">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <b>Menü-Seite #${pi + 1}: ${esc(p.label)}</b>
          <div class="order-btns">
            <button class="btn-move" data-act="cfgMovePage" data-pi="${pi}" data-dir="-1" ${pi === 0 ? 'disabled' : ''} title="Seite nach oben">▲</button>
            <button class="btn-move" data-act="cfgMovePage" data-pi="${pi}" data-dir="1" ${pi === totalPages - 1 ? 'disabled' : ''} title="Seite nach unten">▼</button>
            <button class="btn-danger" data-act="cfgDelPage" data-pi="${pi}">Seite löschen</button>
          </div>
        </div>
        <div class="cfg-row">
          <div class="cfg-field"><label>Menü-Name</label><input class="cfg-in" data-pg-i="${pi}" data-pg-k="label" value="${esc(p.label)}"></div>
          <div class="cfg-field"><label>Überschrift</label><input class="cfg-in" data-pg-i="${pi}" data-pg-k="title" value="${esc(p.title || '')}"></div>
          <div class="cfg-field"><label>Icon</label><input class="cfg-in" data-pg-i="${pi}" data-pg-k="icon" value="${esc(p.icon || 'chart')}"></div>
        </div>
        ${wHtml}
        <button class="iconbtn" data-act="cfgAddWidget" data-pi="${pi}">+ Widget hinzufügen</button>
      </div>`;
    }).join('');
    body = `${pagesHtml}<button class="iconbtn" data-act="cfgAddPage">+ Neue eigene Seite anlegen</button>`;
  } else if (cfgTab === 'backup') {
    body = `
      <div class="cfg-box">
        <b>Schnellstart & Vorlagen</b>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn-pri" data-act="cfgAutoDiscover">🔍 Vorhandene HA-Räume & Geräte automatisch einlesen</button>
          <button class="iconbtn" data-act="cfgLoadTimoPreset">📦 Timo-Preset (Familie Mittenmüller) laden</button>
          <button class="iconbtn" data-act="cfgLoadEmpty">🧹 Leeres Start-Gerüst laden</button>
        </div>
      </div>
      <div class="cfg-box">
        <b>JSON-Konfiguration Exportieren / Importieren</b>
        <textarea class="cfg-in" id="cfg-json-area" rows="12" style="font-family:monospace;font-size:12px">${esc(JSON.stringify(cfgDraft, null, 2))}</textarea>
        <div style="display:flex;gap:10px">
          <button class="iconbtn" data-act="cfgApplyJson">JSON aus Textfeld übernehmen</button>
          <button class="iconbtn" data-act="cfgDownloadJson">Als .json Datei herunterladen</button>
        </div>
      </div>`;
  }

  document.getElementById('cfgsheet').innerHTML = `
    <div class="cfg-hdr"><b>Dashboard-Konfigurator</b><button class="x2" data-act="cfgClose">✕</button></div>
    <div class="cfg-tabs">${tabBtns}</div>
    <div class="cfg-body">${body}</div>
    <div class="cfg-ftr">
      <span class="mut sm">Änderungen werden direkt in Home Assistant (.storage) gespeichert.</span>
      <div style="display:flex;gap:10px">
        <button class="iconbtn" data-act="cfgClose">Abbrechen</button>
        <button class="btn-pri" data-act="cfgSave">💾 Speichern & Übernehmen</button>
      </div>
    </div>`;

  const newBody = document.querySelector('#cfgsheet .cfg-body');
  if (newBody && preserveScroll) newBody.scrollTop = prevScroll;
}

function setByPath(obj, path, val) {
  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]]) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = val;
}

document.addEventListener('input', e => {
  const t = e.target;
  if (t.dataset && t.dataset.kind === 'num') {
    const lab = document.querySelector(`.sv[data-v="${t.dataset.ent}"]`);
    if (lab) lab.textContent = `${fmt(parseFloat(t.value), 2)} ${t.dataset.unit || ''}`;
  }
  if (!cfgDraft) return;
  if (t.dataset.cpath) setByPath(cfgDraft, t.dataset.cpath, t.value);
  if (t.dataset.cbool) setByPath(cfgDraft, t.dataset.cbool, t.checked);
  if (t.dataset.wiI != null) {
    const item = cfgDraft.weather.items[+t.dataset.wiI];
    const k = t.dataset.wiK;
    item[k] = k === 'decimals' ? parseInt(t.value, 10) || 0 : t.value;
  }
  if (t.dataset.rI != null) cfgDraft.rooms[+t.dataset.rI][t.dataset.rK] = t.value;
  if (t.dataset.rBoolI != null) {
    cfgDraft.rooms[+t.dataset.rBoolI][t.dataset.rBoolK] = t.checked;
  }
  if (t.dataset.cbRi != null) {
    const cb = cfgDraft.rooms[+t.dataset.cbRi].camButtons[+t.dataset.cbBi];
    cb[t.dataset.cbK] = t.value;
  }
  if (t.dataset.chipRi != null) {
    const chip = cfgDraft.rooms[+t.dataset.chipRi].chips[+t.dataset.chipCi];
    const k = t.dataset.chipK;
    chip[k] = k === 'decimals' ? parseInt(t.value, 10) || 0 : t.value;
  }
  if (t.dataset.dI != null) cfgDraft.devices[+t.dataset.dI][t.dataset.dK] = t.value;
  if (t.dataset.cvI != null) cfgDraft.covers[+t.dataset.cvI][t.dataset.cvK] = t.value;
  if (t.dataset.camI != null) cfgDraft.webrtcCameras[+t.dataset.camI][t.dataset.camK] = t.value;
  if (t.dataset.lkI != null) {
    cfgDraft.security.locks[+t.dataset.lkI][t.dataset.lkK] = t.value;
    cfgDraft.security.lock = cfgDraft.security.locks[0] ? cfgDraft.security.locks[0].entity : '';
  }
  if (t.dataset.mI != null) {
    const m = cfgDraft.metrics[+t.dataset.mI];
    const k = t.dataset.mK;
    m[k] = k === 'decimals' ? parseInt(t.value, 10) || 0 : t.value;
  }
  if (t.dataset.sbMi != null) {
    const sb = cfgDraft.metrics[+t.dataset.sbMi].subButtons[+t.dataset.sbI];
    const k = t.dataset.sbK;
    if (k === 'entitiesText') {
      sb.entities = t.value.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
        const [entity, name, unit, chartFlag] = l.split(':');
        return {
          entity: (entity || '').trim(),
          name: (name || entity || '').trim(),
          unit: (unit || 'W').trim(),
          chart: String(chartFlag || '1').trim() !== '0'
        };
      });
    } else {
      sb[k] = t.value;
    }
  }
  if (t.dataset.devtabName) {
    const tabObj = (cfgDraft.deviceTabs || []).find(x => x.id === t.dataset.devtabName);
    if (tabObj) tabObj.name = t.value;
  }
  if (t.dataset.crI != null) {
    const cr = cfgDraft.climateRooms[+t.dataset.crI];
    const k = t.dataset.crK;
    if (k === 'name') cr.name = t.value;
    else if (k === 'dev0') cr.devices = [{ entity: t.value, name: 'Heizung', icon: 'radiator' }];
    else if (k === 'boost') cr.boost = t.value ? { entity: t.value, name: 'Boost' } : null;
    else if (k === 'helpers') {
      const items = t.value.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
        const [ent, ...rest] = l.split(':');
        return { entity: ent.trim(), name: rest.join(':').trim() || ent.trim() };
      });
      cr.settings = { title: `${cr.name} Einstellungen`, groups: [{ title: 'Einstellungen', items }] };
    }
  }
  if (t.dataset.pgI != null && t.dataset.wI == null) {
    cfgDraft.customPages[+t.dataset.pgI][t.dataset.pgK] = t.value;
  }
  if (t.dataset.pgI != null && t.dataset.wI != null) {
    const w = cfgDraft.customPages[+t.dataset.pgI].widgets[+t.dataset.wI];
    const k = t.dataset.wK;
    if (k === 'entity') {
      if (w.type === 'iframe') w.url = t.value;
      else if (w.type === 'devices') w.room = t.value;
      else w.entity = t.value;
    } else w[k] = t.value;
  }
  if (t.id === 'cfg-pf-text') {
    cfgDraft.powerFlow = t.value.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
      const [label, entity, unit] = l.split(':');
      return { label: (label || '').trim(), entity: (entity || '').trim(), unit: (unit || 'W').trim(), icon: 'bolt' };
    });
  }
  if (t.id === 'cfg-cal-fam') cfgDraft.calendars.familyEntities = t.value.split(',').map(x => x.trim()).filter(Boolean);
  if (t.id === 'cfg-cal-trash') cfgDraft.calendars.trashEntities = t.value.split(',').map(x => x.trim()).filter(Boolean);
  if (t.id === 'cfg-sec-win') cfgDraft.security.windows = t.value.split(',').map(x => x.trim()).filter(Boolean);
});

document.addEventListener('change', async e => {
  const t = e.target;
  if (t.dataset && t.dataset.act === 'uploadRoomImg') {
    const file = t.files && t.files[0];
    const idx = +t.dataset.i;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const b64 = reader.result;
      const h = getHass();
      if (h && typeof h.callWS === 'function') {
        try {
          const res = await h.callWS({ type: 'smarthome_hub/upload_image', filename: file.name, data: b64 });
          cfgDraft.rooms[idx].image = res.url;
          renderCfgModal(true);
          toast('Bild hochgeladen: ' + res.url);
        } catch (err) { toast('Upload fehlgeschlagen'); }
      } else {
        cfgDraft.rooms[idx].image = b64;
        renderCfgModal(true);
        toast('Bild als Base64 übernommen (Demo)');
      }
    };
    reader.readAsDataURL(file);
    return;
  }
  const ent = t.dataset && t.dataset.ent; if (!ent) return;
  if (t.dataset.kind === 'num') call(dom(ent), 'set_value', { entity_id: ent, value: parseFloat(t.value) });
  else if (t.dataset.kind === 'sel') call(dom(ent), 'select_option', { entity_id: ent, option: t.value });
  else if (t.dataset.kind === 'dt' && t.value) {
    if (t.dataset.t === 'time') call('input_datetime', 'set_datetime', { entity_id: ent, time: t.value.length === 5 ? t.value + ':00' : t.value });
    else if (t.dataset.t === 'date') call('input_datetime', 'set_datetime', { entity_id: ent, date: t.value });
    else call('input_datetime', 'set_datetime', { entity_id: ent, datetime: t.value.replace('T', ' ') + (t.value.length === 16 ? ':00' : '') });
  }
});

/* ---------- In-Place Render-Engine ---------- */
let lastRenderedView = null;
function render() {
  const prevMain = document.querySelector('.main'), prevSide = document.querySelector('.side');
  const viewChanged = lastRenderedView !== ui.view;
  const mainScroll = (!viewChanged && prevMain) ? prevMain.scrollTop : 0;
  const sideScroll = prevSide ? prevSide.scrollTop : 0;
  lastRenderedView = ui.view;

  if (ui.view !== 'kameras') teardownCamObserver();
  if (ui.view !== 'dashboard') dropHeroMedia();

  const rooms = CONFIG.rooms && CONFIG.rooms.length ? CONFIG.rooms : [{ name: 'Home', chips: [] }];
  if (ui.room >= rooms.length) ui.room = 0;
  const r = rooms[ui.room] || rooms[0];
  const isHome = ui.room === 0;

  if (ui.view === 'dashboard') {
    if (!document.getElementById('dash-grid')) {
      document.getElementById('app').innerHTML = `
        <div id="side-wrap" style="display:contents">${sidebar()}</div>
        <main class="main">
          <div id="mtabs-slot"></div>
          <div class="grid" id="dash-grid">
            <div class="col">
              <section class="hero-banner" id="hero-banner">
                <div class="hero-bg" id="hero-bg"><div class="hero-bg-slot" id="hero-bg-slot"></div></div>
                <div class="hero-fade"></div>
                <div id="hero-overlay-slot" style="display:contents"></div>
              </section>
              <div id="left-cards-slot" class="col"></div>
            </div>
            <div class="col" id="right-col-slot"></div>
          </div>
        </main>
        ${DEMO ? '<div class="demo">DEMO-MODUS – keine Verbindung zu Home Assistant</div>' : ''}`;
    } else {
      const sideWrap = document.getElementById('side-wrap');
      if (sideWrap) sideWrap.innerHTML = sidebar();
    }
    document.getElementById('mtabs-slot').innerHTML = mtabs();
    const banner = document.getElementById('hero-banner');
    banner.dataset.name = r.name || '';
    banner.dataset.webrtc = r.webrtc || '';
    banner.dataset.cam = r.camera || '';
    banner.dataset.mode = r.cameraMode || 'stream';

    document.getElementById('hero-overlay-slot').innerHTML = heroOverlayContent();
    syncHeroMedia(r);

    document.getElementById('left-cards-slot').innerHTML = `${devicesCard(null, 'Geräteübersicht', 'geraete')}${extraDeviceTabsCards()}${isHome ? coversCard() : ''}${isHome ? homeCalendarCard() : ''}`;
    document.getElementById('right-col-slot').innerHTML = `${rightTopStatus()}${climateCard()}${(CONFIG.metrics || []).map(metricCard).join('')}${securityCard()}${lightsCard()}${isHome ? homeTrashCard() : ''}`;
  } else {
    let pageHtml = '';
    if (ui.view === 'klima') pageHtml = klimaView();
    else if (ui.view === 'kameras') pageHtml = kamerasView();
    else if (ui.view.startsWith('page:')) pageHtml = customPageView(ui.view.slice(5));
    else pageHtml = klimaView();

    document.getElementById('app').innerHTML = `${sidebar()}<main class="main">${mtabs()}${pageHtml}</main>${DEMO ? '<div class="demo">DEMO-MODUS – keine Verbindung zu Home Assistant</div>' : ''}`;
  }

  const newMain = document.querySelector('.main'), newSide = document.querySelector('.side');
  if (newMain) newMain.scrollTop = mainScroll;
  if (newSide) newSide.scrollTop = sideScroll;
  if (ui.view === 'kameras') initCamObserver();
}

/* ---------- Entitäten-Überwachung & Tick ---------- */
let ENTITIES = [];
function rebuildEntitiesList() {
  const ids = [];
  if (CONFIG.greetingEntity) ids.push(CONFIG.greetingEntity);
  const hb = CONFIG.headerBadges || {};
  ids.push(hb.batteryDischargePower, hb.batteryChargePower, hb.batteryEmptyTime, hb.batteryFullTime);
  (hb.appliances || []).forEach(a => ids.push(a.progressEntity, a.endEntity));
  (CONFIG.powerFlow || []).forEach(p => ids.push(p.entity));
  (CONFIG.rooms || []).forEach(r => {
    ids.push(r.camera, r.climate);
    (r.chips || []).forEach(c => ids.push(c.entity));
    (r.camButtons || []).forEach(b => ids.push(b.entity));
  });
  (CONFIG.devices || []).forEach(d => ids.push(d.entity, d.power, d.energy));
  (CONFIG.covers || []).forEach(c => ids.push(c.entity));
  if (CONFIG.climate) ids.push(CONFIG.climate.entity);
  if (CONFIG.weather) {
    ids.push(CONFIG.weather.entity, CONFIG.weather.tempEntity, CONFIG.weather.forecastEntity);
    (CONFIG.weather.items || []).forEach(it => ids.push(it.entity));
  }
  (CONFIG.climateRooms || []).forEach(r => {
    (r.sensors || []).forEach(x => ids.push(x.entity));
    (r.devices || []).forEach(x => ids.push(x.entity));
    if (r.boost) ids.push(r.boost.entity);
    (r.charts || []).forEach(x => ids.push(x.entity));
  });
  (CONFIG.metrics || []).forEach(m => {
    ids.push(m.entity, m.chart, m.yesterdayEntity);
    if (m.subButtons) m.subButtons.forEach(b => (b.entities || []).forEach(e => ids.push(e.entity)));
  });
  if (CONFIG.security) {
    ids.push(CONFIG.security.lock, ...(CONFIG.security.windows || []), ...(CONFIG.security.cameras || []));
    getLocksList(CONFIG.security).forEach(l => ids.push(l.entity));
  }
  (CONFIG.lights || []).forEach(g => ids.push(...(g.entities || [])));
  (CONFIG.customPages || []).forEach(p => (p.widgets || []).forEach(w => {
    if (w.entity) ids.push(w.entity);
    if (w.items) w.items.forEach(it => ids.push(it.entity));
  }));
  ENTITIES = [...new Set(ids.filter(Boolean))];
}

let lastSig = '';
function tick(force) {
  if (ui.view === 'kameras') {
    if (force || lastSig !== '#kameras') { lastSig = '#kameras'; render(); }
    return;
  }
  if (coverDrag.active) return;
  const sig = ENTITIES.map(id => { const s = S(id); if (!s) return '-'; const a = s.attributes || {}; return [s.state, a.temperature, a.current_temperature, a.humidity, a.wind_speed, a.pressure, a.precipitation, a.hvac_action, a.current_position].join('|'); }).join(';')
    + `#${ui.room}${ui.view}${ui.showAll}${ui.seriesVer}${homeCalendarState.loadedAt}${weatherForecastState.loadedAt}${ui.unlockArmedUntil > Date.now()}`;
  if (force || sig !== lastSig) { lastSig = sig; render(); }
}

function runtimeTick() {
  document.querySelectorAll('.rt').forEach(el => { el.textContent = fmtDur(Date.now() - +el.dataset.since); });
  if (CONFIG.showDateTime) {
    const now = new Date(), opts = { timeZone: CONFIG.dateTimeTimeZone || 'Europe/Berlin' };
    const dateEl = document.getElementById('hub-date'), timeEl = document.getElementById('hub-time');
    if (dateEl) dateEl.textContent = now.toLocaleDateString(CONFIG.dateTimeLocale || 'de-DE', { ...opts, weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    if (timeEl) timeEl.textContent = now.toLocaleTimeString(CONFIG.dateTimeLocale || 'de-DE', { ...opts, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
}

/* ---------- Rolladen Drag ---------- */
function updateCoverDrag(ev, final = false) {
  const bar = coverDrag.el; if (!bar) return;
  const rect = bar.getBoundingClientRect(); if (!rect.width) return;
  const exact = clamp(((ev.clientX - rect.left) / rect.width) * 100, 0, 100), pos = Math.round(exact);
  const fill = bar.querySelector('.cover-bar-fill'); if (fill) fill.style.width = exact + '%';
  const label = bar.closest('.cover-row')?.querySelector('.dv small'); if (label) label.textContent = pos + ' %';
  const now = Date.now();
  if (pos !== coverDrag.lastSentPos && (final || now - coverDrag.lastSentAt >= 140)) {
    call('cover', 'set_cover_position', { entity_id: coverDrag.entity, position: pos }, false);
    coverDrag.lastSentPos = pos; coverDrag.lastSentAt = now;
  }
}
document.addEventListener('pointerdown', ev => {
  const bar = ev.target.closest('.cover-bar[data-act="cPos"]');
  if (!bar || (ev.pointerType === 'mouse' && ev.button !== 0)) return;
  ev.preventDefault();
  Object.assign(coverDrag, { active: true, el: bar, entity: bar.dataset.e, pointerId: ev.pointerId, lastSentAt: 0, lastSentPos: null });
  bar.classList.add('dragging');
  try { bar.setPointerCapture(ev.pointerId); } catch (_) {}
  updateCoverDrag(ev, true);
});
document.addEventListener('pointermove', ev => { if (coverDrag.active && ev.pointerId === coverDrag.pointerId) { ev.preventDefault(); updateCoverDrag(ev, false); } });
function finishCoverDrag(ev) {
  if (!coverDrag.active || (ev.pointerId != null && ev.pointerId !== coverDrag.pointerId)) return;
  if (ev.clientX != null) updateCoverDrag(ev, true);
  if (coverDrag.el) coverDrag.el.classList.remove('dragging');
  coverDrag.active = false;
  setTimeout(() => tick(true), 350);
}
document.addEventListener('pointerup', finishCoverDrag);
document.addEventListener('pointercancel', finishCoverDrag);

/* ---------- Klick-Steuerung ---------- */
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act]'); if (!el) return;
  const act = el.dataset.act, c = activeClimate(), cs = S(c.entity);
  if (act === 'noop' || act === 'cPos') return;
  if (act === 'lbClose') { closeLB(); return; }
  if (act === 'pinClose') { document.getElementById('pinmodal').classList.remove('show'); return; }
  if (act === 'pinkey') { handlePinKey(el.dataset.k); return; }

  /* Konfigurator-Aktionen */
  if (act === 'cfgOpen') { openCfgEditor(); return; }
  if (act === 'cfgClose') { document.getElementById('cfgmodal').classList.remove('show'); return; }
  if (act === 'cfgtab') { cfgTab = el.dataset.tab; renderCfgModal(false); return; }
  if (act === 'cfgDevTab') { cfgDevSubTab = el.dataset.id; renderCfgModal(false); return; }
  if (act === 'cfgMoveDevTab') { moveItem(cfgDraft.deviceTabs, +el.dataset.i, +el.dataset.dir); renderCfgModal(true); return; }
  if (act === 'cfgAddDevTab') {
    const name = prompt('Name des neuen Reiters (z. B. Lichter, Steckdosen):', 'Lichter');
    if (name && name.trim()) {
      const id = 'tab_' + Date.now();
      cfgDraft.deviceTabs.push({ id, name: name.trim() });
      cfgDevSubTab = id;
      renderCfgModal(true);
    }
    return;
  }
  if (act === 'cfgDelDevTab') {
    const id = el.dataset.id;
    cfgDraft.deviceTabs = (cfgDraft.deviceTabs || []).filter(t => t.id !== id);
    cfgDraft.devices = (cfgDraft.devices || []).filter(d => (d.tab || 'geraete') !== id);
    cfgDevSubTab = 'geraete';
    renderCfgModal(true);
    return;
  }
  if (act === 'cfgSave') {
    document.getElementById('cfgmodal').classList.remove('show');
    saveConfigToServer(cfgDraft);
    return;
  }

  /* Wetter-Detailfelder hinzufügen / löschen / sortieren */
  if (act === 'cfgAddWItem') {
    if (!Array.isArray(cfgDraft.weather.items)) cfgDraft.weather.items = [];
    cfgDraft.weather.items.push({ label: 'Neuer Wert', entity: '', attr: '', unit: '', icon: 'drop', decimals: 1 });
    renderCfgModal(true);
    return;
  }
  if (act === 'cfgDelWItem') { cfgDraft.weather.items.splice(+el.dataset.i, 1); renderCfgModal(true); return; }
  if (act === 'cfgMoveWItem') { moveItem(cfgDraft.weather.items, +el.dataset.i, +el.dataset.dir); renderCfgModal(true); return; }

  /* Räume, Kamera-Buttons & Raum-Chips (Badges) */
  if (act === 'cfgAddRoom') { cfgDraft.rooms.push({ name: 'Neuer Raum', image: '', color: '#2a2350', showLiveBadge: true, camButtons: [], chips: [] }); renderCfgModal(true); return; }
  if (act === 'cfgDelRoom') { cfgDraft.rooms.splice(+el.dataset.i, 1); renderCfgModal(true); return; }
  if (act === 'cfgMoveRoom') { moveItem(cfgDraft.rooms, +el.dataset.i, +el.dataset.dir); renderCfgModal(true); return; }
  if (act === 'cfgAddChip') {
    const ri = +el.dataset.ri;
    if (!Array.isArray(cfgDraft.rooms[ri].chips)) cfgDraft.rooms[ri].chips = [];
    cfgDraft.rooms[ri].chips.push({ icon: 'thermo', entity: '', unit: '°C', decimals: 1, cls: '' });
    renderCfgModal(true);
    return;
  }
  if (act === 'cfgDelChip') { cfgDraft.rooms[+el.dataset.ri].chips.splice(+el.dataset.ci, 1); renderCfgModal(true); return; }
  if (act === 'cfgMoveChip') { moveItem(cfgDraft.rooms[+el.dataset.ri].chips, +el.dataset.ci, +el.dataset.dir); renderCfgModal(true); return; }
  if (act === 'cfgAddCamBtn') {
    const ri = +el.dataset.ri;
    if (!Array.isArray(cfgDraft.rooms[ri].camButtons)) cfgDraft.rooms[ri].camButtons = [];
    cfgDraft.rooms[ri].camButtons.push({ name: 'Vergrößern', icon: 'expand', stream: '', entity: '' });
    renderCfgModal(true);
    return;
  }
  if (act === 'cfgDelCamBtn') { cfgDraft.rooms[+el.dataset.ri].camButtons.splice(+el.dataset.bi, 1); renderCfgModal(true); return; }
  if (act === 'cfgMoveCamBtn') { moveItem(cfgDraft.rooms[+el.dataset.ri].camButtons, +el.dataset.bi, +el.dataset.dir); renderCfgModal(true); return; }

  /* Geräte & Rolläden + Sortierung */
  if (act === 'cfgAddDev') { cfgDraft.devices.push({ name: 'Neues Element', room: 'Home', entity: '', tab: el.dataset.tab || 'geraete' }); renderCfgModal(true); return; }
  if (act === 'cfgDelDev') { cfgDraft.devices.splice(+el.dataset.i, 1); renderCfgModal(true); return; }
  if (act === 'cfgMoveDevInTab') {
    const tabId = el.dataset.tab || 'geraete';
    const pos = +el.dataset.pos, dir = +el.dataset.dir;
    const indices = cfgDraft.devices.map((d, idx) => ((d.tab || 'geraete') === tabId ? idx : -1)).filter(idx => idx !== -1);
    const targetPos = pos + dir;
    if (targetPos >= 0 && targetPos < indices.length) {
      const idxA = indices[pos], idxB = indices[targetPos];
      const tmp = cfgDraft.devices[idxA];
      cfgDraft.devices[idxA] = cfgDraft.devices[idxB];
      cfgDraft.devices[idxB] = tmp;
      renderCfgModal(true);
    }
    return;
  }
  if (act === 'cfgAddCov') { cfgDraft.covers.push({ name: 'Rolladen', entity: '' }); renderCfgModal(true); return; }
  if (act === 'cfgDelCov') { cfgDraft.covers.splice(+el.dataset.i, 1); renderCfgModal(true); return; }
  if (act === 'cfgMoveCov') { moveItem(cfgDraft.covers, +el.dataset.i, +el.dataset.dir); renderCfgModal(true); return; }

  /* Metriken (Energie / Wasser / Eigene Kacheln) + SubButtons */
  if (act === 'cfgAddMetric') {
    if (!Array.isArray(cfgDraft.metrics)) cfgDraft.metrics = [];
    cfgDraft.metrics.push({ id: 'm_' + Date.now(), title: 'Neue Metrik', entity: '', unit: 'kWh', decimals: 1, chart: '', chartUnit: 'W', mode: 'avg', subButtons: [] });
    renderCfgModal(true);
    return;
  }
  if (act === 'cfgDelMetric') { cfgDraft.metrics.splice(+el.dataset.i, 1); renderCfgModal(true); return; }
  if (act === 'cfgMoveMetric') { moveItem(cfgDraft.metrics, +el.dataset.i, +el.dataset.dir); renderCfgModal(true); return; }
  if (act === 'cfgAddSubBtn') {
    const mi = +el.dataset.mi;
    if (!Array.isArray(cfgDraft.metrics[mi].subButtons)) cfgDraft.metrics[mi].subButtons = [];
    cfgDraft.metrics[mi].subButtons.push({ id: 'sb_' + Date.now(), name: 'Details', icon: 'sun', color: 'warn', entities: [] });
    renderCfgModal(true);
    return;
  }
  if (act === 'cfgDelSubBtn') { cfgDraft.metrics[+el.dataset.mi].subButtons.splice(+el.dataset.sbi, 1); renderCfgModal(true); return; }
  if (act === 'cfgMoveSubBtn') { moveItem(cfgDraft.metrics[+el.dataset.mi].subButtons, +el.dataset.sbi, +el.dataset.dir); renderCfgModal(true); return; }

  /* Türschlösser & Kameras */
  if (act === 'cfgAddLock') {
    if (!Array.isArray(cfgDraft.security.locks)) cfgDraft.security.locks = [];
    cfgDraft.security.locks.push({ name: 'Neues Schloss', entity: '' });
    renderCfgModal(true);
    return;
  }
  if (act === 'cfgDelLock') {
    cfgDraft.security.locks.splice(+el.dataset.i, 1);
    cfgDraft.security.lock = cfgDraft.security.locks[0] ? cfgDraft.security.locks[0].entity : '';
    renderCfgModal(true);
    return;
  }
  if (act === 'cfgMoveLock') {
    moveItem(cfgDraft.security.locks, +el.dataset.i, +el.dataset.dir);
    cfgDraft.security.lock = cfgDraft.security.locks[0] ? cfgDraft.security.locks[0].entity : '';
    renderCfgModal(true);
    return;
  }
  if (act === 'cfgAddCam') { cfgDraft.webrtcCameras.push({ name: 'Kamera', entity: '', stream: '' }); renderCfgModal(true); return; }
  if (act === 'cfgDelCam') { cfgDraft.webrtcCameras.splice(+el.dataset.i, 1); renderCfgModal(true); return; }
  if (act === 'cfgMoveCam') { moveItem(cfgDraft.webrtcCameras, +el.dataset.i, +el.dataset.dir); renderCfgModal(true); return; }

  /* Klima-Räume & Eigene Seiten + Sortierung */
  if (act === 'cfgAddCRoom') { cfgDraft.climateRooms.push({ name: 'Raum', icon: 'radiator', sensors: [], devices: [], charts: [] }); renderCfgModal(true); return; }
  if (act === 'cfgDelCRoom') { cfgDraft.climateRooms.splice(+el.dataset.i, 1); renderCfgModal(true); return; }
  if (act === 'cfgMoveCRoom') { moveItem(cfgDraft.climateRooms, +el.dataset.i, +el.dataset.dir); renderCfgModal(true); return; }
  if (act === 'cfgAddPage') { cfgDraft.customPages.push({ id: 'p_' + Date.now(), label: 'Neue Seite', icon: 'chart', title: 'Neue Seite', widgets: [] }); renderCfgModal(true); return; }
  if (act === 'cfgDelPage') { cfgDraft.customPages.splice(+el.dataset.pi, 1); renderCfgModal(true); return; }
  if (act === 'cfgMovePage') { moveItem(cfgDraft.customPages, +el.dataset.pi, +el.dataset.dir); renderCfgModal(true); return; }
  if (act === 'cfgAddWidget') { cfgDraft.customPages[+el.dataset.pi].widgets.push({ type: 'entity_info', title: 'Kachel', entity: '' }); renderCfgModal(true); return; }
  if (act === 'cfgDelWidget') { cfgDraft.customPages[+el.dataset.pi].widgets.splice(+el.dataset.wi, 1); renderCfgModal(true); return; }
  if (act === 'cfgMoveWidget') { moveItem(cfgDraft.customPages[+el.dataset.pi].widgets, +el.dataset.wi, +el.dataset.dir); renderCfgModal(true); return; }

  if (act === 'cfgAutoDiscover') { autoDiscoverFromHA(); return; }
  if (act === 'cfgLoadTimoPreset') { cfgDraft = ensureConfigDefaults(JSON.parse(JSON.stringify(TIMO_PRESET_CONFIG))); renderCfgModal(false); toast('Timo-Preset in den Editor geladen'); return; }
  if (act === 'cfgLoadEmpty') { cfgDraft = ensureConfigDefaults(JSON.parse(JSON.stringify(EMPTY_CONFIG))); renderCfgModal(false); toast('Leeres Gerüst geladen'); return; }
  if (act === 'cfgApplyJson') {
    try { cfgDraft = ensureConfigDefaults(JSON.parse(document.getElementById('cfg-json-area').value)); renderCfgModal(true); toast('JSON übernommen'); }
    catch (e) { toast('Ungültiges JSON-Format'); }
    return;
  }
  if (act === 'cfgDownloadJson') {
    const blob = new Blob([JSON.stringify(cfgDraft, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'smarthome_hub_backup.json'; a.click();
    return;
  }

  /* Kiosk & Systemlinks mit PIN */
  if (act === 'toggleKiosk') {
    if (CONFIG.kioskMode) {
      requirePin('kioskExit', () => { CONFIG.kioskMode = false; applyKioskMode(false); toast('HA-Seitenleiste eingeblendet'); }, 'Kiosk-Modus verlassen');
    } else {
      CONFIG.kioskMode = true; applyKioskMode(true); toast('Vollbild / Kiosk-Modus aktiv');
    }
    return;
  }
  if (act === 'sysnav') {
    requirePin('systemLinks', () => navigate(el.dataset.path), 'Systembereich entsperren');
    return;
  }

  if (act === 'camBig') {
    const hr = el.closest('.hero-banner');
    if (hr) {
      const btnStream = el.dataset.webrtc;
      const btnCam = el.dataset.cam;
      const title = (el.dataset.title && el.dataset.title !== 'Vergrößern')
        ? `${hr.dataset.name} · ${el.dataset.title}`
        : hr.dataset.name;

      // Priorität: 1. Eigener Button-Stream -> 2. Eigene Button-Kamera -> 3. Raum-Hintergrund-Stream -> 4. Raum-Hintergrund-Kamera
      if (btnStream && CONFIG.go2rtcHost) {
        openLBWebRtc(btnStream, title);
      } else if (btnCam) {
        openLB(btnCam, hr.dataset.mode || 'stream', title);
      } else if (hr.dataset.webrtc && CONFIG.go2rtcHost) {
        openLBWebRtc(hr.dataset.webrtc, title);
      } else if (hr.dataset.cam) {
        openLB(hr.dataset.cam, hr.dataset.mode || 'stream', title);
      } else {
        toast('Keine Kamera oder Stream für diesen Button hinterlegt');
      }
    }
    return;
  }
  if (act === 'wfcOpen') { openWeatherModal(); return; }
  if (act === 'wfcOpenDay') { weatherForecastState.selectedDay = +el.dataset.i; openWeatherModal(); return; }
  if (act === 'wfcTab') { weatherForecastState.tab = el.dataset.tab; renderWeatherModal(); return; }
  if (act === 'wfcDay') { weatherForecastState.selectedDay = +el.dataset.i; renderWeatherModal(); return; }
  if (act === 'smOpen') { openSM(+el.dataset.i); return; }
  if (act === 'energymodal') { openEnergyModal(el.dataset.mid, el.dataset.bid); return; }
  if (act === 'smClose') { closeSM(); return; }
  if (act === 'smTog') { call('homeassistant', 'toggle', { entity_id: el.dataset.e }); setTimeout(() => { if (sm.open && sm.mode === 'room') renderSM(); }, 700); return; }
  if (act === 'nav') {
    if (el.dataset.view) {
      ui.view = el.dataset.view;
      localStorage.setItem('hub_view', ui.view);
      tick(true);
      if (ui.view.startsWith('page:')) refreshCustomPageSeries();
    }
    return;
  }
  if (act === 'cUp') { call('cover', 'open_cover', { entity_id: el.dataset.e }); return; }
  if (act === 'cStop') { call('cover', 'stop_cover', { entity_id: el.dataset.e }); return; }
  if (act === 'cDown') { call('cover', 'close_cover', { entity_id: el.dataset.e }); return; }
  if (act === 'kstep') {
    const e = el.dataset.e, s = S(e);
    if (s) {
      const a = s.attributes || {}, step = a.target_temp_step || 0.5, cur = a.temperature ?? a.current_temperature ?? 20;
      const nv = clamp(Math.round((cur + (+el.dataset.d) * step) / step) * step, a.min_temp ?? 5, a.max_temp ?? 35);
      call('climate', 'set_temperature', { entity_id: e, temperature: nv });
    }
    return;
  }
  if (act === 'ktog') { const s = S(el.dataset.e); call('climate', s && s.state === 'off' ? 'turn_on' : 'turn_off', { entity_id: el.dataset.e }); return; }
  if (act === 'kboost') { call('homeassistant', 'toggle', { entity_id: el.dataset.e }); return; }
  if (act === 'kpre') {
    const e = el.dataset.e, p = el.dataset.p, s = S(e), a = (s && s.attributes) || {}, modes = a.preset_modes || [];
    const offMode = modes.includes('none') ? 'none' : (modes.find(x => x !== p) || 'none');
    call('climate', 'set_preset_mode', { entity_id: e, preset_mode: a.preset_mode === p ? offMode : p });
    return;
  }
  if (act === 'room') { ui.room = +el.dataset.i; }
  else if (act === 'all') ui.showAll = !ui.showAll;
  else if (act === 'dev') toggleDevice(el.dataset.e);
  else if ((act === 'tmin' || act === 'tplus') && cs) {
    const step = c.step || 0.5, cur = cs.attributes.temperature ?? cs.attributes.current_temperature ?? 21;
    const nv = clamp(Math.round((cur + (act === 'tplus' ? step : -step)) / step) * step, c.min ?? 16, c.max ?? 30);
    call('climate', 'set_temperature', { entity_id: c.entity, temperature: nv });
  }
  else if (act === 'hvac' && cs) { const m = cs.attributes.hvac_modes || []; if (m.length) call('climate', 'set_hvac_mode', { entity_id: c.entity, hvac_mode: m[(m.indexOf(cs.state) + 1) % m.length] }); }
  else if (act === 'fan' && cs) { const m = cs.attributes.fan_modes || []; if (m.length) call('climate', 'set_fan_mode', { entity_id: c.entity, fan_mode: m[(m.indexOf(cs.attributes.fan_mode) + 1) % m.length] }); }
  else if (act === 'lockEntity') {
    call('lock', 'lock', { entity_id: el.dataset.e });
  }
  else if (act === 'unlockEntity' || (act === 'doorEntity' && (S(el.dataset.e) || {}).state === 'locked')) {
    const lockEnt = el.dataset.e;
    const lockName = el.dataset.name || 'Tür';
    requirePin('doorUnlock', () => {
      if (ui.unlockArmedEntity === lockEnt && ui.unlockArmedUntil > Date.now()) {
        ui.unlockArmedEntity = null;
        ui.unlockArmedUntil = 0;
        call('lock', 'unlock', { entity_id: lockEnt });
      } else {
        ui.unlockArmedEntity = lockEnt;
        ui.unlockArmedUntil = Date.now() + 4000;
        toast(`Nochmal tippen zum Entriegeln (${lockName})`);
        setTimeout(() => tick(true), 4100);
      }
    }, `${lockName} entriegeln`);
  }
  else if (act === 'doorEntity') {
    call('lock', 'lock', { entity_id: el.dataset.e });
  }
  else if (act === 'lgrp') { const g = CONFIG.lights[+el.dataset.i]; call('homeassistant', groupInfo(g).on ? 'turn_off' : 'turn_on', { entity_id: g.entities }); }
  tick(true);
});

/* ---------- Initialisierung ---------- */
(async function init() {
  await loadConfigFromServer();
  rebuildEntitiesList();
  render();
  refreshSeries();
  refreshWeatherForecast(true);
  refreshHomeCalendars(true);
  setInterval(tick, 1500);
  setInterval(runtimeTick, 1000);
  setInterval(refreshSeries, 5 * 60 * 1000);
  setInterval(() => refreshWeatherForecast(true), 30 * 60 * 1000);
})();
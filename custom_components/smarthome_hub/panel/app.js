const ICONS = {
  check:'<path d="M20 6L9 17l-5-5"/>',
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
  batteryCharge:'<rect x="3" y="6" width="17" height="12" rx="2"/><path d="M20 10h2v4h-2M11 8l-3 5h3l-1 3 4-6h-3z"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'
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

  if (!cfg.climate) cfg.climate = { title: 'Raumklima', label: 'Hauptbereich', entity: '', min: 16, max: 30, step: 0.5 };
  if (!Array.isArray(cfg.climate.tiles)) cfg.climate.tiles = DEFAULT_CLIMATE_TILES();

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
  if (!cfg.lightsMain) cfg.lightsMain = { mode: 'group', group: 0, entities: [] };
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

/* ---------- Verlaufsdaten (5-Minuten-Auflösung) ---------- */
function seriesPointDate(i, len, range7 = false) {
  const totalSpanMs = range7 ? 168 * 3600e3 : 24 * 3600e3;
  const stepMs = totalSpanMs / Math.max(1, len - 1);
  return new Date(Date.now() - (len - 1 - i) * stepMs);
}

async function loadSeries(id, mode, hours, attr, offsetDays = 0) {
  if (!id) return null;
  const realNow = new Date();
  const now = new Date(realNow.getTime() - (offsetDays * 86400000));
  const start = new Date(now);
  
  // Standardmäßig letzte 24h laden
  const useHours = hours || (offsetDays > 0 ? 24 : Math.max(24, realNow.getHours() + 1));
  
  // 5-Minuten-Auflösung bei <= 24h (288 Punkte); 60-Minuten-Auflösung bei 7 Tagen
  const stepMin = useHours <= 24 ? 5 : 60;
  const stepMs = stepMin * 60 * 1000;

  start.setTime(now.getTime() - useHours * 3600e3);
  start.setTime(Math.floor(start.getTime() / stepMs) * stepMs);

  const n = Math.floor((now.getTime() - start.getTime()) / stepMs) + 1;

  if (DEMO) {
    let v = 5;
    return Array.from({ length: n }, (_, i) => {
      if (useHours <= 24) {
        const t = (i + offsetDays * 288) / 24;
        return +(21 + Math.sin(t) * 1.5 + Math.cos(t * 2.5) * 0.3).toFixed(2);
      }
      return mode === 'last' ? (v += 8) : +(300 + Math.sin(i / 2) * 180).toFixed(1);
    });
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
    const a = start.getTime() + i * stepMs, b = a + stepMs;
    const inB = pts.filter(p => p.t >= a && p.t < b);
    const before = pts.filter(p => p.t < a).pop();
    if (before) prev = before.v;
    let val = prev;
    if (inB.length) val = mode === 'last' ? inB[inB.length - 1].v : inB.reduce((s, p) => s + p.v, 0) / inB.length;
    if (val != null) prev = val;
    out.push(val != null ? +val.toFixed(2) : null);
  }
  return out;
}

/* ---------- Sparkline-Rendering mit Scrubber ---------- */
const sparkData = {};

function spark(ser, id, opt = {}, ser2 = null) {
  const ok1 = ser && ser.filter(v => v != null).length >= 2;
  const ok2 = ser2 && ser2.filter(v => v != null).length >= 2;
  if (!ok1 && !ok2) return '<div class="mut sm" style="padding:20px 0;text-align:center">Keine Verlaufsdaten</div>';

  const getVals = s => {
    if (!s) return [];
    let last = s.find(v => v != null) || 0;
    return s.map(v => { if (v != null) last = v; return last; });
  };

  const vals1 = getVals(ser), vals2 = getVals(ser2), allVals = [...vals1, ...vals2];
  const mn0 = Math.min(...allVals), mx0 = Math.max(...allVals);
  let lo, hi;
  if (opt.fit) {
    if (opt.min != null && opt.max != null) { lo = Math.min(opt.min, mn0); hi = Math.max(opt.max, mx0); }
    else { const p = ((mx0 - mn0) || 1) * 0.2; lo = mn0 - p; hi = mx0 + p; }
  } else { lo = Math.min(0, mn0); hi = mx0 === lo ? lo + 1 : mx0 * 1.1; }

  const W = opt.W || 340, H = opt.H || 110, pr = 42, pt = 14, pb = 26;
  const dec = opt.dec ?? ((opt.fit ? hi - lo : hi) > 20 ? 0 : 1), pw = W - pr, gid = 'sg' + safeId(id);
  const lineColor = opt.color || '#8f81ff', fillColor = opt.color || '#7c6cf0';
  const Y = v => pt + (H - pt - pb) * (1 - (v - lo) / (hi - lo || 1));

  sparkData[gid] = {
    vals1, vals2, opt, pw, W, H, pt, pb, lo, hi, dec,
    unit: opt.unit || '',
    range7: !!opt.range7
  };

  // Hilfslinien & Achsenskalierung
  let svgContent = [hi, (hi + lo) / 2, lo].map(v => 
    `<line x1="0" x2="${pw}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}" stroke="rgba(255,255,255,.07)"/><text x="${W}" y="${(Y(v) + 3).toFixed(1)}" text-anchor="end" fill="#8b8fa8" font-size="9">${fmt(v, dec)}</text>`
  ).join('');

  // Vortagskurve (gestrichelt)
  if (vals2.length) {
    const X2 = i => i * pw / (vals2.length - 1 || 1);
    const line2 = vals2.map((v, i) => `${i ? 'L' : 'M'}${X2(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
    svgContent += `<path d="${line2}" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="2" stroke-dasharray="4 4" stroke-linejoin="round"/>`;
  }

  // Hauptkurve
  if (vals1.length) {
    const X1 = i => i * pw / (vals1.length - 1 || 1);
    const line1 = vals1.map((v, i) => `${i ? 'L' : 'M'}${X1(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
    const area1 = `${line1} L${X1(vals1.length - 1).toFixed(1)},${H - pb} L0,${H - pb} Z`;
    const lx = X1(vals1.length - 1), ly = Y(vals1[vals1.length - 1]);
    svgContent += `<path d="${area1}" fill="url(#${gid})"/><path d="${line1}" fill="none" stroke="${lineColor}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="4" fill="#fff" stroke="${fillColor}" stroke-width="2"/>`;
  }

  // Zeitbeschriftung
  const timeLabels = opt.range7 ? vals1.map((_, i) => {
    const dt = seriesPointDate(i, vals1.length, true);
    const prevDt = i > 0 ? seriesPointDate(i - 1, vals1.length, true) : null;
    if (prevDt && prevDt.getDate() === dt.getDate()) return '';
    const x = i * pw / (vals1.length - 1 || 1);
    const tx = Math.min(pw - 14, Math.max(14, x));
    return `<line x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${pt}" y2="${H - pb}" stroke="rgba(255,255,255,.06)"/><text x="${tx.toFixed(1)}" y="${H - 6}" text-anchor="middle" fill="#8b8fa8" font-size="10">${esc(dt.toLocaleDateString('de-DE', { weekday: 'short' }))}</text>`;
  }).join('') : vals1.map((_, i) => {
    const dt = seriesPointDate(i, vals1.length, false);
    const prevDt = i > 0 ? seriesPointDate(i - 1, vals1.length, false) : null;
    const isHourMark = (!prevDt || prevDt.getHours() !== dt.getHours()) && (dt.getHours() % 4 === 0) && (dt.getMinutes() === 0 || dt.getMinutes() < 6);
    const isLast = i === vals1.length - 1;
    if (isHourMark || isLast) {
      const x = (i * pw / (vals1.length - 1 || 1)).toFixed(1);
      return `<text x="${x}" y="${H - 6}" text-anchor="middle" fill="#8b8fa8" font-size="10">${pad(dt.getHours())}:00</text>`;
    }
    return '';
  }).join('');

  // Scrubber-Elemente (vertikale Linie, Indikator-Punkte und Tooltip)
  const scrubberUI = `
    <g class="scrubber-ui" id="scrub-${gid}" style="display:none;pointer-events:none">
      <line class="scrub-line" x1="0" y1="${pt}" x2="0" y2="${H - pb}" stroke="rgba(255,255,255,.7)" stroke-width="1.5" stroke-dasharray="3 3"/>
      <circle class="scrub-dot2" cx="0" cy="0" r="3.5" fill="rgba(255,255,255,.7)" stroke="#8b8fa8" stroke-width="1.5" style="display:none"/>
      <circle class="scrub-dot1" cx="0" cy="0" r="5" fill="#fff" stroke="${lineColor}" stroke-width="2.5"/>
      <g class="scrub-tip" transform="translate(0, 0)">
        <rect class="scrub-tip-bg" x="-45" y="-32" width="90" height="28" rx="6" fill="#12132a" stroke="rgba(255,255,255,.2)" stroke-width="1"/>
        <text class="scrub-tip-txt1" x="0" y="-18" text-anchor="middle" fill="#f2f3fa" font-size="11" font-weight="700">0</text>
        <text class="scrub-tip-txt2" x="0" y="-7" text-anchor="middle" fill="#8b8fa8" font-size="9">00:00</text>
      </g>
    </g>
    <rect class="scrub-overlay" data-spark-id="${gid}" data-act="chartScrubClick" x="0" y="0" width="${pw}" height="${H}" fill="transparent" style="cursor:crosshair;touch-action:pan-y"/>
  `;

  return `<svg viewBox="0 0 ${W} ${H}" class="spark-svg" data-spark-id="${gid}" style="width:100%;height:auto;overflow:visible"><defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${fillColor}" stop-opacity=".45"/><stop offset="1" stop-color="${fillColor}" stop-opacity="0"/></linearGradient></defs>${svgContent}${timeLabels}${scrubberUI}</svg>`;
}

/* ---------- Scrubber Interaktion (Mouse & Touch) ---------- */
function updateChartScrubber(e, overlay) {
  const el = overlay || e.target.closest('.scrub-overlay');
  if (!el) return;
  const gid = el.dataset.sparkId;
  const meta = sparkData[gid];
  if (!meta || !meta.vals1 || !meta.vals1.length) return;

  const svg = el.closest('svg');
  if (!svg) return;
  const scrubGroup = svg.querySelector('.scrubber-ui');
  if (!scrubGroup) return;

  const rect = el.getBoundingClientRect();
  const relX = clamp(e.clientX - rect.left, 0, rect.width);
  const frac = rect.width > 0 ? relX / rect.width : 0;
  
  const totalPts = meta.vals1.length;
  const idx = clamp(Math.round(frac * (totalPts - 1)), 0, totalPts - 1);
  const val1 = meta.vals1[idx];
  const val2 = meta.vals2 && meta.vals2.length > idx ? meta.vals2[idx] : null;

  const X = idx * meta.pw / (totalPts - 1 || 1);
  const Y1 = meta.pt + (meta.H - meta.pt - meta.pb) * (1 - (val1 - meta.lo) / (meta.hi - meta.lo || 1));

  const line = scrubGroup.querySelector('.scrub-line');
  line.setAttribute('x1', X.toFixed(1));
  line.setAttribute('x2', X.toFixed(1));

  const dot1 = scrubGroup.querySelector('.scrub-dot1');
  dot1.setAttribute('cx', X.toFixed(1));
  dot1.setAttribute('cy', Y1.toFixed(1));

  const dot2 = scrubGroup.querySelector('.scrub-dot2');
  if (val2 != null && dot2) {
    const Y2 = meta.pt + (meta.H - meta.pt - meta.pb) * (1 - (val2 - meta.lo) / (meta.hi - meta.lo || 1));
    dot2.setAttribute('cx', X.toFixed(1));
    dot2.setAttribute('cy', Y2.toFixed(1));
    dot2.style.display = '';
  } else if (dot2) {
    dot2.style.display = 'none';
  }

  const dt = seriesPointDate(idx, totalPts, meta.range7);
  const timeStr = meta.range7
    ? `${dt.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' })}, ${pad(dt.getHours())}:${pad(dt.getMinutes())}`
    : `${pad(dt.getHours())}:${pad(dt.getMinutes())} Uhr`;

  let valStr = `${fmt(val1, meta.dec)} ${meta.unit}`.trim();
  if (val2 != null) {
    valStr += ` (Gestern: ${fmt(val2, meta.dec)})`;
  }

  const tip = scrubGroup.querySelector('.scrub-tip');
  const tipTxt1 = tip.querySelector('.scrub-tip-txt1');
  const tipTxt2 = tip.querySelector('.scrub-tip-txt2');
  const tipBg = tip.querySelector('.scrub-tip-bg');

  tipTxt1.textContent = valStr;
  tipTxt2.textContent = timeStr;

  const textWidth = Math.max(90, Math.max(valStr.length * 7.2, timeStr.length * 6.5) + 18);
  tipBg.setAttribute('width', textWidth);
  tipBg.setAttribute('x', -textWidth / 2);

  const tipX = clamp(X, textWidth / 2 + 4, meta.pw - textWidth / 2 - 4);
// Wenn oben genug Platz ist (>38px), Tooltip über den Punkt setzen, andernfalls darunter
  const tipY = (Y1 > 40) ? (Y1 - 8) : (Y1 + 38);
  tip.setAttribute('transform', `translate(${tipX.toFixed(1)}, ${tipY.toFixed(1)})`);

  scrubGroup.style.display = '';
}

function hideAllChartScrubbers() {
  document.querySelectorAll('.scrubber-ui').forEach(el => { el.style.display = 'none'; });
}

let scrubActive = false;
let scrubStartX = 0;
let scrubStartY = 0;
let scrubMoved = false;

document.addEventListener('pointerdown', ev => {
  const overlay = ev.target.closest('.scrub-overlay');
  if (!overlay) return;
  scrubActive = true;
  scrubMoved = false;
  scrubStartX = ev.clientX;
  scrubStartY = ev.clientY;
  updateChartScrubber(ev, overlay);
});

document.addEventListener('pointermove', ev => {
  const overlay = ev.target.closest('.scrub-overlay');
  if (overlay) {
    if (scrubActive && Math.hypot(ev.clientX - scrubStartX, ev.clientY - scrubStartY) > 10) {
      scrubMoved = true;
    }
    updateChartScrubber(ev, overlay);
  } else if (!scrubActive) {
    hideAllChartScrubbers();
  }
});

function endScrub(ev) {
  if (!scrubActive) return;
  scrubActive = false;
  // scrubMoved nach Klick-Event-Zyklus verzögert zurücksetzen
  setTimeout(() => { scrubMoved = false; }, 200);
  if (ev.pointerType === 'touch') {
    setTimeout(hideAllChartScrubbers, 2500);
  } else {
    hideAllChartScrubbers();
  }
}
document.addEventListener('pointerup', endScrub);
document.addEventListener('pointercancel', endScrub);

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

/* ---------- Verlaufs-Lader ---------- */
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
            try { 
              series['sub:' + ent.entity] = await loadSeries(ent.entity, 'avg'); 
              series['sub:' + ent.entity + '_yest'] = await loadSeries(ent.entity, 'avg', 0, null, 1); 
            } catch (e) {}
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
  if (sm.open && sm.mode === 'metric') renderMetricModal();
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

/* ---------- Statusanzeige Rechts ---------- */
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
/* ---------- Konfigurierbare Klima-Kacheln (Modus / Lüfter / eigene) ---------- */
function DEFAULT_CLIMATE_TILES() {
  return [
    { type: 'hvac', show: true, label: 'Modus',  entity: '', attr: '', icon: 'sun' },
    { type: 'fan',  show: true, label: 'Lüfter', entity: '', attr: '', icon: 'fan' }
  ];
}
function getClimateTiles(room) {
  if (room && Array.isArray(room.climateTiles)) return room.climateTiles;
  const g = CONFIG.climate && CONFIG.climate.tiles;
  return Array.isArray(g) ? g : DEFAULT_CLIMATE_TILES();
}
const TILE_TOGGLE_DOMAINS = ['switch', 'input_boolean', 'light', 'humidifier', 'automation'];
function climateTileInfo(tile, c) {
  const type = tile.type || 'custom';
  const entity = String(tile.entity || c.entity || '').trim();
  const label = tile.label || (type === 'hvac' ? 'Modus' : type === 'fan' ? 'Lüfter' : 'Wert');
  const icon = ICONS[tile.icon] ? tile.icon : (type === 'hvac' ? 'sun' : type === 'fan' ? 'fan' : 'thermo');
  const out = { entity, label, icon, value: '—', act: false };
  const s = entity ? S(entity) : null;
  if (!s) return out;
  if (['unknown', 'unavailable'].includes(s.state)) { out.value = 'Nicht verfügbar'; return out; }
  const a = s.attributes || {}, d = dom(entity);
  const unit = tile.unit || (!tile.attr && a.unit_of_measurement) || '';
  const fmtRaw = v => {
    if (v == null || v === '') return '—';
    const n = Number(v);
    const isNum = typeof v !== 'boolean' && String(v).trim() !== '' && Number.isFinite(n);
    return (isNum ? fmt(n, tile.decimals ?? 1) : String(v)) + (unit ? ' ' + unit : '');
  };
  const shown = fallback => tile.attr ? fmtRaw(a[tile.attr]) : fallback;

  if (d === 'climate' && type === 'hvac') {
    out.value = shown(HVAC_DE[s.state] || s.state);
    out.act = (a.hvac_modes || []).length > 0;
  } else if (d === 'climate' && type === 'fan') {
    out.value = shown(a.fan_mode || '—');
    out.act = (a.fan_modes || []).length > 0;
  } else if (d === 'fan') {
    out.value = shown(s.state === 'off' ? 'Aus' : (a.preset_mode || (a.percentage != null ? `${a.percentage} %` : 'An')));
    out.act = true;
  } else if (d === 'select' || d === 'input_select') {
    out.value = shown(s.state);
    out.act = (a.options || []).length > 1;
  } else if (TILE_TOGGLE_DOMAINS.includes(d)) {
    out.value = shown(s.state === 'on' ? 'An' : s.state === 'off' ? 'Aus' : s.state);
    out.act = true;
  } else {
    out.value = tile.attr ? fmtRaw(a[tile.attr]) : fmtRaw(s.state);
  }
  return out;
}
function climateTilesHtml(c) {
  const list = (c.tiles || []).map((t, i) => ({ t, i })).filter(x => x.t && x.t.show !== false);
  if (!list.length) return '';
  return `<div class="two ctiles">${list.map(({ t, i }) => {
    const info = climateTileInfo(t, c);
    const inner = `${ic(info.icon, 18)}<span><small>${esc(info.label)}</small>${esc(info.value)}</span>`;
    return info.act ? `<button class="mini" data-act="ctile" data-i="${i}">${inner}</button>` : `<div class="mini">${inner}</div>`;
  }).join('')}</div>`;
}
function runClimateTile(tile, c) {
  if (!tile) return;
  const info = climateTileInfo(tile, c);
  if (!info.act) return;
  const e = info.entity, s = S(e);
  if (!s) return;
  const a = s.attributes || {}, d = dom(e);
  const next = (list, cur) => list[(list.indexOf(cur) + 1) % list.length];
  if (d === 'climate') {
    if (tile.type === 'hvac') call('climate', 'set_hvac_mode', { entity_id: e, hvac_mode: next(a.hvac_modes || [], s.state) });
    else call('climate', 'set_fan_mode', { entity_id: e, fan_mode: next(a.fan_modes || [], a.fan_mode) });
  } else if (d === 'select' || d === 'input_select') {
    call(d, 'select_option', { entity_id: e, option: next(a.options || [], s.state) });
  } else if (d === 'fan') {
    call('fan', 'toggle', { entity_id: e });
  } else {
    call('homeassistant', 'toggle', { entity_id: e });
  }
}

function activeClimate() {
  const r = (CONFIG.rooms || [])[ui.room] || {};
  if (r.climate) {
    const s = S(r.climate);
    if (s && !['unknown', 'unavailable'].includes(s.state)) {
      return { ...(CONFIG.climate || {}), entity: r.climate, name: r.name, type: 'climate', tiles: getClimateTiles(r) };
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
  return `<section class="card"><div class="ch"><b>${esc(title)}</b><span class="mut sm">Aktuell</span></div>
    <div class="gauge"><svg viewBox="0 0 200 175"><defs><linearGradient id="gg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="var(--ok)"/><stop offset="1" stop-color="var(--acc)"/></linearGradient></defs>
      <path d="${arc(100, 100, 78, A0, A0 + SW)}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="9" stroke-linecap="round"/>
      <path d="${arc(100, 100, 78, A0, curA)}" fill="none" stroke="url(#gg)" stroke-width="9" stroke-linecap="round"/>
      ${tgt != null ? `<circle cx="${k[0].toFixed(1)}" cy="${k[1].toFixed(1)}" r="6" fill="#fff" stroke="var(--acc)" stroke-width="3"/>` : ''}</svg>
      <div class="gc"><div class="v">${fmt(cur, 1)}<sup>°C</sup></div><div class="mut sm">${label}${tgt != null ? ' · Soll ' + fmt(tgt, 1) + '°' : ''}</div>
        <div class="b"><button data-act="tmin">−</button><button data-act="tplus">+</button></div></div></div>
    ${climateTilesHtml(c)}</section>`;
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
    <div class="chart${m.chart ? ' clickable' : ''}" ${m.chart ? `data-act="chartModal" data-type="metric" data-mid="${esc(m.id)}" title="Antippen für Großansicht"` : ''}>${spark(series[m.chart], m.id, { unit: m.chartUnit || m.unit || '', dec: m.decimals ?? 1 }, series[m.chart + '_yest'])}</div></div>${extraHTML}</section>`;
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

function getMainLightEntities() {
  const lm = CONFIG.lightsMain || { mode: 'group', group: 0, entities: [] };
  let ents = [];
  if (lm.mode === 'all') {
    (CONFIG.lights || []).forEach(g => {
      if (g.mainSync !== false) ents.push(...(g.entities || []));
    });
  } else if (lm.mode === 'custom') {
    ents = lm.entities || [];
  } else {
    const g = (CONFIG.lights || [])[lm.group || 0];
    if (g) ents = g.entities || [];
  }
  return [...new Set(ents)]; // Duplikate entfernen
}

function lightsCard() {
  const gs = CONFIG.lights || [];
  if (!gs.length) return '';
  const mainEnts = getMainLightEntities();
  const main = groupInfo({ entities: mainEnts });
  const tiles = gs.map((g, i) => { const gi = groupInfo(g); return `<button class="tile ${gi.on ? 'on' : ''}" data-act="lgrp" data-i="${i}">${ic('bulb', 18)}<span><b>${esc(g.name)}</b><small>${gi.on}/${gi.total} an</small></span></button>`; }).join('');
  return `<section class="card"><div class="ch"><b>Lichter</b><div class="sw ${main.on ? 'on' : ''}" data-act="lgrpMain"><i></i></div></div><div class="tiles">${tiles}</div></section>`;
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
      const s = S(c.entity), a = (s && s.attributes) || {};
      const unit = (c.title || '').includes('Luftfeucht') ? '%' : (a.unit_of_measurement || '°C');
      return `<div class="kc" style="cursor:pointer;border-radius:10px;padding:6px;margin:6px -6px 0;transition:background .15s" onmouseover="this.style.background='rgba(255,255,255,.05)'" onmouseout="this.style.background='transparent'" data-act="chartModal" data-type="klima" data-entity="${esc(c.entity)}" data-attr="${esc(c.attr || '')}" data-name="${esc(c.title || '')}" data-unit="${esc(unit)}" data-dec="${c.decimals ?? 1}" title="Antippen für Großansicht">
        <div class="kct" style="pointer-events:none"><span>${esc(c.title || '')}</span><span class="mut sm">24 h</span></div>
        <div style="pointer-events:none">${spark(series[key], 'k' + c.entity + (c.attr || ''), { fit: true, min: c.min, max: c.max, W: 320, H: 90, dec: c.decimals, unit })}</div>      </div>`;
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
    return `<div class="stat-line">
      <div><div class="sm mut">${esc(item.name)}</div><div class="stat-value">${esc(val)}</div></div>
      <div class="chart clickable" data-act="chartModal" data-type="stat" data-entity="${esc(item.entity)}" data-attr="${esc(item.attr || '')}" data-name="${esc(item.name)}" data-unit="${esc(unit)}" data-dec="${item.decimals ?? 1}" data-mode="${esc(item.mode || 'avg')}" title="Antippen für Großansicht">${spark(series[key], 'stats-' + item.entity + (item.attr || ''), { fit: true, W: 320, H: 65, dec: item.decimals ?? 1, color: item.color, unit })}</div>
    </div>`;
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
  if (w.type === 'buli_team') return buliTeamCard(w);
  if (w.type === 'buli_matchday') return buliMatchdayCard(w);
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
  if (w.type === 'buli_table') return buliTableCard(w);
  if (w.type === 'f1_next') return f1NextRaceCard(w);
  if (w.type === 'f1_standings') return f1StandingsCard(w);
  return '';
}

function buliTeamCard(w) {
  const entities = String(w.entity || 'sensor.sc_freiburg').split(',').map(e => e.trim()).filter(Boolean);
  const title = w.title || 'Mein Verein';

  if (!entities.length) {
    return `<section class="card"><div class="ch"><div style="display:flex;align-items:center;gap:9px">${ic('soccer',18)}<b>${esc(title)}</b></div></div><div class="mut sm" style="padding:8px 0">Keine Entitäten angegeben.</div></section>`;
  }

  // Alle Teams auslesen und mit Status-Priorität versehen
  const teamData = entities.map(e => {
    const s = S(e);
    if (!s || !s.attributes || s.attributes.team_score === undefined) {
      return { entity: e, valid: false };
    }
    const status = s.state; // IN, PRE, POST
    // Priorität für Sortierung: Live (0) -> Anstehend/Pre (1) -> Beendet (2)
    const prio = status === 'IN' ? 0 : (status === 'PRE' ? 1 : 2);
    const dateMs = s.attributes.date ? new Date(s.attributes.date).getTime() : 0;
    return { entity: e, s, a: s.attributes, status, prio, dateMs, valid: true };
  });

  // Automatische Sortierung: Live-Spiele zuerst, dann nach Anstoßzeit / Status
  teamData.sort((x, y) => {
    if (!x.valid) return 1;
    if (!y.valid) return -1;
    if (x.prio !== y.prio) return x.prio - y.prio;
    return x.dateMs - y.dateMs;
  });

  const cards = teamData.map((item, idx) => {
    if (!item.valid) {
      return `<div class="mut sm" style="padding:16px">Warte auf Daten von ${esc(item.entity)}...</div>`;
    }

    const a = item.a;
    const status = item.status;
    const isLive = status === 'IN';
    const isPost = status === 'POST';

    const home = a.team_name || 'Heim';
    const away = a.opponent_name || 'Gast';
    const hScore = a.team_score !== null ? a.team_score : '-';
    const aScore = a.opponent_score !== null ? a.opponent_score : '-';

    const dateStr = a.date ? new Date(a.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' }) : '';
    const timeStr = a.date ? new Date(a.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : '';

    let statusText = 'Nächstes Spiel in Vorbereitung';
    let statusIcon = 'check';
    let statusColor = 'var(--ok)';
    let subText = `Letzter Gegner: ${a.opponent_long_name || away}`;

    if (isLive) {
      statusText = 'LIVE Ticker';
      statusIcon = 'race';
      statusColor = 'var(--warn)';
      subText = `Aktueller Gegner: ${a.opponent_long_name || away}`;
    } else if (isPost) {
      statusText = 'Spiel beendet (FT)';
    } else {
      statusIcon = 'calendar';
      subText = `Nächster Gegner: ${a.opponent_long_name || away} (${timeStr} Uhr)`;
    }

    const borderBottom = idx === teamData.length - 1 ? 'none' : '1px solid var(--line)';

    return `
      <div style="border-bottom:${borderBottom};">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 24px;text-align:center">
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:8px">
            <img src="${a.team_logo || ''}" style="width:48px;height:48px;object-fit:contain" alt="">
            <span style="font-weight:600;font-size:14px">${esc(home)}</span>
          </div>
          <div style="flex:1;display:flex;flex-direction:column;gap:4px">
            <div style="font-size:32px;font-weight:800;letter-spacing:2px;line-height:1;color:${isLive ? 'var(--warn)' : 'inherit'}">${hScore} : ${aScore}</div>
            <div style="color:var(--mut);font-size:12px;font-weight:500">${isPost ? 'FT - ' : ''}${dateStr}</div>
          </div>
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:8px">
            <img src="${a.opponent_logo || ''}" style="width:48px;height:48px;object-fit:contain" alt="">
            <span style="font-weight:600;font-size:14px">${esc(away)}</span>
          </div>
        </div>
        <div style="padding:12px 16px;background:rgba(255,255,255,.03);border-top:1px solid var(--line);display:flex;align-items:center;gap:12px">
          <div style="color:${statusColor};display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:color-mix(in srgb, ${statusColor} 15%, transparent)">${ic(statusIcon, 14)}</div>
          <div><b style="display:block;font-size:13px">${statusText}</b><small style="color:var(--mut);font-size:11px;display:block;margin-top:2px">${esc(subText)}</small></div>
        </div>
      </div>
    `;
  }).join('');

  return `<section class="card" style="padding:0;overflow:hidden;border:1px solid #6a74d3">
    <div style="padding:14px 16px 0"><div class="ch" style="margin:0"><div style="display:flex;align-items:center;gap:9px">${ic('soccer',18)}<b>${esc(title)}</b></div></div></div>
    <div style="display:flex;flex-direction:column;">
      ${cards}
    </div>
  </section>`;
}

function buliMatchdayCard(w) {
  const title = w.title || 'Spieltag Übersicht';
  const h = getHass();

  if (!h || !h.states) return `<section class="card"><div class="ch"><b>${esc(title)}</b></div><div class="mut sm">Keine Daten...</div></section>`;

  // Filtert automatisch alle Teamtracker-Entitäten, die als "home" markiert sind
  const matches = Object.values(h.states).filter(s =>
    s.entity_id.startsWith('sensor.') &&
    s.attributes &&
    s.attributes.team_homeaway === 'home' &&
    s.attributes.team_score !== undefined
  ).sort((a, b) => {
    const da = a.attributes.date ? new Date(a.attributes.date).getTime() : 0;
    const db = b.attributes.date ? new Date(b.attributes.date).getTime() : 0;
    return da - db;
  });

  const rows = matches.map(s => {
    const a = s.attributes;
    const status = s.state;
    const home = a.team_name || 'Heim';
    const away = a.opponent_name || 'Gast';
    const hScore = a.team_score !== null ? a.team_score : 0;
    const aScore = a.opponent_score !== null ? a.opponent_score : 0;

    let timeStr = '';
    if (status === 'IN' || status === 'POST') {
      timeStr = `Ergebnis: ${hScore} : ${aScore}`;
    } else if (a.date) {
      const d = new Date(a.date);
      timeStr = d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }) + '. • ' + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr';
    }

    let color = 'var(--mut)';
    if (status === 'IN') color = 'var(--ok)';
    else if (status === 'PRE') color = 'var(--warn)';

    return `<div style="display:flex;align-items:center;gap:14px;padding:12px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.05);border-radius:12px;margin-bottom:8px">
      <div style="color:${color};width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.05);display:grid;place-items:center;flex:none">${ic('soccer', 18)}</div>
      <div style="min-width:0;flex:1">
        <div style="font-weight:600;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(home)} — ${esc(away)}</div>
        <div style="color:var(--mut);font-size:12px;margin-top:3px">${esc(timeStr)}</div>
      </div>
    </div>`;
  }).join('');

  return `<section class="card">
    <div class="ch" style="margin-bottom:16px"><div style="display:flex;align-items:center;gap:9px">${ic('soccer',18)}<b>${esc(title)}</b></div></div>
    <div style="display:flex;flex-direction:column">${rows || '<div class="mut sm" style="padding:8px 0">Keine Spiele gefunden. (Teamtracker Integration prüfen)</div>'}</div>
  </section>`;
}

function buliTableCard(w) {
  const e = w.entity || 'sensor.bund_scoreboard2';
  const t = w.title || 'Bundesliga';
  const s = S(e);
  
  if (!s || !s.attributes || !s.attributes.entries) {
    return `<section class="card"><div class="ch"><div style="display:flex;align-items:center;gap:9px">${ic('soccer',18)}<b>${esc(t)}</b></div></div><div class="mut sm" style="padding:8px 0">Warte auf Daten von ${esc(e)}...</div></section>`;
  }
  
  const clean = n => ({"Bayern Munich":"FC Bayern","Borussia Dortmund":"BVB","Bayer Leverkusen":"Leverkusen","Hamburg SV":"HSV","FC Cologne":"Köln","Werder Bremen":"Bremen","VfL Wolfsburg":"Wolfsburg","1. FC Heidenheim 1846":"Heidenheim","Borussia Moenchengladbach":"Gladbach","Borussia Mönchengladbach":"Gladbach","Eintracht Frankfurt":"Frankfurt","TSG Hoffenheim":"Hoffenheim","VfB Stuttgart":"Stuttgart","RB Leipzig":"RB Leipzig","FC Augsburg":"Augsburg","1. FC Union Berlin":"Union Berlin","St. Pauli":"St. Pauli"}[n] || n);
  
  const rows = s.attributes.entries.map(ent => {
    const tm = ent.team, st = ent.stats;
    const gs = n => (st.find(x => x.name === n)?.value || 0);
    const gd = n => (st.find(x => x.name === n)?.displayValue || '0');
    const diff = gs('pointDifferential');
    const dCls = diff > 0 ? 'color:var(--ok)' : (diff < 0 ? 'color:var(--warn)' : 'color:var(--mut)');
    const bg = (tm.name === "SC Freiburg" || tm.location === "SC Freiburg") ? 'on' : '';
    const logo = tm.logos?.[0]?.href || '';
    const col = ent.note?.color || 'transparent';
    
    return `<div class="buli-row ${bg}">
      <div class="buli-c" style="background:${col}"></div>
      <div class="text-center font-bold" style="width:20px">${gs('rank')}</div>
      <div style="flex:1;display:flex;align-items:center;gap:8px;min-width:0"><img src="${logo}" style="width:18px;height:18px;object-fit:contain" alt=""><b style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(clean(tm.displayName))}</b></div>
      <div class="text-center" style="width:18px">${gs('gamesPlayed')}</div>
      <div class="text-center" style="width:18px">${gs('wins')}</div>
      <div class="text-center" style="width:18px">${gs('ties')}</div>
      <div class="text-center" style="width:18px">${gs('losses')}</div>
      <div class="text-center mut sm" style="width:34px">${gs('pointsFor')}:${gs('pointsAgainst')}</div>
      <div class="text-center" style="width:28px;${dCls}">${gd('pointDifferential')}</div>
      <div class="text-center font-bold" style="width:26px;color:var(--acc2)">${gs('points')}</div>
    </div>`;
  }).join('');
  
  return `<section class="card">
    <div class="ch" style="margin-bottom:12px"><div style="display:flex;align-items:center;gap:9px">${ic('soccer',18)}<b>${esc(t)}</b></div></div>
    <div class="buli-row h">
      <div class="buli-c" style="background:transparent"></div>
      <div class="text-center" style="width:20px">Pl</div>
      <div style="flex:1">Verein</div>
      <div class="text-center" style="width:18px" title="Spiele">Sp</div>
      <div class="text-center" style="width:18px" title="Siege">S</div>
      <div class="text-center" style="width:18px" title="Unentschieden">U</div>
      <div class="text-center" style="width:18px" title="Niederlagen">N</div>
      <div class="text-center" style="width:34px">Tore</div>
      <div class="text-center" style="width:28px" title="Tordifferenz">Dif</div>
      <div class="text-center" style="width:26px">Pkt</div>
    </div>
    <div style="display:flex;flex-direction:column">${rows}</div>
  </section>`;
}


/* ---------- Formel 1 Widgets (Exakt auf Nicxe/f1_sensor v6 abgestimmt) ---------- */
function getF1TeamColor(team) {
  const t = (team || '').toLowerCase();
  if (t.includes('red bull') || t.includes('rbr')) return '#3671C6';
  if (t.includes('mercedes')) return '#00D7B6';
  if (t.includes('ferrari')) return '#ED1131';
  if (t.includes('mclaren')) return '#F47600';
  if (t.includes('aston')) return '#229971';
  if (t.includes('alpine')) return '#00A1E8';
  if (t.includes('williams')) return '#1868DB';
  if (t.includes('racing bulls') || t.includes('rb')) return '#6C98FF';
  if (t.includes('sauber') || t.includes('stake') || t.includes('alfa')) return '#00E701';
  if (t.includes('haas')) return '#9C9FA2';
  if (t.includes('audi')) return '#F50537';
  if (t.includes('cadillac')) return '#909090';
  return '#8b8fa8';
}

function f1NextRaceCard(w) {
  const e = w.entity || 'sensor.f1_next_race';
  const s = S(e) || S('sensor.f1_race_f1_next_race');
  if (!s || ['unknown', 'unavailable'].includes(s.state)) {
    return `<section class="f1-card"><div class="ch"><b>Nächstes Rennen</b></div><div class="mut sm">Warte auf Daten von ${esc(e)}...</div></section>`;
  }

  const a = s.attributes || {};
  const raceName = a.race_name || 'Mexico City Grand Prix';
  const circuit = a.circuit_name || 'Autódromo Hermanos Rodríguez';
  const loc = [a.circuit_locality, a.circuit_country].filter(Boolean).join(', ');
  const round = a.round ? `Round ${a.round}` : '';
  const mapUrl = a.circuit_map_url || a.circuit_outline_url || '';
  const flagUrl = a.country_flag_url || '';

  // Zielzeitpunkt für den Countdown (Rennstart)
  const targetIso = a.race_start || a.race_start_utc || s.state;
  const targetMs = targetIso ? new Date(targetIso).getTime() : 0;

  // Session-Planung aus den echten Attributen aufbauen
  const rawSessions = [
    { name: 'FP1', iso: a.first_practice_start || a.first_practice_start_utc },
    { name: 'FP2', iso: a.second_practice_start || a.second_practice_start_utc },
    { name: 'FP3', iso: a.third_practice_start || a.third_practice_start_utc },
    { name: 'Sprint Quali', iso: a.sprint_qualifying_start || a.sprint_qualifying_start_utc },
    { name: 'Sprint', iso: a.sprint_start || a.sprint_start_utc },
    { name: 'Qualifying', iso: a.qualifying_start || a.qualifying_start_utc },
    { name: 'Race', iso: targetIso, highlight: true }
  ].filter(x => x.iso);

  const nowMs = Date.now();
  let nextFound = false;

  const sessionRows = rawSessions.map(ses => {
    const dObj = new Date(ses.iso);
    const isPast = dObj.getTime() < nowMs;
    const isNext = !isPast && !nextFound;
    if (isNext) nextFound = true;

    const dFmt = isNaN(dObj) ? ses.iso : dObj.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: 'short' });
    const tFmt = isNaN(dObj) ? '' : dObj.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr';

    return `<div class="f1-sched-row ${isPast ? 'mut' : ''}" style="${isPast ? 'opacity:0.45' : ''}">
       <div>
         <div class="f1-sched-name">${esc(ses.name)}</div>
         <div class="mut" style="font-size:11px">${dFmt} · ${tFmt}</div>
       </div>
       ${isNext ? `<div class="f1-sched-badge">NEXT</div>` : ''}
    </div>`;
  }).join('');

  return `<section class="f1-card">
    <div class="f1-header">
      <div style="display:flex;align-items:center;gap:10px">
        ${flagUrl ? `<img src="${flagUrl}" style="width:26px;height:18px;object-fit:cover;border-radius:3px" alt="">` : ''}
        <div>
          <div class="f1-title">${esc(raceName)}</div>
          <div class="mut sm" style="text-transform:uppercase;letter-spacing:1px">${esc(circuit)}${loc ? ' · ' + esc(loc) : ''}</div>
        </div>
      </div>
    </div>

    ${targetMs ? `<div class="f1-timer-wrap">
      <div class="mut sm" style="letter-spacing:1px">COUNTDOWN</div>
      <div class="f1-timer" data-target="${targetMs}">Berechne...</div>
      <div class="mut sm">to lights out</div>
    </div>` : ''}

    ${mapUrl ? `<div class="f1-map">
      <div class="mut sm" style="text-align:left;letter-spacing:1px;margin-bottom:8px">CIRCUIT MAP</div>
      <img src="${mapUrl}" alt="Track Map">
      <div class="mut sm" style="margin-top:8px">${esc(circuit)} ${round ? '· ' + esc(round) : ''}</div>
    </div>` : ''}

    ${sessionRows ? `<div style="display:flex;flex-direction:column;gap:4px">
      <div class="mut sm" style="text-transform:uppercase;letter-spacing:1px;margin:8px 0 4px">Weekend Schedule</div>
      ${sessionRows}
    </div>` : ''}
  </section>`;
}

function f1StandingsCard(w) {
  const e = w.entity || 'sensor.f1_driver_standings';
  const s = S(e) || S('sensor.f1_championship_f1_driver_standings');
  if (!s || !s.attributes) {
    return `<section class="f1-card"><div class="ch"><b>WM-Stand (Fahrer)</b></div><div class="mut sm">Warte auf Daten von ${esc(e)}...</div></section>`;
  }

  const a = s.attributes;
  const list = a.driver_standings || a.standings || a.drivers || [];

  if (!list.length) {
    return `<section class="f1-card"><div class="ch"><b>WM-Stand (Fahrer)</b></div><div class="mut sm">Keine Tabellendaten gefunden.</div></section>`;
  }

  const rows = list.map((d, idx) => {
    const pos = d.position || (idx + 1);
    const drv = d.Driver || {};
    const code = drv.code || d.code || '—';
    const constr = (d.Constructors && d.Constructors[0]) || {};
    const teamName = constr.name || d.team || '';
    const color = getF1TeamColor(teamName);
    const pts = d.points || 0;

    return `<div class="f1-driver-row">
      <div class="f1-pos">${pos}</div>
      <div class="f1-bar" style="background:${color}"></div>
      <div style="flex:1;min-width:0">
        <div class="f1-code" style="color:${color}">${esc(code)}</div>
        <div class="f1-team">${esc(teamName)}</div>
      </div>
      <div class="f1-pts">${pts}</div>
    </div>`;
  }).join('');

  return `<section class="f1-card" style="padding:0">
    <div style="padding:16px;background:rgba(255,255,255,.02);border-bottom:1px solid var(--line);text-align:center">
      <div style="font-size:18px;font-weight:700;letter-spacing:1px;text-transform:uppercase">WM-Stand (Fahrer)</div>
      <div class="mut sm" style="letter-spacing:2px;margin-top:2px">SEASON ${esc(a.season || '2026')}</div>
    </div>
    <div style="display:flex;flex-direction:column;padding:8px 16px 16px">${rows}</div>
  </section>`;
}

function customPageView(pageId) {
  const page = (CONFIG.customPages || []).find(p => p.id === pageId);
  if (!page) return `<div class="mut">Seite nicht gefunden.</div>`;
  const widgetsHtml = (page.widgets || []).map(renderCustomWidget).join('');
  const layoutCls = page.layout === 'column' ? 'page-column' : 'page-grid';
  return `${pageHeader(page.eyebrow, page.title || page.label, page.intro)}<div class="${layoutCls}">${widgetsHtml || '<div class="mut">Noch keine Widgets auf dieser Seite.</div>'}</div>`;
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

  const nowHour = new Date().getHours();
  const rows = (btn.entities || []).map(ent => {
    const s = S(ent.entity);
    const v = s && s.state && !['unknown','unavailable'].includes(s.state) ? parseFloat(s.state) : NaN;
    const valStr = !isNaN(v) ? `${fmt(v, 1)} ${ent.unit || ''}` : (s ? s.state : '—');
    
    // Verlaufsdaten für heute (ser) und gestern (serYest) laden
    const ser = series['sub:' + ent.entity] || [];
    const serYest = series['sub:' + ent.entity + '_yest'] || [];

    // Ermittlung von Maximum und Minimum aus der Serie für die Info-Anzeige
    let maxInfo = '—', minInfo = '—';
    if (ser.filter(x => x != null).length > 0) {
      const valid = ser.map((val, idx) => ({ val, idx })).filter(x => x.val != null);
      if (valid.length) {
        const maxObj = valid.reduce((max, cur) => cur.val > max.val ? cur : max, valid[0]);
        const minObj = valid.reduce((min, cur) => cur.val < min.val ? cur : min, valid[0]);
        const maxH = (nowHour - ser.length + 1 + maxObj.idx + 24) % 24;
        const minH = (nowHour - ser.length + 1 + minObj.idx + 24) % 24;
        maxInfo = `${fmt(maxObj.val, 1)} ${ent.unit || ''} (um ${pad(maxH)}:00 Uhr)`;
        minInfo = `${fmt(minObj.val, 1)} ${ent.unit || ''} (um ${pad(minH)}:00 Uhr)`;
      }
    }

    // Chart mit heutiger Linie (durchgehend) und gestriger Linie (gestrichelt)
    const chartHtml = ent.chart ? `<div class="chart" style="width:100%;margin-top:12px">${spark(ser, 'sub' + ent.entity, { fit: true, W: 650, H: 150, color: `var(--${btn.color || 'acc'})` }, serYest)}</div>` : '';
    
    return `<div class="sr col" style="background:rgba(255,255,255,.03);padding:16px;border-radius:14px;border:1px solid var(--line);margin-bottom:14px;align-items:stretch;gap:8px;">
      <div class="srl" style="display:flex;justify-content:space-between;align-items:center;width:100%;">
        <span style="font-weight:600;font-size:14px;color:#f2f3fa">${esc(ent.name)}</span>
        <b style="font-size:18px">${esc(valStr)}</b>
      </div>
      <div style="display:flex;gap:16px;font-size:11px;color:var(--mut);flex-wrap:wrap">
        <span>📈 Höchstwert: <strong style="color:var(--txt)">${maxInfo}</strong></span>
        <span>📉 Tiefstwert: <strong style="color:var(--txt)">${minInfo}</strong></span>
      </div>
      <div style="font-size:10px;color:var(--mut)">Durchgezogene Linie: Heute · Gestrichelte Linie: Gestern (letzte 24h)</div>
      ${chartHtml}
    </div>`;
  }).join('');

  document.getElementById('smsheet').innerHTML = `
    <div class="smh" style="margin-bottom:18px;">
      <div style="display:flex;align-items:center;gap:10px;color:var(--${btn.color || 'acc'})">${ic(btn.icon, 22)} <b style="color:var(--txt);font-size:18px">${esc(btn.name)}</b></div>
      <button class="x2" data-act="smClose">✕</button>
    </div>
    ${rows}`;
  
  if (!isUpdate) document.getElementById('sm').classList.add('show');
}


function getChartCtx() {
  if (sm.chartType === 'metric') {
    const m = (CONFIG.metrics || []).find(x => x.id === sm.metricId);
    if (!m) return null;
    return {
      id: m.id, title: m.title || 'Verlauf', mode: m.mode || 'avg', dec: m.decimals ?? 1,
      ent: m.chart, attr: null, unit: m.unit || '', cUnit: m.chartUnit || '',
      todayVal: num(m.entity), liveVal: num(m.chart),
      key24: m.chart, prev24: m.chart + '_yest', key7: '7d:' + m.chart
    };
  }
  
  // Für Custom Pages (stat) & Klima-Charts (klima)
  const isKlima = sm.chartType === 'klima';
  const s = S(sm.cEnt), a = (s && s.attributes) || {};
  const rawVal = s ? (sm.cAttr ? a[sm.cAttr] : s.state) : null;
  const val = rawVal != null ? parseFloat(rawVal) : null;
  const kBase = (isKlima ? '24:' : 'stats:') + sm.cEnt + (sm.cAttr ? ':' + sm.cAttr : '');
  
  return {
    id: sm.cEnt + (sm.cAttr || ''), title: sm.cName || 'Verlauf', mode: sm.cMode || 'avg', dec: sm.cDec,
    ent: sm.cEnt, attr: sm.cAttr, unit: sm.cUnit || '', cUnit: sm.cUnit || '',
    todayVal: val, liveVal: val,
    key24: kBase, prev24: kBase + '_yest', key7: '7d:' + kBase
  };
}

async function ensure24hPrevLoaded() {
  const ctx = getChartCtx();
  if (!ctx || series[ctx.prev24] !== undefined) return;
  series[ctx.prev24] = null; // Doppeltes Laden verhindern
  try {
    series[ctx.prev24] = await loadSeries(ctx.ent, ctx.mode, 24, ctx.attr, 1);
    if (sm.open && sm.mode === 'chart' && sm.range === '24h') renderChartModal();
  } catch (e) {}
}

async function loadChartRange() {
  const ctx = getChartCtx();
  if (!ctx || sm.range !== '7d') return;
  if (series[ctx.key7] && series[ctx.key7 + '_t'] && Date.now() - series[ctx.key7 + '_t'] < 5 * 60 * 1000) return;
  
  sm.loading = true; renderChartModal();
  try {
    const [cur, prev] = await Promise.all([
      loadSeries(ctx.ent, ctx.mode, 168, ctx.attr),
      loadSeries(ctx.ent, ctx.mode, 168, ctx.attr, 7).catch(() => null)
    ]);
    series[ctx.key7] = cur; series[ctx.key7 + '_prev'] = prev; series[ctx.key7 + '_t'] = Date.now();
  } catch (e) {
    series[ctx.key7] = null; series[ctx.key7 + '_prev'] = null;
  }
  sm.loading = false;
  if (sm.open && sm.mode === 'chart') renderChartModal();
}

function renderChartModal() {
  const ctx = getChartCtx(); if (!ctx) return;
  const is7 = sm.range === '7d';
  const ser = is7 ? series[ctx.key7] : series[ctx.key24];
  const prev = is7 ? series[ctx.key7 + '_prev'] : series[ctx.prev24];

  const pts = (ser || []).map((v, i) => ({ v, i })).filter(p => p.v != null);
  let stats = '';
  if (pts.length) {
    const hi = pts.reduce((a, b) => (b.v > a.v ? b : a));
    const lo = pts.reduce((a, b) => (b.v < a.v ? b : a));
    const avg = pts.reduce((sum, p) => sum + p.v, 0) / pts.length;
    const when = p => {
      const d = seriesPointDate(p.i, ser.length);
      return is7 ? `${d.toLocaleDateString('de-DE', { weekday: 'short' })}, ${pad(d.getHours())}:00 Uhr` : `um ${pad(d.getHours())}:00 Uhr`;
    };
    stats = `<div class="mc-stats">
      <span>📈 Höchstwert: <strong>${fmt(hi.v, 1)} ${esc(ctx.cUnit)}</strong> (${esc(when(hi))})</span>
      <span>📉 Tiefstwert: <strong>${fmt(lo.v, 1)} ${esc(ctx.cUnit)}</strong> (${esc(when(lo))})</span>
      <span>Ø <strong>${fmt(avg, 1)} ${esc(ctx.cUnit)}</strong></span></div>`;
  }

  const chartHtml = (is7 && sm.loading)
    ? '<div class="mut sm" style="padding:70px 0;text-align:center">Lade Verlaufsdaten …</div>'
    : `<div class="chart chart-big" style="margin-top:6px">${spark(ser, 'mc' + ctx.id + (is7 ? '7' : '1'), { fit: true, W: 650, H: 240, range7: is7, unit: ctx.cUnit || ctx.unit || '', dec: ctx.dec }, prev)}</div>`;

  const topVals = sm.chartType === 'metric' ? `
    <div><div class="mc-big">${fmt(ctx.todayVal, ctx.dec)}<span class="unit">${esc(ctx.unit)}</span></div><small>Heute</small></div>
    ${ctx.liveVal != null ? `<div><div class="mc-big">${fmt(ctx.liveVal, 0)}<span class="unit">${esc(ctx.cUnit)}</span></div><small>${ctx.mode === 'last' ? 'Letzter Wert' : 'Aktuell'}</small></div>` : ''}
  ` : `
    <div><div class="mc-big">${fmt(ctx.todayVal, ctx.dec)}<span class="unit">${esc(ctx.cUnit)}</span></div><small>Aktuell</small></div>
  `;

  const sheet = document.getElementById('smsheet');
  sheet.classList.remove('wfc-wide');
  sheet.innerHTML = `
    <div class="smh"><b>${esc(ctx.title)}</b><button class="x2" data-act="smClose">✕</button></div>
    <div class="mc-top">${topVals}</div>
    <div class="wfc-tabs">
      <button class="wfc-tab ${is7 ? '' : 'on'}" data-act="chartRange" data-r="24h">24 Stunden</button>
      <button class="wfc-tab ${is7 ? 'on' : ''}" data-act="chartRange" data-r="7d">7 Tage</button>
    </div>
    ${chartHtml}${stats}
    <div class="mut" style="margin-top:8px;font-size:10px">Durchgezogen: ${is7 ? 'letzte 7 Tage' : 'letzte 24 Stunden'} · Gestrichelt: ${is7 ? 'die 7 Tage davor' : 'dieselben 24h am Vortag'}</div>`;
}

function openChartModal(el) {
  sm.mode = 'chart';
  sm.chartType = el.dataset.type;
  sm.metricId = el.dataset.mid;
  sm.cEnt = el.dataset.entity;
  sm.cAttr = el.dataset.attr;
  sm.cName = el.dataset.name;
  sm.cUnit = el.dataset.unit;
  sm.cDec = parseInt(el.dataset.dec || '1', 10);
  sm.cMode = el.dataset.mode || 'avg';
  sm.range = '24h';
  sm.loading = false;
  sm.open = true;
  renderChartModal();
  document.getElementById('sm').classList.add('show');
  ensure24hPrevLoaded(); // Lädt Gestern-Vergleich für Nicht-Metrik-Charts fließend nach
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
    const when = days === 0 ? 'Heute' : days === 1 ? 'Morgen' : `in ${days} Tagen`;
    return { ...ev, days, when, type: wasteType(ev.summary) };
  });
}

function evalBadgeCondition(ent, op, val) {
  if (!ent || !op) return true; // Keine Bedingung = immer anzeigen
  const s = S(ent); if (!s || !stateIsUsable(s)) return false;
  const vNum = parseFloat(s.state);
  const valNum = parseFloat(val);
  if (op === '>') return !isNaN(vNum) && vNum > valNum;
  if (op === '<') return !isNaN(vNum) && vNum < valNum;
  if (op === '==') return String(s.state).trim() === String(val).trim();
  if (op === '!=') return String(s.state).trim() !== String(val).trim();
  if (op === 'not_empty') return true;
  return true;
}

function parseBadgeColor(logicStr, w1, w2) {
  if (!logicStr) return 'blue';
  const rules = logicStr.split(',').map(r => r.trim());
  const checkVal = parseFloat(w1);
  for (const r of rules) {
    const [cond, color] = r.split(':').map(x => x.trim());
    if (!color) continue;
    if (cond === 'default') return color;
    if (!isNaN(checkVal)) {
      if (cond.startsWith('>') && checkVal > parseFloat(cond.slice(1))) return color;
      if (cond.startsWith('<') && checkVal < parseFloat(cond.slice(1))) return color;
      if (cond.startsWith('==') && checkVal === parseFloat(cond.slice(2))) return color;
    } else {
      if (cond === w1) return color; // Text-Match (z. B. "on:green")
    }
  }
  return 'blue'; // Fallback
}

function getBadgeValue(ent) {
  if (!ent) return '';
  const s = S(ent); if (!s || !stateIsUsable(s)) return '';
  // Automatische Erkennung, ob es ein Datum/Uhrzeit für den Countdown ist
  if (/^\d{4}-\d{2}-\d{2}/.test(s.state) || s.attributes.device_class === 'timestamp') {
    return formatCountdown(ent);
  }
  return parseFloat(s.state) ? fmt(parseFloat(s.state), 1) : s.state;
}

function homeHeaderBadges() {
  const items = CONFIG.headerBadgeItems || [];
  const badges = [];

  items.forEach(b => {
    if (b.type === 'calendar') {
      getUpcomingTrashItems(b.maxDays || 2).forEach(item => {
        badges.push({ icon: item.type.icon, cls: 'trash', style: `--trash-c:${item.type.color}`, title: item.summary, value: item.when });
      });
      return;
    }

    if (!evalBadgeCondition(b.conditionEnt, b.conditionOp, b.conditionVal)) return;

    const w1Raw = getBadgeValue(b.entity1);
    const w2Raw = getBadgeValue(b.entity2);
    
    // Wenn W1 leer ist und zwingend benötigt wird, Badge verstecken
    if (b.entity1 && !w1Raw) return; 

    let text = (b.format || '[W1]').replace('[W1]', w1Raw).replace('[W2]', w2Raw);
    if (text.includes('Jetzt')) text = 'Fertig';

    const colorCls = parseBadgeColor(b.colorLogic, w1Raw, w2Raw);
    badges.push({ icon: b.icon || 'plug', cls: colorCls, title: b.title, value: text });
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
let lastOpenedBoxKey = null;

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

const CTILE_TYPE_OPTIONS = [
  ['hvac', 'Modus (Betriebsart durchschalten)'],
  ['fan', 'Lüfter (Stufe durchschalten / Ein-Aus)'],
  ['custom', 'Eigener Wert / Schalter']
];
function getTileArr(scope) {
  if (!cfgDraft) return null;
  if (scope === 'g') return cfgDraft.climate && cfgDraft.climate.tiles;
  const r = cfgDraft.rooms[+scope];
  return r && r.climateTiles;
}
function climateTilesEditorHtml(scope) {
  const tiles = getTileArr(scope) || [];
  const rows = tiles.map((t, i) => {
    const at = `data-ct-s="${scope}" data-ct-i="${i}"`;
    const defIcon = t.type === 'fan' ? 'fan' : t.type === 'custom' ? 'thermo' : 'sun';
    return `<div class="cfg-row" style="background:rgba(255,255,255,.025);padding:8px;border-radius:8px;border:1px solid var(--line)">
      <label><input type="checkbox" ${at} data-ct-k="show" ${t.show !== false ? 'checked' : ''}> Anzeigen</label>
      <div class="cfg-field"><label>Typ</label>
        <select class="cfg-in" ${at} data-ct-k="type">${CTILE_TYPE_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(t.type || 'custom') === val ? 'selected' : ''}>${lab}</option>`).join('')}</select>
      </div>
      <div class="cfg-field"><label>Bezeichnung</label><input class="cfg-in" ${at} data-ct-k="label" placeholder="Modus / Lüfter" value="${esc(t.label || '')}"></div>
      <div class="cfg-field"><label>Entität (leer = Klima-Entität des Raums)</label><input class="cfg-in" list="ha-entities-list" ${at} data-ct-k="entity" placeholder="climate.* / fan.* / select.* / switch.*" value="${esc(t.entity || '')}"></div>
      <div class="cfg-field"><label>Attribut (optional, ersetzt den Status)</label><input class="cfg-in" ${at} data-ct-k="attr" placeholder="z. B. fan_mode" value="${esc(t.attr || '')}"></div>
      <div class="cfg-field"><label>Einheit</label><input class="cfg-in" ${at} data-ct-k="unit" value="${esc(t.unit || '')}"></div>
      <div class="cfg-field"><label>Nachkommastellen</label><input type="number" min="0" max="3" class="cfg-in" ${at} data-ct-k="decimals" value="${t.decimals ?? 1}"></div>
      <div class="cfg-field"><label>Icon</label>
        <select class="cfg-in" ${at} data-ct-k="icon">${CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(t.icon || defIcon) === val ? 'selected' : ''}>${lab}</option>`).join('')}</select>
      </div>
      <div class="order-btns" style="justify-self:end;align-self:end">
        <button class="btn-move" data-act="cfgMoveCT" data-s="${scope}" data-i="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''}>▲</button>
        <button class="btn-move" data-act="cfgMoveCT" data-s="${scope}" data-i="${i}" data-dir="1" ${i === tiles.length - 1 ? 'disabled' : ''}>▼</button>
        <button class="btn-danger" data-act="cfgDelCT" data-s="${scope}" data-i="${i}">✕</button>
      </div>
    </div>`;
  }).join('');
  return `${rows || '<span class="mut sm">Keine Kacheln – die Karte zeigt dann nur die Temperatur-Anzeige.</span>'}
    <div><button class="iconbtn" data-act="cfgAddCT" data-s="${scope}">+ Kachel hinzufügen</button></div>`;
}

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
  const searchEl = document.getElementById('cfgSearch');
  const searchVal = searchEl ? searchEl.value : '';

  const tabs = [
    ['allgemein', 'Allgemein & Wetter'],
    ['raeume', 'Räume & Badges'],
    ['geraete', 'Geräte & Rolläden'],
    ['klima', 'Klima-Baukasten'],
    ['energie', 'Metriken & Energie'],
    ['kameras', 'Kameras & Sicherheit'],
    ['seiten', 'Eigene Seiten'],
    ['backup', 'Import / Backup']
  ];
  const tabBtns = tabs.map(([id, label]) => `<button class="pill ${cfgTab === id ? 'on' : ''}" data-act="cfgtab" data-tab="${id}">${label}</button>`).join('');
  
  // UI-Helfer
  const fld = (lbl, attrs, type='text') => `<div class="cfg-field float"><input type="${type}" class="cfg-in" placeholder=" " ${attrs}><label>${esc(lbl)}</label></div>`;
  const sel = (lbl, opts, attrs) => `<div class="cfg-field float"><select class="cfg-in" style="padding-top:16px" ${attrs}>${opts}</select><label style="top:4px;font-size:9px;color:var(--acc2)">${esc(lbl)}</label></div>`;
  const txt = (lbl, attrs, val) => `<div class="cfg-field float"><textarea class="cfg-in" placeholder=" " ${attrs}>${esc(val)}</textarea><label>${esc(lbl)}</label></div>`;
  const box = (title, desc, content, open=false, headRight='') => `<details class="cfg-box" ${open?'open':''}><summary><div style="display:flex;flex-direction:column;gap:3px;margin-right:auto"><b>${title}</b><span class="cfg-desc">${desc}</span></div>${headRight}</summary><div class="cfg-box-body">${content}</div></details>`;
  
  const th = cfgDraft.theme || {};
  const pp = cfgDraft.pinProtect || {};
  const w = cfgDraft.weather || {};
  
  let tAllgemein = box('Seitenleiste & Dashboard-Infos', 'Grundlegende Texte und Anzeige-Optionen.', `
    <div class="cfg-row">
      ${fld('HA-Seitenleisten-Titel', `data-cpath="sidebarTitle" value="${esc(cfgDraft.sidebarTitle)}"`)}
      ${fld('HA-Seitenleisten-Icon', `data-cpath="sidebarIcon" value="${esc(cfgDraft.sidebarIcon)}"`)}
      ${fld('Dashboard-Titel', `data-cpath="title" value="${esc(cfgDraft.title)}"`)}
      ${fld('Untertitel', `data-cpath="subtitle" value="${esc(cfgDraft.subtitle)}"`)}
    </div>
    <div class="cfg-row">
      ${fld('Begrüßungs-Name', `data-cpath="userName" value="${esc(cfgDraft.userName)}"`)}
      ${fld('Rolle (z.B. Bewohner)', `data-cpath="role" value="${esc(cfgDraft.role)}"`)}
      ${fld('Begrüßungstext-Entität (optional)', `list="ha-entities-list" data-cpath="greetingEntity" value="${esc(cfgDraft.greetingEntity)}"`)}
    </div>`, true) + 
    box('Wetter-Kachel & Vorhersage', 'Steuert die Wetter-Anzeige oben rechts auf der Startseite.', `
    <div class="cfg-row">
      <label><input type="checkbox" data-cbool="weather.showCard" ${w.showCard !== false ? 'checked' : ''}> Aktuelle Wetter-Kachel anzeigen</label>
      <label><input type="checkbox" data-cbool="weather.showForecast" ${w.showForecast ? 'checked' : ''}> 7-Tage-Vorhersage (Popup) aktivieren</label>
    </div>
    <div class="cfg-row">
      ${fld('Kachel-Titel', `data-cpath="weather.title" value="${esc(w.title || 'Wetter')}"`)}
      ${fld('Ort / Zusatz (z.B. Berlin)', `data-cpath="weather.label" value="${esc(w.label || '')}"`)}
      ${fld('Haupt-Wetter (weather.*)', `list="ha-entities-list" data-cpath="weather.entity" value="${esc(w.entity || '')}"`)}
      ${fld('Eigene Temp.-Entität', `list="ha-entities-list" data-cpath="weather.tempEntity" value="${esc(w.tempEntity || '')}"`)}
      ${fld('Vorhersage-Entität', `list="ha-entities-list" data-cpath="weather.forecastEntity" value="${esc(w.forecastEntity || '')}"`)}
    </div>
    <div style="margin-top:6px">
      <span class="cfg-desc" style="margin-bottom:8px">Zusätzliche Detail-Werte (z.B. Luftfeuchte, Wind) in der Wetter-Kachel:</span>
      ${(w.items || []).map((it, wi) => `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px">
        ${fld('Bezeichnung', `data-wi-i="${wi}" data-wi-k="label" value="${esc(it.label || '')}"`)}
        ${fld('Entität (leer = Wetter-Attr.)', `list="ha-entities-list" data-wi-i="${wi}" data-wi-k="entity" value="${esc(it.entity || '')}"`)}
        ${fld('Attribut (z.B. wind_speed)', `data-wi-i="${wi}" data-wi-k="attr" value="${esc(it.attr || '')}"`)}
        ${fld('Einheit', `data-wi-i="${wi}" data-wi-k="unit" value="${esc(it.unit || '')}"`)}
        ${sel('Icon', CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(it.icon || 'drop') === val ? 'selected' : ''}>${lab}</option>`).join(''), `data-wi-i="${wi}" data-wi-k="icon"`)}
        <div class="order-btns"><button class="btn-danger" data-act="cfgDelWItem" data-i="${wi}">✕</button></div>
      </div>`).join('')}
      <button class="iconbtn" data-act="cfgAddWItem" style="margin-top:8px">+ Detailwert hinzufügen</button>
    </div>`) + 
    box('Farbschema (Theme)', 'Passe die globalen Farben an.', `
    <div class="cfg-row">
      ${fld('Hintergrund', `data-cpath="theme.bg" value="${esc(th.bg || '#080912')}"`, 'color')}
      ${fld('Primärfarbe', `data-cpath="theme.acc" value="${esc(th.acc || '#7c6cf0')}"`, 'color')}
      ${fld('Akzent hell', `data-cpath="theme.acc2" value="${esc(th.acc2 || '#a99bff')}"`, 'color')}
      ${fld('Grün / OK', `data-cpath="theme.ok" value="${esc(th.ok || '#34d399')}"`, 'color')}
      ${fld('Warnung', `data-cpath="theme.warn" value="${esc(th.warn || '#f59e0b')}"`, 'color')}
      ${fld('Blau / Kühl', `data-cpath="theme.cool" value="${esc(th.cool || '#38bdf8')}"`, 'color')}
    </div>`) + 
    box('Sicherheit & Kiosk-Modus', 'PIN-Schutz und Vollbild-Einstellungen für Tablets.', `
    <div class="cfg-row">
      <label><input type="checkbox" data-cbool="kioskMode" ${cfgDraft.kioskMode ? 'checked' : ''}> Kiosk-Vollbildmodus (Sidebar ausblenden)</label>
      <label><input type="checkbox" data-cbool="hideSystemLinks" ${cfgDraft.hideSystemLinks ? 'checked' : ''}> HA-Systemlinks ausblenden</label>
      ${fld('Master PIN-Code', `data-cpath="pinCode" value="${esc(cfgDraft.pinCode)}"`, 'password')}
    </div>
    <div class="cfg-row" style="margin-top:8px">
      <label><input type="checkbox" data-cbool="pinProtect.editor" ${pp.editor ? 'checked' : ''}> PIN für Editor</label>
      <label><input type="checkbox" data-cbool="pinProtect.systemLinks" ${pp.systemLinks ? 'checked' : ''}> PIN für Systemlinks</label>
      <label><input type="checkbox" data-cbool="pinProtect.kioskExit" ${pp.kioskExit ? 'checked' : ''}> PIN für Kiosk-Exit</label>
      <label><input type="checkbox" data-cbool="pinProtect.doorUnlock" ${pp.doorUnlock ? 'checked' : ''}> PIN für Türschlösser</label>
    </div>`);

  let tRaeume = (cfgDraft.rooms || []).map((r, i) => box(`Raum #${i + 1}: ${esc(r.name)}`, 'Hintergrundbild, Kamera-Stream und Temperatur-Badges.', `
    <div class="cfg-row">
      ${fld('Raumname', `data-r-i="${i}" data-r-k="name" value="${esc(r.name)}"`)}
      ${fld('Klima-Entität', `list="ha-entities-list" data-r-i="${i}" data-r-k="climate" value="${esc(r.climate || '')}"`)}
      ${fld('Hintergrundbild URL', `data-r-i="${i}" data-r-k="image" value="${esc(r.image || '')}"`)}
      <div class="cfg-field float"><input type="file" accept="image/*" class="cfg-in" data-act="uploadRoomImg" data-i="${i}" style="padding-top:12px"><label>Eigenes Bild hochladen</label></div>
    </div>
    <div class="cfg-row">
      ${fld('Hintergrund Kamera (HA)', `list="ha-entities-list" data-r-i="${i}" data-r-k="camera" value="${esc(r.camera || '')}"`)}
      ${fld('Hintergrund go2rtc Stream', `data-r-i="${i}" data-r-k="webrtc" value="${esc(r.webrtc || '')}"`)}
    </div>
    <label style="margin-top:6px;display:block"><input type="checkbox" data-r-bool-i="${i}" data-r-bool-k="showLiveBadge" ${r.showLiveBadge !== false ? 'checked' : ''}> Rotes „● LIVE“-Badge anzeigen (bei Kamera-Hintergrund)</label>
    
    <div style="margin-top:12px;padding-top:12px;border-top:1px dashed var(--line)">
      <span class="cfg-desc">Mini-Badges (z.B. °C, W, %) im Raum-Banner:</span>
      ${(r.chips || []).map((ch, ci) => `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px;margin-top:6px">
        ${sel('Icon', CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(ch.icon || 'thermo') === val ? 'selected' : ''}>${lab}</option>`).join(''), `data-chip-ri="${i}" data-chip-ci="${ci}" data-chip-k="icon"`)}
        ${fld('Entität', `list="ha-entities-list" data-chip-ri="${i}" data-chip-ci="${ci}" data-chip-k="entity" value="${esc(ch.entity || '')}"`)}
        ${fld('Attribut', `data-chip-ri="${i}" data-chip-ci="${ci}" data-chip-k="attr" value="${esc(ch.attr || '')}"`)}
        ${fld('Einheit', `data-chip-ri="${i}" data-chip-ci="${ci}" data-chip-k="unit" value="${esc(ch.unit || '')}"`)}
        ${sel('Farbe', CHIP_COLOR_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(ch.cls || '') === val ? 'selected' : ''}>${lab}</option>`).join(''), `data-chip-ri="${i}" data-chip-ci="${ci}" data-chip-k="cls"`)}
        <div class="order-btns"><button class="btn-move" data-act="cfgMoveChip" data-ri="${i}" data-ci="${ci}" data-dir="-1" ${ci===0?'disabled':''}>▲</button><button class="btn-move" data-act="cfgMoveChip" data-ri="${i}" data-ci="${ci}" data-dir="1" ${ci===r.chips.length-1?'disabled':''}>▼</button><button class="btn-danger" data-act="cfgDelChip" data-ri="${i}" data-ci="${ci}">✕</button></div>
      </div>`).join('')}
      <button class="iconbtn" data-act="cfgAddChip" data-ri="${i}" style="margin-top:6px">+ Badge hinzufügen</button>
    </div>
    
    <div style="margin-top:12px;padding-top:12px;border-top:1px dashed var(--line)">
      <span class="cfg-desc">Zusätzliche Kamera- / Vergrößerungs-Buttons unten rechts:</span>
      ${(r.camButtons || []).map((cb, bi) => `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px;margin-top:6px">
        ${fld('Button-Name', `data-cb-ri="${i}" data-cb-bi="${bi}" data-cb-k="name" value="${esc(cb.name || '')}"`)}
        ${sel('Icon', CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(cb.icon || 'expand') === val ? 'selected' : ''}>${lab}</option>`).join(''), `data-cb-ri="${i}" data-cb-bi="${bi}" data-cb-k="icon"`)}
        ${fld('go2rtc Stream', `data-cb-ri="${i}" data-cb-bi="${bi}" data-cb-k="stream" value="${esc(cb.stream || '')}"`)}
        ${fld('HA Kamera', `list="ha-entities-list" data-cb-ri="${i}" data-cb-bi="${bi}" data-cb-k="entity" value="${esc(cb.entity || '')}"`)}
        <div class="order-btns"><button class="btn-danger" data-act="cfgDelCamBtn" data-ri="${i}" data-bi="${bi}">✕</button></div>
      </div>`).join('')}
      <button class="iconbtn" data-act="cfgAddCamBtn" data-ri="${i}" style="margin-top:6px">+ Kamera-Button hinzufügen</button>
    </div>
    `, i===0, `<div class="order-btns"><button class="btn-move" data-act="cfgMoveRoom" data-i="${i}" data-dir="-1" ${i===0?'disabled':''}>▲</button><button class="btn-move" data-act="cfgMoveRoom" data-i="${i}" data-dir="1" ${i===(cfgDraft.rooms.length-1)?'disabled':''}>▼</button><button class="btn-danger" data-act="cfgDelRoom" data-i="${i}">Löschen</button></div>`)).join('') + `<button class="btn-pri" data-act="cfgAddRoom" style="align-self:flex-start">+ Neuen Raum hinzufügen</button>`;

  const dTabs = cfgDraft.deviceTabs || [];
  if (!dTabs.some(t => t.id === cfgDevSubTab) && cfgDevSubTab !== 'lichter') cfgDevSubTab = dTabs[0] ? dTabs[0].id : 'geraete';
  
  let tGeraete = `<div class="cfg-subtabs">
    ${dTabs.map((t, ti) => `<div style="display:inline-flex;align-items:center;gap:3px">
      <button class="pill ${cfgDevSubTab === t.id ? 'on' : ''}" data-act="cfgDevTab" data-id="${esc(t.id)}">${esc(t.name)}</button>
      ${dTabs.length > 2 ? `<button class="btn-move" data-act="cfgMoveDevTab" data-i="${ti}" data-dir="-1" ${ti===0?'disabled':''}>◀</button><button class="btn-move" data-act="cfgMoveDevTab" data-i="${ti}" data-dir="1" ${ti===dTabs.length-1?'disabled':''}>▶</button>` : ''}
    </div>`).join('')}
    <button class="pill ${cfgDevSubTab === 'lichter' ? 'on' : ''}" style="background:rgba(255,255,255,.05);border-color:transparent" data-act="cfgDevTab" data-id="lichter">💡 Lichter-Karte</button>
    <button class="iconbtn" data-act="cfgAddDevTab">+ Weiteren Reiter erstellen</button>
  </div>`;

  if (cfgDevSubTab === 'covers') {
    const covs = (cfgDraft.covers || []).map((c, i) => `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px">
        ${fld('Rolladen Name', `data-cv-i="${i}" data-cv-k="name" value="${esc(c.name)}"`)}
        ${fld('Entität (cover.*)', `list="ha-entities-list" data-cv-i="${i}" data-cv-k="entity" value="${esc(c.entity)}"`)}
        <div class="order-btns"><button class="btn-move" data-act="cfgMoveCov" data-i="${i}" data-dir="-1" ${i===0?'disabled':''}>▲</button><button class="btn-move" data-act="cfgMoveCov" data-i="${i}" data-dir="1" ${i===cfgDraft.covers.length-1?'disabled':''}>▼</button><button class="btn-danger" data-act="cfgDelCov" data-i="${i}">✕</button></div>
      </div>`).join('');
    tGeraete += box('Rolläden', 'Zentrale Liste aller Rolläden für das Dashboard.', covs + `<button class="iconbtn" data-act="cfgAddCov" style="margin-top:8px">+ Rolladen hinzufügen</button>`, true);
  } else if (cfgDevSubTab === 'lichter') {
    const lm = cfgDraft.lightsMain || { mode: 'group', group: 0, entities: [] };
    const lmGroupOpts = (cfgDraft.lights || []).map((g, idx) => `<option value="${idx}" ${lm.group == idx ? 'selected' : ''}>${esc(g.name)}</option>`).join('');
    const lightsHtml = (cfgDraft.lights || []).map((g, i) => box(`Gruppe: ${esc(g.name)}`, 'Zusammengefasste Lampen.', `
      <div class="cfg-row">
        ${fld('Anzeigename', `data-l-i="${i}" data-l-k="name" value="${esc(g.name)}"`)}
        ${fld('Entitäten (kommagetrennt)', `data-l-i="${i}" data-l-k="entities" value="${esc((g.entities||[]).join(', '))}"`)}
        <div class="order-btns"><button class="btn-move" data-act="cfgMoveLight" data-i="${i}" data-dir="-1" ${i===0?'disabled':''}>▲</button><button class="btn-move" data-act="cfgMoveLight" data-i="${i}" data-dir="1" ${i===cfgDraft.lights.length-1?'disabled':''}>▼</button><button class="btn-danger" data-act="cfgDelLight" data-i="${i}">Löschen</button></div>
      </div>`, false)).join('');
    
    tGeraete += box('Hauptschalter-Verhalten', 'Konfiguriere den Master-Switch der Lichter-Karte.', `
      <div class="cfg-row">
        ${sel('Modus', `<option value="all" ${lm.mode === 'all' ? 'selected' : ''}>Alle Gruppen steuern</option><option value="group" ${lm.mode === 'group' ? 'selected' : ''}>Eine bestimmte Gruppe steuern</option><option value="custom" ${lm.mode === 'custom' ? 'selected' : ''}>Eigene Entitäten steuern</option>`, `data-lm-k="mode"`)}
        ${lm.mode === 'group' ? sel('Welche Gruppe?', lmGroupOpts, `data-lm-k="group"`) : ''}
        ${lm.mode === 'custom' ? fld('Entitäten (kommagetrennt)', `data-lm-k="entities" value="${esc((lm.entities || []).join(', '))}"`) : ''}
      </div>`, true) + lightsHtml + `<button class="btn-pri" data-act="cfgAddLight" style="margin-top:10px">+ Neue Licht-Gruppe</button>`;
  } else {
    const activeTabObj = dTabs.find(t => t.id === cfgDevSubTab);
    const tabIndices = (cfgDraft.devices || []).map((d, idx) => ((d.tab || 'geraete') === activeTabObj.id ? idx : -1)).filter(idx => idx !== -1);
    const devRows = tabIndices.map((idx, pos) => {
      const d = cfgDraft.devices[idx];
      return `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px;margin-bottom:6px">
        ${fld('Name', `data-d-i="${idx}" data-d-k="name" value="${esc(d.name || '')}"`)}
        ${fld('Raum', `data-d-i="${idx}" data-d-k="room" value="${esc(d.room || '')}"`)}
        ${fld('Entität', `list="ha-entities-list" data-d-i="${idx}" data-d-k="entity" value="${esc(d.entity || '')}"`)}
        ${fld('Leistungs-Sensor (W)', `list="ha-entities-list" data-d-i="${idx}" data-d-k="power" value="${esc(d.power || '')}"`)}
        ${fld('Energie-Sensor (kWh)', `list="ha-entities-list" data-d-i="${idx}" data-d-k="energy" value="${esc(d.energy || '')}"`)}
        <div class="order-btns"><button class="btn-move" data-act="cfgMoveDevInTab" data-tab="${esc(activeTabObj.id)}" data-pos="${pos}" data-dir="-1" ${pos===0?'disabled':''}>▲</button><button class="btn-move" data-act="cfgMoveDevInTab" data-tab="${esc(activeTabObj.id)}" data-pos="${pos}" data-dir="1" ${pos===tabIndices.length-1?'disabled':''}>▼</button><button class="btn-danger" data-act="cfgDelDev" data-i="${idx}">✕</button></div>
      </div>`;
    }).join('');
    
    tGeraete += box(`Reiter: ${esc(activeTabObj.name)}`, 'Geräte in diesem Reiter verwalten.', `
      <div class="cfg-row" style="margin-bottom:12px">
        ${fld('Reiter-Name ändern', `data-devtab-name="${esc(activeTabObj.id)}" value="${esc(activeTabObj.name)}"`)}
        ${activeTabObj.id !== 'geraete' ? `<button class="btn-danger" data-act="cfgDelDevTab" data-id="${esc(activeTabObj.id)}">Diesen Reiter komplett löschen</button>` : ''}
      </div>
      ${devRows || '<div class="mut sm">Keine Geräte in diesem Reiter.</div>'}
      <button class="iconbtn" data-act="cfgAddDev" data-tab="${esc(activeTabObj.id)}" style="margin-top:8px">+ Gerät hinzufügen</button>
    `, true);
  }

  let tKlima = box('Globale Klima-Kacheln', 'Diese Kacheln gelten für alle Räume ohne eigene Kachel-Konfiguration.', climateTilesEditorHtml('g'), true) + 
    (cfgDraft.climateRooms || []).map((cr, i) => box(`Klima-Raum #${i+1}: ${esc(cr.name)}`, 'Detaillierte Heizungs- und Klima-Steuerung.', `
    <div class="cfg-row">
      ${fld('Raumname', `data-cr-i="${i}" data-cr-k="name" value="${esc(cr.name)}"`)}
      ${fld('Haupt-Thermostat', `list="ha-entities-list" data-cr-i="${i}" data-cr-k="dev0" value="${esc(cr.devices && cr.devices[0] ? cr.devices[0].entity : '')}"`)}
      ${fld('Boost-Helfer', `list="ha-entities-list" data-cr-i="${i}" data-cr-k="boost" value="${esc(cr.boost ? cr.boost.entity : '')}"`)}
    </div>
    <div style="margin-top:10px">
      ${txt('Einstellungs-Helfer (entity_id:Name je Zeile)', `data-cr-i="${i}" data-cr-k="helpers" rows="3"`, ((cr.settings && cr.settings.groups && cr.settings.groups[0] && cr.settings.groups[0].items) || []).map(x => x.entity + ':' + (x.name || '')).join('\n'))}
    </div>
    `, false, `<div class="order-btns"><button class="btn-move" data-act="cfgMoveCRoom" data-i="${i}" data-dir="-1" ${i===0?'disabled':''}>▲</button><button class="btn-move" data-act="cfgMoveCRoom" data-i="${i}" data-dir="1" ${i===cfgDraft.climateRooms.length-1?'disabled':''}>▼</button><button class="btn-danger" data-act="cfgDelCRoom" data-i="${i}">Löschen</button></div>`)).join('') + 
    `<button class="btn-pri" data-act="cfgAddCRoom" style="align-self:flex-start">+ Klima-Raum hinzufügen</button>`;

  let tEnergie = (cfgDraft.metrics || []).map((m, mi) => box(`Metrik: ${esc(m.title || 'Neu')}`, 'Konfiguriere Kacheln wie Strom, Gas oder Wasser.', `
    <div class="cfg-row">
      ${fld('Titel', `data-m-i="${mi}" data-m-k="title" value="${esc(m.title || '')}"`)}
      ${fld('Haupt-Entität (Tageswert)', `list="ha-entities-list" data-m-i="${mi}" data-m-k="entity" value="${esc(m.entity || '')}"`)}
      ${fld('Einheit (z.B. kWh)', `data-m-i="${mi}" data-m-k="unit" value="${esc(m.unit || '')}"`)}
    </div>
    <div class="cfg-row">
      ${fld('Live-Entität (für Chart)', `list="ha-entities-list" data-m-i="${mi}" data-m-k="chart" value="${esc(m.chart || '')}"`)}
      ${sel('Modus', `<option value="avg" ${(m.mode||'avg')==='avg'?'selected':''}>Durchschnitt</option><option value="last" ${m.mode==='last'?'selected':''}>Letzter Wert</option>`, `data-m-i="${mi}" data-m-k="mode"`)}
      ${fld('Live-Einheit (z.B. W)', `data-m-i="${mi}" data-m-k="chartUnit" value="${esc(m.chartUnit || '')}"`)}
    </div>
    <div style="margin-top:10px;padding-top:10px;border-top:1px dashed var(--line)">
      <span class="cfg-desc">Popup-Unterbuttons (z.B. Solar / Akku / Netz):</span>
      ${(m.subButtons || []).map((sb, sbi) => `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px;margin-top:6px">
        ${fld('Button-Name', `data-sb-mi="${mi}" data-sb-i="${sbi}" data-sb-k="name" value="${esc(sb.name || '')}"`)}
        ${sel('Farbe', [['warn','Gelb'],['ok','Grün'],['cool','Blau'],['acc2','Lila']].map(([v,l])=>`<option value="${v}" ${sb.color===v?'selected':''}>${l}</option>`).join(''), `data-sb-mi="${mi}" data-sb-i="${sbi}" data-sb-k="color"`)}
        ${txt('Entitäten (ID:Name:Einheit:Chart)', `data-sb-mi="${mi}" data-sb-i="${sbi}" data-sb-k="entitiesText" rows="3" style="flex:2"`, (sb.entities || []).map(e => e.entity + ':' + (e.name || '') + ':' + (e.unit || 'W') + ':' + (e.chart ? '1' : '0')).join('\n'))}
        <div class="order-btns"><button class="btn-danger" data-act="cfgDelSubBtn" data-mi="${mi}" data-sbi="${sbi}">✕</button></div>
      </div>`).join('')}
      <button class="iconbtn" data-act="cfgAddSubBtn" data-mi="${mi}" style="margin-top:6px">+ Popup-Button hinzufügen</button>
    </div>
    `, mi===0, `<div class="order-btns"><button class="btn-move" data-act="cfgMoveMetric" data-i="${mi}" data-dir="-1" ${mi===0?'disabled':''}>▲</button><button class="btn-move" data-act="cfgMoveMetric" data-i="${mi}" data-dir="1" ${mi===cfgDraft.metrics.length-1?'disabled':''}>▼</button><button class="btn-danger" data-act="cfgDelMetric" data-i="${mi}">Löschen</button></div>`)).join('') + 
    `<button class="btn-pri" data-act="cfgAddMetric" style="align-self:flex-start">+ Neue Metrik-Kachel</button>` + 
    box('Header-Badges', 'Dynamische Anzeigen (z.B. Akku voll, Waschmaschine) im Header.', `
    ${(cfgDraft.headerBadgeItems || []).map((b, bi) => `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px;margin-bottom:6px">
      ${sel('Typ', `<option value="entity" ${b.type !== 'calendar' ? 'selected' : ''}>Entität</option><option value="calendar" ${b.type === 'calendar' ? 'selected' : ''}>Kalender</option>`, `data-hb-i="${bi}" data-hb-k="type"`)}
      ${fld('Präfix-Titel', `data-hb-i="${bi}" data-hb-k="title" value="${esc(b.title || '')}"`)}
      ${sel('Icon', CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(b.icon || 'plug') === val ? 'selected' : ''}>${lab}</option>`).join(''), `data-hb-i="${bi}" data-hb-k="icon"`)}
      ${b.type === 'calendar' ? fld('Vorschau in Tagen', `type="number" data-hb-i="${bi}" data-hb-k="maxDays" value="${b.maxDays || 2}"`) : fld('Entität 1 [W1]', `list="ha-entities-list" data-hb-i="${bi}" data-hb-k="entity1" value="${esc(b.entity1 || '')}"`)}
      ${b.type !== 'calendar' ? fld('Format-Text', `data-hb-i="${bi}" data-hb-k="format" value="${esc(b.format || '[W1]')}"`) : ''}
      <div class="order-btns"><button class="btn-move" data-act="cfgMoveHB" data-i="${bi}" data-dir="-1" ${bi===0?'disabled':''}>▲</button><button class="btn-move" data-act="cfgMoveHB" data-i="${bi}" data-dir="1" ${bi===(cfgDraft.headerBadgeItems||[]).length-1?'disabled':''}>▼</button><button class="btn-danger" data-act="cfgDelHB" data-i="${bi}">✕</button></div>
    </div>`).join('')}
    <button class="iconbtn" data-act="cfgAddHB" style="margin-top:6px">+ Header-Badge hinzufügen</button>
    `) +
    box('Kalender & Power-Flow', 'Spezial-Entitäten konfigurieren.', `
    <div class="cfg-row">
      ${fld('Familienkalender (calendar.*)', `id="cfg-cal-fam" value="${esc(((cfgDraft.calendars||{}).familyEntities || []).join(', '))}"`)}
      ${fld('Abfallkalender (calendar.*)', `id="cfg-cal-trash" value="${esc(((cfgDraft.calendars||{}).trashEntities || []).join(', '))}"`)}
    </div>
    <div style="margin-top:10px">
      ${txt('Power-Flow Entitäten (Name:ID:Einheit je Zeile)', `id="cfg-pf-text" rows="5"`, (cfgDraft.powerFlow || []).map(x => (x.label || '') + ':' + (x.entity || '') + ':' + (x.unit || 'W')).join('\n'))}
    </div>`);

  let tKameras = box('Sicherheit & Kameras', 'Türschlösser, Fenstersensoren und Streams.', `
    <span class="cfg-desc">Türschlösser (Reihenfolge anpassbar):</span>
    ${(cfgDraft.security.locks || []).map((lk, i) => `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px;margin-bottom:4px">
      ${fld('Bezeichnung', `data-lk-i="${i}" data-lk-k="name" value="${esc(lk.name || '')}"`)}
      ${fld('Entität (lock.*)', `list="ha-entities-list" data-lk-i="${i}" data-lk-k="entity" value="${esc(lk.entity || '')}"`)}
      <div class="order-btns"><button class="btn-move" data-act="cfgMoveLock" data-i="${i}" data-dir="-1" ${i===0?'disabled':''}>▲</button><button class="btn-move" data-act="cfgMoveLock" data-i="${i}" data-dir="1" ${i===cfgDraft.security.locks.length-1?'disabled':''}>▼</button><button class="btn-danger" data-act="cfgDelLock" data-i="${i}">✕</button></div>
    </div>`).join('')}
    <button class="iconbtn" data-act="cfgAddLock" style="margin-bottom:16px">+ Türschloss hinzufügen</button>
    <div class="cfg-row">
      ${fld('Fenstersensoren (kommagetrennt)', `id="cfg-sec-win" value="${esc((cfgDraft.security.windows || []).join(', '))}"`)}
      ${fld('go2rtc Host (URL)', `data-cpath="go2rtcHost" value="${esc(cfgDraft.go2rtcHost || '')}"`)}
    </div>
    <span class="cfg-desc" style="margin-top:16px;display:block">Kamera-Ansicht (Reihenfolge anpassbar):</span>
    ${(cfgDraft.webrtcCameras || []).map((c, i) => `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px;margin-bottom:4px">
      ${fld('Name', `data-cam-i="${i}" data-cam-k="name" value="${esc(c.name)}"`)}
      ${fld('HA Kamera-Entität', `list="ha-entities-list" data-cam-i="${i}" data-cam-k="entity" value="${esc(c.entity || '')}"`)}
      ${fld('go2rtc Stream', `data-cam-i="${i}" data-cam-k="stream" value="${esc(c.stream || '')}"`)}
      <div class="order-btns"><button class="btn-move" data-act="cfgMoveCam" data-i="${i}" data-dir="-1" ${i===0?'disabled':''}>▲</button><button class="btn-move" data-act="cfgMoveCam" data-i="${i}" data-dir="1" ${i===cfgDraft.webrtcCameras.length-1?'disabled':''}>▼</button><button class="btn-danger" data-act="cfgDelCam" data-i="${i}">✕</button></div>
    </div>`).join('')}
    <button class="iconbtn" data-act="cfgAddCam">+ Kamera hinzufügen</button>`, true);

  let tSeiten = (cfgDraft.customPages || []).map((p, pi) => {
    const boxKey = `page_${p.id || pi}`;
    const isOpen = lastOpenedBoxKey ? lastOpenedBoxKey === boxKey : pi === 0;

    return box(`Menü-Seite: ${esc(p.label)}`, 'Konfiguriere Widgets für diese eigene Unterseite.', `
      <div class="cfg-row">
        ${fld('Menü-Name', `data-pg-i="${pi}" data-pg-k="label" value="${esc(p.label)}"`)}
        ${fld('Überschrift', `data-pg-i="${pi}" data-pg-k="title" value="${esc(p.title || '')}"`)}
        ${fld('Icon', `data-pg-i="${pi}" data-pg-k="icon" value="${esc(p.icon || 'chart')}"`)}
        ${sel('Layout', `<option value="grid" ${p.layout !== 'column' ? 'selected' : ''}>Nebeneinander (Grid)</option><option value="column" ${p.layout === 'column' ? 'selected' : ''}>Untereinander (1 Spalte)</option>`, `data-pg-i="${pi}" data-pg-k="layout"`)}
      </div>
      <div style="margin-top:12px;padding-top:12px;border-top:1px dashed var(--line)">
        ${(p.widgets || []).map((w, wi) => `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px;margin-bottom:4px">
          ${sel('Widget-Typ', [['entity_info','A) Entitäts-Info'],['stat_group','B) 24h Statistik'],['devices','C) Geräteliste'],['calendar','D) Kalender'],['trash','E) Abfall'],['todo','F) Aufgaben'],['power_flow','G) Power Flow'],['weather_forecast','H) Wetter 7T'],['iframe','I) Iframe'],['buli_team','J) Mein Verein (Teamtracker)'],['buli_table','K) Bundesliga Tabelle'],['buli_matchday','L) Spieltag Übersicht'],['f1_next','M) Formel 1 - Rennen'],['f1_standings','N) Formel 1 - WM']].map(([v,l])=>`<option value="${v}" ${w.type===v?'selected':''}>${l}</option>`).join(''), `data-pg-i="${pi}" data-w-i="${wi}" data-w-k="type"`)}
          ${fld('Titel', `data-pg-i="${pi}" data-w-i="${wi}" data-w-k="title" value="${esc(w.title || '')}"`)}
          ${fld('Entität / URL / Raum', `list="ha-entities-list" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="entity" value="${esc(w.entity || w.url || w.room || '')}"`)}
          <div class="order-btns"><button class="btn-move" data-act="cfgMoveWidget" data-pi="${pi}" data-wi="${wi}" data-dir="-1" ${wi===0?'disabled':''}>▲</button><button class="btn-move" data-act="cfgMoveWidget" data-pi="${pi}" data-wi="${wi}" data-dir="1" ${wi===p.widgets.length-1?'disabled':''}>▼</button><button class="btn-danger" data-act="cfgDelWidget" data-pi="${pi}" data-wi="${wi}">✕</button></div>
        </div>`).join('')}
        <button class="iconbtn" data-act="cfgAddWidget" data-pi="${pi}" style="margin-top:6px">+ Widget hinzufügen</button>
      </div>`, isOpen, `<div class="order-btns"><button class="btn-move" data-act="cfgMovePage" data-pi="${pi}" data-dir="-1" ${pi===0?'disabled':''}>▲</button><button class="btn-move" data-act="cfgMovePage" data-pi="${pi}" data-dir="1" ${pi===cfgDraft.customPages.length-1?'disabled':''}>▼</button><button class="btn-danger" data-act="cfgDelPage" data-pi="${pi}">Löschen</button></div>`);
  }).join('') + 
  `<button class="btn-pri" data-act="cfgAddPage" style="align-self:flex-start">+ Neue Unterseite anlegen</button>`;

  let tBackup = box('Schnellstart & Vorlagen', 'Überschreibe das aktuelle Setup mit Vorlagen.', `
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn-pri" data-act="cfgAutoDiscover">🔍 HA-Räume & Geräte automatisch einlesen</button>
      <button class="iconbtn" data-act="cfgLoadTimoPreset">📦 Timo-Preset laden</button>
      <button class="iconbtn" data-act="cfgLoadEmpty">🧹 Leeres Start-Gerüst laden</button>
    </div>`, true) + box('JSON Export / Import', 'Kopiere oder füge die Rohdaten der Konfiguration ein.', `
    <div style="margin-top:10px">
      ${txt('JSON-Code', `id="cfg-json-area" style="font-family:monospace;font-size:12px" rows="12"`, JSON.stringify(cfgDraft, null, 2))}
    </div>
    <div style="display:flex;gap:10px;margin-top:10px">
      <button class="iconbtn" data-act="cfgApplyJson">JSON anwenden</button>
      <button class="iconbtn" data-act="cfgDownloadJson">Als .json speichern</button>
    </div>`, true);

  const tabData = { 'allgemein': tAllgemein, 'raeume': tRaeume, 'geraete': tGeraete, 'klima': tKlima, 'energie': tEnergie, 'kameras': tKameras, 'seiten': tSeiten, 'backup': tBackup };
  
  const body = tabs.map(([id]) => `<div class="cfg-tab-content" data-tab="${id}" style="display:${(cfgTab === id && !searchVal) || searchVal ? 'flex' : 'none'};flex-direction:column;gap:16px">${tabData[id]}</div>`).join('');

  document.getElementById('cfgsheet').innerHTML = `
    <div class="cfg-hdr">
      <b>Dashboard-Konfigurator</b>
      <div class="cfg-search">${ic('search', 16)}<input type="text" id="cfgSearch" class="cfg-in" placeholder="Suche (Räume, Geräte, Entitäten...)" autocomplete="off" value="${esc(searchVal)}"></div>
      <button class="x2" data-act="cfgClose">✕</button>
    </div>
    <div class="cfg-tabs" style="display:${searchVal ? 'none' : 'flex'}">${tabBtns}</div>
    <div class="cfg-body">${body}</div>
    <div class="cfg-ftr">
      <span class="mut sm">Änderungen werden direkt in Home Assistant gespeichert.</span>
      <div style="display:flex;gap:10px">
        <button class="iconbtn" data-act="cfgClose">Abbrechen</button>
        <button class="btn-pri" data-act="cfgSave">💾 Speichern & Übernehmen</button>
      </div>
    </div>`;

  const newBody = document.querySelector('#cfgsheet .cfg-body');
  if (newBody && preserveScroll) newBody.scrollTop = prevScroll;
  
  if (searchVal) {
    const searchInput = document.getElementById('cfgSearch');
    if (searchInput) searchInput.dispatchEvent(new Event('input', { bubbles: true }));
  }
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

  if (t.id === 'cfgSearch') {
    const q = t.value.toLowerCase().trim();
    const tabContainer = document.querySelector('.cfg-tabs');
    const contents = document.querySelectorAll('.cfg-tab-content');
    
    if (q) {
      if (tabContainer) tabContainer.style.display = 'none';
      contents.forEach(c => c.style.display = 'flex');
      document.querySelectorAll('details.cfg-box').forEach(box => {
        const txt = box.textContent.toLowerCase();
        if (txt.includes(q)) {
          box.style.display = 'flex';
          box.open = true;
          box.querySelectorAll('.cfg-row, .cfg-field.float').forEach(r => {
            if(r.classList.contains('cfg-row')) {
              r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
            }
          });
        } else {
          box.style.display = 'none';
        }
      });
    } else {
      if (tabContainer) tabContainer.style.display = 'flex';
      contents.forEach(c => c.style.display = c.dataset.tab === cfgTab ? 'flex' : 'none');
      document.querySelectorAll('details.cfg-box').forEach(box => {
        box.style.display = 'flex';
        box.open = false;
        box.querySelectorAll('.cfg-row, .cfg-field.float').forEach(r => r.style.display = '');
      });
      // Ersten Block pro Tab standardmäßig öffnen
      document.querySelectorAll('.cfg-tab-content').forEach(c => {
        const firstBox = c.querySelector('details.cfg-box');
        if (firstBox) firstBox.open = true;
      });
    }
    return;
  }

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
  if (t.dataset.lmK) {
    if (!cfgDraft.lightsMain) cfgDraft.lightsMain = { mode: 'group', group: 0, entities: [] };
    const k = t.dataset.lmK;
    if (k === 'mode') { cfgDraft.lightsMain.mode = t.value; renderCfgModal(true); }
    else if (k === 'group') cfgDraft.lightsMain.group = parseInt(t.value, 10) || 0;
    else if (k === 'entities') cfgDraft.lightsMain.entities = t.value.split(',').map(x => x.trim()).filter(Boolean);
  }
  if (t.dataset.lI != null) {
    const g = cfgDraft.lights[+t.dataset.lI];
    const k = t.dataset.lK;
    if (k === 'entities') g.entities = t.value.split(',').map(x => x.trim()).filter(Boolean);
    else if (k === 'mainSync') g.mainSync = t.checked;
    else g[k] = t.value;
  }
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
  if (t.dataset.hbI != null) {
    const b = cfgDraft.headerBadgeItems[+t.dataset.hbI];
    const k = t.dataset.hbK;
    if (k === 'maxDays') b[k] = parseInt(t.value, 10) || 2;
    else b[k] = t.value;
    if (k === 'type') renderCfgModal(true); // UI neu zeichnen, da sich Felder ändern
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
  if (t.dataset.ctS != null) {
    const arr = getTileArr(t.dataset.ctS);
    const tile = arr && arr[+t.dataset.ctI];
    if (tile) {
      const k = t.dataset.ctK;
      tile[k] = t.type === 'checkbox' ? t.checked : (k === 'decimals' ? parseInt(t.value, 10) || 0 : t.value);
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
/* FIX: Dieser Block stand im Original doppelt -> SyntaxError "ENTITIES has already been declared" */
let ENTITIES = [];
function rebuildEntitiesList() {
  const ids = [];
  if (CONFIG.greetingEntity) ids.push(CONFIG.greetingEntity);
  
  // Neue Header-Badge-Logik registrieren
  (CONFIG.headerBadgeItems || []).forEach(b => {
    ids.push(b.entity1, b.entity2, b.conditionEnt);
  });

  (CONFIG.powerFlow || []).forEach(p => ids.push(p.entity));
  (CONFIG.rooms || []).forEach(r => {
    ids.push(r.camera, r.climate);
    (r.chips || []).forEach(c => ids.push(c.entity));
    (r.camButtons || []).forEach(b => ids.push(b.entity));
  });
  (CONFIG.devices || []).forEach(d => ids.push(d.entity, d.power, d.energy));
  (CONFIG.covers || []).forEach(c => ids.push(c.entity));
  if (CONFIG.climate) {
    ids.push(CONFIG.climate.entity);
    (CONFIG.climate.tiles || []).forEach(t => ids.push(t.entity));
  }
  (CONFIG.rooms || []).forEach(r => (r.climateTiles || []).forEach(t => ids.push(t.entity)));
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
  if (CONFIG.lightsMain && CONFIG.lightsMain.mode === 'custom') {
    ids.push(...(CONFIG.lightsMain.entities || []));
  }
  (CONFIG.customPages || []).forEach(p => (p.widgets || []).forEach(w => {
    if (w.type === 'buli_table') ids.push(w.entity || 'sensor.bund_scoreboard2');
    else if (w.type === 'f1_next') ids.push(w.entity || 'sensor.f1_next_race', 'sensor.f1_race_f1_next_race');
    else if (w.type === 'f1_standings') ids.push(w.entity || 'sensor.f1_driver_standings', 'sensor.f1_championship_f1_driver_standings');
    else if (w.entity) ids.push(w.entity);
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
  const sig = ENTITIES.map(id => { const s = S(id); if (!s) return '-'; const a = s.attributes || {}; return [s.state, a.temperature, a.current_temperature, a.humidity, a.wind_speed, a.pressure, a.precipitation, a.hvac_action, a.current_position, a.fan_mode, a.preset_mode, a.percentage].join('|'); }).join(';')
    + `#${ui.room}${ui.view}${ui.showAll}${ui.seriesVer}${homeCalendarState.loadedAt}${weatherForecastState.loadedAt}${ui.unlockArmedUntil > Date.now()}`;
  if (force || sig !== lastSig) { lastSig = sig; render(); }
}

function runtimeTick() {
  document.querySelectorAll('.rt').forEach(el => { el.textContent = fmtDur(Date.now() - +el.dataset.since); });
  
  // F1 Live-Countdown
  document.querySelectorAll('.f1-timer').forEach(el => {
    const diff = +el.dataset.target - Date.now();
    if (diff <= 0) { el.textContent = 'Rennen läuft'; return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    el.textContent = `T-${d}d ${pad(h)}h ${pad(m)}m`;
  });

  if (CONFIG.showDateTime) {
    const now = new Date();
    const dtOpts = { timeZone: CONFIG.dateTimeTimeZone || 'Europe/Berlin' };
    const loc = CONFIG.dateTimeLocale || 'de-DE';
    const dEl = document.getElementById('hub-date');
    const tEl = document.getElementById('hub-time');
    if (dEl) dEl.textContent = now.toLocaleDateString(loc, { ...dtOpts, weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    if (tEl) tEl.textContent = now.toLocaleTimeString(loc, { ...dtOpts, hour: '2-digit', minute: '2-digit', second: '2-digit' });
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
  
  /* Header Badges */
  if (act === 'cfgAddHB') {
    if (!Array.isArray(cfgDraft.headerBadgeItems)) cfgDraft.headerBadgeItems = [];
    cfgDraft.headerBadgeItems.push({ type: 'entity', title: 'Neues Badge', icon: 'plug', format: '[W1]', colorLogic: 'default:blue' });
    renderCfgModal(true); return;
  }
  if (act === 'cfgDelHB') { cfgDraft.headerBadgeItems.splice(+el.dataset.i, 1); renderCfgModal(true); return; }
  if (act === 'cfgMoveHB') { moveItem(cfgDraft.headerBadgeItems, +el.dataset.i, +el.dataset.dir); renderCfgModal(true); return; }

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
  if (act === 'cfgAddCT') {
    const arr = getTileArr(el.dataset.s);
    if (arr) { arr.push({ type: 'custom', show: true, label: 'Neu', entity: '', attr: '', icon: 'thermo', decimals: 1 }); renderCfgModal(true); }
    return;
  }
  if (act === 'cfgDelCT') { const arr = getTileArr(el.dataset.s); if (arr) arr.splice(+el.dataset.i, 1); renderCfgModal(true); return; }
  if (act === 'cfgMoveCT') { const arr = getTileArr(el.dataset.s); if (arr) moveItem(arr, +el.dataset.i, +el.dataset.dir); renderCfgModal(true); return; }
  if (act === 'cfgRoomTilesOwn') {
    cfgDraft.rooms[+el.dataset.ri].climateTiles = JSON.parse(JSON.stringify((cfgDraft.climate && cfgDraft.climate.tiles) || DEFAULT_CLIMATE_TILES()));
    renderCfgModal(true);
    return;
  }
  if (act === 'cfgRoomTilesReset') { delete cfgDraft.rooms[+el.dataset.ri].climateTiles; renderCfgModal(true); return; }
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
  /* Lichter-Karte */
  if (act === 'cfgAddLight') {
    if (!Array.isArray(cfgDraft.lights)) cfgDraft.lights = [];
    cfgDraft.lights.push({ name: 'Neue Gruppe', entities: [] });
    renderCfgModal(true); return;
  }
  if (act === 'cfgDelLight') { cfgDraft.lights.splice(+el.dataset.i, 1); renderCfgModal(true); return; }
  if (act === 'cfgMoveLight') { moveItem(cfgDraft.lights, +el.dataset.i, +el.dataset.dir); renderCfgModal(true); return; }
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
  if (act === 'cfgAddPage') {
    const newId = 'p_' + Date.now();
    cfgDraft.customPages.push({ id: newId, label: 'Neue Seite', icon: 'chart', title: 'Neue Seite', widgets: [] });
    lastOpenedBoxKey = `page_${newId}`;
    renderCfgModal(true);
    setTimeout(() => {
      const body = document.querySelector('#cfgsheet .cfg-body');
      if (body) body.scrollTop = body.scrollHeight;
    }, 50);
    return;
  }
  if (act === 'cfgDelPage') { cfgDraft.customPages.splice(+el.dataset.pi, 1); renderCfgModal(true); return; }
  if (act === 'cfgMovePage') { moveItem(cfgDraft.customPages, +el.dataset.pi, +el.dataset.dir); renderCfgModal(true); return; }
  if (act === 'cfgAddWidget') {
    const pi = +el.dataset.pi;
    const page = cfgDraft.customPages[pi];
    lastOpenedBoxKey = `page_${page.id || pi}`;
    page.widgets.push({ type: 'entity_info', title: 'Kachel', entity: '' });
    renderCfgModal(true);
    return;
  }
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
  if (act === 'ctile') { runClimateTile((c.tiles || [])[+el.dataset.i], c); return; }
  if (act === 'chartScrubClick') {
    if (scrubMoved) { scrubMoved = false; return; }
    const parentModal = el.closest('[data-act="chartModal"]');
    if (parentModal) openChartModal(parentModal);
    return;
  }
  if (act === 'chartModal') {
    if (scrubMoved) { scrubMoved = false; return; }
    openChartModal(el);
    return;
  }
  if (act === 'chartRange') {
    sm.range = el.dataset.r === '7d' ? '7d' : '24h';
    renderChartModal();
    loadChartRange();
    return;
  }
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
  else if (act === 'lgrpMain') {
    const ents = getMainLightEntities();
    if (ents.length) {
      const on = groupInfo({ entities: ents }).on;
      call('homeassistant', on ? 'turn_off' : 'turn_on', { entity_id: ents });
    }
  }
  else if (act === 'lgrp') { 
    const g = CONFIG.lights[+el.dataset.i]; 
    call('homeassistant', groupInfo(g).on ? 'turn_off' : 'turn_on', { entity_id: g.entities }); 
  }
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

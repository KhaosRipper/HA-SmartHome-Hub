/* ==========================================================================
   Smart Home Hub – Core Module (core.js)
   Icons, Helfer, State, HA-Bridge, Theme, Kiosk, PIN & Konfigurations-Speicher
   ========================================================================== */

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
  search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff:'<path d="M9.9 4.2A9.1 9.1 0 0 1 12 4c6.5 0 10 8 10 8a18.5 18.5 0 0 1-2.2 3.2M14.1 14.1a3 3 0 1 1-4.2-4.2"/><path d="M1 1l22 22"/><path d="M6.6 6.6A18.2 18.2 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/>',
  layout:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
  sliders:'<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  play:'<polygon points="6 4 20 12 6 20 6 4"/>',
  pause:'<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  prev:'<polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/>',
  next:'<polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/>'
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
const HVAC_LABELS = HVAC_DE;
const PRESET_LABELS = PRESET_DE;
const FAN_LABELS = { auto:'Auto', low:'Niedrig', medium:'Mittel', high:'Hoch', quiet:'Leise', turbo:'Turbo', off:'Aus' };
const IC = new Proxy(ICONS, { get: (_, k) => ic(String(k), 20) });
const sinceStr = iso => { const ms = Date.parse(iso); return Number.isFinite(ms) ? fmtDur(Date.now() - ms) : ''; };
const stateLabel = st => ({ on:'Eingeschaltet', off:'Ausgeschaltet', open:'Geöffnet', closed:'Geschlossen', playing:'Spielt ab', paused:'Pausiert', idle:'Bereit', standby:'Standby', locked:'Verriegelt', unlocked:'Entriegelt', unavailable:'Nicht verfügbar', unknown:'Unbekannt' }[st] || st);
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

const THEME_PRESETS = {
  midnight: { name: 'Midnight Purple (Standard)', bg: '#080912', acc: '#7c6cf0', acc2: '#a99bff', ok: '#34d399', warn: '#f59e0b', cool: '#38bdf8' },
  ocean:    { name: 'Ocean Blue',                 bg: '#060c17', acc: '#0ea5e9', acc2: '#7dd3fc', ok: '#10b981', warn: '#f59e0b', cool: '#38bdf8' },
  emerald:  { name: 'Emerald Forest',             bg: '#06110e', acc: '#10b981', acc2: '#6ee7b7', ok: '#34d399', warn: '#f59e0b', cool: '#38bdf8' },
  amber:    { name: 'Warm Sunset',                bg: '#110b08', acc: '#f97316', acc2: '#fdba74', ok: '#34d399', warn: '#eab308', cool: '#38bdf8' },
  slate:    { name: 'Pure Slate Pro',             bg: '#090d16', acc: '#6366f1', acc2: '#a5b4fc', ok: '#22c55e', warn: '#f59e0b', cool: '#06b6d4' }
};

function moveItem(arr, idx, dir) {
  const target = idx + dir;
  if (!Array.isArray(arr) || target < 0 || target >= arr.length) return;
  const tmp = arr[idx];
  arr[idx] = arr[target];
  arr[target] = tmp;
}

function parseColsMode(val, defaultMode = 'auto', defaultCols = 2) {
  const s = String(val ?? '').trim().toLowerCase();
  if (!s || s === 'auto' || s === 'grid') return { mode: 'auto', cols: defaultCols };
  if (s === '2-asym' || s === '2col-asym' || s === 'asym') return { mode: 'asym', cols: 2 };
  if (s === '2-equal') return { mode: 'cols', cols: 2 };
  if (s === 'column' || s === '1-col' || s === '1col') return { mode: 'cols', cols: 1 };
  const m = s.match(/^(\d+)/);
  if (m) {
    const n = clamp(parseInt(m[1], 10) || defaultCols, 1, 12);
    return { mode: 'cols', cols: n };
  }
  return { mode: defaultMode, cols: defaultCols };
}

function getLocksList(secObj = CONFIG.security) {
  const sec = secObj || {};
  if (Array.isArray(sec.locks) && sec.locks.length) return sec.locks.filter(l => l && l.entity);
  if (sec.lock) return [{ name: 'Haustür', entity: sec.lock }];
  return [];
}

function DEFAULT_CLIMATE_TILES() {
  return [
    { type: 'hvac', show: true, label: 'Modus',  entity: '', attr: '', icon: 'sun' },
    { type: 'fan',  show: true, label: 'Lüfter', entity: '', attr: '', icon: 'fan' }
  ];
}

function DEFAULT_DASHBOARD_LAYOUT() {
  return [
    { id: 'hero',       label: 'Raum-Banner (Hero & Kamera)',     col: 1, show: true, scope: 'all',  cfgTab: 'raeume' },
    { id: 'devices',    label: 'Geräteübersicht',                 col: 1, show: true, scope: 'all',  cfgTab: 'geraete' },
    { id: 'extra_tabs', label: 'Zusätzliche Geräte-Reiter',       col: 1, show: true, scope: 'all',  cfgTab: 'geraete' },
    { id: 'covers',     label: 'Rolläden-Steuerung',              col: 1, show: true, scope: 'home', cfgTab: 'geraete' },
    { id: 'calendar',   label: 'Familienkalender',                col: 1, show: true, scope: 'home', cfgTab: 'energie' },
    { id: 'status',     label: 'Sicherheits-Status & Türschloss', col: 2, show: true, scope: 'all',  cfgTab: 'kameras' },
    { id: 'climate',    label: 'Raumklima & Wetter-Kachel',       col: 2, show: true, scope: 'all',  cfgTab: 'allgemein' },
    { id: 'metrics',    label: 'Metriken (Energie / Wasser)',     col: 2, show: true, scope: 'all',  cfgTab: 'energie' },
    { id: 'security',   label: 'Sicherheit (Schlösser/Fenster)',  col: 2, show: true, scope: 'all',  cfgTab: 'kameras' },
    { id: 'lights',     label: 'Lichter-Gruppen',                 col: 2, show: true, scope: 'all',  cfgTab: 'geraete' },
    { id: 'trash',      label: 'Abfallkalender',                  col: 2, show: true, scope: 'home', cfgTab: 'energie' }
  ];
}

function ensureConfigDefaults(cfg) {
  if (!cfg.theme) cfg.theme = {};
  if (!cfg.theme.bg) cfg.theme.bg = '#080912';
  if (!cfg.theme.acc) cfg.theme.acc = '#7c6cf0';
  if (!cfg.theme.acc2) cfg.theme.acc2 = '#a99bff';
  if (!cfg.theme.ok) cfg.theme.ok = '#34d399';
  if (!cfg.theme.warn) cfg.theme.warn = '#f59e0b';
  if (!cfg.theme.cool) cfg.theme.cool = '#38bdf8';
  if (!cfg.theme.radius) cfg.theme.radius = '20';
  if (!cfg.theme.density) cfg.theme.density = 'normal';

  if (!cfg.dashboardCols) cfg.dashboardCols = '2-asym';
  if (!cfg.klimaCols) cfg.klimaCols = 'auto';
  if (!cfg.camCols) cfg.camCols = 'auto';

  const defLayout = DEFAULT_DASHBOARD_LAYOUT();
  if (!Array.isArray(cfg.dashboardLayout) || !cfg.dashboardLayout.length) {
    cfg.dashboardLayout = JSON.parse(JSON.stringify(defLayout));
  } else {
    // Fehlende Standard-Blöcke ergänzen, bestehende Reihenfolge & Einstellungen behalten
    defLayout.forEach(defItem => {
      const existing = cfg.dashboardLayout.find(x => x && x.id === defItem.id);
      if (!existing) {
        cfg.dashboardLayout.push(JSON.parse(JSON.stringify(defItem)));
      } else {
        if (!existing.label) existing.label = defItem.label;
        if (!existing.cfgTab) existing.cfgTab = defItem.cfgTab;
        if (existing.show === undefined) existing.show = true;
        if (!existing.col) existing.col = defItem.col;
        if (!existing.scope) existing.scope = defItem.scope;
      }
    });
  }

  if (!cfg.security) cfg.security = { lock: '', locks: [], windows: [], cameras: [] };
  if (!Array.isArray(cfg.security.locks)) {
    cfg.security.locks = cfg.security.lock ? [{ name: 'Haustür', entity: cfg.security.lock }] : [];
  }
  if (!Array.isArray(cfg.security.windows)) cfg.security.windows = [];
  if (!Array.isArray(cfg.security.cameras)) cfg.security.cameras = [];

  if (!Array.isArray(cfg.deviceTabs) || !cfg.deviceTabs.length) {
    cfg.deviceTabs = [
      { id: 'geraete', name: 'Geräte' },
      { id: 'covers', name: 'Rolläden' }
    ];
  }
  if (!Array.isArray(cfg.metrics)) cfg.metrics = [];
  if (!Array.isArray(cfg.rooms) || !cfg.rooms.length) cfg.rooms = [{ name: 'Home', image: '', color: '#2a2370', chips: [] }];
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
  if (!Array.isArray(cfg.lights)) cfg.lights = [];
  if (!Array.isArray(cfg.covers)) cfg.covers = [];
  if (!Array.isArray(cfg.devices)) cfg.devices = [];
  if (!Array.isArray(cfg.webrtcCameras)) cfg.webrtcCameras = [];
  if (!Array.isArray(cfg.climateRooms)) cfg.climateRooms = [];
  if (!Array.isArray(cfg.powerFlow)) cfg.powerFlow = [];
  if (!cfg.calendars) cfg.calendars = { weatherEntity: '', familyEntities: [], trashEntities: [] };
  if (!Array.isArray(cfg.calendars.familyEntities)) cfg.calendars.familyEntities = [];
  if (!Array.isArray(cfg.calendars.trashEntities)) cfg.calendars.trashEntities = [];

  if (!Array.isArray(cfg.customPages)) cfg.customPages = [];
  cfg.customPages.forEach(p => {
    if (!p.layout) p.layout = 'grid';
    if (!Array.isArray(p.widgets)) p.widgets = [];
    p.widgets.forEach(w => {
      if (w.show === undefined) w.show = true;
      if (!w.col) w.col = 'auto';
    });
  });

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
  const rad = parseInt(String(th.radius || '22').replace('px', ''), 10);
  r.setProperty('--r', (Number.isFinite(rad) ? rad : 22) + 'px');
  const dens = th.density || 'normal';
  const isRelaxed = dens === 'relaxed' || dens === 'spacious';
  const gapVal = dens === 'compact' ? '12px' : isRelaxed ? '22px' : '16px';
  r.setProperty('--gap', gapVal);
  r.setProperty('--grid-gap', gapVal);
  r.setProperty('--card-pad', dens === 'compact' ? '14px' : isRelaxed ? '22px' : '18px');
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
  if (typeof probeGo2rtc === 'function') probeGo2rtc(true);
}

async function saveConfigToServer(newCfg) {
  CONFIG = ensureConfigDefaults(newCfg);
  localStorage.setItem('smarthome_hub_backup_cfg', JSON.stringify(CONFIG));
  applyTheme();
  applyKioskMode(!!CONFIG.kioskMode);
  syncHASidebarDOM(CONFIG.sidebarTitle, CONFIG.sidebarIcon);
  if (typeof probeGo2rtc === 'function') probeGo2rtc(true);
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
  } else if (d === 'light') {
    state = code % 2 ? 'on' : 'off';
    attributes = {
      friendly_name: id,
      brightness: 204,
      color_temp_kelvin: 3200,
      min_color_temp_kelvin: 2000,
      max_color_temp_kelvin: 6500,
      rgb_color: [124, 108, 240],
      supported_color_modes: ['rgb', 'color_temp'],
      effect_list: ['Solid', 'Rainbow', 'Breathe', 'Aurora', 'Candle'],
      effect: 'Solid'
    };
  } else if (d === 'media_player') {
    state = 'playing';
    attributes = {
      friendly_name: id,
      volume_level: 0.35,
      is_volume_muted: false,
      media_title: 'Abendprogramm',
      source: 'HDMI 1',
      source_list: ['TV', 'HDMI 1', 'Netflix', 'YouTube', 'Spotify']
    };
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
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ---------- UI-Zustand ---------- */
const coverDrag = { active: false, el: null, entity: null, pointerId: null, lastSentAt: 0, lastSentPos: null };
const ui = {
  room: 0,
  view: localStorage.getItem('hub_view') || 'dashboard',
  showAll: false,
  editMode: false,
  unlockArmedEntity: null,
  unlockArmedUntil: 0,
  seriesVer: 0
};
const series = {};
const yesterdayMetricVals = {};

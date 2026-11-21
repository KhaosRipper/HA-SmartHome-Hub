/* ==========================================================================
   Smart Home Hub – Core Module (core.js)
   Icons, Helfer, State, HA-Bridge, Theme, Kiosk, PIN & Konfigurations-Speicher
   ========================================================================== */

const VERSION = '3.4.0';

const CALENDAR_STYLES = [
  ['list',   '📋 7-Tage-Liste (Classic)',      'Liste'],
  ['agenda', '⚡ Kompakt-Agenda (Nur Termine)', 'Agenda'],
  ['google', '🟦 Google-Kalender-Stil',        'Google'],
  ['apple',  '🍎 Apple-Kalender-Stil (Split)', 'Apple'],
  ['board',  '🗂️ Wochen-Board (7 Spalten)',    'Board'],
  ['month',  '📅 Monats-Kalender (Raster)',    'Monat']
];
const VALID_CALENDAR_STYLES = new Set(CALENDAR_STYLES.map(x => x[0]));
function normalizeCalendarStyle(val, fallback = 'agenda') {
  const s = String(val || '').trim().toLowerCase();
  return VALID_CALENDAR_STYLES.has(s) ? s : fallback;
}

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
  bell:'<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>',
  moon:'<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  door:'<path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14M4 20h16M14 12v.01"/>',
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
  midnight:   { name: 'Midnight Purple',         bg: '#080912', acc: '#7c6cf0', acc2: '#a99bff', ok: '#34d399', warn: '#f59e0b', cool: '#38bdf8', radius: '22px' },
  ocean:      { name: 'Ocean Deep Blue',         bg: '#060c18', acc: '#0284c7', acc2: '#38bdf8', ok: '#10b981', warn: '#f59e0b', cool: '#06b6d4', radius: '20px' },
  emerald:    { name: 'Emerald Forest',          bg: '#05120d', acc: '#059669', acc2: '#34d399', ok: '#10b981', warn: '#f59e0b', cool: '#2dd4bf', radius: '20px' },
  amber:      { name: 'Warm Sunset & Bronze',    bg: '#120a06', acc: '#ea580c', acc2: '#fb923c', ok: '#10b981', warn: '#f59e0b', cool: '#38bdf8', radius: '18px' },
  slate:      { name: 'Pure Slate Pro',          bg: '#090d16', acc: '#6366f1', acc2: '#a5b4fc', ok: '#22c55e', warn: '#f59e0b', cool: '#06b6d4', radius: '18px' },
  nordic:     { name: 'Nordic Frost (Ice Cyan)', bg: '#080f14', acc: '#0ea5e9', acc2: '#7dd3fc', ok: '#2dd4bf', warn: '#fbbf24', cool: '#38bdf8', radius: '16px' },
  cyberpunk:  { name: 'Cyber Neon (Synthwave)',  bg: '#0d0614', acc: '#ec4899', acc2: '#f472b6', ok: '#10b981', warn: '#fbbf24', cool: '#06b6d4', radius: '14px' },
  dracula:    { name: 'Dracula Glow',            bg: '#10111a', acc: '#a855f7', acc2: '#c084fc', ok: '#4ade80', warn: '#facc15', cool: '#22d3ee', radius: '18px' },
  oled:       { name: 'OLED Pure Black',         bg: '#000000', acc: '#4f46e5', acc2: '#818cf8', ok: '#16a34a', warn: '#eab308', cool: '#0284c7', radius: '26px' },
  rose:       { name: 'Rose Gold & Velvet',      bg: '#14080c', acc: '#f43f5e', acc2: '#fb7185', ok: '#10b981', warn: '#f59e0b', cool: '#38bdf8', radius: '22px' },
  coffee:     { name: 'Espresso & Kupfer',       bg: '#110c08', acc: '#c2410c', acc2: '#f97316', ok: '#84cc16', warn: '#eab308', cool: '#38bdf8', radius: '16px' },
  monochrome: { name: 'Monochrome Minimalist',   bg: '#0d0f12', acc: '#94a3b8', acc2: '#cbd5e1', ok: '#22c55e', warn: '#f59e0b', cool: '#38bdf8', radius: '12px' }
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
  if (Array.isArray(sec.locks) && sec.locks.length) {
    return sec.locks.filter(l => l && l.entity).map(l => ({
      ...l,
      battery: l.battery || '',
      batPos: l.batPos || 'pill',
      batStyle: l.batStyle || 'badge'
    }));
  }
  if (sec.lock) return [{ name: 'Haustür', entity: sec.lock, battery: '', batPos: 'pill', batStyle: 'badge' }];
  return [];
}

function DEFAULT_CLIMATE_TILES() {
  return [
    { type: 'hvac', show: true, label: 'Modus',  entity: '', attr: '', icon: 'sun' },
    { type: 'fan',  show: true, label: 'Lüfter', entity: '', attr: '', icon: 'fan' }
  ];
}

function calcAbsoluteHumidity(t, rh) {
  if (t == null || rh == null || isNaN(t) || isNaN(rh)) return null;
  const T = parseFloat(t);
  const RH = parseFloat(rh);
  const vSat = 6.112 * Math.exp((17.67 * T) / (T + 243.5));
  const vAct = (RH / 100) * vSat;
  const ah = (216.7 * vAct) / (273.15 + T);
  return Number.isFinite(ah) ? +ah.toFixed(1) : null;
}

function DEFAULT_DASHBOARD_LAYOUT() {
  return [
    { id: 'alerts',           label: '🚨 Bedingte Warn-Karten',           col: 1, show: true,  scope: 'all',  cfgTab: 'kameras' },
    { id: 'hero',             label: '🖼️ Raum-Banner (Hero & Kamera)',    col: 1, show: true,  scope: 'all',  cfgTab: 'raeume' },
    { id: 'presence',         label: '👥 Familien-Präsenz',               col: 1, show: true,  scope: 'all',  cfgTab: 'allgemein' },
    { id: 'quick_routines',   label: '⚡ Szenen & Routinen',               col: 1, show: true,  scope: 'home', cfgTab: 'allgemein' },
    { id: 'devices',          label: '🔌 Geräteübersicht',                col: 1, show: true,  scope: 'all',  cfgTab: 'geraete' },
    { id: 'extra_tabs',       label: '📑 Zusätzliche Geräte-Reiter',      col: 1, show: true,  scope: 'all',  cfgTab: 'geraete' },
    { id: 'appliances',       label: '🧺 Haushaltsgeräte-Monitor',        col: 1, show: true,  scope: 'all',  cfgTab: 'geraete' },
    { id: 'covers',           label: '🪟 Rolläden-Steuerung',             col: 1, show: true,  scope: 'home', cfgTab: 'geraete' },
    { id: 'calendar',         label: '📅 Familienkalender',               col: 1, show: true,  scope: 'home', cfgTab: 'kalender' },
    { id: 'status',           label: '🛡️ Sicherheits-Status & Türschloss', col: 2, show: true,  scope: 'all',  cfgTab: 'kameras' },
    { id: 'climate',          label: '🌡️ Raumklima & Wetter-Kachel',      col: 2, show: true,  scope: 'all',  cfgTab: 'klima' },
    { id: 'rain_timeline',    label: '🌧️ Regenradar (60-Minuten-Vorschau)', col: 2, show: true, scope: 'all',  cfgTab: 'klima' },
    { id: 'ventilation',      label: '🌬️ Smarte Lüftungsempfehlung',     col: 2, show: true,  scope: 'all',  cfgTab: 'klima' },
    { id: 'favorites',        label: '⭐ Schnellauswahl / Favoriten',     col: 2, show: true,  scope: 'all',  cfgTab: 'geraete' },
    { id: 'energy_prices',    label: '💶 Dynamische Strompreise',         col: 2, show: false, scope: 'all',  cfgTab: 'energie' },
    { id: 'metrics',          label: '⚡ Metriken (Energie / Wasser)',    col: 2, show: true,  scope: 'all',  cfgTab: 'energie' },
    { id: 'power_flow',       label: '🔄 Power Flow (Energiefluss)',      col: 2, show: false, scope: 'home', cfgTab: 'energie' },
    { id: 'battery_forecast', label: '🔋 Speicher-Restlaufzeit & Prognose', col: 2, show: true, scope: 'all',  cfgTab: 'energie' },
    { id: 'wallbox',          label: '🚗 Wallbox & E-Auto',               col: 2, show: false, scope: 'all',  cfgTab: 'energie' },
    { id: 'security',         label: '🔒 Sicherheit (Schlösser/Fenster)', col: 2, show: true,  scope: 'all',  cfgTab: 'kameras' },
    { id: 'lights',           label: '💡 Lichter-Gruppen',                col: 2, show: true,  scope: 'all',  cfgTab: 'geraete' },
    { id: 'system_health',    label: '🖥️ System-Health (Server/Docker)',  col: 2, show: false, scope: 'all',  cfgTab: 'geraete' },
    { id: 'trash',            label: '🗑️ Abfallkalender',                 col: 2, show: true,  scope: 'home', cfgTab: 'kalender' }
  ];
}

function isCardInRoomScope(item, roomObj, isHome) {
  if (!item) return false;
  const sc = item.scope || 'all';
  if (sc === 'all') return true;
  if (sc === 'home') return !!isHome;
  if (sc === 'none') return false;
  const rName = (roomObj && roomObj.name) || '';
  if (sc.startsWith('room:')) {
    return rName === sc.slice(5);
  }
  if (sc === 'custom' && Array.isArray(item.scopeRooms)) {
    return item.scopeRooms.includes(rName);
  }
  return true;
}

function normalizeItemShowOn(item, defaultLoc = 'Home') {
  if (!item || typeof item !== 'object') return [defaultLoc];
  if (Array.isArray(item.showOn) && item.showOn.length) {
    return item.showOn.filter(Boolean);
  }
  if (item.room && String(item.room).trim()) {
    return [String(item.room).trim()];
  }
  return [defaultLoc];
}

function isItemVisibleInContext(item, ctx = {}) {
  if (!item) return false;
  if (ctx.showAll) return true;
  const locs = normalizeItemShowOn(item, ctx.defaultLoc || 'Home');
  const lowerLocs = locs.map(l => String(l).toLowerCase());
  if (lowerLocs.includes('all')) return true;

  if (ctx.explicitFilter && String(ctx.explicitFilter).trim()) {
    const f = String(ctx.explicitFilter).trim().toLowerCase();
    if (lowerLocs.includes(f) || lowerLocs.includes('room:' + f) || lowerLocs.includes('page:' + f)) {
      return true;
    }
    return false;
  }

  if (ctx.pageId) {
    const pid = String(ctx.pageId).toLowerCase();
    if (lowerLocs.includes('page:' + pid) || lowerLocs.includes(pid)) return true;
    if (ctx.pageLabel) {
      const pl = String(ctx.pageLabel).toLowerCase();
      if (lowerLocs.includes(pl) || lowerLocs.includes('room:' + pl)) return true;
    }
    return false;
  }

  const rName = String(ctx.roomName || 'Home').toLowerCase();
  if (lowerLocs.includes(rName) || lowerLocs.includes('room:' + rName)) return true;
  return false;
}

function formatItemShowOnSummary(item, cfg = CONFIG) {
  const locs = normalizeItemShowOn(item, 'Home');
  if (locs.includes('all')) return 'Überall';
  const pages = (cfg && cfg.customPages) || [];
  return locs.map(l => {
    if (l.startsWith('page:')) {
      const pid = l.slice(5);
      const pg = pages.find(p => p && p.id === pid);
      return pg ? `📄 ${pg.label}` : l;
    }
    if (l.startsWith('room:')) return l.slice(5);
    return l;
  }).join(', ');
}

const MODULE_SHOW_PROP_MAP = {
  presence: ['presence', 'show'],
  ventilation: ['ventilation', 'show'],
  battery_forecast: ['batteryForecast', 'show'],
  energy_prices: ['energyPrices', 'show'],
  wallbox: ['wallbox', 'show'],
  appliances: ['appliances', 'show'],
  system_health: ['systemHealth', 'show'],
  rain_timeline: ['weather', 'showRainTimeline']
};

function syncLayoutAndModuleShow(cfg, preferModuleFlag = false) {
  if (!cfg || !Array.isArray(cfg.dashboardLayout)) return;
  Object.entries(MODULE_SHOW_PROP_MAP).forEach(([cardId, [modKey, propKey]]) => {
    const dlItem = cfg.dashboardLayout.find(x => x && x.id === cardId);
    const modObj = cfg[modKey];
    if (!dlItem || !modObj || typeof modObj !== 'object') return;
    if (preferModuleFlag) {
      if (modObj[propKey] === false) dlItem.show = false;
      else if (modObj[propKey] === true && dlItem.show === undefined) dlItem.show = true;
      modObj[propKey] = dlItem.show !== false;
    } else {
      modObj[propKey] = dlItem.show !== false;
    }
  });
}

/* ---------- Fenster- & Tür-Offen-Timer & Auskühlungsschutz ---------- */
function getOpenWindowsAndDoors(customWarnMinutes = null) {
  const sec = CONFIG.security || {};
  const vent = CONFIG.ventilation || {};
  const warnMins = customWarnMinutes ?? (vent.openWarnMinutes || 10);
  const outT = num(vent.outdoorTemp);
  const isCold = outT != null ? outT <= (vent.warnOutdoorTempThreshold ?? 12) : true;

  const itemsToCheck = [];
  (sec.windows || []).forEach(w => {
    if (w) itemsToCheck.push({ entity: w, type: 'window' });
  });
  (sec.doors || []).forEach(d => {
    if (typeof d === 'string') itemsToCheck.push({ entity: d, type: 'door' });
    else if (d && d.entity) itemsToCheck.push({ entity: d.entity, name: d.name, type: 'door' });
  });

  const now = Date.now();
  const openList = [];

  itemsToCheck.forEach(it => {
    const s = S(it.entity);
    if (!s) return;
    const isOpen = s.state === 'on' || s.state === 'open' || s.state === 'unlocked';
    if (!isOpen) return;

    const fn = (s.attributes && s.attributes.friendly_name) || it.name || it.entity;
    const since = s.last_changed ? Date.parse(s.last_changed) : now;
    const durationMs = Math.max(0, now - since);
    const minsOpen = Math.floor(durationMs / 60000);
    const isOverdue = minsOpen >= warnMins;

    openList.push({
      entity: it.entity,
      name: fn,
      type: it.type,
      since,
      durationMs,
      minsOpen,
      isOverdue,
      warnTriggered: isOverdue && isCold
    });
  });

  openList.sort((a, b) => b.durationMs - a.durationMs);

  return {
    openItems: openList,
    hasWarn: openList.some(x => x.warnTriggered),
    warnMinutes: warnMins,
    outdoorTemp: outT,
    isCold
  };
}

/* ---------- Speicher-Restlaufzeit & Ladeprognose ---------- */
function calcBatteryForecast() {
  const bf = CONFIG.batteryForecast || {};
  const pf = CONFIG.powerFlow || [];

  const findEnt = (regex) => {
    const item = pf.find(x => regex.test(x.label || '') || regex.test(x.entity || ''));
    return item ? item.entity : '';
  };

  const socEnt = bf.socEntity || findEnt(/speicher|akku|battery/i) || 'sensor.senec_battery_charge_percent';
  const chgEnt = bf.chargePowerEntity || findEnt(/lad|charge/i) || 'sensor.senec_battery_charge_power';
  const disEnt = bf.dischargePowerEntity || findEnt(/entlad|discharge/i) || 'sensor.senec_battery_discharge_power';
  const houseEnt = bf.housePowerEntity || findEnt(/haus|home|verbr/i) || 'sensor.senec_house_power';
  const pvEnt = bf.pvPowerEntity || findEnt(/pv|solar|prod/i) || 'sensor.senec_solar_generated_power';

  const soc = num(socEnt);
  if (soc == null) return null;

  const capacityKwh = parseFloat(bf.capacityKwh) || 10.0;
  const minSoC = parseFloat(bf.minSoC ?? 5);
  const maxSoC = parseFloat(bf.maxSoC ?? 100);

  const chgPower = Math.max(0, num(chgEnt) || 0);
  const disPower = Math.max(0, num(disEnt) || 0);
  const housePower = Math.max(0, num(houseEnt) || 450);
  const pvPower = Math.max(0, num(pvEnt) || 0);

  const totalWh = capacityKwh * 1000;
  const currentWh = (soc / 100) * totalWh;
  const usableWh = Math.max(0, ((soc - minSoC) / 100) * totalWh);
  const neededWh = Math.max(0, ((maxSoC - soc) / 100) * totalWh);

  const now = new Date();

  // 1. Ladung aktiv (> 40 W)
  if (chgPower >= 40) {
    const hoursToFull = neededWh / chgPower;
    const etaMs = Date.now() + Math.min(hoursToFull * 3600000, 48 * 3600000);
    const eta = new Date(etaMs);
    const h = Math.floor(hoursToFull);
    const m = Math.round((hoursToFull - h) * 60);
    const durStr = h > 0 ? `${h}h ${m}m` : `${m}m`;
    const etaStr = eta.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    const isToday = eta.getDate() === now.getDate();

    return {
      state: 'charging',
      soc,
      powerW: chgPower,
      hoursRemaining: hoursToFull,
      durationStr: durStr,
      etaStr: isToday ? `${etaStr} Uhr` : `Morgen ${etaStr} Uhr`,
      desc: `Voll in ca. ${durStr} (${isToday ? etaStr : 'Morgen ' + etaStr} Uhr) bei ${fmt(chgPower, 0)} W Ladung`,
      shortDesc: `Voll in ca. ${durStr}`,
      targetTime: etaStr
    };
  }

  // 2. Entladung aktiv (> 40 W)
  if (disPower >= 40) {
    const hoursToEmpty = usableWh / disPower;
    const etaMs = Date.now() + Math.min(hoursToEmpty * 3600000, 72 * 3600000);
    const eta = new Date(etaMs);
    const h = Math.floor(hoursToEmpty);
    const m = Math.round((hoursToEmpty - h) * 60);
    const durStr = h > 0 ? `${h}h ${m}m` : `${m}m`;
    const etaStr = eta.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
    const isToday = eta.getDate() === now.getDate();

    return {
      state: 'discharging',
      soc,
      powerW: disPower,
      hoursRemaining: hoursToEmpty,
      durationStr: durStr,
      etaStr: isToday ? `${etaStr} Uhr` : `Morgen ${etaStr} Uhr`,
      desc: `Reicht ca. ${durStr} (${isToday ? etaStr : 'Morgen ' + etaStr} Uhr) bei ${fmt(disPower, 0)} W Entladung`,
      shortDesc: `Reicht ca. ${durStr}`,
      targetTime: etaStr
    };
  }

  // 3. Standby / Idle -> Berechnung anhand Hausverbrauch bzw. Grundlast
  const effectiveLoad = housePower > 50 ? housePower : (bf.defaultBaseLoad || 450);
  const hoursToEmpty = usableWh / effectiveLoad;
  const etaMs = Date.now() + Math.min(hoursToEmpty * 3600000, 72 * 3600000);
  const eta = new Date(etaMs);
  const h = Math.floor(hoursToEmpty);
  const m = Math.round((hoursToEmpty - h) * 60);
  const durStr = h > 0 ? `${h}h ${m}m` : `${m}m`;
  const etaStr = eta.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  const isToday = eta.getDate() === now.getDate();

  return {
    state: 'idle',
    soc,
    powerW: effectiveLoad,
    hoursRemaining: hoursToEmpty,
    durationStr: durStr,
    etaStr: isToday ? `${etaStr} Uhr` : `Morgen ${etaStr} Uhr`,
    desc: `Reicht ca. ${durStr} (bei Ø ${fmt(effectiveLoad, 0)} W Grundlast)`,
    shortDesc: `Reicht ca. ${durStr}`,
    targetTime: etaStr
  };
}

/* ---------- 60-Minuten Regenradar / Niederschlags-Timeline ---------- */
function getRainTimeline60Min() {
  const wCfg = CONFIG.weather || {};
  const hourly = weatherForecastState.hourly || [];
  const customRainEnt = wCfg.rainEntity ? S(wCfg.rainEntity) : null;

  const slots = [];
  const now = new Date();

  let rainProb = 0;
  let rainMm = 0;

  if (hourly.length >= 1) {
    const curHour = hourly[0] || {};
    const nextHour = hourly[1] || curHour;

    const curP = Number(curHour.precipitation || 0);
    const nextP = Number(nextHour.precipitation || 0);
    const curProb = Number(curHour.precipitation_probability || (curP > 0 ? 80 : 0));
    const nextProb = Number(nextHour.precipitation_probability || (nextP > 0 ? 80 : 0));

    rainProb = Math.max(curProb, nextProb);
    rainMm = Math.max(curP, nextP);

    for (let i = 0; i <= 6; i++) {
      const frac = i / 6;
      const slotTime = new Date(now.getTime() + i * 10 * 60000);
      const slotLabel = i === 0 ? 'Jetzt' : `+${i * 10}m`;
      const timeStr = `${pad(slotTime.getHours())}:${pad(slotTime.getMinutes())}`;
      
      const prob = Math.round(curProb + (nextProb - curProb) * frac);
      const mm = +(curP + (nextP - curP) * frac).toFixed(1);

      slots.push({
        idx: i,
        label: slotLabel,
        time: timeStr,
        prob,
        mm
      });
    }
  } else {
    const isRainingNow = (S(wCfg.entity)?.state || '').includes('rain');
    for (let i = 0; i <= 6; i++) {
      const slotTime = new Date(now.getTime() + i * 10 * 60000);
      const mm = isRainingNow ? Math.max(0, +(1.2 - i * 0.15).toFixed(1)) : 0;
      const prob = isRainingNow ? Math.max(0, 90 - i * 12) : 5;
      slots.push({
        idx: i,
        label: i === 0 ? 'Jetzt' : `+${i * 10}m`,
        time: `${pad(slotTime.getHours())}:${pad(slotTime.getMinutes())}`,
        prob,
        mm
      });
    }
    rainProb = slots[0].prob;
    rainMm = slots[0].mm;
  }

  let advice = '';
  let statusClass = 'dry';
  const firstRainSlot = slots.find(s => s.prob >= 40 || s.mm > 0.1);

  if (slots[0].mm > 0.1 || slots[0].prob >= 60) {
    statusClass = 'raining';
    const stopSlot = slots.find(s => s.mm <= 0.1 && s.prob < 40);
    advice = stopSlot
      ? `🌧️ Aktuell Niederschlag (~${slots[0].mm} mm) – Lässt gegen ${stopSlot.time} Uhr nach.`
      : `🌧️ Aktuell Niederschlag (~${slots[0].mm} mm) in der nächsten Stunde.`;
  } else if (firstRainSlot && firstRainSlot.idx > 0) {
    statusClass = 'soon';
    advice = `🌦️ Regen droht in ca. ${firstRainSlot.idx * 10} Min. (${firstRainSlot.time} Uhr) – Vor dem Gassigehen noch abwarten!`;
  } else {
    statusClass = 'dry';
    advice = '🌤️ Nächste 60 Minuten trocken – Perfekt zum Lüften & Gassigehen 🐕';
  }

  return {
    slots,
    rainProb,
    rainMm,
    advice,
    statusClass
  };
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
  if (cfg.theme.greetingColor === undefined) cfg.theme.greetingColor = '';
  if (cfg.theme.nameColor === undefined) cfg.theme.nameColor = '';
  if (cfg.theme.activityColor === undefined) cfg.theme.activityColor = '';
  if (cfg.theme.dateTimeColor === undefined) cfg.theme.dateTimeColor = '';

  if (!cfg.dateTimeSize) cfg.dateTimeSize = 13;
  if (!cfg.dashboardCols) cfg.dashboardCols = '2-asym';
  if (!cfg.dashboardLayoutMode) cfg.dashboardLayoutMode = 'columns';
  if (cfg.dashboardColRatio === undefined) cfg.dashboardColRatio = '';
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

  cfg.dashboardLayout.forEach(item => {
    if (!item.width) item.width = '100';
    if (!item.span) {
      if (item.col === 'full') item.span = 12;
      else if (item.width === '50') item.span = 6;
      else if (item.width === '33') item.span = 4;
      else if (item.width === '66') item.span = 8;
      else if (item.width === '25') item.span = 3;
      else if (item.col === '2') item.span = 4;
      else item.span = 8;
    }
  });

  if (!cfg.security) cfg.security = { lock: '', locks: [], windows: [], cameras: [] };
  if (!Array.isArray(cfg.security.locks)) {
    cfg.security.locks = cfg.security.lock ? [{ name: 'Haustür', entity: cfg.security.lock }] : [];
  }
  if (!cfg.pinProtect || typeof cfg.pinProtect !== 'object') {
    cfg.pinProtect = { editor: true, systemLinks: true, kioskExit: true, doorUnlock: false };
  } else {
    if (cfg.pinProtect.editor === undefined) cfg.pinProtect.editor = true;
    if (cfg.pinProtect.systemLinks === undefined) cfg.pinProtect.systemLinks = true;
    if (cfg.pinProtect.kioskExit === undefined) cfg.pinProtect.kioskExit = true;
    if (cfg.pinProtect.doorUnlock === undefined) cfg.pinProtect.doorUnlock = false;
  }
  
  cfg.security.locks.forEach(l => {
    if (l.battery === undefined) l.battery = '';
    if (!l.batPos) l.batPos = 'pill';
    if (!l.batStyle) l.batStyle = 'badge';
  });
  if (!Array.isArray(cfg.security.windows)) cfg.security.windows = [];
  if (!Array.isArray(cfg.security.doors)) cfg.security.doors = [];
  if (!Array.isArray(cfg.security.cameras)) cfg.security.cameras = [];

  if (!Array.isArray(cfg.alerts)) cfg.alerts = [];
  if (!Array.isArray(cfg.routines)) cfg.routines = [];
  if (!cfg.presence || typeof cfg.presence !== 'object') cfg.presence = { show: false, members: [] };
  if (!Array.isArray(cfg.presence.members)) cfg.presence.members = [];
  if (!cfg.ventilation || typeof cfg.ventilation !== 'object') cfg.ventilation = { show: false, outdoorTemp: '', outdoorHum: '', rooms: [] };
  if (!Array.isArray(cfg.ventilation.rooms)) cfg.ventilation.rooms = [];
  if (cfg.ventilation.showOpenTimer === undefined) cfg.ventilation.showOpenTimer = true;
  if (cfg.ventilation.openWarnMinutes === undefined) cfg.ventilation.openWarnMinutes = 10;
  if (cfg.ventilation.warnOutdoorTempThreshold === undefined) cfg.ventilation.warnOutdoorTempThreshold = 12;

  if (!cfg.batteryForecast || typeof cfg.batteryForecast !== 'object') {
    cfg.batteryForecast = {
      show: true,
      capacityKwh: 10,
      minSoC: 5,
      maxSoC: 100,
      defaultBaseLoad: 450,
      socEntity: '',
      chargePowerEntity: '',
      dischargePowerEntity: '',
      housePowerEntity: '',
      pvPowerEntity: ''
    };
  } else {
    if (cfg.batteryForecast.show === undefined) cfg.batteryForecast.show = true;
    if (!cfg.batteryForecast.capacityKwh) cfg.batteryForecast.capacityKwh = 10;
    if (cfg.batteryForecast.minSoC === undefined) cfg.batteryForecast.minSoC = 5;
    if (cfg.batteryForecast.maxSoC === undefined) cfg.batteryForecast.maxSoC = 100;
    if (cfg.batteryForecast.defaultBaseLoad === undefined) cfg.batteryForecast.defaultBaseLoad = 450;
  }

  if (!cfg.energyPrices || typeof cfg.energyPrices !== 'object') {
    cfg.energyPrices = { show: false, entity: '', title: 'Dynamische Strompreise', priceUnit: 'Cent' };
  }
  if (!cfg.wallbox || typeof cfg.wallbox !== 'object') {
    cfg.wallbox = { show: false, title: 'Wallbox', socEntity: '', powerEntity: '', statusEntity: '', modeEntity: '' };
  }
  if (!cfg.appliances || typeof cfg.appliances !== 'object') {
    cfg.appliances = { show: false, title: 'Haushaltsgeräte', items: [] };
  }
  if (!Array.isArray(cfg.appliances.items)) cfg.appliances.items = [];
  if (cfg.appliances.show === undefined) cfg.appliances.show = cfg.appliances.items.length > 0;
  cfg.appliances.items.forEach(a => {
    if (!a.name) a.name = 'Haushaltsgerät';
    if (!a.icon) a.icon = 'washing';
  });

  if (!cfg.screensaver || typeof cfg.screensaver !== 'object') {
    cfg.screensaver = { show: true, timeoutMins: 3 };
  } else {
    if (cfg.screensaver.show === undefined) cfg.screensaver.show = true;
    if (cfg.screensaver.timeoutMins === undefined) cfg.screensaver.timeoutMins = 3;
  }

  if (!cfg.bellPopup || typeof cfg.bellPopup !== 'object') {
    cfg.bellPopup = { show: false, triggerEntity: '', cameraEntity: '', title: 'Türklingel', durationSec: 30 };
  } else {
    if (cfg.bellPopup.show === undefined) cfg.bellPopup.show = false;
    if (cfg.bellPopup.durationSec === undefined) cfg.bellPopup.durationSec = 30;
  }

  if (!cfg.systemHealth || typeof cfg.systemHealth !== 'object') cfg.systemHealth = { show: false, title: 'Server & Docker', cpu: '', ram: '', disk: '', temp: '', containers: [] };
  if (!Array.isArray(cfg.systemHealth.containers)) cfg.systemHealth.containers = [];

  if (!Array.isArray(cfg.deviceTabs) || !cfg.deviceTabs.length) {
    cfg.deviceTabs = [
      { id: 'geraete', name: 'Geräte' },
      { id: 'covers', name: 'Rolläden' }
    ];
  }
  if (!Array.isArray(cfg.favorites)) cfg.favorites = [];
  cfg.favorites.forEach(f => {
    if (f.show === undefined) f.show = true;
  });

  if (!Array.isArray(cfg.metrics)) cfg.metrics = [];
  cfg.metrics.forEach(m => {
    if (m.show === undefined) m.show = true;
    if (m.showChart === undefined) m.showChart = true;
    if (m.showCompare === undefined) m.showCompare = true;
    if (m.showSubButtons === undefined) m.showSubButtons = true;
    if (m.showLive === undefined) m.showLive = true;
    if (m.autarkyMode === undefined) m.autarkyMode = 'day';
  });
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
  if (cfg.weather.showRainTimeline === undefined) cfg.weather.showRainTimeline = true;
  if (cfg.weather.rainEntity === undefined) cfg.weather.rainEntity = '';
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
  cfg.lights.forEach(g => {
    if (!Array.isArray(g.entities)) g.entities = [];
    if (!Array.isArray(g.excludeGroup)) g.excludeGroup = [];
    if (!Array.isArray(g.excludeMain)) g.excludeMain = [];
    if (!Array.isArray(g.showOn) || !g.showOn.length) {
      if (g.room && String(g.room).trim()) {
        g.showOn = [String(g.room).trim()];
      } else {
        const gLow = String(g.name || '').toLowerCase();
        const matchedRoom = (cfg.rooms || []).find((rm, idx) => idx > 0 && rm && rm.name && (
          rm.name.toLowerCase() === gLow ||
          rm.name.toLowerCase().includes(gLow) ||
          (gLow === 'living' && rm.name.toLowerCase().includes('wohn'))
        ));
        g.showOn = matchedRoom ? ['Home', matchedRoom.name] : ['Home'];
      }
    }
  });
  if (!Array.isArray(cfg.covers)) cfg.covers = [];
  cfg.covers.forEach(c => {
    c.showOn = normalizeItemShowOn(c, 'Home');
    c.room = c.showOn.includes('all') ? '' : (c.showOn.find(x => !x.startsWith('page:')) || '');
  });
  if (!Array.isArray(cfg.devices)) cfg.devices = [];
  cfg.devices.forEach(d => {
    d.showOn = normalizeItemShowOn(d, 'Home');
    d.room = d.showOn.includes('all') ? 'Alle' : (d.showOn.find(x => !x.startsWith('page:')) || d.room || 'Home');
  });
  cfg.favorites.forEach(f => {
    f.showOn = normalizeItemShowOn(f, 'Home');
    f.room = f.showOn.includes('all') ? '' : (f.showOn.find(x => !x.startsWith('page:')) || '');
  });
  cfg.appliances.items.forEach(a => {
    a.showOn = normalizeItemShowOn(a, 'Home');
  });
  if (!Array.isArray(cfg.webrtcCameras)) cfg.webrtcCameras = [];
  if (!Array.isArray(cfg.climateRooms)) cfg.climateRooms = [];
  if (!Array.isArray(cfg.powerFlow)) cfg.powerFlow = [];
  if (!cfg.calendars) cfg.calendars = { weatherEntity: '', familyEntities: [], trashEntities: [] };
  if (!Array.isArray(cfg.calendars.familyEntities)) cfg.calendars.familyEntities = [];
  if (!Array.isArray(cfg.calendars.trashEntities)) cfg.calendars.trashEntities = [];
  const legacyCalStyle = cfg.calendarStyle || cfg.calendars.style || '';
  cfg.calendarHomeStyle = normalizeCalendarStyle(cfg.calendarHomeStyle || cfg.calendars.calendarHomeStyle || cfg.calendars.homeStyle || legacyCalStyle, 'agenda');
  cfg.calendarPageStyle = normalizeCalendarStyle(cfg.calendarPageStyle || cfg.calendars.calendarPageStyle || cfg.calendars.pageStyle || legacyCalStyle, 'apple');
  cfg.calendars.calendarHomeStyle = cfg.calendarHomeStyle;
  cfg.calendars.calendarPageStyle = cfg.calendarPageStyle;

  if (!Array.isArray(cfg.customPages)) cfg.customPages = [];
  cfg.customPages.forEach(p => {
    if (!p.layout) p.layout = 'grid';
    if (!Array.isArray(p.widgets)) p.widgets = [];
    // Automatische Migration der bestehenden Bundesliga-Seite auf das neue Google-Style Sport-Center (SC Freiburg)
    if (p.id === 'bundesliga' && !p._sportsHubMigrated) {
      p._sportsHubMigrated = true;
      const hasSportsHub = p.widgets.some(w => w && w.type === 'sports_hub');
      if (!hasSportsHub) {
        p.widgets.forEach(w => {
          if (w && ['buli_team', 'buli_table', 'buli_matchday'].includes(w.type)) w.show = false;
        });
        p.widgets.unshift({
          type: 'sports_hub',
          title: 'SC Freiburg',
          sport: 'soccer',
          league: 'ger.1',
          teamId: '126',
          teamName: 'SC Freiburg',
          viewMode: 'google',
          col: 'full',
          show: true,
          showHeader: true,
          showFocusMatch: true,
          showUpcoming: true,
          upcomingCount: 4,
          showTable: true,
          tableRows: 6,
          crossComp: true
        });
      }
    }
    p.widgets.forEach(w => {
      if (w.show === undefined) w.show = true;
      if (!w.col) w.col = w.type === 'sports_hub' ? 'full' : 'auto';
      if (w.type === 'sports_hub') {
        if (!w.sport) w.sport = 'soccer';
        if (!w.league) w.league = 'ger.1';
        if (!w.viewMode) w.viewMode = 'google';
        if (w.showHeader === undefined) w.showHeader = true;
        if (w.showFocusMatch === undefined) w.showFocusMatch = true;
        if (w.showUpcoming === undefined) w.showUpcoming = true;
        if (!w.upcomingCount) w.upcomingCount = 4;
        if (w.showTable === undefined) w.showTable = true;
        if (!w.tableRows) w.tableRows = 6;
        if (w.crossComp === undefined) w.crossComp = true;
      }
    });
  });

  syncLayoutAndModuleShow(cfg, !cfg._v32Synced);
  cfg._v32Synced = true;

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
  if (th.greetingColor) r.setProperty('--hero-greet-color', th.greetingColor);
  else r.removeProperty('--hero-greet-color');
  if (th.nameColor) r.setProperty('--hero-name-color', th.nameColor);
  else r.removeProperty('--hero-name-color');
  if (th.activityColor) r.setProperty('--hero-activity-color', th.activityColor);
  else r.removeProperty('--hero-activity-color');
  if (th.dateTimeColor) r.setProperty('--hero-datetime-color', th.dateTimeColor);
  else r.removeProperty('--hero-datetime-color');
  const rad = parseInt(String(th.radius || '22').replace('px', ''), 10);
  r.setProperty('--r', (Number.isFinite(rad) ? rad : 22) + 'px');
  const dtSize = clamp(parseInt(CONFIG.dateTimeSize, 10) || 13, 10, 48);
  r.setProperty('--dt-size', dtSize + 'px');
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
    if (ha && ha.hass && ha.hass.panels && ha.hass.panels['smarthome-hub']) {
      ha.hass.panels['smarthome-hub'].title = title || 'Smart Home Hub';
      ha.hass.panels['smarthome-hub'].icon = icon || 'mdi:home-automation';
    }
    const main = ha && ha.shadowRoot && ha.shadowRoot.querySelector('home-assistant-main');
    const drawer = main && main.shadowRoot && main.shadowRoot.querySelector('ha-drawer');
    const sidebar = (drawer && drawer.querySelector('ha-sidebar')) || (main && main.shadowRoot && main.shadowRoot.querySelector('ha-sidebar'));
    if (sidebar && sidebar.shadowRoot) {
      const link = sidebar.shadowRoot.querySelector('a[href="/smarthome-hub"], paper-icon-item[data-panel="smarthome-hub"], ha-md-list-item[href="/smarthome-hub"]');
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
const pinState = { buffer: '', onSuccess: null, title: '', verifying: false };

function requirePin(featureKey, actionFn, title = 'PIN erforderlich') {
  const pin = String(CONFIG.pinCode || '').trim();
  const protect = CONFIG.pinProtect || {};
  if (!pin || !protect[featureKey]) { actionFn(); return; }
  pinState.buffer = '';
  pinState.verifying = false;
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

async function handlePinKey(k) {
  if (pinState.verifying) return;
  const target = String(CONFIG.pinCode || '').trim();
  if (k === 'C') pinState.buffer = '';
  else if (k === '⌫') pinState.buffer = pinState.buffer.slice(0, -1);
  else pinState.buffer += k;
  renderPinModal();
  if (!target || pinState.buffer.length < target.length) return;

  const candidate = pinState.buffer;
  const h = getHass();
  let valid = false;
  if (h && typeof h.callWS === 'function') {
    pinState.verifying = true;
    try {
      const res = await h.callWS({ type: 'smarthome_hub/verify_pin', pin: candidate });
      valid = !!(res && res.valid);
    } catch (e) {
      valid = false;
    } finally {
      pinState.verifying = false;
    }
  } else {
    valid = candidate === target;
  }

  const modalEl = document.getElementById('pinmodal');
  if (!modalEl || !modalEl.classList.contains('show')) {
    pinState.buffer = '';
    pinState.onSuccess = null;
    return;
  }
  if (valid) {
    modalEl.classList.remove('show');
    pinState.buffer = '';
    const cb = pinState.onSuccess;
    pinState.onSuccess = null;
    if (cb) cb();
  } else {
    toast('Falsche PIN');
    pinState.buffer = '';
    setTimeout(renderPinModal, 250);
  }
}

/* ---------- Lokales Endgeräte-Profil (Tablet / Büro / PC) ---------- */
const DEVICE_PROFILE_KEY = 'smarthome_hub_device_profile';

function getDeviceProfile() {
  try {
    const raw = localStorage.getItem(DEVICE_PROFILE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      deviceName: parsed.deviceName || '',
      startView: parsed.startView || '',
      startRoom: parsed.startRoom || '',
      returnToStartMins: parsed.returnToStartMins != null ? Number(parsed.returnToStartMins) : 0,
      kioskOverride: parsed.kioskOverride || 'global',
      screensaverOverride: parsed.screensaverOverride || 'global'
    };
  } catch (e) {
    return { deviceName: '', startView: '', startRoom: '', returnToStartMins: 0, kioskOverride: 'global', screensaverOverride: 'global' };
  }
}

function saveDeviceProfile(prof) {
  const clean = Object.assign(getDeviceProfile(), prof || {});
  try {
    localStorage.setItem(DEVICE_PROFILE_KEY, JSON.stringify(clean));
  } catch (e) {}
  applyKioskMode(getEffectiveKioskMode());
  return clean;
}

function getEffectiveKioskMode() {
  const prof = getDeviceProfile();
  if (prof.kioskOverride === 'on') return true;
  if (prof.kioskOverride === 'off') return false;
  return !!(CONFIG && CONFIG.kioskMode);
}

function getEffectiveScreensaverShow() {
  const prof = getDeviceProfile();
  if (prof.screensaverOverride === 'on') return true;
  if (prof.screensaverOverride === 'off') return false;
  return !!(CONFIG && CONFIG.screensaver && CONFIG.screensaver.show !== false);
}

function applyDeviceStartView(isIdleReturn = false) {
  if (typeof ui === 'undefined' || !CONFIG) return false;
  const prof = getDeviceProfile();
  let changed = false;
  if (prof.startView) {
    // Prüfen, ob eine konfigurierte customPage noch existiert
    if (prof.startView.startsWith('page:')) {
      const pid = prof.startView.slice(5);
      const exists = (CONFIG.customPages || []).some(p => p && p.id === pid);
      if (exists && ui.view !== prof.startView) {
        ui.view = prof.startView;
        localStorage.setItem('hub_view', ui.view);
        changed = true;
      }
    } else if (ui.view !== prof.startView) {
      ui.view = prof.startView;
      localStorage.setItem('hub_view', ui.view);
      changed = true;
    }
  }
  if ((!prof.startView || prof.startView === 'dashboard') && prof.startRoom) {
    const rIdx = (CONFIG.rooms || []).findIndex(r => r && r.name && r.name.toLowerCase() === prof.startRoom.toLowerCase());
    if (rIdx >= 0 && ui.room !== rIdx) {
      ui.room = rIdx;
      changed = true;
    }
  }
  if (changed && isIdleReturn && typeof tick === 'function') {
    tick(true);
  }
  return changed;
}

/* ---------- Konfiguration laden / speichern & Multi-Device Live-Sync ---------- */
let _lastOwnSaveTs = 0;
let _lastKnownUpdatedAt = 0;
let _lastKnownServerDigest = '';
let _lastKnownAssetHash = '';
let _subscribedConnection = null;
let _initialDeviceProfileApplied = false;

function _configDigest(cfg) {
  if (!cfg || typeof cfg !== 'object') return '';
  const copy = Object.assign({}, cfg);
  delete copy._updatedAt;
  return JSON.stringify(copy);
}

async function loadConfigFromServer(isRemoteUpdate = false) {
  let h = getHass();
  // Falls das Panel im HA-Iframe lädt, aber ha.hass beim Start auf einem Tablet noch 100-500ms braucht:
  if (!h && window.parent && window.parent !== window && !isRemoteUpdate) {
    for (let attempt = 0; attempt < 15; attempt++) {
      await new Promise(r => setTimeout(r, 150));
      h = getHass();
      if (h && typeof h.callWS === 'function') break;
    }
  }
  DEMO = !h;
  if (h && typeof h.callWS === 'function') {
    try {
      const res = await h.callWS({ type: 'smarthome_hub/get_config' });
      if (res && res.asset_hash) {
        if (_lastKnownAssetHash && _lastKnownAssetHash !== res.asset_hash) {
          forceReloadApp(true);
          return;
        }
        _lastKnownAssetHash = res.asset_hash;
      }
      if (res && res.config && Object.keys(res.config).length > 0) {
        _lastKnownUpdatedAt = res.config._updatedAt || 0;
        _lastKnownServerDigest = _configDigest(res.config);
        CONFIG = ensureConfigDefaults(Object.assign(JSON.parse(JSON.stringify(EMPTY_CONFIG)), res.config));
        localStorage.setItem('smarthome_hub_backup_cfg', JSON.stringify(CONFIG));
      } else {
        const local = localStorage.getItem('smarthome_hub_backup_cfg');
        if (local) CONFIG = ensureConfigDefaults(Object.assign(JSON.parse(JSON.stringify(EMPTY_CONFIG)), JSON.parse(local)));
      }
    } catch (e) {
      const local = localStorage.getItem('smarthome_hub_backup_cfg');
      if (local) CONFIG = ensureConfigDefaults(Object.assign(JSON.parse(JSON.stringify(EMPTY_CONFIG)), JSON.parse(local)));
    }
    populateEntityDatalist();
    ensureHassLiveSync();
  }
  ensureConfigDefaults(CONFIG);
  applyTheme();
  applyKioskMode(getEffectiveKioskMode());
  if (!_initialDeviceProfileApplied && !isRemoteUpdate) {
    _initialDeviceProfileApplied = true;
    applyDeviceStartView(false);
  }
  syncHASidebarDOM(CONFIG.sidebarTitle, CONFIG.sidebarIcon);
  if (typeof probeGo2rtc === 'function') probeGo2rtc(true);
  if (isRemoteUpdate) {
    if (typeof rebuildEntitiesList === 'function') rebuildEntitiesList();
    if (typeof refreshSeries === 'function') refreshSeries();
    if (typeof refreshWeatherForecast === 'function') refreshWeatherForecast(true);
    if (typeof refreshHomeCalendars === 'function') refreshHomeCalendars(true);
    if (typeof tick === 'function') tick(true);
  }
}

async function saveConfigToServer(newCfg) {
  syncLayoutAndModuleShow(newCfg, false);
  CONFIG = ensureConfigDefaults(newCfg);
  const payloadCfg = JSON.parse(JSON.stringify(CONFIG));
  _lastOwnSaveTs = Date.now();
  CONFIG._updatedAt = _lastOwnSaveTs;
  const h = getHass();
  localStorage.setItem('smarthome_hub_backup_cfg', JSON.stringify(CONFIG));
  applyTheme();
  applyKioskMode(getEffectiveKioskMode());
  syncHASidebarDOM(CONFIG.sidebarTitle, CONFIG.sidebarIcon);
  if (typeof probeGo2rtc === 'function') probeGo2rtc(true);
  if (h && typeof h.callWS === 'function') {
    DEMO = false;
    ensureHassLiveSync();
    try {
      const res = await h.callWS({ type: 'smarthome_hub/save_config', config: payloadCfg });
      if (CONFIG.pinCode) {
        CONFIG.pinCode = '*'.repeat(String(CONFIG.pinCode).trim().length);
      }
      const confirmedTs = (res && res.updated_at) || _lastOwnSaveTs;
      _lastKnownUpdatedAt = confirmedTs;
      CONFIG._updatedAt = confirmedTs;
      _lastKnownServerDigest = _configDigest(CONFIG);
      localStorage.setItem('smarthome_hub_backup_cfg', JSON.stringify(CONFIG));
      syncHASidebarDOM(CONFIG.sidebarTitle, CONFIG.sidebarIcon);
      toast('Konfiguration gespeichert & an alle Geräte übertragen');
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

function ensureHassLiveSync() {
  const h = getHass();
  if (!h) return;
  if (DEMO) {
    DEMO = false;
    loadConfigFromServer(true);
    return;
  }
  const conn = h.connection;
  if (conn && typeof conn.subscribeEvents === 'function' && _subscribedConnection !== conn) {
    _subscribedConnection = conn;
    conn.subscribeEvents(ev => {
      const remoteTs = ev && ev.data && ev.data.updated_at;
      if (Date.now() - _lastOwnSaveTs < 2500) return;
      if (remoteTs && remoteTs === _lastKnownUpdatedAt) return;
      const cfgModal = document.getElementById('cfgmodal');
      if (cfgModal && cfgModal.classList.contains('show')) return;
      loadConfigFromServer(true);
    }, 'smarthome_hub_config_updated').catch(() => {
      _subscribedConnection = null;
    });
  }
}

async function checkRemoteConfigUpdate() {
  const h = getHass();
  if (!h || typeof h.callWS !== 'function') return;
  if (DEMO) {
    DEMO = false;
    await loadConfigFromServer(true);
    return;
  }
  ensureHassLiveSync();
  const cfgModal = document.getElementById('cfgmodal');
  if (cfgModal && cfgModal.classList.contains('show')) return;
  if (typeof ui !== 'undefined' && ui.editMode) return;
  if (Date.now() - _lastOwnSaveTs < 3000) return;
  try {
    const res = await h.callWS({ type: 'smarthome_hub/get_config' });
    if (res && res.asset_hash && _lastKnownAssetHash && res.asset_hash !== _lastKnownAssetHash) {
      forceReloadApp(true);
      return;
    }
    if (res && res.asset_hash) _lastKnownAssetHash = res.asset_hash;
    if (res && res.config && Object.keys(res.config).length > 0) {
      const remoteTs = res.config._updatedAt || 0;
      const remoteDigest = _configDigest(res.config);
      const changedByTs = remoteTs > 0 && remoteTs !== _lastKnownUpdatedAt;
      const changedByDigest = !remoteTs && _lastKnownServerDigest && remoteDigest !== _lastKnownServerDigest;
      if (changedByTs || changedByDigest) {
        _lastKnownUpdatedAt = remoteTs;
        _lastKnownServerDigest = remoteDigest;
        await loadConfigFromServer(true);
      }
    }
  } catch (e) {}
}

function forceReloadApp(silent = false) {
  if (!silent) toast('🔄 Lade Dashboard komplett neu…');
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('_cb', String(Date.now()));
    window.location.replace(url.toString());
  } catch (e) {
    window.location.reload();
  }
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
  if (!path) return;
  const p = String(path).trim();
  if (/^javascript:/i.test(p)) return;
  try {
    if (p.startsWith('/')) {
      window.parent.history.pushState(null, '', p);
      window.parent.dispatchEvent(new CustomEvent('location-changed'));
      return;
    }
  } catch (e) {}
  if (/^https?:\/\//i.test(p) || p.startsWith('/')) {
    window.open(p, '_blank', 'noopener,noreferrer');
  }
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


/* ---------- Hub als Standard-Dashboard in HA-Profil eintragen ---------- */
async function setHubAsDefaultPanel() {
  const PANEL = 'smarthome-hub';
  const h = getHass();
  if (!h) { toast('Keine Verbindung zu Home Assistant'); return; }
  let ok = false;
  // 1) Pro Browser/Gerät (ältere HA-Versionen & Fallback)
  try {
    window.parent.localStorage.setItem('defaultPanel', JSON.stringify(PANEL));
    ok = true;
  } catch (e) {}
  // 2) Pro HA-Benutzerkonto (neuere HA-Versionen), bestehende Werte bleiben erhalten
  try {
    const cur = await h.callWS({ type: 'frontend/get_user_data', key: 'core' });
    const val = Object.assign({}, (cur && cur.value) || {}, { defaultPanel: PANEL });
    await h.callWS({ type: 'frontend/set_user_data', key: 'core', value: val });
    ok = true;
  } catch (e) {}
  toast(ok ? 'Als Standard gesetzt – Seite neu laden (F5)' : 'Konnte Standard nicht setzen');
}
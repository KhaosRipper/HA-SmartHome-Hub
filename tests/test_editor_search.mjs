import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const editorSrc = fs.readFileSync('custom_components/smarthome_hub/panel/editor.js', 'utf8');
const cssSrc = fs.readFileSync('custom_components/smarthome_hub/panel/style.css', 'utf8');

// 1. CSS layout invariants preventing flex-shrink overlap during search
assert.match(cssSrc, /\.cfg-tab-content\{[^}]*flex:none/, '.cfg-tab-content must have flex:none');
assert.match(cssSrc, /details\.cfg-box\{[^}]*flex-shrink:0/, 'details.cfg-box must have flex-shrink:0');
assert.match(cssSrc, /\.cfg-search-hidden\{display:none!important\}/, '.cfg-search-hidden must hide elements');
assert.match(cssSrc, /mark\.cfg-hl\{/, 'mark.cfg-hl highlight rule must exist');

// 2. Minimal DOM harness to test applyCfgSearch / highlight / restore logic directly
class NodeBase {
  constructor(type) { this.nodeType = type; this.parentNode = null; this.childNodes = []; }
  appendChild(c) {
    if (c.nodeType === 11) { c.childNodes.slice().forEach(n => this.appendChild(n)); return c; }
    c.parentNode = this; this.childNodes.push(c); return c;
  }
  replaceChild(n, o) {
    const i = this.childNodes.indexOf(o);
    if (i < 0) return;
    if (n.nodeType === 11) {
      const kids = n.childNodes.slice();
      kids.forEach(k => { k.parentNode = this; });
      this.childNodes.splice(i, 1, ...kids);
    } else {
      n.parentNode = this;
      this.childNodes.splice(i, 1, n);
    }
    o.parentNode = null;
  }
  normalize() {
    for (let i = 0; i < this.childNodes.length - 1;) {
      const a = this.childNodes[i], b = this.childNodes[i + 1];
      if (a.nodeType === 3 && b.nodeType === 3) { a.nodeValue += b.nodeValue; this.childNodes.splice(i + 1, 1); }
      else i++;
    }
  }
  get textContent() { return this.nodeType === 3 ? this.nodeValue : this.childNodes.map(c => c.textContent).join(''); }
  set textContent(v) { this.childNodes = v ? [new TextNode(String(v), this)] : []; }
}
class TextNode extends NodeBase {
  constructor(v, p = null) { super(3); this.nodeValue = v; this.parentNode = p; }
  get parentElement() { return this.parentNode && this.parentNode.nodeType === 1 ? this.parentNode : null; }
}
class Frag extends NodeBase { constructor() { super(11); } }
class El extends NodeBase {
  constructor(tag, attrs = {}) {
    super(1);
    this.tagName = tag.toUpperCase();
    this.id = attrs.id || '';
    this.type = attrs.type || '';
    this.value = attrs.value || '';
    this.open = !!attrs.open;
    this.hidden = !!attrs.hidden;
    this.dataset = attrs.dataset || {};
    this.style = { display: attrs.display || '' };
    this._cls = new Set((attrs.className || '').split(/\s+/).filter(Boolean));
    this.options = attrs.options || [];
    this.selectedIndex = attrs.selectedIndex ?? 0;
  }
  get className() { return [...this._cls].join(' '); }
  set className(v) { this._cls = new Set(String(v).split(/\s+/).filter(Boolean)); }
  get classList() {
    const s = this._cls;
    return {
      add: c => s.add(c),
      remove: c => s.delete(c),
      contains: c => s.has(c),
      toggle: (c, f) => (f === undefined ? (s.has(c) ? s.delete(c) : s.add(c)) : (f ? s.add(c) : s.delete(c)))
    };
  }
  matches(sel) {
    return sel.split(',').some(part => {
      part = part.trim();
      if (part === 'details.cfg-box') return this.tagName === 'DETAILS' && this._cls.has('cfg-box');
      if (part === 'details.cfg-box[data-box-key]') return this.tagName === 'DETAILS' && this._cls.has('cfg-box') && !!this.dataset.boxKey;
      if (part === 'mark.cfg-hl') return this.tagName === 'MARK' && this._cls.has('cfg-hl');
      if (part.startsWith('.')) return this._cls.has(part.slice(1));
      return this.tagName === part.toUpperCase();
    });
  }
  closest(sel) {
    for (let cur = this; cur; cur = cur.parentNode) {
      if (cur.nodeType === 1 && cur.matches(sel)) return cur;
    }
    return null;
  }
  querySelectorAll(sel) {
    const out = [];
    const walk = n => {
      for (const c of n.childNodes) {
        if (c.nodeType === 1) {
          if (c.matches(sel)) out.push(c);
          walk(c);
        }
      }
    };
    walk(this);
    return out;
  }
  querySelector(sel) { return this.querySelectorAll(sel)[0] || null; }
}

function makeEl(tag, attrs, ...kids) {
  const el = new El(tag, attrs);
  for (const k of kids) el.appendChild(typeof k === 'string' ? new TextNode(k) : k);
  return el;
}

// Build mock configurator DOM: 2 tabs, 3 boxes
const box1 = makeEl('details', { className: 'cfg-box', dataset: { boxKey: 'b1' }, open: true },
  makeEl('summary', {}, makeEl('b', {}, 'Header-Badges')),
  makeEl('div', { className: 'cfg-box-body' },
    makeEl('div', { className: 'cfg-row' },
      makeEl('select', { options: [{ textContent: 'Sonne' }, { textContent: 'Heizung / Feuer' }], selectedIndex: 0 },
        makeEl('option', {}, 'Sonne'), makeEl('option', {}, 'Heizung / Feuer'))
    )
  )
);
const inputEntity = makeEl('input', { type: 'text', value: 'sensor.heizung_wohnzimmer' });
const box2 = makeEl('details', { className: 'cfg-box', dataset: { boxKey: 'b2' }, open: false },
  makeEl('summary', {}, makeEl('b', {}, 'Raum #1: Wohnzimmer')),
  makeEl('div', { className: 'cfg-box-body' },
    makeEl('div', { className: 'cfg-row' }, makeEl('label', {}, 'Heizung Entität'), inputEntity),
    makeEl('div', { className: 'cfg-row' }, makeEl('label', {}, 'Kamera URL'), makeEl('input', { type: 'text', value: 'rtsp://cam' }))
  )
);
const tab1 = makeEl('div', { className: 'cfg-tab-content', dataset: { tab: 'allgemein' }, display: 'flex' }, box1);
const tab2 = makeEl('div', { className: 'cfg-tab-content', dataset: { tab: 'raeume' }, display: 'none' }, box2);
const countEl = makeEl('span', { id: 'cfgSearchCount', hidden: true });
const sheet = makeEl('div', { id: 'cfgsheet' }, countEl, makeEl('div', { className: 'cfg-body' }, tab1, tab2));

const doc = {
  getElementById: id => (id === 'cfgsheet' ? sheet : id === 'cfgSearchCount' ? countEl : null),
  createElement: tag => new El(tag),
  createTextNode: t => new TextNode(t),
  createDocumentFragment: () => new Frag(),
  addEventListener: () => {},
  createTreeWalker(root, _what, filter) {
    const list = [];
    const walk = n => {
      for (const c of n.childNodes) {
        if (c.nodeType === 3) {
          if (filter.acceptNode(c) === 1) list.push(c);
        } else if (c.nodeType === 1) {
          walk(c);
        }
      }
    };
    walk(root);
    let idx = 0;
    return { nextNode: () => list[idx++] || null };
  }
};

const ctx = vm.createContext({
  document: doc,
  NodeFilter: { SHOW_TEXT: 4, FILTER_ACCEPT: 1, FILTER_REJECT: 2, FILTER_SKIP: 3 },
  t: (k, v) => (k === 'cfg.search_matches' && v ? `${v.n} Treffer` : k),
  tr: d => d,
  tDefault: s => s,
  getLang: () => 'de'
});
vm.runInContext(editorSrc + "\ncfgOpenBoxes.add('b1'); cfgTab = 'allgemein';", ctx);

// Search for "heizung": must skip unselected <option> in box1, match box2, auto-expand box2, highlight label
ctx.applyCfgSearch('heizung');
assert.equal(sheet.classList.contains('cfg-searching'), true);
assert.equal(tab1.style.display, 'none', 'non-matching tab must be display:none');
assert.equal(tab2.style.display, 'flex', 'matching tab must be display:flex');
assert.equal(box1.classList.contains('cfg-search-hidden'), true, 'unselected <option> must not match');
assert.equal(box2.classList.contains('cfg-search-hidden'), false, 'matching box must be visible');
assert.equal(box2.open, true, 'matching box must auto-expand');
assert.equal(countEl.hidden, false);
assert.equal(countEl.textContent, '1 Treffer');
assert.equal(inputEntity.value, 'sensor.heizung_wohnzimmer', 'input value must stay intact');
assert.equal(box2.querySelectorAll('mark.cfg-hl').length, 1, 'visible label match must be highlighted');
assert.equal(box2.querySelectorAll('.cfg-row')[0].classList.contains('cfg-search-hidden'), false);
assert.equal(box2.querySelectorAll('.cfg-row')[1].classList.contains('cfg-search-hidden'), true);

// Clear search: restore pre-search open state (b1 open, b2 closed), unwrap highlights, hide counter
ctx.applyCfgSearch('');
assert.equal(sheet.classList.contains('cfg-searching'), false);
assert.equal(tab1.style.display, 'flex');
assert.equal(tab2.style.display, 'none');
assert.equal(box1.open, true, 'pre-search open box must remain open');
assert.equal(box2.open, false, 'pre-search closed box must collapse back');
assert.equal(sheet.querySelectorAll('mark.cfg-hl').length, 0, 'highlights must be cleared');
assert.equal(countEl.hidden, true);

// 3. v3.4.0 & v3.5.0 Calendar Styles, Month Range Calculation, Profile Popover, Camera Popup & Version Consistency Self-Test
const configSrc = fs.readFileSync('custom_components/smarthome_hub/panel/config.js', 'utf8');
const coreSrc = fs.readFileSync('custom_components/smarthome_hub/panel/core.js', 'utf8');
const cameraSrc = fs.readFileSync('custom_components/smarthome_hub/panel/camera.js', 'utf8');
const viewsSrc = fs.readFileSync('custom_components/smarthome_hub/panel/views.js', 'utf8');
const appSrc = fs.readFileSync('custom_components/smarthome_hub/panel/app.js', 'utf8');
const indexSrc = fs.readFileSync('custom_components/smarthome_hub/panel/index.html', 'utf8');
const manifestObj = JSON.parse(fs.readFileSync('custom_components/smarthome_hub/manifest.json', 'utf8'));
const initPySrc = fs.readFileSync('custom_components/smarthome_hub/__init__.py', 'utf8');
const gitignoreSrc = fs.readFileSync('.gitignore', 'utf8');

// Version consistency across manifest.json, __init__.py, core.js, and index.html
assert.equal(manifestObj.version, '3.7.7', 'manifest.json version must be 3.7.7');
assert.match(initPySrc, /VERSION\s*=\s*"3\.7\.7"/, '__init__.py VERSION must be 3.7.7');
assert.match(coreSrc, /const VERSION\s*=\s*'3\.7\.7'/, 'core.js VERSION must be 3.7.7');
assert.doesNotMatch(indexSrc, /\?v=(3\.[3456]\.|3\.7\.[0-6])/, 'index.html must not contain old version query params');
const vMatches = indexSrc.match(/\?v=3\.7\.7/g) || [];
assert.equal(vMatches.length, 12, 'All 12 assets in index.html must use ?v=3.7.7');

// Container-query & overflow invariants for side-by-side Calendar (Apple) and Rolläden cards
assert.match(cssSrc, /\.cal-card\s*\{[^}]*container-type:\s*inline-size;[^}]*overflow:\s*hidden/s, '.cal-card must establish inline-size container and clip overflow');
assert.match(cssSrc, /@container\s*\(max-width:\s*560px\)\s*\{\s*\.cal-apple-split\s*\{\s*grid-template-columns:\s*minmax\(0,\s*1fr\)/s, 'Apple calendar split must stack via container query when card is narrow');
assert.match(cssSrc, /\.covers-card\{[^}]*container-type:inline-size;[^}]*overflow:hidden/, '.covers-card must establish inline-size container and clip overflow');
assert.match(cssSrc, /@container\s*\(max-width:\s*520px\)\s*\{[\s\S]*?\.covers-card \.cover-row\s*\{/, '.covers-card .cover-row must switch to compact 2-row layout in narrow cards');
assert.match(cssSrc, /\.cover-row \.dv small\{[^}]*white-space:nowrap/, '.cover-row percentage must stay on one line');
assert.match(gitignoreSrc, /graphify-out\//, '.gitignore must ignore graphify-out/');

// Execute config.js + core.js + views.js in sandbox to test calendar, profile popover & camera popup logic
const listeners = {};
let activeTimers = [];
let mockStates = {};
const mockBellEl = {
  style: { display: 'none', opacity: '0' },
  innerHTML: '',
  querySelector: () => ({ style: { transform: '' } })
};
const mockHoldBadge = { style: { display: 'none' }, textContent: '' };

const calSandbox = vm.createContext({
  window: {
    parent: { document: { querySelector: () => null }, customElements: { get: () => null } },
    location: { href: 'http://localhost/' },
    addEventListener: () => {}
  },
  document: {
    documentElement: { style: { setProperty: () => {}, removeProperty: () => {} } },
    body: { appendChild: () => {} },
    getElementById: id => (id === 'bell-popup' ? mockBellEl : id === 'bell-hold-badge' ? mockHoldBadge : { innerHTML: '', style: {}, dataset: {}, classList: { add: () => {}, remove: () => {}, contains: () => false }, appendChild: () => {}, contains: () => false }),
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: (ev, fn) => {
      if (!listeners[ev]) listeners[ev] = [];
      listeners[ev].push(fn);
    }
  },
  localStorage: { getItem: () => null, setItem: () => {} },
  navigator: {},
  CustomEvent: class {},
  setTimeout: (fn, ms) => {
    const t = { fn, ms, cleared: false };
    activeTimers.push(t);
    return t;
  },
  clearTimeout: t => { if (t) t.cleared = true; },
  setInterval: () => 1,
  clearInterval: () => {},
  probeGo2rtc: () => false,
  canUseGo2rtc: () => false,
  resolveGo2rtcStream: () => '',
  resolveCamEntity: (_, e) => e || 'camera.eingang',
  camUrl: () => '/api/camera_proxy_stream/camera.eingang',
  teardownCamObserver: () => {},
  dropHeroMedia: () => {},
  syncHeroMedia: () => {},
  mountPFC: () => {},
  updatePFC: () => {},
  refreshSeries: () => {},
  refreshMetricCompare: () => {},
  refreshWeatherForecast: () => {},
  weatherForecastState: { loadedAt: 0, days: [], hourly: [] },
  go2rtcState: { modeOverride: 'auto' },
  sm: { open: false },
  Date, Math, Number, String, Array, Object, Set, Map, JSON, RegExp, parseInt, parseFloat, isNaN, encodeURIComponent, console
});
vm.runInContext(
  configSrc + '\n' + coreSrc + '\n' + cameraSrc + '\n' + viewsSrc + '\n' +
  appSrc.replace(/\(async function init\(\)[\s\S]*$/, '') +
  '\nthis.CONFIG = CONFIG; this.ui = ui; this.homeCalendarState = homeCalendarState; this._configDigest = _configDigest; this._syncSignedUploadUrls = _syncSignedUploadUrls; S = id => mockStates[id]; render = () => {};',
  calSandbox
);
calSandbox.mockStates = mockStates;

// Test signed upload URL digest stability & in-place signature refresh
const cfgA = { rooms: [{ image: '/api/smarthome_hub/uploads/a_room.png?authSig=sig1' }, { image: 'https://example.com/x.png?v=1' }] };
const cfgB = { rooms: [{ image: '/api/smarthome_hub/uploads/a_room.png?authSig=sig2' }, { image: 'https://example.com/x.png?v=2' }] };
const cfgC = { rooms: [{ image: '/api/smarthome_hub/uploads/a_room.png?authSig=sig2' }, { image: 'https://example.com/x.png?v=1' }] };
assert.equal(calSandbox._configDigest(cfgA), calSandbox._configDigest(cfgC), '_configDigest must ignore authSig changes on upload URLs');
assert.notEqual(calSandbox._configDigest(cfgA), calSandbox._configDigest(cfgB), '_configDigest must detect non-upload URL query changes');
assert.equal(calSandbox._syncSignedUploadUrls(cfgA, cfgB), true, '_syncSignedUploadUrls must report update when upload signature changes');
assert.equal(cfgA.rooms[0].image, '/api/smarthome_hub/uploads/a_room.png?authSig=sig2', 'Upload URL signature must be updated in place');
assert.equal(cfgA.rooms[1].image, 'https://example.com/x.png?v=1', 'Non-upload URL must remain untouched');
assert.equal(calSandbox._syncSignedUploadUrls(cfgA, cfgB), false, 'Repeated sync with identical upload signatures must return false');

// Test default & backward-compatible config migration for calendarHomeStyle & calendarPageStyle
const migratedDefault = calSandbox.ensureConfigDefaults(JSON.parse(JSON.stringify({})));
assert.equal(migratedDefault.calendarHomeStyle, 'agenda', 'default calendarHomeStyle must be agenda');
assert.equal(migratedDefault.calendarPageStyle, 'apple', 'default calendarPageStyle must be apple');

const migratedLegacy = calSandbox.ensureConfigDefaults({ calendarStyle: 'board', calendars: {} });
assert.equal(migratedLegacy.calendarHomeStyle, 'board', 'legacy calendarStyle must migrate to calendarHomeStyle');
assert.equal(migratedLegacy.calendarPageStyle, 'board', 'legacy calendarStyle must migrate to calendarPageStyle');

// Test month range calculation (Monday start, 35/42 grid cells, prev/next month offset)
const refNov2026 = new Date(2026, 10, 15); // Nov 2026 (Nov 1 2026 is Sunday -> startWeekday = 6)
const novRange = calSandbox.getCalendarMonthRange(0, refNov2026);
assert.equal(novRange.monthKey, '2026-11');
assert.equal(novRange.startWeekday, 6, 'Nov 1 2026 (Sunday) must have Monday-based weekday index 6');
assert.equal(novRange.cellCount, 42, 'Nov 2026 (6 + 30 = 36) needs 42 grid cells');
assert.equal((novRange.gridStart.getDay() + 6) % 7, 0, 'gridStart must always be a Monday');

const decRange = calSandbox.getCalendarMonthRange(1, refNov2026);
assert.equal(decRange.monthKey, '2026-12');
const octRange = calSandbox.getCalendarMonthRange(-1, refNov2026);
assert.equal(octRange.monthKey, '2026-10');

// Test rendering all 6 calendar styles & quick switcher presence
calSandbox.CONFIG.calendars.familyEntities = ['calendar.familie'];
const stylesToTest = ['list', 'agenda', 'google', 'apple', 'board', 'month'];
for (const st of stylesToTest) {
  calSandbox.CONFIG.calendarHomeStyle = st;
  const htmlHome = calSandbox.homeCalendarCard(7, null, 'home');
  assert.ok(htmlHome.includes(`data-cal-style="${st}"`), `homeCalendarCard must render style ${st}`);
  assert.ok(htmlHome.includes('data-act="calQuickStyle"'), `style ${st} must include quick view switcher`);
}

calSandbox.CONFIG.calendarHomeStyle = 'agenda';
calSandbox.CONFIG.calendarPageStyle = 'apple';
const homeRender = calSandbox.homeCalendarCard(7, null, 'home');
const pageRender = calSandbox.homeCalendarCard(14, null, 'page');
assert.ok(homeRender.includes('data-cal-style="agenda"'), 'Home widget must use calendarHomeStyle (agenda)');
assert.ok(pageRender.includes('data-cal-style="apple"'), 'Calendar page must use calendarPageStyle (apple)');

calSandbox.CONFIG.covers = [{ name: 'Rolladen WC', entity: 'cover.wc' }];
const coversHtml = calSandbox.coversCard();
assert.ok(coversHtml.includes('<section class="card covers-card">'), 'coversCard must render .covers-card container');

// 4. v3.5.0 Self-Test: Profile Popover Menu (Toggle, Action & Outside-Click / Escape)
calSandbox.ui.profileMenuOpen = false;
const sideClosedHtml = calSandbox.sidebar();
assert.ok(sideClosedHtml.includes('class="me-popover "'), 'Popover must be closed initially');
assert.ok(sideClosedHtml.includes('data-act="toggleProfileMenu"'), 'Profile tile must trigger toggleProfileMenu');

const clickHandlers = listeners.click || [];
const keyHandlers = listeners.keydown || [];

// Click profile button -> opens popover
clickHandlers.forEach(fn => fn({
  target: {
    dataset: { act: 'toggleProfileMenu' },
    closest: sel => (sel === '[data-act]' ? { dataset: { act: 'toggleProfileMenu' }, closest: () => null } : sel === '.me-wrap' ? {} : null)
  }
}));
assert.equal(calSandbox.ui.profileMenuOpen, true, 'Clicking profile tile must open popover');
const sideOpenHtml = calSandbox.sidebar();
assert.ok(sideOpenHtml.includes('class="me-popover open"'), 'Popover must have .open class when open');

// Click outside .me-wrap -> closes popover
clickHandlers.forEach(fn => fn({
  target: {
    dataset: {},
    closest: () => null
  }
}));
assert.equal(calSandbox.ui.profileMenuOpen, false, 'Clicking outside .me-wrap must close popover');

// Open again and press Escape -> closes popover
calSandbox.ui.profileMenuOpen = true;
keyHandlers.forEach(fn => fn({ key: 'Escape' }));
assert.equal(calSandbox.ui.profileMenuOpen, false, 'Pressing Escape must close popover');

// 5. v3.5.0 Self-Test: Camera Popup (Behavior, Page Filter & Hold-Time / Nachlaufzeit)
const legacyBell = calSandbox.ensureConfigDefaults({ bellPopup: { show: true, triggerEntity: 'binary_sensor.klingel', cameraEntity: 'camera.eingang' } }).bellPopup;
assert.equal(legacyBell.behavior, 'popup', 'Legacy bellPopup.show=true must migrate to behavior=popup');
assert.equal(legacyBell.pageFilter, 'all', 'Default pageFilter must be all');
assert.equal(legacyBell.triggerHoldSeconds, 10, 'Default triggerHoldSeconds must be 10');

// Configure camera popup with page filter 'selected' (only 'kameras' & 'room:Wohnzimmer') and 12s hold time
calSandbox.CONFIG.rooms = [{ name: 'Home' }, { name: 'Wohnzimmer' }];
calSandbox.CONFIG.bellPopup = {
  show: true,
  behavior: 'popup',
  pageFilter: 'selected',
  allowedPages: ['kameras', 'room:Wohnzimmer'],
  triggerHoldSeconds: 12,
  triggerEntity: 'binary_sensor.bewegung',
  cameraEntity: 'camera.eingang',
  title: 'Bewegung erkannt'
};

// Case A: Disallowed page (dashboard + room 0 'Home') -> must NOT open popup when sensor turns 'on'
calSandbox.ui.view = 'dashboard';
calSandbox.ui.room = 0;
mockStates['binary_sensor.bewegung'] = { state: 'off' };
calSandbox.checkBellPopupTrigger();
mockStates['binary_sensor.bewegung'] = { state: 'on' };
calSandbox.checkBellPopupTrigger();
assert.equal(mockBellEl.style.display, 'none', 'Popup must not open on disallowed page');

// Case B: Allowed page ('kameras') -> sensor turns 'off' then 'on' -> popup opens and stays open while 'on'
calSandbox.ui.view = 'kameras';
mockStates['binary_sensor.bewegung'] = { state: 'off' };
calSandbox.checkBellPopupTrigger();
activeTimers = [];
mockStates['binary_sensor.bewegung'] = { state: 'on' };
calSandbox.checkBellPopupTrigger();
assert.equal(mockBellEl.style.display, 'flex', 'Popup must open on allowed page when sensor turns on');
const holdTimersWhileOn = activeTimers.filter(t => t.ms === 12000 && !t.cleared);
assert.equal(holdTimersWhileOn.length, 0, 'No hold timer may run while sensor remains on');

// Case C: Sensor switches from 'on' to 'off' -> 12s hold timer starts
mockStates['binary_sensor.bewegung'] = { state: 'off' };
calSandbox.checkBellPopupTrigger();
const holdTimer = activeTimers.find(t => t.ms === 12000 && !t.cleared);
assert.ok(holdTimer, '12s hold timer must start when sensor switches from on to off');
assert.equal(mockBellEl.style.display, 'flex', 'Popup must remain open during hold time');

// Case D: Sensor switches back to 'on' during hold time -> hold timer is cancelled, popup stays open
mockStates['binary_sensor.bewegung'] = { state: 'on' };
calSandbox.checkBellPopupTrigger();
assert.equal(holdTimer.cleared, true, 'Re-triggering on during hold time must cancel the hold timer');
assert.equal(mockBellEl.style.display, 'flex', 'Popup must stay open after re-trigger');

// Case E: Sensor switches to 'off' again and hold timer expires -> popup closes
mockStates['binary_sensor.bewegung'] = { state: 'off' };
calSandbox.checkBellPopupTrigger();
const finalHoldTimer = activeTimers.find(t => t.ms === 12000 && !t.cleared);
assert.ok(finalHoldTimer, 'New hold timer must start on second off transition');
finalHoldTimer.fn();
// Execute 300ms fade-out timer
activeTimers.filter(t => t.ms === 300 && !t.cleared).forEach(t => t.fn());
assert.equal(mockBellEl.style.display, 'none', 'Popup must close after hold time expires');

// Case F: resolveGo2rtcStream resolves room camera & fuzzy entity names + raw stream names in bellPopup
calSandbox.CONFIG.rooms = [
  { name: 'Home', camera: 'camera.eingang_standardauflosung', webrtc: 'Eingang-sub' }
];
calSandbox.CONFIG.webrtcCameras = [
  { name: 'Eingang', entity: 'camera.eingang', stream: 'Eingang-sub' }
];
assert.equal(calSandbox.resolveGo2rtcStream('', 'camera.eingang_standardauflosung'), 'Eingang-sub', 'Must resolve go2rtc stream from room.camera -> room.webrtc');
assert.equal(calSandbox.resolveGo2rtcStream('', 'Eingang-sub'), 'Eingang-sub', 'Must resolve raw stream name passed as entityId');
assert.equal(calSandbox.resolveGo2rtcStream('Eingang-sub', 'camera.eingang_standardauflosung'), 'Eingang-sub', 'Must resolve explicit stream name');

// 6. i18n (DE/EN) Self-Test: Key Parity, Static t(key) Coverage, Auto-Detection & Manual Override
vm.runInContext('this.I18N = I18N; this.t = t; this.getLang = getLang; this.tDefault = tDefault;', calSandbox);
const deDict = calSandbox.I18N.de;
const enDict = calSandbox.I18N.en;
assert.ok(deDict && enDict, 'I18N.de and I18N.en must exist');

const deKeys = Object.keys(deDict);
const enKeys = Object.keys(enDict);
const missingInEn = deKeys.filter(k => !(k in enDict));
const missingInDe = enKeys.filter(k => !(k in deDict));
assert.deepEqual(missingInEn, [], `No key may be missing in I18N.en (missing: ${missingInEn.join(', ')})`);
assert.deepEqual(missingInDe, [], `No key may be missing in I18N.de (missing: ${missingInDe.join(', ')})`);

for (const k of deKeys) {
  assert.equal(typeof deDict[k], 'string', `I18N.de["${k}"] must be a string`);
  assert.equal(typeof enDict[k], 'string', `I18N.en["${k}"] must be a string`);
  assert.ok(!deDict[k].includes('undefined'), `I18N.de["${k}"] must not contain "undefined"`);
  assert.ok(!enDict[k].includes('undefined'), `I18N.en["${k}"] must not contain "undefined"`);
}

// Scan all panel/*.js files for t('...') calls and verify every referenced key exists in both de and en
const panelFiles = ['core.js', 'views.js', 'editor.js', 'app.js', 'camera.js', 'charts.js', 'sports.js', 'media_hub_adapters.js', 'media_hub.js'];
for (const file of panelFiles) {
  const src = fs.readFileSync(`custom_components/smarthome_hub/panel/${file}`, 'utf8');
  const matches = src.matchAll(/\bt\(\s*'([a-z0-9_]+(?:\.[a-z0-9_-]+)+)'\s*[,)]/gi);
  for (const m of matches) {
    const key = m[1];
    assert.ok(key in deDict, `Key "${key}" used in ${file} must exist in I18N.de`);
    assert.ok(key in enDict, `Key "${key}" used in ${file} must exist in I18N.en`);
  }
}

// Verify language auto-detection (hass.language) and manual CONFIG.language override
calSandbox.CONFIG.language = 'auto';
assert.equal(calSandbox.getLang(), 'de', 'Default fallback without hass/navigator language must be de');

calSandbox.CONFIG.language = 'en';
assert.equal(calSandbox.getLang(), 'en', 'Manual CONFIG.language="en" must activate English');
assert.equal(calSandbox.t('cal.no_events'), 'No events');
assert.equal(calSandbox.t('weather.title'), 'Weather');
assert.equal(calSandbox.t('cfg.search_matches', { n: 5 }), '5 matches');

// Render views in English and ensure no 'undefined' text appears and custom names stay intact
calSandbox.CONFIG.rooms = [{ name: 'Home' }, { name: 'Wohnzimmer' }];
for (const st of stylesToTest) {
  calSandbox.CONFIG.calendarHomeStyle = st;
  const enCalHtml = calSandbox.homeCalendarCard(7, null, 'home');
  assert.ok(!enCalHtml.includes('undefined'), `English calendar view (${st}) must not contain undefined`);
}
const enSideHtml = calSandbox.sidebar();
assert.ok(enSideHtml.includes('Quick-Edit'), 'English sidebar must show Quick-Edit');
assert.ok(enSideHtml.includes('Dashboard Configurator'), 'English sidebar must show Dashboard Configurator');
assert.ok(!enSideHtml.includes('undefined'), 'English sidebar must not contain undefined');

const enHeroHtml = calSandbox.heroOverlayContent();
assert.ok(enHeroHtml.includes('Wohnzimmer'), 'Custom user room name "Wohnzimmer" must remain untouched in English mode');
assert.ok(!enHeroHtml.includes('undefined'), 'English hero banner must not contain undefined');

calSandbox.CONFIG.language = 'de';
assert.equal(calSandbox.getLang(), 'de', 'Manual CONFIG.language="de" must activate German');
assert.equal(calSandbox.t('cal.no_events'), 'Keine Termine');

console.log('test_editor_search, v3.4.0, v3.5.0 & i18n self-tests: ALL PASSED');

import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const configSrc = fs.readFileSync('custom_components/smarthome_hub/panel/config.js', 'utf8');
const coreSrc = fs.readFileSync('custom_components/smarthome_hub/panel/core.js', 'utf8');
const adaptersSrc = fs.readFileSync('custom_components/smarthome_hub/panel/media_hub_adapters.js', 'utf8');
const widgetSrc = fs.readFileSync('custom_components/smarthome_hub/panel/media_hub.js', 'utf8');
const editorSrc = fs.readFileSync('custom_components/smarthome_hub/panel/editor.js', 'utf8');
const cssSrc = fs.readFileSync('custom_components/smarthome_hub/panel/media_hub.css', 'utf8');

// 1. Verify CSS tablet_touch rules exist
assert.match(cssSrc, /\.mh-root\.mh-touch\s+\.mh-btn[^}]*min-width:\s*48px/, 'Touch mode must enforce >= 48px target size');
assert.match(cssSrc, /\.mh-root\.mh-touch\s+\.mh-search-input[^}]*font-size:\s*16px/, 'Touch mode search input must have >= 16px font-size');
assert.match(cssSrc, /touch-action:\s*pan-y/, 'Content/swipe surface must use touch-action: pan-y');

// 2. Minimal DOM harness to test MediaHubWidget mount, surgical update, and touch modes
class MockEl {
  constructor(tag) {
    this.tagName = tag.toUpperCase();
    this.children = [];
    this.parentElement = null;
    this.dataset = {};
    this.style = {};
    this._cls = new Set();
    this._attrs = {};
    this._innerHTML = '';
    this._textContent = '';
    this.value = '';
    this.hidden = false;
    this.disabled = false;
    this.listeners = {};
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
  get innerHTML() { return this._innerHTML; }
  set innerHTML(v) {
    this._innerHTML = String(v || '');
    this.children = [];
    // Parse lightweight role/mount attributes for unit test queries
    if (this._innerHTML.includes('data-mh-role="search-input"')) {
      const inp = new MockEl('input');
      inp.dataset.mhRole = 'search-input';
      const vmMatch = this._innerHTML.match(/data-mh-role="search-input"[^>]*value="([^"]*)"/);
      inp.value = vmMatch ? vmMatch[1] : '';
      this.appendChild(inp);
    }
    const roles = ['np-title', 'np-artist', 'np-state', 'np-state-txt', 'cover', 'play-btn', 'vol-slider', 'vol-val', 'mute-btn', 'mr-btn', 'mr-badge', 'multiroom-slot', 'tabs', 'content', 'player-pills', 'player-select'];
    for (const r of roles) {
      if (this._innerHTML.includes(`data-mh-role="${r}"`)) {
        const node = new MockEl(r === 'player-select' ? 'select' : r === 'vol-slider' ? 'input' : 'div');
        node.dataset.mhRole = r;
        this.appendChild(node);
      }
    }
  }
  get textContent() { return this._textContent; }
  set textContent(v) { this._textContent = String(v ?? ''); }
  appendChild(ch) {
    ch.parentElement = this;
    this.children.push(ch);
    return ch;
  }
  remove() {
    if (this.parentElement) {
      this.parentElement.children = this.parentElement.children.filter(c => c !== this);
      this.parentElement = null;
    }
  }
  contains(node) {
    if (node === this) return true;
    return this.children.some(c => c.contains(node));
  }
  addEventListener(ev, fn) {
    if (!this.listeners[ev]) this.listeners[ev] = [];
    this.listeners[ev].push(fn);
  }
  querySelectorAll(sel) {
    const out = [];
    const walk = node => {
      for (const c of node.children) {
        if (sel === '.mh-root' && c._cls.has('mh-root')) out.push(c);
        else if (sel === '[data-mh-mount]' && c.dataset.mhMount) out.push(c);
        else if (sel.startsWith('[data-mh-role="')) {
          const role = sel.slice(15, -2);
          if (c.dataset.mhRole === role) out.push(c);
        }
        walk(c);
      }
    };
    walk(this);
    return out;
  }
  querySelector(sel) { return this.querySelectorAll(sel)[0] || null; }
}

const rootContainer = new MockEl('div');
const cfgSheetEl = new MockEl('div');
const mockHass = {
  language: 'de',
  services: {
    media_player: { play_media: {}, join: {}, unjoin: {}, volume_set: {}, volume_mute: {}, select_source: {}, search_media: {} },
    ytube_music_player: { search: {} },
    media_extractor: { play_media: {} },
    spotifyplus: { search_tracks: {}, player_media_play_tracks: {} },
    music_assistant: { search: {}, play_media: {} }
  },
  states: {
    'media_player.wohnzimmer': {
      state: 'playing',
      attributes: {
        friendly_name: 'Wohnzimmer',
        supported_features: 524288 | 4,
        volume_level: 0.4,
        is_volume_muted: false,
        media_title: 'Song Eins',
        media_artist: 'Artist A',
        entity_picture: '/api/media_player_proxy/media_player.wohnzimmer?token=1',
        group_members: ['media_player.wohnzimmer', 'media_player.kueche']
      }
    },
    'media_player.kueche': {
      state: 'idle',
      attributes: {
        friendly_name: 'Küche',
        supported_features: 524288 | 4,
        volume_level: 0.25,
        is_volume_muted: false
      }
    },
    'media_player.ytube_music_player': {
      state: 'idle',
      attributes: {
        source_list: ['Wohnzimmer', 'Küche'],
        search_results: [
          { id: 'yt_123', title: 'Test Song', artist: 'YT Artist', type: 'track', thumbnail: 'https://example.com/t.jpg' }
        ]
      }
    },
    'media_player.spotify_timo': {
      state: 'idle',
      attributes: {
        source_list: ['Wohnzimmer', 'Küche']
      }
    }
  },
  callCalls: [],
  wsCalls: [],
  async callService(domain, service, data) {
    this.callCalls.push({ domain, service, data });
    return {};
  },
  async callWS(msg) {
    this.wsCalls.push(msg);
    if (msg.type === 'media_source/browse_media') {
      return {
        children: [
          { title: 'SWR3 Live', media_content_id: 'media-source://radio_browser/swr3', can_play: true, can_expand: false }
        ]
      };
    }
    if (msg.type === 'call_service' && msg.domain === 'media_player' && msg.service === 'search_media') {
      return { response: { result: [{ title: 'Local Track', media_content_id: 'emby://track/1', media_content_type: 'music', can_play: true }] } };
    }
    if (msg.type === 'call_service' && msg.domain === 'spotifyplus' && msg.service === 'search_tracks') {
      return { response: { items: [{ id: 'spotify:track:42', uri: 'spotify:track:42', name: 'Spotify Hit', artists: [{ name: 'Band X' }] }] } };
    }
    if (msg.type === 'call_service' && msg.domain === 'music_assistant' && msg.service === 'search') {
      return { response: { tracks: [{ uri: 'library://track/99', name: 'MA Track', artists: [{ name: 'MA Artist' }] }] } };
    }
    return {};
  }
};

const ctx = vm.createContext({
  window: {
    parent: { document: { querySelector: () => ({ hass: mockHass }) }, customElements: { get: () => null } },
    location: { href: 'http://localhost/' },
    addEventListener: () => {}
  },
  document: {
    activeElement: null,
    documentElement: { style: { setProperty: () => {}, removeProperty: () => {} } },
    createElement: tag => new MockEl(tag),
    getElementById: id => (id === 'cfgsheet' ? cfgSheetEl : null),
    querySelectorAll: sel => rootContainer.querySelectorAll(sel),
    querySelector: sel => rootContainer.querySelector(sel),
    addEventListener: () => {}
  },
  requestAnimationFrame: () => {},
  NodeFilter: { SHOW_TEXT: 4, FILTER_ACCEPT: 1, FILTER_REJECT: 2, FILTER_SKIP: 3 },
  localStorage: { getItem: () => null, setItem: () => {} },
  navigator: { language: 'de-DE' },
  setTimeout,
  clearTimeout,
  toast: () => {},
  tick: () => {},
  Date, Math, Number, String, Array, Object, Set, Map, JSON, RegExp, Promise, parseInt, parseFloat, isNaN, encodeURIComponent, console
});

vm.runInContext(
  configSrc + '\n' + coreSrc + '\n' + adaptersSrc + '\n' + widgetSrc + '\nthis.CONFIG = CONFIG; this.DEMO = false;',
  ctx
);
ctx.DEMO = false;
ctx.getHass = () => mockHass;
ctx.S = id => mockHass.states[id];

// 3. Test Config Schema Defaults & Export/Import Roundtrip
const emptyMigrated = ctx.ensureConfigDefaults(JSON.parse(JSON.stringify({})));
assert.equal(emptyMigrated.mediaHub.show, false);
assert.equal(emptyMigrated.mediaHub.profile, 'free_direct');
assert.equal(emptyMigrated.mediaHub.providers.radio.enabled, true);
assert.equal(emptyMigrated.mediaHub.providers.spotify.enabled, false);
assert.equal(emptyMigrated.mediaHub.ui.density, 'standard');
assert.ok(emptyMigrated.dashboardLayout.some(x => x.id === 'media_hub'), 'media_hub must exist in dashboardLayout');

const roundtripInput = {
  mediaHub: {
    show: true,
    title: 'Audio Zentrale',
    profile: 'hybrid_premium',
    players: [{ entity: 'media_player.wohnzimmer', name: 'WZ' }],
    defaultPlayer: 'media_player.wohnzimmer',
    radioFavorites: [{ name: 'SWR3', contentId: 'media-source://radio_browser/swr3', icon: '📻' }],
    multiroom: {
      enabled: true,
      presets: [{ name: 'Erdgeschoss', master: 'media_player.wohnzimmer', members: ['media_player.kueche'] }]
    },
    ui: { density: 'tablet_touch', searchPosition: 'footer', searchStyle: 'compact', radioGridCols: 3 }
  }
};
const roundtrip = ctx.ensureConfigDefaults(JSON.parse(JSON.stringify(roundtripInput)));
const exportedJson = JSON.stringify(roundtrip);
const reimported = ctx.ensureConfigDefaults(JSON.parse(exportedJson));
assert.equal(reimported.mediaHub.show, true);
assert.equal(reimported.mediaHub.profile, 'hybrid_premium');
assert.equal(reimported.mediaHub.ui.density, 'tablet_touch');
assert.equal(reimported.mediaHub.ui.radioGridCols, 3);
assert.equal(reimported.mediaHub.radioFavorites[0].name, 'SWR3');
assert.equal(reimported.dashboardLayout.find(x => x.id === 'media_hub').show, true);

// 4. Test Provider Adapters (Free Defaults + Optional Subscription/Backend + Fallbacks)
const adapters = ctx.MediaHubAdapters;

const mhFree = ctx.ensureConfigDefaults({
  mediaHub: {
    profile: 'free_direct',
    players: [{ entity: 'media_player.wohnzimmer', name: 'WZ' }, { entity: 'media_player.kueche', name: 'Küche' }],
    defaultPlayer: 'media_player.wohnzimmer',
    providers: {
      radio: { enabled: true, liveSearch: true },
      ytube_free: { enabled: true, entity: 'media_player.ytube_music_player' },
      local_library: { enabled: true, entity: 'media_player.emby_wz' },
      direct_url: { enabled: true },
      spotify: { enabled: true, mode: 'spotifyplus', entity: 'media_player.spotify_timo' } // ignored in free_direct
    },
    radioFavorites: [{ name: 'SWR3 Fav', contentId: 'media-source://radio_browser/fav1', icon: '📻' }]
  }
}).mediaHub;

assert.deepEqual([...adapters.getActiveProviders(mhFree)], ['radio', 'ytube_free', 'local_library', 'direct_url']);

// Radio search & play
const radioRes = await adapters.searchRadio(mockHass, 'SWR3', mhFree);
assert.ok(radioRes.items.some(i => i.title === 'SWR3 Fav'), 'Must include matching radio favorite');
assert.ok(radioRes.items.some(i => i.title === 'SWR3 Live'), 'Must include live radio browser result');
await adapters.play({ hass: mockHass, mhCfg: mhFree, targetPlayer: 'media_player.wohnzimmer', item: radioRes.items[0] });
assert.equal(mockHass.callCalls.at(-1).service, 'play_media');
assert.equal(mockHass.callCalls.at(-1).data.media_content_id, 'media-source://radio_browser/fav1');

// YouTube Music Free search & play
const ytRes = await adapters.searchYtube(mockHass, 'Test', mhFree);
assert.equal(ytRes.items.length, 1);
assert.equal(ytRes.items[0].id, 'yt_123');
await adapters.play({ hass: mockHass, mhCfg: mhFree, targetPlayer: 'media_player.wohnzimmer', item: ytRes.items[0] });
const lastTwoYt = mockHass.callCalls.slice(-2);
assert.equal(lastTwoYt[0].service, 'select_source');
assert.equal(lastTwoYt[0].data.source, 'Wohnzimmer');
assert.equal(lastTwoYt[1].service, 'play_media');

// Local library search
const locRes = await adapters.searchLocalLibrary(mockHass, 'Local', ['track'], mhFree);
assert.equal(locRes.items[0].title, 'Local Track');

// Direct URL with media_extractor & fallback without media_extractor
await adapters.playDirectUrl(mockHass, 'media_player.wohnzimmer', 'https://youtu.be/dQw4w9WgXcQ');
assert.equal(mockHass.callCalls.at(-1).domain, 'media_extractor');

const hassNoExtractor = {
  ...mockHass,
  services: { media_player: { play_media: {} } },
  callCalls: [],
  callService: mockHass.callService
};
const ytUrlErr = await adapters.playDirectUrl(hassNoExtractor, 'media_player.wohnzimmer', 'https://youtu.be/abc');
assert.equal(ytUrlErr.ok, false);
assert.equal(ytUrlErr.reasonKey, 'mh.err_extractor_missing');
const mp3Fallback = await adapters.playDirectUrl(hassNoExtractor, 'media_player.wohnzimmer', 'https://stream.example.com/live.mp3');
assert.equal(mp3Fallback.ok, true);
assert.equal(hassNoExtractor.callCalls.at(-1).domain, 'media_player');

// Spotify / SpotifyPlus & Music Assistant
const mhHybrid = ctx.ensureConfigDefaults({
  mediaHub: {
    profile: 'hybrid_premium',
    providers: { spotify: { enabled: true, mode: 'spotifyplus', entity: 'media_player.spotify_timo' } }
  }
}).mediaHub;
assert.ok(adapters.getActiveProviders(mhHybrid).includes('spotify'));
const spRes = await adapters.searchSpotify(mockHass, 'Hit', ['track'], mhHybrid);
assert.equal(spRes.items[0].id, 'spotify:track:42');
await adapters.play({ hass: mockHass, mhCfg: mhHybrid, targetPlayer: 'media_player.wohnzimmer', item: spRes.items[0] });
assert.equal(mockHass.callCalls.at(-1).domain, 'spotifyplus');
assert.equal(mockHass.callCalls.at(-1).service, 'player_media_play_tracks');

const mhMa = ctx.ensureConfigDefaults({
  mediaHub: { profile: 'music_assistant', providers: { music_assistant: { enabled: true } } }
}).mediaHub;
const maRes = await adapters.searchMusicAssistant(mockHass, 'MA', ['track'], mhMa);
assert.equal(maRes.items[0].uri, 'library://track/99');
await adapters.play({ hass: mockHass, mhCfg: mhMa, targetPlayer: 'media_player.wohnzimmer', item: maRes.items[0] });
assert.equal(mockHass.callCalls.at(-1).domain, 'music_assistant');
assert.equal(mockHass.callCalls.at(-1).service, 'play_media');

// Missing integration fallback check
const maMissing = adapters.checkProviderAvailability({ services: {}, states: {} }, 'music_assistant', mhMa);
assert.equal(maMissing.available, false);
assert.equal(maMissing.reasonKey, 'mh.err_ma_missing');

// 5. Test Multiroom Feature Bitmask & Calls
assert.equal(adapters.isPlayerGroupable(mockHass.states['media_player.wohnzimmer']), true);
assert.equal(adapters.isPlayerGroupable({ state: 'idle', attributes: { supported_features: 4 } }), false);
assert.equal(adapters.getGroupablePlayers(mockHass, mhFree).length, 2);

await adapters.joinPlayers(mockHass, 'media_player.wohnzimmer', ['media_player.kueche']);
assert.equal(mockHass.callCalls.at(-1).service, 'join');
await adapters.unjoinPlayer(mockHass, 'media_player.kueche');
assert.equal(mockHass.callCalls.at(-1).service, 'unjoin');
await adapters.setVolume(mockHass, 'media_player.wohnzimmer', 1.5); // clamps to 1
assert.equal(mockHass.callCalls.at(-1).data.volume_level, 1);
await adapters.applyPreset(mockHass, { name: 'EG', master: 'media_player.wohnzimmer', members: ['media_player.kueche'] });
assert.equal(mockHass.callCalls.at(-1).service, 'join');
assert.deepEqual([...mockHass.callCalls.at(-1).data.group_members], ['media_player.kueche']);

// 6. Test MediaHubWidget Mount, Touch Mode, Multiroom Button Visibility & Surgical Update
Object.assign(ctx.CONFIG, ctx.ensureConfigDefaults({
  mediaHub: {
    show: true,
    title: 'Wohnzimmer Audio',
    players: [{ entity: 'media_player.wohnzimmer', name: 'WZ' }, { entity: 'media_player.kueche', name: 'Küche' }],
    defaultPlayer: 'media_player.wohnzimmer',
    ui: { density: 'tablet_touch' }
  }
}));
const htmlShell = ctx.mediaHubCard(null, true, 'test_mh');
assert.ok(htmlShell.includes('data-mh-mount="test_mh"'));
const slot = new MockEl('section');
slot.dataset.mhMount = 'test_mh';
slot.dataset.mhTitle = 'Wohnzimmer Audio';
rootContainer.appendChild(slot);

ctx.MediaHubWidget.mountAll();
const inst = ctx.MediaHubWidget.getInstance('test_mh');
assert.ok(inst && inst.el, 'Widget must mount into slot');
assert.ok(inst.el.classList.contains('mh-touch'), 'tablet_touch density must add .mh-touch class');

// Multiroom button visible (>= 2 groupable players) with +1 badge
const mrBtn = inst.el.querySelector('[data-mh-role="mr-btn"]');
const mrBadge = inst.el.querySelector('[data-mh-role="mr-badge"]');
assert.equal(mrBtn.hidden, false, 'Multiroom button must be visible when >= 2 groupable players exist');
assert.equal(mrBadge.hidden, false, 'Multiroom badge must show extra member count');
assert.equal(mrBadge.textContent, '+1');

// Simulate user typing in search bar, then update hass state and run updateAll()
const searchInp = inst.el.querySelector('[data-mh-role="search-input"]');
searchInp.value = 'Laufende Eingabe';
mockHass.states['media_player.wohnzimmer'].attributes.media_title = 'Neuer Titel';
mockHass.states['media_player.wohnzimmer'].attributes.volume_level = 0.72;
ctx.MediaHubWidget.updateAll();

assert.equal(inst.el.querySelector('[data-mh-role="np-title"]').textContent, 'Neuer Titel', 'updateAll must update title surgically');
assert.equal(inst.el.querySelector('[data-mh-role="vol-val"]').textContent, '72%', 'updateAll must update volume surgically');
assert.equal(inst.el.querySelector('[data-mh-role="search-input"]').value, 'Laufende Eingabe', 'updateAll must preserve active search input');

// Multiroom button hidden when < 2 groupable players
mockHass.states['media_player.kueche'].attributes.supported_features = 4;
ctx.MediaHubWidget.updateAll();
assert.equal(mrBtn.hidden, true, 'Multiroom button must hide when < 2 groupable players exist');

// 7. Test Configurator 'media' Tab Rendering in DE & EN
vm.runInContext(editorSrc + '\nthis.renderCfgModal = renderCfgModal;', ctx);
vm.runInContext('cfgDraft = ensureConfigDefaults(JSON.parse(JSON.stringify(CONFIG))); cfgTab = "media"; CONFIG.language = "de";', ctx);
ctx.renderCfgModal(false);
assert.ok(cfgSheetEl.innerHTML.includes('data-tab="media"'), 'Configurator must render media tab');
assert.ok(cfgSheetEl.innerHTML.includes('mediaHub.profile'), 'Configurator must render mediaHub.profile selector');
assert.ok(!cfgSheetEl.innerHTML.includes('undefined'), 'German media configurator must not contain undefined');

vm.runInContext('CONFIG.language = "en";', ctx);
ctx.renderCfgModal(false);
assert.ok(cfgSheetEl.innerHTML.includes('Operating Profile'), 'English media configurator must render translated labels');
assert.ok(!cfgSheetEl.innerHTML.includes('undefined'), 'English media configurator must not contain undefined');

console.log('test_media_hub: ALL PASSED');

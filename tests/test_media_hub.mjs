import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const configSrc = fs.readFileSync('custom_components/smarthome_hub/panel/config.js', 'utf8');
const coreSrc = fs.readFileSync('custom_components/smarthome_hub/panel/core.js', 'utf8');
const adaptersSrc = fs.readFileSync('custom_components/smarthome_hub/panel/media_hub_adapters.js', 'utf8');
const widgetSrc = fs.readFileSync('custom_components/smarthome_hub/panel/media_hub.js', 'utf8');
const editorSrc = fs.readFileSync('custom_components/smarthome_hub/panel/editor.js', 'utf8');
const cssSrc = fs.readFileSync('custom_components/smarthome_hub/panel/media_hub.css', 'utf8');

// 1. Verify CSS tablet_touch & [hidden] rules exist
assert.match(cssSrc, /\.mh-root\s+\[hidden\]\s*\{\s*display:\s*none\s*!important/, '.mh-root [hidden] must override flex display');
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
    const roles = ['np-title', 'np-artist', 'np-state', 'np-state-txt', 'np-bg', 'np-progress', 'np-prog-fill', 'np-pos', 'np-dur', 'cover', 'play-btn', 'queue-btn', 'queue-badge', 'queue-slot', 'vol-slider', 'vol-val', 'mute-btn', 'mr-btn', 'mr-badge', 'multiroom-slot', 'tabs', 'content', 'player-pills', 'player-select'];
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

assert.deepEqual([...adapters.getActiveProviders(mhFree)], ['radio', 'somafm', 'audius', 'archive', 'ytube_free', 'local_library', 'direct_url']);

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

// SpotifyPlus nested { response: { result: { items: [...] } } } + Alexa Echo Dot radio & Spotify tests
const echoHass = {
  language: 'de',
  services: {
    media_player: { play_media: {}, select_source: {} },
    spotifyplus: { search_tracks: {} }
  },
  states: {
    'media_player.echo_dot_kuche_esszimmer': {
      state: 'standby',
      attributes: {
        friendly_name: 'Echo Dot Küche/Esszimmer',
        source_list: ['Local Speaker'],
        last_called: true
      }
    },
    'media_player.spotify_native': {
      state: 'idle',
      attributes: {
        friendly_name: 'Spotify Native',
        supported_features: 16384 // no SEARCH_MEDIA (2097152)
      }
    }
  },
  callCalls: [],
  async callService(domain, service, data) {
    this.callCalls.push({ domain, service, data });
    return {};
  },
  async callWS(msg) {
    if (msg.type === 'call_service' && msg.domain === 'spotifyplus') {
      return {
        response: {
          result: {
            items: [{ uri: 'spotify:track:nested1', name: 'Nested Hit', artists: [{ name: 'Artist N' }], album: { images: [{ url: 'https://img/1.jpg' }] } }]
          }
        }
      };
    }
    if (msg.type === 'media_player/browse_media') {
      return {
        children: [
          { title: 'Engel - Rammstein', media_content_id: 'spotify:track:engel1', media_content_type: 'track', can_play: true }
        ]
      };
    }
    return {};
  }
};
assert.equal(adapters.isAlexaPlayer(echoHass.states['media_player.echo_dot_kuche_esszimmer'], 'media_player.echo_dot_kuche_esszimmer'), true);
assert.equal(adapters.isAlexaPlayer(mockHass.states['media_player.wohnzimmer'], 'media_player.wohnzimmer'), false);

// Alexa Radio uses TUNEIN + station name (never media-source://...)
await adapters.play({
  hass: echoHass,
  mhCfg: mhFree,
  targetPlayer: 'media_player.echo_dot_kuche_esszimmer',
  item: { id: 'media-source://radio_browser/swr3', title: 'SWR3', provider: 'radio' }
});
assert.equal(echoHass.callCalls.at(-1).data.media_content_type, 'TUNEIN');
assert.equal(echoHass.callCalls.at(-1).data.media_content_id, 'SWR3');

// SpotifyPlus nested result unwrapping
const nestedSpRes = await adapters.searchSpotify(echoHass, 'Nested', ['track'], mhHybrid, 'media_player.echo_dot_kuche_esszimmer');
assert.ok(nestedSpRes.items.some(i => i.id === 'spotify:track:nested1' && i.thumb === 'https://img/1.jpg'), 'Must unwrap nested SpotifyPlus result.items');

// Native Spotify without search_media falls back to browse_media + Alexa direct Spotify item
const mhNativeSp = ctx.ensureConfigDefaults({
  mediaHub: {
    profile: 'hybrid_premium',
    providers: { spotify: { enabled: true, mode: 'spotify', entity: 'media_player.spotify_native' } }
  }
}).mediaHub;
const nativeRes = await adapters.search({ hass: echoHass, mhCfg: mhNativeSp, tabId: 'spotify', query: 'engel', targetPlayer: 'media_player.echo_dot_kuche_esszimmer' });
assert.equal(nativeRes.errors.length, 0, 'Native Spotify browse + Alexa fallback must not error');
assert.ok(nativeRes.items.some(i => i.type === 'alexa_spotify' && i.title === 'engel'), 'Must include 1-tap Alexa Spotify item');
assert.ok(nativeRes.items.some(i => i.id === 'spotify:track:engel1'), 'Must include browse_media match');

const alexaSpItem = nativeRes.items.find(i => i.type === 'alexa_spotify');
await adapters.play({ hass: echoHass, mhCfg: mhNativeSp, targetPlayer: 'media_player.echo_dot_kuche_esszimmer', item: alexaSpItem });
assert.equal(echoHass.callCalls.at(-1).data.media_content_type, 'SPOTIFY');
assert.equal(echoHass.callCalls.at(-1).data.media_content_id, 'engel');

// Public Radio Browser API + Public Music Catalog (iTunes) fallback with cover art
ctx.fetch = async url => {
  if (url.includes('api.radio-browser.info')) {
    return {
      ok: true,
      async json() {
        return [
          { stationuuid: 'uuid-swr3', name: 'SWR3', countrycode: 'DE', tags: 'pop,rock', bitrate: 128, favicon: 'https://cdn/swr3.png', url_resolved: 'https://stream/swr3.mp3' },
          { stationuuid: 'uuid-swr1', name: 'SWR1 Baden-Württemberg', countrycode: 'DE', tags: 'oldies,hits', bitrate: 128, favicon: 'https://cdn/swr1.png', url_resolved: 'https://stream/swr1.mp3' },
          { stationuuid: 'uuid-swr4', name: 'SWR4', countrycode: 'DE', tags: 'schlager', bitrate: 128, favicon: 'https://cdn/swr4.png', url_resolved: 'https://stream/swr4.mp3' }
        ];
      }
    };
  }
  if (url.includes('itunes.apple.com/search')) {
    return {
      ok: true,
      async json() {
        return {
          results: [
            {
              wrapperType: 'track',
              kind: 'song',
              artistId: 1001,
              artistName: 'Sarah Connor',
              collectionId: 2001,
              collectionName: 'Muttersprache',
              trackId: 3001,
              trackName: 'Wie schön du bist',
              primaryGenreName: 'Pop',
              artworkUrl100: 'https://cdn/sarah_connor.jpg'
            },
            {
              wrapperType: 'track',
              kind: 'song',
              artistId: 1002,
              artistName: 'Sarah Engels',
              collectionId: 2002,
              collectionName: 'Im Herzschlag',
              trackId: 3002,
              trackName: 'Te Amo Mi Amor',
              primaryGenreName: 'Pop',
              artworkUrl100: 'https://cdn/sarah_engels.jpg'
            }
          ]
        };
      }
    };
  }
  return { ok: false };
};

const swrCfg = ctx.ensureConfigDefaults({
  mediaHub: {
    radioFavorites: [{ name: 'SWR3', contentId: 'SWR3', icon: '📻' }],
    providers: { radio: { enabled: true, liveSearch: true } }
  }
}).mediaHub;
const swrRes = await adapters.searchRadio(echoHass, 'swr', swrCfg);
assert.equal(swrRes.items.filter(i => i.title === 'SWR3').length, 1, 'SWR3 favorite must be deduped against live SWR3');
assert.equal(swrRes.items.find(i => i.title === 'SWR3').thumb, 'https://cdn/swr3.png', 'SWR3 favorite must inherit favicon cover');
assert.ok(swrRes.items.some(i => i.title === 'SWR1 Baden-Württemberg' && i.thumb === 'https://cdn/swr1.png'), 'Must return SWR1 with cover');
assert.ok(swrRes.items.some(i => i.title === 'SWR4' && i.thumb === 'https://cdn/swr4.png'), 'Must return SWR4 with cover');

const sarahRes = await adapters.search({
  hass: echoHass,
  mhCfg: mhNativeSp,
  tabId: 'spotify',
  query: 'sarah',
  targetPlayer: 'media_player.echo_dot_kuche_esszimmer'
});
assert.ok(sarahRes.items.some(i => i.type === 'artist' && i.title === 'Sarah Connor' && i.thumb === 'https://cdn/sarah_connor.jpg'), 'Must find artist Sarah Connor with cover');
assert.ok(sarahRes.items.some(i => i.type === 'track' && i.title === 'Wie schön du bist' && i.thumb === 'https://cdn/sarah_connor.jpg'), 'Must find track with cover');
assert.ok(sarahRes.items.some(i => i.type === 'album' && i.title === 'Muttersprache'), 'Must find album with cover');

const trackPick = sarahRes.items.find(i => i.type === 'track' && i.title === 'Wie schön du bist');
await adapters.play({ hass: echoHass, mhCfg: mhNativeSp, targetPlayer: 'media_player.echo_dot_kuche_esszimmer', item: trackPick });
assert.equal(echoHass.callCalls.at(-1).data.media_content_type, 'SPOTIFY');
assert.equal(echoHass.callCalls.at(-1).data.media_content_id, 'Wie schön du bist Sarah Connor');

const artistPick = sarahRes.items.find(i => i.type === 'artist' && i.title === 'Sarah Connor');
await adapters.play({ hass: echoHass, mhCfg: mhNativeSp, targetPlayer: 'media_player.echo_dot_kuche_esszimmer', item: artistPick });
assert.equal(echoHass.callCalls.at(-1).data.media_content_type, 'SPOTIFY');
assert.equal(echoHass.callCalls.at(-1).data.media_content_id, 'Sarah Connor');
delete ctx.fetch;

// Free zero-auth streaming providers: SomaFM, Audius, Internet Archive, Radio Browser genres + SpotifyPlus queue
ctx.fetch = async url => {
  if (url.includes('api.somafm.com/channels.json')) {
    return {
      ok: true,
      async json() {
        return {
          channels: [
            { id: 'groovesalad', title: 'Groove Salad', genre: 'ambient', lastPlaying: 'Tycho', listeners: 900, image: 'https://somafm.com/gs.png' },
            { id: 'defcon', title: 'DEF CON Radio', genre: 'electronic', lastPlaying: 'Mix', listeners: 300, image: 'https://somafm.com/dc.png' }
          ]
        };
      }
    };
  }
  if (url.includes('api.audius.co/v1/tracks/trending')) {
    return {
      ok: true,
      async json() {
        return {
          data: [
            { id: 'aud10', title: 'Chill Wave', is_streamable: true, duration: 185, user: { name: 'Oceanic' }, artwork: { '150x150': 'https://aud/10.jpg' } },
            { id: 'aud11', title: 'Blocked Track', is_streamable: false, duration: 120, user: { name: 'X' } }
          ]
        };
      }
    };
  }
  if (url.includes('api.audius.co/v1/tracks/aud10/stream') && url.includes('no_redirect=true')) {
    return { ok: true, async json() { return { data: 'https://creator.audius.co/stream/aud10.mp3' }; } };
  }
  if (url.includes('archive.org/advancedsearch.php')) {
    return {
      ok: true,
      async json() {
        return { response: { docs: [{ identifier: 'cornell77', title: 'Cornell 77', creator: 'Grateful Dead' }] } };
      }
    };
  }
  if (url.includes('archive.org/metadata/cornell77/files')) {
    return {
      ok: true,
      async json() {
        return { result: [{ name: 'cover.jpg' }, { name: 'track01.mp3' }] };
      }
    };
  }
  if (url.includes('api.radio-browser.info/json/stations/bytag/chill')) {
    return {
      ok: true,
      async json() {
        return [{ stationuuid: 'chill-1', name: 'Chillout Lounge', countrycode: 'DE', tags: 'chill,ambient', bitrate: 128, url_resolved: 'https://chill.fm/stream.mp3' }];
      }
    };
  }
  return { ok: false };
};

const somaRes = await adapters.searchSomaFm(mockHass, '');
assert.equal(somaRes.items.length, 2);
assert.equal(somaRes.items[0].uri, 'https://ice1.somafm.com/groovesalad-128-mp3');
await adapters.play({ hass: mockHass, mhCfg: mhFree, targetPlayer: 'media_player.wohnzimmer', item: somaRes.items[0] });
assert.equal(mockHass.callCalls.at(-1).data.media_content_id, 'https://ice1.somafm.com/groovesalad-128-mp3');
await adapters.play({ hass: echoHass, mhCfg: mhFree, targetPlayer: 'media_player.echo_dot_kuche_esszimmer', item: somaRes.items[0] });
assert.equal(echoHass.callCalls.at(-1).data.media_content_type, 'TUNEIN');
assert.equal(echoHass.callCalls.at(-1).data.media_content_id, 'SomaFM Groove Salad');

const audRes = await adapters.searchAudius(mockHass, '');
assert.equal(audRes.items.length, 1, 'Must filter non-streamable Audius tracks');
assert.equal(audRes.items[0].subtitle, 'Oceanic · 3:05');
await adapters.play({ hass: mockHass, mhCfg: mhFree, targetPlayer: 'media_player.wohnzimmer', item: audRes.items[0] });
assert.equal(mockHass.callCalls.at(-1).data.media_content_id, 'https://creator.audius.co/stream/aud10.mp3');

const archRes = await adapters.searchArchive(mockHass, '', 'jazz');
assert.equal(archRes.items[0].id, 'cornell77');
await adapters.play({ hass: mockHass, mhCfg: mhFree, targetPlayer: 'media_player.wohnzimmer', item: archRes.items[0] });
assert.equal(mockHass.callCalls.at(-1).data.media_content_id, 'https://archive.org/download/cornell77/track01.mp3');

const rbGenre = await adapters.browseRadioGenre(mockHass, 'chill');
assert.equal(rbGenre.items[0].title, 'Chillout Lounge');
delete ctx.fetch;

// fetchPlayerQueue with SpotifyPlus mock
const qHass = {
  ...mockHass,
  services: { ...mockHass.services, spotifyplus: { ...mockHass.services.spotifyplus, get_player_queue_info: {} } },
  async callWS(msg) {
    if (msg.type === 'call_service' && msg.service === 'get_player_queue_info') {
      return { response: { queue: [{ uri: 'spotify:track:q1', name: 'Next Up Track', artists: [{ name: 'Artist Q' }] }] } };
    }
    return mockHass.callWS(msg);
  }
};
const spQueue = await adapters.fetchPlayerQueue(qHass, 'media_player.wohnzimmer', mhHybrid);
assert.equal(spQueue.supported, true);
assert.equal(spQueue.items[0].title, 'Next Up Track');

// ytube_music_player: sensor.*_extra attributes.search & media_player/browse_media fallback
const ytExtraHass = {
  services: { ytube_music_player: { search: {} }, media_player: { play_media: {}, select_source: {} } },
  states: {
    'media_player.ytube_music_player': { state: 'idle', attributes: { source_list: ['Wohnzimmer'] } },
    'sensor.ytube_music_player_extra': { state: 'ok', attributes: { search: [] } }
  },
  async callService(domain, service) {
    if (domain === 'ytube_music_player' && service === 'search') {
      this.states['sensor.ytube_music_player_extra'].attributes.search = [
        {
          videoId: 'em_vid_1',
          title: 'Lose Yourself',
          resultType: 'song',
          artists: [{ name: 'Eminem' }],
          album: { name: '8 Mile' },
          thumbnails: [{ url: 'https://yt/small.jpg' }, { url: 'https://yt/large.jpg' }]
        },
        {
          browseId: 'em_art_1',
          artist: 'Eminem',
          resultType: 'artist',
          thumbnails: [{ url: 'https://yt/artist.jpg' }]
        }
      ];
    }
    return {};
  }
};
const ytExtraRes = await adapters.searchYtube(ytExtraHass, 'eminem', mhFree);
assert.equal(ytExtraRes.items.length, 2, 'Must read ytube results from sensor.*_extra');
assert.equal(ytExtraRes.items[0].id, 'em_vid_1');
assert.equal(ytExtraRes.items[0].thumb, 'https://yt/large.jpg', 'Must pick highest-res ytube thumbnail');
assert.equal(ytExtraRes.items[0].subtitle, 'Eminem · 8 Mile');
assert.equal(ytExtraRes.items[1].title, 'Eminem', 'Must map artist field when title is omitted');

const ytBrowseHass = {
  services: { ytube_music_player: { search: {} } },
  states: { 'media_player.ytube_music_player': { state: 'idle', attributes: {} } },
  async callService() { return {}; },
  async callWS(msg) {
    if (msg.type === 'media_player/browse_media' && msg.media_content_type === 'search') {
      return {
        children: [
          { title: 'Without Me', media_content_id: 'yt_browse_1', media_content_type: 'track', thumbnail: 'https://yt/wm.jpg', can_play: true }
        ]
      };
    }
    return {};
  }
};
const ytBrowseRes = await adapters.searchYtube(ytBrowseHass, 'eminem', mhFree);
assert.equal(ytBrowseRes.items.length, 1, 'Must fall back to browse_media search node');
assert.equal(ytBrowseRes.items[0].id, 'yt_browse_1');
assert.equal(ytBrowseRes.items[0].thumb, 'https://yt/wm.jpg');

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

// Queue / Up-Next workflow: add, reorder, remove, badge count & Next button pops queued item
const qStore = {};
ctx.localStorage.getItem = k => qStore[k] || null;
ctx.localStorage.setItem = (k, v) => { qStore[k] = String(v); };

inst.searchResults = [
  { id: 'q_item_1', uri: 'https://stream/1.mp3', title: 'Track Eins', subtitle: 'A1', provider: 'direct_url' },
  { id: 'q_item_2', uri: 'https://stream/2.mp3', title: 'Track Zwei', subtitle: 'A2', provider: 'direct_url' }
];
const clickEv = async (act, extra = {}) => {
  const fakeBtn = { dataset: { mhAct: act, ...extra } };
  const target = { dataset: fakeBtn.dataset, closest: sel => (sel === '[data-mh-act]' ? fakeBtn : null) };
  for (const fn of (inst.el.listeners.click || [])) await fn({ target });
};
inst.el.contains = () => true;
await clickEv('queueResult', { mhIdx: '0' });
await clickEv('queueResult', { mhIdx: '1' });
const qBadge = inst.el.querySelector('[data-mh-role="queue-badge"]');
assert.equal(qBadge.hidden, false, 'Queue badge must appear when items are queued');
assert.equal(qBadge.textContent, '2', 'Queue badge must show 2 queued items');

await clickEv('toggleQueue');
const qSlot = inst.el.querySelector('[data-mh-role="queue-slot"]');
assert.ok(qSlot.innerHTML.includes('Track Eins') && qSlot.innerHTML.includes('Track Zwei'), 'Queue drawer must render queued tracks');

// Move item 1 up -> Track Zwei becomes #1
await clickEv('queueMove', { mhIdx: '1', mhDir: '-1' });
assert.ok(qSlot.innerHTML.indexOf('Track Zwei') < qSlot.innerHTML.indexOf('Track Eins'), 'queueMove must reorder items');

// Pressing Next pops Track Zwei and plays it instead of calling media_next_track
await clickEv('transport', { mhSvc: 'media_next_track' });
assert.equal(mockHass.callCalls.at(-1).data.media_content_id, 'https://stream/2.mp3', 'Next button must play queued Track Zwei');
assert.equal(qBadge.textContent, '1', 'Queue badge must decrement to 1 after popping');

// Remove remaining item
await clickEv('queueRemove', { mhIdx: '0' });
assert.equal(qBadge.hidden, true, 'Queue badge must hide when queue becomes empty');

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

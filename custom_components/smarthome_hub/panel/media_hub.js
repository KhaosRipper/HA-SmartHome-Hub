/* ==========================================================================
   Smart Home Hub – Media Hub Widget (media_hub.js)
   Modular Hybrid Media Player, Search, Touch/Swipe & Multiroom Component
   ========================================================================== */
(function (root) {
  'use strict';

  const instances = new Map();
  const detachedRoots = new Map();
  const QUEUE_STORAGE_KEY = 'smarthome_hub_mh_queue_v1';
  let pendingFocusState = null;

  function loadAllQueues() {
    try {
      if (typeof localStorage === 'undefined') return {};
      const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (_) {
      return {};
    }
  }

  function getPlayerQueue(entityId) {
    if (!entityId) return [];
    const all = loadAllQueues();
    return Array.isArray(all[entityId]) ? all[entityId] : [];
  }

  function savePlayerQueue(entityId, list) {
    if (!entityId) return;
    try {
      if (typeof localStorage === 'undefined') return;
      const all = loadAllQueues();
      all[entityId] = Array.isArray(list) ? list.slice(0, 100) : [];
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(all));
    } catch (_) {}
  }

  function addToPlayerQueue(entityId, item) {
    if (!entityId || !item) return [];
    const list = getPlayerQueue(entityId).slice();
    list.push({
      id: item.id,
      uri: item.uri,
      title: item.title || item.name || item.id,
      subtitle: item.subtitle || '',
      type: item.type || 'track',
      contentType: item.contentType || 'music',
      thumb: item.thumb || '',
      icon: item.icon || '🎵',
      provider: item.provider || 'radio',
      directStreamUrl: item.directStreamUrl || '',
      artist: item.artist || '',
      catalogFallback: !!item.catalogFallback
    });
    savePlayerQueue(entityId, list);
    return list;
  }

  function moveQueueItem(entityId, idx, dir) {
    const list = getPlayerQueue(entityId).slice();
    const target = idx + dir;
    if (idx < 0 || idx >= list.length || target < 0 || target >= list.length) return list;
    const tmp = list[idx];
    list[idx] = list[target];
    list[target] = tmp;
    savePlayerQueue(entityId, list);
    return list;
  }

  function removeQueueItem(entityId, idx) {
    const list = getPlayerQueue(entityId).slice();
    if (idx >= 0 && idx < list.length) list.splice(idx, 1);
    savePlayerQueue(entityId, list);
    return list;
  }

  function clearPlayerQueue(entityId) {
    savePlayerQueue(entityId, []);
    return [];
  }

  function fmtMediaSec(sec) {
    const s = Math.max(0, Math.floor(Number(sec) || 0));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const r = s % 60;
    return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}` : `${m}:${String(r).padStart(2, '0')}`;
  }

  function safeGetHass() {
    if (typeof DEMO !== 'undefined' && DEMO) return null;
    if (typeof getHass === 'function') return getHass();
    return null;
  }

  function safeCall(domain, service, data) {
    if (typeof call === 'function') {
      call(domain, service, data, true);
      return;
    }
    const h = safeGetHass();
    if (h && typeof h.callService === 'function') h.callService(domain, service, data);
  }

  function safeState(entityId) {
    if (!entityId) return null;
    if (typeof S === 'function') return S(entityId);
    const h = safeGetHass();
    return (h && h.states && h.states[entityId]) || null;
  }

  function safeEsc(v) {
    if (typeof esc === 'function') return esc(v);
    return String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function safeIc(name, size) {
    if (typeof ic === 'function') return ic(name, size);
    return '';
  }

  function safeT(key, vars) {
    if (typeof t === 'function') return t(key, vars);
    return key;
  }

  function safeImgUrl(url) {
    const s = String(url || '').trim();
    return /^(\/|https?:\/\/)/i.test(s) ? s : '';
  }

  function playerLabel(pCfg, st) {
    if (pCfg && pCfg.name) return pCfg.name;
    if (st && st.attributes && st.attributes.friendly_name) return st.attributes.friendly_name;
    return (pCfg && pCfg.entity) || '';
  }

  function getMhConfig() {
    const cfg = (typeof CONFIG !== 'undefined' && CONFIG) || {};
    if (cfg.mediaHub) return cfg.mediaHub;
    if (typeof DEFAULT_MEDIA_HUB_CONFIG === 'function') return DEFAULT_MEDIA_HUB_CONFIG();
    return {
      show: false,
      title: 'Media Hub',
      profile: 'free_direct',
      players: [],
      defaultPlayer: '',
      providers: { radio: { enabled: true, liveSearch: true }, direct_url: { enabled: true } },
      multiroom: { enabled: true, groupablePlayers: [], presets: [] },
      radioFavorites: [],
      search: { scope: 'active_tab', mediaTypes: ['track', 'artist', 'album', 'radio'] },
      ui: { density: 'standard', tabSwipe: true, trackSwipe: false, searchPosition: 'below_tabs', searchStyle: 'full', playerSelectorStyle: 'pills', volumeStyle: 'slider', showCoverArt: true, radioGridCols: 2 }
    };
  }

  function getOrCreateInstance(key, title) {
    let inst = instances.get(key);
    if (!inst) {
      inst = {
        key,
        title: title || '',
        el: null,
        cfgSig: '',
        selectedPlayer: '',
        activeTab: '',
        searchQuery: '',
        searchOpen: false,
        searchLoading: false,
        searchResults: [],
        searchErrors: [],
        hasSearched: false,
        multiroomOpen: false,
        queueOpen: false,
        remoteQueue: [],
        remoteQueueSource: '',
        remoteQueueSupported: false,
        queueLoading: false,
        browseCache: {},
        radioGenre: 'favs',
        archiveGenre: 'jazz',
        lastPlayerStates: {},
        manualActionAt: 0,
        activeMediaTypes: null,
        draggingVolEntity: null,
        volTimer: null
      };
      instances.set(key, inst);
    }
    if (title !== undefined) inst.title = title;
    return inst;
  }

  function ensureSelections(inst, mhCfg) {
    const players = mhCfg.players || [];
    if (!players.length) {
      inst.selectedPlayer = '';
    } else if (!players.some(p => p.entity === inst.selectedPlayer)) {
      const def = mhCfg.defaultPlayer && players.some(p => p.entity === mhCfg.defaultPlayer)
        ? mhCfg.defaultPlayer
        : players[0].entity;
      inst.selectedPlayer = def;
    }

    const activeProviders = root.MediaHubAdapters
      ? root.MediaHubAdapters.getActiveProviders(mhCfg)
      : ['radio'];
    if (!activeProviders.includes(inst.activeTab)) {
      inst.activeTab = activeProviders[0] || 'radio';
    }

    const cfgTypes = (mhCfg.search && mhCfg.search.mediaTypes) || ['track', 'artist', 'album', 'radio'];
    if (!Array.isArray(inst.activeMediaTypes) || !inst.activeMediaTypes.length) {
      inst.activeMediaTypes = cfgTypes.slice();
    } else {
      const filtered = inst.activeMediaTypes.filter(tp => cfgTypes.includes(tp));
      inst.activeMediaTypes = filtered.length ? filtered : cfgTypes.slice();
    }
  }

  function buildSearchBarHtml(inst, mhCfg, uiCfg) {
    const style = uiCfg.searchStyle || 'full';
    if (style === 'icon_only' && !inst.searchOpen) return '';
    const isUrl = root.MediaHubAdapters && root.MediaHubAdapters.isDirectUrl(inst.searchQuery);
    const cfgTypes = (mhCfg.search && mhCfg.search.mediaTypes) || ['track', 'artist', 'album', 'radio'];
    const showTypes = style === 'full' && cfgTypes.length > 1 && inst.activeTab !== 'radio' && inst.activeTab !== 'direct_url';

    const typeChipsHtml = showTypes ? `<div class="mh-search-types">
      ${cfgTypes.map(tp => {
        const on = (inst.activeMediaTypes || []).includes(tp);
        return `<button type="button" class="mh-type-chip ${on ? 'on' : ''}" data-mh-act="toggleMediaType" data-mh-type="${safeEsc(tp)}">${safeEsc(safeT('mh.type.' + tp))}</button>`;
      }).join('')}
    </div>` : '';

    return `<div class="mh-search-wrap" data-mh-role="search-wrap">
      <div class="mh-search-bar ${style === 'compact' ? 'compact' : ''}">
        ${safeIc('search', 16)}
        <input type="text" class="mh-search-input" data-mh-role="search-input" value="${safeEsc(inst.searchQuery)}" placeholder="${safeEsc(safeT('mh.search_placeholder'))}" autocomplete="off">
        ${inst.searchQuery ? `<button type="button" class="mh-btn mh-icon-btn" data-mh-act="clearSearch" title="${safeEsc(safeT('mh.search_clear'))}" aria-label="${safeEsc(safeT('mh.search_clear'))}">✕</button>` : ''}
        ${isUrl
          ? `<button type="button" class="mh-btn mh-btn-pri" data-mh-act="playDirectUrl">${safeIc('play', 14)} ${safeEsc(safeT('mh.play_url'))}</button>`
          : `<button type="button" class="mh-btn mh-btn-pri" data-mh-act="runSearch">${safeEsc(safeT('mh.search_btn'))}</button>`}
      </div>
      ${typeChipsHtml}
    </div>`;
  }

  const RADIO_GENRES = [
    ['favs', 'mh.radio_quick_favs'],
    ['top_de', 'Top DE'],
    ['pop', 'Pop'],
    ['rock', 'Rock'],
    ['chill', 'Chill'],
    ['80s', '80s'],
    ['news', 'News']
  ];
  const ARCHIVE_GENRES = [
    ['jazz', 'Jazz'],
    ['classical', 'Klassik'],
    ['ambient', 'Ambient'],
    ['live', 'Live'],
    ['audiobook', 'Hörbücher']
  ];

  function getBrowseKey(inst) {
    if (inst.activeTab === 'radio') return `radio:${inst.radioGenre || 'favs'}`;
    if (inst.activeTab === 'archive') return `archive:${inst.archiveGenre || 'jazz'}`;
    if (inst.activeTab === 'somafm' || inst.activeTab === 'audius') return `${inst.activeTab}:default`;
    return '';
  }

  function ensureTabBrowseLoaded(inst, mhCfg) {
    const key = getBrowseKey(inst);
    if (!key || key === 'radio:favs') return;
    const entry = inst.browseCache[key];
    if (entry && (entry.loading || entry.loaded)) return;
    const adapters = root.MediaHubAdapters;
    if (!adapters) return;

    inst.browseCache[key] = { loading: true, loaded: false, items: [] };
    const hass = safeGetHass();
    let promise = null;
    if (inst.activeTab === 'radio') promise = adapters.browseRadioGenre(hass, inst.radioGenre);
    else if (inst.activeTab === 'somafm') promise = adapters.searchSomaFm(hass, '');
    else if (inst.activeTab === 'audius') promise = adapters.searchAudius(hass, '');
    else if (inst.activeTab === 'archive') promise = adapters.searchArchive(hass, '', inst.archiveGenre);
    if (!promise) return;

    promise.then(res => {
      inst.browseCache[key] = { loading: false, loaded: true, items: (res && res.items) || [] };
      if (getBrowseKey(inst) === key && !inst.hasSearched) {
        refreshContentAndSearch(inst, mhCfg, true);
      }
    }).catch(() => {
      inst.browseCache[key] = { loading: false, loaded: true, items: [] };
      if (getBrowseKey(inst) === key && !inst.hasSearched) {
        refreshContentAndSearch(inst, mhCfg, true);
      }
    });
  }

  function renderResultRowsHtml(items, playAct, queueAct) {
    const typeLabels = {
      track: safeT('mh.type.track'),
      artist: safeT('mh.type.artist'),
      album: safeT('mh.type.album'),
      radio: safeT('mh.type.radio'),
      channel: safeT('mh.type.channel'),
      archive: safeT('mh.type.archive'),
      alexa_spotify: 'Alexa'
    };
    return `<div class="mh-results">
      ${items.map((item, idx) => {
        const thumb = safeImgUrl(item.thumb);
        const tag = typeLabels[item.type] || item.type || item.provider;
        return `<div class="mh-result-row">
          <button type="button" class="mh-result-item" data-mh-act="${playAct}" data-mh-idx="${idx}">
            <div class="mh-result-thumb">${thumb ? `<img src="${safeEsc(thumb)}" alt="" onerror="this.style.display='none'">` : safeEsc(item.icon || '🎵')}</div>
            <div class="mh-result-meta">
              <div class="mh-result-title">${safeEsc(item.title)}</div>
              <div class="mh-result-sub">${safeEsc(item.subtitle || item.provider)}</div>
            </div>
            <span class="mh-result-tag">${safeEsc(tag)}</span>
          </button>
          <button type="button" class="mh-btn mh-icon-btn mh-q-add-btn" data-mh-act="${queueAct}" data-mh-idx="${idx}" title="${safeEsc(safeT('mh.queue_add'))}" aria-label="${safeEsc(safeT('mh.queue_add'))}">${safeIc('plus', 15)}</button>
        </div>`;
      }).join('')}
    </div>`;
  }

  function buildContentHtml(inst, mhCfg) {
    const uiCfg = mhCfg.ui || {};
    const adapters = root.MediaHubAdapters;
    const hass = safeGetHass();
    const radioCols = Math.min(4, Math.max(1, parseInt(uiCfg.radioGridCols, 10) || 2));

    let body = '';
    if (inst.searchLoading) {
      body += `<div class="mh-hint">${safeEsc(safeT('mh.searching'))}</div>`;
    }
    if (inst.searchErrors && inst.searchErrors.length) {
      inst.searchErrors.forEach(err => {
        const baseMsg = err.reasonKey ? safeT(err.reasonKey) : safeT('mh.err_search_failed');
        const msg = err.detail ? `${baseMsg} (${err.detail})` : baseMsg;
        body += `<div class="mh-hint warn">⚠️ ${safeEsc(msg)}</div>`;
      });
    }

    if (inst.hasSearched && !inst.searchLoading) {
      if (inst.searchResults && inst.searchResults.length) {
        body += renderResultRowsHtml(inst.searchResults, 'playResult', 'queueResult');
      } else if (!inst.searchErrors || !inst.searchErrors.length) {
        body += `<div class="mh-hint">${safeEsc(safeT('mh.no_results'))}</div>`;
      }
      return body;
    }

    if (inst.activeTab === 'radio') {
      body += `<div class="mh-genre-chips">
        ${RADIO_GENRES.map(([gk, lbl]) => {
          const txt = lbl.startsWith('mh.') ? safeT(lbl) : lbl;
          return `<button type="button" class="mh-genre-chip ${(inst.radioGenre || 'favs') === gk ? 'on' : ''}" data-mh-act="setRadioGenre" data-mh-genre="${safeEsc(gk)}">${safeEsc(txt)}</button>`;
        }).join('')}
      </div>`;

      if ((inst.radioGenre || 'favs') === 'favs') {
        const favs = (mhCfg.radioFavorites || []).filter(f => f && (f.name || f.contentId));
        if (favs.length) {
          body += `<div class="mh-radio-grid" style="--mh-radio-cols:${radioCols}">
            ${favs.map((f, idx) => `<div class="mh-radio-cell">
              <button type="button" class="mh-radio-tile" data-mh-act="playRadioFav" data-mh-idx="${idx}">
                <span class="mh-radio-icon">${safeEsc(f.icon || '📻')}</span>
                <span class="mh-radio-name">${safeEsc(f.name || f.contentId)}</span>
              </button>
              <button type="button" class="mh-btn mh-icon-btn mh-radio-q" data-mh-act="queueRadioFav" data-mh-idx="${idx}" title="${safeEsc(safeT('mh.queue_add'))}" aria-label="${safeEsc(safeT('mh.queue_add'))}">${safeIc('plus', 14)}</button>
            </div>`).join('')}
          </div>`;
        } else {
          body += `<div class="mh-hint">${safeEsc(safeT('mh.radio_favs_empty'))}</div>`;
        }
      } else {
        ensureTabBrowseLoaded(inst, mhCfg);
        const cache = inst.browseCache[getBrowseKey(inst)] || {};
        if (cache.loading) body += `<div class="mh-hint">${safeEsc(safeT('mh.browse_loading'))}</div>`;
        else if (cache.items && cache.items.length) body += renderResultRowsHtml(cache.items, 'playBrowse', 'queueBrowse');
        else body += `<div class="mh-hint">${safeEsc(safeT('mh.browse_empty'))}</div>`;
      }
      return body;
    }

    if (inst.activeTab === 'somafm' || inst.activeTab === 'audius' || inst.activeTab === 'archive') {
      if (inst.activeTab === 'archive') {
        body += `<div class="mh-genre-chips">
          ${ARCHIVE_GENRES.map(([gk, lbl]) => `<button type="button" class="mh-genre-chip ${(inst.archiveGenre || 'jazz') === gk ? 'on' : ''}" data-mh-act="setArchiveGenre" data-mh-genre="${safeEsc(gk)}">${safeEsc(lbl)}</button>`).join('')}
        </div>`;
      }
      ensureTabBrowseLoaded(inst, mhCfg);
      const cache = inst.browseCache[getBrowseKey(inst)] || {};
      if (cache.loading) body += `<div class="mh-hint">${safeEsc(safeT('mh.browse_loading'))}</div>`;
      else if (cache.items && cache.items.length) body += renderResultRowsHtml(cache.items, 'playBrowse', 'queueBrowse');
      else body += `<div class="mh-hint">${safeEsc(safeT('mh.browse_empty'))}</div>`;
      return body;
    }

    if (inst.activeTab === 'direct_url') {
      body += `<div class="mh-hint">${safeEsc(safeT('mh.direct_url_hint'))}</div>`;
    } else {
      const avail = adapters ? adapters.checkProviderAvailability(hass, inst.activeTab, mhCfg, inst.selectedPlayer) : { available: true };
      if (!avail.available && avail.reasonKey) {
        body += `<div class="mh-hint warn">⚠️ ${safeEsc(safeT(avail.reasonKey))}</div>`;
      } else {
        body += `<div class="mh-hint">${safeEsc(safeT('mh.tab_search_hint', { source: safeT('mh.tab.' + inst.activeTab) }))}</div>`;
      }
    }

    return body;
  }

  function buildQueuePanelHtml(inst, mhCfg) {
    if (!inst.queueOpen) return '';
    const queue = getPlayerQueue(inst.selectedPlayer);
    const st = safeState(inst.selectedPlayer);
    const attrs = (st && st.attributes) || {};
    const curTitle = attrs.media_title || safeT('mh.nothing_playing');
    const curArtist = attrs.media_artist || attrs.media_album_name || '';
    const sp = (mhCfg && mhCfg.providers && mhCfg.providers.spotify) || {};
    const canSyncRemote = (sp.enabled && sp.entity) || (mhCfg && mhCfg.profile === 'music_assistant');

    return `<div class="mh-queue-panel" data-mh-role="queue-panel">
      <div class="mh-q-hdr">
        <span>${safeIc('queue', 15)} ${safeEsc(safeT('mh.queue_title'))}</span>
        <div style="display:flex;align-items:center;gap:6px">
          ${canSyncRemote ? `<button type="button" class="mh-btn" data-mh-act="refreshRemoteQueue">${safeEsc(safeT('mh.queue_sync'))}</button>` : ''}
          ${queue.length ? `<button type="button" class="mh-btn" data-mh-act="queueClear">${safeEsc(safeT('mh.queue_clear'))}</button>` : ''}
          <button type="button" class="mh-btn mh-icon-btn" data-mh-act="toggleQueue" aria-label="Close">✕</button>
        </div>
      </div>
      <div class="mh-q-now">
        <span class="mh-q-sec">${safeEsc(safeT('mh.queue_now'))}</span>
        <div class="mh-q-now-meta">
          <b>${safeEsc(curTitle)}</b>
          ${curArtist ? `<small>${safeEsc(curArtist)}</small>` : ''}
        </div>
      </div>
      <div class="mh-q-sec">${safeEsc(safeT('mh.queue_next'))} (${queue.length})</div>
      ${queue.length ? `<div class="mh-q-list">
        ${queue.map((item, idx) => {
          const thumb = safeImgUrl(item.thumb);
          return `<div class="mh-q-row" data-mh-q-idx="${idx}">
            <span class="mh-q-num">${idx + 1}</span>
            <button type="button" class="mh-q-main" data-mh-act="queuePlay" data-mh-idx="${idx}">
              <div class="mh-q-thumb">${thumb ? `<img src="${safeEsc(thumb)}" alt="" onerror="this.style.display='none'">` : safeEsc(item.icon || '🎵')}</div>
              <div class="mh-q-meta">
                <div class="mh-q-title">${safeEsc(item.title)}</div>
                <div class="mh-q-sub">${safeEsc(item.subtitle || item.provider)}</div>
              </div>
            </button>
            <div class="mh-q-actions">
              <button type="button" class="mh-btn mh-icon-btn" data-mh-act="queueMove" data-mh-idx="${idx}" data-mh-dir="-1" ${idx === 0 ? 'disabled' : ''} aria-label="Up">↑</button>
              <button type="button" class="mh-btn mh-icon-btn" data-mh-act="queueMove" data-mh-idx="${idx}" data-mh-dir="1" ${idx === queue.length - 1 ? 'disabled' : ''} aria-label="Down">↓</button>
              <button type="button" class="mh-btn mh-icon-btn" data-mh-act="queueRemove" data-mh-idx="${idx}" aria-label="Remove">✕</button>
            </div>
          </div>`;
        }).join('')}
      </div>` : `<div class="mh-hint">${safeEsc(safeT('mh.queue_empty'))}</div>`}
      ${inst.queueLoading ? `<div class="mh-hint">${safeEsc(safeT('mh.searching'))}</div>` : ''}
      ${(inst.remoteQueue && inst.remoteQueue.length) ? `
        <div class="mh-q-sec">${safeEsc(safeT('mh.queue_remote'))} (${inst.remoteQueue.length})</div>
        <div class="mh-q-list mh-q-remote-list">
          ${inst.remoteQueue.slice(0, 10).map((it, idx) => `<div class="mh-q-row">
            <span class="mh-q-num">${idx + 1}</span>
            <div class="mh-q-meta">
              <div class="mh-q-title">${safeEsc(it.title)}</div>
              <div class="mh-q-sub">${safeEsc(it.subtitle || '')}</div>
            </div>
          </div>`).join('')}
        </div>` : ''}
    </div>`;
  }

  function buildMultiroomPanelHtml(inst, mhCfg) {
    const adapters = root.MediaHubAdapters;
    const hass = safeGetHass();
    const groupable = adapters ? adapters.getGroupablePlayers(hass, mhCfg) : [];
    if (!inst.multiroomOpen || (mhCfg.multiroom && mhCfg.multiroom.enabled === false) || groupable.length < 2) {
      return '';
    }

    const masterId = inst.selectedPlayer || (groupable[0] && groupable[0].entity) || '';
    const masterState = safeState(masterId);
    const members = adapters ? adapters.getGroupMembers(masterState) : [];
    const presets = (mhCfg.multiroom && mhCfg.multiroom.presets) || [];

    return `<div class="mh-multiroom-panel" data-mh-role="multiroom-panel">
      <div class="mh-mr-hdr">
        <span>🔊 ${safeEsc(safeT('mh.multiroom_title'))}</span>
        <button type="button" class="mh-btn mh-icon-btn" data-mh-act="toggleMultiroom" aria-label="Close">✕</button>
      </div>
      <div class="mh-mr-list">
        ${groupable.map(p => {
          const st = safeState(p.entity);
          const lbl = playerLabel(p, st);
          const isMaster = p.entity === masterId;
          const isJoined = isMaster || members.includes(p.entity);
          const vol = st && st.attributes && st.attributes.volume_level != null
            ? Math.round(Number(st.attributes.volume_level) * 100)
            : 30;
          return `<div class="mh-mr-row" data-mh-mr-entity="${safeEsc(p.entity)}">
            <button type="button" class="mh-btn mh-mr-toggle ${isJoined ? 'on' : ''}" data-mh-act="mrToggleJoin" data-mh-entity="${safeEsc(p.entity)}" ${isMaster ? 'disabled' : ''}>
              ${isMaster ? `★ ${safeEsc(safeT('mh.multiroom_master'))}` : (isJoined ? `✓ ${safeEsc(safeT('mh.multiroom_joined'))}` : `+ ${safeEsc(safeT('mh.multiroom_join'))}`)}
            </button>
            <div style="display:flex;flex-direction:column;gap:4px;min-width:0">
              <span style="font-size:12px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${safeEsc(lbl)}</span>
              <input type="range" min="0" max="100" value="${vol}" class="mh-mr-vol" data-mh-act="mrVolSlider" data-mh-entity="${safeEsc(p.entity)}">
            </div>
            <span class="mh-mr-pct" data-mh-role="mr-pct">${vol}%</span>
          </div>`;
        }).join('')}
      </div>
      ${presets.length ? `<div class="mh-mr-presets">
        <span class="mut sm">${safeEsc(safeT('mh.multiroom_presets'))}:</span>
        ${presets.map((pr, idx) => `<button type="button" class="mh-btn" data-mh-act="mrPreset" data-mh-idx="${idx}">${safeEsc(pr.name || `Preset ${idx + 1}`)}</button>`).join('')}
      </div>` : ''}
    </div>`;
  }

  function buildFullStructure(inst, mhCfg) {
    ensureSelections(inst, mhCfg);
    const uiCfg = mhCfg.ui || {};
    const adapters = root.MediaHubAdapters;
    const providers = adapters ? adapters.getActiveProviders(mhCfg) : ['radio'];
    const players = mhCfg.players || [];
    const title = inst.title || mhCfg.title || safeT('mh.title');
    const isTouch = uiCfg.density === 'tablet_touch';
    const searchPos = uiCfg.searchPosition || 'below_tabs';
    const searchBarHtml = buildSearchBarHtml(inst, mhCfg, uiCfg);

    inst.el.className = `mh-root ${isTouch ? 'mh-touch' : ''}`.trim();

    let playerSelHtml = '';
    if (!players.length) {
      playerSelHtml = `<div class="mh-hint">${safeEsc(safeT('mh.no_players'))}</div>`;
    } else if (uiCfg.playerSelectorStyle === 'dropdown') {
      playerSelHtml = `<select class="mh-select" data-mh-role="player-select" aria-label="${safeEsc(safeT('mh.select_player'))}">
        ${players.map(p => {
          const st = safeState(p.entity);
          return `<option value="${safeEsc(p.entity)}" ${p.entity === inst.selectedPlayer ? 'selected' : ''}>${safeEsc(playerLabel(p, st))}</option>`;
        }).join('')}
      </select>`;
    } else {
      playerSelHtml = `<div class="mh-player-pills" data-mh-role="player-pills">
        ${players.map(p => {
          const st = safeState(p.entity);
          const isOn = p.entity === inst.selectedPlayer;
          const isPlay = st && st.state === 'playing';
          return `<button type="button" class="mh-player-pill ${isOn ? 'on' : ''} ${isPlay ? 'playing' : ''}" data-mh-act="selectPlayer" data-mh-entity="${safeEsc(p.entity)}">
            <span class="mh-player-dot"></span>
            <span>${safeEsc(playerLabel(p, st))}</span>
          </button>`;
        }).join('')}
      </div>`;
    }

    const volHtml = uiCfg.volumeStyle === 'buttons'
      ? `<div class="mh-vol-btns" data-mh-role="vol-wrap">
          <button type="button" class="mh-btn" data-mh-act="volStep" data-mh-delta="-0.05" aria-label="${safeEsc(safeT('mh.vol_down'))}">🔉 −</button>
          <button type="button" class="mh-btn" data-mh-act="volMute" data-mh-role="mute-btn" aria-label="${safeEsc(safeT('mh.mute'))}">${safeIc('volume', 16)}</button>
          <span class="mh-vol-val" data-mh-role="vol-val">0%</span>
          <button type="button" class="mh-btn" data-mh-act="volStep" data-mh-delta="0.05" aria-label="${safeEsc(safeT('mh.vol_up'))}">🔊 +</button>
        </div>`
      : `<div class="mh-vol-row" data-mh-role="vol-wrap">
          <button type="button" class="mh-btn mh-icon-btn" data-mh-act="volMute" data-mh-role="mute-btn" aria-label="${safeEsc(safeT('mh.mute'))}">${safeIc('volume', 16)}</button>
          <input type="range" min="0" max="100" value="30" class="mh-vol-slider" data-mh-role="vol-slider" aria-label="Volume">
          <span class="mh-vol-val" data-mh-role="vol-val">30%</span>
        </div>`;

    const tabsHtml = `<div class="mh-tabs" data-mh-role="tabs">
      ${providers.map(pid => `<button type="button" class="mh-tab ${pid === inst.activeTab ? 'on' : ''}" data-mh-act="selectTab" data-mh-tab="${safeEsc(pid)}">${safeEsc(safeT('mh.tab.' + pid))}</button>`).join('')}
    </div>`;

    inst.el.innerHTML = `
      <div class="mh-hdr">
        <div class="mh-title-wrap">
          ${safeIc('music', 18)}
          <span class="mh-title">${safeEsc(title)}</span>
        </div>
        <div class="mh-hdr-actions">
          ${uiCfg.searchStyle === 'icon_only' ? `<button type="button" class="mh-btn mh-icon-btn ${inst.searchOpen ? 'on' : ''}" data-mh-act="toggleSearchOpen" title="${safeEsc(safeT('mh.search_toggle'))}" aria-label="${safeEsc(safeT('mh.search_toggle'))}">${safeIc('search', 16)}</button>` : ''}
          <button type="button" class="mh-btn ${inst.multiroomOpen ? 'on' : ''}" data-mh-act="toggleMultiroom" data-mh-role="mr-btn" hidden>
            <span>🔊 ${safeEsc(safeT('mh.multiroom'))}</span>
            <span class="mh-badge" data-mh-role="mr-badge" hidden>+0</span>
          </button>
        </div>
      </div>
      ${searchPos === 'header' ? searchBarHtml : ''}
      ${playerSelHtml}
      <div class="mh-now-playing" data-mh-role="now-playing">
        <div class="mh-np-bg" data-mh-role="np-bg"></div>
        <div class="mh-np-top">
          ${uiCfg.showCoverArt !== false ? `<div class="mh-cover" data-mh-role="cover">${safeIc('music', 24)}</div>` : ''}
          <div class="mh-np-meta">
            <div class="mh-np-title" data-mh-role="np-title">${safeEsc(safeT('mh.nothing_playing'))}</div>
            <div class="mh-np-artist" data-mh-role="np-artist"></div>
            <div class="mh-np-state" data-mh-role="np-state"><i></i><span data-mh-role="np-state-txt"></span></div>
          </div>
          <div class="mh-transport">
            <button type="button" class="mh-btn mh-icon-btn" data-mh-act="transport" data-mh-svc="media_previous_track" title="${safeEsc(safeT('mh.prev'))}" aria-label="${safeEsc(safeT('mh.prev'))}">${safeIc('prev', 16)}</button>
            <button type="button" class="mh-btn mh-btn-pri mh-icon-btn" data-mh-act="transport" data-mh-svc="media_play_pause" data-mh-role="play-btn" title="${safeEsc(safeT('mh.play_pause'))}" aria-label="${safeEsc(safeT('mh.play_pause'))}">${safeIc('play', 16)}</button>
            <button type="button" class="mh-btn mh-icon-btn" data-mh-act="transport" data-mh-svc="media_next_track" title="${safeEsc(safeT('mh.next'))}" aria-label="${safeEsc(safeT('mh.next'))}">${safeIc('next', 16)}</button>
            <button type="button" class="mh-btn mh-icon-btn mh-queue-btn ${inst.queueOpen ? 'on' : ''}" data-mh-act="toggleQueue" data-mh-role="queue-btn" title="${safeEsc(safeT('mh.queue'))}" aria-label="${safeEsc(safeT('mh.queue'))}">
              ${safeIc('queue', 16)}
              <span class="mh-q-dot" data-mh-role="queue-badge" hidden>0</span>
            </button>
          </div>
        </div>
        <div class="mh-np-progress" data-mh-role="np-progress" hidden>
          <div class="mh-prog-track"><div class="mh-prog-fill" data-mh-role="np-prog-fill" style="width:0%"></div></div>
          <div class="mh-prog-times"><span data-mh-role="np-pos">0:00</span><span data-mh-role="np-dur">0:00</span></div>
        </div>
        ${volHtml}
      </div>
      <div data-mh-role="queue-slot">${buildQueuePanelHtml(inst, mhCfg)}</div>
      <div data-mh-role="multiroom-slot">${buildMultiroomPanelHtml(inst, mhCfg)}</div>
      ${tabsHtml}
      ${searchPos === 'below_tabs' ? searchBarHtml : ''}
      <div class="mh-content" data-mh-role="content">${buildContentHtml(inst, mhCfg)}</div>
      ${searchPos === 'footer' ? searchBarHtml : ''}
    `;

    bindInstanceEvents(inst);
    bindDynamicSwipeAreas(inst);
    updateInstanceDynamicState(inst, mhCfg);
  }

  /* Surgical DOM-only state updates (never touches search input or wipes tabs) */
  function updateInstanceDynamicState(inst, mhCfg) {
    if (!inst || !inst.el) return;
    ensureSelections(inst, mhCfg);
    const adapters = root.MediaHubAdapters;
    const hass = safeGetHass();
    const st = safeState(inst.selectedPlayer);
    const attrs = (st && st.attributes) || {};
    const stateStr = (st && st.state) || 'unavailable';

    // 1. Player pills / select sync
    const pillsWrap = inst.el.querySelector('[data-mh-role="player-pills"]');
    if (pillsWrap) {
      pillsWrap.querySelectorAll('.mh-player-pill').forEach(btn => {
        const ent = btn.dataset.mhEntity;
        const pSt = safeState(ent);
        btn.classList.toggle('on', ent === inst.selectedPlayer);
        btn.classList.toggle('playing', !!(pSt && pSt.state === 'playing'));
      });
    }
    const selEl = inst.el.querySelector('[data-mh-role="player-select"]');
    if (selEl && selEl.value !== inst.selectedPlayer) {
      selEl.value = inst.selectedPlayer;
    }

    // 2. Now playing meta, cover & transport state
    const titleEl = inst.el.querySelector('[data-mh-role="np-title"]');
    const artistEl = inst.el.querySelector('[data-mh-role="np-artist"]');
    const stateEl = inst.el.querySelector('[data-mh-role="np-state"]');
    const stateTxtEl = inst.el.querySelector('[data-mh-role="np-state-txt"]');
    const coverEl = inst.el.querySelector('[data-mh-role="cover"]');
    const bgEl = inst.el.querySelector('[data-mh-role="np-bg"]');
    const playBtn = inst.el.querySelector('[data-mh-role="play-btn"]');

    const nextTitle = attrs.media_title || safeT('mh.nothing_playing');
    const nextArtist = attrs.media_artist || attrs.media_album_name || attrs.media_channel || attrs.app_name || (attrs.media_title ? safeT('mh.unknown_artist') : '');
    if (titleEl && titleEl.textContent !== nextTitle) titleEl.textContent = nextTitle;
    if (artistEl && artistEl.textContent !== nextArtist) artistEl.textContent = nextArtist;

    if (stateEl && stateTxtEl) {
      const nextCls = `mh-np-state ${stateStr === 'playing' ? 'playing' : stateStr === 'paused' ? 'paused' : ''}`.trim();
      if (stateEl.className !== nextCls) stateEl.className = nextCls;
      const lbl = typeof stateLabel === 'function' ? stateLabel(stateStr) : stateStr;
      if (stateTxtEl.textContent !== lbl) stateTxtEl.textContent = lbl;
    }

    const pic = safeImgUrl(attrs.entity_picture);
    if (coverEl) {
      if (coverEl.dataset.pic !== pic) {
        coverEl.dataset.pic = pic;
        coverEl.innerHTML = pic ? `<img src="${safeEsc(pic)}" alt="">` : safeIc('music', 24);
      }
    }
    if (bgEl && bgEl.dataset.pic !== pic) {
      bgEl.dataset.pic = pic;
      if (bgEl.style) bgEl.style.backgroundImage = pic ? `url("${pic.replace(/"/g, '%22')}")` : 'none';
    }

    const progWrap = inst.el.querySelector('[data-mh-role="np-progress"]');
    const durSec = Number(attrs.media_duration);
    if (progWrap) {
      if (Number.isFinite(durSec) && durSec > 0) {
        let posSec = Math.max(0, Number(attrs.media_position) || 0);
        if (stateStr === 'playing' && attrs.media_position_updated_at) {
          const updMs = Date.parse(attrs.media_position_updated_at);
          if (Number.isFinite(updMs)) posSec += Math.max(0, (Date.now() - updMs) / 1000);
        }
        posSec = Math.min(durSec, posSec);
        progWrap.hidden = false;
        const fillEl = inst.el.querySelector('[data-mh-role="np-prog-fill"]');
        const posEl = inst.el.querySelector('[data-mh-role="np-pos"]');
        const durEl = inst.el.querySelector('[data-mh-role="np-dur"]');
        if (fillEl && fillEl.style) fillEl.style.width = `${Math.min(100, (posSec / durSec) * 100).toFixed(1)}%`;
        if (posEl) posEl.textContent = fmtMediaSec(posSec);
        if (durEl) durEl.textContent = fmtMediaSec(durSec);
      } else {
        progWrap.hidden = true;
      }
    }

    if (playBtn) {
      const wantPlayingIcon = stateStr === 'playing' ? 'pause' : 'play';
      if (playBtn.dataset.icon !== wantPlayingIcon) {
        playBtn.dataset.icon = wantPlayingIcon;
        playBtn.innerHTML = safeIc(wantPlayingIcon, 16);
      }
    }

    // 3. Volume & Mute (never overwrite slider while actively dragged)
    const volPct = attrs.volume_level != null ? Math.round(Number(attrs.volume_level) * 100) : 0;
    const isMuted = !!attrs.is_volume_muted;
    const slider = inst.el.querySelector('[data-mh-role="vol-slider"]');
    const volVal = inst.el.querySelector('[data-mh-role="vol-val"]');
    const muteBtn = inst.el.querySelector('[data-mh-role="mute-btn"]');
    if (slider && inst.draggingVolEntity !== inst.selectedPlayer) {
      if (Number(slider.value) !== volPct) slider.value = String(volPct);
      if (slider.style && typeof slider.style.setProperty === 'function') slider.style.setProperty('--mh-vol-pct', `${volPct}%`);
    }
    if (volVal && inst.draggingVolEntity !== inst.selectedPlayer) {
      const txt = `${volPct}%`;
      if (volVal.textContent !== txt) volVal.textContent = txt;
    }
    if (muteBtn) {
      const wantMuteIc = isMuted ? 'volumeMute' : 'volume';
      muteBtn.classList.toggle('on', isMuted);
      if (muteBtn.dataset.icon !== wantMuteIc) {
        muteBtn.dataset.icon = wantMuteIc;
        muteBtn.innerHTML = safeIc(wantMuteIc, 16);
      }
    }

    // 4. Multiroom button visibility (>= 2 groupable players) & +N badge
    const mrBtn = inst.el.querySelector('[data-mh-role="mr-btn"]');
    const mrBadge = inst.el.querySelector('[data-mh-role="mr-badge"]');
    const groupable = adapters ? adapters.getGroupablePlayers(hass, mhCfg) : [];
    const mrAllowed = (!mhCfg.multiroom || mhCfg.multiroom.enabled !== false) && groupable.length >= 2;
    if (mrBtn) {
      mrBtn.hidden = !mrAllowed;
      mrBtn.classList.toggle('on', inst.multiroomOpen);
    }
    const members = adapters ? adapters.getGroupMembers(st) : [];
    const extraCount = Math.max(0, members.length - 1);
    if (mrBadge) {
      mrBadge.hidden = !mrAllowed || extraCount <= 0;
      const badgeTxt = `+${extraCount}`;
      if (mrBadge.textContent !== badgeTxt) mrBadge.textContent = badgeTxt;
    }

    // 5. Update open multiroom panel rows surgically
    const mrSlot = inst.el.querySelector('[data-mh-role="multiroom-slot"]');
    if (mrSlot) {
      if (!mrAllowed || !inst.multiroomOpen) {
        if (mrSlot.innerHTML !== '') mrSlot.innerHTML = '';
      } else {
        const panel = mrSlot.querySelector('[data-mh-role="multiroom-panel"]');
        if (!panel) {
          mrSlot.innerHTML = buildMultiroomPanelHtml(inst, mhCfg);
        } else {
          const mrRows = Array.from(panel.querySelectorAll('[data-mh-mr-entity]'));
          groupable.forEach(p => {
            const row = mrRows.find(r => r.dataset && r.dataset.mhMrEntity === p.entity);
            if (!row) return;
            const pSt = safeState(p.entity);
            const isMaster = p.entity === inst.selectedPlayer;
            const isJoined = isMaster || members.includes(p.entity);
            const btn = row.querySelector('.mh-mr-toggle');
            if (btn) {
              btn.classList.toggle('on', isJoined);
              btn.disabled = isMaster;
              const txt = isMaster ? `★ ${safeT('mh.multiroom_master')}` : (isJoined ? `✓ ${safeT('mh.multiroom_joined')}` : `+ ${safeT('mh.multiroom_join')}`);
              if (btn.textContent.trim() !== txt) btn.textContent = txt;
            }
            const pVol = pSt && pSt.attributes && pSt.attributes.volume_level != null
              ? Math.round(Number(pSt.attributes.volume_level) * 100)
              : 0;
            const mrSlider = row.querySelector('.mh-mr-vol');
            const mrPct = row.querySelector('[data-mh-role="mr-pct"]');
            if (mrSlider && inst.draggingVolEntity !== p.entity && Number(mrSlider.value) !== pVol) {
              mrSlider.value = String(pVol);
            }
            if (mrPct && inst.draggingVolEntity !== p.entity && mrPct.textContent !== `${pVol}%`) {
              mrPct.textContent = `${pVol}%`;
            }
          });
        }
      }
    }

    // 6. Queue button badge, drawer & auto-advance on track finish
    refreshQueueUi(inst, mhCfg);

    const selEnt = inst.selectedPlayer;
    if (selEnt) {
      const prevSt = inst.lastPlayerStates[selEnt];
      inst.lastPlayerStates[selEnt] = stateStr;
      if (
        prevSt === 'playing' &&
        (stateStr === 'idle' || stateStr === 'off') &&
        (Date.now() - (inst.manualActionAt || 0)) > 3000
      ) {
        const q = getPlayerQueue(selEnt);
        if (q.length) {
          const nextItem = q[0];
          removeQueueItem(selEnt, 0);
          inst.manualActionAt = Date.now();
          refreshQueueUi(inst, mhCfg);
          playItemAndNotify(inst, nextItem);
        }
      }
    }
  }

  function refreshQueueUi(inst, mhCfg) {
    if (!inst || !inst.el) return;
    const localQ = getPlayerQueue(inst.selectedPlayer);
    const totalQ = localQ.length + (inst.remoteQueue ? inst.remoteQueue.length : 0);
    const qBtn = inst.el.querySelector('[data-mh-role="queue-btn"]');
    const qBadge = inst.el.querySelector('[data-mh-role="queue-badge"]');
    if (qBtn) qBtn.classList.toggle('on', !!inst.queueOpen);
    if (qBadge) {
      qBadge.hidden = totalQ <= 0;
      if (qBadge.textContent !== String(totalQ)) qBadge.textContent = String(totalQ);
    }
    const qSlot = inst.el.querySelector('[data-mh-role="queue-slot"]');
    if (qSlot) {
      if (!inst.queueOpen) {
        if (qSlot.innerHTML !== '') qSlot.innerHTML = '';
      } else {
        qSlot.innerHTML = buildQueuePanelHtml(inst, mhCfg);
      }
    }
  }

  async function syncRemoteQueue(inst, mhCfg) {
    if (!inst || !root.MediaHubAdapters || !root.MediaHubAdapters.fetchPlayerQueue) return;
    inst.queueLoading = true;
    refreshQueueUi(inst, mhCfg);
    try {
      const res = await root.MediaHubAdapters.fetchPlayerQueue(safeGetHass(), inst.selectedPlayer, mhCfg);
      inst.remoteQueueSupported = !!(res && res.supported);
      inst.remoteQueueSource = (res && res.source) || '';
      inst.remoteQueue = (res && Array.isArray(res.items)) ? res.items : [];
    } catch (_) {
      inst.remoteQueue = [];
    }
    inst.queueLoading = false;
    refreshQueueUi(inst, mhCfg);
  }

  function refreshContentAndSearch(inst, mhCfg, preserveInputFocus = true) {
    if (!inst || !inst.el) return;
    const uiCfg = mhCfg.ui || {};
    const activeEl = preserveInputFocus && typeof document !== 'undefined' ? document.activeElement : null;
    const wasInput = activeEl && inst.el.contains(activeEl) && activeEl.dataset && activeEl.dataset.mhRole === 'search-input';
    const selStart = wasInput ? activeEl.selectionStart : null;
    const selEnd = wasInput ? activeEl.selectionEnd : null;

    const searchWrap = inst.el.querySelector('[data-mh-role="search-wrap"]');
    const searchParent = searchWrap ? searchWrap.parentElement : null;
    if (searchWrap && searchParent) {
      const tmp = document.createElement('div');
      tmp.innerHTML = buildSearchBarHtml(inst, mhCfg, uiCfg);
      const nextWrap = tmp.firstElementChild;
      if (nextWrap) searchWrap.replaceWith(nextWrap);
      else searchWrap.remove();
    } else if (uiCfg.searchStyle === 'icon_only' && inst.searchOpen) {
      buildFullStructure(inst, mhCfg);
    }

    const tabsEl = inst.el.querySelector('[data-mh-role="tabs"]');
    if (tabsEl) {
      tabsEl.querySelectorAll('.mh-tab').forEach(btn => {
        btn.classList.toggle('on', btn.dataset.mhTab === inst.activeTab);
      });
    }

    const contentEl = inst.el.querySelector('[data-mh-role="content"]');
    if (contentEl) contentEl.innerHTML = buildContentHtml(inst, mhCfg);

    const toggleSearchBtn = inst.el.querySelector('[data-mh-act="toggleSearchOpen"]');
    if (toggleSearchBtn) toggleSearchBtn.classList.toggle('on', inst.searchOpen);

    if (wasInput) {
      const nextInp = inst.el.querySelector('[data-mh-role="search-input"]');
      if (nextInp && typeof nextInp.focus === 'function') {
        nextInp.focus();
        if (selStart != null && typeof nextInp.setSelectionRange === 'function') {
          try { nextInp.setSelectionRange(selStart, selEnd); } catch (_) {}
        }
      }
    }
  }

  async function executeSearch(inst) {
    const mhCfg = getMhConfig();
    const q = String(inst.searchQuery || '').trim();
    const seq = (inst.searchSeq = (inst.searchSeq || 0) + 1);
    if (!q) {
      inst.hasSearched = false;
      inst.searchResults = [];
      inst.searchErrors = [];
      inst.searchLoading = false;
      refreshContentAndSearch(inst, mhCfg, true);
      return;
    }

    inst.searchLoading = true;
    inst.hasSearched = true;
    inst.searchErrors = [];
    refreshContentAndSearch(inst, mhCfg, true);

    const adapters = root.MediaHubAdapters;
    if (!adapters) {
      inst.searchLoading = false;
      refreshContentAndSearch(inst, mhCfg, true);
      return;
    }
    const origTypes = (mhCfg.search && mhCfg.search.mediaTypes) || ['track', 'artist', 'album', 'radio'];
    const scopedCfg = Object.assign({}, mhCfg, {
      search: Object.assign({}, mhCfg.search || {}, {
        mediaTypes: inst.activeMediaTypes && inst.activeMediaTypes.length ? inst.activeMediaTypes : origTypes
      })
    });
    try {
      const res = await adapters.search({
        hass: safeGetHass(),
        mhCfg: scopedCfg,
        tabId: inst.activeTab,
        query: q,
        targetPlayer: inst.selectedPlayer
      });
      if (seq !== inst.searchSeq) return;
      inst.searchResults = (res && res.items) || [];
      inst.searchErrors = (res && res.errors) || [];
    } catch (err) {
      if (seq !== inst.searchSeq) return;
      inst.searchResults = [];
      inst.searchErrors = [{ provider: inst.activeTab, reasonKey: 'mh.err_search_failed', detail: String(err && err.message || err) }];
    } finally {
      if (seq === inst.searchSeq) {
        inst.searchLoading = false;
        refreshContentAndSearch(inst, mhCfg, true);
      }
    }
  }

  async function playItemAndNotify(inst, item) {
    const mhCfg = getMhConfig();
    const adapters = root.MediaHubAdapters;
    if (!adapters || !item) return;
    if (!inst.selectedPlayer && !(mhCfg.providers && mhCfg.providers.ytube_free && mhCfg.providers.ytube_free.entity)) {
      if (typeof toast === 'function') toast(safeT('mh.err_no_player'));
      return;
    }
    try {
      const res = await adapters.play({
        hass: safeGetHass(),
        mhCfg,
        targetPlayer: inst.selectedPlayer,
        item
      });
      if (res && !res.ok && res.reasonKey) {
        if (typeof toast === 'function') toast(safeT(res.reasonKey));
      } else if (typeof toast === 'function') {
        toast(safeT('mh.toast_playing', { title: item.title || item.name || '' }));
      }
      if (typeof tick === 'function') setTimeout(() => tick(true), 500);
    } catch (err) {
      if (typeof toast === 'function') toast(String(err && err.message || err));
    }
  }

  function attachSwipe(el, shouldHandle, onSwipeLeft, onSwipeRight) {
    if (!el || el._mhSwipeBound) return;
    el._mhSwipeBound = true;
    let startX = 0, startY = 0, tracking = false, pointerId = null;

    const start = (x, y, pid, target) => {
      if (target && target.closest && target.closest('input,select,textarea,button[type="range"],.mh-vol-slider,.mh-mr-vol')) return;
      if (!shouldHandle()) return;
      tracking = true;
      startX = x;
      startY = y;
      pointerId = pid;
    };
    const end = (x, y, pid) => {
      if (!tracking) return;
      if (pid != null && pointerId != null && pid !== pointerId) return;
      tracking = false;
      const dx = x - startX;
      const dy = y - startY;
      if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy) * 1.35) {
        if (dx < 0) onSwipeLeft();
        else onSwipeRight();
      }
    };

    el.addEventListener('pointerdown', ev => {
      if (ev.pointerType === 'mouse' && ev.button !== 0) return;
      start(ev.clientX, ev.clientY, ev.pointerId, ev.target);
    }, { passive: true });
    el.addEventListener('pointerup', ev => end(ev.clientX, ev.clientY, ev.pointerId), { passive: true });
    el.addEventListener('pointercancel', () => { tracking = false; }, { passive: true });
  }

  function bindInstanceEvents(inst) {
    const el = inst.el;
    if (!el || el._mhEventsBound) return;
    el._mhEventsBound = true;

    el.addEventListener('click', async ev => {
      const btn = ev.target && ev.target.closest && ev.target.closest('[data-mh-act]');
      if (!btn || !el.contains(btn)) return;
      const act = btn.dataset.mhAct;
      const mhCfg = getMhConfig();
      const adapters = root.MediaHubAdapters;
      const hass = safeGetHass();

      if (act === 'selectPlayer') {
        inst.selectedPlayer = btn.dataset.mhEntity || '';
        updateInstanceDynamicState(inst, mhCfg);
        return;
      }
      if (act === 'selectTab') {
        const nextTab = btn.dataset.mhTab;
        if (nextTab && nextTab !== inst.activeTab) {
          inst.activeTab = nextTab;
          if (inst.searchQuery && (!mhCfg.search || mhCfg.search.scope !== 'combined')) {
            await executeSearch(inst);
          } else {
            refreshContentAndSearch(inst, mhCfg, false);
          }
        }
        return;
      }
      if (act === 'toggleSearchOpen') {
        inst.searchOpen = !inst.searchOpen;
        buildFullStructure(inst, mhCfg);
        if (inst.searchOpen) {
          const inp = el.querySelector('[data-mh-role="search-input"]');
          if (inp && typeof inp.focus === 'function') inp.focus();
        }
        return;
      }
      if (act === 'runSearch') {
        const inp = el.querySelector('[data-mh-role="search-input"]');
        if (inp && typeof inp.value === 'string') inst.searchQuery = inp.value;
        await executeSearch(inst);
        return;
      }
      if (act === 'clearSearch') {
        inst.searchQuery = '';
        inst.hasSearched = false;
        inst.searchResults = [];
        inst.searchErrors = [];
        refreshContentAndSearch(inst, mhCfg, true);
        return;
      }
      if (act === 'playDirectUrl') {
        await playItemAndNotify(inst, { id: inst.searchQuery.trim(), uri: inst.searchQuery.trim(), title: inst.searchQuery.trim(), provider: 'direct_url' });
        return;
      }
      if (act === 'toggleMediaType') {
        const tp = btn.dataset.mhType;
        if (!tp) return;
        const cur = inst.activeMediaTypes || [];
        if (cur.includes(tp)) {
          if (cur.length > 1) inst.activeMediaTypes = cur.filter(x => x !== tp);
        } else {
          inst.activeMediaTypes = [...cur, tp];
        }
        refreshContentAndSearch(inst, mhCfg, true);
        if (inst.hasSearched && inst.searchQuery) await executeSearch(inst);
        return;
      }
      if (act === 'playRadioFav') {
        const fav = (mhCfg.radioFavorites || [])[Number(btn.dataset.mhIdx)];
        if (fav) {
          inst.manualActionAt = Date.now();
          await playItemAndNotify(inst, { id: fav.contentId, contentId: fav.contentId, title: fav.name, icon: fav.icon || '📻', provider: 'radio' });
        }
        return;
      }
      if (act === 'queueRadioFav') {
        const fav = (mhCfg.radioFavorites || [])[Number(btn.dataset.mhIdx)];
        if (fav && inst.selectedPlayer) {
          const item = { id: fav.contentId, uri: fav.contentId, contentId: fav.contentId, title: fav.name, subtitle: 'Radio', icon: fav.icon || '📻', type: 'radio', contentType: 'music', provider: 'radio' };
          addToPlayerQueue(inst.selectedPlayer, item);
          refreshQueueUi(inst, mhCfg);
          if (typeof toast === 'function') toast(safeT('mh.queue_added', { title: item.title }));
        }
        return;
      }
      if (act === 'playResult' || act === 'playBrowse') {
        const list = act === 'playResult' ? (inst.searchResults || []) : ((inst.browseCache[getBrowseKey(inst)] || {}).items || []);
        const item = list[Number(btn.dataset.mhIdx)];
        if (item) {
          inst.manualActionAt = Date.now();
          await playItemAndNotify(inst, item);
        }
        return;
      }
      if (act === 'queueResult' || act === 'queueBrowse') {
        const list = act === 'queueResult' ? (inst.searchResults || []) : ((inst.browseCache[getBrowseKey(inst)] || {}).items || []);
        const item = list[Number(btn.dataset.mhIdx)];
        if (item) {
          if (!inst.selectedPlayer) {
            if (typeof toast === 'function') toast(safeT('mh.err_no_player'));
            return;
          }
          addToPlayerQueue(inst.selectedPlayer, item);
          if (adapters && typeof adapters.enqueueItem === 'function') {
            adapters.enqueueItem(hass, inst.selectedPlayer, item, mhCfg).catch(() => {});
          }
          refreshQueueUi(inst, mhCfg);
          if (typeof toast === 'function') toast(safeT('mh.queue_added', { title: item.title || item.name || '' }));
        }
        return;
      }
      if (act === 'setRadioGenre') {
        inst.radioGenre = btn.dataset.mhGenre || 'favs';
        refreshContentAndSearch(inst, mhCfg, false);
        return;
      }
      if (act === 'setArchiveGenre') {
        inst.archiveGenre = btn.dataset.mhGenre || 'jazz';
        refreshContentAndSearch(inst, mhCfg, false);
        return;
      }
      if (act === 'toggleQueue') {
        inst.queueOpen = !inst.queueOpen;
        refreshQueueUi(inst, mhCfg);
        if (inst.queueOpen) syncRemoteQueue(inst, mhCfg);
        return;
      }
      if (act === 'refreshRemoteQueue') {
        await syncRemoteQueue(inst, mhCfg);
        return;
      }
      if (act === 'queuePlay') {
        const idx = Number(btn.dataset.mhIdx);
        const q = getPlayerQueue(inst.selectedPlayer);
        const item = q[idx];
        if (item) {
          removeQueueItem(inst.selectedPlayer, idx);
          inst.manualActionAt = Date.now();
          refreshQueueUi(inst, mhCfg);
          await playItemAndNotify(inst, item);
        }
        return;
      }
      if (act === 'queueMove') {
        moveQueueItem(inst.selectedPlayer, Number(btn.dataset.mhIdx), Number(btn.dataset.mhDir) || 0);
        refreshQueueUi(inst, mhCfg);
        return;
      }
      if (act === 'queueRemove') {
        removeQueueItem(inst.selectedPlayer, Number(btn.dataset.mhIdx));
        refreshQueueUi(inst, mhCfg);
        return;
      }
      if (act === 'queueClear') {
        clearPlayerQueue(inst.selectedPlayer);
        refreshQueueUi(inst, mhCfg);
        return;
      }
      if (act === 'transport') {
        const svc = btn.dataset.mhSvc;
        inst.manualActionAt = Date.now();
        if (svc === 'media_next_track' && inst.selectedPlayer) {
          const q = getPlayerQueue(inst.selectedPlayer);
          if (q.length) {
            const nextItem = q[0];
            removeQueueItem(inst.selectedPlayer, 0);
            refreshQueueUi(inst, mhCfg);
            await playItemAndNotify(inst, nextItem);
            return;
          }
        }
        if (svc && inst.selectedPlayer) {
          safeCall('media_player', svc, { entity_id: inst.selectedPlayer });
        }
        return;
      }
      if (act === 'volMute') {
        if (!inst.selectedPlayer || !adapters) return;
        const st = safeState(inst.selectedPlayer);
        const curMute = !!(st && st.attributes && st.attributes.is_volume_muted);
        await adapters.toggleMute(hass, inst.selectedPlayer, !curMute);
        if (typeof tick === 'function') setTimeout(() => tick(true), 300);
        return;
      }
      if (act === 'volStep') {
        if (!inst.selectedPlayer || !adapters) return;
        const delta = parseFloat(btn.dataset.mhDelta) || 0;
        const st = safeState(inst.selectedPlayer);
        const curVol = st && st.attributes && st.attributes.volume_level != null ? Number(st.attributes.volume_level) : 0.3;
        await adapters.setVolume(hass, inst.selectedPlayer, Math.min(1, Math.max(0, curVol + delta)));
        if (typeof tick === 'function') setTimeout(() => tick(true), 300);
        return;
      }
      if (act === 'toggleMultiroom') {
        inst.multiroomOpen = !inst.multiroomOpen;
        updateInstanceDynamicState(inst, mhCfg);
        return;
      }
      if (act === 'mrToggleJoin') {
        if (!adapters || !inst.selectedPlayer) return;
        const targetEnt = btn.dataset.mhEntity;
        if (!targetEnt || targetEnt === inst.selectedPlayer) return;
        const masterSt = safeState(inst.selectedPlayer);
        const members = adapters.getGroupMembers(masterSt);
        if (members.includes(targetEnt)) {
          await adapters.unjoinPlayer(hass, targetEnt);
        } else {
          const nextMembers = Array.from(new Set([...members.filter(m => m !== inst.selectedPlayer), targetEnt]));
          await adapters.joinPlayers(hass, inst.selectedPlayer, nextMembers);
        }
        if (typeof tick === 'function') setTimeout(() => tick(true), 450);
        return;
      }
      if (act === 'mrPreset') {
        if (!adapters) return;
        const preset = (mhCfg.multiroom && mhCfg.multiroom.presets || [])[Number(btn.dataset.mhIdx)];
        if (preset) {
          await adapters.applyPreset(hass, preset);
          if (preset.master) inst.selectedPlayer = preset.master;
          if (typeof toast === 'function') toast(safeT('mh.toast_preset', { name: preset.name || '' }));
          if (typeof tick === 'function') setTimeout(() => tick(true), 450);
        }
      }
    });

    el.addEventListener('change', ev => {
      const target = ev.target;
      if (!target || !target.dataset) return;
      if (target.dataset.mhRole === 'player-select') {
        inst.selectedPlayer = target.value;
        updateInstanceDynamicState(inst, getMhConfig());
      }
    });

    el.addEventListener('input', ev => {
      const target = ev.target;
      if (!target || !target.dataset) return;
      if (target.dataset.mhRole === 'search-input') {
        const hadUrl = root.MediaHubAdapters && root.MediaHubAdapters.isDirectUrl(inst.searchQuery);
        const hadText = !!inst.searchQuery;
        inst.searchQuery = target.value;
        const nowUrl = root.MediaHubAdapters && root.MediaHubAdapters.isDirectUrl(inst.searchQuery);
        const nowText = !!inst.searchQuery;
        // Only re-render search bar controls when clear/URL-action state flips
        if (hadUrl !== nowUrl || hadText !== nowText) {
          refreshContentAndSearch(inst, getMhConfig(), true);
        }
        return;
      }
      if (target.dataset.mhRole === 'vol-slider' || target.dataset.mhAct === 'mrVolSlider') {
        const ent = target.dataset.mhAct === 'mrVolSlider' ? target.dataset.mhEntity : inst.selectedPlayer;
        if (!ent || !root.MediaHubAdapters) return;
        inst.draggingVolEntity = ent;
        const pct = Number(target.value) || 0;
        if (target.style && typeof target.style.setProperty === 'function') target.style.setProperty('--mh-vol-pct', `${pct}%`);
        const row = target.closest('.mh-vol-row, .mh-mr-row');
        const valEl = row && row.querySelector('.mh-vol-val, [data-mh-role="mr-pct"]');
        if (valEl) valEl.textContent = `${pct}%`;
        clearTimeout(inst.volTimer);
        inst.volTimer = setTimeout(async () => {
          await root.MediaHubAdapters.setVolume(safeGetHass(), ent, pct / 100);
          inst.draggingVolEntity = null;
        }, 140);
      }
    });

    el.addEventListener('keydown', async ev => {
      const target = ev.target;
      if (ev.key === 'Enter' && target && target.dataset && target.dataset.mhRole === 'search-input') {
        ev.preventDefault();
        inst.searchQuery = target.value;
        if (root.MediaHubAdapters && root.MediaHubAdapters.isDirectUrl(inst.searchQuery)) {
          await playItemAndNotify(inst, { id: inst.searchQuery.trim(), uri: inst.searchQuery.trim(), title: inst.searchQuery.trim(), provider: 'direct_url' });
        } else {
          await executeSearch(inst);
        }
      }
    });
  }

  function bindDynamicSwipeAreas(inst) {
    const el = inst.el;
    if (!el) return;
    const contentEl = el.querySelector('[data-mh-role="content"]');
    const npEl = el.querySelector('[data-mh-role="now-playing"]');

    const cycleTab = (dir) => {
      const mhCfg = getMhConfig();
      const providers = root.MediaHubAdapters ? root.MediaHubAdapters.getActiveProviders(mhCfg) : ['radio'];
      if (providers.length < 2) return;
      const idx = providers.indexOf(inst.activeTab);
      const nextIdx = (idx + dir + providers.length) % providers.length;
      inst.activeTab = providers[nextIdx];
      if (inst.searchQuery && (!mhCfg.search || mhCfg.search.scope !== 'combined')) {
        executeSearch(inst);
      } else {
        refreshContentAndSearch(inst, mhCfg, false);
      }
    };

    attachSwipe(
      contentEl,
      () => { const uiCfg = getMhConfig().ui || {}; return uiCfg.tabSwipe !== false; },
      () => cycleTab(1),
      () => cycleTab(-1)
    );

    attachSwipe(
      npEl,
      () => { const uiCfg = getMhConfig().ui || {}; return !!uiCfg.trackSwipe; },
      () => { if (inst.selectedPlayer) safeCall('media_player', 'media_next_track', { entity_id: inst.selectedPlayer }); },
      () => { if (inst.selectedPlayer) safeCall('media_player', 'media_previous_track', { entity_id: inst.selectedPlayer }); }
    );
  }

  function detachAll() {
    if (typeof document === 'undefined') return;
    pendingFocusState = null;
    const active = document.activeElement;
    document.querySelectorAll('[data-mh-mount]').forEach(slot => {
      const key = slot.dataset.mhMount;
      const rootEl = slot.querySelector('.mh-root');
      if (key && rootEl) {
        if (active && rootEl.contains(active) && active.dataset && active.dataset.mhRole) {
          pendingFocusState = {
            key,
            role: active.dataset.mhRole,
            selStart: active.selectionStart,
            selEnd: active.selectionEnd
          };
        }
        detachedRoots.set(key, rootEl);
        rootEl.remove();
      }
    });
  }

  function mountAll() {
    if (typeof document === 'undefined') return;
    const mhCfg = getMhConfig();
    const lang = typeof getLang === 'function' ? getLang() : 'de';

    document.querySelectorAll('[data-mh-mount]').forEach(slot => {
      const key = slot.dataset.mhMount;
      const title = slot.dataset.mhTitle || mhCfg.title || safeT('mh.title');
      const inst = getOrCreateInstance(key, title);
      const sig = JSON.stringify({ mhCfg, title, lang });

      const detached = detachedRoots.get(key);
      if (detached) detachedRoots.delete(key);
      if (detached && !inst.el) inst.el = detached;

      const needsCreate = !inst.el;
      if (needsCreate) {
        inst.el = document.createElement('div');
      }
      if (inst.el.parentElement !== slot) {
        slot.innerHTML = '';
        slot.appendChild(inst.el);
      }
      if (needsCreate || inst.cfgSig !== sig) {
        inst.cfgSig = sig;
        buildFullStructure(inst, mhCfg);
      } else {
        updateInstanceDynamicState(inst, mhCfg);
      }

      if (pendingFocusState && pendingFocusState.key === key) {
        const target = inst.el.querySelector(`[data-mh-role="${pendingFocusState.role}"]`);
        if (target && typeof target.focus === 'function') {
          target.focus();
          if (pendingFocusState.selStart != null && typeof target.setSelectionRange === 'function') {
            try { target.setSelectionRange(pendingFocusState.selStart, pendingFocusState.selEnd); } catch (_) {}
          }
        }
      }
    });
    pendingFocusState = null;
    detachedRoots.clear();
  }

  function updateAll() {
    if (typeof document === 'undefined') return;
    const mhCfg = getMhConfig();
    document.querySelectorAll('[data-mh-mount]').forEach(slot => {
      const key = slot.dataset.mhMount;
      const inst = instances.get(key);
      if (inst && inst.el && slot.contains(inst.el)) {
        updateInstanceDynamicState(inst, mhCfg);
      } else {
        mountAll();
      }
    });
  }

  function renderHtml(customTitle = null, forceShow = false, widgetKey = 'dash_media_hub') {
    const mhCfg = getMhConfig();
    if (!forceShow && mhCfg.show === false) return '';
    const title = customTitle || mhCfg.title || safeT('mh.title');
    return `<section class="card mh-card" data-mh-mount="${safeEsc(widgetKey)}" data-mh-title="${safeEsc(title)}"></section>`;
  }

  root.MediaHubWidget = {
    renderHtml,
    mountAll,
    detachAll,
    updateAll,
    getInstance: key => instances.get(key) || null
  };
  root.mediaHubCard = renderHtml;
  if (typeof globalThis !== 'undefined' && root !== globalThis) {
    globalThis.MediaHubWidget = root.MediaHubWidget;
    globalThis.mediaHubCard = root.mediaHubCard;
  }
})(typeof window !== 'undefined' ? window : globalThis);

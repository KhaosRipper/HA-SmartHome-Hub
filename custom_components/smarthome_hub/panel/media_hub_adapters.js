/* ==========================================================================
   Smart Home Hub – Media Hub Provider & Multiroom Adapters
   Free-Standard (Radio Browser, ytube_music_player, Local/DLNA, Direct URL)
   + Optional Subscription/Backend (Spotify/SpotifyPlus, Music Assistant)
   ========================================================================== */
(function (root) {
  'use strict';

  const FEATURE_GROUPING = 524288; // MediaPlayerEntityFeature.GROUPING
  const FEATURE_SEARCH_MEDIA = 2097152; // MediaPlayerEntityFeature.SEARCH_MEDIA
  const DIRECT_AUDIO_RE = /\.(mp3|aac|ogg|opus|flac|wav|m4a|m3u8|pls)(\?.*)?$/i;
  const EXTRACTOR_HOST_RE = /(youtube\.com|youtu\.be|music\.youtube\.com|soundcloud\.com|vimeo\.com|twitch\.tv)/i;

  function isAlexaPlayer(state, entityId) {
    const eid = String(entityId || '').toLowerCase();
    const attrs = (state && state.attributes) || {};
    const fname = String(attrs.friendly_name || '').toLowerCase();
    const srcList = Array.isArray(attrs.source_list) ? attrs.source_list : [];
    if (
      attrs.last_called !== undefined ||
      attrs.connected_bluetooth !== undefined ||
      Array.isArray(attrs.bluetooth_list) ||
      srcList.includes('Local Speaker')
    ) {
      return true;
    }
    return /\b(echo|alexa)\b/i.test(`${eid} ${fname}`);
  }

  function hasService(hass, domain, service) {
    return !!(hass && hass.services && hass.services[domain] && hass.services[domain][service]);
  }

  function isDemoMode(hass) {
    return !hass || (typeof DEMO !== 'undefined' && DEMO);
  }

  function isDirectUrl(text) {
    const s = String(text || '').trim();
    return /^https?:\/\/\S+/i.test(s);
  }

  function extractWsResponse(raw, entityId) {
    if (!raw || typeof raw !== 'object') return {};
    const res = raw.response !== undefined ? raw.response : raw;
    if (res && entityId && res[entityId] && typeof res[entityId] === 'object') {
      return res[entityId];
    }
    return res || {};
  }

  async function callService(hass, domain, service, data) {
    if (isDemoMode(hass)) return { demo: true };
    if (typeof hass.callService !== 'function') throw new Error('hass.callService unavailable');
    return hass.callService(domain, service, data);
  }

  async function callServiceWithResponse(hass, domain, service, serviceData) {
    if (isDemoMode(hass)) return { response: {} };
    if (typeof hass.callWS === 'function') {
      return hass.callWS({
        type: 'call_service',
        domain,
        service,
        service_data: serviceData,
        return_response: true
      });
    }
    throw new Error('hass.callWS unavailable');
  }

  function getActiveProviders(mhCfg) {
    const cfg = mhCfg || {};
    const p = cfg.providers || {};
    const profile = cfg.profile || 'free_direct';
    const active = [];

    if (profile === 'music_assistant') {
      active.push('music_assistant');
      if (p.radio && p.radio.enabled) active.push('radio');
      if (p.direct_url && p.direct_url.enabled) active.push('direct_url');
      return active;
    }

    if (p.radio && p.radio.enabled !== false) active.push('radio');
    if (p.ytube_free && p.ytube_free.enabled) active.push('ytube_free');
    if (p.local_library && p.local_library.enabled) active.push('local_library');
    if (p.direct_url && p.direct_url.enabled !== false) active.push('direct_url');
    if (profile === 'hybrid_premium' && p.spotify && p.spotify.enabled) active.push('spotify');

    return active.length ? active : ['radio'];
  }

  function checkProviderAvailability(hass, providerId, mhCfg, targetPlayer) {
    if (isDemoMode(hass)) return { available: true, demo: true };
    const p = (mhCfg && mhCfg.providers) || {};
    switch (providerId) {
      case 'radio':
        return { available: true };
      case 'ytube_free': {
        const ent = p.ytube_free && p.ytube_free.entity;
        if (!ent) return { available: false, reasonKey: 'mh.err_ytube_no_entity' };
        if (!hasService(hass, 'ytube_music_player', 'search') && !(hass.states && hass.states[ent])) {
          return { available: false, reasonKey: 'mh.err_ytube_missing' };
        }
        return { available: true };
      }
      case 'local_library': {
        const ent = p.local_library && p.local_library.entity;
        if (!ent && !(mhCfg && mhCfg.defaultPlayer)) {
          return { available: false, reasonKey: 'mh.err_local_no_entity' };
        }
        return { available: true };
      }
      case 'direct_url':
        return { available: true, hasExtractor: hasService(hass, 'media_extractor', 'play_media') };
      case 'spotify': {
        const sp = p.spotify || {};
        const tgtState = targetPlayer && hass && hass.states && hass.states[targetPlayer];
        if (!sp.entity && !isAlexaPlayer(tgtState, targetPlayer)) {
          return { available: false, reasonKey: 'mh.err_spotify_no_entity' };
        }
        return { available: true };
      }
      case 'music_assistant':
        if (!hasService(hass, 'music_assistant', 'search')) {
          return { available: false, reasonKey: 'mh.err_ma_missing' };
        }
        return { available: true };
      default:
        return { available: false, reasonKey: 'mh.err_provider_unknown' };
    }
  }

  function normalizeItem(raw, provider, fallbackType = 'track') {
    if (!raw || typeof raw !== 'object') return null;
    const id = raw.media_content_id || raw.uri || raw.id || raw.videoId || raw.browseId || raw.contentId || '';
    const title = raw.title || raw.name || id;
    if (!id && !title) return null;
    return {
      id: String(id),
      uri: String(raw.uri || id),
      title: String(title),
      subtitle: String(raw.subtitle || raw.artist || (Array.isArray(raw.artists) ? raw.artists.map(a => (a && a.name) || a).filter(Boolean).join(', ') : '') || raw.album?.name || raw.author || ''),
      type: String(raw.media_type || raw.media_class || raw.type || fallbackType),
      contentType: String(raw.media_content_type || raw.media_type || raw.type || 'music'),
      thumb: String(raw.thumbnail || raw.image || raw.thumb || raw.image_url || (Array.isArray(raw.thumbnails) && raw.thumbnails.length ? (raw.thumbnails[raw.thumbnails.length - 1]?.url || raw.thumbnails[0]?.url) : '') || raw.album?.images?.[0]?.url || raw.images?.[0]?.url || raw.metadata?.images?.[0]?.url || ''),
      provider,
      canPlay: raw.can_play !== false,
      raw
    };
  }

  function findTargetSourceName(hass, sourceEntity, targetPlayer) {
    if (!hass || !sourceEntity || !targetPlayer) return '';
    const srcState = hass.states && hass.states[sourceEntity];
    const tgtState = hass.states && hass.states[targetPlayer];
    const sourceList = (srcState && srcState.attributes && srcState.attributes.source_list) || [];
    if (!Array.isArray(sourceList) || !sourceList.length) return '';
    if (sourceList.includes(targetPlayer)) return targetPlayer;
    const friendly = tgtState && tgtState.attributes && tgtState.attributes.friendly_name;
    if (friendly) {
      const exact = sourceList.find(s => String(s).toLowerCase() === String(friendly).toLowerCase());
      if (exact) return exact;
      const partial = sourceList.find(s => String(s).toLowerCase().includes(String(friendly).toLowerCase()));
      if (partial) return partial;
    }
    const shortId = targetPlayer.replace(/^media_player\./, '').replace(/_/g, ' ');
    return sourceList.find(s => String(s).toLowerCase().includes(shortId.toLowerCase())) || '';
  }

  async function fetchJsonWithTimeout(url, timeoutMs = 4500) {
    if (typeof fetch !== 'function') return null;
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = ctrl ? setTimeout(() => ctrl.abort(), timeoutMs) : null;
    try {
      const resp = await fetch(url, ctrl ? { signal: ctrl.signal } : undefined);
      if (!resp || !resp.ok) return null;
      return await resp.json();
    } catch (_) {
      return null;
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  /* ---------- 1. Webradio (Radio Browser + Favorites) ---------- */
  async function searchRadio(hass, query, mhCfg) {
    const rawQ = String(query || '').trim();
    const q = rawQ.toLowerCase();
    const favs = ((mhCfg && mhCfg.radioFavorites) || []).filter(f => f && (f.contentId || f.name));
    const favItems = favs
      .filter(f => !q || String(f.name).toLowerCase().includes(q) || String(f.contentId).toLowerCase().includes(q))
      .map(f => ({
        id: f.contentId,
        uri: f.contentId,
        title: f.name || f.contentId,
        subtitle: f.icon ? `${f.icon} Favorite` : 'Radio Favorite',
        type: 'radio',
        contentType: f.contentId.startsWith('media-source://') ? 'music' : 'audio/mpeg',
        thumb: '',
        icon: f.icon || '📻',
        provider: 'radio',
        isFavorite: true
      }));

    const liveEnabled = !(mhCfg && mhCfg.providers && mhCfg.providers.radio && mhCfg.providers.radio.liveSearch === false);
    if (!liveEnabled || !q) return { items: favItems, errors: [] };

    if (isDemoMode(hass)) {
      const demoStations = [
        { id: 'media-source://radio_browser/swr3', title: 'SWR3 Pop & Rock', subtitle: 'Radio Browser · DE', type: 'radio', contentType: 'music', provider: 'radio' },
        { id: 'media-source://radio_browser/deutschlandfunk', title: 'Deutschlandfunk', subtitle: 'Radio Browser · News', type: 'radio', contentType: 'music', provider: 'radio' },
        { id: 'media-source://radio_browser/chillout', title: 'Lofi Chill Radio', subtitle: 'Radio Browser · Chill', type: 'radio', contentType: 'music', provider: 'radio' }
      ].filter(s => s.title.toLowerCase().includes(q) || s.subtitle.toLowerCase().includes(q));
      return { items: [...favItems, ...demoStations], errors: [] };
    }

    // 1. Public Radio Browser API (returns full station directory & favicons without auth)
    const favByName = new Map(favItems.map(f => [String(f.title || '').trim().toLowerCase(), f]));
    const rbParams = `name=${encodeURIComponent(rawQ)}&limit=15&order=clickcount&reverse=true&hidebroken=true`;
    let rbData = await fetchJsonWithTimeout(`https://de1.api.radio-browser.info/json/stations/search?${rbParams}`);
    if (!Array.isArray(rbData) || !rbData.length) {
      const mirrorData = await fetchJsonWithTimeout(`https://all.api.radio-browser.info/json/stations/search?${rbParams}`);
      if (Array.isArray(mirrorData)) rbData = mirrorData;
    }

    if (Array.isArray(rbData) && rbData.length) {
      const liveItems = [];
      const seenNames = new Set();
      rbData.forEach(st => {
        const name = String((st && st.name) || '').trim();
        if (!name) return;
        const normKey = name.toLowerCase();
        const favicon = st.favicon ? String(st.favicon).trim() : '';
        const matchingFav = favByName.get(normKey);
        if (matchingFav) {
          if (!matchingFav.thumb && favicon) matchingFav.thumb = favicon;
          return;
        }
        if (seenNames.has(normKey)) return;
        seenNames.add(normKey);
        const tags = String(st.tags || '').split(',').map(t => t.trim()).filter(Boolean).slice(0, 2).join(', ');
        const br = st.bitrate ? `${st.bitrate} kbps` : '';
        liveItems.push({
          id: st.stationuuid ? `media-source://radio_browser/${st.stationuuid}` : String(st.url_resolved || st.url || name),
          uri: String(st.url_resolved || st.url || ''),
          title: name,
          subtitle: [st.countrycode, tags, br].filter(Boolean).join(' · ') || 'Radio Browser',
          type: 'radio',
          contentType: 'music',
          thumb: favicon,
          icon: '📻',
          provider: 'radio'
        });
      });
      return { items: [...favItems, ...liveItems], errors: [] };
    }

    if (typeof hass.callWS !== 'function') return { items: favItems, errors: [] };

    try {
      const rootNode = await hass.callWS({
        type: 'media_source/browse_media',
        media_content_id: 'media-source://radio_browser'
      });
      const collected = [];
      const dirsToExpand = [];
      const walkChildren = (node) => {
        const kids = (node && node.children) || [];
        kids.forEach(c => {
          if (c.can_play) collected.push(c);
          else if (c.can_expand && c.media_content_id) dirsToExpand.push(c);
        });
      };
      walkChildren(rootNode);

      // Drill 1 level into popular/matching categories so station search works without a dedicated search endpoint
      const prioritizedDirs = dirsToExpand
        .filter(d => /popular|top|click|country|language|tag/i.test(String(d.title || d.media_content_id)))
        .slice(0, 3);
      if (!prioritizedDirs.length && dirsToExpand.length) prioritizedDirs.push(...dirsToExpand.slice(0, 2));

      if (collected.length < 15 && prioritizedDirs.length) {
        const subNodes = await Promise.allSettled(
          prioritizedDirs.map(d => hass.callWS({ type: 'media_source/browse_media', media_content_id: d.media_content_id }))
        );
        subNodes.forEach(r => { if (r.status === 'fulfilled' && r.value) walkChildren(r.value); });
      }

      const liveItems = collected
        .filter(c => String(c.title || '').toLowerCase().includes(q))
        .slice(0, 20)
        .map(c => normalizeItem(c, 'radio', 'radio'))
        .filter(Boolean)
        .filter(it => {
          const k = it.title.trim().toLowerCase();
          const fav = favByName.get(k);
          if (fav) {
            if (!fav.thumb && it.thumb) fav.thumb = it.thumb;
            return false;
          }
          return true;
        });

      return { items: [...favItems, ...liveItems], errors: [] };
    } catch (err) {
      return { items: favItems, errors: [{ provider: 'radio', reasonKey: 'mh.err_radio_browse', detail: String(err && err.message || err) }] };
    }
  }

  async function playRadio(hass, targetPlayer, item) {
    const contentId = String((item && (item.id || item.contentId || item.uri)) || '').trim();
    const stationName = String((item && (item.title || item.name)) || '').trim();
    if ((!contentId && !stationName) || !targetPlayer) return { ok: false, reasonKey: 'mh.err_no_player' };

    const targetState = hass && hass.states && hass.states[targetPlayer];
    if (isAlexaPlayer(targetState, targetPlayer)) {
      const tuneInQuery = /^s\d+$/i.test(contentId)
        ? contentId
        : (stationName || contentId.replace(/^media-source:\/\/radio_browser\//i, '').replace(/[_-]+/g, ' '));
      await callService(hass, 'media_player', 'play_media', {
        entity_id: targetPlayer,
        media_content_id: tuneInQuery,
        media_content_type: 'TUNEIN'
      });
      return { ok: true };
    }

    const contentType = contentId.startsWith('media-source://') ? 'music' : (item.contentType || 'audio/mpeg');
    await callService(hass, 'media_player', 'play_media', {
      entity_id: targetPlayer,
      media_content_id: contentId,
      media_content_type: contentType,
      extra: { title: stationName || contentId }
    });
    return { ok: true };
  }

  /* ---------- 2. YouTube Music Free (ytube_music_player) ---------- */
  function getLiveHass(fallbackHass) {
    if (typeof getHass === 'function' && !isDemoMode(fallbackHass)) {
      const live = getHass();
      if (live && live.states) return live;
    }
    return fallbackHass;
  }

  function extractYtubeResultsFromStates(hassObj, ytEntity) {
    const states = hassObj && hassObj.states;
    if (!states) return [];
    const ytAttrs = (states[ytEntity] && states[ytEntity].attributes) || {};
    const direct = ytAttrs.search_results || ytAttrs.search;
    if (Array.isArray(direct) && direct.length) return direct;

    const objId = String(ytEntity || '').replace(/^media_player\./, '');
    const extraCandidates = [
      `sensor.${objId}_extra`,
      ...Object.keys(states).filter(id => id.startsWith('sensor.') && id.includes('ytube') && id.endsWith('_extra'))
    ];
    for (const eid of extraCandidates) {
      const attrs = states[eid] && states[eid].attributes;
      const list = attrs && (attrs.search_results || attrs.search);
      if (Array.isArray(list) && list.length) return list;
    }
    return [];
  }

  function mapYtubeRawItem(r) {
    if (!r || typeof r !== 'object') return null;
    const thumbs = Array.isArray(r.thumbnails) ? r.thumbnails : [];
    const bestThumb = r.thumbnail || r.thumb || (thumbs.length ? (thumbs[thumbs.length - 1]?.url || thumbs[0]?.url) : '');
    const artistStr = Array.isArray(r.artists)
      ? r.artists.map(a => (a && a.name) || (typeof a === 'string' ? a : '')).filter(Boolean).join(', ')
      : (r.artist || '');
    const itemType = r.type || r.resultType || 'track';
    return normalizeItem({
      id: r.id || r.videoId || r.browseId || r.playlistId || r.media_content_id,
      title: r.title || r.name || r.artist,
      subtitle: r.subtitle || [artistStr, r.album && r.album.name].filter(Boolean).join(' · ') || itemType,
      media_type: itemType,
      media_content_type: r.media_content_type || itemType,
      thumbnail: bestThumb
    }, 'ytube_free', 'track');
  }

  async function searchYtube(hass, query, mhCfg) {
    const q = String(query || '').trim();
    if (!q) return { items: [], errors: [] };
    const avail = checkProviderAvailability(hass, 'ytube_free', mhCfg);
    if (!avail.available) return { items: [], errors: [{ provider: 'ytube_free', reasonKey: avail.reasonKey }] };

    if (isDemoMode(hass)) {
      return {
        items: [
          { id: 'yt_demo_1', title: `${q} (YouTube Music Free)`, subtitle: 'Demo Artist · Track', type: 'track', contentType: 'track', thumb: '', provider: 'ytube_free' },
          { id: 'yt_demo_2', title: `${q} Live Acoustic`, subtitle: 'Demo Session · Video', type: 'track', contentType: 'track', thumb: '', provider: 'ytube_free' }
        ],
        errors: []
      };
    }

    const ytEntity = mhCfg.providers.ytube_free.entity;
    const useLiveHass = getLiveHass(hass) === hass;
    const readResults = () => extractYtubeResultsFromStates(useLiveHass ? getLiveHass(hass) : hass, ytEntity);
    const prevRaw = JSON.stringify(readResults() || null);
    try {
      await callService(hass, 'ytube_music_player', 'search', {
        entity_id: ytEntity,
        query: q
      });
      // Poll fresh HA states (up to ~1.6s) since ytube_music_player updates attributes asynchronously
      let results = readResults();
      for (let i = 0; i < 8; i++) {
        const curRaw = JSON.stringify(results || null);
        if (Array.isArray(results) && results.length && curRaw !== prevRaw) break;
        await new Promise(r => setTimeout(r, 200));
        results = readResults();
      }

      let items = (Array.isArray(results) ? results : []).map(mapYtubeRawItem).filter(Boolean);

      // Fallback: HA Media Browser search node used by ytube_music_player
      if (!items.length && typeof hass.callWS === 'function') {
        try {
          const browseNode = await hass.callWS({
            type: 'media_player/browse_media',
            entity_id: ytEntity,
            media_content_type: 'search',
            media_content_id: ''
          });
          const collected = [];
          const dirs = [];
          const walk = node => {
            const kids = (node && node.children) || [];
            kids.forEach(c => {
              if (c.can_play) collected.push(c);
              else if (c.can_expand && c.media_content_id) dirs.push(c);
            });
          };
          walk(browseNode);
          if (!collected.length && dirs.length) {
            const subNodes = await Promise.allSettled(
              dirs.slice(0, 4).map(d => hass.callWS({
                type: 'media_player/browse_media',
                entity_id: ytEntity,
                media_content_type: d.media_content_type,
                media_content_id: d.media_content_id
              }))
            );
            subNodes.forEach(r => { if (r.status === 'fulfilled' && r.value) walk(r.value); });
          }
          items = collected.slice(0, 25).map(c => normalizeItem(c, 'ytube_free', 'track')).filter(Boolean);
        } catch (_) {}
      }

      return { items, errors: [] };
    } catch (err) {
      return { items: [], errors: [{ provider: 'ytube_free', reasonKey: 'mh.err_search_failed', detail: String(err && err.message || err) }] };
    }
  }

  async function playYtube(hass, targetPlayer, item, mhCfg) {
    const ytEntity = mhCfg && mhCfg.providers && mhCfg.providers.ytube_free && mhCfg.providers.ytube_free.entity;
    if (!ytEntity) return { ok: false, reasonKey: 'mh.err_ytube_no_entity' };
    const sourceName = findTargetSourceName(hass, ytEntity, targetPlayer);
    if (sourceName) {
      await callService(hass, 'media_player', 'select_source', {
        entity_id: ytEntity,
        source: sourceName
      });
    }
    await callService(hass, 'media_player', 'play_media', {
      entity_id: ytEntity,
      media_content_id: item.id || item.uri,
      media_content_type: item.contentType || item.type || 'track'
    });
    return { ok: true };
  }

  /* ---------- 3. Local Library / Media Server (Emby, Jellyfin, DLNA) ---------- */
  async function searchLocalLibrary(hass, query, mediaTypes, mhCfg) {
    const q = String(query || '').trim();
    if (!q) return { items: [], errors: [] };
    const avail = checkProviderAvailability(hass, 'local_library', mhCfg);
    if (!avail.available) return { items: [], errors: [{ provider: 'local_library', reasonKey: avail.reasonKey }] };

    if (isDemoMode(hass)) {
      return {
        items: [
          { id: 'local_demo_1', title: `${q} (FLAC Local)`, subtitle: 'Jellyfin / DLNA Library', type: 'track', contentType: 'music', thumb: '', provider: 'local_library' }
        ],
        errors: []
      };
    }

    const ent = (mhCfg.providers.local_library && mhCfg.providers.local_library.entity) || mhCfg.defaultPlayer;
    try {
      const payload = { entity_id: ent, search_query: q };
      if (Array.isArray(mediaTypes) && mediaTypes.length === 1) {
        payload.media_content_type = mediaTypes[0];
      }
      const raw = await callServiceWithResponse(hass, 'media_player', 'search_media', payload);
      const unwrapped = extractWsResponse(raw, ent);
      const list = Array.isArray(unwrapped.result) ? unwrapped.result : (Array.isArray(unwrapped) ? unwrapped : []);
      const items = list.map(r => normalizeItem(r, 'local_library', 'track')).filter(Boolean);
      return { items, errors: [] };
    } catch (err) {
      return { items: [], errors: [{ provider: 'local_library', reasonKey: 'mh.err_search_failed', detail: String(err && err.message || err) }] };
    }
  }

  async function playLocalLibrary(hass, targetPlayer, item) {
    if (!targetPlayer) return { ok: false, reasonKey: 'mh.err_no_player' };
    await callService(hass, 'media_player', 'play_media', {
      entity_id: targetPlayer,
      media_content_id: item.id || item.uri,
      media_content_type: item.contentType || 'music'
    });
    return { ok: true };
  }

  /* ---------- 4. Direct URL / media_extractor ---------- */
  async function playDirectUrl(hass, targetPlayer, url) {
    const cleanUrl = String(url || '').trim();
    if (!isDirectUrl(cleanUrl)) return { ok: false, reasonKey: 'mh.err_invalid_url' };
    if (!targetPlayer) return { ok: false, reasonKey: 'mh.err_no_player' };

    if (isDemoMode(hass)) {
      await callService(hass, 'media_extractor', 'play_media', {
        entity_id: targetPlayer,
        media_content_id: cleanUrl,
        media_content_type: 'music'
      });
      return { ok: true };
    }

    if (hasService(hass, 'media_extractor', 'play_media')) {
      await callService(hass, 'media_extractor', 'play_media', {
        entity_id: targetPlayer,
        media_content_id: cleanUrl,
        media_content_type: 'music'
      });
      return { ok: true };
    }

    if (EXTRACTOR_HOST_RE.test(cleanUrl) && !DIRECT_AUDIO_RE.test(cleanUrl)) {
      return { ok: false, reasonKey: 'mh.err_extractor_missing' };
    }

    await callService(hass, 'media_player', 'play_media', {
      entity_id: targetPlayer,
      media_content_id: cleanUrl,
      media_content_type: 'audio/mpeg'
    });
    return { ok: true };
  }

  /* ---------- 5. Spotify / SpotifyPlus (Optional) ---------- */
  function getSpotifyConnectDevices(hass, mhCfg) {
    const ent = mhCfg && mhCfg.providers && mhCfg.providers.spotify && mhCfg.providers.spotify.entity;
    if (!hass || !ent || !hass.states || !hass.states[ent]) return [];
    const list = hass.states[ent].attributes && hass.states[ent].attributes.source_list;
    return Array.isArray(list) ? list : [];
  }

  async function browseSpotifyLibrary(hass, ent, query) {
    if (!hass || typeof hass.callWS !== 'function' || !ent) return [];
    const q = String(query || '').trim().toLowerCase();
    const collected = [];
    const dirsToExpand = [];
    const walk = node => {
      const kids = (node && node.children) || [];
      kids.forEach(c => {
        if (c.can_play) collected.push(c);
        else if (c.can_expand && c.media_content_id) dirsToExpand.push(c);
      });
    };
    const rootNode = await hass.callWS({ type: 'media_player/browse_media', entity_id: ent });
    walk(rootNode);
    const subDirs = dirsToExpand.slice(0, 4);
    if (subDirs.length) {
      const subNodes = await Promise.allSettled(
        subDirs.map(d => hass.callWS({
          type: 'media_player/browse_media',
          entity_id: ent,
          media_content_id: d.media_content_id,
          media_content_type: d.media_content_type
        }))
      );
      subNodes.forEach(r => { if (r.status === 'fulfilled' && r.value) walk(r.value); });
    }
    return collected
      .filter(c => !q || String(c.title || '').toLowerCase().includes(q))
      .slice(0, 20)
      .map(c => normalizeItem(c, 'spotify', c.media_content_type || 'track'))
      .filter(Boolean);
  }

  async function searchPublicMusicCatalog(query, mediaTypes, country = 'DE') {
    const q = String(query || '').trim();
    if (!q) return [];
    const data = await fetchJsonWithTimeout(
      `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=music&limit=18&country=${encodeURIComponent(country)}`
    );
    const results = (data && Array.isArray(data.results)) ? data.results : [];
    if (!results.length) return [];

    const allowed = Array.isArray(mediaTypes) && mediaTypes.length ? mediaTypes : ['track', 'artist', 'album'];
    const tracks = [];
    const artistMap = new Map();
    const albumMap = new Map();
    const seenTracks = new Set();

    results.forEach(r => {
      if (!r || typeof r !== 'object') return;
      const thumb = String(r.artworkUrl100 || r.artworkUrl60 || r.artworkUrl30 || '').trim();
      const artistName = String(r.artistName || '').trim();
      const albumName = String(r.collectionName || '').trim();
      const trackName = String(r.trackName || '').trim();

      if (artistName) {
        const aKey = String(r.artistId || artistName.toLowerCase());
        if (!artistMap.has(aKey)) {
          artistMap.set(aKey, {
            id: `catalog:artist:${aKey}`,
            uri: artistName,
            title: artistName,
            subtitle: r.primaryGenreName || 'Artist',
            artist: artistName,
            type: 'artist',
            contentType: 'SPOTIFY',
            thumb,
            icon: '🎤',
            provider: 'spotify',
            catalogFallback: true
          });
        } else if (!artistMap.get(aKey).thumb && thumb) {
          artistMap.get(aKey).thumb = thumb;
        }
      }

      if (albumName && artistName) {
        const alKey = String(r.collectionId || `${albumName.toLowerCase()}::${artistName.toLowerCase()}`);
        if (!albumMap.has(alKey)) {
          albumMap.set(alKey, {
            id: `catalog:album:${alKey}`,
            uri: `${albumName} ${artistName}`.trim(),
            title: albumName,
            subtitle: artistName,
            artist: artistName,
            type: 'album',
            contentType: 'SPOTIFY',
            thumb,
            icon: '💿',
            provider: 'spotify',
            catalogFallback: true
          });
        }
      }

      if (trackName) {
        const trKey = `${trackName.toLowerCase()}::${artistName.toLowerCase()}`;
        if (!seenTracks.has(trKey)) {
          seenTracks.add(trKey);
          tracks.push({
            id: `catalog:track:${r.trackId || trKey}`,
            uri: `${trackName} ${artistName}`.trim(),
            title: trackName,
            subtitle: [artistName, albumName].filter(Boolean).join(' · '),
            artist: artistName,
            type: 'track',
            contentType: 'SPOTIFY',
            thumb,
            icon: '🎵',
            provider: 'spotify',
            catalogFallback: true
          });
        }
      }
    });

    const out = [];
    if (allowed.includes('artist')) out.push(...Array.from(artistMap.values()).slice(0, 4));
    if (allowed.includes('track')) out.push(...tracks.slice(0, 10));
    if (allowed.includes('album')) out.push(...Array.from(albumMap.values()).slice(0, 4));
    return out;
  }

  async function searchSpotify(hass, query, mediaTypes, mhCfg, targetPlayer) {
    const q = String(query || '').trim();
    if (!q) return { items: [], errors: [] };
    const avail = checkProviderAvailability(hass, 'spotify', mhCfg, targetPlayer);
    if (!avail.available) return { items: [], errors: [{ provider: 'spotify', reasonKey: avail.reasonKey }] };

    if (isDemoMode(hass)) {
      return {
        items: [
          { id: 'spotify:track:demo1', uri: 'spotify:track:demo1', title: `${q} (Spotify)`, subtitle: 'Demo Artist · Album', type: 'track', contentType: 'spotify://track', thumb: '', provider: 'spotify' }
        ],
        errors: []
      };
    }

    const sp = mhCfg.providers.spotify || {};
    const ent = sp.entity;
    const types = Array.isArray(mediaTypes) && mediaTypes.length ? mediaTypes : ['track', 'artist', 'album'];
    const targetState = targetPlayer && hass && hass.states && hass.states[targetPlayer];
    const targetIsAlexa = isAlexaPlayer(targetState, targetPlayer);
    const catalogCountry = /^en/i.test(String((hass && hass.language) || '')) ? 'US' : 'DE';
    const alexaDirectItem = targetIsAlexa ? {
      id: q,
      uri: q,
      title: q,
      subtitle: 'Alexa · Spotify',
      type: 'alexa_spotify',
      contentType: 'SPOTIFY',
      thumb: '',
      icon: '🟢',
      provider: 'spotify'
    } : null;

    if (!ent) {
      const catalogItems = await searchPublicMusicCatalog(q, types, catalogCountry);
      if (alexaDirectItem) catalogItems.push(alexaDirectItem);
      return { items: catalogItems, errors: [] };
    }

    const items = [];
    let lastError = null;

    if (sp.mode === 'spotifyplus' && hasService(hass, 'spotifyplus', 'search_tracks')) {
      const svcMap = { track: 'search_tracks', artist: 'search_artists', album: 'search_albums' };
      const calls = types.filter(tp => svcMap[tp]).map(tp =>
        callServiceWithResponse(hass, 'spotifyplus', svcMap[tp], { entity_id: ent, criteria: q, limit: 10 })
          .then(raw => {
            const res = extractWsResponse(raw, ent);
            const container = (res && res.result && typeof res.result === 'object' && !Array.isArray(res.result)) ? res.result : res;
            const rows = (
              (Array.isArray(res && res.result) && res.result) ||
              (container && (container.items || (container.tracks && container.tracks.items) || (container.artists && container.artists.items) || (container.albums && container.albums.items))) ||
              (Array.isArray(res) && res) ||
              []
            );
            return rows.map(r => normalizeItem(r, 'spotify', tp)).filter(Boolean);
          })
      );
      const settled = await Promise.allSettled(calls);
      settled.forEach(s => {
        if (s.status === 'fulfilled') items.push(...s.value);
        else if (!lastError) lastError = s.reason;
      });
      if (items.length) {
        if (alexaDirectItem) items.push(alexaDirectItem);
        return { items, errors: [] };
      }
    }

    const spState = hass && hass.states && hass.states[ent];
    const supportsSearch = !spState || !spState.attributes || spState.attributes.supported_features === undefined
      || ((Number(spState.attributes.supported_features || 0) & FEATURE_SEARCH_MEDIA) !== 0);

    if (supportsSearch && hasService(hass, 'media_player', 'search_media')) {
      try {
        const raw = await callServiceWithResponse(hass, 'media_player', 'search_media', {
          entity_id: ent,
          search_query: q
        });
        const res = extractWsResponse(raw, ent);
        const list = Array.isArray(res.result) ? res.result : (Array.isArray(res) ? res : []);
        items.push(...list.map(r => normalizeItem(r, 'spotify', 'track')).filter(Boolean));
      } catch (err) {
        lastError = err;
      }
    }

    if (!items.length) {
      try {
        const browsed = await browseSpotifyLibrary(hass, ent, q);
        items.push(...browsed);
      } catch (err) {
        if (!lastError) lastError = err;
      }
      const catalogItems = await searchPublicMusicCatalog(q, types, catalogCountry);
      if (catalogItems.length) {
        const existingTitles = new Set(items.map(i => `${String(i.title || '').toLowerCase()}::${i.type || ''}`));
        catalogItems.forEach(ci => {
          const key = `${String(ci.title || '').toLowerCase()}::${ci.type || ''}`;
          if (!existingTitles.has(key)) items.push(ci);
        });
      }
    }

    if (alexaDirectItem) items.push(alexaDirectItem);

    if (!items.length && lastError) {
      return { items: [], errors: [{ provider: 'spotify', reasonKey: 'mh.err_search_failed', detail: String(lastError && lastError.message || lastError) }] };
    }
    return { items, errors: [] };
  }

  async function playSpotify(hass, targetPlayer, item, mhCfg) {
    const sp = (mhCfg && mhCfg.providers && mhCfg.providers.spotify) || {};
    const targetState = targetPlayer && hass && hass.states && hass.states[targetPlayer];
    const targetIsAlexa = isAlexaPlayer(targetState, targetPlayer);
    if (item && (item.catalogFallback || item.type === 'alexa_spotify' || (!sp.entity && targetIsAlexa))) {
      const playQuery = item.type === 'artist'
        ? String(item.title || item.uri || '').trim()
        : `${item.title || ''} ${item.artist || ''}`.trim() || String(item.uri || item.id || '').trim();
      if (targetIsAlexa) {
        if (!targetPlayer) return { ok: false, reasonKey: 'mh.err_no_player' };
        await callService(hass, 'media_player', 'play_media', {
          entity_id: targetPlayer,
          media_content_id: playQuery,
          media_content_type: 'SPOTIFY'
        });
        return { ok: true };
      }
      const fallbackEnt = sp.entity || targetPlayer;
      if (!fallbackEnt) return { ok: false, reasonKey: 'mh.err_spotify_no_entity' };
      await callService(hass, 'media_player', 'play_media', {
        entity_id: fallbackEnt,
        media_content_id: playQuery,
        media_content_type: 'music'
      });
      return { ok: true };
    }

    const spEntity = sp.entity || targetPlayer;
    if (!spEntity) return { ok: false, reasonKey: 'mh.err_spotify_no_entity' };

    const connectSource = findTargetSourceName(hass, spEntity, targetPlayer);
    if (connectSource) {
      await callService(hass, 'media_player', 'select_source', {
        entity_id: spEntity,
        source: connectSource
      });
    }

    const uri = item.uri || item.id;
    if (sp.mode === 'spotifyplus' && hasService(hass, 'spotifyplus', 'player_media_play_tracks') && item.type === 'track') {
      await callService(hass, 'spotifyplus', 'player_media_play_tracks', {
        entity_id: spEntity,
        uris: uri
      });
      return { ok: true };
    }
    if (sp.mode === 'spotifyplus' && hasService(hass, 'spotifyplus', 'player_media_play_context') && (item.type === 'album' || item.type === 'artist' || item.type === 'playlist')) {
      await callService(hass, 'spotifyplus', 'player_media_play_context', {
        entity_id: spEntity,
        context_uri: uri
      });
      return { ok: true };
    }

    await callService(hass, 'media_player', 'play_media', {
      entity_id: spEntity,
      media_content_id: uri,
      media_content_type: item.contentType || item.type || 'music'
    });
    return { ok: true };
  }

  /* ---------- 6. Music Assistant (Optional All-in-One) ---------- */
  async function searchMusicAssistant(hass, query, mediaTypes, mhCfg) {
    const q = String(query || '').trim();
    if (!q) return { items: [], errors: [] };
    const avail = checkProviderAvailability(hass, 'music_assistant', mhCfg);
    if (!avail.available) return { items: [], errors: [{ provider: 'music_assistant', reasonKey: avail.reasonKey }] };

    if (isDemoMode(hass)) {
      return {
        items: [
          { id: 'library://track/1', uri: 'library://track/1', title: `${q} (Music Assistant)`, subtitle: 'MA Unified Search', type: 'track', contentType: 'track', thumb: '', provider: 'music_assistant' }
        ],
        errors: []
      };
    }

    const maCfg = (mhCfg && mhCfg.providers && mhCfg.providers.music_assistant) || {};
    const allowed = ['track', 'artist', 'album', 'radio', 'playlist'];
    const mappedTypes = (Array.isArray(mediaTypes) ? mediaTypes : ['track', 'artist', 'album', 'radio']).filter(t => allowed.includes(t));
    try {
      const payload = {
        name: q,
        media_type: mappedTypes.length ? mappedTypes : ['track', 'artist', 'album', 'radio'],
        limit: 15
      };
      if (maCfg.configEntryId) payload.config_entry_id = maCfg.configEntryId;

      const raw = await callServiceWithResponse(hass, 'music_assistant', 'search', payload);
      const res = extractWsResponse(raw);
      const items = [];
      ['tracks', 'artists', 'albums', 'radio', 'playlists'].forEach(bucket => {
        const singular = bucket === 'radio' ? 'radio' : bucket.slice(0, -1);
        const arr = res[bucket];
        if (Array.isArray(arr)) {
          arr.forEach(entry => {
            const norm = normalizeItem(entry, 'music_assistant', singular);
            if (norm) items.push(norm);
          });
        }
      });
      return { items, errors: [] };
    } catch (err) {
      return { items: [], errors: [{ provider: 'music_assistant', reasonKey: 'mh.err_search_failed', detail: String(err && err.message || err) }] };
    }
  }

  async function playMusicAssistant(hass, targetPlayer, item) {
    if (!targetPlayer) return { ok: false, reasonKey: 'mh.err_no_player' };
    await callService(hass, 'music_assistant', 'play_media', {
      entity_id: targetPlayer,
      media_id: item.uri || item.id,
      media_type: item.type || 'track',
      enqueue: 'play'
    });
    return { ok: true };
  }

  /* ---------- 7. Unified Search & Playback Dispatcher ---------- */
  async function searchProvider(hass, providerId, query, mediaTypes, mhCfg, targetPlayer) {
    switch (providerId) {
      case 'radio': return searchRadio(hass, query, mhCfg);
      case 'ytube_free': return searchYtube(hass, query, mhCfg);
      case 'local_library': return searchLocalLibrary(hass, query, mediaTypes, mhCfg);
      case 'direct_url':
        if (isDirectUrl(query)) {
          return {
            items: [{
              id: query.trim(),
              uri: query.trim(),
              title: query.trim(),
              subtitle: 'Direct Stream / media_extractor',
              type: 'url',
              contentType: 'music',
              thumb: '',
              provider: 'direct_url'
            }],
            errors: []
          };
        }
        return { items: [], errors: [] };
      case 'spotify': return searchSpotify(hass, query, mediaTypes, mhCfg, targetPlayer);
      case 'music_assistant': return searchMusicAssistant(hass, query, mediaTypes, mhCfg);
      default: return { items: [], errors: [] };
    }
  }

  async function search({ hass, mhCfg, tabId, query, targetPlayer }) {
    const cfg = mhCfg || {};
    const q = String(query || '').trim();
    if (isDirectUrl(q)) {
      return searchProvider(hass, 'direct_url', q, [], cfg, targetPlayer);
    }
    const mediaTypes = (cfg.search && cfg.search.mediaTypes) || ['track', 'artist', 'album', 'radio'];
    const scope = (cfg.search && cfg.search.scope) || 'active_tab';
    const providersToSearch = scope === 'combined'
      ? getActiveProviders(cfg).filter(id => id !== 'direct_url')
      : [tabId || getActiveProviders(cfg)[0] || 'radio'];

    const settled = await Promise.allSettled(
      providersToSearch.map(pid => searchProvider(hass, pid, q, mediaTypes, cfg, targetPlayer))
    );

    const items = [];
    const errors = [];
    const seen = new Set();
    settled.forEach(res => {
      if (res.status === 'fulfilled' && res.value) {
        (res.value.items || []).forEach(it => {
          const key = `${it.provider}:${it.id}`;
          if (!seen.has(key)) {
            seen.add(key);
            items.push(it);
          }
        });
        if (res.value.errors && res.value.errors.length) errors.push(...res.value.errors);
      }
    });
    return { items, errors };
  }

  async function play({ hass, mhCfg, targetPlayer, item }) {
    if (!item) return { ok: false, reasonKey: 'mh.err_nothing_selected' };
    const provider = item.provider || 'radio';
    switch (provider) {
      case 'radio': return playRadio(hass, targetPlayer, item);
      case 'ytube_free': return playYtube(hass, targetPlayer, item, mhCfg);
      case 'local_library': return playLocalLibrary(hass, targetPlayer, item);
      case 'direct_url': return playDirectUrl(hass, targetPlayer, item.id || item.uri);
      case 'spotify': return playSpotify(hass, targetPlayer, item, mhCfg);
      case 'music_assistant': return playMusicAssistant(hass, targetPlayer, item);
      default: return { ok: false, reasonKey: 'mh.err_provider_unknown' };
    }
  }

  /* ---------- 8. Multiroom Service Logic ---------- */
  function isPlayerGroupable(state) {
    if (!state || !state.attributes) return false;
    const features = Number(state.attributes.supported_features || 0);
    return (features & FEATURE_GROUPING) !== 0;
  }

  function getGroupablePlayers(hass, mhCfg) {
    const cfg = mhCfg || {};
    const override = (cfg.multiroom && Array.isArray(cfg.multiroom.groupablePlayers) && cfg.multiroom.groupablePlayers.length)
      ? cfg.multiroom.groupablePlayers
      : null;
    const candidates = override
      ? override.map(e => ({ entity: e, name: '' }))
      : (cfg.players || []);

    return candidates.filter(p => {
      if (!p || !p.entity) return false;
      if (isDemoMode(hass)) return true;
      const st = hass.states && hass.states[p.entity];
      return override ? !!st : isPlayerGroupable(st);
    });
  }

  function getGroupMembers(state) {
    const members = state && state.attributes && state.attributes.group_members;
    return Array.isArray(members) ? members.filter(Boolean) : [];
  }

  async function joinPlayers(hass, masterId, memberIds) {
    const members = (Array.isArray(memberIds) ? memberIds : [memberIds]).filter(Boolean);
    if (!masterId || !members.length) return { ok: false };
    await callService(hass, 'media_player', 'join', {
      entity_id: masterId,
      group_members: members
    });
    return { ok: true };
  }

  async function unjoinPlayer(hass, entityId) {
    if (!entityId) return { ok: false };
    await callService(hass, 'media_player', 'unjoin', { entity_id: entityId });
    return { ok: true };
  }

  async function setVolume(hass, entityId, level) {
    if (!entityId) return { ok: false };
    const clamped = Math.min(1, Math.max(0, Number(level) || 0));
    await callService(hass, 'media_player', 'volume_set', {
      entity_id: entityId,
      volume_level: Number(clamped.toFixed(2))
    });
    return { ok: true };
  }

  async function toggleMute(hass, entityId, muted) {
    if (!entityId) return { ok: false };
    await callService(hass, 'media_player', 'volume_mute', {
      entity_id: entityId,
      is_volume_muted: !!muted
    });
    return { ok: true };
  }

  async function applyPreset(hass, preset) {
    if (!preset || !preset.master || !Array.isArray(preset.members) || !preset.members.length) {
      return { ok: false };
    }
    const members = preset.members.filter(m => m && m !== preset.master);
    if (!members.length) return { ok: false };
    return joinPlayers(hass, preset.master, members);
  }

  root.MediaHubAdapters = {
    FEATURE_GROUPING,
    FEATURE_SEARCH_MEDIA,
    hasService,
    isDirectUrl,
    isAlexaPlayer,
    getActiveProviders,
    checkProviderAvailability,
    getSpotifyConnectDevices,
    searchRadio,
    playRadio,
    searchYtube,
    playYtube,
    searchLocalLibrary,
    playLocalLibrary,
    playDirectUrl,
    searchSpotify,
    playSpotify,
    searchMusicAssistant,
    playMusicAssistant,
    search,
    play,
    isPlayerGroupable,
    getGroupablePlayers,
    getGroupMembers,
    joinPlayers,
    unjoinPlayer,
    setVolume,
    toggleMute,
    applyPreset
  };
  if (typeof globalThis !== 'undefined' && root !== globalThis) {
    globalThis.MediaHubAdapters = root.MediaHubAdapters;
  }
})(typeof window !== 'undefined' ? window : globalThis);

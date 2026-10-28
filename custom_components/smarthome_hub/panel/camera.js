/* ==========================================================================
   Smart Home Hub – Intelligente Kamera-Engine (camera.js)
   Automatische Erkennung: Lokales go2rtc (LAN) ↔ Home Assistant Proxy (Remote / Companion App)
   ========================================================================== */

const go2rtcState = {
  host: '',
  reachable: false,
  checked: false,
  checking: false,
  lastCheck: 0,
  modeOverride: localStorage.getItem('hub_cam_mode') || 'auto' // 'auto' | 'ha' | 'go2rtc'
};

function isLocalHostname(hn) {
  const h = String(hn || '').toLowerCase();
  if (!h) return false;
  return (
    h === 'localhost' ||
    h === '127.0.0.1' ||
    h.startsWith('192.168.') ||
    h.startsWith('10.') ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(h) ||
    h.endsWith('.local') ||
    h.endsWith('.lan') ||
    h.endsWith('.home') ||
    h.endsWith('.internal') ||
    h.endsWith('.fritz.box') ||
    !h.includes('.')
  );
}

function getPageLocation() {
  try {
    if (window.parent && window.parent.location && window.parent.location.hostname) {
      return window.parent.location;
    }
  } catch (_) {}
  return window.location;
}

function isMixedContentBlocked(go2Host) {
  if (!go2Host) return true;
  const loc = getPageLocation();
  const isHttps = loc.protocol === 'https:';
  const isHttpTarget = /^http:\/\//i.test(String(go2Host).trim());
  return isHttps && isHttpTarget;
}

function canUseGo2rtc() {
  if (DEMO) return false;
  const host = String(CONFIG.go2rtcHost || '').trim();
  if (!host) return false;
  if (go2rtcState.modeOverride === 'ha') return false;
  if (isMixedContentBlocked(host)) return false;
  if (go2rtcState.modeOverride === 'go2rtc') return true;
  return go2rtcState.reachable;
}

async function probeGo2rtc(force = false) {
  const rawHost = String(CONFIG.go2rtcHost || '').trim().replace(/\/+$/, '');
  if (!rawHost || DEMO) {
    go2rtcState.host = rawHost;
    go2rtcState.reachable = false;
    go2rtcState.checked = true;
    return false;
  }

  // Bei HTTPS-Seite (z. B. Nabu Casa / Remote-Domain in Companion App) + HTTP go2rtc-IP
  // blockiert der Browser das Iframe immer wegen Mixed Content -> sofort auf HA-Proxy schalten!
  if (isMixedContentBlocked(rawHost)) {
    const changed = go2rtcState.reachable !== false || !go2rtcState.checked;
    go2rtcState.host = rawHost;
    go2rtcState.reachable = false;
    go2rtcState.checked = true;
    if (changed) onCamSourceChanged();
    return false;
  }

  const now = Date.now();
  if (!force && go2rtcState.checked && go2rtcState.host === rawHost && now - go2rtcState.lastCheck < 30000) {
    return go2rtcState.reachable;
  }

  // Optimistischer Startwert anhand der aufgerufenen URL (LAN-Tablet vs. Remote-Hostname)
  if (!go2rtcState.checked || go2rtcState.host !== rawHost) {
    const loc = getPageLocation();
    go2rtcState.reachable = isLocalHostname(loc.hostname);
    go2rtcState.host = rawHost;
  }

  if (go2rtcState.checking) return go2rtcState.reachable;
  go2rtcState.checking = true;

  const prev = go2rtcState.reachable;
  let ok = false;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 1600);
    await fetch(`${rawHost}/`, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-store',
      signal: ctrl.signal
    });
    clearTimeout(timer);
    ok = true;
  } catch (_) {
    ok = false;
  }

  go2rtcState.reachable = ok;
  go2rtcState.checked = true;
  go2rtcState.checking = false;
  go2rtcState.lastCheck = Date.now();

  if (prev !== ok) {
    onCamSourceChanged();
  }
  return ok;
}

function onCamSourceChanged() {
  dropHeroMedia();
  if (typeof tick === 'function') tick(true);
}

// Bei Netzwerkwechsel (z. B. WLAN -> Mobilfunk in der Companion App) automatisch neu prüfen
window.addEventListener('online', () => probeGo2rtc(true));
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') probeGo2rtc(true);
});

/* ---------- Smarte Kamera-Entitäts-Auflösung ---------- */
function resolveCamEntity(streamName, explicitEntity = '', fallbackEntity = '') {
  const h = getHass();
  const states = (h && h.states) || {};

  const isValidCam = id => {
    if (!id) return false;
    if (DEMO) return true;
    const s = states[id];
    return !!(s && s.state !== 'unavailable');
  };

  // 1. Explizit übergebene Entität (falls in HA verfügbar)
  if (isValidCam(explicitEntity)) return explicitEntity;
  if (isValidCam(fallbackEntity)) return fallbackEntity;

  // 2. Über Stream-Namen in CONFIG.webrtcCameras nachschlagen
  const baseStream = String(streamName || '').trim().replace(/-sub$/i, '').toLowerCase();
  if (baseStream) {
    const matchInCfg = (CONFIG.webrtcCameras || []).find(c => {
      const cs = String(c.stream || '').trim().replace(/-sub$/i, '').toLowerCase();
      const cn = String(c.name || '').trim().toLowerCase();
      return (cs && cs === baseStream) || (cn && cn === baseStream);
    });
    if (matchInCfg && isValidCam(matchInCfg.entity)) {
      return matchInCfg.entity;
    }
  }

  // 3. Intelligente Suche in allen Home Assistant camera.* Entitäten
  // (hilft auch, wenn z. B. camera.eingang_standardauflosung umbenannt wurde oder Carport keine Entität eingetragen hat)
  const searchKey = baseStream || String(explicitEntity || fallbackEntity || '')
    .replace(/^camera\./i, '')
    .replace(/_(standardauflosung|sub|main|hd|stream|fluent|clear)$/i, '')
    .toLowerCase();

  if (searchKey && Object.keys(states).length) {
    const camIds = Object.keys(states).filter(k => k.startsWith('camera.') && states[k].state !== 'unavailable');
    const exact = camIds.find(k => k.toLowerCase() === `camera.${searchKey}`);
    if (exact) return exact;
    const partial = camIds.find(k => {
      const idLow = k.toLowerCase();
      const fnLow = String((states[k].attributes && states[k].attributes.friendly_name) || '').toLowerCase();
      return idLow.includes(searchKey) || fnLow.includes(searchKey);
    });
    if (partial) return partial;
  }

  // 4. Fallback auf den konfigurierten String
  return explicitEntity || fallbackEntity || '';
}

function camUrl(id, stream) {
  if (!id) return null;
  const s = S(id), tok = s && s.attributes && s.attributes.access_token;
  if (!tok) return null;
  const relPath = stream
    ? `/api/camera_proxy_stream/${id}?token=${tok}`
    : `/api/camera_proxy/${id}?token=${tok}&t=${Date.now()}`;
  const h = getHass();
  if (h && typeof h.hassUrl === 'function') {
    try { return h.hassUrl(relPath); } catch (_) {}
  }
  return relPath;
}

/* ---------- Verlustfreier HA-Kamera-Renderer (MJPEG Stream + Snapshot-Polling-Fallback) ---------- */
function startSnapshotPolling(imgEl, entityId, intervalMs = 1800) {
  const loadNext = () => {
    if (!imgEl || !imgEl.isConnected) return;
    const u = camUrl(entityId, false);
    if (!u) return;
    const pre = new Image();
    pre.onload = () => { if (imgEl.isConnected) imgEl.src = u; };
    pre.src = u;
  };
  loadNext();
  return setInterval(loadNext, intervalMs);
}

/* ---------- Persistente Hero-Kamera & Lightbox ---------- */
const heroMediaState = { type: null, key: null, el: null, timer: null };

function dropHeroMedia() {
  clearInterval(heroMediaState.timer);
  heroMediaState.timer = null;
  if (heroMediaState.el) {
    if (heroMediaState.type === 'webrtc') heroMediaState.el.src = 'about:blank';
    else { heroMediaState.el.onerror = null; heroMediaState.el.removeAttribute('src'); }
    heroMediaState.el.remove();
  }
  heroMediaState.type = null;
  heroMediaState.key = null;
  heroMediaState.el = null;
}

function syncHeroMedia(r) {
  const slot = document.getElementById('hero-bg-slot'), bg = document.getElementById('hero-bg'), banner = document.getElementById('hero-banner');
  if (!slot || !bg || !banner) return;
  banner.style.setProperty('--c', r.color || '#2a2350');

  const useGo2 = canUseGo2rtc() && !!r.webrtc;
  const resolvedCam = resolveCamEntity(r.webrtc, r.camera);
  const useHaCam = !useGo2 && !!resolvedCam && !DEMO && !!S(resolvedCam);

  if (useGo2) {
    bg.style.backgroundImage = 'none';
    const host = String(CONFIG.go2rtcHost || '').trim().replace(/\/+$/, '');
    const key = `${host}/${r.webrtc}`;
    if (heroMediaState.type !== 'webrtc' || heroMediaState.key !== key || !slot.contains(heroMediaState.el)) {
      dropHeroMedia();
      const iframe = document.createElement('iframe');
      iframe.src = `${host}/stream.html?src=${encodeURIComponent(r.webrtc)}&mode=webrtc`;
      iframe.allow = 'autoplay';
      slot.innerHTML = '';
      slot.appendChild(iframe);
      heroMediaState.type = 'webrtc';
      heroMediaState.key = key;
      heroMediaState.el = iframe;
    }
  } else if (useHaCam) {
    bg.style.backgroundImage = 'none';
    const mode = r.cameraMode || 'stream', key = `${resolvedCam}:${mode}`;
    if (heroMediaState.type !== 'cam' || heroMediaState.key !== key || !slot.contains(heroMediaState.el)) {
      dropHeroMedia();
      const img = document.createElement('img');
      img.alt = '';
      slot.innerHTML = '';
      slot.appendChild(img);
      heroMediaState.type = 'cam';
      heroMediaState.key = key;
      heroMediaState.el = img;

      const fallbackToSnapshots = () => {
        clearInterval(heroMediaState.timer);
        img.onerror = null;
        heroMediaState.timer = startSnapshotPolling(img, resolvedCam, 1800);
      };

      if (mode === 'snapshot') {
        fallbackToSnapshots();
      } else {
        const streamUrl = camUrl(resolvedCam, true);
        if (streamUrl) {
          img.onerror = fallbackToSnapshots;
          img.src = streamUrl;
        } else {
          fallbackToSnapshots();
        }
      }
    }
  } else {
    dropHeroMedia();
    slot.innerHTML = '';
    bg.style.backgroundImage = r.image ? `url('${r.image}')` : 'none';
  }
}

/* ---------- Lightbox (Vollbild-Kamera) ---------- */
const lbs = { timer: null };

function openLB(id, mode, title) {
  const lb = document.getElementById('lb'), body = document.getElementById('lbbody');
  document.getElementById('lbcap').textContent = title || '';
  clearInterval(lbs.timer);
  body.innerHTML = `<img src="" style="max-width:100%;max-height:85vh;border-radius:12px;object-fit:contain;" />`;
  const img = body.querySelector('img');
  const poll = () => {
    clearInterval(lbs.timer);
    img.onerror = null;
    lbs.timer = startSnapshotPolling(img, id, 1000);
  };
  if (mode === 'snapshot') poll();
  else {
    const u = camUrl(id, true);
    if (u) {
      img.onerror = poll;
      img.src = u;
    } else {
      poll();
    }
  }
  lb.classList.add('show');
}

function openLBWebRtc(stream, title) {
  const lb = document.getElementById('lb'), body = document.getElementById('lbbody');
  document.getElementById('lbcap').textContent = title || '';
  clearInterval(lbs.timer);
  const hdStream = String(stream || '').replace(/-sub$/i, '');
  const host = String(CONFIG.go2rtcHost || '').trim().replace(/\/+$/, '');
  const srcUrl = `${host}/stream.html?src=${encodeURIComponent(hdStream)}&mode=webrtc`;
  body.innerHTML = `<iframe src="${srcUrl}" style="width:90vw;height:85vh;max-width:1280px;border:0;border-radius:12px;" allow="autoplay"></iframe>`;
  lb.classList.add('show');
}

function openSmartCamLB(stream, entity, fallbackEntity, mode, title) {
  if (canUseGo2rtc() && stream) {
    openLBWebRtc(stream, title);
    return;
  }
  const resolved = resolveCamEntity(stream, entity, fallbackEntity);
  if (resolved && S(resolved)) {
    openLB(resolved, mode || 'stream', title);
    return;
  }
  if (stream && CONFIG.go2rtcHost && !isMixedContentBlocked(CONFIG.go2rtcHost)) {
    openLBWebRtc(stream, title);
    return;
  }
  toast('Keine erreichbare Kamera-Quelle gefunden (Entität prüfen)');
}

function closeLB() {
  clearInterval(lbs.timer);
  lbs.timer = null;
  document.getElementById('lbbody').innerHTML = '';
  document.getElementById('lb').classList.remove('show');
}

/* ---------- Kamera-Grid-Ansicht (IntersectionObserver + Auto-Fallback) ---------- */
let camObserver = null;
const camCardTimers = new WeakMap();

function clearCamWrapTimer(wrap) {
  const t = camCardTimers.get(wrap);
  if (t) {
    clearInterval(t);
    camCardTimers.delete(wrap);
  }
}

function teardownCamObserver() {
  if (camObserver) {
    camObserver.disconnect();
    camObserver = null;
  }
  document.querySelectorAll('.cam-wrap').forEach(clearCamWrapTimer);
}

function initCamObserver() {
  teardownCamObserver();
  const rootEl = document.querySelector('.main');
  camObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const wrap = entry.target;
      const streamUrl = wrap.dataset.src;
      const camEntity = wrap.dataset.entity;
      const badge = wrap.closest('.cam-card')?.querySelector('.cam-badge');

      if (entry.isIntersecting) {
        if (streamUrl && canUseGo2rtc()) {
          if (!wrap.querySelector('iframe')) {
            clearCamWrapTimer(wrap);
            const iframe = document.createElement('iframe');
            iframe.src = streamUrl;
            iframe.allow = 'autoplay';
            wrap.innerHTML = '';
            wrap.appendChild(iframe);
            if (badge) { badge.className = 'cam-badge live'; badge.textContent = '● LIVE (RTC)'; }
          }
        } else if (camEntity) {
          if (!wrap.querySelector('img')) {
            clearCamWrapTimer(wrap);
            const img = document.createElement('img');
            img.alt = '';
            wrap.innerHTML = '';
            wrap.appendChild(img);
            const fallbackPoll = () => {
              clearCamWrapTimer(wrap);
              img.onerror = null;
              const t = startSnapshotPolling(img, camEntity, 1800);
              camCardTimers.set(wrap, t);
            };
            const u = camUrl(camEntity, true);
            if (u) {
              img.onerror = fallbackPoll;
              img.src = u;
            } else {
              fallbackPoll();
            }
            if (badge) { badge.className = 'cam-badge live'; badge.textContent = '● LIVE (HA)'; }
          }
        } else {
          wrap.innerHTML = `<div class="cam-placeholder">${ic('camera', 26)}<span>Keine Kamera-Entität für Fernzugriff hinterlegt</span></div>`;
          if (badge) { badge.className = 'cam-badge standby'; badge.textContent = 'OFFLINE'; }
        }
      } else {
        clearCamWrapTimer(wrap);
        wrap.innerHTML = `<div class="cam-placeholder">${ic('camera', 26)}<span>Stream pausiert</span></div>`;
        if (badge) { badge.className = 'cam-badge standby'; badge.textContent = 'STANDBY'; }
      }
    });
  }, { root: rootEl, threshold: 0.25 });
  document.querySelectorAll('.cam-wrap').forEach(el => camObserver.observe(el));
}

function kamerasView() {
  const useGo2 = canUseGo2rtc();
  const host = String(CONFIG.go2rtcHost || '').trim().replace(/\/+$/, '');
  const modeLabel = useGo2 ? 'go2rtc (Lokales Netzwerk)' : 'Home Assistant Proxy (Companion App / Remote)';
  const colsRaw = String(CONFIG.camCols || 'auto');
  const parsed = parseColsMode(colsRaw, 'auto', 2);
  const colCls = parsed.mode === 'cols' ? 'cols-custom' : '';
  const colStyle = parsed.mode === 'cols' ? `style="--custom-cols:${parsed.cols}"` : '';

  const visibleCams = (CONFIG.webrtcCameras || []).map((c, i) => ({ c, i })).filter(({ c }) => c && (c.show !== false || ui.editMode));
  const cards = visibleCams.map(({ c, i }) => {
    const resolvedEntity = resolveCamEntity(c.stream, c.entity);
    const srcUrl = (useGo2 && host && c.stream)
      ? `${host}/stream.html?src=${encodeURIComponent(c.stream)}&mode=webrtc`
      : '';
    const qeBar = ui.editMode ? `<div class="qe-bar">
      <span class="qe-title">📹 ${esc(c.name || 'Kamera')}</span>
      <div class="qe-btns">
        <button class="qe-btn" data-act="qeCamMove" data-i="${i}" data-dir="-1" title="Nach links/oben">↑</button>
        <button class="qe-btn" data-act="qeCamMove" data-i="${i}" data-dir="1" title="Nach rechts/unten">↓</button>
        <button class="qe-btn ${c.show === false ? 'off' : ''}" data-act="qeCamVis" data-i="${i}" title="Ein-/Ausblenden">${c.show === false ? '🙈 Ausgeblendet' : '👁️ Sichtbar'}</button>
        <button class="qe-btn" data-act="cfgOpenTab" data-tab="sec" title="Im Editor öffnen">⚙️</button>
      </div>
    </div>` : '';
    return `<div class="qe-wrap ${c.show === false ? 'qe-hidden' : ''}">${qeBar}<section class="cam-card" style="cursor:pointer" data-act="camCardBig" data-webrtc="${esc(c.stream || '')}" data-cam="${esc(resolvedEntity)}" data-title="${esc(c.name || 'Kamera')}">
      <div class="cam-hdr">
        <span>${esc(c.name)}</span>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="cam-badge standby">STANDBY</span>
          <span class="mut sm" title="Antippen zum Vergrößern">${ic('expand', 14)}</span>
        </div>
      </div>
      <div class="cam-wrap" data-src="${esc(srcUrl)}" data-entity="${esc(resolvedEntity)}">
        <div class="cam-placeholder">${ic('camera', 26)}<span>Wird bei Sichtbarkeit geladen…</span></div>
      </div>
    </section></div>`;
  }).join('');

  const topToolbar = ui.editMode ? `<div class="qe-page-bar">
    <span>📐 <b>Kamera-Spalten:</b></span>
    <button class="chip ${parsed.mode === 'auto' ? 'on' : ''}" data-act="qeSetCamCols" data-cols="auto">Automatisch</button>
    ${[1, 2, 3, 4].map(n => `<button class="chip ${parsed.mode === 'cols' && parsed.cols === n ? 'on' : ''}" data-act="qeSetCamCols" data-cols="${n}">${n} ${n === 1 ? 'Spalte' : 'Spalten'}</button>`).join('')}
    <label class="qe-col-custom"><span>Frei:</span><input type="number" min="1" max="12" class="qe-col-input" data-act="qeCamColsInput" value="${parsed.mode === 'cols' ? parsed.cols : ''}" placeholder="1-12"><span>Sp.</span></label>
  </div>` : '';

  return `<div class="ktop" style="display:flex;justify-content:space-between;align-items:flex-end;gap:12px;flex-wrap:wrap">
    <div>
      <div class="hi">Sicherheit</div>
      <div class="name">Kamera-Streams</div>
      <div class="greet">Aktiver Modus: <strong style="color:var(--acc2)">${esc(modeLabel)}</strong> · Antippen einer Kamera öffnet Vollbild.</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      <button class="pill ${go2rtcState.modeOverride === 'auto' ? 'on' : ''}" data-act="camMode" data-mode="auto" title="Zuhause go2rtc, unterwegs automatisch HA-Stream">⚡ Auto (LAN / App)</button>
      <button class="pill ${go2rtcState.modeOverride === 'ha' ? 'on' : ''}" data-act="camMode" data-mode="ha" title="Immer über Home Assistant streamen (funktioniert weltweit)">🌐 Immer HA-Stream</button>
      ${CONFIG.go2rtcHost ? `<button class="pill ${go2rtcState.modeOverride === 'go2rtc' ? 'on' : ''}" data-act="camMode" data-mode="go2rtc" title="Immer lokalen go2rtc-Server erzwingen">🏠 Immer go2rtc</button>` : ''}
    </div>
  </div>
  ${topToolbar}
  <div class="cam-grid ${colCls}" ${colStyle}>${cards || '<div class="mut">Keine Kameras konfiguriert.</div>'}</div>`;
}

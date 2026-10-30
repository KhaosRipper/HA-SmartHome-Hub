/* ==========================================================================
   Smart Home Hub – Main Application & Event Router (app.js)
   Dynamische Spalten-Render-Engine, Quick-Edit, Detail-Popups & Init
   ========================================================================== */

/* ---------- In-Place Render-Engine (mit persistentem Hero-Stream & freiem Spalten-Layout) ---------- */
let lastRenderedView = null;

const DASH_CARD_EDITOR_TAB = {
  hero: 'raeume',
  devices: 'geraete',
  extra_tabs: 'geraete',
  covers: 'geraete',
  calendar: 'energie',
  status: 'kameras',
  climate: 'allgemein',
  metrics: 'energie',
  security: 'kameras',
  lights: 'geraete',
  trash: 'energie'
};

function renderDashCardHtml(id) {
  switch (id) {
    case 'devices': return devicesCard(null, 'Geräteübersicht', 'geraete');
    case 'extra_tabs': return extraDeviceTabsCards();
    case 'covers': return coversCard();
    case 'calendar': return homeCalendarCard();
    case 'status': return rightTopStatus();
    case 'climate': return climateCard();
    case 'metrics': return (CONFIG.metrics || []).map(metricCard).join('');
    case 'security': return securityCard();
    case 'lights': return lightsCard();
    case 'trash': return homeTrashCard();
    default: return '';
  }
}

function buildDashQuickEditBar(item, idx, total, btnColsCount = 4) {
  if (!ui.editMode) return '';
  const colVal = String(item.col || '1');
  const scopeVal = item.scope || 'all';
  const edTab = DASH_CARD_EDITOR_TAB[item.id] || 'layout';
  const colOpts = [...Array.from({ length: btnColsCount }, (_, i) => String(i + 1)), 'full'];
  return `<div class="qe-bar">
    <span class="qe-title">${esc(item.label || item.id)}</span>
    <div class="qe-btns">
      <button class="qe-btn" data-act="qeDashMove" data-i="${idx}" data-dir="-1" ${idx === 0 ? 'disabled' : ''} title="Nach oben">↑</button>
      <button class="qe-btn" data-act="qeDashMove" data-i="${idx}" data-dir="1" ${idx === total - 1 ? 'disabled' : ''} title="Nach unten">↓</button>
      ${colOpts.map(c => `<button class="qe-btn ${colVal === c ? 'on' : ''}" data-act="qeDashCol" data-i="${idx}" data-col="${c}" title="Spalte zuweisen">${c === 'full' ? 'Voll' : 'Sp.' + c}</button>`).join('')}
      <button class="qe-btn ${scopeVal === 'home' ? 'on' : ''}" data-act="qeDashScope" data-i="${idx}" title="Zuständigkeit: Alle Räume vs. Nur Home">${scopeVal === 'home' ? '🏠 Nur Home' : '🌐 Alle Räume'}</button>
      <button class="qe-btn ${item.show === false ? 'off' : ''}" data-act="qeDashVis" data-i="${idx}" title="Ein-/Ausblenden">${item.show === false ? '🙈' : '👁️'}</button>
      <button class="qe-btn" data-act="cfgOpenTab" data-tab="${esc(edTab)}" title="Im Editor anpassen">⚙️</button>
    </div>
  </div>`;
}

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
    if (!document.getElementById('dash-root')) {
      document.getElementById('app').innerHTML = `
        <div id="side-wrap" style="display:contents">${sidebar()}</div>
        <main class="main" id="dash-root">
          <div id="mtabs-slot"></div>
          <div id="dash-qe-toolbar"></div>
          <div id="dash-full-top" class="col" style="margin-bottom:16px;display:none"></div>
          <div class="grid" id="dash-grid"></div>
          <div id="hero-parking" style="display:none">
            <div id="hero-qe-wrap" class="qe-wrap">
              <div id="hero-qe-slot"></div>
              <section class="hero-banner" id="hero-banner">
                <div class="hero-bg" id="hero-bg"><div class="hero-bg-slot" id="hero-bg-slot"></div></div>
                <div class="hero-fade"></div>
                <div id="hero-overlay-slot" style="display:contents"></div>
              </section>
            </div>
          </div>
        </main>
        ${DEMO ? '<div class="demo">DEMO-MODUS – keine Verbindung zu Home Assistant</div>' : ''}`;
    } else {
      const sideWrap = document.getElementById('side-wrap');
      const nextSide = sidebar();
      if (sideWrap && sideWrap._lastHtml !== nextSide) {
        sideWrap._lastHtml = nextSide;
        sideWrap.innerHTML = nextSide;
      }
    }

    const mtabsEl = document.getElementById('mtabs-slot');
    const nextMtabs = mtabs();
    if (mtabsEl && mtabsEl._lastHtml !== nextMtabs) {
      mtabsEl._lastHtml = nextMtabs;
      mtabsEl.innerHTML = nextMtabs;
    }

    const colsRaw = String(CONFIG.dashboardCols || '2-asym');
    const parsed = parseColsMode(colsRaw, 'asym', 2);
    const numCols = parsed.mode === 'cols' ? parsed.cols : 2;
    const btnColsCount = clamp(Math.max(numCols, 4), 2, 12);

    const qeToolbar = document.getElementById('dash-qe-toolbar');
    if (qeToolbar) {
      const nextToolbar = ui.editMode ? `<div class="qe-page-bar">
        <span>✏️ <b>Quick-Edit</b> · Startseiten-Spalten:</span>
        <button class="chip ${parsed.mode === 'asym' ? 'on' : ''}" data-act="qeDashCols" data-cols="2-asym">2 Spalten (Links breit / Rechts kompakt)</button>
        ${[1, 2, 3, 4].map(n => `<button class="chip ${parsed.mode === 'cols' && parsed.cols === n ? 'on' : ''}" data-act="qeDashCols" data-cols="${n}-col">${n} ${n === 1 ? 'Spalte' : 'Spalten'}</button>`).join('')}
        <label class="qe-col-custom" title="Beliebige Spaltenanzahl eingeben (z. B. 5 oder 6)">
          <span>Frei:</span>
          <input type="number" min="1" max="12" class="qe-col-input" data-act="qeDashColsInput" value="${parsed.mode === 'cols' ? parsed.cols : ''}" placeholder="1-12">
          <span>Sp.</span>
        </label>
        <button class="chip" data-act="cfgOpenTab" data-tab="layout">📐 Layout-Tab</button>
        <button class="chip on" data-act="toggleEditMode">✓ Fertig</button>
      </div>` : '';
      if (qeToolbar._lastHtml !== nextToolbar) {
        qeToolbar._lastHtml = nextToolbar;
        qeToolbar.innerHTML = nextToolbar;
      }
    }

    const layout = Array.isArray(CONFIG.dashboardLayout) && CONFIG.dashboardLayout.length
      ? CONFIG.dashboardLayout
      : DEFAULT_DASHBOARD_LAYOUT();

    const heroWrap = document.getElementById('hero-qe-wrap');
    const heroParking = document.getElementById('hero-parking');
    const dashGrid = document.getElementById('dash-grid');
    const colSig = `${parsed.mode}:${numCols}`;

    // Spalten-Container im Grid NUR dann neu aufbauen, wenn sich Spaltenanzahl/Modus geändert hat!
    // Dadurch wird ein laufendes Kamera-Iframe im Hero-Banner niemals unnötig im DOM verschoben!
    if (dashGrid && dashGrid.dataset.colSig !== colSig) {
      if (heroWrap && heroParking && dashGrid.contains(heroWrap)) {
        heroParking.appendChild(heroWrap);
      }
      if (parsed.mode === 'asym') {
        dashGrid.className = 'grid';
        dashGrid.style.removeProperty('--custom-cols');
      } else {
        dashGrid.className = 'grid cols-custom';
        dashGrid.style.setProperty('--custom-cols', String(numCols));
      }
      let colsHtml = '';
      for (let c = 1; c <= numCols; c++) {
        colsHtml += `<div class="col" id="dash-col-${c}"></div>`;
      }
      dashGrid.innerHTML = colsHtml;
      dashGrid.dataset.colSig = colSig;
    }

    const fullTopEl = document.getElementById('dash-full-top');
    const buckets = { full: [] };
    for (let c = 1; c <= numCols; c++) buckets[c] = [];
    let heroVisible = false;
    let heroTargetKey = null;

    layout.forEach((item, idx) => {
      if (!item || !item.id) return;
      const inScope = (item.scope || 'all') !== 'home' || isHome;
      if (!inScope && !ui.editMode) return;
      const isShown = item.show !== false;
      if (!isShown && !ui.editMode) return;

      let targetCol = item.col === 'full' ? 'full' : (parseInt(item.col, 10) || 1);
      if (targetCol !== 'full') targetCol = clamp(targetCol, 1, numCols);

      const qeBar = buildDashQuickEditBar(item, idx, layout.length, btnColsCount);

      if (item.id === 'hero') {
        heroVisible = isShown && inScope;
        heroTargetKey = targetCol;
        const heroQeSlot = document.getElementById('hero-qe-slot');
        if (heroQeSlot && heroQeSlot._lastHtml !== qeBar) {
          heroQeSlot._lastHtml = qeBar;
          heroQeSlot.innerHTML = qeBar;
        }
        if (heroWrap) {
          const nextCls = `qe-wrap ${(!isShown || !inScope) ? 'qe-hidden' : ''}`.trim();
          if (heroWrap.className !== nextCls) heroWrap.className = nextCls;
        }
        buckets[targetCol].push('__HERO_PLACEHOLDER__');
      } else {
        const cardHtml = renderDashCardHtml(item.id);
        if (!cardHtml && !ui.editMode) return;
        const inner = cardHtml || `<section class="card"><div class="mut sm">${esc(item.label || item.id)} (aktuell leer / nur im Home-Tab)</div></section>`;
        buckets[targetCol].push(`<div class="qe-wrap ${(!isShown || !inScope) ? 'qe-hidden' : ''}">${qeBar}${inner}</div>`);
      }
    });

    // Falls Hero ausgeblendet ist, in hero-parking parken, bevor die Spalten geleert werden
    if (heroTargetKey === null && heroWrap && heroParking && !heroParking.contains(heroWrap)) {
      heroParking.appendChild(heroWrap);
    }

    const mountBucket = (el, arr) => {
      if (!el) return;
      const heroIdx = arr.indexOf('__HERO_PLACEHOLDER__');
      if (heroIdx === -1) {
        if (heroWrap && el.contains(heroWrap) && heroParking) {
          heroParking.appendChild(heroWrap);
        }
        const joined = arr.join('');
        if (el._lastHtml !== joined) {
          el._lastHtml = joined;
          el.innerHTML = joined;
        }
      } else {
        const beforeHtml = arr.slice(0, heroIdx).join('');
        const afterHtml = arr.slice(heroIdx + 1).join('');
        let beforeSlot = document.getElementById('hero-before-slot');
        let afterSlot = document.getElementById('hero-after-slot');
        const alreadyMountedHere = !!(
          heroWrap &&
          heroWrap.parentElement === el &&
          beforeSlot &&
          beforeSlot.parentElement === el &&
          afterSlot &&
          afterSlot.parentElement === el
        );

        if (!alreadyMountedHere) {
          // Nur beim allerersten Laden oder wenn der Nutzer die Spalte des Hero-Banners wechselt:
          if (heroWrap && heroParking && el.contains(heroWrap)) {
            heroParking.appendChild(heroWrap);
          }
          el._lastHtml = null;
          el.innerHTML = '<div class="col-part" id="hero-before-slot"></div><div id="hero-mount-point"></div><div class="col-part" id="hero-after-slot"></div>';
          const mp = document.getElementById('hero-mount-point');
          if (mp && heroWrap) mp.replaceWith(heroWrap);
          beforeSlot = document.getElementById('hero-before-slot');
          afterSlot = document.getElementById('hero-after-slot');
        }
        // In 99.9% aller Ticks bleibt heroWrap (samt Live-Kamera-Iframe) exakt an Ort und Stelle!
        if (beforeSlot && beforeSlot._lastHtml !== beforeHtml) {
          beforeSlot._lastHtml = beforeHtml;
          beforeSlot.innerHTML = beforeHtml;
        }
        if (afterSlot && afterSlot._lastHtml !== afterHtml) {
          afterSlot._lastHtml = afterHtml;
          afterSlot.innerHTML = afterHtml;
        }
      }
    };

    if (fullTopEl) {
      fullTopEl.style.display = buckets.full.length ? 'flex' : 'none';
      mountBucket(fullTopEl, buckets.full);
    }
    for (let c = 1; c <= numCols; c++) {
      mountBucket(document.getElementById(`dash-col-${c}`), buckets[c]);
    }

    if (heroVisible || ui.editMode) {
      const banner = document.getElementById('hero-banner');
      if (banner) {
        banner.dataset.name = r.name || '';
        banner.dataset.webrtc = r.webrtc || '';
        banner.dataset.cam = r.camera || '';
        banner.dataset.mode = r.cameraMode || 'stream';
      }
      const overlaySlot = document.getElementById('hero-overlay-slot');
      if (overlaySlot) {
        const nextOv = heroOverlayContent();
        const nextSig = nextOv.replace(/<span id="hub-time">[^<]*<\/span>/, '');
        if (overlaySlot._lastSig !== nextSig) {
          overlaySlot._lastSig = nextSig;
          overlaySlot.innerHTML = nextOv;
        }
      }
      syncHeroMedia(r);
    } else {
      dropHeroMedia();
    }
  } else if (ui.view === 'kameras') {
    const camSig = `${canUseGo2rtc()}|${go2rtcState.modeOverride}|${CONFIG.go2rtcHost || ''}|${CONFIG.camCols || 'auto'}|${ui.editMode}|${JSON.stringify(CONFIG.webrtcCameras || [])}`;
    const existingCamRoot = document.getElementById('kameras-root');
    if (existingCamRoot && existingCamRoot.dataset.camSig === camSig) {
      // Kamera-Seite ist bereits gerendert und unverändert -> laufende Kamera-Streams nicht neu laden!
      const sideWrap = document.getElementById('side-wrap');
      if (sideWrap) sideWrap.innerHTML = sidebar();
      const mtabsSlot = document.getElementById('mtabs-slot');
      if (mtabsSlot) mtabsSlot.innerHTML = mtabs();
    } else {
      document.getElementById('app').innerHTML = `
        <div id="side-wrap" style="display:contents">${sidebar()}</div>
        <main class="main" id="kameras-root" data-cam-sig="${esc(camSig)}">
          <div id="mtabs-slot">${mtabs()}</div>
          ${kamerasView()}
        </main>
        ${DEMO ? '<div class="demo">DEMO-MODUS – keine Verbindung zu Home Assistant</div>' : ''}`;
      initCamObserver();
    }
  } else {
    let pageHtml = '';
    if (ui.view === 'klima') pageHtml = klimaView();
    else if (ui.view.startsWith('page:')) pageHtml = customPageView(ui.view.slice(5));
    else pageHtml = klimaView();

    const subRoot = document.getElementById('subpage-root');
    if (subRoot && subRoot.dataset.view === ui.view) {
      const sideWrap = document.getElementById('side-wrap');
      const nextSide = sidebar();
      if (sideWrap && sideWrap._lastHtml !== nextSide) {
        sideWrap._lastHtml = nextSide;
        sideWrap.innerHTML = nextSide;
      }
      const mtabsSlot = document.getElementById('mtabs-slot');
      const nextMtabs = mtabs();
      if (mtabsSlot && mtabsSlot._lastHtml !== nextMtabs) {
        mtabsSlot._lastHtml = nextMtabs;
        mtabsSlot.innerHTML = nextMtabs;
      }
      const subContent = document.getElementById('subpage-content');
      if (subContent && subContent._lastHtml !== pageHtml) {
        // Falls auf einer eigenen Seite ein Kamera-/Iframe-Widget aktiv läuft, dieses beim Tick nicht zerstören
        const hasLiveIframe = !!subContent.querySelector('iframe') && !ui.editMode;
        if (!hasLiveIframe) {
          subContent._lastHtml = pageHtml;
          subContent.innerHTML = pageHtml;
        }
      }
    } else {
      document.getElementById('app').innerHTML = `
        <div id="side-wrap" style="display:contents">${sidebar()}</div>
        <main class="main" id="subpage-root" data-view="${esc(ui.view)}">
          <div id="mtabs-slot">${mtabs()}</div>
          <div id="subpage-content">${pageHtml}</div>
        </main>
        ${DEMO ? '<div class="demo">DEMO-MODUS – keine Verbindung zu Home Assistant</div>' : ''}`;
      const subContent = document.getElementById('subpage-content');
      if (subContent) subContent._lastHtml = pageHtml;
    }
  }

  const newMain = document.querySelector('.main'), newSide = document.querySelector('.side');
  if (newMain) newMain.scrollTop = mainScroll;
  if (newSide) newSide.scrollTop = sideScroll;
  mountPFC();

  // Falls ein Geräte-Detail-Modal offen ist, live aktualisieren (sofern kein Slider gezogen wird)
  if (sm.open && !document.activeElement?.classList?.contains('dd-slider')) {
    if (sm.mode === 'devDetail') renderDeviceDetailModal();
    else if (sm.mode === 'lgrpDetail') renderLightGroupModal();
  }
}

/* ---------- Entitäten-Überwachung & Tick ---------- */
let ENTITIES = [];
function rebuildEntitiesList() {
  const ids = [];
  if (CONFIG.greetingEntity) ids.push(CONFIG.greetingEntity);

  (CONFIG.headerBadgeItems || []).forEach(b => {
    ids.push(b.entity1, b.entity2, b.conditionEnt);
  });

  (CONFIG.powerFlow || []).forEach(p => ids.push(p.entity));
  (CONFIG.webrtcCameras || []).forEach(c => ids.push(c.entity));
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
    ids.push(m.entity, m.chart, m.yesterdayEntity, m.cmpEntity);
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
    if (Array.isArray(w.entities)) ids.push(...w.entities);
    if (w.items) w.items.forEach(it => ids.push(it.entity));
  }));
  ENTITIES = [...new Set(ids.filter(Boolean))];
}

let lastSig = '';
function tick(force) {
  if (ui.view === 'kameras') {
    const camSig = `#kameras:${canUseGo2rtc()}:${go2rtcState.modeOverride}:${ui.editMode}:${CONFIG.camCols}`;
    if (force || lastSig !== camSig) { lastSig = camSig; render(); }
    return;
  }
  if (coverDrag.active) return;
  const sig = ENTITIES.map(id => { const s = S(id); if (!s) return '-'; const a = s.attributes || {}; return [s.state, a.temperature, a.current_temperature, a.humidity, a.wind_speed, a.pressure, a.precipitation, a.hvac_action, a.current_position, a.fan_mode, a.preset_mode, a.percentage, a.brightness, a.color_temp_kelvin, a.volume_level].join('|'); }).join(';')
    + `#${ui.room}${ui.view}${ui.showAll}${ui.editMode}${ui.seriesVer}${homeCalendarState.loadedAt}${weatherForecastState.loadedAt}${ui.unlockArmedUntil > Date.now()}:${canUseGo2rtc()}:${go2rtcState.modeOverride}`;
  if (force || sig !== lastSig) { lastSig = sig; render(); }
}

function runtimeTick() {
  document.querySelectorAll('.rt').forEach(el => { el.textContent = fmtDur(Date.now() - +el.dataset.since); });

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

/* ---------- Live-Slider im Geräte-Detail-Popup ---------- */
let ddSliderTimer = null;
document.addEventListener('input', ev => {
  const el = ev.target;
  if (!el || !el.dataset || !el.dataset.act) return;
  const act = el.dataset.act;

  if (act === 'ddLightBri') {
    const v = parseInt(el.value, 10) || 0;
    const lbl = document.getElementById('dd-bri-lbl');
    if (lbl) lbl.textContent = v + '%';
    clearTimeout(ddSliderTimer);
    ddSliderTimer = setTimeout(() => {
      if (v <= 0) call('light', 'turn_off', { entity_id: el.dataset.e });
      else call('light', 'turn_on', { entity_id: el.dataset.e, brightness_pct: v });
    }, 120);
  } else if (act === 'ddLightCt') {
    const k = parseInt(el.value, 10) || 3000;
    const lbl = document.getElementById('dd-ct-lbl');
    if (lbl) lbl.textContent = k + ' K';
    clearTimeout(ddSliderTimer);
    ddSliderTimer = setTimeout(() => {
      call('light', 'turn_on', { entity_id: el.dataset.e, color_temp_kelvin: k });
    }, 120);
  } else if (act === 'ddLightColorPick') {
    const rgb = hexToRgb(el.value);
    clearTimeout(ddSliderTimer);
    ddSliderTimer = setTimeout(() => {
      call('light', 'turn_on', { entity_id: el.dataset.e, rgb_color: rgb });
    }, 120);
  } else if (act === 'ddGrpBri') {
    const v = parseInt(el.value, 10) || 0;
    const lbl = document.getElementById('dd-grp-bri-lbl');
    if (lbl) lbl.textContent = v + '%';
    const g = (CONFIG.lights || [])[+el.dataset.i];
    if (g && g.entities) {
      const targetEnts = getGroupToggleEntities(g);
      const ents = targetEnts.length ? targetEnts : g.entities;
      clearTimeout(ddSliderTimer);
      ddSliderTimer = setTimeout(() => {
        if (v <= 0) call('light', 'turn_off', { entity_id: ents });
        else call('light', 'turn_on', { entity_id: ents, brightness_pct: v });
      }, 140);
    }
  } else if (act === 'ddMediaVol') {
    const v = parseInt(el.value, 10) || 0;
    const lbl = document.getElementById('dd-vol-lbl');
    if (lbl) lbl.textContent = v + '%';
    clearTimeout(ddSliderTimer);
    ddSliderTimer = setTimeout(() => {
      call('media_player', 'volume_set', { entity_id: el.dataset.e, volume_level: v / 100 });
    }, 120);
  } else if (act === 'ddCoverPos') {
    const v = parseInt(el.value, 10) || 0;
    const lbl = document.getElementById('dd-cov-lbl');
    if (lbl) lbl.textContent = v + '%';
    clearTimeout(ddSliderTimer);
    ddSliderTimer = setTimeout(() => {
      call('cover', 'set_cover_position', { entity_id: el.dataset.e, position: v });
    }, 150);
  } else if (act === 'ddClimTemp') {
    const v = parseFloat(el.value) || 21;
    const lbl = document.getElementById('dd-clim-lbl');
    if (lbl) lbl.textContent = fmt(v, 1) + ' °C';
    clearTimeout(ddSliderTimer);
    ddSliderTimer = setTimeout(() => {
      call('climate', 'set_temperature', { entity_id: el.dataset.e, temperature: v });
    }, 150);
  } else if (act === 'qeDashColsInput') {
    const n = clamp(parseInt(el.value, 10) || 0, 1, 12);
    if (n >= 1) {
      CONFIG.dashboardCols = `${n}-col`;
      saveConfigToServer(CONFIG);
      tick(true);
    }
  } else if (act === 'qePageColsInput') {
    const n = clamp(parseInt(el.value, 10) || 0, 1, 12);
    const pg = (CONFIG.customPages || [])[+el.dataset.pi];
    if (pg && n >= 1) {
      pg.layout = `${n}col`;
      saveConfigToServer(CONFIG);
      tick(true);
    }
  } else if (act === 'qeKlimaColsInput') {
    const n = clamp(parseInt(el.value, 10) || 0, 1, 12);
    if (n >= 1) {
      CONFIG.klimaCols = String(n);
      saveConfigToServer(CONFIG);
      tick(true);
    }
  } else if (act === 'qeCamColsInput') {
    const n = clamp(parseInt(el.value, 10) || 0, 1, 12);
    if (n >= 1) {
      CONFIG.camCols = String(n);
      saveConfigToServer(CONFIG);
      tick(true);
    }
  }
});

/* ---------- Long-Press & Rechtsklick für Lichter-Kacheln ---------- */
let lgrpHoldTimer = null;
let lgrpLongPressed = false;
let lgrpStartX = 0;
let lgrpStartY = 0;

document.addEventListener('pointerdown', ev => {
  if (ev.target.closest('.tile-dots-btn')) return;
  const tile = ev.target.closest('.tile-light[data-act="lgrp"]');
  if (!tile) return;
  if (ev.button != null && ev.button !== 0) return;
  lgrpLongPressed = false;
  lgrpStartX = ev.clientX;
  lgrpStartY = ev.clientY;
  const idx = +tile.dataset.i;
  clearTimeout(lgrpHoldTimer);
  lgrpHoldTimer = setTimeout(() => {
    lgrpLongPressed = true;
    try { if (navigator.vibrate) navigator.vibrate(25); } catch (e) {}
    openLightGroupModal(idx);
  }, 450);
});

document.addEventListener('pointermove', ev => {
  if (!lgrpHoldTimer) return;
  if (Math.hypot(ev.clientX - lgrpStartX, ev.clientY - lgrpStartY) > 10) {
    clearTimeout(lgrpHoldTimer);
    lgrpHoldTimer = null;
  }
});

['pointerup', 'pointercancel', 'pointerleave'].forEach(evName => {
  document.addEventListener(evName, () => {
    if (lgrpHoldTimer) {
      clearTimeout(lgrpHoldTimer);
      lgrpHoldTimer = null;
    }
  });
});

document.addEventListener('contextmenu', ev => {
  const tile = ev.target.closest('.tile-light[data-act="lgrp"]');
  if (!tile) return;
  ev.preventDefault();
  clearTimeout(lgrpHoldTimer);
  lgrpHoldTimer = null;
  lgrpLongPressed = false;
  openLightGroupModal(+tile.dataset.i);
});

/* ---------- Klick-Steuerung ---------- */
document.addEventListener('click', ev => {
  const el = ev.target.closest('[data-act]'); if (!el) return;
  const act = el.dataset.act, c = activeClimate(), cs = S(c.entity);
  if (act === 'lgrp' && el.classList.contains('tile-light') && lgrpLongPressed) {
    lgrpLongPressed = false;
    return;
  }
  if (act === 'noop' || act === 'cPos') return;
  if (act === 'lbClose') { closeLB(); return; }
  if (act === 'lbFullscreen') { toggleLBFullscreen(); return; }
  if (act === 'lbSwitchSource') { switchLBSource(); return; }
  if (act === 'pinClose') { document.getElementById('pinmodal').classList.remove('show'); return; }
  if (act === 'pinkey') { handlePinKey(el.dataset.k); return; }

  /* ---------- PHASE 4: QUICK-EDIT MODUS (Live auf dem Dashboard & Unterseiten) ---------- */
  if (act === 'toggleEditMode') {
    if (!ui.editMode) {
      requirePin('editor', () => {
        ui.editMode = true;
        toast('Quick-Edit aktiv – verschiebe Karten & Spalten direkt per Klick!');
        tick(true);
      }, 'Quick-Edit entsperren');
    } else {
      ui.editMode = false;
      saveConfigToServer(CONFIG);
      tick(true);
    }
    return;
  }
  if (act === 'cfgOpenTab') {
    openCfgEditor(el.dataset.tab || 'allgemein');
    return;
  }
  if (act === 'qeDashCols') {
    CONFIG.dashboardCols = el.dataset.cols || '2-asym';
    saveConfigToServer(CONFIG);
    tick(true);
    return;
  }
  if (act === 'qeDashMove') {
    moveItem(CONFIG.dashboardLayout, +el.dataset.i, +el.dataset.dir);
    saveConfigToServer(CONFIG);
    tick(true);
    return;
  }
  if (act === 'qeDashCol') {
    const item = CONFIG.dashboardLayout[+el.dataset.i];
    if (item) {
      item.col = el.dataset.col === 'full' ? 'full' : (parseInt(el.dataset.col, 10) || 1);
      saveConfigToServer(CONFIG);
      tick(true);
    }
    return;
  }
  if (act === 'qeDashScope') {
    const item = CONFIG.dashboardLayout[+el.dataset.i];
    if (item) {
      item.scope = item.scope === 'home' ? 'all' : 'home';
      saveConfigToServer(CONFIG);
      tick(true);
    }
    return;
  }
  if (act === 'qeDashVis') {
    const item = CONFIG.dashboardLayout[+el.dataset.i];
    if (item) {
      item.show = item.show === false ? true : false;
      saveConfigToServer(CONFIG);
      tick(true);
    }
    return;
  }
  if (act === 'qeSetKlimaCols') {
    CONFIG.klimaCols = el.dataset.cols || 'auto';
    saveConfigToServer(CONFIG);
    tick(true);
    return;
  }
  if (act === 'qeKlimaMove') {
    moveItem(CONFIG.climateRooms, +el.dataset.i, +el.dataset.dir);
    saveConfigToServer(CONFIG);
    tick(true);
    return;
  }
  if (act === 'qeKlimaVis') {
    const r = CONFIG.climateRooms[+el.dataset.i];
    if (r) { r.show = r.show === false ? true : false; saveConfigToServer(CONFIG); tick(true); }
    return;
  }
  if (act === 'qeSetCamCols') {
    CONFIG.camCols = el.dataset.cols || 'auto';
    saveConfigToServer(CONFIG);
    tick(true);
    return;
  }
  if (act === 'qeCamMove') {
    moveItem(CONFIG.webrtcCameras, +el.dataset.i, +el.dataset.dir);
    saveConfigToServer(CONFIG);
    tick(true);
    return;
  }
  if (act === 'qeCamVis') {
    const cam = CONFIG.webrtcCameras[+el.dataset.i];
    if (cam) { cam.show = cam.show === false ? true : false; saveConfigToServer(CONFIG); tick(true); }
    return;
  }
  if (act === 'qePageLayout') {
    const pg = (CONFIG.customPages || [])[+el.dataset.pi];
    if (pg) { pg.layout = el.dataset.layout || 'grid'; saveConfigToServer(CONFIG); tick(true); }
    return;
  }
  if (act === 'qeWidgetMove') {
    const pg = (CONFIG.customPages || [])[+el.dataset.pi];
    if (pg && pg.widgets) { moveItem(pg.widgets, +el.dataset.wi, +el.dataset.dir); saveConfigToServer(CONFIG); tick(true); }
    return;
  }
  if (act === 'qeWidgetCol') {
    const w = (CONFIG.customPages || [])[+el.dataset.pi]?.widgets?.[+el.dataset.wi];
    if (w) { w.col = el.dataset.col || 'auto'; saveConfigToServer(CONFIG); tick(true); }
    return;
  }
  if (act === 'qeWidgetVis') {
    const w = (CONFIG.customPages || [])[+el.dataset.pi]?.widgets?.[+el.dataset.wi];
    if (w) { w.show = w.show === false ? true : false; saveConfigToServer(CONFIG); tick(true); }
    return;
  }

  /* ---------- PHASE 3: SMART DEVICE & LIGHT GROUP DETAIL POPUPS ---------- */
  if (act === 'devDetail') {
    openDeviceDetailModal(el.dataset.e, el.dataset.name || '');
    return;
  }
  if (act === 'lgrpDetail') {
    openLightGroupModal(+el.dataset.i);
    return;
  }
  if (act === 'ddToggle') {
    toggleDevice(el.dataset.e);
    setTimeout(() => {
      if (sm.open && sm.mode === 'devDetail') renderDeviceDetailModal();
      else if (sm.open && sm.mode === 'lgrpDetail') renderLightGroupModal();
      tick(true);
    }, 250);
    return;
  }
  if (act === 'ddLightBriBtn') {
    const v = parseInt(el.dataset.v, 10) || 50;
    call('light', 'turn_on', { entity_id: el.dataset.e, brightness_pct: v });
    setTimeout(() => { if (sm.open && sm.mode === 'devDetail') renderDeviceDetailModal(); tick(true); }, 250);
    return;
  }
  if (act === 'ddLightCtBtn') {
    const k = parseInt(el.dataset.v, 10) || 3000;
    call('light', 'turn_on', { entity_id: el.dataset.e, color_temp_kelvin: k });
    setTimeout(() => { if (sm.open && sm.mode === 'devDetail') renderDeviceDetailModal(); tick(true); }, 250);
    return;
  }
  if (act === 'ddLightRgbSwatch') {
    const rgb = (el.dataset.rgb || '255,200,120').split(',').map(Number);
    call('light', 'turn_on', { entity_id: el.dataset.e, rgb_color: rgb });
    setTimeout(() => { if (sm.open && sm.mode === 'devDetail') renderDeviceDetailModal(); tick(true); }, 250);
    return;
  }
  if (act === 'ddLightEffect') {
    call('light', 'turn_on', { entity_id: el.dataset.e, effect: el.dataset.v });
    setTimeout(() => { if (sm.open && sm.mode === 'devDetail') renderDeviceDetailModal(); tick(true); }, 250);
    return;
  }
  if (act === 'ddGrpBriBtn') {
    const g = (CONFIG.lights || [])[+el.dataset.i];
    const v = parseInt(el.dataset.v, 10) || 50;
    if (g && g.entities) {
      const targetEnts = getGroupToggleEntities(g);
      const ents = targetEnts.length ? targetEnts : g.entities;
      call('light', 'turn_on', { entity_id: ents, brightness_pct: v });
      setTimeout(() => { if (sm.open && sm.mode === 'lgrpDetail') renderLightGroupModal(); tick(true); }, 250);
    }
    return;
  }
  if (act === 'ddGrpRgbSwatch') {
    const g = (CONFIG.lights || [])[+el.dataset.i];
    const rgb = (el.dataset.rgb || '255,200,120').split(',').map(Number);
    if (g && g.entities) {
      const targetEnts = getGroupToggleEntities(g);
      const ents = targetEnts.length ? targetEnts : g.entities;
      call('light', 'turn_on', { entity_id: ents, rgb_color: rgb });
      setTimeout(() => { if (sm.open && sm.mode === 'lgrpDetail') renderLightGroupModal(); tick(true); }, 250);
    }
    return;
  }
  if (act === 'ddToggleExclGrp' || act === 'ddToggleExclMain') {
    const g = (CONFIG.lights || [])[+el.dataset.i];
    const ent = el.dataset.e;
    if (g && ent) {
      const key = act === 'ddToggleExclGrp' ? 'excludeGroup' : 'excludeMain';
      if (!Array.isArray(g[key])) g[key] = [];
      const pos = g[key].indexOf(ent);
      if (pos >= 0) g[key].splice(pos, 1);
      else g[key].push(ent);
      saveConfigToServer(CONFIG);
      if (sm.open && sm.mode === 'lgrpDetail') renderLightGroupModal();
      tick(true);
    }
    return;
  }
  if (act === 'ddMediaPower') {
    const st = S(el.dataset.e)?.state;
    call('media_player', (st && st !== 'off' && st !== 'standby') ? 'turn_off' : 'turn_on', { entity_id: el.dataset.e });
    setTimeout(() => { if (sm.open && sm.mode === 'devDetail') renderDeviceDetailModal(); tick(true); }, 250);
    return;
  }
  if (act === 'ddMediaCmd') {
    call('media_player', el.dataset.cmd, { entity_id: el.dataset.e });
    setTimeout(() => { if (sm.open && sm.mode === 'devDetail') renderDeviceDetailModal(); tick(true); }, 250);
    return;
  }
  if (act === 'ddMediaMute') {
    call('media_player', 'volume_mute', { entity_id: el.dataset.e, is_volume_muted: el.dataset.mute === '1' });
    setTimeout(() => { if (sm.open && sm.mode === 'devDetail') renderDeviceDetailModal(); tick(true); }, 250);
    return;
  }
  if (act === 'ddMediaVolBtn') {
    const v = parseInt(el.dataset.v, 10) || 30;
    call('media_player', 'volume_set', { entity_id: el.dataset.e, volume_level: v / 100 });
    setTimeout(() => { if (sm.open && sm.mode === 'devDetail') renderDeviceDetailModal(); tick(true); }, 250);
    return;
  }
  if (act === 'ddMediaSource') {
    call('media_player', 'select_source', { entity_id: el.dataset.e, source: el.dataset.v });
    setTimeout(() => { if (sm.open && sm.mode === 'devDetail') renderDeviceDetailModal(); tick(true); }, 250);
    return;
  }
  if (act === 'cov') {
    call('cover', el.dataset.fn, { entity_id: el.dataset.e });
    setTimeout(() => { if (sm.open && sm.mode === 'devDetail') renderDeviceDetailModal(); tick(true); }, 250);
    return;
  }
  if (act === 'covPos') {
    call('cover', 'set_cover_position', { entity_id: el.dataset.e, position: parseInt(el.dataset.pos, 10) || 0 });
    setTimeout(() => { if (sm.open && sm.mode === 'devDetail') renderDeviceDetailModal(); tick(true); }, 250);
    return;
  }
  if (act === 'kStep') {
    const e = el.dataset.e, s = S(e);
    if (s) {
      const a = s.attributes || {}, cur = a.temperature ?? a.current_temperature ?? 21;
      const nv = clamp(cur + parseFloat(el.dataset.d || '0.5'), a.min_temp ?? 5, a.max_temp ?? 35);
      call('climate', 'set_temperature', { entity_id: e, temperature: nv });
      setTimeout(() => { if (sm.open && sm.mode === 'devDetail') renderDeviceDetailModal(); tick(true); }, 250);
    }
    return;
  }
  if (act === 'kMode') {
    call('climate', 'set_hvac_mode', { entity_id: el.dataset.e, hvac_mode: el.dataset.m });
    setTimeout(() => { if (sm.open && sm.mode === 'devDetail') renderDeviceDetailModal(); tick(true); }, 250);
    return;
  }
  if (act === 'kPreset') {
    call('climate', 'set_preset_mode', { entity_id: el.dataset.e, preset_mode: el.dataset.p });
    setTimeout(() => { if (sm.open && sm.mode === 'devDetail') renderDeviceDetailModal(); tick(true); }, 250);
    return;
  }
  if (act === 'kFan') {
    call('climate', 'set_fan_mode', { entity_id: el.dataset.e, fan_mode: el.dataset.f });
    setTimeout(() => { if (sm.open && sm.mode === 'devDetail') renderDeviceDetailModal(); tick(true); }, 250);
    return;
  }

  /* ---------- KONFIGURATOR-AKTIONEN ---------- */
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

  /* Design-Presets & Layout-Sortierung im Editor */
  if (act === 'cfgThemePreset') {
    const key = el.dataset.preset;
    const p = THEME_PRESETS && THEME_PRESETS[key];
    if (p) {
      cfgDraft.theme = {
        ...(cfgDraft.theme || {}),
        preset: key,
        bg: p.bg, acc: p.acc, acc2: p.acc2, ok: p.ok, warn: p.warn, cool: p.cool
      };
      renderCfgModal(true);
    }
    return;
  }
  if (act === 'cfgMoveDL') {
    moveItem(cfgDraft.dashboardLayout, +el.dataset.i, +el.dataset.dir);
    renderCfgModal(true);
    return;
  }
  if (act === 'cfgResetDL') {
    cfgDraft.dashboardLayout = DEFAULT_DASHBOARD_LAYOUT();
    cfgDraft.dashboardCols = '2-asym';
    renderCfgModal(true);
    toast('Standard-Layout wiederhergestellt');
    return;
  }

  /* Visueller Multi-Entitäts Chip-Picker (Add / Remove) */
  if (act === 'cfgChipAdd' || act === 'cfgChipDel') {
    const grp = el.dataset.grp;
    const p = el.dataset.p || '';
    let targetArr = null;
    if (grp === 'lightGrp') {
      const g = cfgDraft.lights[+p];
      if (g) { if (!Array.isArray(g.entities)) g.entities = []; targetArr = g.entities; }
    } else if (grp === 'lightsMain') {
      if (!cfgDraft.lightsMain) cfgDraft.lightsMain = { mode: 'custom', group: 0, entities: [] };
      if (!Array.isArray(cfgDraft.lightsMain.entities)) cfgDraft.lightsMain.entities = [];
      targetArr = cfgDraft.lightsMain.entities;
    } else if (grp === 'secWin') {
      if (!Array.isArray(cfgDraft.security.windows)) cfgDraft.security.windows = [];
      targetArr = cfgDraft.security.windows;
    } else if (grp === 'calFam') {
      if (!cfgDraft.calendars) cfgDraft.calendars = { familyEntities: [], trashEntities: [] };
      if (!Array.isArray(cfgDraft.calendars.familyEntities)) cfgDraft.calendars.familyEntities = [];
      targetArr = cfgDraft.calendars.familyEntities;
    } else if (grp === 'calTrash') {
      if (!cfgDraft.calendars) cfgDraft.calendars = { familyEntities: [], trashEntities: [] };
      if (!Array.isArray(cfgDraft.calendars.trashEntities)) cfgDraft.calendars.trashEntities = [];
      targetArr = cfgDraft.calendars.trashEntities;
    } else if (grp === 'wBuli') {
      const [pi, wi] = p.split('_').map(Number);
      const w = cfgDraft.customPages?.[pi]?.widgets?.[wi];
      if (w) {
        if (!Array.isArray(w.entities)) w.entities = w.entity ? [w.entity] : [];
        targetArr = w.entities;
      }
    }

    if (targetArr) {
      if (act === 'cfgChipAdd') {
        const inp = document.getElementById(el.dataset.in);
        const val = inp ? inp.value.trim() : '';
        if (val && !targetArr.includes(val)) {
          targetArr.push(val);
          renderCfgModal(true);
        }
      } else {
        const removed = targetArr.splice(+el.dataset.ci, 1)[0];
        if (grp === 'lightGrp' && removed && cfgDraft.lights[+p]) {
          const g = cfgDraft.lights[+p];
          if (Array.isArray(g.excludeGroup)) g.excludeGroup = g.excludeGroup.filter(x => x !== removed);
          if (Array.isArray(g.excludeMain)) g.excludeMain = g.excludeMain.filter(x => x !== removed);
        }
        renderCfgModal(true);
      }
    }
    return;
  }
  if (act === 'cfgLightExclGrp' || act === 'cfgLightExclMain') {
    const g = cfgDraft && cfgDraft.lights && cfgDraft.lights[+el.dataset.p];
    const ent = el.dataset.e;
    if (g && ent) {
      const key = act === 'cfgLightExclGrp' ? 'excludeGroup' : 'excludeMain';
      if (!Array.isArray(g[key])) g[key] = [];
      const pos = g[key].indexOf(ent);
      if (pos >= 0) g[key].splice(pos, 1);
      else g[key].push(ent);
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
  if (act === 'cfgAddLight') {
    if (!Array.isArray(cfgDraft.lights)) cfgDraft.lights = [];
    cfgDraft.lights.push({ name: 'Neue Gruppe', entities: [], mainSync: true });
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

  /* Metriken (Energie / Wasser / Eigene Kacheln) + SubButtons + PowerFlow */
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
  if (act === 'cfgAddSubBtnEnt') {
    const sb = cfgDraft.metrics[+el.dataset.mi].subButtons[+el.dataset.sbi];
    if (!Array.isArray(sb.entities)) sb.entities = [];
    sb.entities.push({ name: 'Sensor', entity: '', unit: 'W', chart: true });
    renderCfgModal(true);
    return;
  }
  if (act === 'cfgDelSubBtnEnt') {
    cfgDraft.metrics[+el.dataset.mi].subButtons[+el.dataset.sbi].entities.splice(+el.dataset.ei, 1);
    renderCfgModal(true);
    return;
  }
  if (act === 'cfgAddPF') {
    if (!Array.isArray(cfgDraft.powerFlow)) cfgDraft.powerFlow = [];
    cfgDraft.powerFlow.push({ label: 'Sensor', entity: '', unit: 'W', icon: 'bolt' });
    renderCfgModal(true);
    return;
  }
  if (act === 'cfgDelPF') {
    cfgDraft.powerFlow.splice(+el.dataset.i, 1);
    renderCfgModal(true);
    return;
  }

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
  if (act === 'cfgAddCam') { cfgDraft.webrtcCameras.push({ name: 'Kamera', entity: '', stream: '', show: true }); renderCfgModal(true); return; }
  if (act === 'cfgDelCam') { cfgDraft.webrtcCameras.splice(+el.dataset.i, 1); renderCfgModal(true); return; }
  if (act === 'cfgMoveCam') { moveItem(cfgDraft.webrtcCameras, +el.dataset.i, +el.dataset.dir); renderCfgModal(true); return; }

  /* Klima-Räume + Unterelemente & Eigene Seiten + Sortierung */
  if (act === 'cfgAddCRoom') { cfgDraft.climateRooms.push({ name: 'Raum', icon: 'radiator', show: true, sensors: [], devices: [], charts: [] }); renderCfgModal(true); return; }
  if (act === 'cfgDelCRoom') { cfgDraft.climateRooms.splice(+el.dataset.i, 1); renderCfgModal(true); return; }
  if (act === 'cfgMoveCRoom') { moveItem(cfgDraft.climateRooms, +el.dataset.i, +el.dataset.dir); renderCfgModal(true); return; }
  if (act === 'cfgAddCRDev') {
    const cr = cfgDraft.climateRooms[+el.dataset.ri];
    if (!Array.isArray(cr.devices)) cr.devices = [];
    cr.devices.push({ name: 'Heizung', entity: '', icon: 'radiator', toggle: false, readonly: false });
    renderCfgModal(true);
    return;
  }
  if (act === 'cfgDelCRDev') { cfgDraft.climateRooms[+el.dataset.ri].devices.splice(+el.dataset.di, 1); renderCfgModal(true); return; }
  if (act === 'cfgAddCRSens') {
    const cr = cfgDraft.climateRooms[+el.dataset.ri];
    if (!Array.isArray(cr.sensors)) cr.sensors = [];
    cr.sensors.push({ icon: 'thermo', entity: '', attr: '', unit: '°C', decimals: 1 });
    renderCfgModal(true);
    return;
  }
  if (act === 'cfgDelCRSens') { cfgDraft.climateRooms[+el.dataset.ri].sensors.splice(+el.dataset.si, 1); renderCfgModal(true); return; }
  if (act === 'cfgAddCRChart') {
    const cr = cfgDraft.climateRooms[+el.dataset.ri];
    if (!Array.isArray(cr.charts)) cr.charts = [];
    cr.charts.push({ title: 'Temperaturverlauf', entity: '', attr: '' });
    renderCfgModal(true);
    return;
  }
  if (act === 'cfgDelCRChart') { cfgDraft.climateRooms[+el.dataset.ri].charts.splice(+el.dataset.ci, 1); renderCfgModal(true); return; }
  if (act === 'cfgAddCRHelper') {
    const cr = cfgDraft.climateRooms[+el.dataset.ri];
    if (!cr.settings || !cr.settings.groups || !cr.settings.groups[0]) {
      cr.settings = { title: `${cr.name} Einstellungen`, groups: [{ title: 'Einstellungen', items: [] }] };
    }
    cr.settings.groups[0].items.push({ name: 'Einstellung', entity: '' });
    renderCfgModal(true);
    return;
  }
  if (act === 'cfgDelCRHelper') {
    cfgDraft.climateRooms[+el.dataset.ri].settings.groups[0].items.splice(+el.dataset.hi, 1);
    renderCfgModal(true);
    return;
  }

  if (act === 'cfgAddPage') {
    const newId = 'p_' + Date.now();
    cfgDraft.customPages.push({ id: newId, label: 'Neue Seite', icon: 'chart', title: 'Neue Seite', layout: 'grid', widgets: [] });
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
    page.widgets.push({ type: 'entity_info', title: 'Kachel', entity: '', col: 'auto', show: true });
    renderCfgModal(true);
    return;
  }
  if (act === 'cfgDelWidget') { cfgDraft.customPages[+el.dataset.pi].widgets.splice(+el.dataset.wi, 1); renderCfgModal(true); return; }
  if (act === 'cfgMoveWidget') { moveItem(cfgDraft.customPages[+el.dataset.pi].widgets, +el.dataset.wi, +el.dataset.dir); renderCfgModal(true); return; }
  if (act === 'cfgAddWStatItem') {
    const w = cfgDraft.customPages[+el.dataset.pi].widgets[+el.dataset.wi];
    if (!Array.isArray(w.items)) w.items = [];
    w.items.push({ name: 'Kurve', entity: '', attr: '', color: '#a99bff' });
    renderCfgModal(true);
    return;
  }
  if (act === 'cfgDelWStatItem') {
    cfgDraft.customPages[+el.dataset.pi].widgets[+el.dataset.wi].items.splice(+el.dataset.si, 1);
    renderCfgModal(true);
    return;
  }

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

  /* Smarte Kamera-Steuerung (Zuhause go2rtc / Unterwegs HA-Stream) */
  if (act === 'camBig') {
    const hr = el.closest('.hero-banner');
    const curRoom = (CONFIG.rooms || [])[ui.room] || (CONFIG.rooms || [])[0] || {};
    const roomName = (hr && hr.dataset.name) || curRoom.name || 'Kamera';
    const btnStream = el.dataset.webrtc || (hr && hr.dataset.webrtc) || curRoom.webrtc || '';
    const btnCam = el.dataset.cam || '';
    const roomCam = (hr && hr.dataset.cam) || curRoom.camera || '';
    const camMode = (hr && hr.dataset.mode) || curRoom.cameraMode || 'stream';
    const title = (el.dataset.title && el.dataset.title !== 'Vergrößern')
      ? `${roomName} · ${el.dataset.title}`
      : roomName;
    openSmartCamLB(btnStream, btnCam, roomCam, camMode, title);
    return;
  }
  if (act === 'camCardBig') {
    openSmartCamLB(el.dataset.webrtc || '', el.dataset.cam || '', '', 'stream', el.dataset.title || 'Kamera');
    return;
  }
  if (act === 'camMode') {
    go2rtcState.modeOverride = el.dataset.mode || 'auto';
    localStorage.setItem('hub_cam_mode', go2rtcState.modeOverride);
    if (go2rtcState.modeOverride === 'auto') probeGo2rtc(true);
    onCamSourceChanged();
    return;
  }

  /* Universal Sport-Center (Google-Style) Aktionen */
  if (act === 'sportsTab') {
    const st = getSportsUiState(el.dataset.wkey || 'sh_default');
    st.tab = el.dataset.tab || 'overview';
    tick(true);
    return;
  }
  if (act === 'sportsCompFilter') {
    const st = getSportsUiState(el.dataset.wkey || 'sh_default');
    st.compFilter = el.dataset.comp || 'all';
    tick(true);
    return;
  }
  if (act === 'sportsSubTab') {
    const st = getSportsUiState(el.dataset.wkey || 'sh_default');
    st.matchSubTab = el.dataset.sub || 'upcoming';
    tick(true);
    return;
  }
  if (act === 'sportsRefresh') {
    toast('Sportdaten werden aktualisiert…');
    refreshAllSportsHubs(true);
    return;
  }
  if (act === 'sportsOpenExt') {
    openSportsExternalUrl(el.dataset.url || '');
    return;
  }
  if (act === 'sportsMatchDetail') {
    openSportsMatchModal(el.dataset.sport, el.dataset.league, el.dataset.event, el.dataset.home, el.dataset.away, el.dataset.date);
    return;
  }
  if (act === 'sportsModalTab') {
    sportsHubState.modal.tab = el.dataset.tab || 'events';
    renderSportsMatchModal();
    return;
  }
  if (act === 'sportsSearchBtn') {
    const pi = +el.dataset.pi, wi = +el.dataset.wi;
    const inp = document.getElementById(`sp-search-${pi}-${wi}`);
    if (inp && inp.value.trim()) {
      searchSportsTeamsInEditor(inp.value.trim(), pi, wi);
    } else {
      toast('Bitte Vereins- oder Liganamen eingeben');
    }
    return;
  }
  if (act === 'sportsPickResult') {
    const pi = +el.dataset.pi, wi = +el.dataset.wi;
    const w = cfgDraft.customPages[pi] && cfgDraft.customPages[pi].widgets[wi];
    if (w) {
      w.sport = el.dataset.sport || 'soccer';
      w.league = el.dataset.league || 'ger.1';
      w.teamId = el.dataset.tid || '';
      w.teamName = el.dataset.tname || '';
      w.teamLogo = el.dataset.tlogo || '';
      w.title = el.dataset.tname || w.title || 'Sport-Center';
      renderCfgModal(true);
      toast(`Ausgewählt: ${w.teamName}`);
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
    if (g) {
      const gi = groupInfo(g);
      if (gi.toggleEnts.length) {
        call('homeassistant', gi.toggleOn ? 'turn_off' : 'turn_on', { entity_id: gi.toggleEnts });
      }
      setTimeout(() => { if (sm.open && sm.mode === 'lgrpDetail') renderLightGroupModal(); tick(true); }, 250);
    }
  }
  tick(true);
});

/* ---------- Initialisierung ---------- */
(async function init() {
  try {
    await loadConfigFromServer();
  } catch (e) {
    console.warn('loadConfigFromServer error:', e);
  }
  try {
    rebuildEntitiesList();
  } catch (e) {
    console.warn('rebuildEntitiesList error:', e);
  }
  render();
  probeGo2rtc(true);
  refreshSeries();
  refreshWeatherForecast(true);
  refreshHomeCalendars(true);
  if (typeof refreshAllSportsHubs === 'function') refreshAllSportsHubs(false);
  setInterval(tick, 1500);
  setInterval(updatePFC, 1500);
  setInterval(runtimeTick, 1000);
  setInterval(refreshSeries, 5 * 60 * 1000);
  setInterval(refreshMetricCompare, 60 * 1000);
  setInterval(() => refreshWeatherForecast(true), 30 * 60 * 1000);
  setInterval(() => { if (typeof refreshAllSportsHubs === 'function') refreshAllSportsHubs(false); }, 2 * 60 * 1000);
})();

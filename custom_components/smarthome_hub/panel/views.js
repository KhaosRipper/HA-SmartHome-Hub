/* ==========================================================================
   Smart Home Hub – Views, Karten & Widgets (views.js)
   Haupt-Dashboard, Raum-Hero, Klima-Ansicht, Eigene Seiten, Kalender & Badges
   ========================================================================== */

/* ---------- Geräte-Status ---------- */
function devInfo(d) {
  const s = S(d.entity), dm = dom(d.entity), st = s ? s.state : 'unavailable';
  let on = false, label = t('hvac.off'), cls = 'off';
  if (!s || st === 'unavailable' || st === 'unknown') { label = t('state.unavailable'); }
  else if (dm === 'climate') {
    if (st !== 'off') {
      on = true; const a = s.attributes.hvac_action;
      if (a === 'heating') { label = t('state.heating'); cls = 'warn'; }
      else if (a === 'cooling') { label = tr('Kühlt', 'Cooling'); cls = 'cool'; }
      else if (a === 'idle' || a === 'off') { label = t('state.standby'); cls = 'idle'; }
      else { label = tr('An', 'On'); cls = 'on'; }
    }
  }
  else if (dm === 'cover') { on = st !== 'closed'; label = st === 'opening' ? tr('Öffnet', 'Opening') : st === 'closing' ? tr('Schließt', 'Closing') : on ? t('sec.open') : t('sec.closed'); cls = on ? 'on' : 'off'; }
  else if (dm === 'lawn_mower') { on = st === 'mowing'; label = ({ mowing: t('state.mowing'), docked: t('state.docked'), paused: t('state.paused'), returning: t('state.returning'), error: t('state.error') })[st] || st; cls = on ? 'on' : st === 'error' ? 'warn' : 'off'; }
  else if (dm === 'lock') { on = st === 'unlocked'; label = on ? t('sec.open') : t('state.locked'); cls = on ? 'warn' : 'on'; }
  else if (dm === 'camera') { on = st !== 'off'; label = on ? t('state.active') : t('hvac.off'); cls = on ? 'on' : 'off'; }
  else if (dm === 'media_player') {
    if (st === 'standby') { label = t('state.standby'); cls = 'idle'; }
    else if (st !== 'off') { on = true; label = st === 'playing' ? t('state.playing') : tr('An', 'On'); cls = 'on'; }
  }
  else { on = st === 'on' || st === 'open'; label = on ? tr('An', 'On') : t('hvac.off'); cls = on ? 'on' : 'off'; }
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
    if (st === 'locked') requirePin('doorUnlock', () => call('lock', 'unlock', { entity_id: e }), t('pin.unlock_title'));
    else call('lock', 'lock', { entity_id: e });
  }
  else call('homeassistant', 'toggle', { entity_id: e });
}

/* ---------- Türschloss-Akku Helfer & Statusanzeige Rechts ---------- */
function getLockBatteryVal(l) {
  if (!l) return null;
  if (l.battery) {
    const bs = S(l.battery);
    if (bs && !['unknown', 'unavailable'].includes(bs.state)) {
      const v = parseFloat(bs.state);
      if (Number.isFinite(v)) return Math.round(clamp(v, 0, 100));
    }
  }
  const lk = l.entity ? S(l.entity) : null;
  const a = (lk && lk.attributes) || {};
  const attrVal = a.battery_level ?? a.battery;
  if (attrVal != null) {
    const v = parseFloat(attrVal);
    if (Number.isFinite(v)) return Math.round(clamp(v, 0, 100));
  }
  return null;
}

function renderLockBatteryHtml(l, targetLoc, locksCount = 1) {
  const pos = l.batPos || 'pill';
  const style = l.batStyle || 'badge';
  if (pos === 'off') return '';

  const matchLoc =
    (targetLoc === 'pill' && (pos === 'pill' || pos === 'both')) ||
    (targetLoc === 'above' && pos === 'above') ||
    (targetLoc === 'subtext' && pos === 'subtext') ||
    (targetLoc === 'card' && (pos === 'card' || pos === 'both'));
  if (!matchLoc) return '';

  // Wenn weder Batterie-Entität gewählt ist noch das Schloss ein Batterie-Attribut liefert -> nichts anzeigen
  if (!l.battery) {
    const lk = l.entity ? S(l.entity) : null;
    const a = (lk && lk.attributes) || {};
    if (a.battery_level == null && a.battery == null) return '';
  }

  const val = getLockBatteryVal(l);
  if (val == null) return '';
  if (style === 'warn_only' && val > 25) return '';

  const lvlCls = val <= 20 ? 'crit' : val <= 40 ? 'low' : 'ok';
  const prefix = (locksCount > 1 && targetLoc === 'subtext') ? `${esc(l.name)}: ` : '';
  const batWord = tr('Akku', 'Battery');

  if (targetLoc === 'subtext') {
    if (style === 'text') return `<span class="lock-bat-inline ${lvlCls}">${prefix}${batWord} ${val}%</span>`;
    if (style === 'minimal') return `<span class="lock-bat-inline ${lvlCls}">${ic('battery', 12)} ${prefix}${val}%</span>`;
    return `<span class="lock-bat-badge sm ${lvlCls}">${ic('battery', 11)}<span>${prefix}${val}%</span></span>`;
  }

  if (targetLoc === 'card') {
    return ` · <span class="lock-bat-inline ${lvlCls}">${ic('battery', 11)} ${val}%</span>`;
  }

  const posCls = targetLoc === 'above' ? 'above' : 'in-pill';
  if (style === 'text') {
    return `<span class="lock-bat-txt ${posCls} ${lvlCls}" title="${esc(l.name)} ${batWord}: ${val}%">${val}%</span>`;
  }
  if (style === 'minimal') {
    return `<span class="lock-bat-min ${posCls} ${lvlCls}" title="${esc(l.name)} ${batWord}: ${val}%">${ic('battery', 12)}<span>${val}%</span></span>`;
  }
  return `<span class="lock-bat-badge ${posCls} ${lvlCls}" title="${esc(l.name)} ${batWord}: ${val}%">${ic('battery', 12)}<span>${val}%</span></span>`;
}

function rightTopStatus() {
  const sec = CONFIG.security || {}, problems = [];
  const locks = getLocksList(sec);
  locks.forEach(l => {
    const lk = S(l.entity);
    if (lk && lk.state !== 'locked') problems.push(t('status.unlocked_item', { name: tDefault(l.name || t('hero.door')) }));
  });
  const openW = (sec.windows || []).filter(w => { const s = S(w); return s && (s.state === 'on' || s.state === 'open'); }).length;
  if (openW) problems.push(t('status.windows_open', { n: openW }));

  const subtextBats = locks.map(l => renderLockBatteryHtml(l, 'subtext', locks.length)).filter(Boolean);
  const baseSubText = problems.length ? esc(problems.join(' · ')) : t('status.all_normal');
  const fullSubHtml = subtextBats.length ? `${baseSubText} <span class="sep">·</span> ${subtextBats.join(' ')}` : baseSubText;

  const lockPills = locks.map(l => {
    const lk = S(l.entity);
    const locked = !lk || lk.state === 'locked';
    const armed = ui.unlockArmedEntity === l.entity && ui.unlockArmedUntil > Date.now();
    const pillBatHtml = renderLockBatteryHtml(l, 'pill', locks.length);
    const aboveBatHtml = renderLockBatteryHtml(l, 'above', locks.length);
    const lName = tDefault(l.name);

    return `<div class="lockpill ${aboveBatHtml ? 'has-above' : ''}" title="${esc(lName)}">
      ${aboveBatHtml}
      ${locks.length > 1 ? `<span class="mut sm" style="padding:0 6px">${esc(lName)}</span>` : ''}
      <button class="${locked ? 'on' : ''}" data-act="lockEntity" data-e="${esc(l.entity)}" title="${esc(lName)} ${t('sec.lock')}">${ic('lock')}</button>
      ${pillBatHtml || `<span class="dots">›››</span>`}
      <button class="${!locked ? 'open' : ''} ${armed ? 'armed' : ''}" data-act="unlockEntity" data-e="${esc(l.entity)}" data-name="${esc(lName)}" title="${esc(lName)} ${t('sec.unlock')}">${ic('unlock')}</button>
    </div>`;
  }).join('');

  return `<div class="stat">
    <div class="t"><b class="${problems.length ? 'warn' : 'ok'}">${problems.length ? t('alert.attention') : t('status.home_secure')}</b><span class="mut sm stat-subline">${fullSubHtml}</span></div>
    ${lockPills}
  </div>`;
}

function heroOverlayContent() {
  const now = new Date();
  const dtOpts = { timeZone: CONFIG.dateTimeTimeZone || 'Europe/Berlin' };
  const effLocale = getLang() === 'en' ? 'en-US' : (CONFIG.dateTimeLocale || 'de-DE');
  const dateText = now.toLocaleDateString(effLocale, { ...dtOpts, weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  const timeText = now.toLocaleTimeString(effLocale, { ...dtOpts, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const hour = Number(now.toLocaleString('en-US', { ...dtOpts, hour: '2-digit', hourCycle: 'h23' }));
  const greet = hour < 5 ? t('hero.night') : hour < 11 ? t('hero.morning') : hour < 17 ? t('hero.day') : t('hero.evening');
  const hs = getHass();
  const name = tDefault(CONFIG.userName) || (hs && hs.user && hs.user.name ? hs.user.name.split(' ')[0] : t('hero.guest'));

  const gs = CONFIG.greetingEntity ? S(CONFIG.greetingEntity) : null;
  const ign = (CONFIG.greetingIgnore || []).map(x => String(x).toLowerCase());
  const attrText = gs && gs.attributes && typeof gs.attributes.text === 'string' ? gs.attributes.text.trim() : '';
  const stateText = gs && gs.state ? String(gs.state).trim() : '';
  const invalid = ['unknown', 'unavailable', 'none', ''];
  const validAttrText = attrText && !invalid.includes(attrText.toLowerCase()) && !ign.includes(attrText.toLowerCase());
  const validStateText = stateText && !invalid.includes(stateText.toLowerCase()) && !ign.includes(stateText.toLowerCase());
  const gtxt = validAttrText ? attrText : validStateText ? stateText : t('hero.default_greet');

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

  const useGo2 = canUseGo2rtc() && !!r.webrtc;
  const resolvedCam = resolveCamEntity(r.webrtc, r.camera);
  const useHaCam = !useGo2 && !!resolvedCam && !DEMO && !!S(resolvedCam);
  const isBgLiveStream = useGo2 || useHaCam;
  const motionTriggered = r.dynamicMotion && r.motionEntity && (S(r.motionEntity) || {}).state === 'on';
  const showLive = isBgLiveStream && r.showLiveBadge !== false && (!r.dynamicMotion || motionTriggered);
  const motionBadge = (r.dynamicMotion && motionTriggered) ? `<span class="chip on" style="background:var(--warn);color:#000;font-weight:700">🎯 ${esc(r.motionLabel || t('hero.motion'))}</span>` : '';

  const rawBtns = Array.isArray(r.camButtons) && r.camButtons.length
    ? r.camButtons
    : (isBgLiveStream ? [{ name: 'Vergrößern', icon: 'expand', stream: '', entity: '' }] : []);

  const camBtns = rawBtns.map(b => {
    const btnIcon = b.icon || 'expand';
    const btnName = b.name != null ? tDefault(String(b.name).trim()) : '';
    const stream = b.stream || '';
    const entity = b.entity || '';
    const showTxt = btnName && b.name !== 'Vergrößern';
    return `<button class="expand" data-act="camBig" data-webrtc="${esc(stream)}" data-cam="${esc(entity)}" data-title="${esc(btnName)}" title="${esc(btnName || t('cam.fullscreen'))}">${ic(btnIcon, 14)}${showTxt ? esc(btnName) : ''}</button>`;
  }).join('');

  const th = CONFIG.theme || {};
  const hiStyle = th.greetingColor ? `style="color:${esc(th.greetingColor)}"` : '';
  const nameStyle = th.nameColor ? `style="color:${esc(th.nameColor)}"` : '';
  const greetStyle = th.activityColor ? `style="color:${esc(th.activityColor)}"` : '';
  const dtStyle = th.dateTimeColor ? `style="color:${esc(th.dateTimeColor)}"` : '';

  return `<div class="hero-top">
      <div class="hi" ${hiStyle}>${greet},</div>
      <div class="name-row"><div class="name" ${nameStyle}>${esc(name)} 👋</div></div>
      <div class="greet" ${greetStyle}>${esc(gtxt)}</div>
      ${showHomeBadges ? homeHeaderBadges() : ''}
      ${CONFIG.showDateTime ? `<div class="datetime" ${dtStyle}><span id="hub-date">${esc(dateText)}</span><span class="sep">•</span><span><span id="hub-time">${esc(timeText)}</span>${t('cal.clock_suffix')}</span></div>` : ''}
    </div>
    <div class="hero-bottom">
      <div class="pills">${pills}</div>
      <h2>${esc(r.name)}</h2>
      <div class="hero-bar">
        <div class="chips">${chips}</div>
        ${(showLive || motionBadge || camBtns) ? `<div class="camtools">${motionBadge}${showLive ? `<span class="live" data-act="camBig" style="cursor:pointer" title="${esc(t('cam.fullscreen'))}">● LIVE</span>` : ''}${camBtns}</div>` : ''}
      </div>
    </div>`;
}

function getCurrentViewContext(explicitFilter = null, showAll = false) {
  const rooms = (CONFIG && CONFIG.rooms && CONFIG.rooms.length) ? CONFIG.rooms : [{ name: 'Home' }];
  const curRoom = rooms[ui.room] || rooms[0];
  const isSubpage = typeof ui !== 'undefined' && ui.view && ui.view.startsWith('page:');
  const pageId = isSubpage ? ui.view.slice(5) : null;
  const pageObj = pageId ? (CONFIG.customPages || []).find(p => p && p.id === pageId) : null;
  const cleanFilter = (explicitFilter && String(explicitFilter).trim()) ? String(explicitFilter).trim() : null;
  const isAllFilter = cleanFilter && ['*', 'all', 'alle'].includes(cleanFilter.toLowerCase());
  return {
    roomName: curRoom ? curRoom.name : 'Home',
    isHome: ui.room === 0 && !isSubpage,
    pageId,
    pageLabel: pageObj ? pageObj.label : null,
    explicitFilter: isAllFilter ? null : cleanFilter,
    showAll: !!(showAll || isAllFilter)
  };
}

function devicesCard(customFilterRoom = null, customTitle = null, tabFilter = 'geraete') {
  const effTitle = tDefault(customTitle || tr('Geräteübersicht', 'Devices Overview'));
  const ctx = getCurrentViewContext(customFilterRoom, customFilterRoom === null && ui.showAll);
  const list = (CONFIG.devices || []).filter(d => {
    const dTab = d.tab || 'geraete';
    if (tabFilter && dTab !== tabFilter) return false;
    return isItemVisibleInContext(d, ctx);
  });
  if (tabFilter !== 'geraete' && !list.length) return '';
  if (!list.length && !ui.editMode && ctx.pageId) return '';
  const infos = list.map(d => ({ d, i: devInfo(d) }));
  const active = infos.filter(x => x.i.on).length;
  const today = new Date().toLocaleDateString(getLocale(), { day: '2-digit', month: 'short', year: 'numeric' });
  const rows = infos.map(({ d, i }) => {
    const p = d.power ? num(d.power) : null, e = d.energy ? num(d.energy) : null;
    const since = i.on && i.s && i.s.last_changed ? Date.parse(i.s.last_changed) : 0;
    const canToggle = dom(d.entity) !== 'camera' && i.s && i.st !== 'unavailable';
    const domType = dom(d.entity);
    const hasRichDetail = ['light', 'media_player', 'climate', 'cover'].includes(domType);
    const locLabel = typeof formatItemShowOnSummary === 'function' ? formatItemShowOnSummary(d) : (d.room || '');
    return `<div class="tr">
      <div class="dv dv-clickable" data-act="devDetail" data-e="${esc(d.entity)}" data-name="${esc(d.name)}" title="${esc(tr('Antippen für Feinsteuerung & Details', 'Tap for controls & details'))}">
        <div class="dvi ${i.on ? 'on' : ''}">${ic(devIcon(d), 17)}</div>
        <div style="min-width:0"><b>${esc(d.name)} ${hasRichDetail ? '<span class="dv-hint">⚙</span>' : ''}</b><small>${esc(locLabel)}</small></div>
      </div>
      <div class="st ${i.cls}" data-act="devDetail" data-e="${esc(d.entity)}" data-name="${esc(d.name)}" style="cursor:pointer"><i></i>${esc(i.label)}</div>
      <div>${p == null ? '—' : fmt(p, 0) + ' W'}</div>
      <div>${since ? `<span class="rt" data-since="${since}">${fmtDur(Date.now() - since)}</span>` : '—'}</div>
      <div>${e == null ? '—' : fmt(e, 1) + ' kWh'}</div>
      <div class="sw ${i.on ? 'on' : ''} ${canToggle ? '' : 'dis'}" data-act="dev" data-e="${esc(d.entity)}"><i></i></div></div>`;
  }).join('');
  return `<section class="card"><div class="ch"><div><b>${esc(effTitle)}</b> <span class="mut sm" style="color:var(--acc2)">&nbsp;${t('klima.active_count', { n: active })}</span></div>
    <div style="display:flex;gap:8px">${customFilterRoom === null && tabFilter === 'geraete' ? `<button class="iconbtn ${ui.showAll ? 'on' : ''}" data-act="all">${ic('filter', 14)}${ui.showAll ? t('dev.all_rooms') : t('dev.this_room')}</button>` : ''}<span class="iconbtn">${today}</span></div></div>
    <div class="tr h"><div>${t('dev.col_device')}</div><div>${t('dev.col_status')}</div><div>${t('dev.col_power')}</div><div>${t('dev.col_runtime')}</div><div>${t('dev.col_today')}</div><div></div></div>
    ${rows || `<div class="mut" style="padding:18px 6px">${tr('Keine Geräte für diese Seite / diesen Raum zugeordnet.', 'No devices assigned to this page / room.')}</div>`}</section>`;
}

function extraDeviceTabsCards() {
  const extraTabs = (CONFIG.deviceTabs || []).filter(t => t.id !== 'geraete' && t.id !== 'covers');
  return extraTabs.map(t => devicesCard(null, tDefault(t.name), t.id)).join('');
}

function coversCard(filterRoom = null, customTitle = null) {
  const ctx = getCurrentViewContext(filterRoom, false);
  const list = (CONFIG.covers || []).filter(c => isItemVisibleInContext(c, ctx));
  const titleTxt = tDefault(customTitle || t('dev.covers_title'));
  if (!list.length) {
    return ui.editMode
      ? `<section class="card"><div class="ch"><b>${esc(titleTxt)}</b></div><div class="page-note">${tr('Keine Rolläden für diese Seite zugeordnet.', 'No covers assigned to this page.')}</div></section>`
      : '';
  }
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
  return `<section class="card"><div class="ch"><div><b>${esc(titleTxt)}</b> <span class="mut sm" style="color:var(--acc2)">&nbsp;${t('hero.open_count', { n: openCount })}</span></div></div>
    <div class="cover-row h"><div>${t('dev.covers_title')}</div><div>${t('dev.col_status')}</div><div>${t('dev.col_position')}</div><div style="text-align:right">${t('dev.col_control')}</div></div>
    ${rows}</section>`;
}

function arc(cx, cy, r, a0, a1) {
  const p = a => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${(a1 - a0) > 180 ? 1 : 0} 1 ${x1.toFixed(1)},${y1.toFixed(1)}`;
}

/* ---------- Konfigurierbare Klima-Kacheln (Modus / Lüfter / eigene) ---------- */
function getClimateTiles(room) {
  if (room && Array.isArray(room.climateTiles)) return room.climateTiles;
  const g = CONFIG.climate && CONFIG.climate.tiles;
  return Array.isArray(g) ? g : DEFAULT_CLIMATE_TILES();
}
const TILE_TOGGLE_DOMAINS = ['switch', 'input_boolean', 'light', 'humidifier', 'automation'];
function climateTileInfo(tile, c) {
  const type = tile.type || 'custom';
  const entity = String(tile.entity || c.entity || '').trim();
  const label = tDefault(tile.label || (type === 'hvac' ? t('klima.mode') : type === 'fan' ? t('klima.fan') : tr('Wert', 'Value')));
  const icon = ICONS[tile.icon] ? tile.icon : (type === 'hvac' ? 'sun' : type === 'fan' ? 'fan' : 'thermo');
  const out = { entity, label, icon, value: '—', act: false };
  const s = entity ? S(entity) : null;
  if (!s) return out;
  if (['unknown', 'unavailable'].includes(s.state)) { out.value = t('state.unavailable'); return out; }
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
    out.value = shown(FAN_LABELS[a.fan_mode] || a.fan_mode || '—');
    out.act = (a.fan_modes || []).length > 0;
  } else if (d === 'fan') {
    out.value = shown(s.state === 'off' ? t('hvac.off') : (a.preset_mode || (a.percentage != null ? `${a.percentage} %` : tr('An', 'On'))));
    out.act = true;
  } else if (d === 'select' || d === 'input_select') {
    out.value = shown(s.state);
    out.act = (a.options || []).length > 1;
  } else if (TILE_TOGGLE_DOMAINS.includes(d)) {
    out.value = shown(s.state === 'on' ? tr('An', 'On') : s.state === 'off' ? t('hvac.off') : s.state);
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
  const cTitle = tDefault(c.title || t('weather.title'));
  const cName = tDefault(c.name || '');
  const title = `${cTitle}${cName ? ' · ' + cName : ''}`;

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
  const condText = condState ? (WEATHER_CONDITIONS_DE[condState] || condState) : tDefault(c.label || t('klima.actual'));
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
    return `<div class="mini">${ic(it.icon || 'drop', 18)}<span><small>${esc(tDefault(it.label))}</small>${formatted}</span></div>`;
  }).join('');

  const fcBtnHtml = c.showForecast
    ? `<button class="iconbtn wfc-open-btn" data-act="wfcOpen">${ic('calendar', 15)}<span>${esc(tDefault(c.forecastTitle) || t('weather.forecast_7d'))}</span></button>`
    : '';

  const rainMiniHtml = (c.showRainTimeline !== false && CONFIG.weather?.showRainTimeline !== false)
    ? renderRainMiniTimeline()
    : '';

  return `<section class="card"><div class="ch"><b>${esc(title)}</b><span class="mut sm">${t('klima.actual')}</span></div>
    <div class="weather-now"><div class="weather-symbol">${symbol}</div><div><div class="weather-temp">${tempVal == null || isNaN(tempVal) ? '—' : fmt(tempVal, 1)}<sup>${esc(tempUnit)}</sup></div><div class="mut sm">${esc(condText)}</div></div></div>
    ${detailsHtml ? `<div class="two">${detailsHtml}</div>` : ''}
    ${rainMiniHtml}
    ${fcBtnHtml}</section>`;
}

function renderRainMiniTimeline() {
  const rain = getRainTimeline60Min();
  const bars = rain.slots.map(s => {
    const barH = s.mm > 0 ? Math.min(28, Math.max(8, s.mm * 14)) : (s.prob > 15 ? Math.max(5, s.prob * 0.25) : 3);
    const barColor = s.mm > 1.5 ? '#f59e0b' : (s.mm > 0 ? '#38bdf8' : (s.prob > 20 ? 'rgba(56,189,248,.35)' : 'rgba(255,255,255,.07)'));
    return `<div class="rain-mini-col" title="${s.label} (${s.time}): ${s.mm} mm/h (${s.prob}%)">
      <div class="rain-mini-bar" style="height:${barH}px;background:${barColor}"></div>
      <span class="rain-mini-t">${s.label}</span>
    </div>`;
  }).join('');

  return `<div class="rain-mini-wrap">
    <div class="rain-mini-hdr">
      <span class="rain-mini-advice ${rain.statusClass}">${esc(rain.advice)}</span>
    </div>
    <div class="rain-mini-grid">${bars}</div>
  </div>`;
}

/* ---------- 7-Tage-Vorhersage als Kachel (klickbar -> Popup) ---------- */
function weatherForecastCard(customTitle) {
  const wCfg = CONFIG.weather || {};
  if (!(wCfg.forecastEntity || wCfg.entity)) return '';
  const days = (weatherForecastState.days || []).slice(0, 7);
  const rows = days.map((d, i) => {
    const dt = d.datetime ? new Date(d.datetime) : new Date(Date.now() + i * 86400000);
    const name = i === 0 ? t('cal.today') : dt.toLocaleDateString(getLocale(), { weekday: 'short' });
    const sym = WEATHER_SYMBOLS[d.condition] || '🌤️';
    const hi = d.temperature != null ? `${fmt(Number(d.temperature), 0)}°` : '—';
    const lo = d.templow != null ? `${fmt(Number(d.templow), 0)}°` : '';
    const rain = d.precipitation_probability != null ? `${fmt(Number(d.precipitation_probability), 0)}%` : (d.precipitation != null ? `${fmt(Number(d.precipitation), 1)} mm` : '');
    return `<button class="wfc-row" data-act="wfcOpenDay" data-i="${i}">
      <span class="wfc-row-d">${esc(name)}</span><span class="wfc-row-i">${sym}</span>
      <span class="wfc-row-r">${esc(rain)}</span><span class="wfc-row-t"><b>${hi}</b>${lo ? `<small>${lo}</small>` : ''}</span></button>`;
  }).join('');
  const body = rows || `<div class="mut sm" style="padding:10px 2px">${weatherForecastState.error ? esc(weatherForecastState.error) : (DEMO ? tr('Vorhersage im HA-Modus aktiv.', 'Forecast active in HA mode.') : t('weather.loading'))}</div>`;
  return `<section class="card"><div class="ch"><b>${esc(tDefault(customTitle || wCfg.forecastTitle || t('weather.forecast_7d')))}</b><span class="mut sm">${tr('Antippen für Details', 'Tap for details')}</span></div><div class="wfc-list">${body}</div></section>`;
}

function climateCard() {
  const c = activeClimate();
  if (c.type === 'weather') return weatherCard(c);
  if (!c.entity) return '';
  const s = S(c.entity);
  const cTitle = tDefault(c.title || t('klima.title'));
  const title = `${cTitle}${c.name ? ' · ' + c.name : ''}`;
  if (!s) return `<section class="card"><div class="ch"><b>${esc(title)}</b></div><div class="mut">${tr('Entität nicht gefunden.', 'Entity not found.')}</div></section>`;
  const a = s.attributes || {}, cur = a.current_temperature, tgt = a.temperature;
  const min = c.min ?? 16, max = c.max ?? 30;
  const f = v => clamp(((v ?? min) - min) / (max - min), 0.001, 1);
  const A0 = 135, SW = 270, curA = A0 + SW * f(cur), tgtA = A0 + SW * f(tgt);
  const k = [100 + 78 * Math.cos(tgtA * Math.PI / 180), 100 + 78 * Math.sin(tgtA * Math.PI / 180)];
  let label = t('hvac.off');
  if (s.state !== 'off') label = cur == null || tgt == null ? '—' : cur < tgt - 1 ? tr('Zu kalt', 'Too cold') : cur > tgt + 1 ? tr('Zu warm', 'Too warm') : tr('Komfortabel', 'Comfortable');
  return `<section class="card"><div class="ch"><b>${esc(title)}</b><span class="mut sm">${t('klima.actual')}</span></div>
    <div class="gauge"><svg viewBox="0 0 200 175"><defs><linearGradient id="gg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="var(--ok)"/><stop offset="1" stop-color="var(--acc)"/></linearGradient></defs>
      <path d="${arc(100, 100, 78, A0, A0 + SW)}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="9" stroke-linecap="round"/>
      <path d="${arc(100, 100, 78, A0, curA)}" fill="none" stroke="url(#gg)" stroke-width="9" stroke-linecap="round"/>
      ${tgt != null ? `<circle cx="${k[0].toFixed(1)}" cy="${k[1].toFixed(1)}" r="6" fill="#fff" stroke="var(--acc)" stroke-width="3"/>` : ''}</svg>
      <div class="gc"><div class="v">${fmt(cur, 1)}<sup>°C</sup></div><div class="mut sm">${label}${tgt != null ? ` · ${t('klima.target')} ` + fmt(tgt, 1) + '°' : ''}</div>
        <div class="b"><button data-act="tmin">−</button><button data-act="tplus">+</button></div></div></div>
    ${climateTilesHtml(c)}</section>`;
}

function metricCard(m) {
  if (m.show === false) return '';
  const v = num(m.entity);
  const cmp = yesterdayMetricVals[m.id];
  let trendHtml = '';
  if (m.showCompare !== false) {
    trendHtml = `<div class="m-trend flat">${tr('– kein Vergleichswert', '– no comparison')}</div>`;
    if (cmp && cmp.today != null && cmp.yest != null && cmp.yest > 0) {
      const diff = cmp.today - cmp.yest;
      const pct = Math.round((diff / cmp.yest) * 100), absPct = Math.abs(pct);
      const dir = pct < 0 ? tr('weniger', 'less') : tr('mehr', 'more');
      const cu = cmp.unit ? ' ' + cmp.unit : '';
      const absTxt = `${diff < 0 ? '−' : '+'}${fmt(Math.abs(diff), Math.abs(diff) < 10 ? 2 : 1)}${cu}`;
      const kind = m.cmpDisplay || 'percent';
      const vsYest = tr('als gestern', 'than yesterday');
      let text;
      if (pct === 0 && kind === 'percent') text = tr('Gleich wie gestern', 'Same as yesterday');
      else if (kind === 'absolute') text = `${absTxt} ${diff < 0 ? tr('weniger', 'less') : tr('mehr', 'more')} ${vsYest}`;
      else if (kind === 'both') text = `${absPct}% (${absTxt}) ${dir} ${vsYest}`;
      else text = `${absPct}% ${dir} ${vsYest}`;
      const arrow = pct < 0 ? '↓' : pct > 0 ? '↑' : '±';
      const cls = pct < 0 ? 'down' : pct > 0 ? 'up' : 'flat';
      const tip = `${cmp.tLabel}: ${fmt(cmp.today, 2)}${cu} · ${cmp.yLabel}: ${fmt(cmp.yest, 2)}${cu}`;
      trendHtml = `<div class="m-trend ${cls}" title="${esc(tip)}">${arrow} ${esc(text)}</div>`;
    }
  }

  let headRight = t('energy.today'), liveText = '', extraHTML = '';
  const cv = num(m.chart);
  if (m.showLive !== false && m.chart) {
    if (m.subButtons && m.subButtons.length) {
      liveText = `<div class="mut sm" style="margin-top:6px">${t('energy.live')}: ${cv != null ? fmt(cv, 0) + ' ' + (m.chartUnit || 'W') : '—'}</div>`;
    } else if (m.mode !== 'last' && m.chartUnit && cv != null) {
      headRight = `${t('energy.today')} · ${fmt(cv, 0)} ${esc(m.chartUnit)}`;
    }
  }

  if (m.showAutarky) {
    let autVal = null;
    const dayMode = (m.autarkyMode || 'day') === 'day';
    if (m.autarkyEntity) {
      autVal = num(m.autarkyEntity);
    } else if (dayMode && autarkyDayVals[m.id] != null) {
      autVal = autarkyDayVals[m.id];
    } else {
      const houseVal = num(m.chart) ?? num(m.entity);
      const gridVal = num(m.gridImportEntity);
      const pvVal = num(m.pvEntity);
      if (houseVal != null && gridVal != null && houseVal > 0) {
        autVal = ((houseVal - Math.max(0, gridVal)) / houseVal) * 100;
      } else if (houseVal != null && pvVal != null && houseVal > 0) {
        autVal = (pvVal / houseVal) * 100;
      }
    }

    if (autVal != null && !isNaN(autVal)) {
      const autPct = clamp(Math.round(autVal), 0, 100);
      const autCol = autPct >= 80 ? 'var(--ok)' : autPct >= 50 ? 'var(--warn)' : 'var(--acc2)';
      const autBadge = `<span style="display:inline-flex;align-items:center;gap:3px;color:${autCol};font-weight:600" title="${t('energy.autarky')}: ${autPct}%">${ic('sun', 13)} ${autPct}% ${tr('autark', 'autarky')}</span>`;
      headRight = `${headRight} · ${autBadge}`;
    }
  }

  if (m.showSubButtons !== false && m.subButtons && m.subButtons.length) {
    const btns = m.subButtons.map(b => `<button class="iconbtn" style="flex:1;justify-content:center;border-color:transparent;background:rgba(255,255,255,.04);color:var(--${b.color || 'acc2'})" data-act="energymodal" data-mid="${esc(m.id)}" data-bid="${esc(b.id)}">${ic(b.icon, 15)} <span style="color:var(--txt)">${esc(tDefault(b.name))}</span></button>`).join('');
    extraHTML = `<div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap">${btns}</div>`;
  }

  const chartHtml = (m.showChart !== false && m.chart)
    ? `<div class="chart clickable" data-act="chartModal" data-type="metric" data-mid="${esc(m.id)}" title="${tr('Antippen für Großansicht', 'Tap for full view')}">${spark(series[m.chart], m.id, { unit: m.chartUnit || m.unit || '', dec: m.decimals ?? 1 }, series[m.chart + '_yest'])}</div>`
    : '';

  return `<section class="card"><div class="ch"><b>${esc(tDefault(m.title))}</b><span class="mut sm">${headRight}</span></div>
    <div class="mv"><div><span class="big">${fmt(v, m.decimals ?? 1)}</span><span class="unit">${esc(m.unit)}</span><div class="m-sub">${trendHtml}${liveText}</div></div>
    ${chartHtml}</div>${extraHTML}</section>`;
}

function favoritesCard(filterRoom = null, customTitle = null) {
  const ctx = getCurrentViewContext(filterRoom, false);
  const list = (CONFIG.favorites || []).filter(f => f.show !== false && isItemVisibleInContext(f, ctx));
  const titleTxt = tDefault(customTitle || t('fav.title'));
  if (!list.length) {
    return ui.editMode
      ? `<section class="card"><div class="ch"><b>${esc(titleTxt)}</b></div><div class="page-note">${tr('Keine Favoriten für diese Seite zugeordnet.', 'No favorites assigned to this page.')}</div></section>`
      : '';
  }
  const tiles = list.map((f, i) => {
    const e = f.entity;
    const s = e ? S(e) : null;
    const d = dom(e);
    const name = f.name || (s && s.attributes && s.attributes.friendly_name) || e || t('fav.sub');
    const icon = f.icon || (d === 'light' ? 'bulb' : d === 'cover' ? 'blinds' : d === 'scene' ? 'scenes' : d === 'script' ? 'cal' : 'plug');

    let isOn = false;
    let statusText = '—';
    let canToggle = true;

    if (s) {
      if (d === 'cover') {
        const pos = s.attributes && s.attributes.current_position != null ? s.attributes.current_position : null;
        isOn = !['closed', 'unavailable', 'unknown'].includes(s.state) && (pos == null || pos > 0);
        statusText = pos != null ? `${pos}%` : (isOn ? t('sec.open') : t('sec.closed'));
      } else if (d === 'scene' || d === 'script') {
        isOn = false;
        statusText = d === 'scene' ? tr('Szene ausführen', 'Run scene') : tr('Skript starten', 'Run script');
      } else if (d === 'lock') {
        isOn = s.state !== 'locked';
        statusText = isOn ? t('state.unlocked') : t('state.locked');
      } else {
        isOn = s.state === 'on';
        statusText = isOn ? tr('An', 'On') : t('hvac.off');
      }
    } else {
      statusText = tr('Nicht gefunden', 'Not found');
      canToggle = false;
    }

    const hasDetails = ['light', 'cover', 'media_player', 'climate'].includes(d);

    return `<div class="tile tile-fav ${isOn ? 'on' : ''} ${canToggle ? '' : 'dis'}" data-act="favTileClick" data-e="${esc(e)}" data-name="${esc(name)}" title="${esc(name)} · ${esc(statusText)}">
      ${ic(icon, 18)}
      <span style="min-width:0;flex:1;text-align:left">
        <b style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block">${esc(name)}</b>
        <small>${esc(statusText)}</small>
      </span>
      ${hasDetails ? `<button type="button" class="tile-dots-btn" data-act="devDetail" data-e="${esc(e)}" data-name="${esc(name)}" title="${tr('Details & Feineinstellung', 'Details & controls')}">⋯</button>` : ''}
    </div>`;
  }).join('');

  const activeCount = list.filter(f => {
    const s = S(f.entity);
    const d = dom(f.entity);
    if (!s) return false;
    if (d === 'cover') return !['closed', 'unavailable', 'unknown'].includes(s.state);
    return s.state === 'on';
  }).length;

  return `<section class="card"><div class="ch"><div><b>${esc(titleTxt)}</b><span class="mut sm" style="color:var(--acc2)">&nbsp;${t('klima.active_count', { n: activeCount })}</span></div></div><div class="tiles">${tiles}</div></section>`;
}

function securityCard(customTitle = null) {
  const sec = CONFIG.security || {};
  const locks = getLocksList(sec);
  const winAndDoors = [...(sec.windows || []), ...((sec.doors || []).map(d => typeof d === 'string' ? d : (d && d.entity)).filter(Boolean))];
  if (!locks.length && !winAndDoors.length && !(sec.cameras && sec.cameras.length)) return '';
  const openW = winAndDoors.filter(w => { const s = S(w); return s && (s.state === 'on' || s.state === 'open'); }).length;
  const camOn = (sec.cameras || []).filter(c => { const s = S(c); return s && s.state !== 'unavailable' && s.state !== 'off'; }).length;
  const allLocksOk = locks.every(l => { const s = S(l.entity); return !s || s.state === 'locked'; });
  const allOk = allLocksOk && !openW;

  const lockTiles = locks.map(l => {
    const lk = S(l.entity);
    const locked = !lk || lk.state === 'locked';
    const cardBatHtml = renderLockBatteryHtml(l, 'card', locks.length);
    const lName = tDefault(l.name || t('hero.door'));
    return `<button class="tile ${locked ? '' : 'warn'}" data-act="doorEntity" data-e="${esc(l.entity)}" data-name="${esc(lName)}">${ic(locked ? 'lock' : 'unlock', 18)}<span style="min-width:0"><b>${esc(lName)}</b><small>${locked ? t('state.locked') : t('state.unlocked')}${cardBatHtml}</small></span></button>`;
  }).join('');

  return `<section class="card"><div class="ch"><div><b>${esc(tDefault(customTitle || t('sec.title')))}</b><div class="sm" style="color:${allOk ? 'var(--ok)' : 'var(--warn)'}">${allOk ? tr('Alle Systeme aktiv', 'All systems active') : tr('Bitte prüfen', 'Please check')}</div></div></div>
    <div class="tiles">
      ${lockTiles}
      <div class="tile ${openW ? 'warn' : ''}">${ic('window', 18)}<span><b>${tr('Fenster & Türen', 'Windows & Doors')}</b><small>${openW ? t('hero.open_count', { n: openW }) : t('sec.closed')}</small></span></div>
      <button class="tile" data-act="nav" data-view="kameras">${ic('camera', 18)}<span><b>${t('nav.cameras')}</b><small>${t('klima.active_count', { n: camOn })}</small></span></button></div></section>`;
}

/* ---------- BEDINGTE WARN-KARTEN (Conditional Alerts & Vorabend-Müllerinnerung) ---------- */
function conditionalAlertsCard() {
  const alerts = (CONFIG.alerts || []).filter(a => a.show !== false);
  
  // 1. Automatische Müll-Erinnerung am Vorabend (ab 17:00 Uhr)
  let trashAlertHtml = '';
  const now = new Date();
  if (now.getHours() >= 17 && CONFIG.calendars?.trashEntities?.length) {
    const upcoming = getUpcomingTrashItems(1);
    const tomorrowTrash = upcoming.find(it => it.days === 1);
    if (tomorrowTrash) {
      trashAlertHtml = `<div class="alert-banner" style="background:rgba(251,191,36,.12);border:1px solid rgba(251,191,36,.35);display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-radius:var(--r,16px);gap:12px;margin-bottom:8px">
        <div style="display:flex;align-items:center;gap:12px;min-width:0">
          <div style="color:#fbbf24;flex-shrink:0">${ic(tomorrowTrash.type.icon || 'trash', 22)}</div>
          <div style="min-width:0">
            <b style="color:#fff;font-size:13px;display:block">${tr('Müllabfuhr morgen', 'Waste pickup tomorrow')}: ${esc(tomorrowTrash.type.label)}</b>
            <span class="mut sm" style="color:rgba(255,255,255,.85)">${tr('Bitte heute Abend herausstellen', 'Please put out tonight')}: <b>${esc(tomorrowTrash.summary)}</b></span>
          </div>
        </div>
        <span class="pill on" style="border-color:#fbbf24;color:#fbbf24;font-size:11px;padding:3px 9px">${tr('Morgen früh', 'Tomorrow morning')}</span>
      </div>`;
    }
  }

  const activeAlerts = alerts.filter(a => {
    if (!a.entity) return false;
    const s = S(a.entity);
    if (!s) return false;
    const val = String(a.val ?? '').trim();
    const cur = String(s.state ?? '').trim();
    const curNum = parseFloat(cur);
    const valNum = parseFloat(val);

    if (a.op === '==') return cur.toLowerCase() === val.toLowerCase();
    if (a.op === '!=') return cur.toLowerCase() !== val.toLowerCase();
    if (a.op === '>') return !isNaN(curNum) && !isNaN(valNum) && curNum > valNum;
    if (a.op === '<') return !isNaN(curNum) && !isNaN(valNum) && curNum < valNum;
    if (a.op === '>=') return !isNaN(curNum) && !isNaN(valNum) && curNum >= valNum;
    if (a.op === '<=') return !isNaN(curNum) && !isNaN(valNum) && curNum <= valNum;
    if (a.op === 'not_empty') return cur !== '' && cur !== 'unavailable' && cur !== 'unknown';
    return cur.toLowerCase() === 'on';
  });

  if (!activeAlerts.length && !trashAlertHtml) return '';

  const items = activeAlerts.map(a => {
    const s = S(a.entity);
    const col = a.color === 'danger' ? 'var(--warn)' : a.color === 'ok' ? 'var(--ok)' : 'var(--acc2)';
    const bg = a.color === 'danger' ? 'rgba(239,68,68,.12)' : 'rgba(245,158,11,.12)';
    const border = a.color === 'danger' ? 'rgba(239,68,68,.35)' : 'rgba(245,158,11,.35)';
    const icon = a.icon || (a.color === 'danger' ? 'shield' : 'battery');
    return `<div class="alert-banner" style="background:${bg};border:1px solid ${border};display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-radius:var(--r,16px);gap:12px;margin-bottom:8px">
      <div style="display:flex;align-items:center;gap:12px;min-width:0">
        <div style="color:${col};flex-shrink:0">${ic(icon, 22)}</div>
        <div style="min-width:0">
          <b style="color:#fff;font-size:13px;display:block">${esc(a.title || t('alert.attention'))}</b>
          <span class="mut sm" style="color:rgba(255,255,255,.75)">${esc(a.message || (s ? (s.attributes.friendly_name || a.entity) + ': ' + s.state : ''))}</span>
        </div>
      </div>
      ${a.actionEntity ? `<button class="btn-pri" style="padding:6px 14px;font-size:11.5px;white-space:nowrap" data-act="callService" data-e="${esc(a.actionEntity)}" data-srv="${esc(a.actionService || 'toggle')}">${t('alert.fix')}</button>` : ''}
    </div>`;
  }).join('');

  return `<div class="alerts-container" style="display:flex;flex-direction:column;gap:4px">${trashAlertHtml}${items}</div>`;
}

/* ---------- FAMILIEN-PRÄSENZ ---------- */
function presenceCard(forceShow = false, customTitle = null) {
  const p = CONFIG.presence || {};
  if (!forceShow && p.show === false) return '';
  const members = (p.members || []).filter(m => m.entity);
  if (!members.length) {
    return (ui.editMode || forceShow)
      ? `<section class="card"><div class="ch"><b>👥 ${esc(tDefault(customTitle || t('pres.title')))}</b></div><div class="page-note">${t('pres.empty')}</div></section>`
      : '';
  }

  const chips = members.map(m => {
    const s = S(m.entity);
    const state = s ? String(s.state) : t('state.unknown');
    const isHome = state.toLowerCase() === 'home' || state.toLowerCase() === 'zuhause';
    const dotCol = isHome ? 'var(--ok)' : state.toLowerCase() === 'not_home' ? 'var(--warn)' : 'var(--acc2)';
    const stLbl = isHome ? t('pres.home') : (state === 'not_home' ? t('pres.away') : state);
    const name = m.name || (s && s.attributes && s.attributes.friendly_name) || 'Person';
    const avatar = m.avatar || (s && s.attributes && s.attributes.entity_picture) || '';

    return `<div class="presence-chip" style="display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:30px;background:rgba(255,255,255,.03);border:1px solid var(--line);min-width:0">
      <div style="position:relative;width:34px;height:34px;flex-shrink:0">
        ${avatar
          ? `<img src="${esc(avatar)}" style="width:34px;height:34px;border-radius:50%;object-fit:cover;border:1px solid rgba(255,255,255,.2)" alt="">`
          : `<div style="width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.08);display:grid;place-items:center;font-size:13px;font-weight:700;color:var(--txt)">${esc(name.slice(0, 2).toUpperCase())}</div>`}
        <span style="position:absolute;bottom:0;right:0;width:10px;height:10px;border-radius:50%;background:${dotCol};border:2px solid var(--bg,#080912)"></span>
      </div>
      <div style="min-width:0">
        <b style="font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block">${esc(name)}</b>
        <small class="mut" style="font-size:10.5px;color:rgba(255,255,255,.6)">${esc(stLbl)}</small>
      </div>
    </div>`;
  }).join('');

  const homeCount = members.filter(m => { const s = S(m.entity); return s && (s.state === 'home' || s.state === 'zuhause'); }).length;

  return `<section class="card"><div class="ch"><b>👥 ${esc(tDefault(customTitle || t('pres.attendance')))}</b><span class="mut sm">${t('pres.home_count', { home: homeCount, total: members.length })}</span></div><div style="display:flex;flex-wrap:wrap;gap:8px">${chips}</div></section>`;
}

/* ---------- SZENEN- & ROUTINEN-SCHNELLZUGRIFF ---------- */
function routinesCard(customTitle = null) {
  const list = CONFIG.routines || [];
  if (!list.length) {
    return ui.editMode
      ? `<section class="card"><div class="ch"><b>⚡ ${esc(tDefault(customTitle || t('rout.title')))}</b></div><div class="page-note">${t('rout.empty')}</div></section>`
      : '';
  }

  const buttons = list.map(r => {
    const col = r.color || 'acc';
    const icon = r.icon || 'scenes';
    return `<button class="routine-btn" style="flex:1;min-width:140px;display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:var(--r,16px);background:rgba(255,255,255,.03);border:1px solid var(--line);cursor:pointer;transition:all .2s;text-align:left" data-act="routineClick" data-e="${esc(r.entity)}" data-name="${esc(r.name)}">
      <div style="width:36px;height:36px;border-radius:10px;background:color-mix(in srgb, var(--${col}, var(--acc)) 18%, transparent);color:var(--${col}, var(--acc));display:grid;place-items:center;flex-shrink:0">
        ${ic(icon, 18)}
      </div>
      <div style="min-width:0;flex:1">
        <b style="font-size:12.5px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--txt)">${esc(r.name)}</b>
        <small class="mut" style="font-size:10.5px">${t('rout.tap_run')}</small>
      </div>
    </button>`;
  }).join('');

  return `<section class="card"><div class="ch"><b>⚡ ${esc(tDefault(customTitle || t('rout.title')))}</b><span class="mut sm">${t('fav.title')}</span></div><div style="display:flex;flex-wrap:wrap;gap:10px">${buttons}</div></section>`;
}

/* ---------- SMARTE LÜFTUNGSEMPFEHLUNG & AUSKÜHLUNGSSCHUTZ ---------- */
function ventilationCard(forceShow = false, filterRoom = null, customTitle = null) {
  const cfg = CONFIG.ventilation || {};
  if (!forceShow && cfg.show === false) return '';
  const outT = num(cfg.outdoorTemp);
  const outH = num(cfg.outdoorHum);
  const outAH = calcAbsoluteHumidity(outT, outH);

  const rawRooms = filterRoom
    ? (cfg.rooms || []).filter(rm => rm.name && rm.name.toLowerCase() === String(filterRoom).toLowerCase())
    : (cfg.rooms || []);

  const rooms = rawRooms.map(rm => {
    const inT = num(rm.temp);
    const inH = num(rm.hum);
    const inAH = calcAbsoluteHumidity(inT, inH);
    let advice = '–';
    let ok = false;
    if (outAH != null && inAH != null) {
      if (outAH < inAH - 0.5) {
        advice = tr('Lüften empfohlen (Außenluft trockener)', 'Ventilate (outdoor air drier)');
        ok = true;
      } else if (outAH > inAH + 0.5) {
        advice = tr('Fenster schließen (Außenluft feuchter)', 'Keep closed (outdoor air more humid)');
        ok = false;
      } else {
        advice = tr('Gleiche Feuchte (Neutral)', 'Equal humidity (Neutral)');
        ok = true;
      }
    }
    return { name: rm.name, inT, inH, inAH, advice, ok };
  });

  const generalOk = rooms.length ? rooms.some(r => r.ok) : (outAH != null);

  // 1. Fenster- & Tür-Offen-Timer & Auskühlungsschutz
  let openTimerHtml = '';
  if (cfg.showOpenTimer !== false) {
    const openInfo = getOpenWindowsAndDoors();
    if (openInfo.openItems.length) {
      const openBadges = openInfo.openItems.map(it => {
        const icon = it.type === 'door' ? 'door' : 'window';
        const warnCls = it.warnTriggered ? 'warn' : 'info';
        const statusTxt = it.warnTriggered ? tr('Auskühlungsgefahr!', 'Heat loss risk!') : t('sec.open');
        return `<div class="vent-timer-item ${warnCls}">
          <div style="display:flex;align-items:center;gap:7px;min-width:0">
            <span class="vent-timer-ico">${ic(icon, 14)}</span>
            <b style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(it.name)}</b>
          </div>
          <div style="display:flex;align-items:center;gap:6px;flex-shrink:0">
            <span class="rt vent-timer-rt ${it.warnTriggered ? 'warn-pulse' : ''}" data-since="${it.since}">${fmtDur(it.durationMs)}</span>
            <span class="vent-timer-lbl">${statusTxt}</span>
          </div>
        </div>`;
      }).join('');

      const hasAuskuehlung = openInfo.openItems.some(x => x.warnTriggered);
      const banner = hasAuskuehlung
        ? `<div class="vent-open-alert warn">⚠️ <b>${t('vent.open_warn_title')}</b></div>`
        : '';

      openTimerHtml = `<div class="vent-timer-box">${banner}<div class="vent-timer-grid">${openBadges}</div></div>`;
    }
  }

  // 2. Regen-Vorschau Hinweis fürs Lüften
  let rainNotice = '';
  if (CONFIG.weather?.showRainTimeline !== false) {
    const rain = getRainTimeline60Min();
    if (rain.statusClass !== 'dry') {
      rainNotice = `<div class="vent-rain-note ${rain.statusClass}">${esc(rain.advice)}</div>`;
    }
  }

  const roomRows = rooms.map(r => `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05);font-size:12px">
      <div>
        <b>${esc(r.name)}</b>
        <div class="mut sm">${r.inT != null ? fmt(r.inT, 1) + '°C' : ''} · ${r.inH != null ? fmt(r.inH, 0) + '%' : ''} ${r.inAH != null ? '(' + r.inAH + ' g/m³)' : ''}</div>
      </div>
      <div style="text-align:right">
        <span class="pill ${r.ok ? 'on' : ''}" style="font-size:10px;padding:3px 8px">${esc(r.advice)}</span>
      </div>
    </div>`).join('');

  return `<section class="card">
    <div class="ch">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:18px">${generalOk ? '🍃' : '🛑'}</span>
        <b>${esc(tDefault(customTitle || t('vent.title')))}</b>
      </div>
      <span class="mut sm">${t('vent.outdoor')}: ${outT != null ? fmt(outT, 1) + '°C' : '–'} · ${outH != null ? fmt(outH, 0) + '%' : '–'} ${outAH != null ? '(' + outAH + ' g/m³)' : ''}</span>
    </div>
    ${openTimerHtml}
    ${rainNotice}
    ${roomRows || `<div class="mut sm">${t('vent.empty')}</div>`}
  </section>`;
}

/* ---------- REGENRADAR (60-MINUTEN-VORSCHAU) ---------- */
function rainTimelineCard(customTitle, forceShow = false) {
  const wCfg = CONFIG.weather || {};
  if (!forceShow && wCfg.showRainTimeline === false) return '';
  const rain = getRainTimeline60Min();
  const title = tDefault(customTitle || t('rain.title'));

  const statusLabel = rain.statusClass === 'dry' ? tr('Trocken', 'Dry') : (rain.statusClass === 'soon' ? tr('Regen erwartet', 'Rain expected') : t('weather.precipitation'));
  const statusColor = rain.statusClass === 'dry' ? 'var(--ok)' : (rain.statusClass === 'soon' ? 'var(--cool)' : 'var(--warn)');

  const bars = rain.slots.map(s => {
    const barH = s.mm > 0 ? Math.min(54, Math.max(14, s.mm * 20)) : (s.prob > 15 ? Math.max(8, s.prob * 0.35) : 4);
    const barColor = s.mm > 2.0 ? '#f59e0b' : (s.mm > 0.5 ? '#2563eb' : (s.mm > 0 ? '#38bdf8' : (s.prob > 20 ? 'rgba(56,189,248,.35)' : 'rgba(255,255,255,.07)')));
    const topLabel = s.mm > 0 ? `${s.mm}mm` : (s.prob > 0 ? `${s.prob}%` : '0');

    return `<div class="rt-slot" title="${s.time}: ${s.mm} mm/h (${s.prob}%)">
      <div class="rt-val">${topLabel}</div>
      <div class="rt-bar-wrap">
        <div class="rt-bar" style="height:${barH}px;background:${barColor}"></div>
      </div>
      <div class="rt-time">${s.label}</div>
    </div>`;
  }).join('');

  return `<section class="card rain-timeline-card">
    <div class="ch">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:18px">🌧️</span>
        <b>${esc(title)}</b>
      </div>
      <span class="pill" style="font-size:10px;padding:3px 8px;border-color:${statusColor};color:${statusColor}">${statusLabel}</span>
    </div>
    <div class="rain-advice-banner ${rain.statusClass}">
      ${esc(rain.advice)}
    </div>
    <div class="rt-grid">
      ${bars}
    </div>
  </section>`;
}

/* ---------- SPEICHER-RESTLAUFZEIT & LADEPROGNOSE ---------- */
function batteryForecastCard(customTitle, forceShow = false) {
  const bfCfg = CONFIG.batteryForecast || {};
  if (!forceShow && bfCfg.show === false) return '';
  const bf = calcBatteryForecast();
  if (!bf) return (ui.editMode || forceShow) ? `<section class="card"><div class="ch"><b>⚡ ${esc(tDefault(customTitle || t('bat.title')))}</b></div><div class="page-note">${t('bat.empty')}</div></section>` : '';

  const title = tDefault(customTitle || t('bat.title'));
  const isChg = bf.state === 'charging';
  const isDis = bf.state === 'discharging';
  const stLbl = isChg ? tr('Lädt', 'Charging') : (isDis ? tr('Entlädt', 'Discharging') : t('state.standby'));
  const stateColor = isChg ? 'var(--ok)' : (isDis ? 'var(--cool)' : 'var(--mut)');
  const stateIco = isChg ? ic('batteryCharge', 22) : (isDis ? ic('battery', 22) : ic('batteryClock', 22));

  return `<section class="card battery-forecast-card">
    <div class="ch">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="color:${stateColor}">${stateIco}</span>
        <b>${esc(title)}</b>
      </div>
      <span class="pill on" style="font-size:11px;padding:3px 9px;border-color:${stateColor};color:#fff">${bf.soc}% · ${stLbl}</span>
    </div>

    <div class="bf-hero ${bf.state}">
      <div class="bf-hero-left">
        <div class="bf-hero-headline">${esc(bf.shortDesc)}</div>
        <div class="bf-hero-sub">${esc(bf.desc)}</div>
      </div>
      <div class="bf-hero-right">
        <div class="bf-hero-eta">${bf.targetTime}</div>
        <small class="mut">${isChg ? t('bat.full_at') : t('bat.empty_at')}</small>
      </div>
    </div>

    <div class="bf-prog-wrap">
      <div class="bf-prog-bar">
        <div class="bf-prog-fill ${bf.state}" style="width:${clamp(bf.soc, 0, 100)}%"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--mut);margin-top:4px">
        <span>0%</span>
        <span>Min: ${bfCfg.minSoC || 5}%</span>
        <span>100% (${bfCfg.capacityKwh || 10} kWh)</span>
      </div>
    </div>

    <div class="bf-stats-row">
      <div class="bf-stat-col">
        <span class="mut sm">SoC</span>
        <b>${bf.soc}%</b>
      </div>
      <div class="bf-stat-col">
        <span class="mut sm">${t('dev.col_power')}</span>
        <b style="color:${stateColor}">${fmt(bf.powerW, 0)} W</b>
      </div>
      <div class="bf-stat-col">
        <span class="mut sm">${isChg ? t('bat.full_at') : t('bat.empty_at')}</span>
        <b>${bf.etaStr}</b>
      </div>
    </div>
  </section>`;
}

/* ---------- SYSTEM-HEALTH (Server & Docker) ---------- */
function systemHealthCard(forceShow = false, customTitle = null) {
  const sh = CONFIG.systemHealth || {};
  if (!forceShow && sh.show === false) return '';
  const hasAny = sh.cpu || sh.ram || sh.disk || sh.temp || (sh.containers && sh.containers.length);
  if (!hasAny && !ui.editMode && !forceShow) return '';
  const cpu = num(sh.cpu);
  const ram = num(sh.ram);
  const disk = num(sh.disk);
  const temp = num(sh.temp);

  const gaugeBar = (lbl, val, unit, max = 100, warnAt = 80) => {
    const v = val != null ? val : 0;
    const isWarn = v >= warnAt;
    const pct = clamp(Math.round((v / max) * 100), 0, 100);
    return `<div style="flex:1;min-width:70px;background:rgba(255,255,255,.025);border:1px solid var(--line);border-radius:12px;padding:8px 10px">
      <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:4px">
        <span class="mut">${lbl}</span>
        <b style="color:${isWarn ? 'var(--warn)' : 'var(--txt)'}">${val != null ? fmt(val, 0) + unit : '–'}</b>
      </div>
      <div style="height:4px;border-radius:2px;background:rgba(255,255,255,.08);overflow:hidden">
        <div style="width:${pct}%;height:100%;background:${isWarn ? 'var(--warn)' : 'var(--ok)'}"></div>
      </div>
    </div>`;
  };

  const containerList = (sh.containers || []).map(c => {
    const s = S(c.entity);
    const isUp = s && (s.state === 'on' || s.state === 'running');
    return `<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;font-size:12px;border-bottom:1px dashed rgba(255,255,255,.04)">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="width:8px;height:8px;border-radius:50%;background:${isUp ? 'var(--ok)' : 'var(--warn)'}"></span>
        <span>${esc(c.name || c.entity)}</span>
      </div>
      ${c.entity ? `<button class="chip ${isUp ? 'on' : ''}" style="padding:2px 8px;font-size:10px" data-act="callService" data-e="${esc(c.entity)}" data-srv="toggle">${isUp ? 'Online' : tr('Starten', 'Start')}</button>` : ''}
    </div>`;
  }).join('');

  return `<section class="card">
    <div class="ch"><b>🖥️ ${esc(tDefault(customTitle || sh.title || t('sys.title')))}</b><span class="mut sm">Server &amp; Docker</span></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
      ${sh.cpu ? gaugeBar('CPU', cpu, '%') : ''}
      ${sh.ram ? gaugeBar('RAM', ram, '%') : ''}
      ${sh.disk ? gaugeBar('Disk', disk, '%') : ''}
      ${sh.temp ? gaugeBar('Temp', temp, '°C', 90, 75) : ''}
    </div>
    ${containerList ? `<div style="margin-top:8px">${containerList}</div>` : (!hasAny ? `<div class="page-note">${t('sys.empty')}</div>` : '')}
  </section>`;
}

function getGroupToggleEntities(g) {
  if (!g) return [];
  const ex = Array.isArray(g.excludeGroup) ? g.excludeGroup : [];
  return (g.entities || []).filter(e => !ex.includes(e));
}

function groupInfo(g) {
  const ents = (g && g.entities) || [];
  const on = ents.filter(e => { const s = S(e); return s && s.state === 'on'; }).length;
  const toggleEnts = getGroupToggleEntities(g);
  const toggleOn = toggleEnts.filter(e => { const s = S(e); return s && s.state === 'on'; }).length;
  return { on, total: ents.length, toggleEnts, toggleOn };
}

function getMainLightEntities() {
  const lm = CONFIG.lightsMain || { mode: 'group', group: 0, entities: [] };
  const globalExMain = new Set();
  (CONFIG.lights || []).forEach(g => {
    (g.excludeMain || []).forEach(e => globalExMain.add(e));
  });
  let ents = [];
  if (lm.mode === 'all') {
    (CONFIG.lights || []).forEach(g => {
      if (g.mainSync !== false) {
        const ex = g.excludeMain || [];
        (g.entities || []).forEach(e => {
          if (!ex.includes(e)) ents.push(e);
        });
      }
    });
  } else if (lm.mode === 'custom') {
    ents = (lm.entities || []).filter(e => !globalExMain.has(e));
  } else {
    const g = (CONFIG.lights || [])[lm.group || 0];
    if (g) {
      const ex = g.excludeMain || [];
      ents = (g.entities || []).filter(e => !ex.includes(e));
    }
  }
  return [...new Set(ents)].filter(e => !globalExMain.has(e));
}

function lightsCard(filterGroup = null, customTitle = null) {
  const allGs = CONFIG.lights || [];
  const ctx = getCurrentViewContext(filterGroup, false);
  const indexed = allGs.map((g, idx) => ({ g, idx })).filter(({ g }) => {
    if (filterGroup && g.name && g.name.toLowerCase() === String(filterGroup).toLowerCase()) return true;
    return isItemVisibleInContext(g, ctx);
  });
  const titleTxt = tDefault(customTitle || t('lights.title'));
  if (!indexed.length) {
    return ui.editMode
      ? `<section class="card"><div class="ch"><b>${esc(titleTxt)}</b></div><div class="page-note">${tr('Keine Licht-Gruppen für diese Seite zugeordnet.', 'No light groups assigned to this page.')}</div></section>`
      : '';
  }
  const mainEnts = (!ctx.isHome || filterGroup)
    ? [...new Set(indexed.flatMap(({ g }) => getGroupToggleEntities(g)))]
    : getMainLightEntities();
  const main = groupInfo({ entities: mainEnts });
  const tiles = indexed.map(({ g, idx }) => {
    const gi = groupInfo(g);
    return `<div class="tile tile-light ${gi.on ? 'on' : ''}" data-act="lgrp" data-i="${idx}" title="${tr('Klick: Gruppe schalten · Gedrückthalten: Details & Ausnahmen', 'Click: Toggle group · Hold: Details & exclusions')}">
      ${ic('bulb', 18)}
      <span class="tile-light-txt">
        <b>${esc(g.name)}</b>
        <small>${t('lights.on_count', { on: gi.on, total: gi.total })}</small>
      </span>
      <button type="button" class="tile-dots-btn" data-act="lgrpDetail" data-i="${idx}" title="${tr('Details, Helligkeit & Ausnahmen', 'Details, brightness & exclusions')}">⋯</button>
    </div>`;
  }).join('');
  return `<section class="card"><div class="ch"><b>${esc(titleTxt)}</b><div class="sw ${main.on ? 'on' : ''}" data-act="lgrpMain" data-ents="${esc(mainEnts.join(','))}" title="${tr('Hauptschalter', 'Master switch')}"><i></i></div></div><div class="tiles">${tiles}</div></section>`;
}

function getCoreNav() {
  const pages = [
    { label: t('nav.dashboard'), icon: 'home', view: 'dashboard' },
    { label: t('nav.klima'), icon: 'thermo', view: 'klima' },
    { label: t('nav.cameras'), icon: 'camera', view: 'kameras' }
  ];
  (CONFIG.customPages || []).forEach(p => {
    pages.push({ label: tDefault(p.label), icon: p.icon || 'chart', view: 'page:' + p.id });
  });
  return pages;
}

function sidebar() {
  const hs = getHass(), name = tDefault(CONFIG.userName) || (hs && hs.user && hs.user.name) || t('hero.guest');
  const mainItems = getCoreNav().map(n => `<button class="nav ${n.view === ui.view ? 'on' : ''}" data-act="nav" data-view="${esc(n.view)}">${ic(n.icon, 18)}${esc(n.label)}</button>`).join('');
  const sysItems = (!CONFIG.hideSystemLinks && CONFIG.systemLinks && CONFIG.systemLinks.length)
    ? `<div class="nav-sep"></div>` + CONFIG.systemLinks.map(n => `<button class="nav" data-act="sysnav" data-path="${esc(n.path)}">${ic(n.icon, 18)}${esc(tDefault(n.label))}</button>`).join('')
    : '';
  const menuOpen = !!ui.profileMenuOpen;
  return `<aside class="side"><div class="logo"><div class="lg">${ic('home', 20)}</div>${esc(CONFIG.title || 'Home')}</div><div class="sub">${esc(CONFIG.subtitle || 'Home Assistant')}</div>
    ${mainItems}${sysItems}
    <div class="me-wrap">
      <div class="me-popover ${menuOpen ? 'open' : ''}" role="menu" aria-hidden="${menuOpen ? 'false' : 'true'}">
        <button type="button" class="me-pop-item ${ui.editMode ? 'on' : ''}" data-act="toggleEditMode">
          <span class="me-pop-ico">${ic('edit', 16)}</span>
          <span class="me-pop-txt"><b>${tr('Schnell-Bearbeiten', 'Quick-Edit')}</b><small>${ui.editMode ? tr('Aktiv – Antippen zum Beenden', 'Active – Tap to exit') : tr('Layout & Spalten direkt anpassen', 'Customize layout & columns directly')}</small></span>
        </button>
        <button type="button" class="me-pop-item ${CONFIG.kioskMode ? 'on' : ''}" data-act="toggleKiosk">
          <span class="me-pop-ico">${ic('expand', 16)}</span>
          <span class="me-pop-txt"><b>${tr('Vollbild / Kiosk', 'Fullscreen / Kiosk')}</b><small>${CONFIG.kioskMode ? tr('Aktiv – HA-Seitenleiste einblenden', 'Active – Show HA sidebar') : tr('HA-Seitenleiste ausblenden', 'Hide HA sidebar')}</small></span>
        </button>
        <button type="button" class="me-pop-item" data-act="cfgOpen">
          <span class="me-pop-ico">${ic('settings', 16)}</span>
          <span class="me-pop-txt"><b>${t('nav.configurator')}</b><small>${tr('Räume, Geräte, Design & Backup', 'Rooms, devices, theme & backup')}</small></span>
        </button>
      </div>
      <button type="button" class="me ${menuOpen ? 'open' : ''}" data-act="toggleProfileMenu" aria-expanded="${menuOpen ? 'true' : 'false'}" title="${tr('Menü öffnen (Schnell-Bearbeiten, Vollbild, Konfigurator)', 'Open menu (Quick-Edit, Fullscreen, Configurator)')}">
        <div class="me-user">
          <div class="av">${esc(name.charAt(0).toUpperCase())}</div>
          <div class="me-info"><b>${esc(name)}</b><small>${esc(tDefault(CONFIG.role || ''))}</small></div>
        </div>
        <span class="me-chev" aria-hidden="true">${ic(menuOpen ? 'down' : 'up', 15)}</span>
      </button>
    </div></aside>`;
}

const mtabs = () => `<div class="mtabs">${getCoreNav().map(n => `<button class="pill ${ui.view === n.view ? 'on' : ''}" data-act="nav" data-view="${esc(n.view)}">${esc(n.label)}</button>`).join('')}<button class="pill ${ui.editMode ? 'on' : ''}" data-act="toggleEditMode" title="Quick-Edit">✏️</button><button class="pill" data-act="cfgOpen">⚙️</button></div>`;

/* ---------- Klima-Ansicht ---------- */
function kDevice(d) {
  const E = esc(d.entity), s = S(d.entity), ico = d.icon || 'thermo';
  if (!s) return `<div class="kd"><div class="kdl"><div class="kdi">${ic(ico, 17)}</div><div><b>${esc(d.name)}</b><small>${tr('Entität nicht gefunden', 'Entity not found')}</small></div></div></div>`;
  const a = s.attributes || {}, off = ['off', 'unavailable', 'unknown'].includes(s.state);
  const act = a.hvac_action, cur = a.current_temperature, tgt = a.temperature;
  let label = HVAC_DE[s.state] || s.state, cls = '';
  if (off) label = s.state === 'off' ? t('hvac.off') : t('state.unavailable');
  else if (act === 'heating') { label = t('state.heating'); cls = 'warn'; }
  else if (act === 'cooling') { label = tr('Kühlt', 'Cooling'); cls = 'cool'; }
  else if (act === 'idle') { label = t('state.ready'); cls = 'on'; }
  else cls = 'on';
  const sub = `${label}${cur != null ? ' · ' + fmt(cur, 1) + tr('° ist', '° now') : ''}`;
  let ctrl = '';
  if (tgt != null && !off) {
    ctrl += d.readonly ? `<b class="mut">${t('klima.target')} ${fmt(tgt, 1)}°</b>`
      : `<div class="step"><button data-act="kstep" data-e="${E}" data-d="-1">−</button><b>${fmt(tgt, 1)}°</b><button data-act="kstep" data-e="${E}" data-d="1">+</button></div>`;
  }
  if (d.toggle) ctrl += `<div class="sw ${off ? '' : 'on'}" data-act="ktog" data-e="${E}"><i></i></div>`;
  const presets = (d.presets || []).filter(p => !a.preset_modes || a.preset_modes.includes(p));
  const pre = presets.length && !d.readonly ? `<div class="kdp">${presets.map(p => `<button class="pb ${a.preset_mode === p ? 'on' : ''}" data-act="kpre" data-e="${E}" data-p="${esc(p)}">${esc(PRESET_DE[p] || p)}</button>`).join('')}</div>` : '';
  return `<div class="kd"><div class="kdl dv-clickable" data-act="devDetail" data-e="${E}" data-name="${esc(d.name)}" title="${tr('Antippen für Klimadetails', 'Tap for climate details')}"><div class="kdi ${cls}">${ic(ico, 17)}</div><div><b>${esc(d.name)} <span class="dv-hint">⚙</span></b><small>${esc(sub)}</small></div></div><div class="kdr">${ctrl}</div>${pre}</div>`;
}

function klimaView() {
  const colsRaw = String(CONFIG.klimaCols || 'auto');
  const parsed = parseColsMode(colsRaw, 'auto', 2);
  const gridCls = parsed.mode === 'cols' ? 'kgrid cols-custom' : 'kgrid';
  const gridStyle = parsed.mode === 'cols' ? `style="--custom-cols:${parsed.cols}"` : '';
  const visibleRooms = (CONFIG.climateRooms || []).map((r, i) => ({ r, i })).filter(({ r }) => r.show !== false || ui.editMode);
  const cards = visibleRooms.map(({ r, i }) => {
    const sens = (r.sensors || []).map(x => {
      const s = S(x.entity);
      const rawVal = s ? (x.attr ? (s.attributes && s.attributes[x.attr]) : s.state) : undefined;
      const n = rawVal != null ? parseFloat(rawVal) : NaN;
      return `<span class="chip">${ic(x.icon || 'thermo', 14)}${isNaN(n) ? '—' : fmt(n, x.decimals ?? 1) + ' ' + esc(x.unit || '')}</span>`;
    }).join('');
    let boost = '';
    if (r.boost && r.boost.entity) { const b = S(r.boost.entity); boost = `<button class="boost ${b && b.state === 'on' ? 'on' : ''}" data-act="kboost" data-e="${esc(r.boost.entity)}">${ic('fire', 14)}${esc(r.boost.name || 'Boost')}</button>`; }
    const set = r.settings && r.settings.groups && r.settings.groups.length ? `<button class="iconbtn" data-act="smOpen" data-i="${i}">${ic('settings', 14)}${t('nav.ha_settings')}</button>` : '';
    const devs = (r.devices || []).map(kDevice).join('');
    const charts = (r.charts || []).map(c => {
      const key = '24:' + c.entity + (c.attr ? ':' + c.attr : '');
      const s = S(c.entity), a = (s && s.attributes) || {};
      const unit = (c.title || '').includes('Luftfeucht') ? '%' : (a.unit_of_measurement || '°C');
      return `<div class="kc" style="cursor:pointer;border-radius:10px;padding:6px;margin:6px -6px 0;transition:background .15s" onmouseover="this.style.background='rgba(255,255,255,.05)'" onmouseout="this.style.background='transparent'" data-act="chartModal" data-type="klima" data-entity="${esc(c.entity)}" data-attr="${esc(c.attr || '')}" data-name="${esc(tDefault(c.title || ''))}" data-unit="${esc(unit)}" data-dec="${c.decimals ?? 1}" title="${tr('Antippen für Großansicht', 'Tap for full view')}">
        <div class="kct" style="pointer-events:none"><span>${esc(tDefault(c.title || ''))}</span><span class="mut sm">24 h</span></div>
        <div style="pointer-events:none">${spark(series[key], 'k' + c.entity + (c.attr || ''), { fit: true, min: c.min, max: c.max, W: 320, H: 90, dec: c.decimals, unit })}</div></div>`;
    }).join('');
    const qeBar = ui.editMode ? `<div class="qe-bar">
      <span class="qe-title">🌡️ ${esc(r.name)}</span>
      <div class="qe-btns">
        <button class="qe-btn" data-act="qeKlimaMove" data-i="${i}" data-dir="-1" title="${t('qe.move_up')}">↑</button>
        <button class="qe-btn" data-act="qeKlimaMove" data-i="${i}" data-dir="1" title="${t('qe.move_down')}">↓</button>
        <button class="qe-btn ${r.show === false ? 'off' : ''}" data-act="qeKlimaVis" data-i="${i}" title="${t('qe.hide')}">${r.show === false ? '🙈 ' + t('qe.card_hidden') : '👁️ ' + t('qe.card_visible')}</button>
        <button class="qe-btn" data-act="cfgOpenTab" data-tab="klima" title="${t('qe.open_config')}">⚙️</button>
      </div>
    </div>` : '';
    return `<div class="qe-wrap ${r.show === false ? 'qe-hidden' : ''}">${qeBar}<section class="card"><div class="kh"><div class="khl"><div class="kic">${ic(r.icon || 'home', 20)}</div><b>${esc(r.name)}</b></div><div class="khr">${boost}${set}</div></div>
      ${sens ? `<div class="chips" style="margin-top:12px">${sens}</div>` : ''}${devs}${charts}</section></div>`;
  }).join('');
  const topToolbar = ui.editMode ? `<div class="qe-page-bar">
    <span>📐 <b>${tr('Klima-Spalten:', 'Climate Columns:')}</b></span>
    <button class="chip ${parsed.mode === 'auto' ? 'on' : ''}" data-act="qeSetKlimaCols" data-cols="auto">${tr('Automatisch', 'Automatic')}</button>
    ${[1, 2, 3, 4].map(n => `<button class="chip ${parsed.mode === 'cols' && parsed.cols === n ? 'on' : ''}" data-act="qeSetKlimaCols" data-cols="${n}">${n} ${n === 1 ? tr('Spalte', 'Column') : tr('Spalten', 'Columns')}</button>`).join('')}
    <label class="qe-col-custom"><span>${tr('Frei:', 'Custom:')}</span><input type="number" min="1" max="12" class="qe-col-input" data-act="qeKlimaColsInput" value="${parsed.mode === 'cols' ? parsed.cols : ''}" placeholder="1-12"><span>${tr('Sp.', 'Col.')}</span></label>
  </div>` : '';
  return `<div class="ktop"><div class="hi">${t('nav.klima')}</div><div class="name">${tr('Heizung & Klimaanlagen', 'Heating & Air Conditioning')}</div><div class="greet">${tr('Temperaturen, Heizungen und Klimaanlagen aller Räume – direkt steuerbar.', 'Temperatures, heaters, and air conditioners across all rooms – directly controllable.')}</div></div>${topToolbar}<div class="${gridCls}" ${gridStyle}>${cards || `<div class="mut">${tr('Noch keine Klima-Räume angelegt.', 'No climate rooms configured yet.')}</div>`}</div>`;
}

/* ---------- Baukasten für Eigene Seiten ---------- */
function pageHeader(eyebrow, title, intro) {
  return `<div class="page-head"><div class="hi">${esc(tDefault(eyebrow || ''))}</div><div class="name">${esc(tDefault(title || ''))}</div><div class="greet">${esc(tDefault(intro || ''))}</div></div>`;
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
    return `<section class="card"><div class="ch"><b>${esc(tDefault(title))}</b><span class="mut sm">${esc(entity)}</span></div><div class="mut sm">${t('state.unavailable')}</div></section>`;
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
  return `<section class="card"><div class="ch"><div><b>${esc(tDefault(title))}</b><div class="mut sm">${esc(entity)}</div></div><span class="iconbtn">${esc(compactValue(s.state))}</span></div>
    ${rows.length ? `<div class="data-list">${rows.map(([k,v]) => `<div class="data-row"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('')}</div>` : `<div class="mut sm">${tr('Keine Zusatzattribute vorhanden.', 'No additional attributes available.')}</div>`}</section>`;
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
      <div class="chart clickable" data-act="chartModal" data-type="stat" data-entity="${esc(item.entity)}" data-attr="${esc(item.attr || '')}" data-name="${esc(item.name)}" data-unit="${esc(unit)}" data-dec="${item.decimals ?? 1}" data-mode="${esc(item.mode || 'avg')}" title="${tr('Antippen für Großansicht', 'Tap for full view')}">${spark(series[key], 'stats-' + item.entity + (item.attr || ''), { fit: true, W: 320, H: 65, dec: item.decimals ?? 1, color: item.color, unit })}</div>
    </div>`;
  }).join('');
  return `<section class="card"><div class="ch"><div style="display:flex;align-items:center;gap:9px">${ic(group.icon || 'chart', 18)}<b>${esc(tDefault(group.title))}</b></div><span class="mut sm">24 h</span></div>${rows}</section>`;
}

function powerFlowCard(title = 'Power Flow') {
  const list = CONFIG.powerFlow || [];
  if (!list.length) return '';

  const findVal = (regex, fbIdx) => {
    let item = list.find(x => regex.test(x.label || '') || regex.test(x.entity || ''));
    if (!item && fbIdx != null) item = list[fbIdx];
    if (!item || !item.entity) return 0;
    const st = S(item.entity);
    const v = st && !['unknown', 'unavailable'].includes(st.state) ? parseFloat(st.state) : 0;
    return isNaN(v) ? 0 : v;
  };

  const pv       = Math.max(0, findVal(/pv|solar|prod/i, 0));
  const home     = Math.max(0, findVal(/haus|home|verbr/i, 1));
  const gridIn   = Math.max(0, findVal(/bezug|import/i, 2));
  const gridOut  = Math.max(0, findVal(/einspeis|export/i, 3));
  const batChg   = Math.max(0, findVal(/ladung|charge_power/i, 4));
  const batDis   = Math.max(0, findVal(/entladung|discharge_power/i, 5));
  const batSoc   = clamp(findVal(/zustand|soc|percent/i, 6), 0, 100);

  const fmtP = w => w >= 1000 ? `${fmt(w / 1000, 1)} kW` : `${fmt(w, 0)} W`;

  const fPvGrid   = pv > 10 && gridOut > 10;
  const fPvHome   = pv > 10 && home > 10;
  const fPvBat    = pv > 10 && batChg > 10;
  const fGridHome = gridIn > 10 && home > 10;
  const fGridBat  = gridIn > 10 && batChg > 10 && pv < 10;
  const fBatHome  = batDis > 10 && home > 10;

  const pPvGrid   = "M 188 106 C 188 160, 145 160, 96 160";
  const pPvHome   = "M 212 106 C 212 160, 255 160, 304 160";
  const pPvBat    = "M 200 108 L 200 242";
  const pGridHome = "M 98 175 L 302 175";
  const pGridBat  = "M 96 190 C 145 190, 188 190, 188 244";
  const pBatHome  = "M 212 244 C 212 190, 255 190, 304 190";

  const R = 38, C = 2 * Math.PI * R;
  const totalIn = (pv > 0 ? Math.min(pv, home) : 0) + batDis + gridIn;
  let homeRingSvg = `<circle cx="340" cy="175" r="${R}" class="pf-ring" stroke="#f59e0b"/>`;
  if (totalIn > 10) {
    const sPv   = clamp((pv > 0 ? Math.min(pv, home) : 0) / totalIn, 0, 1) * C;
    const sBat  = clamp(batDis / totalIn, 0, 1) * C;
    const sGrid = Math.max(0, C - sPv - sBat);
    homeRingSvg = `
      <circle cx="340" cy="175" r="${R}" class="pf-ring" stroke="#38bdf8" stroke-dasharray="${sGrid} ${C}" stroke-dashoffset="0" transform="rotate(-90 340 175)"/>
      <circle cx="340" cy="175" r="${R}" class="pf-ring" stroke="#34d399" stroke-dasharray="${sBat} ${C}" stroke-dashoffset="${-sGrid}" transform="rotate(-90 340 175)"/>
      <circle cx="340" cy="175" r="${R}" class="pf-ring" stroke="#f59e0b" stroke-dasharray="${sPv} ${C}" stroke-dashoffset="${-(sGrid + sBat)}" transform="rotate(-90 340 175)"/>`;
  }

  const dot = (path, color, active) => active ? `
    <circle r="4.5" fill="${color}" filter="drop-shadow(0 0 5px ${color})">
      <animateMotion dur="2.2s" repeatCount="indefinite" path="${path}"/>
    </circle>` : '';

  return `<section class="card">
    <div class="ch"><b>${esc(tDefault(title))}</b><span class="mut sm">${t('energy.live_flow')}</span></div>
    <div class="pf-wrap">
      <svg viewBox="0 0 400 350" class="pf-svg">
        <path d="${pPvGrid}"   class="pf-line ${fPvGrid ? 'on' : ''}"   stroke="#a855f7"/>
        <path d="${pPvHome}"   class="pf-line ${fPvHome ? 'on' : ''}"   stroke="#f59e0b"/>
        <path d="${pPvBat}"    class="pf-line ${fPvBat ? 'on' : ''}"    stroke="#a99bff"/>
        <path d="${pGridHome}" class="pf-line ${fGridHome ? 'on' : ''}" stroke="#38bdf8"/>
        <path d="${pGridBat}"  class="pf-line ${fGridBat ? 'on' : ''}"  stroke="#a855f7"/>
        <path d="${pBatHome}"  class="pf-line ${fBatHome ? 'on' : ''}"  stroke="#34d399"/>

        ${dot(pPvGrid,   '#a855f7', fPvGrid)}
        ${dot(pPvHome,   '#f59e0b', fPvHome)}
        ${dot(pPvBat,    '#a99bff', fPvBat)}
        ${dot(pGridHome, '#38bdf8', fGridHome)}
        ${dot(pGridBat,  '#a855f7', fGridBat)}
        ${dot(pBatHome,  '#34d399', fBatHome)}

        <text x="200" y="21" class="pf-lbl">PV</text>
        <circle cx="200" cy="70" r="38" class="pf-node" stroke="#f59e0b"/>
        <g transform="translate(191, 46)" stroke="#f2f3fa" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="6" cy="6" r="3.5"/><path d="M6 1v1.5M6 9.5V11M1 6h1.5M9.5 6H11"/>
          <path d="M14 5l-3 5h3l-1 4 4-6h-3z"/>
        </g>
        <text x="200" y="86" class="pf-val">${esc(fmtP(pv))}</text>

        <circle cx="60" cy="175" r="38" class="pf-node" stroke="#a855f7"/>
        <g transform="translate(51, 142)" stroke="#f2f3fa" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 2L4 18M9 2l5 16M3 7h12M2 12h14M5 18h8"/>
        </g>
        <text x="60" y="176" class="pf-sub" fill="#c084fc">← ${esc(fmtP(gridOut))}</text>
        <text x="60" y="191" class="pf-sub" fill="#38bdf8">→ ${esc(fmtP(gridIn))}</text>
        <text x="60" y="230" class="pf-lbl">${t('energy.grid')}</text>

        ${homeRingSvg}
        <g transform="translate(330, 148)" fill="#f2f3fa">
          <path d="M10 2L1 10h3v8h5v-5h2v5h5v-8h3L10 2z"/>
        </g>
        <text x="340" y="187" class="pf-val">${esc(fmtP(home))}</text>
        <text x="340" y="230" class="pf-lbl">Home</text>

        <circle cx="200" cy="280" r="38" class="pf-node" stroke="#a99bff"/>
        <text x="200" y="257" class="pf-val" style="font-size:11px">${fmt(batSoc, 0)} %</text>
        <g transform="translate(194, 262)" stroke="#f2f3fa" stroke-width="1.7" fill="none">
          <rect x="2" y="3" width="8" height="14" rx="1.5"/>
          <path d="M4.5 1h3"/>
          <rect x="3.5" y="${15 - (batSoc / 100) * 10}" width="5" height="${(batSoc / 100) * 10}" fill="#34d399" stroke="none"/>
        </g>
        <text x="200" y="293" class="pf-sub" fill="#a99bff">↓ ${esc(fmtP(batChg))}</text>
        <text x="200" y="307" class="pf-sub" fill="#34d399">↑ ${esc(fmtP(batDis))}</text>
        <text x="200" y="335" class="pf-lbl">${t('energy.battery')}</text>
      </svg>
    </div>
  </section>`;
}

/* ---------- power-flow-card-plus (HACS) mit Kachel-Fallback ---------- */
const hasPFCPlus = () => {
  try { return !!window.parent.customElements.get('power-flow-card-plus'); }
  catch (e) { return false; }
};
const pfcCache = {};

function pfcDefaultConfig() {
  const L = CONFIG.powerFlow || [];
  const pick = (re, i) => {
    const x = L.find(p => re.test((p.label || '') + ' ' + (p.entity || ''))) || L[i];
    return (x && x.entity) || '';
  };
  return {
    entities: {
      grid: { entity: { consumption: pick(/bezug|import/i, 2), production: pick(/einspeis|export/i, 3) } },
      solar: { entity: pick(/pv|solar|prod/i, 0) },
      battery: {
        entity: {
          consumption: pick(/(?<!ent)ladung|(?<!dis)charge_power/i, 4),
          production: pick(/entladung|discharge_power/i, 5)
        },
        state_of_charge: pick(/zustand|soc|percent/i, 6)
      },
      home: { entity: pick(/haus|home|verbr/i, 1) }
    }
  };
}

function powerFlowTilesCard(title = 'PV Anlage') {
  const list = CONFIG.powerFlow || [];
  if (!list.length) return '';
  const tiles = list.map(p => {
    const st = p.entity ? S(p.entity) : null;
    const v = st && !['unknown', 'unavailable'].includes(st.state) ? parseFloat(st.state) : NaN;
    const unit = p.unit || (st && st.attributes && st.attributes.unit_of_measurement) || '';
    const txt = isNaN(v) ? '—' : `${fmt(v, 0)} ${esc(unit)}`;
    return `<div class="mini">${ic(p.icon || 'plug', 18)}<span><small>${esc(tDefault(p.label))}</small>${txt}</span></div>`;
  }).join('');
  return `<section class="card"><div class="ch"><b>${esc(tDefault(title))}</b><span class="mut sm">${t('energy.live_flow')}</span></div><div class="two">${tiles}</div></section>`;
}

function powerFlowHacsCard(w) {
  const title = w.title || 'Power Flow';
  if (!hasPFCPlus()) {
    return `<section class="card"><div class="ch"><b>${esc(title)}</b></div><div class="page-note">${tr('„power-flow-card-plus“ ist in Home Assistant nicht geladen. Über HACS installieren oder die Darstellung auf „Automatisch“ stellen.', '"power-flow-card-plus" is not loaded in Home Assistant. Install via HACS or set display to "Automatic".')}</div></section>`;
  }
  const key = 'pfc:' + title;
  const cfg = w.cardConfig && typeof w.cardConfig === 'object' ? w.cardConfig : pfcDefaultConfig();
  const sig = JSON.stringify(cfg);
  if (!pfcCache[key] || pfcCache[key].sig !== sig) {
    try {
      const el = window.parent.document.createElement('power-flow-card-plus');
      el.setConfig(cfg);
      pfcCache[key] = { el, sig };
    } catch (e) {
      return `<section class="card"><div class="ch"><b>${esc(title)}</b></div><div class="page-note">${tr('Karten-Konfiguration fehlerhaft:', 'Card configuration error:')} ${esc(e.message)}</div></section>`;
    }
  }
  return `<section class="pfc-card"><div class="pfc-host" data-pfc="${esc(key)}"></div></section>`;
}

function updatePFC() {
  const h = getHass(); if (!h) return;
  Object.values(pfcCache).forEach(({ el }) => { try { el.hass = h; } catch (e) {} });
}
function mountPFC() {
  document.querySelectorAll('.pfc-host').forEach(host => {
    const entry = pfcCache[host.dataset.pfc];
    if (entry) host.appendChild(entry.el);
  });
  updatePFC();
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
    const title = task.title || task.name || task.task_name || task.task || task.text || task.label || `${tr('Aufgabe', 'Task')} ${i + 1}`;
    const secondary = [task.due || task.due_date || task.date, task.description, task.status || task.state].filter(Boolean).map(compactValue).join(' · ');
    return `<div class="match-row"><b>${esc(title)}</b>${secondary ? `<small>${esc(secondary)}</small>` : ''}</div>`;
  }).join('') : '';
  return `<section class="card"><div class="ch"><div style="display:flex;align-items:center;gap:9px">${ic('tasks',18)}<b>${esc(child.name)}</b></div><span class="mut sm">${tDefault('Aufgaben')}</span></div>
    ${taskRows ? `<div class="match-list">${taskRows}</div>` : `<div class="page-note">${t('task.all_done')}</div>`}</section>`;
}

function klimaRoomSingleCard(filterRoom = '', customTitle = null) {
  const allRooms = (CONFIG.climateRooms || []).map((r, i) => ({ r, i }));
  const matches = filterRoom
    ? allRooms.filter(({ r }) => r && r.name && r.name.toLowerCase() === String(filterRoom).toLowerCase())
    : allRooms.filter(({ r }) => r && r.show !== false);
  if (!matches.length) {
    return `<section class="card"><div class="ch"><b>🌡️ ${esc(customTitle || filterRoom || t('nav.klima'))}</b></div><div class="page-note">${tr('Kein passender Klima-Raum im Klima-Baukasten gefunden.', 'No matching climate room found.')}</div></section>`;
  }
  return matches.map(({ r, i }) => {
    const sens = (r.sensors || []).map(x => {
      const s = S(x.entity);
      const rawVal = s ? (x.attr ? (s.attributes && s.attributes[x.attr]) : s.state) : undefined;
      const n = rawVal != null ? parseFloat(rawVal) : NaN;
      return `<span class="chip">${ic(x.icon || 'thermo', 14)}${isNaN(n) ? '—' : fmt(n, x.decimals ?? 1) + ' ' + esc(x.unit || '')}</span>`;
    }).join('');
    let boost = '';
    if (r.boost && r.boost.entity) { const b = S(r.boost.entity); boost = `<button class="boost ${b && b.state === 'on' ? 'on' : ''}" data-act="kboost" data-e="${esc(r.boost.entity)}">${ic('fire', 14)}${esc(r.boost.name || 'Boost')}</button>`; }
    const set = r.settings && r.settings.groups && r.settings.groups.length ? `<button class="iconbtn" data-act="smOpen" data-i="${i}">${ic('settings', 14)}${t('nav.ha_settings')}</button>` : '';
    const devs = (r.devices || []).map(kDevice).join('');
    const charts = (r.charts || []).map(c => {
      const key = '24:' + c.entity + (c.attr ? ':' + c.attr : '');
      const s = S(c.entity), a = (s && s.attributes) || {};
      const unit = (c.title || '').includes('Luftfeucht') ? '%' : (a.unit_of_measurement || '°C');
      return `<div class="kc" style="cursor:pointer;border-radius:10px;padding:6px;margin:6px -6px 0;transition:background .15s" onmouseover="this.style.background='rgba(255,255,255,.05)'" onmouseout="this.style.background='transparent'" data-act="chartModal" data-type="klima" data-entity="${esc(c.entity)}" data-attr="${esc(c.attr || '')}" data-name="${esc(tDefault(c.title || ''))}" data-unit="${esc(unit)}" data-dec="${c.decimals ?? 1}" title="${tr('Antippen für Großansicht', 'Tap for full view')}">
        <div class="kct" style="pointer-events:none"><span>${esc(tDefault(c.title || ''))}</span><span class="mut sm">24 h</span></div>
        <div style="pointer-events:none">${spark(series[key], 'k' + c.entity + (c.attr || ''), { fit: true, min: c.min, max: c.max, W: 320, H: 90, dec: c.decimals, unit })}</div></div>`;
    }).join('');
    return `<section class="card"><div class="kh"><div class="khl"><div class="kic">${ic(r.icon || 'home', 20)}</div><b>${esc(customTitle || r.name)}</b></div><div class="khr">${boost}${set}</div></div>
      ${sens ? `<div class="chips" style="margin-top:12px">${sens}</div>` : ''}${devs}${charts}</section>`;
  }).join('');
}

function renderCustomWidget(w, widgetKey = 'sh_default') {
  if (w.type === 'sports_hub') return sportsHubCard(w, widgetKey);
  if (w.type === 'entity_info') {
    const fields = String(w.fields || '').split(',').map(x => x.trim()).filter(Boolean).map(pair => pair.includes(':') ? pair.split(':') : pair);
    return entityInfoCard(w.entity, w.title || w.entity, fields);
  }
  if (w.type === 'buli_team') return buliTeamCard(w);
  if (w.type === 'buli_matchday') return buliMatchdayCard(w);
  if (w.type === 'stat_group') return statChartCard(w);
  if (w.type === 'power_flow') {
    if (w.mode === 'svg') return powerFlowCard(w.title || 'Power Flow');
    const useCard = w.mode === 'card' || (w.mode !== 'native' && hasPFCPlus());
    return useCard ? powerFlowHacsCard(w) : powerFlowTilesCard(w.title || 'PV Anlage');
  }
  if (w.type === 'weather_forecast') return weatherForecastCard(w.title);
  if (w.type === 'rain_timeline') return rainTimelineCard(w.title, true);
  if (w.type === 'battery_forecast') return batteryForecastCard(w.title, true);
  if (w.type === 'energy_prices') return energyPricesCard(w.title, true);
  if (w.type === 'wallbox') return wallboxCard(w.title, true);
  if (w.type === 'appliances') return appliancesCard(w.title, true);
  if (w.type === 'devices') return devicesCard(w.room || w.entity || '', w.title || tDefault('Geräte'), w.tab || '');
  if (w.type === 'lights') return lightsCard(w.room || w.entity || '', w.title || t('lights.title'));
  if (w.type === 'covers') return coversCard(w.room || w.entity || '', w.title || t('dev.covers_title'));
  if (w.type === 'favorites') return favoritesCard(w.room || w.entity || '', w.title || t('fav.title'));
  if (w.type === 'quick_routines' || w.type === 'routines') return routinesCard(w.title);
  if (w.type === 'presence') return presenceCard(true, w.title);
  if (w.type === 'ventilation') return ventilationCard(true, w.room || w.entity || '', w.title);
  if (w.type === 'system_health') return systemHealthCard(true, w.title);
  if (w.type === 'security') return securityCard(w.title);
  if (w.type === 'status') return rightTopStatus();
  if (w.type === 'alerts') return conditionalAlertsCard();
  if (w.type === 'climate') return climateCard();
  if (w.type === 'climate_room') return klimaRoomSingleCard(w.room || w.entity || '', w.title);
  if (w.type === 'metrics') {
    const mList = (CONFIG.metrics || []).filter(m => !w.entity || m.id === w.entity || m.title === w.entity);
    return (mList.length ? mList : (CONFIG.metrics || [])).map(metricCard).join('');
  }
  if (w.type === 'calendar') return homeCalendarCard(w.daysCount || w.days || 14, w.title, 'page', w.style || null);
  if (w.type === 'trash') return homeTrashCard(w.maxDays || w.days || 30, w.maxItems || 25, tDefault(w.subtitle || t('trash.sub_30d')));
  if (w.type === 'todo') {
    if (w.mode === 'taskmate') {
      return (w.children || []).map(c => taskmateChildCard(w.entity, c)).join('');
    }
    return entityInfoCard(w.entity, w.title || 'To-Do');
  }
  if (w.type === 'iframe') {
    const rawUrl = String(w.url || w.entity || '').trim();
    const safeUrl = (/^https?:\/\//i.test(rawUrl) || rawUrl.startsWith('/')) ? rawUrl : '';
    return `<section class="card"><div class="ch"><b>${esc(w.title || tr('Einbettung', 'Embed'))}</b></div>${safeUrl ? `<iframe class="iframe-widget" src="${esc(safeUrl)}" allow="autoplay; fullscreen" allowfullscreen></iframe>` : `<div class="page-note">${tr('Ungültige oder unsichere Einbettungs-URL (nur http/https erlaubt).', 'Invalid or unsafe embed URL (only http/https allowed).')}</div>`}</section>`;
  }
  if (w.type === 'camera') {
    const rawEnt = String(w.entity || '').trim();
    const isRawStream = rawEnt && !rawEnt.toLowerCase().startsWith('camera.');
    const streamHint = String(w.stream || (isRawStream ? rawEnt : '')).trim();
    const entityHint = isRawStream ? '' : rawEnt;
    const resolvedStream = resolveGo2rtcStream(streamHint, entityHint || rawEnt);
    const resolvedEnt = resolveCamEntity(resolvedStream || streamHint, entityHint);
    const useGo2 = canUseGo2rtc() && !!resolvedStream;
    const host = String(CONFIG.go2rtcHost || '').trim().replace(/\/+$/, '');
    const camTitle = w.title || tr('Kamera', 'Camera');
    const mediaHtml = useGo2
      ? `<iframe src="${esc(`${host}/stream.html?src=${encodeURIComponent(resolvedStream)}&mode=webrtc`)}" allow="autoplay; fullscreen" allowfullscreen></iframe>`
      : (resolvedEnt && camUrl(resolvedEnt, true)
        ? `<img src="${esc(camUrl(resolvedEnt, true))}" alt="${esc(camTitle)}">`
        : `<div class="cam-placeholder">${ic('camera', 26)}<span>${t('cam.unavailable')}</span></div>`);
    return `<section class="cam-card" style="cursor:pointer" data-act="camCardBig" data-webrtc="${esc(resolvedStream)}" data-cam="${esc(resolvedEnt)}" data-title="${esc(camTitle)}">
      <div class="cam-hdr">
        <span>${esc(camTitle)}</span>
        <button type="button" class="expand" data-act="camCardBig" data-webrtc="${esc(resolvedStream)}" data-cam="${esc(resolvedEnt)}" data-title="${esc(camTitle)}">${ic('expand', 14)} ${t('cam.fullscreen')}</button>
      </div>
      <div class="cam-wrap">${mediaHtml}</div>
    </section>`;
  }
  if (w.type === 'buli_table') return buliTableCard(w);
  if (w.type === 'f1_next') return f1NextRaceCard(w);
  if (w.type === 'f1_standings') return f1StandingsCard(w);
  if (w.type === 'media_hub') return typeof mediaHubCard === 'function' ? mediaHubCard(w.title, true, widgetKey) : '';
  return '';
}

/* ---------- DYNAMISCHE STROMPREISE (Tibber / EPEX Spot) ---------- */
function energyPricesCard(customTitle, forceShow = false) {
  const cfg = CONFIG.energyPrices || {};
  if (!forceShow && cfg.show === false) return '';
  const s = S(cfg.entity);
  const titleTxt = tDefault(customTitle || cfg.title || t('energy.prices_title'));
  if (!s || !s.attributes) return (ui.editMode || forceShow) ? `<section class="card"><div class="ch"><b>💶 ${esc(titleTxt)}</b></div><div class="page-note">${t('energy.prices_empty')}</div></section>` : '';
  
  const attr = s.attributes;
  const today = attr.today || attr.prices_today || [];
  const tmr = attr.tomorrow || attr.prices_tomorrow || [];
  const allPrices = [...today, ...tmr].slice(0, 48); // max 48h
  
  if (!allPrices.length) return `<section class="card"><div class="ch"><b>💶 ${esc(titleTxt)}</b></div><div class="page-note">${t('energy.prices_empty')}</div></section>`;

  const now = new Date();
  const curHourIso = now.toISOString().slice(0, 13);
  let curPriceObj = allPrices.find(p => (p.starts_at || p.start_time || '').startsWith(curHourIso));
  if (!curPriceObj && today.length) curPriceObj = today[now.getHours()];
  
  const isEur = (cfg.priceUnit || 'Cent') === 'EUR';
  const mult = isEur ? 100 : 1;
  const curPriceCent = curPriceObj ? (curPriceObj.total || curPriceObj.price || 0) * mult : 0;
  
  const cheapThresh = cfg.cheapThreshold != null ? cfg.cheapThreshold : 20;
  const expThresh = cfg.expensiveThreshold != null ? cfg.expensiveThreshold : 32;

  const getCol = val => val < cheapThresh ? '#34d399' : (val > expThresh ? '#ef4444' : '#fcd34d');

  // Nächste 24h rendern
  const startIndex = allPrices.findIndex(p => (p.starts_at || p.start_time || '').startsWith(curHourIso)) || now.getHours();
  const next24 = allPrices.slice(startIndex, startIndex + 24);
  const maxP = Math.max(...next24.map(p => (p.total || p.price || 0) * mult), expThresh);
  
  const bars = next24.map((p, i) => {
    const valCent = (p.total || p.price || 0) * mult;
    const hPct = clamp((valCent / maxP) * 100, 5, 100);
    const col = getCol(valCent);
    const timeStr = (p.starts_at || p.start_time) ? new Date(p.starts_at || p.start_time).getHours() + 'h' : ((startIndex + i) % 24) + 'h';
    return `<div class="ep-slot" title="${timeStr}: ${fmt(valCent, 1)} Cent">
      <div class="ep-bar" style="height:${hPct}%;background:${col};opacity:${i===0 ? 1 : 0.6}"></div>
      <div class="ep-lbl">${i % 3 === 0 ? timeStr : ''}</div>
    </div>`;
  }).join('');

  return `<section class="card energy-prices-card">
    <div class="ch">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:18px">💶</span>
        <b>${esc(titleTxt)}</b>
      </div>
      <span class="pill" style="font-size:11px;padding:3px 9px;background:rgba(255,255,255,.05);color:${getCol(curPriceCent)};border-color:${getCol(curPriceCent)}">${fmt(curPriceCent, 1)} Cent/kWh</span>
    </div>
    <div class="ep-grid" style="display:flex;align-items:flex-end;height:80px;gap:2px;margin-top:12px;padding-bottom:18px;border-bottom:1px solid var(--line);position:relative">
      ${bars}
    </div>
    <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--mut);margin-top:6px">
      <span>${t('rain.now')}</span>
      <span>${tr('Nächste 24 Stunden', 'Next 24 hours')}</span>
      <span>+24h</span>
    </div>
  </section>`;
}

/* ---------- WALLBOX & E-AUTO ---------- */
function wallboxCard(customTitle, forceShow = false) {
  const cfg = CONFIG.wallbox || {};
  if (!forceShow && cfg.show === false) return '';
  const hasAny = cfg.socEntity || cfg.powerEntity || cfg.statusEntity || cfg.modeEntity;
  if (!hasAny && !ui.editMode && !forceShow) return '';
  
  const soc = num(cfg.socEntity);
  const pwr = Math.max(0, num(cfg.powerEntity) || 0);
  const statusS = S(cfg.statusEntity);
  const modeS = S(cfg.modeEntity);
  
  const isCharging = pwr > 50 || (statusS && (statusS.state === 'charging' || statusS.state === 'Läd'));
  const isConnected = isCharging || (statusS && ['connected', 'verbunden', 'steckend'].includes((statusS.state||'').toLowerCase()));
  
  const stLbl = isCharging ? t('bat.charging', { w: fmt(pwr, 0) }) : (isConnected ? t('energy.connected') : t('energy.not_connected'));
  const stateCol = isCharging ? 'var(--ok)' : (isConnected ? 'var(--acc2)' : 'var(--mut)');
  
  // Modus Toggle (wenn input_select oder switch)
  let modeBtn = '';
  if (modeS) {
    const modes = modeS.attributes.options || ['PV', 'Schnell'];
    const curM = modeS.state;
    modeBtn = `<button class="pill" style="font-size:10px;padding:3px 8px;border-color:var(--line)" data-act="callService" data-e="${esc(cfg.modeEntity)}" data-srv="toggle" title="${t('energy.charge_mode')}: ${esc(curM)}">🔄 ${esc(curM)}</button>`;
  }

  return `<section class="card wallbox-card">
    <div class="ch">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:18px;color:${stateCol}">🚗</span>
        <b>${esc(tDefault(customTitle || cfg.title || t('energy.wallbox_title')))}</b>
      </div>
      ${modeBtn}
    </div>
    <div style="display:flex;align-items:center;gap:16px;margin-top:12px">
      <div style="position:relative;width:60px;height:60px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:rgba(255,255,255,.03);border:2px solid ${stateCol}">
        <b style="font-size:15px;color:var(--txt)">${soc != null ? soc + '%' : '--'}</b>
        ${isCharging ? `<div style="position:absolute;bottom:-6px;background:var(--bg);padding:0 4px;color:var(--ok);font-size:14px">⚡</div>` : ''}
      </div>
      <div style="flex:1">
        <div style="font-weight:600;font-size:14px;color:var(--txt)">${stLbl}</div>
        <div class="mut sm" style="margin-top:2px">${t('dev.col_status')}</div>
      </div>
      ${isConnected ? `<button class="iconbtn" style="width:40px;height:40px;border-radius:20px;background:rgba(255,255,255,.05);color:var(--txt)" data-act="callService" data-e="${esc(cfg.statusEntity)}" data-srv="toggle" title="${isCharging ? t('energy.stop') : t('energy.start')}">${isCharging ? '⏸' : '▶'}</button>` : ''}
    </div>
  </section>`;
}

/* ---------- HAUSHALTSGERÄTE-MONITOR ---------- */
function appliancesCard(customTitle, forceShow = false, filterRoom = null) {
  const cfg = CONFIG.appliances || {};
  const ctx = getCurrentViewContext(filterRoom, false);
  const visibleItems = (cfg.items || []).filter(a => isItemVisibleInContext(a, ctx));
  const titleTxt = tDefault(customTitle || cfg.title || t('app.title'));
  if ((!forceShow && customTitle == null && cfg.show === false) || !visibleItems.length) {
    return (ui.editMode || forceShow) && !visibleItems.length
      ? `<section class="card"><div class="ch"><b>🧺 ${esc(titleTxt)}</b></div><div class="page-note">${t('app.empty')}</div></section>`
      : '';
  }
  
  const rows = visibleItems.map(a => {
    const sState = S(a.stateEntity);
    const sProg = S(a.progEntity);
    const sRem = S(a.remainEntity);
    const pwr = num(a.powerEntity);

    const stateStr = (sState && stateIsUsable(sState) ? String(sState.state) : '').toLowerCase();
    const pVal = sProg && stateIsUsable(sProg) ? parseFloat(sProg.state) : NaN;
    
    // Countdown / Restzeit-Prüfung
    let cdRem = '';
    if (a.remainEntity && stateIsUsable(sRem)) {
      if (/^\d{4}-\d{2}-\d{2}/.test(sRem.state) || sRem.attributes?.device_class === 'timestamp') {
        cdRem = formatCountdown(a.remainEntity);
      }
    }
    
    // Status-Timestamp-Prüfung (z. B. wenn stateEntity ein Endzeit-Sensor ist)
    const isStateTimestamp = /^\d{4}-\d{2}-\d{2}/.test(stateStr);
    const stateTsMs = isStateTimestamp ? Date.parse(sState.state) : NaN;
    const isStateFuture = !isNaN(stateTsMs) && stateTsMs > Date.now();
    const isStateRecentPast = !isNaN(stateTsMs) && stateTsMs <= Date.now() && (Date.now() - stateTsMs < 2 * 3600 * 1000);

    const runningKeywords = ['on', 'run', 'running', 'active', 'in_progress', 'wash', 'washing', 'rinse', 'rinsing', 'spin', 'spinning', 'drying', 'clean', 'cleaning', 'in betrieb', 'betrieb', 'läuft', 'aktiv', 'waschen', 'spülen', 'schleudern', 'trocknen'];
    const isRunningKeyword = runningKeywords.some(k => stateStr.includes(k));
    const isProgRunning = !isNaN(pVal) && pVal > 0 && pVal < 100;
    const isRemActive = cdRem && cdRem !== t('rain.now');

    const isRunning = isRunningKeyword || (pwr != null && pwr > 5) || isStateFuture || isRemActive || isProgRunning;

    const doneKeywords = ['done', 'finished', 'complete', 'completed', 'fertig', 'ausräumen', 'bereit zum ausräumen', 'ende'];
    const isDoneKeyword = doneKeywords.some(k => stateStr.includes(k));
    const isDone = !isRunning && (isDoneKeyword || (!isNaN(pVal) && pVal >= 100) || cdRem === t('rain.now') || isStateRecentPast);

    let progStr = '';
    if (sProg && stateIsUsable(sProg)) {
      if (!isNaN(pVal)) {
        const u = sProg.attributes?.unit_of_measurement || '%';
        progStr = `${fmt(pVal, 0)}${u === '%' ? '%' : ' ' + u}`;
      } else {
        progStr = sProg.state;
      }
    }

    let remStr = '';
    const remPrefix = tr('Noch', 'Left:');
    if (sRem && stateIsUsable(sRem)) {
      if (/^\d{4}-\d{2}-\d{2}/.test(sRem.state) || sRem.attributes?.device_class === 'timestamp') {
        const cd = formatCountdown(a.remainEntity);
        remStr = cd === t('rain.now') ? tr('Fertig', 'Done') : (cd ? `${remPrefix} ${cd}` : '');
      } else if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(String(sRem.state).trim())) {
        remStr = `${remPrefix} ${String(sRem.state).trim().replace(/:00$/, '')}`;
      } else {
        const u = sRem.attributes?.unit_of_measurement || '';
        remStr = `${remPrefix} ${sRem.state}${u ? ' ' + u : ''}`;
      }
    }

    let subTxt = '';
    if (isDone) {
      subTxt = tr('Bereit zum Ausräumen', 'Ready to unload');
    } else if (isRunning) {
      subTxt = [progStr, remStr].filter(Boolean).join(' · ') || t('app.running');
    } else if (stateStr === 'standby' || stateStr === 'idle') {
      subTxt = `${t('state.standby')} / ${t('state.ready')}`;
    } else {
      subTxt = t('state.off');
    }

    const rowCls = isDone ? 'done' : (isRunning ? 'running' : 'off');
    const iconCol = isDone ? 'var(--ok)' : (isRunning ? 'var(--warn)' : 'var(--mut)');
    const subCol = isDone ? 'var(--ok)' : (isRunning ? 'var(--txt)' : 'var(--mut)');
    const hasProgBar = isRunning && !isNaN(pVal) && pVal > 0 && pVal < 100;
    const progBarHtml = hasProgBar ? `<div class="appliance-prog-track"><div class="appliance-prog-fill" style="width:${Math.min(100, Math.max(0, pVal))}%"></div></div>` : '';

    return `<div class="appliance-row ${rowCls}">
      <div class="appliance-ico ${isRunning ? 'pulse' : ''}" style="color:${iconCol}">${ic(a.icon || 'washing', 24)}</div>
      <div style="flex:1;min-width:0">
        <b style="font-size:13px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(tDefault(a.name))}</b>
        <div class="mut sm" style="margin-top:2px;color:${subCol}">${esc(subTxt)}</div>
        ${progBarHtml}
      </div>
      ${pwr != null && pwr > 0 ? `<div class="appliance-power">${fmt(pwr, 0)}W</div>` : ''}
    </div>`;
  }).join('');
  
  return `<section class="card appliances-card">
    <div class="ch">
      <div style="display:flex;align-items:center;gap:8px">
        <span style="font-size:18px">🧺</span>
        <b>${esc(titleTxt)}</b>
      </div>
    </div>
    ${rows}
  </section>`;
}

function buliTeamCard(w) {
  const entities = String(w.entity || 'sensor.sc_freiburg').split(',').map(e => e.trim()).filter(Boolean);
  const title = w.title || tr('Mein Verein', 'My Club');

  if (!entities.length) {
    return `<section class="card"><div class="ch"><div style="display:flex;align-items:center;gap:9px">${ic('soccer',18)}<b>${esc(title)}</b></div></div><div class="mut sm" style="padding:8px 0">${tr('Keine Entitäten angegeben.', 'No entities configured.')}</div></section>`;
  }

  const teamData = entities.map(e => {
    const s = S(e);
    if (!s || !s.attributes || s.attributes.team_score === undefined) {
      return { entity: e, valid: false };
    }
    const status = s.state;
    const prio = status === 'IN' ? 0 : (status === 'PRE' ? 1 : 2);
    const dateMs = s.attributes.date ? new Date(s.attributes.date).getTime() : 0;
    return { entity: e, s, a: s.attributes, status, prio, dateMs, valid: true };
  });

  teamData.sort((x, y) => {
    if (!x.valid) return 1;
    if (!y.valid) return -1;
    if (x.prio !== y.prio) return x.prio - y.prio;
    return x.dateMs - y.dateMs;
  });

  const cards = teamData.map((item, idx) => {
    if (!item.valid) {
      return `<div class="mut sm" style="padding:16px">${tr('Warte auf Daten von', 'Waiting for data from')} ${esc(item.entity)}...</div>`;
    }

    const a = item.a;
    const status = item.status;
    const isLive = status === 'IN';
    const isPost = status === 'POST';

    const home = a.team_name || tr('Heim', 'Home');
    const away = a.opponent_name || tr('Gast', 'Away');
    const hScore = a.team_score !== null ? a.team_score : '-';
    const aScore = a.opponent_score !== null ? a.opponent_score : '-';

    const dateStr = a.date ? new Date(a.date).toLocaleDateString(getLocale(), { day: '2-digit', month: 'short' }) : '';
    const timeStr = a.date ? new Date(a.date).toLocaleTimeString(getLocale(), { hour: '2-digit', minute: '2-digit' }) : '';

    let statusText = t('sports.upcoming');
    let statusIcon = 'check';
    let statusColor = 'var(--ok)';
    let subText = `${tr('Letzter Gegner:', 'Last opponent:')} ${a.opponent_long_name || away}`;

    if (isLive) {
      statusText = 'LIVE Ticker';
      statusIcon = 'race';
      statusColor = 'var(--warn)';
      subText = `${tr('Aktueller Gegner:', 'Current opponent:')} ${a.opponent_long_name || away}`;
    } else if (isPost) {
      statusText = `${t('sports.finished')} (FT)`;
    } else {
      statusIcon = 'calendar';
      subText = `${tr('Nächster Gegner:', 'Next opponent:')} ${a.opponent_long_name || away} (${timeStr}${t('cal.clock_suffix')})`;
    }

    const borderBottom = idx === teamData.length - 1 ? 'none' : '1px solid var(--line)';

    return `
      <div style="border-bottom:${borderBottom};">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 24px;text-align:center">
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:8px">
            <img src="${esc(a.team_logo || '')}" style="width:48px;height:48px;object-fit:contain" alt="">
            <span style="font-weight:600;font-size:14px">${esc(home)}</span>
          </div>
          <div style="flex:1;display:flex;flex-direction:column;gap:4px">
            <div style="font-size:32px;font-weight:800;letter-spacing:2px;line-height:1;color:${isLive ? 'var(--warn)' : 'inherit'}">${hScore} : ${aScore}</div>
            <div style="color:var(--mut);font-size:12px;font-weight:500">${isPost ? 'FT - ' : ''}${dateStr}</div>
          </div>
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:8px">
            <img src="${esc(a.opponent_logo || '')}" style="width:48px;height:48px;object-fit:contain" alt="">
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
  const title = w.title || t('sports.matchday');
  const h = getHass();

  if (!h || !h.states) return `<section class="card"><div class="ch"><b>${esc(title)}</b></div><div class="mut sm">${t('weather.no_data')}</div></section>`;

  const matches = Object.values(h.states).filter(s =>
    s && s.entity_id && s.entity_id.startsWith('sensor.') &&
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
    const home = a.team_name || tr('Heim', 'Home');
    const away = a.opponent_name || tr('Gast', 'Away');
    const hScore = a.team_score !== null ? a.team_score : 0;
    const aScore = a.opponent_score !== null ? a.opponent_score : 0;

    let timeStr = '';
    if (status === 'IN' || status === 'POST') {
      timeStr = `${tr('Ergebnis', 'Score')}: ${hScore} : ${aScore}`;
    } else if (a.date) {
      const d = new Date(a.date);
      timeStr = d.toLocaleDateString(getLocale(), { day: '2-digit', month: '2-digit' }) + ' • ' + d.toLocaleTimeString(getLocale(), { hour: '2-digit', minute: '2-digit' }) + t('cal.clock_suffix');
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
    <div style="display:flex;flex-direction:column">${rows || `<div class="mut sm" style="padding:8px 0">${tr('Keine Spiele gefunden.', 'No matches found.')}</div>`}</div>
  </section>`;
}

function buliTableCard(w) {
  const e = w.entity || 'sensor.bund_scoreboard2';
  const titleTxt = w.title || 'Bundesliga';
  const s = S(e);

  if (!s || !s.attributes || !s.attributes.entries) {
    return `<section class="card"><div class="ch"><div style="display:flex;align-items:center;gap:9px">${ic('soccer',18)}<b>${esc(titleTxt)}</b></div></div><div class="mut sm" style="padding:8px 0">${tr('Warte auf Daten von', 'Waiting for data from')} ${esc(e)}...</div></section>`;
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
      <div class="buli-c" style="background:${esc(col)}"></div>
      <div class="text-center font-bold" style="width:20px">${gs('rank')}</div>
      <div style="flex:1;display:flex;align-items:center;gap:8px;min-width:0"><img src="${esc(logo)}" style="width:18px;height:18px;object-fit:contain" alt=""><b style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(clean(tm.displayName))}</b></div>
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
    <div class="ch" style="margin-bottom:12px"><div style="display:flex;align-items:center;gap:9px">${ic('soccer',18)}<b>${esc(titleTxt)}</b></div></div>
    <div class="buli-row h">
      <div class="buli-c" style="background:transparent"></div>
      <div class="text-center" style="width:20px">#</div>
      <div style="flex:1">${tr('Verein', 'Club')}</div>
      <div class="text-center" style="width:18px">${tr('Sp', 'P')}</div>
      <div class="text-center" style="width:18px">${tr('S', 'W')}</div>
      <div class="text-center" style="width:18px">${tr('U', 'D')}</div>
      <div class="text-center" style="width:18px">${tr('N', 'L')}</div>
      <div class="text-center" style="width:34px">${tr('Tore', 'Goals')}</div>
      <div class="text-center" style="width:28px">Dif</div>
      <div class="text-center" style="width:26px">${tr('Pkt', 'Pts')}</div>
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
    return `<section class="f1-card"><div class="ch"><b>${t('sports.next_race')}</b></div><div class="mut sm">${tr('Warte auf Daten von', 'Waiting for data from')} ${esc(e)}...</div></section>`;
  }

  const a = s.attributes || {};
  const raceName = a.race_name || 'Mexico City Grand Prix';
  const circuit = a.circuit_name || 'Autódromo Hermanos Rodríguez';
  const loc = [a.circuit_locality, a.circuit_country].filter(Boolean).join(', ');
  const round = a.round ? `Round ${a.round}` : '';
  const mapUrl = a.circuit_map_url || a.circuit_outline_url || '';
  const flagUrl = a.country_flag_url || '';

  const targetIso = a.race_start || a.race_start_utc || s.state;
  const targetMs = targetIso ? new Date(targetIso).getTime() : 0;

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

    const dFmt = isNaN(dObj) ? ses.iso : dObj.toLocaleDateString(getLocale(), { weekday: 'short', day: '2-digit', month: 'short' });
    const tFmt = isNaN(dObj) ? '' : dObj.toLocaleTimeString(getLocale(), { hour: '2-digit', minute: '2-digit' }) + t('cal.clock_suffix');

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
        ${flagUrl ? `<img src="${esc(flagUrl)}" style="width:26px;height:18px;object-fit:cover;border-radius:3px" alt="">` : ''}
        <div>
          <div class="f1-title">${esc(raceName)}</div>
          <div class="mut sm" style="text-transform:uppercase;letter-spacing:1px">${esc(circuit)}${loc ? ' · ' + esc(loc) : ''}</div>
        </div>
      </div>
    </div>

    ${targetMs ? `<div class="f1-timer-wrap">
      <div class="mut sm" style="letter-spacing:1px">COUNTDOWN</div>
      <div class="f1-timer" data-target="${targetMs}">...</div>
      <div class="mut sm">to lights out</div>
    </div>` : ''}

    ${mapUrl ? `<div class="f1-map">
      <div class="mut sm" style="text-align:left;letter-spacing:1px;margin-bottom:8px">CIRCUIT MAP</div>
      <img src="${esc(mapUrl)}" alt="Track Map">
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
    return `<section class="f1-card"><div class="ch"><b>${t('sports.standings')}</b></div><div class="mut sm">${tr('Warte auf Daten von', 'Waiting for data from')} ${esc(e)}...</div></section>`;
  }

  const a = s.attributes;
  const list = a.driver_standings || a.standings || a.drivers || [];

  if (!list.length) {
    return `<section class="f1-card"><div class="ch"><b>${t('sports.standings')}</b></div><div class="mut sm">${t('weather.no_data')}</div></section>`;
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
      <div class="f1-pos">${esc(pos)}</div>
      <div class="f1-bar" style="background:${color}"></div>
      <div style="flex:1;min-width:0">
        <div class="f1-code" style="color:${color}">${esc(code)}</div>
        <div class="f1-team">${esc(teamName)}</div>
      </div>
      <div class="f1-pts">${esc(pts)}</div>
    </div>`;
  }).join('');

  return `<section class="f1-card" style="padding:0">
    <div style="padding:16px;background:rgba(255,255,255,.02);border-bottom:1px solid var(--line);text-align:center">
      <div style="font-size:18px;font-weight:700;letter-spacing:1px;text-transform:uppercase">${t('sports.standings')}</div>
      <div class="mut sm" style="letter-spacing:2px;margin-top:2px">SEASON ${esc(a.season || '2026')}</div>
    </div>
    <div style="display:flex;flex-direction:column;padding:8px 16px 16px">${rows}</div>
  </section>`;
}

function customPageView(pageId) {
  const pIdx = (CONFIG.customPages || []).findIndex(p => p.id === pageId);
  const page = (CONFIG.customPages || [])[pIdx];
  if (!page) return `<div class="mut">${tr('Seite nicht gefunden.', 'Page not found.')}</div>`;

  const layout = String(page.layout || 'grid');
  const parsed = parseColsMode(layout, 'auto', 2);
  const allWidgets = (page.widgets || []).map((w, wi) => ({ w, wi })).filter(({ w }) => w.show !== false || ui.editMode);

  // Ermittle maximale Spaltenzahl (aus Seiten-Layout oder höchster Widget-Spaltenzuweisung)
  const maxWidgetCol = allWidgets.reduce((mx, { w }) => {
    const n = parseInt(w.col, 10);
    return Number.isFinite(n) && n > mx ? n : mx;
  }, 0);
  const activeCols = parsed.mode === 'cols' ? parsed.cols : (parsed.mode === 'asym' ? 2 : Math.max(maxWidgetCol, 2));
  const btnColsCount = clamp(Math.max(activeCols, 4), 2, 12);
  const colChoices = ['auto', ...Array.from({ length: btnColsCount }, (_, i) => String(i + 1)), 'full'];

  const wrapWidget = ({ w, wi }) => {
    const inner = renderCustomWidget(w, `sh_${pIdx}_${wi}`);
    if (!inner && !ui.editMode) return '';
    const colVal = String(w.col || 'auto');
    const qeBar = ui.editMode ? `<div class="qe-bar">
      <span class="qe-title">🧩 ${esc(tDefault(w.title || w.type))}</span>
      <div class="qe-btns">
        <button class="qe-btn" data-act="qeWidgetMove" data-pi="${pIdx}" data-wi="${wi}" data-dir="-1" title="${t('qe.move_up')}">↑</button>
        <button class="qe-btn" data-act="qeWidgetMove" data-pi="${pIdx}" data-wi="${wi}" data-dir="1" title="${t('qe.move_down')}">↓</button>
        ${colChoices.map(c => `<button class="qe-btn ${colVal === c ? 'on' : ''}" data-act="qeWidgetCol" data-pi="${pIdx}" data-wi="${wi}" data-col="${c}">${c === 'auto' ? 'Auto' : c === 'full' ? tr('Voll', 'Full') : tr('Sp.', 'Col.') + c}</button>`).join('')}
        <button class="qe-btn ${w.show === false ? 'off' : ''}" data-act="qeWidgetVis" data-pi="${pIdx}" data-wi="${wi}">${w.show === false ? '🙈' : '👁️'}</button>
        <button class="qe-btn" data-act="cfgOpenTab" data-tab="pages" title="${t('qe.open_config')}">⚙️</button>
      </div>
    </div>` : '';
    const spanFull = colVal === 'full' ? 'grid-column: 1 / -1;' : '';
    return `<div class="qe-wrap ${w.show === false ? 'qe-hidden' : ''}" style="${spanFull}">${qeBar}${inner || `<section class="card"><div class="mut">${tr('Leeres Widget', 'Empty widget')} (${esc(w.type)})</div></section>`}</div>`;
  };

  const pageToolbar = ui.editMode ? `<div class="qe-page-bar">
    <span>📐 <b>${tr('Seiten-Layout:', 'Page Layout:')}</b></span>
    <button class="chip ${parsed.mode === 'auto' ? 'on' : ''}" data-act="qePageLayout" data-pi="${pIdx}" data-layout="grid">${tr('Auto-Raster', 'Auto Grid')}</button>
    <button class="chip ${parsed.mode === 'asym' ? 'on' : ''}" data-act="qePageLayout" data-pi="${pIdx}" data-layout="2col-asym">${tr('2 Spalten (Links breit / Rechts schmal)', '2 Columns (Wide left / Narrow right)')}</button>
    ${[1, 2, 3, 4].map(n => `<button class="chip ${parsed.mode === 'cols' && parsed.cols === n ? 'on' : ''}" data-act="qePageLayout" data-pi="${pIdx}" data-layout="${n}col">${n} ${n === 1 ? tr('Spalte', 'Column') : tr('Spalten', 'Columns')}</button>`).join('')}
    <label class="qe-col-custom">
      <span>${tr('Frei:', 'Custom:')}</span>
      <input type="number" min="1" max="12" class="qe-col-input" data-act="qePageColsInput" data-pi="${pIdx}" value="${parsed.mode === 'cols' ? parsed.cols : ''}" placeholder="1-12">
      <span>${tr('Sp.', 'Col.')}</span>
    </label>
  </div>` : '';

  const hasExplicitCols = maxWidgetCol > 0;
  const isMultiColMode = parsed.mode === 'cols' || parsed.mode === 'asym' || hasExplicitCols;

  if (!allWidgets.length) {
    return `${pageHeader(page.eyebrow, page.title || page.label, page.intro)}${pageToolbar}<div class="mut">${tr('Noch keine Widgets auf dieser Seite.', 'No widgets on this page yet.')}</div>`;
  }

  if (parsed.mode === 'cols' && parsed.cols === 1) {
    return `${pageHeader(page.eyebrow, page.title || page.label, page.intro)}${pageToolbar}<div class="page-column">${allWidgets.map(wrapWidget).join('')}</div>`;
  }

  if (isMultiColMode) {
    const numCols = parsed.mode === 'cols' ? parsed.cols : (parsed.mode === 'asym' ? 2 : Math.max(maxWidgetCol, 2));
    const gridClass = parsed.mode === 'asym' ? 'grid' : 'grid cols-custom';
    const gridStyle = parsed.mode === 'asym' ? '' : `style="--custom-cols:${numCols}"`;
    const fullTop = [];
    const cols = Array.from({ length: numCols }, () => []);

    allWidgets.forEach((item, idx) => {
      const c = String(item.w.col || 'auto');
      if (c === 'full') {
        fullTop.push(wrapWidget(item));
      } else {
        const colNum = parseInt(c, 10);
        if (Number.isFinite(colNum) && colNum >= 1) {
          cols[Math.min(colNum - 1, numCols - 1)].push(wrapWidget(item));
        } else {
          cols[idx % numCols].push(wrapWidget(item));
        }
      }
    });

    return `${pageHeader(page.eyebrow, page.title || page.label, page.intro)}${pageToolbar}
      ${fullTop.length ? `<div class="col" style="margin-bottom:16px">${fullTop.join('')}</div>` : ''}
      <div class="${gridClass}" ${gridStyle}>
        ${cols.map(cList => `<div class="col">${cList.join('')}</div>`).join('')}
      </div>`;
  }

  return `${pageHeader(page.eyebrow, page.title || page.label, page.intro)}${pageToolbar}<div class="page-grid">${allWidgets.map(wrapWidget).join('')}</div>`;
}

/* ---------- Header-Badges & Kalender ---------- */
const homeCalendarState = {
  loading: false,
  loadedAt: 0,
  family: [],
  trash: [],
  error: false,
  monthOffset: 0,
  selectedDateKey: '',
  monthCache: {},
  rev: 0
};
function stateIsUsable(s) { return !!s && !['unknown', 'unavailable', 'none', 'None', ''].includes(String(s.state)); }
function formatCountdown(entity, fallback = '') {
  if (!entity) return fallback;
  const s = S(entity);
  if (!stateIsUsable(s)) return fallback;
  const ms = Date.parse(String(s.state || '').trim());
  if (!Number.isFinite(ms)) return fallback;
  const diff = ms - Date.now();
  if (diff <= 0) return t('rain.now');
  const mins = Math.floor(diff / 60000), hours = Math.floor(mins / 60), rest = mins % 60;
  return `${hours > 0 ? `${hours}h ` : ''}${rest}m`;
}
function wasteType(summary) {
  const value = String(summary || '').trim();
  if (/strauch|astwerk|grüngut|gruengut|gartenabfall/i.test(value)) return { label: t('trash.green'), icon: 'leaf', color: '#84cc16' };
  if (/bio|braune tonne|kompost/i.test(value)) return { label: t('trash.bio'), icon: 'leaf', color: '#a16207' };
  if (/gelbe tonne|gelber sack|wertstoff|recycling|dual/i.test(value)) return { label: t('trash.yellow'), icon: 'trash', color: '#fbbf24' };
  if (/glas|altglas/i.test(value)) return { label: t('trash.glass'), icon: 'trash', color: '#2dd4bf' };
  if (/grüne tonne|blaue tonne|papier|pappe/i.test(value)) return { label: t('trash.paper'), icon: 'cal', color: '#60a5fa' };
  if (/graue tonne|schwarze tonne|restmüll|restmuell/i.test(value)) return { label: t('trash.residual'), icon: 'trash', color: '#9ca3af' };
  if (/sperrmüll|sperrmuell/i.test(value)) return { label: t('trash.bulky'), icon: 'trash', color: '#c084fc' };
  return { label: t('trash.general'), icon: 'trash', color: '#9ca3af' };
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
    const when = days === 0 ? t('cal.today') : days === 1 ? t('cal.tomorrow') : t('trash.in_days', { n: days });
    return { ...ev, days, when, type: wasteType(ev.summary) };
  });
}

function evalBadgeCondition(ent, op, val) {
  if (!ent || !op) return true;
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
      if (cond === w1) return color;
    }
  }
  return 'blue';
}

function getBadgeValue(ent) {
  if (!ent) return '';
  const s = S(ent); if (!s || !stateIsUsable(s)) return '';
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
    if (b.entity1 && !w1Raw) return;

    let text = (b.format || '[W1]').replace('[W1]', w1Raw).replace('[W2]', w2Raw);
    if (text.includes('Jetzt') || text.includes('Now')) text = tr('Fertig', 'Done');

    const colorCls = parseBadgeColor(b.colorLogic, w1Raw, w2Raw);
    badges.push({ icon: b.icon || 'plug', cls: colorCls, title: tDefault(b.title), value: text });
  });

  if (!badges.length) return '';
  return `<div class="home-header-badges">${badges.map(b => `<span class="home-header-badge ${b.cls}" ${b.style ? `style="${esc(b.style)}"` : ''}>${ic(b.icon, 13)}<span>${esc(b.title)}: ${esc(b.value)}</span></span>`).join('')}</div>`;
}

function parseCalendarDate(value) {
  if (value && typeof value === 'object') value = value.dateTime || value.date || value.timestamp || '';
  const raw = String(value || '');
  return raw ? Date.parse(/^\d{4}-\d{2}-\d{2}$/.test(raw) ? `${raw}T00:00:00` : raw) : NaN;
}
function toLocalDateKey(d) {
  const dt = d instanceof Date ? d : new Date(d);
  if (isNaN(dt.getTime())) return '';
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`;
}
function getCalendarMonthRange(offset = 0, refDate = new Date()) {
  const base = new Date(refDate.getFullYear(), refDate.getMonth() + (Number(offset) || 0), 1);
  const year = base.getFullYear();
  const month = base.getMonth();
  const monthKey = `${year}-${pad(month + 1)}`;
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  // Mo=0 .. So=6
  const startWeekday = (firstDay.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - startWeekday, 0, 0, 0, 0);
  const totalDays = startWeekday + lastDay.getDate();
  const cellCount = totalDays > 35 ? 42 : 35;
  const gridEnd = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + cellCount, 0, 0, 0, 0);
  const label = firstDay.toLocaleDateString(getLocale(), { month: 'long', year: 'numeric' });
  return {
    year,
    month,
    monthKey,
    label,
    firstDay,
    lastDay,
    startWeekday,
    cellCount,
    gridStart,
    gridEnd,
    fetchStartIso: gridStart.toISOString(),
    fetchEndIso: gridEnd.toISOString()
  };
}
function getEffectiveCalendarStyle(ctxType = 'home', overrideStyle = null) {
  if (overrideStyle) return normalizeCalendarStyle(overrideStyle, ctxType === 'page' ? 'apple' : 'agenda');
  const calCfg = (CONFIG && CONFIG.calendars) || {};
  if (ctxType === 'page') {
    return normalizeCalendarStyle(CONFIG?.calendarPageStyle || calCfg.calendarPageStyle || 'apple', 'apple');
  }
  return normalizeCalendarStyle(CONFIG?.calendarHomeStyle || calCfg.calendarHomeStyle || 'agenda', 'agenda');
}
function isMonthBasedCalendarActive() {
  const hStyle = getEffectiveCalendarStyle('home');
  const pStyle = getEffectiveCalendarStyle('page');
  if (hStyle === 'apple' || hStyle === 'month' || pStyle === 'apple' || pStyle === 'month') return true;
  return (CONFIG?.customPages || []).some(p => (p.widgets || []).some(w => w && w.type === 'calendar' && (w.style === 'apple' || w.style === 'month')));
}
const CAL_PALETTE = ['#38bdf8', '#a99bff', '#34d399', '#f59e0b', '#f472b6', '#60a5fa'];
function getCalendarEntityColor(entity) {
  const fam = (CONFIG?.calendars?.familyEntities) || [];
  const idx = fam.indexOf(entity);
  if (idx >= 0) return CAL_PALETTE[idx % CAL_PALETTE.length];
  const hash = [...String(entity || '')].reduce((a, c) => a + c.charCodeAt(0), 0);
  return CAL_PALETTE[hash % CAL_PALETTE.length];
}
function isEventOnDay(ev, dayDate) {
  const dayStart = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), 0, 0, 0, 0).getTime();
  const dayEnd = dayStart + 86400000;
  const evStart = ev.startMs;
  const evEnd = (Number.isFinite(ev.endMs) && ev.endMs > evStart) ? ev.endMs : (ev.allDay ? evStart + 86400000 : evStart + 3600000);
  return evStart < dayEnd && evEnd > dayStart;
}
function normalizeCalendarEvent(event, entity) {
  const startRaw = event.start ?? event.start_time ?? event.startTime ?? '';
  const startMs = parseCalendarDate(startRaw);
  const startString = typeof startRaw === 'object' ? (startRaw.dateTime || startRaw.date || '') : String(startRaw);
  return {
    entity, summary: event.summary || event.message || event.title || tr('Termin', 'Event'),
    description: event.description || '', location: event.location || '',
    startRaw: startString, startMs,
    endMs: parseCalendarDate(event.end ?? event.end_time ?? event.endTime ?? ''),
    allDay: /^\d{4}-\d{2}-\d{2}$/.test(startString),
    color: getCalendarEntityColor(entity)
  };
}
function getDemoCalendarEvents(rangeStartMs, rangeEndMs) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const baseYear = new Date((rangeStartMs + rangeEndMs) / 2).getFullYear();
  const baseMonth = new Date((rangeStartMs + rangeEndMs) / 2).getMonth();
  const mk = (dayOffset, h, m, durH, summary, allDay = false, entIdx = 0, useMonthDay = false) => {
    const d = useMonthDay
      ? new Date(baseYear, baseMonth, dayOffset, allDay ? 0 : h, allDay ? 0 : m, 0)
      : new Date(today.getFullYear(), today.getMonth(), today.getDate() + dayOffset, allDay ? 0 : h, allDay ? 0 : m, 0);
    const startMs = d.getTime();
    const endMs = allDay ? startMs + 86400000 : startMs + durH * 3600000;
    const entity = `calendar.demo_${entIdx + 1}`;
    return {
      entity,
      summary,
      description: '',
      location: '',
      startRaw: allDay ? toLocalDateKey(d) : d.toISOString(),
      startMs,
      endMs,
      allDay,
      color: CAL_PALETTE[entIdx % CAL_PALETTE.length]
    };
  };
  return [
    mk(0, 9, 30, 1, 'Team-Standup & Planung', false, 0),
    mk(0, 15, 0, 1.5, 'Kinderarzt Termin', false, 1),
    mk(1, 0, 0, 24, 'Home-Office Tag', true, 0),
    mk(1, 18, 30, 2, 'Sport / Fußballtraining', false, 2),
    mk(3, 14, 0, 2, 'Einkauf & Wochenmarkt', false, 1),
    mk(5, 19, 0, 3, 'Familienabend & Pizza', false, 0),
    mk(12, 10, 0, 2, 'Handwerker / Wartung', false, 2, true),
    mk(20, 0, 0, 24, 'Geburtstag Oma 🎂', true, 1, true)
  ].filter(ev => ev.endMs >= rangeStartMs && ev.startMs <= rangeEndMs).sort((a, b) => a.startMs - b.startMs);
}
async function fetchHaCalendarEvents(ha, entity, startIso, endIso) {
  if (typeof ha.callWS === 'function') {
    try {
      const wsRes = await ha.callWS({
        type: 'calendar/event/list',
        entity_id: entity,
        start_time: startIso,
        end_time: endIso
      });
      if (wsRes && Array.isArray(wsRes.events)) return wsRes.events;
      if (Array.isArray(wsRes)) return wsRes;
    } catch (_) {}
  }
  if (typeof ha.callApi === 'function') {
    const res = await ha.callApi('GET', `calendars/${entity}?start=${encodeURIComponent(startIso)}&end=${encodeURIComponent(endIso)}`);
    return Array.isArray(res) ? res : (res && Array.isArray(res.events) ? res.events : []);
  }
  return [];
}
function dedupeCalendarEvents(list) {
  const seen = new Set();
  return list.filter(ev => {
    const k = `${ev.summary}|${ev.startRaw}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  }).sort((a, b) => a.startMs - b.startMs);
}
async function ensureCalendarMonthLoaded(offset = homeCalendarState.monthOffset, force = false) {
  const mRange = getCalendarMonthRange(offset);
  const famEnts = (CONFIG?.calendars?.familyEntities || []).filter(Boolean);
  const entSig = famEnts.join(',');
  const cacheEntry = homeCalendarState.monthCache[mRange.monthKey];
  if (!force && cacheEntry && cacheEntry.entSig === entSig && Date.now() - cacheEntry.loadedAt < 5 * 60 * 1000) {
    return cacheEntry.events;
  }
  if (DEMO) {
    const demoEvs = getDemoCalendarEvents(mRange.gridStart.getTime(), mRange.gridEnd.getTime());
    homeCalendarState.monthCache[mRange.monthKey] = { events: demoEvs, loadedAt: Date.now(), entSig };
    homeCalendarState.rev++;
    return demoEvs;
  }
  const ha = getHass();
  if (!ha || !famEnts.length) return [];
  if (homeCalendarState._loadingMonth === mRange.monthKey && !force) return (cacheEntry && cacheEntry.events) || [];
  homeCalendarState._loadingMonth = mRange.monthKey;
  try {
    const results = await Promise.all(famEnts.map(async entity => {
      try {
        const arr = await fetchHaCalendarEvents(ha, entity, mRange.fetchStartIso, mRange.fetchEndIso);
        return arr.map(ev => normalizeCalendarEvent(ev, entity)).filter(ev => Number.isFinite(ev.startMs));
      } catch (e) { return []; }
    }));
    const events = dedupeCalendarEvents(results.flat());
    homeCalendarState.monthCache[mRange.monthKey] = { events, loadedAt: Date.now(), entSig };
    homeCalendarState.loadedAt = Date.now();
    homeCalendarState.rev++;
    return events;
  } finally {
    if (homeCalendarState._loadingMonth === mRange.monthKey) homeCalendarState._loadingMonth = null;
    if (typeof tick === 'function') tick(true);
  }
}
async function refreshHomeCalendars(force = false) {
  if (homeCalendarState.loading) return;
  if (force) homeCalendarState.monthCache = {};
  if (DEMO) {
    const now = new Date(), start = new Date(now); start.setHours(0, 0, 0, 0);
    const end = new Date(start.getTime() + 30 * 24 * 3600 * 1000);
    homeCalendarState.family = getDemoCalendarEvents(start.getTime(), end.getTime());
    homeCalendarState.loadedAt = Date.now();
    homeCalendarState.rev++;
    if (isMonthBasedCalendarActive()) await ensureCalendarMonthLoaded(homeCalendarState.monthOffset, force);
    return;
  }
  if (!force && homeCalendarState.loadedAt && Date.now() - homeCalendarState.loadedAt < 5 * 60 * 1000) {
    if (isMonthBasedCalendarActive()) ensureCalendarMonthLoaded(homeCalendarState.monthOffset, false);
    return;
  }
  const ha = getHass(); if (!ha || (typeof ha.callApi !== 'function' && typeof ha.callWS !== 'function')) return;
  const calCfg = CONFIG.calendars || {};
  const entities = [
    ...(calCfg.familyEntities || []).map(e => ({ entity: e, group: 'family' })),
    ...(calCfg.trashEntities || []).map(e => ({ entity: e, group: 'trash' }))
  ];
  if (!entities.length) return;
  homeCalendarState.loading = true;
  const now = new Date(), start = new Date(now); start.setHours(0, 0, 0, 0);
  const end = new Date(start.getTime() + 30 * 24 * 3600 * 1000);
  const startIso = start.toISOString(), endIso = end.toISOString();
  try {
    const results = await Promise.all(entities.map(async ({ entity, group }) => {
      try {
        const arr = await fetchHaCalendarEvents(ha, entity, startIso, endIso);
        return { group, ok: true, events: arr.map(ev => normalizeCalendarEvent(ev, entity)).filter(ev => Number.isFinite(ev.startMs)) };
      } catch (e) { return { group, ok: false, events: [] }; }
    }));
    homeCalendarState.family = dedupeCalendarEvents(results.filter(x => x.group === 'family').flatMap(x => x.events));
    homeCalendarState.trash = dedupeCalendarEvents(results.filter(x => x.group === 'trash').flatMap(x => x.events));
    homeCalendarState.loadedAt = Date.now();
    homeCalendarState.rev++;
    if (isMonthBasedCalendarActive()) {
      await ensureCalendarMonthLoaded(homeCalendarState.monthOffset, force);
    }
  } finally {
    homeCalendarState.loading = false;
    if (typeof tick === 'function') tick(true);
  }
}
function formatCalEventTime(ev) {
  if (ev.allDay) return t('cal.all_day');
  const t1 = new Date(ev.startMs).toLocaleTimeString(getLocale(), { hour: '2-digit', minute: '2-digit' });
  if (Number.isFinite(ev.endMs) && ev.endMs > ev.startMs) {
    const t2 = new Date(ev.endMs).toLocaleTimeString(getLocale(), { hour: '2-digit', minute: '2-digit' });
    return `${t1} – ${t2}${t('cal.clock_suffix')}`;
  }
  return `${t1}${t('cal.clock_suffix')}`;
}
function buildCalendarViewSwitcherHtml(activeStyle, ctxType = 'home') {
  const styles = (typeof CALENDAR_STYLES !== 'undefined' && Array.isArray(CALENDAR_STYLES)) ? CALENDAR_STYLES : [
    ['list',   t('cal.style.list'),   t('cal.short.list')],
    ['agenda', t('cal.style.agenda'), t('cal.short.agenda')],
    ['google', t('cal.style.google'), t('cal.short.google')],
    ['apple',  t('cal.style.apple'),  t('cal.short.apple')],
    ['board',  t('cal.style.board'),  t('cal.short.board')],
    ['month',  t('cal.style.month'),  t('cal.short.month')]
  ];
  const btns = styles.map(([id, fullLabel, shortLabel]) =>
    `<button type="button" class="cal-sw-btn ${activeStyle === id ? 'on' : ''}" data-act="calQuickStyle" data-ctx="${esc(ctxType)}" data-style="${esc(id)}" title="${esc(fullLabel)}">${esc(shortLabel || id)}</button>`
  ).join('');
  return `<div class="cal-switcher" role="group" aria-label="${esc(t('cal.switch_style'))}">${btns}</div>`;
}
function buildMonthNavHtml(mRange) {
  const isCurrentMonth = (Number(homeCalendarState.monthOffset) || 0) === 0;
  return `<div class="cal-month-nav">
    <button type="button" class="cal-nav-btn" data-act="calMonthNav" data-dir="-1" title="${esc(t('cal.prev_month'))}">‹</button>
    <b class="cal-month-lbl">${esc(mRange.label)}</b>
    <button type="button" class="cal-nav-btn" data-act="calMonthNav" data-dir="1" title="${esc(t('cal.next_month'))}">›</button>
    <button type="button" class="cal-today-btn ${isCurrentMonth ? 'on' : ''}" data-act="calMonthToday" title="${esc(t('cal.today'))}">${t('cal.today')}</button>
  </div>`;
}
function homeCalendarCard(daysCount = 7, customTitle = null, ctxType = 'home', overrideStyle = null) {
  const calCfg = CONFIG.calendars || {};
  const hasEntities = !!(calCfg.familyEntities && calCfg.familyEntities.length);
  if (!hasEntities && !DEMO && !ui.editMode) return '';

  const style = getEffectiveCalendarStyle(ctxType, overrideStyle);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayKey = toLocalDateKey(today);
  if (!homeCalendarState.selectedDateKey) homeCalendarState.selectedDateKey = todayKey;

  const effDays = Math.max(1, parseInt(daysCount, 10) || 7);
  const defaultTitle = (style === 'month' || style === 'apple')
    ? t('cal.page_title')
    : t('cal.sub_days', { n: effDays });
  const title = tDefault(customTitle) || defaultTitle;
  const switcherHtml = buildCalendarViewSwitcherHtml(style, ctxType);

  // Für Apple & Monat: Monatsdaten aus Cache holen (oder asynchron nachladen)
  if (style === 'apple' || style === 'month') {
    const mRange = getCalendarMonthRange(homeCalendarState.monthOffset, now);
    const cached = homeCalendarState.monthCache[mRange.monthKey];
    if (!cached && !homeCalendarState._loadingMonth) {
      setTimeout(() => ensureCalendarMonthLoaded(homeCalendarState.monthOffset, false), 0);
    }
    const monthEvents = cached ? cached.events : (DEMO ? getDemoCalendarEvents(mRange.gridStart.getTime(), mRange.gridEnd.getTime()) : homeCalendarState.family);
    const selKey = homeCalendarState.selectedDateKey || todayKey;
    const weekdays = [t('cal.wd_mon'), t('cal.wd_tue'), t('cal.wd_wed'), t('cal.wd_thu'), t('cal.wd_fri'), t('cal.wd_sat'), t('cal.wd_sun')];
    const wdHeader = weekdays.map(w => `<div class="cal-wd">${w}</div>`).join('');

    const cells = [];
    let selectedDayObj = today;
    for (let i = 0; i < mRange.cellCount; i++) {
      const cellDate = new Date(mRange.gridStart.getFullYear(), mRange.gridStart.getMonth(), mRange.gridStart.getDate() + i);
      const key = toLocalDateKey(cellDate);
      const inMonth = cellDate.getMonth() === mRange.month;
      const isToday = key === todayKey;
      const isSel = key === selKey;
      if (isSel) selectedDayObj = cellDate;
      const dayEvents = monthEvents.filter(ev => isEventOnDay(ev, cellDate));
      cells.push({ cellDate, key, inMonth, isToday, isSel, dayEvents });
    }
    if (!cells.some(c => c.key === selKey)) {
      const fallbackCell = cells.find(c => c.isToday) || cells.find(c => c.inMonth) || cells[0];
      if (fallbackCell) selectedDayObj = fallbackCell.cellDate;
    }
    const selEvents = monthEvents.filter(ev => isEventOnDay(ev, selectedDayObj));
    const selDateTitle = selectedDayObj.toLocaleDateString(getLocale(), { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    const selDetailListHtml = selEvents.length
      ? selEvents.map(ev => `<div class="cal-detail-item" style="--ev-c:${esc(ev.color || 'var(--acc2)')}">
          <div class="cal-detail-time">${esc(formatCalEventTime(ev))}</div>
          <div class="cal-detail-body">
            <b>${esc(ev.summary)}</b>
            ${ev.location ? `<small>📍 ${esc(ev.location)}</small>` : ''}
            ${ev.description ? `<small>${esc(ev.description)}</small>` : ''}
          </div>
        </div>`).join('')
      : `<div class="home-agenda-empty">${t('cal.no_events_day')}</div>`;

    const countLabel = selEvents.length === 1 ? t('cal.single_event') : t('cal.events_count', { n: selEvents.length });

    if (style === 'apple') {
      const miniCellsHtml = cells.map(c => {
        const dots = c.dayEvents.slice(0, 3).map(ev => `<i style="background:${esc(ev.color || 'var(--acc2)')}"></i>`).join('');
        return `<button type="button" class="cal-apple-day ${c.inMonth ? '' : 'outside'} ${c.isToday ? 'today' : ''} ${c.key === toLocalDateKey(selectedDayObj) ? 'selected' : ''}" data-act="calSelectDay" data-date="${esc(c.key)}">
          <span class="cal-apple-num">${c.cellDate.getDate()}</span>
          <span class="cal-apple-dots">${dots}</span>
        </button>`;
      }).join('');

      return `<section class="card home-agenda cal-card cal-style-apple" data-cal-style="apple">
        <div class="ch cal-hdr"><b>${esc(title)}</b>${switcherHtml}</div>
        <div class="cal-apple-split">
          <div class="cal-apple-left">
            ${buildMonthNavHtml(mRange)}
            <div class="cal-apple-grid">
              ${wdHeader}
              ${miniCellsHtml}
            </div>
          </div>
          <div class="cal-apple-right">
            <div class="cal-detail-hdr">
              <b>${esc(selDateTitle)}</b>
              <span class="mut sm">${esc(countLabel)}</span>
            </div>
            <div class="cal-detail-list">${selDetailListHtml}</div>
          </div>
        </div>
      </section>`;
    }

    // 6. month (Großes Monats-Raster mit Termin-Vorschau in den Tageszellen + Klick-Detailansicht)
    const monthCellsHtml = cells.map(c => {
      const previews = c.dayEvents.slice(0, 3).map(ev => {
        const tShort = ev.allDay ? '' : new Date(ev.startMs).toLocaleTimeString(getLocale(), { hour: '2-digit', minute: '2-digit' }) + ' ';
        return `<div class="cal-month-pill" style="--ev-c:${esc(ev.color || 'var(--acc2)')}" title="${esc(ev.summary)} (${esc(formatCalEventTime(ev))})">${esc(tShort + ev.summary)}</div>`;
      }).join('');
      const more = c.dayEvents.length > 3 ? `<div class="cal-month-more">${t('cal.more_events', { n: c.dayEvents.length - 3 })}</div>` : '';
      return `<button type="button" class="cal-month-cell ${c.inMonth ? '' : 'outside'} ${c.isToday ? 'today' : ''} ${c.key === toLocalDateKey(selectedDayObj) ? 'selected' : ''}" data-act="calSelectDay" data-date="${esc(c.key)}">
        <div class="cal-month-cell-top"><span class="cal-month-num">${c.cellDate.getDate()}</span></div>
        <div class="cal-month-events">${previews}${more}</div>
      </button>`;
    }).join('');

    return `<section class="card home-agenda cal-card cal-style-month" data-cal-style="month">
      <div class="ch cal-hdr"><b>${esc(title)}</b>${switcherHtml}</div>
      ${buildMonthNavHtml(mRange)}
      <div class="cal-month-grid">
        ${wdHeader}
        ${monthCellsHtml}
      </div>
      <div class="cal-month-detail">
        <div class="cal-detail-hdr">
          <b>📌 ${esc(selDateTitle)}</b>
          <span class="mut sm">${esc(countLabel)}</span>
        </div>
        <div class="cal-detail-list">${selDetailListHtml}</div>
      </div>
    </section>`;
  }

  // Wochen-/Tages-basierte Ansichten (list, agenda, google, board)
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + effDays);
  const sourceEvents = (DEMO && (!homeCalendarState.family || !homeCalendarState.family.length))
    ? getDemoCalendarEvents(today.getTime(), weekEnd.getTime())
    : homeCalendarState.family;
  const upcoming = sourceEvents.filter(ev =>
    ev.allDay
      ? (isEventOnDay(ev, today) || (ev.startMs >= today.getTime() && ev.startMs < weekEnd.getTime()))
      : ((ev.endMs && ev.endMs >= now.getTime() && ev.startMs < weekEnd.getTime()) || (ev.startMs >= today.getTime() && ev.startMs < weekEnd.getTime()))
  );

  const daysList = Array.from({ length: effDays }, (_, i) => {
    const day = new Date(today);
    day.setDate(day.getDate() + i);
    const key = toLocalDateKey(day);
    const events = upcoming.filter(ev => isEventOnDay(ev, day));
    const dayLabel = i === 0 ? t('cal.today') : i === 1 ? t('cal.tomorrow') : day.toLocaleDateString(getLocale(), { weekday: 'short' });
    const dateLabel = day.toLocaleDateString(getLocale(), { day: '2-digit', month: '2-digit' });
    return { i, day, key, isToday: i === 0, dayLabel, dateLabel, events };
  });

  // 2. agenda (Kompakt-Agenda: Zeigt nur Tage mit tatsächlichen Terminen)
  if (style === 'agenda') {
    const activeDays = daysList.filter(d => d.events.length > 0);
    const rows = activeDays.length
      ? activeDays.map(d => {
          const eventHtml = d.events.map(ev => `<div class="home-agenda-event"><b>${esc(ev.summary)}</b><small>${esc(formatCalEventTime(ev))}</small></div>`).join('');
          return `<div class="home-agenda-row ${d.isToday ? 'is-today' : ''}" style="--agenda-accent:${esc(d.events[0]?.color || '#34d399')}"><div class="home-agenda-date">${esc(d.dayLabel)}<br>${esc(d.dateLabel)}</div><div class="home-agenda-main">${eventHtml}</div></div>`;
        }).join('')
      : `<div class="home-agenda-empty">${t('cal.no_events_next_days', { n: effDays })}</div>`;
    return `<section class="card home-agenda cal-card cal-style-agenda" data-cal-style="agenda"><div class="ch cal-hdr"><b>${esc(title)}</b>${switcherHtml}</div><div class="home-agenda-list">${rows}</div></section>`;
  }

  // 3. google (Google-Kalender-Stil: Farbige abgerundete Termin-Pillen, Rasterlinien, rote aktuelle Tages-/Zeitlinie)
  if (style === 'google') {
    const nowTimeStr = now.toLocaleTimeString(getLocale(), { hour: '2-digit', minute: '2-digit' });
    const gRows = daysList.map(d => {
      const wdShort = d.day.toLocaleDateString(getLocale(), { weekday: 'short' }).replace('.', '');
      const pills = d.events.map(ev => `<div class="cal-google-pill" style="--ev-c:${esc(ev.color || '#38bdf8')}">
        <span class="cal-google-pill-time">${esc(ev.allDay ? t('cal.all_day') : new Date(ev.startMs).toLocaleTimeString(getLocale(), { hour: '2-digit', minute: '2-digit' }))}</span>
        <b class="cal-google-pill-title">${esc(ev.summary)}</b>
        ${ev.location ? `<small class="cal-google-pill-loc">· ${esc(ev.location)}</small>` : ''}
      </div>`).join('');
      const nowLine = d.isToday ? `<div class="cal-google-nowline" title="${esc(nowTimeStr)}"><span>${esc(nowTimeStr)}</span><i></i></div>` : '';
      return `<div class="cal-google-day ${d.isToday ? 'today' : ''}">
        <div class="cal-google-datecol">
          <span class="cal-google-wd">${esc(wdShort)}</span>
          <span class="cal-google-dnum ${d.isToday ? 'today' : ''}">${d.day.getDate()}</span>
        </div>
        <div class="cal-google-slot">
          ${nowLine}
          ${pills || `<div class="cal-google-empty">${t('cal.no_events')}</div>`}
        </div>
      </div>`;
    }).join('');
    return `<section class="card home-agenda cal-card cal-style-google" data-cal-style="google"><div class="ch cal-hdr"><b>${esc(title)}</b>${switcherHtml}</div><div class="cal-google-grid">${gRows}</div></section>`;
  }

  // 5. board (Wochen-Board / 7 gleichmäßige Karten-Spalten Mo-So bzw. 7 Tage nebeneinander)
  if (style === 'board') {
    const boardCols = daysList.slice(0, 7).map(d => {
      const wdName = d.day.toLocaleDateString(getLocale(), { weekday: 'short' });
      const cards = d.events.length
        ? d.events.map(ev => `<div class="cal-board-ev" style="--ev-c:${esc(ev.color || 'var(--acc2)')}">
            <small>${esc(ev.allDay ? t('cal.all_day') : new Date(ev.startMs).toLocaleTimeString(getLocale(), { hour: '2-digit', minute: '2-digit' }) + t('cal.clock_suffix'))}</small>
            <b>${esc(ev.summary)}</b>
          </div>`).join('')
        : `<div class="cal-board-empty">${t('cal.free')}</div>`;
      return `<div class="cal-board-col ${d.isToday ? 'today' : ''}">
        <div class="cal-board-col-hdr">
          <span class="cal-board-wd">${esc(d.isToday ? t('cal.today') : wdName)}</span>
          <b class="cal-board-dt">${esc(d.dateLabel)}</b>
        </div>
        <div class="cal-board-col-body">${cards}</div>
      </div>`;
    }).join('');
    return `<section class="card home-agenda cal-card cal-style-board" data-cal-style="board"><div class="ch cal-hdr"><b>${esc(title)}</b>${switcherHtml}</div><div class="cal-board-wrap">${boardCols}</div></section>`;
  }

  // 1. list (7-Tage-Liste / Classic: Alle Tage untereinander inkl. "Keine Termine")
  const dayRows = daysList.map(d => {
    const eventHtml = d.events.length
      ? d.events.map(ev => `<div class="home-agenda-event"><b>${esc(ev.summary)}</b><small>${esc(formatCalEventTime(ev))}</small></div>`).join('')
      : `<small>${t('cal.no_events')}</small>`;
    return `<div class="home-agenda-row ${d.isToday ? 'is-today' : ''}" style="--agenda-accent:#F1C40F"><div class="home-agenda-date">${esc(d.dayLabel)}<br>${esc(d.dateLabel)}</div><div class="home-agenda-main">${eventHtml}</div></div>`;
  }).join('');
  return `<section class="card home-agenda cal-card cal-style-list" data-cal-style="list"><div class="ch cal-hdr"><b>${esc(title)}</b>${switcherHtml}</div><div class="home-agenda-list">${dayRows}</div></section>`;
}
function homeTrashCard(maxDays = 2, maxItems = 6, subtitle = null) {
  const calCfg = CONFIG.calendars || {};
  if (!(calCfg.trashEntities && calCfg.trashEntities.length)) return '';
  const items = getUpcomingTrashItems(maxDays).slice(0, maxItems);
  const effSubtitle = tDefault(subtitle) || t('trash.next_days', { n: maxDays + 1 });
  const rows = items.map(ev => `<div class="home-agenda-row" style="--agenda-accent:${ev.type.color}"><div class="home-agenda-date">${esc(ev.when)}</div><div class="home-agenda-main"><span class="home-trash-type">${ic(ev.type.icon, 13)} ${esc(ev.type.label)}</span><b>${esc(ev.summary)}</b></div></div>`).join('');
  return `<section class="card home-agenda"><div class="ch"><b>${t('trash.title')}</b><span class="mut sm">${esc(effSubtitle)}</span></div><div class="home-agenda-list">${rows || `<div class="home-agenda-empty">${t('trash.no_pickup', { sub: effSubtitle })}</div>`}</div></section>`;
}

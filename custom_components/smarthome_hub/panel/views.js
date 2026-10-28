/* ==========================================================================
   Smart Home Hub – Views, Karten & Widgets (views.js)
   Haupt-Dashboard, Raum-Hero, Klima-Ansicht, Eigene Seiten, Kalender & Badges
   ========================================================================== */

/* ---------- Geräte-Status ---------- */
function devInfo(d) {
  const s = S(d.entity), dm = dom(d.entity), st = s ? s.state : 'unavailable';
  let on = false, label = 'Aus', cls = 'off';
  if (!s || st === 'unavailable' || st === 'unknown') { label = 'Nicht verfügbar'; }
  else if (dm === 'climate') {
    if (st !== 'off') {
      on = true; const a = s.attributes.hvac_action;
      if (a === 'heating') { label = 'Heizt'; cls = 'warn'; }
      else if (a === 'cooling') { label = 'Kühlt'; cls = 'cool'; }
      else if (a === 'idle' || a === 'off') { label = 'Standby'; cls = 'idle'; }
      else { label = 'An'; cls = 'on'; }
    }
  }
  else if (dm === 'cover') { on = st !== 'closed'; label = st === 'opening' ? 'Öffnet' : st === 'closing' ? 'Schließt' : on ? 'Offen' : 'Geschlossen'; cls = on ? 'on' : 'off'; }
  else if (dm === 'lawn_mower') { on = st === 'mowing'; label = ({ mowing:'Mäht', docked:'Station', paused:'Pause', returning:'Rückfahrt', error:'Fehler' })[st] || st; cls = on ? 'on' : st === 'error' ? 'warn' : 'off'; }
  else if (dm === 'lock') { on = st === 'unlocked'; label = on ? 'Offen' : 'Verriegelt'; cls = on ? 'warn' : 'on'; }
  else if (dm === 'camera') { on = st !== 'off'; label = on ? 'Aktiv' : 'Aus'; cls = on ? 'on' : 'off'; }
  else if (dm === 'media_player') {
    if (st === 'standby') { label = 'Standby'; cls = 'idle'; }
    else if (st !== 'off') { on = true; label = st === 'playing' ? 'Spielt' : 'An'; cls = 'on'; }
  }
  else { on = st === 'on' || st === 'open'; label = on ? 'An' : 'Aus'; cls = on ? 'on' : 'off'; }
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
    if (st === 'locked') requirePin('doorUnlock', () => call('lock', 'unlock', { entity_id: e }), 'Türschloss entriegeln');
    else call('lock', 'lock', { entity_id: e });
  }
  else call('homeassistant', 'toggle', { entity_id: e });
}

/* ---------- Statusanzeige Rechts ---------- */
function rightTopStatus() {
  const sec = CONFIG.security || {}, problems = [];
  const locks = getLocksList(sec);
  locks.forEach(l => {
    const lk = S(l.entity);
    if (lk && lk.state !== 'locked') problems.push(`${l.name || 'Tür'} entriegelt`);
  });
  const openW = (sec.windows || []).filter(w => { const s = S(w); return s && s.state === 'on'; }).length;
  if (openW) problems.push(`${openW} Fenster offen`);

  const lockPills = locks.map(l => {
    const lk = S(l.entity);
    const locked = !lk || lk.state === 'locked';
    const armed = ui.unlockArmedEntity === l.entity && ui.unlockArmedUntil > Date.now();
    return `<div class="lockpill" title="${esc(l.name)}">
      ${locks.length > 1 ? `<span class="mut sm" style="padding:0 6px">${esc(l.name)}</span>` : ''}
      <button class="${locked ? 'on' : ''}" data-act="lockEntity" data-e="${esc(l.entity)}" title="${esc(l.name)} verriegeln">${ic('lock')}</button>
      <span class="dots">›››</span>
      <button class="${!locked ? 'open' : ''} ${armed ? 'armed' : ''}" data-act="unlockEntity" data-e="${esc(l.entity)}" data-name="${esc(l.name)}" title="${esc(l.name)} entriegeln">${ic('unlock')}</button>
    </div>`;
  }).join('');

  return `<div class="stat">
    <div class="t"><b class="${problems.length ? 'warn' : 'ok'}">${problems.length ? 'Achtung' : 'Zuhause ist gesichert'}</b><span class="mut sm">${problems.length ? esc(problems.join(' · ')) : 'Alle Systeme normal'}</span></div>
    ${lockPills}
  </div>`;
}

function heroOverlayContent() {
  const now = new Date();
  const dtOpts = { timeZone: CONFIG.dateTimeTimeZone || 'Europe/Berlin' };
  const dateText = now.toLocaleDateString(CONFIG.dateTimeLocale || 'de-DE', { ...dtOpts, weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  const timeText = now.toLocaleTimeString(CONFIG.dateTimeLocale || 'de-DE', { ...dtOpts, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const hour = Number(now.toLocaleString('en-US', { ...dtOpts, hour: '2-digit', hourCycle: 'h23' }));
  const greet = hour < 5 ? 'Gute Nacht' : hour < 11 ? 'Guten Morgen' : hour < 17 ? 'Guten Tag' : 'Guten Abend';
  const hs = getHass();
  const name = CONFIG.userName || (hs && hs.user && hs.user.name ? hs.user.name.split(' ')[0] : 'Gast');

  const gs = CONFIG.greetingEntity ? S(CONFIG.greetingEntity) : null;
  const ign = (CONFIG.greetingIgnore || []).map(x => String(x).toLowerCase());
  const attrText = gs && gs.attributes && typeof gs.attributes.text === 'string' ? gs.attributes.text.trim() : '';
  const stateText = gs && gs.state ? String(gs.state).trim() : '';
  const invalid = ['unknown', 'unavailable', 'none', ''];
  const validAttrText = attrText && !invalid.includes(attrText.toLowerCase()) && !ign.includes(attrText.toLowerCase());
  const validStateText = stateText && !invalid.includes(stateText.toLowerCase()) && !ign.includes(stateText.toLowerCase());
  const gtxt = validAttrText ? attrText : validStateText ? stateText : 'Das passiert gerade bei dir zuhause.';

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
  const showLive = isBgLiveStream && r.showLiveBadge !== false;

  const camBtns = (r.camButtons || []).map(b => {
    const btnIcon = b.icon || 'expand';
    const btnName = b.name != null ? String(b.name).trim() : '';
    const stream = b.stream || '';
    const entity = b.entity || '';
    return `<button class="expand" data-act="camBig" data-webrtc="${esc(stream)}" data-cam="${esc(entity)}" data-title="${esc(btnName)}">${ic(btnIcon, 14)}${btnName ? esc(btnName) : ''}</button>`;
  }).join('');

  return `<div class="hero-top">
      <div class="hi">${greet},</div>
      <div class="name-row"><div class="name">${esc(name)} 👋</div></div>
      <div class="greet">${esc(gtxt)}</div>
      ${showHomeBadges ? homeHeaderBadges() : ''}
      ${CONFIG.showDateTime ? `<div class="datetime"><span id="hub-date">${esc(dateText)}</span><span class="sep">•</span><span><span id="hub-time">${esc(timeText)}</span> Uhr</span></div>` : ''}
    </div>
    <div class="hero-bottom">
      <div class="pills">${pills}</div>
      <h2>${esc(r.name)}</h2>
      <div class="hero-bar">
        <div class="chips">${chips}</div>
        ${(showLive || camBtns) ? `<div class="camtools">${showLive ? '<span class="live">● LIVE</span>' : ''}${camBtns}</div>` : ''}
      </div>
    </div>`;
}

function devicesCard(customFilterRoom = null, customTitle = 'Geräteübersicht', tabFilter = 'geraete') {
  const rooms = CONFIG.rooms && CONFIG.rooms.length ? CONFIG.rooms : [{ name: 'Home' }];
  const r = rooms[ui.room] || rooms[0];
  const targetRoom = customFilterRoom !== null ? customFilterRoom : r.name;
  const list = (CONFIG.devices || []).filter(d => {
    const dTab = d.tab || 'geraete';
    if (tabFilter && dTab !== tabFilter) return false;
    return (customFilterRoom === '' || ui.showAll) ? true : d.room === targetRoom;
  });
  if (tabFilter !== 'geraete' && !list.length) return '';
  const infos = list.map(d => ({ d, i: devInfo(d) }));
  const active = infos.filter(x => x.i.on).length;
  const today = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
  const rows = infos.map(({ d, i }) => {
    const p = d.power ? num(d.power) : null, e = d.energy ? num(d.energy) : null;
    const since = i.on && i.s && i.s.last_changed ? Date.parse(i.s.last_changed) : 0;
    const canToggle = dom(d.entity) !== 'camera' && i.s && i.st !== 'unavailable';
    const domType = dom(d.entity);
    const hasRichDetail = ['light', 'media_player', 'climate', 'cover'].includes(domType);
    return `<div class="tr">
      <div class="dv dv-clickable" data-act="devDetail" data-e="${esc(d.entity)}" data-name="${esc(d.name)}" title="Antippen für Feinsteuerung & Details">
        <div class="dvi ${i.on ? 'on' : ''}">${ic(devIcon(d), 17)}</div>
        <div style="min-width:0"><b>${esc(d.name)} ${hasRichDetail ? '<span class="dv-hint">⚙</span>' : ''}</b><small>${esc(d.room || '')}</small></div>
      </div>
      <div class="st ${i.cls}" data-act="devDetail" data-e="${esc(d.entity)}" data-name="${esc(d.name)}" style="cursor:pointer"><i></i>${esc(i.label)}</div>
      <div>${p == null ? '—' : fmt(p, 0) + ' W'}</div>
      <div>${since ? `<span class="rt" data-since="${since}">${fmtDur(Date.now() - since)}</span>` : '—'}</div>
      <div>${e == null ? '—' : fmt(e, 1) + ' kWh'}</div>
      <div class="sw ${i.on ? 'on' : ''} ${canToggle ? '' : 'dis'}" data-act="dev" data-e="${esc(d.entity)}"><i></i></div></div>`;
  }).join('');
  return `<section class="card"><div class="ch"><div><b>${esc(customTitle)}</b> <span class="mut sm" style="color:var(--acc2)">&nbsp;${active} aktiv</span></div>
    <div style="display:flex;gap:8px">${customFilterRoom === null && tabFilter === 'geraete' ? `<button class="iconbtn ${ui.showAll ? 'on' : ''}" data-act="all">${ic('filter', 14)}${ui.showAll ? 'Alle Räume' : 'Dieser Raum'}</button>` : ''}<span class="iconbtn">${today}</span></div></div>
    <div class="tr h"><div>Gerät</div><div>Status</div><div>Leistung</div><div>Laufzeit</div><div>Heute</div><div></div></div>
    ${rows || '<div class="mut" style="padding:18px 6px">Keine Geräte für diesen Raum konfiguriert.</div>'}</section>`;
}

function extraDeviceTabsCards() {
  const extraTabs = (CONFIG.deviceTabs || []).filter(t => t.id !== 'geraete' && t.id !== 'covers');
  return extraTabs.map(t => devicesCard(null, t.name, t.id)).join('');
}

function coversCard() {
  const list = CONFIG.covers || [];
  if (!list.length) return '';
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
  return `<section class="card"><div class="ch"><div><b>Rolladen</b> <span class="mut sm" style="color:var(--acc2)">&nbsp;${openCount} offen</span></div></div>
    <div class="cover-row h"><div>Rolladen</div><div>Status</div><div>Position</div><div style="text-align:right">Steuerung</div></div>
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
  const label = tile.label || (type === 'hvac' ? 'Modus' : type === 'fan' ? 'Lüfter' : 'Wert');
  const icon = ICONS[tile.icon] ? tile.icon : (type === 'hvac' ? 'sun' : type === 'fan' ? 'fan' : 'thermo');
  const out = { entity, label, icon, value: '—', act: false };
  const s = entity ? S(entity) : null;
  if (!s) return out;
  if (['unknown', 'unavailable'].includes(s.state)) { out.value = 'Nicht verfügbar'; return out; }
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
    out.value = shown(a.fan_mode || '—');
    out.act = (a.fan_modes || []).length > 0;
  } else if (d === 'fan') {
    out.value = shown(s.state === 'off' ? 'Aus' : (a.preset_mode || (a.percentage != null ? `${a.percentage} %` : 'An')));
    out.act = true;
  } else if (d === 'select' || d === 'input_select') {
    out.value = shown(s.state);
    out.act = (a.options || []).length > 1;
  } else if (TILE_TOGGLE_DOMAINS.includes(d)) {
    out.value = shown(s.state === 'on' ? 'An' : s.state === 'off' ? 'Aus' : s.state);
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
  const title = `${c.title || 'Wetter'}${c.name ? ' · ' + c.name : ''}`;

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
  const condText = condState ? (WEATHER_CONDITIONS_DE[condState] || condState) : (c.label || 'Aktuell');
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
    return `<div class="mini">${ic(it.icon || 'drop', 18)}<span><small>${esc(it.label)}</small>${formatted}</span></div>`;
  }).join('');

  const fcBtnHtml = c.showForecast
    ? `<button class="iconbtn wfc-open-btn" data-act="wfcOpen">${ic('calendar', 15)}<span>${esc(c.forecastTitle || '7-Tage-Wettervorhersage öffnen')}</span></button>`
    : '';

  return `<section class="card"><div class="ch"><b>${esc(title)}</b><span class="mut sm">Aktuell</span></div>
    <div class="weather-now"><div class="weather-symbol">${symbol}</div><div><div class="weather-temp">${tempVal == null || isNaN(tempVal) ? '—' : fmt(tempVal, 1)}<sup>${esc(tempUnit)}</sup></div><div class="mut sm">${esc(condText)}</div></div></div>
    ${detailsHtml ? `<div class="two">${detailsHtml}</div>` : ''}
    ${fcBtnHtml}</section>`;
}

/* ---------- 7-Tage-Vorhersage als Kachel (klickbar -> Popup) ---------- */
function weatherForecastCard(customTitle) {
  const wCfg = CONFIG.weather || {};
  if (!(wCfg.forecastEntity || wCfg.entity)) return '';
  const days = (weatherForecastState.days || []).slice(0, 7);
  const rows = days.map((d, i) => {
    const dt = d.datetime ? new Date(d.datetime) : new Date(Date.now() + i * 86400000);
    const name = i === 0 ? 'Heute' : dt.toLocaleDateString('de-DE', { weekday: 'short' });
    const sym = WEATHER_SYMBOLS[d.condition] || '🌤️';
    const hi = d.temperature != null ? `${fmt(Number(d.temperature), 0)}°` : '—';
    const lo = d.templow != null ? `${fmt(Number(d.templow), 0)}°` : '';
    const rain = d.precipitation_probability != null ? `${fmt(Number(d.precipitation_probability), 0)}%` : (d.precipitation != null ? `${fmt(Number(d.precipitation), 1)} mm` : '');
    return `<button class="wfc-row" data-act="wfcOpenDay" data-i="${i}">
      <span class="wfc-row-d">${esc(name)}</span><span class="wfc-row-i">${sym}</span>
      <span class="wfc-row-r">${esc(rain)}</span><span class="wfc-row-t"><b>${hi}</b>${lo ? `<small>${lo}</small>` : ''}</span></button>`;
  }).join('');
  const body = rows || `<div class="mut sm" style="padding:10px 2px">${weatherForecastState.error ? esc(weatherForecastState.error) : (DEMO ? 'Vorhersage im HA-Modus aktiv.' : 'Lade Vorhersagedaten…')}</div>`;
  return `<section class="card"><div class="ch"><b>${esc(customTitle || wCfg.forecastTitle || 'Wettervorhersage · 7 Tage')}</b><span class="mut sm">Antippen für Details</span></div><div class="wfc-list">${body}</div></section>`;
}

function climateCard() {
  const c = activeClimate();
  if (c.type === 'weather') return weatherCard(c);
  if (!c.entity) return '';
  const s = S(c.entity);
  const title = `${c.title || 'Raumklima'}${c.name ? ' · ' + c.name : ''}`;
  if (!s) return `<section class="card"><div class="ch"><b>${esc(title)}</b></div><div class="mut">Entität „${esc(c.entity)}“ nicht gefunden.</div></section>`;
  const a = s.attributes || {}, cur = a.current_temperature, tgt = a.temperature;
  const min = c.min ?? 16, max = c.max ?? 30;
  const f = v => clamp(((v ?? min) - min) / (max - min), 0.001, 1);
  const A0 = 135, SW = 270, curA = A0 + SW * f(cur), tgtA = A0 + SW * f(tgt);
  const k = [100 + 78 * Math.cos(tgtA * Math.PI / 180), 100 + 78 * Math.sin(tgtA * Math.PI / 180)];
  let label = 'Aus';
  if (s.state !== 'off') label = cur == null || tgt == null ? '—' : cur < tgt - 1 ? 'Zu kalt' : cur > tgt + 1 ? 'Zu warm' : 'Komfortabel';
  return `<section class="card"><div class="ch"><b>${esc(title)}</b><span class="mut sm">Aktuell</span></div>
    <div class="gauge"><svg viewBox="0 0 200 175"><defs><linearGradient id="gg" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="var(--ok)"/><stop offset="1" stop-color="var(--acc)"/></linearGradient></defs>
      <path d="${arc(100, 100, 78, A0, A0 + SW)}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="9" stroke-linecap="round"/>
      <path d="${arc(100, 100, 78, A0, curA)}" fill="none" stroke="url(#gg)" stroke-width="9" stroke-linecap="round"/>
      ${tgt != null ? `<circle cx="${k[0].toFixed(1)}" cy="${k[1].toFixed(1)}" r="6" fill="#fff" stroke="var(--acc)" stroke-width="3"/>` : ''}</svg>
      <div class="gc"><div class="v">${fmt(cur, 1)}<sup>°C</sup></div><div class="mut sm">${label}${tgt != null ? ' · Soll ' + fmt(tgt, 1) + '°' : ''}</div>
        <div class="b"><button data-act="tmin">−</button><button data-act="tplus">+</button></div></div></div>
    ${climateTilesHtml(c)}</section>`;
}

function metricCard(m) {
  const v = num(m.entity);
  const yVal = m.yesterdayEntity ? num(m.yesterdayEntity) : yesterdayMetricVals[m.id];
  let trendHtml = `<div class="m-trend flat">– kein Vergleichswert</div>`;
  if (v != null && yVal != null && yVal > 0) {
    const pct = Math.round(((v - yVal) / yVal) * 100), absPct = Math.abs(pct);
    const text = pct < 0 ? `${absPct}% weniger als gestern` : pct > 0 ? `${absPct}% mehr als gestern` : `Gleich wie gestern`;
    const arrow = pct < 0 ? '↓' : pct > 0 ? '↑' : '±';
    const cls = pct < 0 ? 'down' : pct > 0 ? 'up' : 'flat';
    trendHtml = `<div class="m-trend ${cls}">${arrow} ${text}</div>`;
  }
  let headRight = 'Heute', liveText = '', extraHTML = '';
  if (m.subButtons && m.subButtons.length) {
    const cv = num(m.chart);
    if (m.chart) liveText = `<div class="mut sm" style="margin-top:6px">Aktuell: ${cv != null ? fmt(cv, 0) + ' ' + (m.chartUnit || 'W') : '—'}</div>`;
    const btns = m.subButtons.map(b => `<button class="iconbtn" style="flex:1;justify-content:center;border-color:transparent;background:rgba(255,255,255,.04);color:var(--${b.color || 'acc2'})" data-act="energymodal" data-mid="${esc(m.id)}" data-bid="${esc(b.id)}">${ic(b.icon, 15)} <span style="color:var(--txt)">${esc(b.name)}</span></button>`).join('');
    extraHTML = `<div style="display:flex;gap:8px;margin-top:16px;flex-wrap:wrap">${btns}</div>`;
  } else if (m.mode !== 'last' && m.chart && m.chartUnit) {
    const cv = num(m.chart);
    if (cv != null) headRight = `Heute · ${fmt(cv, 0)} ${esc(m.chartUnit)}`;
  }
  return `<section class="card"><div class="ch"><b>${esc(m.title)}</b><span class="mut sm">${headRight}</span></div>
    <div class="mv"><div><span class="big">${fmt(v, m.decimals ?? 1)}</span><span class="unit">${esc(m.unit)}</span><div class="m-sub">${trendHtml}${liveText}</div></div>
    <div class="chart${m.chart ? ' clickable' : ''}" ${m.chart ? `data-act="chartModal" data-type="metric" data-mid="${esc(m.id)}" title="Antippen für Großansicht"` : ''}>${spark(series[m.chart], m.id, { unit: m.chartUnit || m.unit || '', dec: m.decimals ?? 1 }, series[m.chart + '_yest'])}</div></div>${extraHTML}</section>`;
}

function securityCard() {
  const sec = CONFIG.security || {};
  const locks = getLocksList(sec);
  if (!locks.length && !(sec.windows && sec.windows.length) && !(sec.cameras && sec.cameras.length)) return '';
  const openW = (sec.windows || []).filter(w => { const s = S(w); return s && s.state === 'on'; }).length;
  const camOn = (sec.cameras || []).filter(c => { const s = S(c); return s && s.state !== 'unavailable' && s.state !== 'off'; }).length;
  const allLocksOk = locks.every(l => { const s = S(l.entity); return !s || s.state === 'locked'; });
  const allOk = allLocksOk && !openW;

  const lockTiles = locks.map(l => {
    const lk = S(l.entity);
    const locked = !lk || lk.state === 'locked';
    return `<button class="tile ${locked ? '' : 'warn'}" data-act="doorEntity" data-e="${esc(l.entity)}" data-name="${esc(l.name)}">${ic(locked ? 'lock' : 'unlock', 18)}<span style="min-width:0"><b>${esc(l.name || 'Tür')}</b><small>${locked ? 'Verriegelt' : 'Entriegelt'}</small></span></button>`;
  }).join('');

  return `<section class="card"><div class="ch"><div><b>Sicherheit</b><div class="sm" style="color:${allOk ? 'var(--ok)' : 'var(--warn)'}">${allOk ? 'Alle Systeme aktiv' : 'Bitte prüfen'}</div></div></div>
    <div class="tiles">
      ${lockTiles}
      <div class="tile ${openW ? 'warn' : ''}">${ic('window', 18)}<span><b>Fenster</b><small>${openW ? openW + ' offen' : 'Geschlossen'}</small></span></div>
      <button class="tile" data-act="nav" data-view="kameras">${ic('camera', 18)}<span><b>Kameras</b><small>${camOn} aktiv</small></span></button></div></section>`;
}

function groupInfo(g) { const on = (g.entities || []).filter(e => { const s = S(e); return s && s.state === 'on'; }).length; return { on, total: (g.entities || []).length }; }

function getMainLightEntities() {
  const lm = CONFIG.lightsMain || { mode: 'group', group: 0, entities: [] };
  let ents = [];
  if (lm.mode === 'all') {
    (CONFIG.lights || []).forEach(g => {
      if (g.mainSync !== false) ents.push(...(g.entities || []));
    });
  } else if (lm.mode === 'custom') {
    ents = lm.entities || [];
  } else {
    const g = (CONFIG.lights || [])[lm.group || 0];
    if (g) ents = g.entities || [];
  }
  return [...new Set(ents)];
}

function lightsCard() {
  const gs = CONFIG.lights || [];
  if (!gs.length) return '';
  const mainEnts = getMainLightEntities();
  const main = groupInfo({ entities: mainEnts });
  const tiles = gs.map((g, i) => {
    const gi = groupInfo(g);
    return `<div class="tile tile-split ${gi.on ? 'on' : ''}">
      <button class="tile-main-btn" data-act="lgrp" data-i="${i}" title="Gruppe ein-/ausschalten">
        ${ic('bulb', 18)}
        <span><b>${esc(g.name)}</b><small>${gi.on}/${gi.total} an</small></span>
      </button>
      <button class="tile-sub-btn" data-act="lgrpDetail" data-i="${i}" title="Helligkeit, Farbe & einzelne Lampen">${ic('sliders', 15)}</button>
    </div>`;
  }).join('');
  return `<section class="card"><div class="ch"><b>Lichter</b><div class="sw ${main.on ? 'on' : ''}" data-act="lgrpMain"><i></i></div></div><div class="tiles">${tiles}</div></section>`;
}

function getCoreNav() {
  const pages = [
    { label: 'Dashboard', icon: 'home', view: 'dashboard' },
    { label: 'Klima', icon: 'thermo', view: 'klima' },
    { label: 'Kameras', icon: 'camera', view: 'kameras' }
  ];
  (CONFIG.customPages || []).forEach(p => {
    pages.push({ label: p.label, icon: p.icon || 'chart', view: 'page:' + p.id });
  });
  return pages;
}

function sidebar() {
  const hs = getHass(), name = CONFIG.userName || (hs && hs.user && hs.user.name) || 'Gast';
  const mainItems = getCoreNav().map(n => `<button class="nav ${n.view === ui.view ? 'on' : ''}" data-act="nav" data-view="${esc(n.view)}">${ic(n.icon, 18)}${esc(n.label)}</button>`).join('');
  const sysItems = (!CONFIG.hideSystemLinks && CONFIG.systemLinks && CONFIG.systemLinks.length)
    ? `<div class="nav-sep"></div>` + CONFIG.systemLinks.map(n => `<button class="nav" data-act="sysnav" data-path="${esc(n.path)}">${ic(n.icon, 18)}${esc(n.label)}</button>`).join('')
    : '';
  return `<aside class="side"><div class="logo"><div class="lg">${ic('home', 20)}</div>${esc(CONFIG.title || 'Home')}</div><div class="sub">${esc(CONFIG.subtitle || 'Home Assistant')}</div>
    ${mainItems}${sysItems}
    <div class="me">
      <div class="me-user"><div class="av">${esc(name.charAt(0).toUpperCase())}</div><div style="min-width:0"><b>${esc(name)}</b><small>${esc(CONFIG.role || '')}</small></div></div>
      <div class="me-actions">
        <button class="me-btn ${ui.editMode ? 'on' : ''}" data-act="toggleEditMode" title="Quick-Edit Modus (Layout direkt auf der Seite anpassen)">${ic('edit', 14)}</button>
        <button class="me-btn" data-act="toggleKiosk" title="Vollbild / HA-Seitenleiste umschalten">${ic('expand', 14)}</button>
        <button class="me-btn" data-act="cfgOpen" title="Dashboard konfigurieren">${ic('settings', 15)}</button>
      </div>
    </div></aside>`;
}

const mtabs = () => `<div class="mtabs">${getCoreNav().map(n => `<button class="pill ${ui.view === n.view ? 'on' : ''}" data-act="nav" data-view="${esc(n.view)}">${esc(n.label)}</button>`).join('')}<button class="pill ${ui.editMode ? 'on' : ''}" data-act="toggleEditMode" title="Quick-Edit">✏️</button><button class="pill" data-act="cfgOpen">⚙️</button></div>`;

/* ---------- Klima-Ansicht ---------- */
function kDevice(d) {
  const E = esc(d.entity), s = S(d.entity), ico = d.icon || 'thermo';
  if (!s) return `<div class="kd"><div class="kdl"><div class="kdi">${ic(ico, 17)}</div><div><b>${esc(d.name)}</b><small>Entität nicht gefunden</small></div></div></div>`;
  const a = s.attributes || {}, off = ['off', 'unavailable', 'unknown'].includes(s.state);
  const act = a.hvac_action, cur = a.current_temperature, tgt = a.temperature;
  let label = HVAC_DE[s.state] || s.state, cls = '';
  if (off) label = s.state === 'off' ? 'Aus' : 'Nicht verfügbar';
  else if (act === 'heating') { label = 'Heizt'; cls = 'warn'; }
  else if (act === 'cooling') { label = 'Kühlt'; cls = 'cool'; }
  else if (act === 'idle') { label = 'Bereit'; cls = 'on'; }
  else cls = 'on';
  const sub = `${label}${cur != null ? ' · ' + fmt(cur, 1) + '° ist' : ''}`;
  let ctrl = '';
  if (tgt != null && !off) {
    ctrl += d.readonly ? `<b class="mut">Soll ${fmt(tgt, 1)}°</b>`
      : `<div class="step"><button data-act="kstep" data-e="${E}" data-d="-1">−</button><b>${fmt(tgt, 1)}°</b><button data-act="kstep" data-e="${E}" data-d="1">+</button></div>`;
  }
  if (d.toggle) ctrl += `<div class="sw ${off ? '' : 'on'}" data-act="ktog" data-e="${E}"><i></i></div>`;
  const presets = (d.presets || []).filter(p => !a.preset_modes || a.preset_modes.includes(p));
  const pre = presets.length && !d.readonly ? `<div class="kdp">${presets.map(p => `<button class="pb ${a.preset_mode === p ? 'on' : ''}" data-act="kpre" data-e="${E}" data-p="${esc(p)}">${esc(PRESET_DE[p] || p)}</button>`).join('')}</div>` : '';
  return `<div class="kd"><div class="kdl dv-clickable" data-act="devDetail" data-e="${E}" data-name="${esc(d.name)}" title="Antippen für Klimadetails"><div class="kdi ${cls}">${ic(ico, 17)}</div><div><b>${esc(d.name)} <span class="dv-hint">⚙</span></b><small>${esc(sub)}</small></div></div><div class="kdr">${ctrl}</div>${pre}</div>`;
}

function klimaView() {
  const colsMode = String(CONFIG.klimaCols || 'auto');
  const gridCls = colsMode === '1' ? 'kgrid cols-1' : colsMode === '2' ? 'kgrid cols-2' : colsMode === '3' ? 'kgrid cols-3' : 'kgrid';
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
    const set = r.settings && r.settings.groups && r.settings.groups.length ? `<button class="iconbtn" data-act="smOpen" data-i="${i}">${ic('settings', 14)}Einstellungen</button>` : '';
    const devs = (r.devices || []).map(kDevice).join('');
    const charts = (r.charts || []).map(c => {
      const key = '24:' + c.entity + (c.attr ? ':' + c.attr : '');
      const s = S(c.entity), a = (s && s.attributes) || {};
      const unit = (c.title || '').includes('Luftfeucht') ? '%' : (a.unit_of_measurement || '°C');
      return `<div class="kc" style="cursor:pointer;border-radius:10px;padding:6px;margin:6px -6px 0;transition:background .15s" onmouseover="this.style.background='rgba(255,255,255,.05)'" onmouseout="this.style.background='transparent'" data-act="chartModal" data-type="klima" data-entity="${esc(c.entity)}" data-attr="${esc(c.attr || '')}" data-name="${esc(c.title || '')}" data-unit="${esc(unit)}" data-dec="${c.decimals ?? 1}" title="Antippen für Großansicht">
        <div class="kct" style="pointer-events:none"><span>${esc(c.title || '')}</span><span class="mut sm">24 h</span></div>
        <div style="pointer-events:none">${spark(series[key], 'k' + c.entity + (c.attr || ''), { fit: true, min: c.min, max: c.max, W: 320, H: 90, dec: c.decimals, unit })}</div></div>`;
    }).join('');
    const qeBar = ui.editMode ? `<div class="qe-bar">
      <span class="qe-title">🌡️ ${esc(r.name)}</span>
      <div class="qe-btns">
        <button class="qe-btn" data-act="qeKlimaMove" data-i="${i}" data-dir="-1" title="Nach oben">↑</button>
        <button class="qe-btn" data-act="qeKlimaMove" data-i="${i}" data-dir="1" title="Nach unten">↓</button>
        <button class="qe-btn ${r.show === false ? 'off' : ''}" data-act="qeKlimaVis" data-i="${i}" title="Ein-/Ausblenden">${r.show === false ? '🙈 Ausgeblendet' : '👁️ Sichtbar'}</button>
        <button class="qe-btn" data-act="cfgOpenTab" data-tab="klima" title="Im Editor öffnen">⚙️</button>
      </div>
    </div>` : '';
    return `<div class="qe-wrap ${r.show === false ? 'qe-hidden' : ''}">${qeBar}<section class="card"><div class="kh"><div class="khl"><div class="kic">${ic(r.icon || 'home', 20)}</div><b>${esc(r.name)}</b></div><div class="khr">${boost}${set}</div></div>
      ${sens ? `<div class="chips" style="margin-top:12px">${sens}</div>` : ''}${devs}${charts}</section></div>`;
  }).join('');
  const topToolbar = ui.editMode ? `<div class="qe-page-bar">
    <span>📐 <b>Klima-Spalten:</b></span>
    ${[['auto','Automatisch'],['1','1 Spalte'],['2','2 Spalten'],['3','3 Spalten']].map(([k,lbl]) => `<button class="chip ${colsMode === k ? 'on' : ''}" data-act="qeSetKlimaCols" data-cols="${k}">${lbl}</button>`).join('')}
  </div>` : '';
  return `<div class="ktop"><div class="hi">Klima</div><div class="name">Heizung &amp; Klimaanlagen</div><div class="greet">Temperaturen, Heizungen und Klimaanlagen aller Räume – direkt steuerbar.</div></div>${topToolbar}<div class="${gridCls}">${cards || '<div class="mut">Noch keine Klima-Räume angelegt.</div>'}</div>`;
}

/* ---------- Baukasten für Eigene Seiten ---------- */
function pageHeader(eyebrow, title, intro) {
  return `<div class="page-head"><div class="hi">${esc(eyebrow || '')}</div><div class="name">${esc(title || '')}</div><div class="greet">${esc(intro || '')}</div></div>`;
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
    return `<section class="card"><div class="ch"><b>${esc(title)}</b><span class="mut sm">${esc(entity)}</span></div><div class="mut sm">Entität derzeit nicht verfügbar.</div></section>`;
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
  return `<section class="card"><div class="ch"><div><b>${esc(title)}</b><div class="mut sm">${esc(entity)}</div></div><span class="iconbtn">${esc(compactValue(s.state))}</span></div>
    ${rows.length ? `<div class="data-list">${rows.map(([k,v]) => `<div class="data-row"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('')}</div>` : '<div class="mut sm">Keine Zusatzattribute vorhanden.</div>'}</section>`;
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
      <div class="chart clickable" data-act="chartModal" data-type="stat" data-entity="${esc(item.entity)}" data-attr="${esc(item.attr || '')}" data-name="${esc(item.name)}" data-unit="${esc(unit)}" data-dec="${item.decimals ?? 1}" data-mode="${esc(item.mode || 'avg')}" title="Antippen für Großansicht">${spark(series[key], 'stats-' + item.entity + (item.attr || ''), { fit: true, W: 320, H: 65, dec: item.decimals ?? 1, color: item.color, unit })}</div>
    </div>`;
  }).join('');
  return `<section class="card"><div class="ch"><div style="display:flex;align-items:center;gap:9px">${ic(group.icon || 'chart', 18)}<b>${esc(group.title)}</b></div><span class="mut sm">24 h</span></div>${rows}</section>`;
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
    <div class="ch"><b>${esc(title)}</b><span class="mut sm">Aktuelle Leistung</span></div>
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
        <text x="60" y="230" class="pf-lbl">Netz</text>

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
        <text x="200" y="335" class="pf-lbl">Batterie</text>
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
    return `<div class="mini">${ic(p.icon || 'plug', 18)}<span><small>${esc(p.label)}</small>${txt}</span></div>`;
  }).join('');
  return `<section class="card"><div class="ch"><b>${esc(title)}</b><span class="mut sm">Aktuelle Leistung</span></div><div class="two">${tiles}</div></section>`;
}

function powerFlowHacsCard(w) {
  const title = w.title || 'Power Flow';
  if (!hasPFCPlus()) {
    return `<section class="card"><div class="ch"><b>${esc(title)}</b></div><div class="page-note">„power-flow-card-plus“ ist in Home Assistant nicht geladen. Über HACS installieren oder die Darstellung auf „Automatisch“ stellen.</div></section>`;
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
      return `<section class="card"><div class="ch"><b>${esc(title)}</b></div><div class="page-note">Karten-Konfiguration fehlerhaft: ${esc(e.message)}</div></section>`;
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
    const title = task.title || task.name || task.task_name || task.task || task.text || task.label || `Aufgabe ${i + 1}`;
    const secondary = [task.due || task.due_date || task.date, task.description, task.status || task.state].filter(Boolean).map(compactValue).join(' · ');
    return `<div class="match-row"><b>${esc(title)}</b>${secondary ? `<small>${esc(secondary)}</small>` : ''}</div>`;
  }).join('') : '';
  return `<section class="card"><div class="ch"><div style="display:flex;align-items:center;gap:9px">${ic('tasks',18)}<b>${esc(child.name)}</b></div><span class="mut sm">Aufgaben</span></div>
    ${taskRows ? `<div class="match-list">${taskRows}</div>` : `<div class="page-note">Keine offenen Aufgaben gefunden.</div>`}</section>`;
}

function renderCustomWidget(w) {
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
  if (w.type === 'devices') return devicesCard(w.room || '', w.title || 'Geräte', '');
  if (w.type === 'calendar') return homeCalendarCard(w.days || 14, w.title);
  if (w.type === 'trash') return homeTrashCard(w.days || 30, w.maxItems || 25, w.subtitle || 'Nächste 30 Tage');
  if (w.type === 'todo') {
    if (w.mode === 'taskmate') {
      return (w.children || []).map(c => taskmateChildCard(w.entity, c)).join('');
    }
    return entityInfoCard(w.entity, w.title || 'To-Do Liste');
  }
  if (w.type === 'iframe') {
    return `<section class="card"><div class="ch"><b>${esc(w.title || 'Einbettung')}</b></div><iframe class="iframe-widget" src="${esc(w.url || '')}"></iframe></section>`;
  }
  if (w.type === 'buli_table') return buliTableCard(w);
  if (w.type === 'f1_next') return f1NextRaceCard(w);
  if (w.type === 'f1_standings') return f1StandingsCard(w);
  return '';
}

function buliTeamCard(w) {
  const entities = String(w.entity || 'sensor.sc_freiburg').split(',').map(e => e.trim()).filter(Boolean);
  const title = w.title || 'Mein Verein';

  if (!entities.length) {
    return `<section class="card"><div class="ch"><div style="display:flex;align-items:center;gap:9px">${ic('soccer',18)}<b>${esc(title)}</b></div></div><div class="mut sm" style="padding:8px 0">Keine Entitäten angegeben.</div></section>`;
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
      return `<div class="mut sm" style="padding:16px">Warte auf Daten von ${esc(item.entity)}...</div>`;
    }

    const a = item.a;
    const status = item.status;
    const isLive = status === 'IN';
    const isPost = status === 'POST';

    const home = a.team_name || 'Heim';
    const away = a.opponent_name || 'Gast';
    const hScore = a.team_score !== null ? a.team_score : '-';
    const aScore = a.opponent_score !== null ? a.opponent_score : '-';

    const dateStr = a.date ? new Date(a.date).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' }) : '';
    const timeStr = a.date ? new Date(a.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : '';

    let statusText = 'Nächstes Spiel in Vorbereitung';
    let statusIcon = 'check';
    let statusColor = 'var(--ok)';
    let subText = `Letzter Gegner: ${a.opponent_long_name || away}`;

    if (isLive) {
      statusText = 'LIVE Ticker';
      statusIcon = 'race';
      statusColor = 'var(--warn)';
      subText = `Aktueller Gegner: ${a.opponent_long_name || away}`;
    } else if (isPost) {
      statusText = 'Spiel beendet (FT)';
    } else {
      statusIcon = 'calendar';
      subText = `Nächster Gegner: ${a.opponent_long_name || away} (${timeStr} Uhr)`;
    }

    const borderBottom = idx === teamData.length - 1 ? 'none' : '1px solid var(--line)';

    return `
      <div style="border-bottom:${borderBottom};">
        <div style="display:flex;align-items:center;justify-content:space-between;padding:16px 24px;text-align:center">
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:8px">
            <img src="${a.team_logo || ''}" style="width:48px;height:48px;object-fit:contain" alt="">
            <span style="font-weight:600;font-size:14px">${esc(home)}</span>
          </div>
          <div style="flex:1;display:flex;flex-direction:column;gap:4px">
            <div style="font-size:32px;font-weight:800;letter-spacing:2px;line-height:1;color:${isLive ? 'var(--warn)' : 'inherit'}">${hScore} : ${aScore}</div>
            <div style="color:var(--mut);font-size:12px;font-weight:500">${isPost ? 'FT - ' : ''}${dateStr}</div>
          </div>
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:8px">
            <img src="${a.opponent_logo || ''}" style="width:48px;height:48px;object-fit:contain" alt="">
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
  const title = w.title || 'Spieltag Übersicht';
  const h = getHass();

  if (!h || !h.states) return `<section class="card"><div class="ch"><b>${esc(title)}</b></div><div class="mut sm">Keine Daten...</div></section>`;

  const matches = Object.values(h.states).filter(s =>
    s.entity_id.startsWith('sensor.') &&
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
    const home = a.team_name || 'Heim';
    const away = a.opponent_name || 'Gast';
    const hScore = a.team_score !== null ? a.team_score : 0;
    const aScore = a.opponent_score !== null ? a.opponent_score : 0;

    let timeStr = '';
    if (status === 'IN' || status === 'POST') {
      timeStr = `Ergebnis: ${hScore} : ${aScore}`;
    } else if (a.date) {
      const d = new Date(a.date);
      timeStr = d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }) + '. • ' + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr';
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
    <div style="display:flex;flex-direction:column">${rows || '<div class="mut sm" style="padding:8px 0">Keine Spiele gefunden. (Teamtracker Integration prüfen)</div>'}</div>
  </section>`;
}

function buliTableCard(w) {
  const e = w.entity || 'sensor.bund_scoreboard2';
  const t = w.title || 'Bundesliga';
  const s = S(e);

  if (!s || !s.attributes || !s.attributes.entries) {
    return `<section class="card"><div class="ch"><div style="display:flex;align-items:center;gap:9px">${ic('soccer',18)}<b>${esc(t)}</b></div></div><div class="mut sm" style="padding:8px 0">Warte auf Daten von ${esc(e)}...</div></section>`;
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
      <div class="buli-c" style="background:${col}"></div>
      <div class="text-center font-bold" style="width:20px">${gs('rank')}</div>
      <div style="flex:1;display:flex;align-items:center;gap:8px;min-width:0"><img src="${logo}" style="width:18px;height:18px;object-fit:contain" alt=""><b style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(clean(tm.displayName))}</b></div>
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
    <div class="ch" style="margin-bottom:12px"><div style="display:flex;align-items:center;gap:9px">${ic('soccer',18)}<b>${esc(t)}</b></div></div>
    <div class="buli-row h">
      <div class="buli-c" style="background:transparent"></div>
      <div class="text-center" style="width:20px">Pl</div>
      <div style="flex:1">Verein</div>
      <div class="text-center" style="width:18px" title="Spiele">Sp</div>
      <div class="text-center" style="width:18px" title="Siege">S</div>
      <div class="text-center" style="width:18px" title="Unentschieden">U</div>
      <div class="text-center" style="width:18px" title="Niederlagen">N</div>
      <div class="text-center" style="width:34px">Tore</div>
      <div class="text-center" style="width:28px" title="Tordifferenz">Dif</div>
      <div class="text-center" style="width:26px">Pkt</div>
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
    return `<section class="f1-card"><div class="ch"><b>Nächstes Rennen</b></div><div class="mut sm">Warte auf Daten von ${esc(e)}...</div></section>`;
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

    const dFmt = isNaN(dObj) ? ses.iso : dObj.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: 'short' });
    const tFmt = isNaN(dObj) ? '' : dObj.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr';

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
        ${flagUrl ? `<img src="${flagUrl}" style="width:26px;height:18px;object-fit:cover;border-radius:3px" alt="">` : ''}
        <div>
          <div class="f1-title">${esc(raceName)}</div>
          <div class="mut sm" style="text-transform:uppercase;letter-spacing:1px">${esc(circuit)}${loc ? ' · ' + esc(loc) : ''}</div>
        </div>
      </div>
    </div>

    ${targetMs ? `<div class="f1-timer-wrap">
      <div class="mut sm" style="letter-spacing:1px">COUNTDOWN</div>
      <div class="f1-timer" data-target="${targetMs}">Berechne...</div>
      <div class="mut sm">to lights out</div>
    </div>` : ''}

    ${mapUrl ? `<div class="f1-map">
      <div class="mut sm" style="text-align:left;letter-spacing:1px;margin-bottom:8px">CIRCUIT MAP</div>
      <img src="${mapUrl}" alt="Track Map">
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
    return `<section class="f1-card"><div class="ch"><b>WM-Stand (Fahrer)</b></div><div class="mut sm">Warte auf Daten von ${esc(e)}...</div></section>`;
  }

  const a = s.attributes;
  const list = a.driver_standings || a.standings || a.drivers || [];

  if (!list.length) {
    return `<section class="f1-card"><div class="ch"><b>WM-Stand (Fahrer)</b></div><div class="mut sm">Keine Tabellendaten gefunden.</div></section>`;
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
      <div class="f1-pos">${pos}</div>
      <div class="f1-bar" style="background:${color}"></div>
      <div style="flex:1;min-width:0">
        <div class="f1-code" style="color:${color}">${esc(code)}</div>
        <div class="f1-team">${esc(teamName)}</div>
      </div>
      <div class="f1-pts">${pts}</div>
    </div>`;
  }).join('');

  return `<section class="f1-card" style="padding:0">
    <div style="padding:16px;background:rgba(255,255,255,.02);border-bottom:1px solid var(--line);text-align:center">
      <div style="font-size:18px;font-weight:700;letter-spacing:1px;text-transform:uppercase">WM-Stand (Fahrer)</div>
      <div class="mut sm" style="letter-spacing:2px;margin-top:2px">SEASON ${esc(a.season || '2026')}</div>
    </div>
    <div style="display:flex;flex-direction:column;padding:8px 16px 16px">${rows}</div>
  </section>`;
}

function customPageView(pageId) {
  const pIdx = (CONFIG.customPages || []).findIndex(p => p.id === pageId);
  const page = (CONFIG.customPages || [])[pIdx];
  if (!page) return `<div class="mut">Seite nicht gefunden.</div>`;

  const layout = page.layout || 'grid';
  const allWidgets = (page.widgets || []).map((w, wi) => ({ w, wi })).filter(({ w }) => w.show !== false || ui.editMode);

  const wrapWidget = ({ w, wi }) => {
    const inner = renderCustomWidget(w);
    if (!inner && !ui.editMode) return '';
    const colVal = String(w.col || 'auto');
    const qeBar = ui.editMode ? `<div class="qe-bar">
      <span class="qe-title">🧩 ${esc(w.title || w.type)}</span>
      <div class="qe-btns">
        <button class="qe-btn" data-act="qeWidgetMove" data-pi="${pIdx}" data-wi="${wi}" data-dir="-1" title="Nach oben / links">↑</button>
        <button class="qe-btn" data-act="qeWidgetMove" data-pi="${pIdx}" data-wi="${wi}" data-dir="1" title="Nach unten / rechts">↓</button>
        ${['auto','1','2','3','full'].map(c => `<button class="qe-btn ${colVal === c ? 'on' : ''}" data-act="qeWidgetCol" data-pi="${pIdx}" data-wi="${wi}" data-col="${c}" title="Spalte zuweisen">${c === 'auto' ? 'Auto' : c === 'full' ? 'Voll' : 'Sp.' + c}</button>`).join('')}
        <button class="qe-btn ${w.show === false ? 'off' : ''}" data-act="qeWidgetVis" data-pi="${pIdx}" data-wi="${wi}" title="Ein-/Ausblenden">${w.show === false ? '🙈' : '👁️'}</button>
        <button class="qe-btn" data-act="cfgOpenTab" data-tab="pages" title="Im Editor bearbeiten">⚙️</button>
      </div>
    </div>` : '';
    const spanFull = colVal === 'full' ? 'grid-column: 1 / -1;' : '';
    return `<div class="qe-wrap ${w.show === false ? 'qe-hidden' : ''}" style="${spanFull}">${qeBar}${inner || `<section class="card"><div class="mut">Leeres Widget (${esc(w.type)})</div></section>`}</div>`;
  };

  const pageToolbar = ui.editMode ? `<div class="qe-page-bar">
    <span>📐 <b>Seiten-Layout:</b></span>
    ${[
      ['grid', 'Auto-Raster'],
      ['column', '1 Spalte'],
      ['2col', '2 Spalten (frei zuordenbar)'],
      ['2col-asym', '2 Spalten (Links breit / Rechts schmal)'],
      ['3col', '3 Spalten (frei zuordenbar)']
    ].map(([k, lbl]) => `<button class="chip ${layout === k ? 'on' : ''}" data-act="qePageLayout" data-pi="${pIdx}" data-layout="${k}">${lbl}</button>`).join('')}
  </div>` : '';

  const hasExplicitCols = allWidgets.some(({ w }) => ['1', '2', '3'].includes(String(w.col || 'auto')));
  const isMultiColMode = ['2col', '2col-asym', '3col'].includes(layout) || hasExplicitCols;

  if (!allWidgets.length) {
    return `${pageHeader(page.eyebrow, page.title || page.label, page.intro)}${pageToolbar}<div class="mut">Noch keine Widgets auf dieser Seite.</div>`;
  }

  if (layout === 'column' || layout === '1col') {
    return `${pageHeader(page.eyebrow, page.title || page.label, page.intro)}${pageToolbar}<div class="page-column">${allWidgets.map(wrapWidget).join('')}</div>`;
  }

  if (isMultiColMode) {
    const numCols = layout === '3col' || allWidgets.some(({ w }) => String(w.col) === '3') ? 3 : 2;
    const gridClass = numCols === 3 ? 'grid grid-3-col' : (layout === '2col-asym' ? 'grid' : 'grid grid-2-equal');
    const fullTop = [];
    const cols = Array.from({ length: numCols }, () => []);

    allWidgets.forEach((item, idx) => {
      const c = String(item.w.col || 'auto');
      if (c === 'full') fullTop.push(wrapWidget(item));
      else if (c === '1') cols[0].push(wrapWidget(item));
      else if (c === '2') cols[Math.min(1, numCols - 1)].push(wrapWidget(item));
      else if (c === '3') cols[Math.min(2, numCols - 1)].push(wrapWidget(item));
      else cols[idx % numCols].push(wrapWidget(item));
    });

    return `${pageHeader(page.eyebrow, page.title || page.label, page.intro)}${pageToolbar}
      ${fullTop.length ? `<div class="col" style="margin-bottom:16px">${fullTop.join('')}</div>` : ''}
      <div class="${gridClass}">
        ${cols.map(cList => `<div class="col">${cList.join('')}</div>`).join('')}
      </div>`;
  }

  return `${pageHeader(page.eyebrow, page.title || page.label, page.intro)}${pageToolbar}<div class="page-grid">${allWidgets.map(wrapWidget).join('')}</div>`;
}

/* ---------- Header-Badges & Kalender ---------- */
const homeCalendarState = { loading: false, loadedAt: 0, family: [], trash: [], error: false };
function stateIsUsable(s) { return !!s && !['unknown', 'unavailable', 'none', 'None', ''].includes(String(s.state)); }
function formatCountdown(entity, fallback = '') {
  if (!entity) return fallback;
  const s = S(entity);
  if (!stateIsUsable(s)) return fallback;
  const ms = Date.parse(String(s.state || '').trim());
  if (!Number.isFinite(ms)) return fallback;
  const diff = ms - Date.now();
  if (diff <= 0) return 'Jetzt';
  const mins = Math.floor(diff / 60000), hours = Math.floor(mins / 60), rest = mins % 60;
  return `${hours > 0 ? `${hours}h ` : ''}${rest}m`;
}
function wasteType(summary) {
  const value = String(summary || '');
  if (/strauchgut/i.test(value)) return { label: 'Strauchgut', icon: 'leaf', color: '#84cc16' };
  if (/grüne tonne|papier/i.test(value)) return { label: 'Papier', icon: 'cal', color: '#60a5fa' };
  if (/gelber sack/i.test(value)) return { label: 'Gelber Sack', icon: 'trash', color: '#fbbf24' };
  if (/graue tonne|restmüll|restmuell/i.test(value)) return { label: 'Restmüll', icon: 'trash', color: '#9ca3af' };
  if (/sperrmüll|sperrmuell/i.test(value)) return { label: 'Sperrmüll', icon: 'trash', color: '#c084fc' };
  return { label: 'Abfall', icon: 'trash', color: '#9ca3af' };
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
    const when = days === 0 ? 'Heute' : days === 1 ? 'Morgen' : `in ${days} Tagen`;
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
    if (text.includes('Jetzt')) text = 'Fertig';

    const colorCls = parseBadgeColor(b.colorLogic, w1Raw, w2Raw);
    badges.push({ icon: b.icon || 'plug', cls: colorCls, title: b.title, value: text });
  });

  if (!badges.length) return '';
  return `<div class="home-header-badges">${badges.map(b => `<span class="home-header-badge ${b.cls}" ${b.style ? `style="${esc(b.style)}"` : ''}>${ic(b.icon, 13)}<span>${esc(b.title)}: ${esc(b.value)}</span></span>`).join('')}</div>`;
}

function parseCalendarDate(value) {
  if (value && typeof value === 'object') value = value.dateTime || value.date || value.timestamp || '';
  const raw = String(value || '');
  return raw ? Date.parse(/^\d{4}-\d{2}-\d{2}$/.test(raw) ? `${raw}T00:00:00` : raw) : NaN;
}
function normalizeCalendarEvent(event, entity) {
  const startRaw = event.start ?? event.start_time ?? event.startTime ?? '';
  const startMs = parseCalendarDate(startRaw);
  const startString = typeof startRaw === 'object' ? (startRaw.dateTime || startRaw.date || '') : String(startRaw);
  return {
    entity, summary: event.summary || event.message || event.title || 'Termin',
    description: event.description || '', location: event.location || '',
    startRaw: startString, startMs,
    endMs: parseCalendarDate(event.end ?? event.end_time ?? event.endTime ?? ''),
    allDay: /^\d{4}-\d{2}-\d{2}$/.test(startString)
  };
}
async function refreshHomeCalendars(force = false) {
  if (DEMO || homeCalendarState.loading) return;
  if (!force && homeCalendarState.loadedAt && Date.now() - homeCalendarState.loadedAt < 5 * 60 * 1000) return;
  const ha = getHass(); if (!ha || typeof ha.callApi !== 'function') return;
  const calCfg = CONFIG.calendars || {};
  const entities = [
    ...(calCfg.familyEntities || []).map(e => ({ entity: e, group: 'family' })),
    ...(calCfg.trashEntities || []).map(e => ({ entity: e, group: 'trash' }))
  ];
  if (!entities.length) return;
  homeCalendarState.loading = true;
  const now = new Date(), start = new Date(now); start.setHours(0, 0, 0, 0);
  const end = new Date(start.getTime() + 30 * 24 * 3600 * 1000);
  try {
    const results = await Promise.all(entities.map(async ({ entity, group }) => {
      try {
        const res = await ha.callApi('GET', `calendars/${entity}?start=${encodeURIComponent(start.toISOString())}&end=${encodeURIComponent(end.toISOString())}`);
        const arr = Array.isArray(res) ? res : (res && Array.isArray(res.events) ? res.events : []);
        return { group, ok: true, events: arr.map(ev => normalizeCalendarEvent(ev, entity)).filter(ev => Number.isFinite(ev.startMs)) };
      } catch (e) { return { group, ok: false, events: [] }; }
    }));
    const dedupe = list => {
      const seen = new Set();
      return list.filter(ev => { const k = `${ev.summary}|${ev.startRaw}`; if (seen.has(k)) return false; seen.add(k); return true; }).sort((a, b) => a.startMs - b.startMs);
    };
    homeCalendarState.family = dedupe(results.filter(x => x.group === 'family').flatMap(x => x.events));
    homeCalendarState.trash = dedupe(results.filter(x => x.group === 'trash').flatMap(x => x.events));
    homeCalendarState.loadedAt = Date.now();
  } finally {
    homeCalendarState.loading = false;
    tick(true);
  }
}
function homeCalendarCard(daysCount = 7, customTitle = null) {
  const calCfg = CONFIG.calendars || {};
  if (!(calCfg.familyEntities && calCfg.familyEntities.length)) return '';
  const now = new Date(), today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekEnd = new Date(today); weekEnd.setDate(weekEnd.getDate() + daysCount);
  const upcoming = homeCalendarState.family.filter(ev => ev.allDay ? (ev.startMs >= today.getTime() && ev.startMs < weekEnd.getTime()) : (ev.startMs >= now.getTime() && ev.startMs < weekEnd.getTime()));
  const dayRows = Array.from({ length: daysCount }, (_, i) => {
    const day = new Date(today); day.setDate(day.getDate() + i);
    const events = upcoming.filter(ev => { const d = new Date(ev.startMs); return d.getFullYear() === day.getFullYear() && d.getMonth() === day.getMonth() && d.getDate() === day.getDate(); });
    const dayLabel = i === 0 ? 'Heute' : i === 1 ? 'Morgen' : day.toLocaleDateString('de-DE', { weekday: 'short' });
    const dateLabel = day.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
    const eventHtml = events.length ? events.map(ev => `<div class="home-agenda-event"><b>${esc(ev.summary)}</b><small>${ev.allDay ? 'Ganztags' : new Date(ev.startMs).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr'}</small></div>`).join('') : '<small>Keine Termine</small>';
    return `<div class="home-agenda-row" style="--agenda-accent:#F1C40F"><div class="home-agenda-date">${dayLabel}<br>${dateLabel}</div><div class="home-agenda-main">${eventHtml}</div></div>`;
  }).join('');
  return `<section class="card home-agenda"><div class="ch"><b>${esc(customTitle || `Familienkalender · ${daysCount} Tage`)}</b></div><div class="home-agenda-list">${DEMO ? '<div class="home-agenda-empty">Kalender im HA-Modus aktiv.</div>' : dayRows}</div></section>`;
}
function homeTrashCard(maxDays = 2, maxItems = 6, subtitle = 'Nächste 3 Tage') {
  const calCfg = CONFIG.calendars || {};
  if (!(calCfg.trashEntities && calCfg.trashEntities.length)) return '';
  const items = getUpcomingTrashItems(maxDays).slice(0, maxItems);
  const rows = items.map(ev => `<div class="home-agenda-row" style="--agenda-accent:${ev.type.color}"><div class="home-agenda-date">${esc(ev.when)}</div><div class="home-agenda-main"><span class="home-trash-type">${ic(ev.type.icon, 13)} ${esc(ev.type.label)}</span><b>${esc(ev.summary)}</b></div></div>`).join('');
  return `<section class="card home-agenda"><div class="ch"><b>Abfallkalender</b><span class="mut sm">${esc(subtitle)}</span></div><div class="home-agenda-list">${rows || `<div class="home-agenda-empty">Keine Abholung (${esc(subtitle)}).</div>`}</div></section>`;
}

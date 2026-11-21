/* ==========================================================================
   Smart Home Hub – Visueller In-App Konfigurations-Editor (editor.js)
   100% No-Code UI Konfigurator (Layout, Spalten, Chip-Picker, Theme-Presets)
   ========================================================================== */

let cfgDraft = null;
let cfgTab = 'allgemein';
let cfgDevSubTab = 'geraete';
const cfgOpenBoxes = new Set();
let cfgOpenBoxesInit = false;
let cfgSearchPreOpen = null;

const CHIP_ICON_OPTIONS = [
  ['expand', '⛶ Vergrößern (expand)'],
  ['camera', '📷 Kamera (camera)'],
  ['shield', '🛡️ Sicherheit (shield)'],
  ['home', '🏠 Haus (home)'],
  ['thermo', '🌡️ Temperatur (thermo)'],
  ['drop', '💧 Luftfeuchte / Wasser (drop)'],
  ['bolt', '⚡ Leistung / Strom (bolt)'],
  ['sun', '☀️ Solar / Sonne (sun)'],
  ['battery', '🔋 Batterie (battery)'],
  ['plug', '🔌 Stecker (plug)'],
  ['bulb', '💡 Licht (bulb)'],
  ['fire', '🔥 Heizung / Feuer (fire)'],
  ['fan', '🌀 Lüfter / Wind (fan)'],
  ['radiator', '♨️ Heizkörper (radiator)'],
  ['ac', '❄️ Klimaanlage (ac)'],
  ['tv', '📺 TV / Media (tv)'],
  ['washing', '🧺 Waschmaschine / Haushalt (washing)'],
  ['dishwasher', '🍽️ Spülmaschine (dishwasher)'],
  ['mower', '🚜 Mähroboter (mower)'],
  ['blinds', '🪟 Rolladen (blinds)'],
  ['lock', '🔒 Schloss (lock)'],
  ['door', '🚪 Tür (door)'],
  ['bell', '🔔 Klingel (bell)'],
  ['moon', '🌙 Nacht (moon)'],
  ['cal', '📅 Kalender (cal)'],
  ['trash', '🗑️ Müll / Abfall (trash)'],
  ['leaf', '🌿 Natur / Garten (leaf)'],
  ['chart', '📈 Statistik / Chart (chart)']
];

const CHIP_COLOR_OPTIONS = [
  ['', 'Standard (Lila)'],
  ['blue', 'Blau'],
  ['amber', 'Gelb / Orange'],
  ['green', 'Grün'],
  ['red', 'Rot'],
  ['battery', 'Batterie-Automatik (Rot/Gelb/Grün)']
];

const CTILE_TYPE_OPTIONS = [
  ['hvac', 'Modus (Betriebsart durchschalten)'],
  ['fan', 'Lüfter (Stufe durchschalten / Ein-Aus)'],
  ['custom', 'Eigener Wert / Schalter']
];

const DASHBOARD_CARD_LABELS = {
  alerts: '🚨 Bedingte Warn-Karten (Alerts)',
  hero: '🖼️ Raum-Banner (Hero & Live-Kamera)',
  presence: '👥 Familien-Präsenz (Status & Avatare)',
  quick_routines: '⚡ Szenen & Routinen (Schnellzugriff)',
  devices: '🔌 Geräteübersicht (Haupt-Reiter)',
  extra_tabs: '📑 Zusätzliche Geräte-Reiter',
  appliances: '🧺 Haushaltsgeräte-Monitor (Waschmaschine & Co.)',
  covers: '🪟 Rolladen-Steuerung',
  calendar: '📅 Familienkalender (7 Tage)',
  status: '🛡️ Sicherheits-Status & Türschloss-Pills',
  climate: '🌡️ Raumklima / Wetter-Kachel',
  rain_timeline: '🌧️ Regenradar (60-Minuten-Vorschau)',
  ventilation: '🌬️ Smarte Lüftungsempfehlung & Fenster-Timer',
  favorites: '⭐ Schnellauswahl / Favoriten',
  energy_prices: '💶 Dynamische Strompreise (Tibber / EPEX)',
  metrics: '⚡ Energie- & Verbrauchs-Metriken',
  power_flow: '🔄 Power Flow (Energiefluss-Grafik / Kacheln)',
  battery_forecast: '🔋 Batteriespeicher-Restlaufzeit & Prognose',
  wallbox: '🚗 Wallbox & E-Auto',
  security: '🔒 Sicherheits-Kachel (Schlösser/Fenster/Kameras)',
  lights: '💡 Lichter-Gruppen & Hauptschalter',
  system_health: '🖥️ System-Health (Server & Docker)',
  trash: '🗑️ Abfallkalender'
};

const WIDGET_TYPE_GROUPS = [
  {
    group: '🏠 Smart-Home, Räume & Geräte',
    items: [
      ['devices', '🔌 Geräteliste (alle oder nach Raum gefiltert)'],
      ['lights', '💡 Lichter-Gruppen (alle oder einzelne Gruppe)'],
      ['covers', '🪟 Rolläden-Steuerung (alle oder nach Raum)'],
      ['favorites', '⭐ Schnellauswahl / Favoriten'],
      ['quick_routines', '⚡ Szenen & Routinen (1-Klick Buttons)'],
      ['presence', '👥 Familien-Präsenz (Anwesenheit)'],
      ['appliances', '🧺 Haushaltsgeräte-Monitor (Waschmaschine & Co.)']
    ]
  },
  {
    group: '🌡️ Klima, Wetter & Lüftung',
    items: [
      ['climate_room', '🌡️ Klima-Raumkarte (aus Klima-Baukasten, z.B. Büro)'],
      ['climate', '🌡️ Raumklima & Wetter-Kachel (Startseiten-Bogen)'],
      ['ventilation', '🌬️ Smarte Lüftungsempfehlung & Fenster-Timer'],
      ['weather_forecast', '☀️ Wettervorhersage (7 Tage)'],
      ['rain_timeline', '🌧️ Regenradar (60-Minuten-Vorschau)']
    ]
  },
  {
    group: '⚡ Energie, PV & Technik',
    items: [
      ['power_flow', '🔄 Power Flow (Energiefluss-Grafik / Kacheln)'],
      ['metrics', '⚡ Energie- & Verbrauchs-Metriken (24h & Vergleich)'],
      ['battery_forecast', '🔋 Speicher-Restlaufzeit & Ladeprognose'],
      ['energy_prices', '💶 Dynamische Strompreise (Tibber / EPEX)'],
      ['wallbox', '🚗 Wallbox & E-Auto'],
      ['stat_group', '📈 24h Statistik-Kurven (Freie Sensorgruppe)'],
      ['system_health', '🖥️ System-Health (Server & Docker)']
    ]
  },
  {
    group: '🔒 Sicherheit & Kameras',
    items: [
      ['camera', '📷 Live-Kamera (go2rtc Stream / Home Assistant)'],
      ['security', '🔒 Sicherheits-Kachel (Schlösser, Fenster & Kameras)'],
      ['status', '🛡️ Sicherheits-Status & Türschloss-Pills'],
      ['alerts', '🚨 Bedingte Warn-Karten (Alerts)']
    ]
  },
  {
    group: '📅 Kalender, Familie, Sport & Web',
    items: [
      ['calendar', '📅 Familienkalender'],
      ['trash', '🗑️ Abfallkalender'],
      ['todo', '📋 Aufgaben / To-Do (TaskMate / Home Assistant)'],
      ['sports_hub', '🏆 Universal Sport-Center (Fußball, NFL, Tennis & mehr)'],
      ['entity_info', 'ℹ️ Entitäts-Info (Attribute-Liste)'],
      ['iframe', '🌐 Webseite / Iframe einbetten'],
      ['f1_next', '🏎️ Formel 1 – Nächstes Rennen'],
      ['f1_standings', '🏎️ Formel 1 – WM-Stand'],
      ['buli_team', '⚽ Mein Verein (HA Teamtracker)'],
      ['buli_table', '⚽ Bundesliga Tabelle (HA Sensor)'],
      ['buli_matchday', '⚽ Spieltag Übersicht (HA Sensor)']
    ]
  }
];

function buildScopeSelectOptions(currentScope) {
  const rooms = (cfgDraft && cfgDraft.rooms) || [];
  const baseOpts = [
    ['all', '🌐 In allen Raum-Tabs anzeigen'],
    ['home', '🏠 Nur auf Startseite (Home)']
  ];
  rooms.forEach((rm, idx) => {
    if (idx > 0 && rm && rm.name) {
      baseOpts.push([`room:${rm.name}`, `📍 Nur im Raum-Tab: ${rm.name}`]);
    }
  });
  baseOpts.push(['custom', '🎯 Mehrere Räume gezielt auswählen…']);
  return baseOpts.map(([v, l]) => `<option value="${esc(v)}" ${(currentScope || 'all') === v ? 'selected' : ''}>${esc(l)}</option>`).join('');
}

function placementStatusBadgeHtml(cardId, widgetType = null, extraInfo = '') {
  if (!cfgDraft) return '';
  const badges = [];
  if (extraInfo) {
    badges.push(`<span class="cfg-badge-info">${esc(extraInfo)}</span>`);
  }
  if (cardId) {
    const item = (cfgDraft.dashboardLayout || []).find(x => x && x.id === cardId);
    if (item && item.show !== false) {
      const sc = item.scope || 'all';
      let locTxt = 'Alle Räume';
      if (sc === 'home') locTxt = 'Home';
      else if (sc.startsWith('room:')) locTxt = sc.slice(5);
      else if (sc === 'custom') locTxt = (item.scopeRooms && item.scopeRooms.length) ? item.scopeRooms.join(', ') : 'Keine Räume';
      const colTxt = item.col === 'full' ? 'Voll' : `Sp.${item.col || 1}`;
      badges.push(`<span class="cfg-badge-on" title="Auf Haupt-Dashboard aktiv">🟢 ${esc(locTxt)} · ${esc(colTxt)}</span>`);
    } else {
      badges.push(`<span class="cfg-badge-off" title="Auf Haupt-Dashboard ausgeblendet">⚪ Dashboard: Aus</span>`);
    }
  }
  if (widgetType && Array.isArray(cfgDraft.customPages)) {
    const activePages = cfgDraft.customPages.filter(pg => (pg.widgets || []).some(w => w && w.type === widgetType && w.show !== false));
    if (activePages.length) {
      badges.push(`<span class="cfg-badge-page" title="Auf eigenen Unterseiten platziert">📄 ${esc(activePages.map(p => p.label).join(', '))}</span>`);
    }
  }
  return `<div class="cfg-sum-badges" data-act="noop">${badges.join('')}</div>`;
}

function placementBarHtml(cardId, widgetType = null, defaultTitle = '') {
  if (!cfgDraft) return '';
  const dLayout = cfgDraft.dashboardLayout || [];
  const li = cardId ? dLayout.findIndex(x => x && x.id === cardId) : -1;
  const item = li >= 0 ? dLayout[li] : null;
  const isGrid12 = cfgDraft.dashboardLayoutMode === 'grid12';
  const dashColsParsed = parseColsMode(cfgDraft.dashboardCols || '2-asym', 'asym', 2);
  const maxDashColOpts = clamp(Math.max(dashColsParsed.cols || 2, 6), 4, 12);
  const dashColOpts = [
    ...Array.from({ length: maxDashColOpts }, (_, i) => [String(i + 1), `Spalte ${i + 1}`]),
    ['full', 'Volle Breite']
  ];

  let dashControls = '';
  if (item) {
    const customRoomPills = item.scope === 'custom'
      ? `<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;width:100%;margin-top:6px;padding-top:6px;border-top:1px dashed rgba(255,255,255,.08)">
          <span class="mut sm">Sichtbar in diesen Raum-Tabs:</span>
          ${(cfgDraft.rooms || []).map(rm => {
            const on = Array.isArray(item.scopeRooms) && item.scopeRooms.includes(rm.name);
            return `<button type="button" class="chip ${on ? 'on' : ''}" data-act="cfgScopeRoomToggle" data-card="${esc(cardId)}" data-room="${esc(rm.name)}" style="font-size:11px;padding:3px 9px">${on ? '✓ ' : '+ '}${esc(rm.name)}</button>`;
          }).join('')}
        </div>`
      : '';

    dashControls = `
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;flex:1">
        <label style="font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;padding:5px 10px;border-radius:8px;background:${item.show !== false ? 'rgba(52,211,153,.12)' : 'rgba(255,255,255,.04)'};border:1px solid ${item.show !== false ? 'rgba(52,211,153,.35)' : 'var(--line)'}">
          <input type="checkbox" data-dl-i="${li}" data-dl-k="show" ${item.show !== false ? 'checked' : ''}>
          <span>${item.show !== false ? '👁️ Im Dashboard sichtbar' : '🙈 Im Dashboard ausgeblendet'}</span>
        </label>
        ${item.show !== false ? `
          <div style="display:inline-flex;align-items:center;gap:6px">
            <span class="mut sm">Wo:</span>
            <select class="cfg-in" style="padding:5px 10px;min-height:32px;width:auto" data-dl-i="${li}" data-dl-k="scope">
              ${buildScopeSelectOptions(item.scope || 'all')}
            </select>
          </div>
          ${!isGrid12 ? `
          <div style="display:inline-flex;align-items:center;gap:6px">
            <span class="mut sm">Spalte:</span>
            <select class="cfg-in" style="padding:5px 10px;min-height:32px;width:auto" data-dl-i="${li}" data-dl-k="col">
              ${dashColOpts.map(([v, l]) => `<option value="${v}" ${String(item.col || '1') === v ? 'selected' : ''}>${l}</option>`).join('')}
            </select>
          </div>` : `
          <div style="display:inline-flex;align-items:center;gap:6px">
            <span class="mut sm">Raster-Breite:</span>
            <select class="cfg-in" style="padding:5px 10px;min-height:32px;width:auto" data-dl-i="${li}" data-dl-k="span">
              ${[['12','12 (Voll)'],['8','8 (2/3)'],['6','6 (1/2)'],['4','4 (1/3)'],['3','3 (1/4)']].map(([v, l]) => `<option value="${v}" ${String(item.span || '6') === v ? 'selected' : ''}>${l}</option>`).join('')}
            </select>
          </div>`}
        ` : ''}
      </div>
      ${customRoomPills}`;
  }

  let subpageControls = '';
  if (widgetType && Array.isArray(cfgDraft.customPages) && cfgDraft.customPages.length) {
    const pagePills = cfgDraft.customPages.map((pg, pi) => {
      const hasW = (pg.widgets || []).some(w => w && w.type === widgetType && w.show !== false);
      return `<button type="button" class="chip ${hasW ? 'on' : ''}" data-act="cfgTogglePageWidget" data-pi="${pi}" data-wtype="${esc(widgetType)}" data-wtitle="${esc(defaultTitle)}" style="font-size:11px;padding:3px 9px" title="1-Klick: Diese Kachel auf der Unterseite „${esc(pg.label)}“ ${hasW ? 'entfernen' : 'hinzufügen'}">${hasW ? '✓ ' : '+ '}📄 ${esc(pg.label)}</button>`;
    }).join('');
    subpageControls = `
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;${item ? 'margin-top:8px;padding-top:8px;border-top:1px dashed rgba(255,255,255,.08)' : ''}">
        <span class="mut sm" style="font-weight:600">📄 Auch auf Unterseite anzeigen:</span>
        ${pagePills}
      </div>`;
  }

  if (!dashControls && !subpageControls) return '';
  return `<div class="cfg-placement-bar">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap">
      <span style="font-size:11.5px;font-weight:700;color:var(--acc2);letter-spacing:.02em">📍 ANZEIGE-ORT &amp; PLATZIERUNG</span>
      ${dashControls}
    </div>
    ${subpageControls}
  </div>`;
}

function itemShowOnPickerHtml(item, kind, idx) {
  if (!cfgDraft || !item) return '';
  const showOn = normalizeItemShowOn(item, 'Home');
  const isAll = showOn.includes('all');
  const isNone = showOn.includes('none');
  const rooms = (cfgDraft.rooms && cfgDraft.rooms.length) ? cfgDraft.rooms : [{ name: 'Home' }];
  const pages = Array.isArray(cfgDraft.customPages) ? cfgDraft.customPages : [];

  const roomPills = rooms.map((rm, rIdx) => {
    const rName = (rm && rm.name) ? rm.name : `Raum ${rIdx + 1}`;
    const on = !isAll && !isNone && showOn.some(x => String(x).toLowerCase() === rName.toLowerCase());
    const icon = rIdx === 0 || rName.toLowerCase() === 'home' ? '🏠' : '🚪';
    return `<button type="button" class="chip ${on ? 'on' : ''}" data-act="cfgItemLocToggle" data-kind="${esc(kind)}" data-i="${idx}" data-loc="${esc(rName)}" style="font-size:11px;padding:3px 9px" title="Klick: Auf Raum-Tab „${esc(rName)}“ ${on ? 'ausblenden' : 'anzeigen'}">${on ? '✓ ' : ''}${icon} ${esc(rName)}</button>`;
  }).join('');

  const pagePills = pages.map(pg => {
    if (!pg || !pg.id) return '';
    const locKey = `page:${pg.id}`;
    const on = !isAll && !isNone && showOn.some(x => String(x).toLowerCase() === locKey.toLowerCase());
    return `<button type="button" class="chip ${on ? 'on' : ''}" data-act="cfgItemLocToggle" data-kind="${esc(kind)}" data-i="${idx}" data-loc="${esc(locKey)}" style="font-size:11px;padding:3px 9px" title="Klick: Auf Unterseite „${esc(pg.label || pg.title || pg.id)}“ ${on ? 'ausblenden' : 'anzeigen'}">${on ? '✓ ' : ''}📄 ${esc(pg.label || pg.title || pg.id)}</button>`;
  }).join('');

  const summary = formatItemShowOnSummary(item, cfgDraft);

  return `<div style="width:100%;margin-top:6px;padding:7px 10px;border-radius:8px;background:rgba(99,102,241,.06);border:1px solid rgba(99,102,241,.18);display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">
    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
      <span style="font-size:11px;font-weight:700;color:var(--acc2);margin-right:2px">📍 Sichtbar auf:</span>
      <button type="button" class="chip ${isAll ? 'on' : ''}" data-act="cfgItemLocToggle" data-kind="${esc(kind)}" data-i="${idx}" data-loc="all" style="font-size:11px;padding:3px 9px" title="Auf allen Seiten &amp; Räumen anzeigen">${isAll ? '✓ ' : ''}🌐 Überall</button>
      ${roomPills}
      ${pagePills}
    </div>
    <span class="mut sm" style="font-size:10.5px;white-space:nowrap">Aktuell: <b style="color:var(--txt)">${esc(summary)}</b></span>
  </div>`;
}

/* ---------- Visueller Multi-Entitäts Chip-Picker (ohne Komma-Listen!) ---------- */
function entityChipsHtml(list, groupKey, parentIdx = '', placeholder = 'Entität suchen & auswählen…') {
  const arr = Array.isArray(list) ? list : [];
  const isLightGrp = groupKey === 'lightGrp' && cfgDraft && cfgDraft.lights && cfgDraft.lights[+parentIdx];
  const exGrpArr = isLightGrp && Array.isArray(cfgDraft.lights[+parentIdx].excludeGroup) ? cfgDraft.lights[+parentIdx].excludeGroup : [];
  const exMainArr = isLightGrp && Array.isArray(cfgDraft.lights[+parentIdx].excludeMain) ? cfgDraft.lights[+parentIdx].excludeMain : [];

  const chips = arr.map((ent, ci) => {
    const st = S(ent);
    const fn = st && st.attributes && st.attributes.friendly_name ? st.attributes.friendly_name : '';
    let exclBtns = '';
    if (isLightGrp) {
      const exG = exGrpArr.includes(ent);
      const exM = exMainArr.includes(ent);
      exclBtns = `
        <button type="button" class="ent-chip-excl ${exG ? 'excl' : 'on'}" data-act="cfgLightExclGrp" data-p="${esc(String(parentIdx))}" data-e="${esc(ent)}" title="${exG ? 'Vom Gruppenschalter ausgeschlossen (Klick zum Einschließen)' : 'Im Gruppenschalter aktiv (Klick zum Ausschließen)'}">${exG ? '🔒 Gruppe' : '💡 Gruppe'}</button>
        <button type="button" class="ent-chip-excl ${exM ? 'excl' : 'on'}" data-act="cfgLightExclMain" data-p="${esc(String(parentIdx))}" data-e="${esc(ent)}" title="${exM ? 'Vom Master-Hauptschalter ausgeschlossen (Klick zum Einschließen)' : 'Im Master-Hauptschalter aktiv (Klick zum Ausschließen)'}">${exM ? '🔒 Haupt' : '⚡ Haupt'}</button>`;
    }
    return `<span class="ent-chip" title="${esc(ent)}">
      <span class="ent-chip-txt">${fn ? `<b>${esc(fn)}</b> <small>${esc(ent)}</small>` : `<b>${esc(ent)}</b>`}</span>
      ${exclBtns}
      <button type="button" class="ent-chip-del" data-act="cfgChipDel" data-grp="${esc(groupKey)}" data-p="${esc(String(parentIdx))}" data-ci="${ci}" title="Entfernen">✕</button>
    </span>`;
  }).join('');

  const inputId = `chip-in-${groupKey}-${parentIdx}`;
  return `<div class="ent-chips-wrap">
    <div class="ent-chips-list">${chips || '<span class="mut sm">Noch keine Entitäten ausgewählt.</span>'}</div>
    <div class="ent-chips-add">
      <input type="text" id="${esc(inputId)}" class="cfg-in" list="ha-entities-list" placeholder="${esc(placeholder)}" style="flex:1;min-width:200px">
      <button type="button" class="iconbtn" data-act="cfgChipAdd" data-grp="${esc(groupKey)}" data-p="${esc(String(parentIdx))}" data-in="${esc(inputId)}">+ Hinzufügen</button>
    </div>
  </div>`;
}

function getTileArr(scope) {
  if (!cfgDraft) return null;
  if (scope === 'g') return cfgDraft.climate && cfgDraft.climate.tiles;
  const r = cfgDraft.rooms[+scope];
  return r && r.climateTiles;
}

function climateTilesEditorHtml(scope) {
  const tiles = getTileArr(scope) || [];
  const rows = tiles.map((t, i) => {
    const at = `data-ct-s="${scope}" data-ct-i="${i}"`;
    const defIcon = t.type === 'fan' ? 'fan' : t.type === 'custom' ? 'thermo' : 'sun';
    return `<div class="cfg-row" style="background:rgba(255,255,255,.025);padding:8px;border-radius:8px;border:1px solid var(--line)">
      <label><input type="checkbox" ${at} data-ct-k="show" ${t.show !== false ? 'checked' : ''}> Anzeigen</label>
      <div class="cfg-field"><label>Typ</label>
        <select class="cfg-in" ${at} data-ct-k="type">${CTILE_TYPE_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(t.type || 'custom') === val ? 'selected' : ''}>${lab}</option>`).join('')}</select>
      </div>
      <div class="cfg-field"><label>Bezeichnung</label><input class="cfg-in" ${at} data-ct-k="label" placeholder="Modus / Lüfter" value="${esc(t.label || '')}"></div>
      <div class="cfg-field"><label>Entität (leer = Klima-Entität des Raums)</label><input class="cfg-in" list="ha-entities-list" ${at} data-ct-k="entity" placeholder="climate.* / fan.* / select.* / switch.*" value="${esc(t.entity || '')}"></div>
      <div class="cfg-field"><label>Attribut (optional, ersetzt den Status)</label><input class="cfg-in" ${at} data-ct-k="attr" placeholder="z. B. fan_mode" value="${esc(t.attr || '')}"></div>
      <div class="cfg-field"><label>Einheit</label><input class="cfg-in" ${at} data-ct-k="unit" value="${esc(t.unit || '')}"></div>
      <div class="cfg-field"><label>Nachkommastellen</label><input type="number" min="0" max="3" class="cfg-in" ${at} data-ct-k="decimals" value="${t.decimals ?? 1}"></div>
      <div class="cfg-field"><label>Icon</label>
        <select class="cfg-in" ${at} data-ct-k="icon">${CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(t.icon || defIcon) === val ? 'selected' : ''}>${lab}</option>`).join('')}</select>
      </div>
      <div class="order-btns" style="justify-self:end;align-self:end">
        <button class="btn-move" data-act="cfgMoveCT" data-s="${scope}" data-i="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''}>▲</button>
        <button class="btn-move" data-act="cfgMoveCT" data-s="${scope}" data-i="${i}" data-dir="1" ${i === tiles.length - 1 ? 'disabled' : ''}>▼</button>
        <button class="btn-danger" data-act="cfgDelCT" data-s="${scope}" data-i="${i}">✕</button>
      </div>
    </div>`;
  }).join('');
  return `${rows || '<span class="mut sm">Keine Kacheln – die Karte zeigt dann nur die Temperatur-Anzeige.</span>'}
    <div><button class="iconbtn" data-act="cfgAddCT" data-s="${scope}">+ Kachel hinzufügen</button></div>`;
}

function openCfgEditor(initialTab = null, initialSubTab = null) {
  const tabMap = {
    gen: 'allgemein', allgemein: 'allgemein',
    layout: 'layout',
    rooms: 'raeume', raeume: 'raeume',
    devs: 'geraete', geraete: 'geraete',
    klima: 'klima',
    metrics: 'energie', energie: 'energie', badges: 'allgemein',
    sec: 'kameras', kameras: 'kameras',
    pages: 'kalender', seiten: 'kalender', kalender: 'kalender',
    backup: 'backup',
    appliances: 'geraete'
  };
  if (initialTab && tabMap[initialTab]) cfgTab = tabMap[initialTab];
  if (initialTab === 'appliances') cfgDevSubTab = 'appliances';
  if (initialSubTab) cfgDevSubTab = initialSubTab;
  requirePin('editor', () => {
    cfgDraft = ensureConfigDefaults(JSON.parse(JSON.stringify(CONFIG)));
    const validDevSubTabs = ['favorites', 'system', 'lichter', 'appliances', 'covers'];
    if (!validDevSubTabs.includes(cfgDevSubTab) && !cfgDraft.deviceTabs.some(t => t.id === cfgDevSubTab)) {
      cfgDevSubTab = (cfgDraft.deviceTabs[0] && cfgDraft.deviceTabs[0].id) || 'favorites';
    }
    cfgOpenBoxes.clear();
    cfgOpenBoxesInit = false;
    cfgSearchPreOpen = null;
    renderCfgModal(false);
    document.getElementById('cfgmodal').classList.add('show');
  }, 'Dashboard-Editor entsperren');
}

function renderCfgModal(preserveScroll = true) {
  const prevBody = document.querySelector('#cfgsheet .cfg-body');
  const prevScroll = (preserveScroll && prevBody) ? prevBody.scrollTop : 0;
  const searchEl = document.getElementById('cfgSearch');
  const searchVal = searchEl ? searchEl.value : '';

  if (preserveScroll && cfgSearchPreOpen === null) {
    document.querySelectorAll('#cfgsheet details.cfg-box[data-box-key]').forEach(el => {
      if (el.open) cfgOpenBoxes.add(el.dataset.boxKey);
      else cfgOpenBoxes.delete(el.dataset.boxKey);
    });
  }

  const tabs = [
    ['allgemein', '🎨 Design & Start-Banner'],
    ['layout', '📐 Layout & Platzierung'],
    ['raeume', '🏠 Räume'],
    ['geraete', '🔌 Geräte, Licht & Rollos'],
    ['klima', '🌡️ Klima, Wetter & Lüftung'],
    ['energie', '⚡ Energie, PV & Wallbox'],
    ['kameras', '🔒 Sicherheit, Kameras & Alerts'],
    ['kalender', '📅 Kalender & Eigene Seiten'],
    ['backup', '💾 System & Backup']
  ];
  if (cfgTab === 'seiten') cfgTab = 'kalender';
  const tabBtns = tabs.map(([id, label]) => `<button class="pill ${cfgTab === id ? 'on' : ''}" data-act="cfgtab" data-tab="${id}">${label}</button>`).join('');

  const fld = (lbl, attrs, type = 'text') => `<div class="cfg-field float"><input type="${type}" class="cfg-in" placeholder=" " ${attrs}><label>${esc(lbl)}</label></div>`;
  const sel = (lbl, opts, attrs) => `<div class="cfg-field float"><select class="cfg-in" style="padding-top:16px" ${attrs}>${opts}</select><label style="top:4px;font-size:9px;color:var(--acc2)">${esc(lbl)}</label></div>`;
  const txt = (lbl, attrs, val) => `<div class="cfg-field float"><textarea class="cfg-in" placeholder=" " ${attrs}>${esc(val)}</textarea><label>${esc(lbl)}</label></div>`;
  const box = (title, desc, content, defaultOpen = false, headRight = '', boxKey = '') => {
    const key = boxKey || safeId(title);
    if (!cfgOpenBoxesInit && defaultOpen) {
      cfgOpenBoxes.add(key);
    }
    const isOpen = cfgOpenBoxes.has(key);
    return `<details class="cfg-box" data-box-key="${esc(key)}" ${isOpen ? 'open' : ''}><summary><div style="display:flex;flex-direction:column;gap:3px;margin-right:auto"><b>${title}</b><span class="cfg-desc">${desc}</span></div>${headRight}</summary><div class="cfg-box-body">${content}</div></details>`;
  };

  const th = cfgDraft.theme || {};
  const pp = cfgDraft.pinProtect || {};
  const w = cfgDraft.weather || {};

  // ---------- TAB 1: DESIGN & START-BANNER ----------
  const presetBtns = Object.entries(THEME_PRESETS || {}).map(([key, p]) => `
    <button type="button" class="theme-preset-btn ${th.preset === key ? 'on' : ''}" data-act="cfgThemePreset" data-preset="${esc(key)}">
      <span class="tp-dots">
        <i style="background:${p.bg}"></i>
        <i style="background:${p.acc}"></i>
        <i style="background:${p.ok}"></i>
      </span>
      <span>${esc(p.name)}</span>
    </button>`).join('');

  const ACCENT_SWATCHES = [
    ['#7c6cf0', 'Violett (Standard)'],
    ['#0284c7', 'Ozeanblau'],
    ['#059669', 'Smaragdgrün'],
    ['#ea580c', 'Warmer Bernstein'],
    ['#6366f1', 'Indigo Slate'],
    ['#0ea5e9', 'Nordisch Eiscyan'],
    ['#ec4899', 'Neon Cyber Pink'],
    ['#a855f7', 'Dracula Glow'],
    ['#4f46e5', 'Titanium'],
    ['#f43f5e', 'Rosé Velvet'],
    ['#c2410c', 'Kupfer Espresso'],
    ['#94a3b8', 'Schiefer Minimal']
  ];
  const quickColorsHtml = ACCENT_SWATCHES.map(([c, n]) => `<button type="button" class="quick-color-dot" style="background:${c}" data-act="cfgQuickAcc" data-color="${c}" title="${n} (${c})"></button>`).join('');

  let tAllgemein = box('🎨 Design-Vorlagen, Farben & Form', 'Wähle ein fertiges Farbschema per 1-Klick oder passe Farben, Rundungen und Abstände frei an.', `
    <div style="margin-bottom:14px">
      <span class="cfg-desc" style="display:block;margin-bottom:8px;font-weight:600">✨ 1-Klick Farb- & Design-Presets:</span>
      <div class="theme-presets-grid">${presetBtns}</div>
    </div>
    <div style="margin-bottom:12px;padding:10px 12px;background:rgba(255,255,255,.025);border-radius:10px;border:1px solid var(--line)">
      <span class="cfg-desc" style="display:block;margin-bottom:6px">⚡ Schnellauswahl Primär-/Akzentfarbe:</span>
      <div class="quick-colors-row">${quickColorsHtml}</div>
    </div>
    <div class="cfg-row">
      ${fld('Hintergrund', `data-cpath="theme.bg" value="${esc(th.bg || '#080912')}"`, 'color')}
      ${fld('Primärfarbe', `data-cpath="theme.acc" value="${esc(th.acc || '#7c6cf0')}"`, 'color')}
      ${fld('Akzent hell', `data-cpath="theme.acc2" value="${esc(th.acc2 || '#a99bff')}"`, 'color')}
      ${fld('Grün / OK', `data-cpath="theme.ok" value="${esc(th.ok || '#34d399')}"`, 'color')}
      ${fld('Warnung', `data-cpath="theme.warn" value="${esc(th.warn || '#f59e0b')}"`, 'color')}
      ${fld('Blau / Kühl', `data-cpath="theme.cool" value="${esc(th.cool || '#38bdf8')}"`, 'color')}
    </div>
    <div class="cfg-row" style="margin-top:10px">
      ${sel('Karten-Rundung (Form)', [
        ['0px', 'Scharfkantig (0px)'],
        ['8px', 'Subtil kantig (8px)'],
        ['14px', 'Modern dezent (14px)'],
        ['20px', 'Abgerundet (20px)'],
        ['26px', 'Sanft rund – Standard (26px)'],
        ['32px', 'Kompakt-Rund (32px)'],
        ['40px', 'Pill-Style / Organisch (40px)']
      ].map(([v, l]) => `<option value="${v}" ${(th.radius || '22px') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-cpath="theme.radius"`)}
      ${sel('Abstands-Dichte (Layout)', [
        ['compact', 'Kompakt (mehr Inhalt auf Wandtablets)'],
        ['normal', 'Standard (ausgewogen)'],
        ['relaxed', 'Luftig (großzügige Abstände & Polster)']
      ].map(([v, l]) => `<option value="${v}" ${(th.density || 'normal') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-cpath="theme.density"`)}
    </div>`, true, '', 'allgemein_design') +
    box('🏠 Seitenleiste, Begrüßung & Uhrzeit', 'Grundlegende Texte, Begrüßung und Zeitanzeige im Start-Banner.', `
    <div class="cfg-row">
      ${fld('HA-Seitenleisten-Titel', `data-cpath="sidebarTitle" value="${esc(cfgDraft.sidebarTitle)}"`)}
      ${fld('HA-Seitenleisten-Icon', `data-cpath="sidebarIcon" value="${esc(cfgDraft.sidebarIcon)}"`)}
      ${fld('Dashboard-Titel', `data-cpath="title" value="${esc(cfgDraft.title)}"`)}
      ${fld('Untertitel', `data-cpath="subtitle" value="${esc(cfgDraft.subtitle)}"`)}
    </div>
    <div class="cfg-row">
      ${fld('Begrüßungs-Name', `data-cpath="userName" value="${esc(cfgDraft.userName)}"`)}
      ${fld('Rolle (z.B. Bewohner)', `data-cpath="role" value="${esc(cfgDraft.role)}"`)}
      ${fld('Begrüßungstext-Entität (optional)', `list="ha-entities-list" data-cpath="greetingEntity" value="${esc(cfgDraft.greetingEntity)}"`)}
    </div>
    <div class="cfg-row">
      <label><input type="checkbox" data-cbool="showDateTime" ${cfgDraft.showDateTime !== false ? 'checked' : ''}> Datum & Live-Uhrzeit im Raum-Banner anzeigen</label>
      ${fld('Schriftgröße Datum & Uhrzeit (px, 10–48)', `min="10" max="48" data-cpath="dateTimeSize" value="${esc(cfgDraft.dateTimeSize || 13)}"`, 'number')}
    </div>
    <div class="cfg-row" style="margin-top:10px;padding-top:10px;border-top:1px dashed var(--line)">
      <span class="cfg-desc" style="display:block;width:100%;font-weight:600;margin-bottom:4px">🎨 Farben für Begrüßung, Name, Status & Datum (Banner):</span>
      ${fld('Farbe: Begrüßung ("Guten Tag")', `data-cpath="theme.greetingColor" value="${esc((cfgDraft.theme || {}).greetingColor || '#d5d7ea')}"`, 'color')}
      ${fld('Farbe: Name ("Timo 👋")', `data-cpath="theme.nameColor" value="${esc((cfgDraft.theme || {}).nameColor || '#f2f3fa')}"`, 'color')}
      ${fld('Farbe: "Das passiert gerade..."', `data-cpath="theme.activityColor" value="${esc((cfgDraft.theme || {}).activityColor || '#c4c7dc')}"`, 'color')}
      ${fld('Farbe: Datum & Uhrzeit', `data-cpath="theme.dateTimeColor" value="${esc((cfgDraft.theme || {}).dateTimeColor || '#c4c7dc')}"`, 'color')}
    </div>`, false, '', 'allgemein_sidebar') +
    box('🏷️ Header-Badges im Startseiten-Banner', 'Dynamische Status-Chips unter der Begrüßung im Home-Banner (z.B. Akku leer/voll, Waschmaschine, Spülmaschine, Müll).', `
    ${(cfgDraft.headerBadgeItems || []).map((b, bi) => `<div style="background:rgba(255,255,255,.025);padding:10px;border-radius:10px;border:1px solid var(--line);margin-bottom:8px">
      <div class="cfg-row">
        ${sel('Typ', `<option value="entity" ${b.type !== 'calendar' ? 'selected' : ''}>Entität / Status</option><option value="calendar" ${b.type === 'calendar' ? 'selected' : ''}>Abfallkalender-Badge</option>`, `data-hb-i="${bi}" data-hb-k="type"`)}
        ${fld('Titel / Präfix', `data-hb-i="${bi}" data-hb-k="title" value="${esc(b.title || '')}"`)}
        ${sel('Icon', CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(b.icon || 'plug') === val ? 'selected' : ''}>${lab}</option>`).join(''), `data-hb-i="${bi}" data-hb-k="icon"`)}
        ${b.type === 'calendar'
          ? fld('Vorschau in Tagen', `type="number" data-hb-i="${bi}" data-hb-k="maxDays" value="${b.maxDays || 2}"`)
          : fld('Entität 1 [W1]', `list="ha-entities-list" data-hb-i="${bi}" data-hb-k="entity1" value="${esc(b.entity1 || '')}"`)}
        ${b.type !== 'calendar' ? fld('Entität 2 [W2] (optional)', `list="ha-entities-list" data-hb-i="${bi}" data-hb-k="entity2" value="${esc(b.entity2 || '')}"`) : ''}
        <div class="order-btns"><button class="btn-move" data-act="cfgMoveHB" data-i="${bi}" data-dir="-1" ${bi === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMoveHB" data-i="${bi}" data-dir="1" ${bi === (cfgDraft.headerBadgeItems || []).length - 1 ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelHB" data-i="${bi}">✕</button></div>
      </div>
      ${b.type !== 'calendar' ? `<div class="cfg-row" style="margin-top:6px">
        ${fld('Anzeige-Format (z.B. [W1] W · [W2]%)', `data-hb-i="${bi}" data-hb-k="format" value="${esc(b.format || '[W1]')}"`)}
        ${fld('Nur anzeigen wenn Entität…', `list="ha-entities-list" data-hb-i="${bi}" data-hb-k="conditionEnt" value="${esc(b.conditionEnt || '')}"`)}
        ${sel('Bedingung', [
          ['', 'Immer anzeigen'],
          ['==', 'ist gleich (==)'],
          ['!=', 'ist nicht (!=)'],
          ['>', 'größer als (>)'],
          ['<', 'kleiner als (<)'],
          ['not_empty', 'nicht leer / verfügbar']
        ].map(([v, l]) => `<option value="${v}" ${(b.conditionOp || '') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-hb-i="${bi}" data-hb-k="conditionOp"`)}
        ${fld('Vergleichswert (z.B. on / 50)', `data-hb-i="${bi}" data-hb-k="conditionVal" value="${esc(b.conditionVal || '')}"`)}
        ${fld('Farb-Regel (z.B. >100:green, default:blue)', `data-hb-i="${bi}" data-hb-k="colorLogic" value="${esc(b.colorLogic || 'default:blue')}"`)}
      </div>` : ''}
    </div>`).join('')}
    <button class="iconbtn" data-act="cfgAddHB" style="margin-top:6px">+ Header-Badge hinzufügen</button>
    `, false, `<span class="cfg-badge-info">${(cfgDraft.headerBadgeItems || []).length} Badges</span>`, 'energie_badges') +
    box('⚡ Szenen & Routinen (Schnellzugriff)', 'Prominente 1-Klick Buttons für tägliche Szenen (z. B. Gute Nacht, Haus verlassen, Alle Lichter aus).', `
      ${placementBarHtml('quick_routines', 'quick_routines', 'Szenen & Routinen')}
      ${(cfgDraft.routines || []).map((rt, ri) => `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px;margin-bottom:6px">
        ${fld('Name / Text', `data-rt-i="${ri}" data-rt-k="name" value="${esc(rt.name || '')}"`)}
        ${fld('Szene oder Skript (scene.*, script.*)', `list="ha-entities-list" data-rt-i="${ri}" data-rt-k="entity" value="${esc(rt.entity || '')}"`)}
        ${sel('Icon', CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(rt.icon || 'scenes') === val ? 'selected' : ''}>${lab}</option>`).join(''), `data-rt-i="${ri}" data-rt-k="icon"`)}
        ${sel('Farbe', [['acc', 'Lila (Standard)'], ['ok', 'Grün'], ['warn', 'Orange'], ['cool', 'Blau'], ['amber', 'Gold'], ['rose', 'Rot']].map(([v, l]) => `<option value="${v}" ${(rt.color || 'acc') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-rt-i="${ri}" data-rt-k="color"`)}
        <div class="order-btns"><button class="btn-move" data-act="cfgMoveRoutine" data-i="${ri}" data-dir="-1" ${ri === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMoveRoutine" data-i="${ri}" data-dir="1" ${ri === (cfgDraft.routines || []).length - 1 ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelRoutine" data-i="${ri}">✕</button></div>
      </div>`).join('')}
      <button class="iconbtn" data-act="cfgAddRoutine" style="margin-top:6px">+ Routine hinzufügen</button>
    `, false, placementStatusBadgeHtml('quick_routines', 'quick_routines', `${(cfgDraft.routines || []).length} Routinen`), 'allgemein_routines') +
    box('👥 Familien-Präsenz (Status & Avatare)', 'Zeigt Familienmitglieder als kleine Profil-Chips mit Status (Zuhause, Unterwegs) an.', `
      ${placementBarHtml('presence', 'presence', 'Anwesenheit')}
      ${((cfgDraft.presence && cfgDraft.presence.members) || []).map((pm, pi) => `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px;margin-bottom:6px">
        ${fld('Name', `data-pm-i="${pi}" data-pm-k="name" value="${esc(pm.name || '')}"`)}
        ${fld('Person-Entität (person.* oder device_tracker.*)', `list="ha-entities-list" data-pm-i="${pi}" data-pm-k="entity" value="${esc(pm.entity || '')}"`)}
        ${fld('Foto-URL (leer = Initialen-Badge)', `data-pm-i="${pi}" data-pm-k="avatar" value="${esc(pm.avatar || '')}"`)}
        <div class="order-btns"><button class="btn-move" data-act="cfgMovePresence" data-i="${pi}" data-dir="-1" ${pi === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMovePresence" data-i="${pi}" data-dir="1" ${pi === ((cfgDraft.presence && cfgDraft.presence.members) || []).length - 1 ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelPresence" data-i="${pi}">✕</button></div>
      </div>`).join('')}
      <button class="iconbtn" data-act="cfgAddPresence" style="margin-top:6px">+ Person hinzufügen</button>
    `, false, placementStatusBadgeHtml('presence', 'presence', `${((cfgDraft.presence && cfgDraft.presence.members) || []).length} Personen`), 'allgemein_presence') +
    box('📱 Endgeräte-Profil (Nur für dieses Gerät / Tablet)', 'Speichert Startansicht, Start-Raum und Kiosk-/Screensaver-Verhalten lokal nur für dieses Gerät (z. B. Wandtablet Flur vs. Tablet Büro vs. PC), während alle Kacheln & Entitäten global synchron bleiben.', (() => {
      const dp = typeof getDeviceProfile === 'function' ? getDeviceProfile() : { deviceName: '', startView: '', startRoom: '', returnToStartMins: 0, kioskOverride: 'global', screensaverOverride: 'global' };
      const startViewOpts = [
        ['', '🔄 Automatisch (zuletzt geöffnete Ansicht merken)'],
        ['dashboard', '🏠 Haupt-Dashboard (Startseite / Raum-Tabs)'],
        ['klima', '🌡️ Klima-Unterseite'],
        ['kameras', '📷 Kamera-Unterseite'],
        ...(cfgDraft.customPages || []).map(p => [`page:${p.id}`, `📄 Eigene Unterseite: ${p.label}`])
      ];
      const startRoomOpts = [
        ['', '🏠 Standard (1. Raum / Home)'],
        ...(cfgDraft.rooms || []).map(r => [r.name, `📍 Raum-Tab: ${r.name}`])
      ];
      return `
      <div class="cfg-row">
        ${fld('Gerätename (optional, z.B. Tablet Büro, Wandtablet Flur, PC)', `data-devprof-k="deviceName" value="${esc(dp.deviceName || '')}"`)}
        ${sel('Start-Ansicht auf diesem Gerät', startViewOpts.map(([v, l]) => `<option value="${esc(v)}" ${(dp.startView || '') === v ? 'selected' : ''}>${esc(l)}</option>`).join(''), `data-devprof-k="startView"`)}
        ${(!dp.startView || dp.startView === 'dashboard')
          ? sel('Start-Raum-Tab (auf Haupt-Dashboard)', startRoomOpts.map(([v, l]) => `<option value="${esc(v)}" ${(dp.startRoom || '') === v ? 'selected' : ''}>${esc(l)}</option>`).join(''), `data-devprof-k="startRoom"`)
          : ''}
      </div>
      <div class="cfg-row" style="margin-top:8px">
        ${sel('Kiosk-Vollbildmodus auf diesem Gerät', [
          ['global', `🌐 Globale Einstellung nutzen (${cfgDraft.kioskMode ? 'Aktuell: An' : 'Aktuell: Aus'})`],
          ['on', '⛶ Auf diesem Gerät IMMER Kiosk-Vollbild (Ideal für Wandtablet)'],
          ['off', '🖥️ Auf diesem Gerät NIE Kiosk-Vollbild (Ideal für PC / Laptop)']
        ].map(([v, l]) => `<option value="${v}" ${(dp.kioskOverride || 'global') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-devprof-k="kioskOverride"`)}
        ${sel('OLED-Screensaver auf diesem Gerät', [
          ['global', '🌐 Globale Einstellung nutzen'],
          ['on', '🌙 Auf diesem Gerät IMMER aktiv'],
          ['off', '🚫 Auf diesem Gerät DEAKTIVIERT (z.B. am PC)']
        ].map(([v, l]) => `<option value="${v}" ${(dp.screensaverOverride || 'global') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-devprof-k="screensaverOverride"`)}
        ${fld('Auto-Rückkehr zur Startansicht nach Inaktivität (Minuten, 0 = Aus)', `type="number" min="0" max="120" data-devprof-k="returnToStartMins" value="${dp.returnToStartMins || 0}"`)}
      </div>
      <div style="margin-top:10px;display:flex;gap:10px;flex-wrap:wrap;align-items:center">
        <button type="button" class="btn-pri" data-act="cfgPinCurrentAsDeviceStart">📌 Aktuell geöffnete Ansicht als Startseite für dieses Gerät festlegen</button>
        <button type="button" class="iconbtn" data-act="cfgResetDeviceProfile">↺ Endgeräte-Profil zurücksetzen</button>
      </div>`;
    })(), true, (() => {
      const dp = typeof getDeviceProfile === 'function' ? getDeviceProfile() : {};
      const hasCustom = dp.deviceName || dp.startView || dp.startRoom || (dp.kioskOverride && dp.kioskOverride !== 'global') || (dp.screensaverOverride && dp.screensaverOverride !== 'global');
      return hasCustom
        ? `<span class="cfg-badge-page">📱 ${esc(dp.deviceName || 'Geräte-Profil aktiv')}</span>`
        : `<span class="cfg-badge-off">🌐 Globaler Standard</span>`;
    })(), 'allgemein_device_profile') +
    box('🔐 Globale Sicherheit, PIN-Schutz & Screensaver', 'Globale PIN- und Vollbild-Vorgaben für alle Geräte ohne eigenes Endgeräte-Profil.', `
    <div class="cfg-row">
      <label><input type="checkbox" data-cbool="kioskMode" ${cfgDraft.kioskMode ? 'checked' : ''}> Globaler Kiosk-Vollbildmodus (HA-Sidebar ausblenden)</label>
      <label><input type="checkbox" data-cbool="hideSystemLinks" ${cfgDraft.hideSystemLinks ? 'checked' : ''}> HA-Systemlinks ausblenden</label>
      ${fld('Master PIN-Code (UI-Sperre, wird als Hash im Backend geprüft)', `data-cpath="pinCode" value="${esc(cfgDraft.pinCode)}"`, 'password')}
    </div>
    <div class="cfg-row" style="margin-top:8px">
      <label><input type="checkbox" data-cbool="pinProtect.editor" ${pp.editor ? 'checked' : ''}> PIN für Editor</label>
      <label><input type="checkbox" data-cbool="pinProtect.systemLinks" ${pp.systemLinks ? 'checked' : ''}> PIN für Systemlinks</label>
      <label><input type="checkbox" data-cbool="pinProtect.kioskExit" ${pp.kioskExit ? 'checked' : ''}> PIN für Kiosk-Exit</label>
      <label><input type="checkbox" data-cbool="pinProtect.doorUnlock" ${pp.doorUnlock ? 'checked' : ''}> PIN für Türschlösser</label>
    </div>
    <div style="margin-top:12px;padding-top:10px;border-top:1px dashed var(--line)">
      <span class="cfg-desc">OLED Screensaver (Burn-In-Schutz für Wandtablets):</span>
      <div class="cfg-row" style="margin-top:6px">
        <label><input type="checkbox" data-cbool="screensaver.show" ${(cfgDraft.screensaver || {}).show !== false ? 'checked' : ''}> Screensaver global aktivieren</label>
        ${fld('Inaktivitäts-Zeit (Minuten, 0 = Aus)', `type="number" min="0" max="120" data-cpath="screensaver.timeoutMins" value="${(cfgDraft.screensaver || {}).timeoutMins != null ? (cfgDraft.screensaver || {}).timeoutMins : 3}"`)}
      </div>
    </div>
    <div style="margin-top:10px;display:flex;gap:10px;flex-wrap:wrap;align-items:center">
      <button class="iconbtn" data-act="cfgSetDefaultPanel">🏠 Smart Home Hub als Standard-Dashboard festlegen</button>
      <button class="iconbtn" data-act="forceReloadApp">🔄 Tablet-Cache leeren &amp; neu laden</button>
      <span class="cfg-desc">Rückgängig: In HA unter Profil → Dashboard wieder auf „Auto“ stellen.</span>
    </div>`, false, '', 'allgemein_security');

  // ---------- TAB 2: LAYOUT & PLATZIERUNG ----------
  const widgetTypeOptgroupsHtml = currentType => WIDGET_TYPE_GROUPS.map(grp =>
    `<optgroup label="${esc(grp.group)}">${grp.items.map(([v, l]) => `<option value="${esc(v)}" ${currentType === v ? 'selected' : ''}>${esc(l)}</option>`).join('')}</optgroup>`
  ).join('');

  const dLayout = cfgDraft.dashboardLayout || DEFAULT_DASHBOARD_LAYOUT();
  const isGrid12 = cfgDraft.dashboardLayoutMode === 'grid12';
  const dashColsParsed = parseColsMode(cfgDraft.dashboardCols || '2-asym', 'asym', 2);
  const maxDashColOpts = clamp(Math.max(dashColsParsed.cols || 2, 6), 4, 12);
  const dashColSelectOpts = [
    ...Array.from({ length: maxDashColOpts }, (_, i) => [String(i + 1), `Spalte ${i + 1}`]),
    ['full', 'Volle Breite (über alle Spalten)']
  ];

  const widthSelectOpts = [
    ['100', '100% (Ganze Spalte)'],
    ['50', '50% (Halb · 2 nebeneinander)'],
    ['33', '33% (Drittel · 3 nebeneinander)'],
    ['66', '66% (Zwei Drittel)'],
    ['25', '25% (Viertel · 4 nebeneinander)'],
    ['75', '75% (Drei Viertel)']
  ];

  const spanSelectOpts = [
    ['12', '12 Spalten (Volle Breite)'],
    ['8', '8 Spalten (2/3 Breite)'],
    ['6', '6 Spalten (1/2 Breite · 2 nebeneinander)'],
    ['4', '4 Spalten (1/3 Breite · 3 nebeneinander)'],
    ['3', '3 Spalten (1/4 Breite · 4 nebeneinander)'],
    ['9', '9 Spalten (3/4 Breite)'],
    ['5', '5 Spalten'],
    ['7', '7 Spalten'],
    ['10', '10 Spalten'],
    ['11', '11 Spalten'],
    ['2', '2 Spalten (sehr schmal)'],
    ['1', '1 Spalte (minimal)']
  ];

  const layoutRows = dLayout.map((item, li) => {
    const isCW = !!(item.isCustomWidget && item.widget);
    const edTab = (typeof DASH_CARD_EDITOR_TAB !== 'undefined' && DASH_CARD_EDITOR_TAB[item.id]) || item.cfgTab || 'allgemein';
    const edSubTab = (typeof DASH_CARD_EDITOR_SUBTAB !== 'undefined' && DASH_CARD_EDITOR_SUBTAB[item.id]) || '';
    const customRoomRow = item.scope === 'custom'
      ? `<div style="width:100%;display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding-top:6px;border-top:1px dashed rgba(255,255,255,.08)">
          <span class="mut sm">Sichtbar in:</span>
          ${(cfgDraft.rooms || []).map(rm => {
            const on = Array.isArray(item.scopeRooms) && item.scopeRooms.includes(rm.name);
            return `<button type="button" class="chip ${on ? 'on' : ''}" data-act="cfgScopeRoomToggle" data-card="${esc(item.id)}" data-room="${esc(rm.name)}" style="font-size:11px;padding:3px 9px">${on ? '✓ ' : '+ '}${esc(rm.name)}</button>`;
          }).join('')}
        </div>`
      : '';

    let cwExtraRow = '';
    if (isCW) {
      const cw = item.widget;
      let cwTargetFld = '';
      if (['devices', 'covers', 'favorites', 'ventilation', 'lights', 'climate_room'].includes(cw.type)) {
        cwTargetFld = fld('Raum / Gruppe (z.B. Büro)', `list="cfg-room-names" data-dlw-i="${li}" data-dlw-k="room" value="${esc(cw.room || cw.entity || '')}"`);
      } else if (cw.type === 'iframe') {
        cwTargetFld = fld('Webseiten-URL (https://…)', `data-dlw-i="${li}" data-dlw-k="url" value="${esc(cw.url || cw.entity || '')}"`);
      } else if (cw.type === 'camera') {
        cwTargetFld = fld('HA Kamera (camera.*)', `list="ha-entities-list" data-dlw-i="${li}" data-dlw-k="entity" value="${esc(cw.entity || '')}"`) +
          fld('go2rtc Stream (optional)', `data-dlw-i="${li}" data-dlw-k="stream" value="${esc(cw.stream || '')}"`);
      } else if (['entity_info', 'todo', 'f1_next', 'f1_standings', 'buli_team', 'buli_table', 'buli_matchday'].includes(cw.type)) {
        cwTargetFld = fld('Entität (sensor.*, todo.* …)', `list="ha-entities-list" data-dlw-i="${li}" data-dlw-k="entity" value="${esc(cw.entity || '')}"`);
      }
      const statCurvesHtml = cw.type === 'stat_group'
        ? `<div style="width:100%;margin-top:6px;padding-top:6px;border-top:1px dashed rgba(255,255,255,.08)">
            <span class="cfg-desc">24h-Kurven in diesem Startseiten-Widget:</span>
            ${(cw.items || []).map((sit, sii) => `<div class="cfg-row" style="margin-top:4px">
              ${fld('Name', `data-dlwsi-i="${li}" data-dlwsi-si="${sii}" data-dlwsi-k="name" value="${esc(sit.name || '')}"`)}
              ${fld('Entität', `list="ha-entities-list" data-dlwsi-i="${li}" data-dlwsi-si="${sii}" data-dlwsi-k="entity" value="${esc(sit.entity || '')}"`)}
              ${fld('Farbe', `data-dlwsi-i="${li}" data-dlwsi-si="${sii}" data-dlwsi-k="color" value="${esc(sit.color || '#a99bff')}"`, 'color')}
              <button class="btn-danger" data-act="cfgDelDashWStatItem" data-i="${li}" data-si="${sii}">✕</button>
            </div>`).join('')}
            <button class="iconbtn" data-act="cfgAddDashWStatItem" data-i="${li}" style="margin-top:6px">+ 24h-Kurve hinzufügen</button>
          </div>`
        : '';

      cwExtraRow = `<div style="width:100%;padding-top:8px;margin-top:4px;border-top:1px dashed rgba(255,255,255,.1)">
        <div class="cfg-row">
          ${sel('Widget-Typ', widgetTypeOptgroupsHtml(cw.type), `data-dlw-i="${li}" data-dlw-k="type"`)}
          ${fld('Widget-Titel', `data-dlw-i="${li}" data-dlw-k="title" value="${esc(cw.title || '')}"`)}
          ${cwTargetFld}
        </div>
        ${statCurvesHtml}
      </div>`;
    }

    return `
    <div class="cfg-row" style="background:rgba(255,255,255,.025);padding:10px 12px;border-radius:10px;border:1px solid ${item.show !== false ? 'rgba(124,108,240,.28)' : 'var(--line)'};align-items:center;opacity:${item.show !== false ? '1' : '.68'}">
      <label style="min-width:120px;font-weight:600;cursor:pointer">
        <input type="checkbox" data-dl-i="${li}" data-dl-k="show" ${item.show !== false ? 'checked' : ''}>
        ${item.show !== false ? '👁️ Sichtbar' : '🙈 Ausgeblendet'}
      </label>
      <div style="flex:1.4;min-width:190px;font-weight:600">${esc(DASHBOARD_CARD_LABELS[item.id] || item.label || item.id)}</div>
      ${!isGrid12
        ? sel('Spalte', dashColSelectOpts.map(([v, l]) => `<option value="${v}" ${String(item.col || '1') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-dl-i="${li}" data-dl-k="col"`)
        : ''}
      ${!isGrid12
        ? sel('Kachelbreite', widthSelectOpts.map(([v, l]) => `<option value="${v}" ${String(item.width || '100') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-dl-i="${li}" data-dl-k="width"`)
        : sel('Breite (Grid-Span 1–12)', spanSelectOpts.map(([v, l]) => `<option value="${v}" ${String(item.span || (item.col === 'full' ? '12' : '6')) === v ? 'selected' : ''}>${l}</option>`).join(''), `data-dl-i="${li}" data-dl-k="span"`)}
      ${sel('Wo im Dashboard anzeigen?', buildScopeSelectOptions(item.scope || 'all'), `data-dl-i="${li}" data-dl-k="scope"`)}
      <div class="order-btns">
        ${!isCW
          ? `<button type="button" class="iconbtn" style="padding:5px 9px;font-size:11px" data-act="cfgOpenTab" data-tab="${esc(edTab)}" ${edSubTab ? `data-subtab="${esc(edSubTab)}"` : ''} title="Zu den Einstellungen dieser Kachel springen">⚙️ Modul</button>`
          : `<button type="button" class="btn-danger" data-act="cfgDelDashWidget" data-i="${li}" title="Eigenes Widget entfernen">✕</button>`}
        <button class="btn-move" data-act="cfgMoveDL" data-i="${li}" data-dir="-1" ${li === 0 ? 'disabled' : ''} title="Nach oben">▲</button>
        <button class="btn-move" data-act="cfgMoveDL" data-i="${li}" data-dir="1" ${li === dLayout.length - 1 ? 'disabled' : ''} title="Nach unten">▼</button>
      </div>
      ${customRoomRow}
      ${cwExtraRow}
    </div>`;
  }).join('');

  let tLayout = box('📐 Startseiten-Layout & Kachel-Platzierung (Home & Raum-Tabs)', 'Bestimme für jede Kachel, ob sie auf allen Raum-Tabs, nur auf Home oder nur in ausgewählten Räumen (z. B. Büro) angezeigt wird. Unten kannst du zudem beliebige weitere Widgets (wie Power-Flow, 24h-Kurven, To-Do, Sport oder Iframe) direkt auf Home oder in einzelne Raum-Tabs legen!', `
    <div class="cfg-row" style="margin-bottom:12px">
      ${sel('Layout-System (Startseite)', [
        ['columns', '📐 Spalten-Modus (Spalten mit flexiblen Kachelbreiten 100%, 50%, 33%...)'],
        ['grid12', '▦ 12-Spalten-Raster (Freies Raster über das gesamte Dashboard, 1–12 Spalten pro Kachel)']
      ].map(([v, l]) => `<option value="${v}" ${(cfgDraft.dashboardLayoutMode || 'columns') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-cpath="dashboardLayoutMode"`)}
      <button type="button" class="iconbtn" data-act="cfgResetDL" style="align-self:center">↺ Standard-Reihenfolge wiederherstellen</button>
    </div>
    ${!isGrid12 ? `
    <div class="cfg-row" style="margin-bottom:12px">
      ${sel('Spalten-Vorlage (Startseite)', [
        ['2-asym', '2 Spalten asymmetrisch (Links breit / Rechts kompakt)'],
        ['1-col', '1 Spalte (alles untereinander)'],
        ['2-col', '2 Spalten gleich breit (50% / 50%)'],
        ['3-col', '3 Spalten gleich breit'],
        ['4-col', '4 Spalten gleich breit'],
        ['5-col', '5 Spalten gleich breit'],
        ['6-col', '6 Spalten gleich breit']
      ].map(([v, l]) => `<option value="${v}" ${(cfgDraft.dashboardCols || '2-asym') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-cpath="dashboardCols"`)}
      ${sel('Spalten-Breitenverhältnis (2 Spalten)', [
        ['', 'Standard (automatisch / Vorlage)'],
        ['70/30', '70% Links / 30% Rechts'],
        ['65/35', '65% Links / 35% Rechts'],
        ['60/40', '60% Links / 40% Rechts'],
        ['50/50', '50% Links / 50% Rechts (Gleich groß)'],
        ['40/60', '40% Links / 60% Rechts'],
        ['30/70', '30% Links / 70% Rechts']
      ].map(([v, l]) => `<option value="${v}" ${(cfgDraft.dashboardColRatio || '') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-cpath="dashboardColRatio"`)}
      ${fld('Oder freie Spaltenanzahl (1–12)', `type="number" min="1" max="12" data-custom-cols="dashboardCols" value="${dashColsParsed.mode === 'cols' ? dashColsParsed.cols : ''}"`)}
      ${fld('Eigene CSS-Spalten (z.B. 2fr 1fr)', `data-cpath="dashboardColRatio" value="${esc(cfgDraft.dashboardColRatio || '')}" placeholder="z. B. 65% 35% oder 2fr 1fr"`)}
    </div>` : `
    <div class="cfg-row" style="margin-bottom:12px">
      <div class="mut sm">12-Spalten-Modus aktiv: Jede Kachel kann unten frei von 1 bis 12 Spalten breit eingestellt werden (z. B. 6 = halbe Breite / 2 Kacheln nebeneinander, 4 = Drittel / 3 nebeneinander, 8/4 = asymmetrisch 2 nebeneinander). Auf Smartphones schalten alle Kacheln automatisch auf 100% Breite um.</div>
    </div>`}
    <div style="display:flex;flex-direction:column;gap:8px">${layoutRows}</div>
    <div style="margin-top:12px">
      <button type="button" class="btn-pri" data-act="cfgAddDashWidget">+ Weiteres Widget (Power-Flow, 24h-Statistik, To-Do, Sport, Kamera, Iframe…) zur Startseite / Raum-Tab hinzufügen</button>
    </div>
  `, true, `<span class="cfg-badge-on">${dLayout.filter(x => x && x.show !== false).length} / ${dLayout.length} aktiv</span>`, 'layout_main') +
  box('Spalten-Anzahl für Klima & Kameras', 'Wähle eine Vorgabe (Auto / 1–4) oder gib eine freie Spaltenanzahl (1–12) ein.', `
    <div class="cfg-row">
      ${sel('Klima-Seite: Vorlage', [
        ['auto', 'Automatisch (responsiv nach Bildschirmbreite)'],
        ['1', '1 Spalte'],
        ['2', '2 Spalten'],
        ['3', '3 Spalten'],
        ['4', '4 Spalten'],
        ['5', '5 Spalten'],
        ['6', '6 Spalten']
      ].map(([v, l]) => `<option value="${v}" ${String(cfgDraft.klimaCols || 'auto') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-cpath="klimaCols"`)}
      ${fld('Klima: Freie Spaltenzahl (1–12)', `type="number" min="1" max="12" data-custom-cols="klimaCols" value="${parseColsMode(cfgDraft.klimaCols, 'auto', 2).mode === 'cols' ? parseColsMode(cfgDraft.klimaCols, 'auto', 2).cols : ''}"`)}
    </div>
    <div class="cfg-row" style="margin-top:8px">
      ${sel('Kamera-Seite: Vorlage', [
        ['auto', 'Automatisch (responsiv nach Bildschirmbreite)'],
        ['1', '1 Spalte'],
        ['2', '2 Spalten'],
        ['3', '3 Spalten'],
        ['4', '4 Spalten'],
        ['5', '5 Spalten'],
        ['6', '6 Spalten']
      ].map(([v, l]) => `<option value="${v}" ${String(cfgDraft.camCols || 'auto') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-cpath="camCols"`)}
      ${fld('Kameras: Freie Spaltenzahl (1–12)', `type="number" min="1" max="12" data-custom-cols="camCols" value="${parseColsMode(cfgDraft.camCols, 'auto', 2).mode === 'cols' ? parseColsMode(cfgDraft.camCols, 'auto', 2).cols : ''}"`)}
    </div>
    <span class="cfg-desc" style="margin-top:6px;display:block">Hinweis: Die Spalten und Zuordnungen für „Eigene Seiten“ findest du im Reiter „📅 Kalender &amp; Eigene Seiten“ oder direkt per Klick auf ✏️ im Quick-Edit-Modus.</span>
  `, true, '', 'layout_cam_klima');

  // ---------- TAB 3: RÄUME ----------
  let tRaeume = box('🖼️ Platzierung des Raum-Banners (Hero & Live-Kamera)', 'Bestimme, wo das große Raum-Banner mit den Raum-Tabs angezeigt wird.', `
    ${placementBarHtml('hero', null, 'Raum-Banner')}
  `, true, placementStatusBadgeHtml('hero', null, `${(cfgDraft.rooms || []).length} Räume`), 'room_hero_placement') +
  (cfgDraft.rooms || []).map((r, i) => box(`Raum #${i + 1}: ${esc(r.name)}`, 'Hintergrundbild, Kamera-Stream, Raumklima und Temperatur-Badges.', `
    <div class="cfg-row">
      ${fld('Raumname', `data-r-i="${i}" data-r-k="name" value="${esc(r.name)}"`)}
      ${fld('Klima-Entität (optional)', `list="ha-entities-list" data-r-i="${i}" data-r-k="climate" value="${esc(r.climate || '')}"`)}
      ${fld('Hintergrundbild URL', `data-r-i="${i}" data-r-k="image" value="${esc(r.image || '')}"`)}
      <div class="cfg-field float"><input type="file" accept="image/*" class="cfg-in" data-act="uploadRoomImg" data-i="${i}" style="padding-top:12px"><label>Eigenes Bild hochladen</label></div>
    </div>
    <div class="cfg-row">
      ${fld('Hintergrund Kamera (HA camera.* für App & Fernzugriff)', `list="ha-entities-list" data-r-i="${i}" data-r-k="camera" value="${esc(r.camera || '')}"`)}
      ${fld('Hintergrund go2rtc Stream-Name (für lokales LAN)', `data-r-i="${i}" data-r-k="webrtc" value="${esc(r.webrtc || '')}"`)}
    </div>
    <label style="margin-top:6px;display:block"><input type="checkbox" data-r-bool-i="${i}" data-r-bool-k="showLiveBadge" ${r.showLiveBadge !== false ? 'checked' : ''}> Rotes „● LIVE“-Badge anzeigen (bei Kamera-Hintergrund)</label>
    <div class="cfg-row" style="margin-top:8px;padding:8px 12px;background:rgba(255,255,255,.025);border-radius:10px;border:1px solid var(--line)">
      <label style="cursor:pointer"><input type="checkbox" data-r-bool-i="${i}" data-r-bool-k="dynamicMotion" ${r.dynamicMotion ? 'checked' : ''}> 🎯 Dynamischer Stream (Frigate / AI): Ruhemodus aktiv, Live-Stream nur bei Erkennung</label>
      ${r.dynamicMotion ? sel('Ruhezustand-Anzeige', [
        ['snapshot', '📷 Kamera-Standbild (aktualisiert sich periodisch)'],
        ['image', '🖼️ Eigenes Bild (Raum-Foto / Hintergrundbild)']
      ].map(([v, l]) => `<option value="${v}" ${(r.dynamicIdleMode || 'snapshot') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-r-i="${i}" data-r-k="dynamicIdleMode"`) : ''}
      ${r.dynamicMotion && r.dynamicIdleMode === 'image' ? fld('Eigenes Bild URL (leer = Raum-Hintergrundbild)', `data-r-i="${i}" data-r-k="dynamicImage" value="${esc(r.dynamicImage || '')}"`) : ''}
      ${r.dynamicMotion ? fld('Erkennungs-Entität (binary_sensor.*)', `list="ha-entities-list" data-r-i="${i}" data-r-k="motionEntity" value="${esc(r.motionEntity || '')}"`) : ''}
      ${r.dynamicMotion ? fld('Erkennungs-Text (z.B. Person erkannt, Hund Lucy)', `data-r-i="${i}" data-r-k="motionLabel" value="${esc(r.motionLabel || 'Erkennung')}"`) : ''}
    </div>

    <div style="margin-top:12px;padding-top:12px;border-top:1px dashed var(--line)">
      <span class="cfg-desc">Mini-Badges (z.B. °C, W, %) im Raum-Banner:</span>
      ${(r.chips || []).map((ch, ci) => `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px;margin-top:6px">
        ${sel('Icon', CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(ch.icon || 'thermo') === val ? 'selected' : ''}>${lab}</option>`).join(''), `data-chip-ri="${i}" data-chip-ci="${ci}" data-chip-k="icon"`)}
        ${fld('Entität', `list="ha-entities-list" data-chip-ri="${i}" data-chip-ci="${ci}" data-chip-k="entity" value="${esc(ch.entity || '')}"`)}
        ${fld('Attribut (optional)', `data-chip-ri="${i}" data-chip-ci="${ci}" data-chip-k="attr" value="${esc(ch.attr || '')}"`)}
        ${fld('Einheit', `data-chip-ri="${i}" data-chip-ci="${ci}" data-chip-k="unit" value="${esc(ch.unit || '')}"`)}
        ${sel('Farbe', CHIP_COLOR_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(ch.cls || '') === val ? 'selected' : ''}>${lab}</option>`).join(''), `data-chip-ri="${i}" data-chip-ci="${ci}" data-chip-k="cls"`)}
        <div class="order-btns"><button class="btn-move" data-act="cfgMoveChip" data-ri="${i}" data-ci="${ci}" data-dir="-1" ${ci === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMoveChip" data-ri="${i}" data-ci="${ci}" data-dir="1" ${ci === r.chips.length - 1 ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelChip" data-ri="${i}" data-ci="${ci}">✕</button></div>
      </div>`).join('')}
      <button class="iconbtn" data-act="cfgAddChip" data-ri="${i}" style="margin-top:6px">+ Badge hinzufügen</button>
    </div>

    <div style="margin-top:12px;padding-top:12px;border-top:1px dashed var(--line)">
      <span class="cfg-desc">Zusätzliche Kamera- / Vergrößerungs-Buttons unten rechts im Banner:</span>
      ${(r.camButtons || []).map((cb, bi) => `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px;margin-top:6px">
        ${fld('Button-Name', `data-cb-ri="${i}" data-cb-bi="${bi}" data-cb-k="name" value="${esc(cb.name || '')}"`)}
        ${sel('Icon', CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(cb.icon || 'expand') === val ? 'selected' : ''}>${lab}</option>`).join(''), `data-cb-ri="${i}" data-cb-bi="${bi}" data-cb-k="icon"`)}
        ${fld('go2rtc Stream (LAN)', `data-cb-ri="${i}" data-cb-bi="${bi}" data-cb-k="stream" value="${esc(cb.stream || '')}"`)}
        ${fld('HA Kamera (camera.* für App/Remote)', `list="ha-entities-list" data-cb-ri="${i}" data-cb-bi="${bi}" data-cb-k="entity" value="${esc(cb.entity || '')}"`)}
        <div class="order-btns"><button class="btn-danger" data-act="cfgDelCamBtn" data-ri="${i}" data-bi="${bi}">✕</button></div>
      </div>`).join('')}
      <button class="iconbtn" data-act="cfgAddCamBtn" data-ri="${i}" style="margin-top:6px">+ Kamera-Button hinzufügen</button>
    </div>
    `, i === 0, `<div class="order-btns">${i > 0 ? `<button type="button" class="iconbtn" style="padding:4px 9px;font-size:11px" data-act="cfgGenRoomPage" data-room="${esc(r.name)}" title="Für diesen Raum mit 1 Klick eine eigene Menü-Unterseite mit allen Raum-Widgets generieren">✨ Unterseite</button>` : ''}<span class="cfg-badge-info">${(cfgDraft.devices || []).filter(d => d.room === r.name).length} Geräte</span><button class="btn-move" data-act="cfgMoveRoom" data-i="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMoveRoom" data-i="${i}" data-dir="1" ${i === (cfgDraft.rooms.length - 1) ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelRoom" data-i="${i}">Löschen</button></div>`, `room_${i}`)).join('') + `<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn-pri" data-act="cfgAddRoom">+ Neuen Raum-Tab hinzufügen</button><button class="iconbtn" data-act="cfgGenRoomPage" data-room="__prompt__">✨ Neuen Raum direkt als Menü-Unterseite (z. B. Büro) generieren…</button></div>`;

  // ---------- TAB 4: GERÄTE, LICHT & ROLLÄDEN ----------
  const dTabs = cfgDraft.deviceTabs || [];
  const validFixedDevTabs = ['favorites', 'system', 'lichter', 'appliances', 'covers'];
  if (!validFixedDevTabs.includes(cfgDevSubTab) && !dTabs.some(t => t.id === cfgDevSubTab)) cfgDevSubTab = (dTabs[0] && dTabs[0].id) || 'geraete';

  let tGeraete = `<datalist id="cfg-room-names">${(cfgDraft.rooms || []).map(r => `<option value="${esc(r.name)}"></option>`).join('')}</datalist>
  <div class="cfg-subtabs">
    ${dTabs.map((t, ti) => `<div style="display:inline-flex;align-items:center;gap:3px">
      <button class="pill ${cfgDevSubTab === t.id ? 'on' : ''}" data-act="cfgDevTab" data-id="${esc(t.id)}">${t.id === 'covers' ? '🪟 ' : '🔌 '}${esc(t.name)}</button>
      ${dTabs.length > 2 ? `<button class="btn-move" data-act="cfgMoveDevTab" data-i="${ti}" data-dir="-1" ${ti === 0 ? 'disabled' : ''}>◀</button><button class="btn-move" data-act="cfgMoveDevTab" data-i="${ti}" data-dir="1" ${ti === dTabs.length - 1 ? 'disabled' : ''}>▶</button>` : ''}
    </div>`).join('')}
    <button class="pill ${cfgDevSubTab === 'lichter' ? 'on' : ''}" data-act="cfgDevTab" data-id="lichter">💡 Lichter-Gruppen</button>
    <button class="pill ${cfgDevSubTab === 'favorites' ? 'on' : ''}" data-act="cfgDevTab" data-id="favorites">⭐ Favoriten</button>
    <button class="pill ${cfgDevSubTab === 'appliances' ? 'on' : ''}" data-act="cfgDevTab" data-id="appliances">🧺 Haushaltsgeräte</button>
    <button class="pill ${cfgDevSubTab === 'system' ? 'on' : ''}" data-act="cfgDevTab" data-id="system">🖥️ Server &amp; Docker</button>
    <button class="iconbtn" data-act="cfgAddDevTab">+ Weiteren Geräte-Reiter erstellen</button>
  </div>`;

  if (cfgDevSubTab === 'favorites') {
    const favRows = (cfgDraft.favorites || []).map((f, i) => `<div style="background:rgba(255,255,255,.02);padding:10px;border-radius:10px;margin-bottom:8px;border:1px solid rgba(255,255,255,.05)">
      <div class="cfg-row">
        <label><input type="checkbox" data-fav-i="${i}" data-fav-k="show" ${f.show !== false ? 'checked' : ''}> Sichtbar</label>
        ${fld('Name / Bezeichnung', `data-fav-i="${i}" data-fav-k="name" value="${esc(f.name || '')}"`)}
        ${fld('Entität (Licht, Schalter, Rollo, Szene, Skript)', `list="ha-entities-list" data-fav-i="${i}" data-fav-k="entity" value="${esc(f.entity || '')}"`)}
        ${sel('Icon', `<option value="">Automatisch nach Typ</option>` + CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${f.icon === val ? 'selected' : ''}>${lab}</option>`).join(''), `data-fav-i="${i}" data-fav-k="icon"`)}
        <div class="order-btns"><button class="btn-move" data-act="cfgMoveFav" data-i="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMoveFav" data-i="${i}" data-dir="1" ${i === (cfgDraft.favorites || []).length - 1 ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelFav" data-i="${i}">✕</button></div>
      </div>
      ${itemShowOnPickerHtml(f, 'fav', i)}
    </div>`).join('');
    tGeraete += box('⭐ Schnellauswahl / Favoriten', 'Wähle deine meistgenutzten Rolläden, Lichter, Schalter, Szenen oder Skripte aus und bestimme per Klick, auf welchen Seiten sie erscheinen.', `
      ${placementBarHtml('favorites', 'favorites', 'Schnellauswahl')}
      ${favRows || '<div class="mut sm" style="margin-bottom:8px">Noch keine Favoriten hinzugefügt. Klicke unten auf „+ Favorit hinzufügen“.</div>'}
      <button class="iconbtn" data-act="cfgAddFav" style="margin-top:6px">+ Favorit hinzufügen</button>
    `, true, placementStatusBadgeHtml('favorites', 'favorites', `${(cfgDraft.favorites || []).length} Favoriten`), 'dev_favorites');
  } else if (cfgDevSubTab === 'system') {
    const sh = cfgDraft.systemHealth || {};
    const containersHtml = (sh.containers || []).map((ct, ci) => `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px;margin-bottom:6px">
      ${fld('Container-Name (z.B. n8n, Ollama, Frigate)', `data-ct-i="${ci}" data-ct-k="name" value="${esc(ct.name || '')}"`)}
      ${fld('Entität (switch.*, sensor.*, binary_sensor.*)', `list="ha-entities-list" data-ct-i="${ci}" data-ct-k="entity" value="${esc(ct.entity || '')}"`)}
      <div class="order-btns"><button class="btn-move" data-act="cfgMoveContainer" data-i="${ci}" data-dir="-1" ${ci === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMoveContainer" data-i="${ci}" data-dir="1" ${ci === (sh.containers || []).length - 1 ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelContainer" data-i="${ci}">✕</button></div>
    </div>`).join('');

    tGeraete += box('🖥️ System-Health (Unraid, Docker & Server)', 'Kompakte Überwachung von CPU-, RAM-, Disk- und Temperatur-Sensoren sowie kritischen Docker-Containern.', `
      ${placementBarHtml('system_health', 'system_health', sh.title || 'Server & Docker')}
      <div class="cfg-row" style="margin-bottom:10px">
        ${fld('Kachel-Titel', `data-cpath="systemHealth.title" value="${esc(sh.title || 'Server & Docker')}"`)}
      </div>
      <div class="cfg-row">
        ${fld('CPU-Auslastung Sensor (%)', `list="ha-entities-list" data-cpath="systemHealth.cpu" value="${esc(sh.cpu || '')}"`)}
        ${fld('RAM-Auslastung Sensor (%)', `list="ha-entities-list" data-cpath="systemHealth.ram" value="${esc(sh.ram || '')}"`)}
        ${fld('Festplatten-Auslastung Sensor (%)', `list="ha-entities-list" data-cpath="systemHealth.disk" value="${esc(sh.disk || '')}"`)}
        ${fld('CPU-Temperatur Sensor (°C)', `list="ha-entities-list" data-cpath="systemHealth.temp" value="${esc(sh.temp || '')}"`)}
      </div>
      <div style="margin-top:12px;padding-top:12px;border-top:1px dashed var(--line)">
        <span class="cfg-desc">Kritische Docker-Container / Dienste überwachen (z. B. n8n, Ollama, Frigate, Plex):</span>
        ${containersHtml || '<div class="mut sm" style="margin-bottom:8px">Noch keine Container hinterlegt. Klicke unten auf „+ Container hinzufügen“.</div>'}
        <button class="iconbtn" data-act="cfgAddContainer" style="margin-top:6px">+ Container hinzufügen</button>
      </div>
    `, true, placementStatusBadgeHtml('system_health', 'system_health'), 'dev_system_health');
  } else if (cfgDevSubTab === 'appliances') {
    const apps = cfgDraft.appliances || { show: false, title: 'Haushaltsgeräte', items: [] };
    const itemsHtml = (apps.items || []).map((a, i) => `<div style="background:rgba(255,255,255,.02);padding:10px;border-radius:10px;margin-bottom:8px;border:1px solid rgba(255,255,255,.05)">
      <div class="cfg-row">
        ${fld('Name (z.B. Waschmaschine)', `data-ap-i="${i}" data-ap-k="name" value="${esc(a.name || '')}"`)}
        ${sel('Icon', CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(a.icon || 'washing') === val ? 'selected' : ''}>${lab}</option>`).join(''), `data-ap-i="${i}" data-ap-k="icon"`)}
        ${fld('Status-Sensor', `list="ha-entities-list" data-ap-i="${i}" data-ap-k="stateEntity" value="${esc(a.stateEntity || '')}"`)}
        ${fld('Programm-Sensor', `list="ha-entities-list" data-ap-i="${i}" data-ap-k="progEntity" value="${esc(a.progEntity || '')}"`)}
        ${fld('Restzeit-Sensor', `list="ha-entities-list" data-ap-i="${i}" data-ap-k="remainEntity" value="${esc(a.remainEntity || '')}"`)}
        ${fld('Leistungs-Sensor (W)', `list="ha-entities-list" data-ap-i="${i}" data-ap-k="powerEntity" value="${esc(a.powerEntity || '')}"`)}
        <div class="order-btns"><button class="btn-move" data-act="cfgMoveAppliance" data-i="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMoveAppliance" data-i="${i}" data-dir="1" ${i === (apps.items || []).length - 1 ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelAppliance" data-i="${i}">✕</button></div>
      </div>
      ${itemShowOnPickerHtml(a, 'app', i)}
    </div>`).join('');

    tGeraete += box('🧺 Haushaltsgeräte-Monitor', 'Überwachung von Waschmaschine, Trockner oder Spülmaschine mit Restlaufzeit und individueller Seiten-Zuordnung.', `
      ${placementBarHtml('appliances', 'appliances', apps.title || 'Haushaltsgeräte')}
      <div class="cfg-row" style="margin-bottom:10px">
        ${fld('Kachel-Titel', `data-cpath="appliances.title" value="${esc(apps.title || 'Haushaltsgeräte')}"`)}
      </div>
      <div style="margin-top:12px;padding-top:12px;border-top:1px dashed var(--line)">
        ${itemsHtml || '<div class="mut sm" style="margin-bottom:8px">Noch keine Geräte hinterlegt.</div>'}
        <button class="iconbtn" data-act="cfgAddAppliance" style="margin-top:6px">+ Haushaltsgerät hinzufügen</button>
      </div>
    `, true, placementStatusBadgeHtml('appliances', 'appliances', `${(apps.items || []).length} Geräte`), 'dev_appliances');
  } else if (cfgDevSubTab === 'covers') {
    const covs = (cfgDraft.covers || []).map((c, i) => `<div style="background:rgba(255,255,255,.02);padding:10px;border-radius:10px;margin-bottom:8px;border:1px solid rgba(255,255,255,.05)">
        <div class="cfg-row">
          ${fld('Rolladen Name', `data-cv-i="${i}" data-cv-k="name" value="${esc(c.name)}"`)}
          ${fld('Entität (cover.*)', `list="ha-entities-list" data-cv-i="${i}" data-cv-k="entity" value="${esc(c.entity)}"`)}
          <div class="order-btns"><button class="btn-move" data-act="cfgMoveCov" data-i="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMoveCov" data-i="${i}" data-dir="1" ${i === cfgDraft.covers.length - 1 ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelCov" data-i="${i}">✕</button></div>
        </div>
        ${itemShowOnPickerHtml(c, 'cov', i)}
      </div>`).join('');
    tGeraete += box('🪟 Rolläden-Steuerung', 'Bestimme für jeden einzelnen Rolladen per Klick, auf welchen Seiten und Raum-Tabs er sichtbar sein soll (z. B. Küchenrolladen nur in Küche/Home, Bürorolladen nur im Büro).', `
      ${placementBarHtml('covers', 'covers', 'Rolläden')}
      ${covs}
      <button class="iconbtn" data-act="cfgAddCov" style="margin-top:8px">+ Rolladen hinzufügen</button>
    `, true, placementStatusBadgeHtml('covers', 'covers', `${(cfgDraft.covers || []).length} Rolläden`), 'dev_covers');
  } else if (cfgDevSubTab === 'lichter') {
    const lm = cfgDraft.lightsMain || { mode: 'group', group: 0, entities: [] };
    const lmGroupOpts = (cfgDraft.lights || []).map((g, idx) => `<option value="${idx}" ${lm.group == idx ? 'selected' : ''}>${esc(g.name)}</option>`).join('');
    const lightsHtml = (cfgDraft.lights || []).map((g, i) => box(`💡 Gruppe: ${esc(g.name)} (${(g.entities || []).length} Lampen) · 📍 ${esc(formatItemShowOnSummary(g, cfgDraft))}`, 'Lampen per Klick auswählen und unten festlegen, auf welchen Seiten/Räumen diese Licht-Gruppe angezeigt wird.', `
      <div class="cfg-row">
        ${fld('Gruppen-Name', `data-l-i="${i}" data-l-k="name" value="${esc(g.name)}"`)}
        <label><input type="checkbox" data-l-i="${i}" data-l-k="mainSync" ${g.mainSync !== false ? 'checked' : ''}> Im „Alle Lichter“-Hauptschalter berücksichtigen</label>
      </div>
      ${itemShowOnPickerHtml(g, 'light', i)}
      <div style="margin-top:10px">
        <span class="cfg-desc">Zugeordnete Lampen / Schalter <small class="mut">(Klick auf <b>💡 Gruppe</b> / <b>⚡ Haupt</b> schließt einzelne Lampen vom Gruppen- bzw. Hauptschalter aus)</small>:</span>
        ${entityChipsHtml(g.entities || [], 'lightGrp', i, 'light.* oder switch.* auswählen…')}
      </div>`, i === 0, `<div class="order-btns"><button class="btn-move" data-act="cfgMoveLight" data-i="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMoveLight" data-i="${i}" data-dir="1" ${i === cfgDraft.lights.length - 1 ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelLight" data-i="${i}">Löschen</button></div>`, `dev_light_${i}`)).join('');

    tGeraete += box('💡 Lichter-Karte & Hauptschalter', 'Platzierung der Lichter-Kachel und Verhalten des Master-Hauptschalters oben rechts (der Hauptschalter schaltet auf Raum-Seiten automatisch nur die dort sichtbaren Lichter!).', `
      ${placementBarHtml('lights', 'lights', 'Lichter')}
      <div class="cfg-row">
        ${sel('Hauptschalter-Modus', `<option value="all" ${lm.mode === 'all' ? 'selected' : ''}>Alle auf der aktuellen Seite sichtbaren &amp; synchronisierten Gruppen steuern</option><option value="group" ${lm.mode === 'group' ? 'selected' : ''}>Eine bestimmte Gruppe steuern</option><option value="custom" ${lm.mode === 'custom' ? 'selected' : ''}>Eigene Entitäten-Auswahl steuern</option>`, `data-lm-k="mode"`)}
        ${lm.mode === 'group' ? sel('Welche Gruppe?', lmGroupOpts, `data-lm-k="group"`) : ''}
      </div>
      ${lm.mode === 'custom' ? `<div style="margin-top:8px"><span class="cfg-desc">Eigene Hauptschalter-Entitäten:</span>${entityChipsHtml(lm.entities || [], 'lightsMain', '', 'light.* oder switch.* auswählen…')}</div>` : ''}`, true, placementStatusBadgeHtml('lights', 'lights', `${(cfgDraft.lights || []).length} Gruppen`), 'dev_lights_master') + lightsHtml + `<button class="btn-pri" data-act="cfgAddLight" style="margin-top:10px">+ Neue Licht-Gruppe</button>`;
  } else {
    const activeTabObj = dTabs.find(t => t.id === cfgDevSubTab) || dTabs[0] || { id: 'geraete', name: 'Geräte' };
    const isMainDevTab = activeTabObj.id === 'geraete';
    const cardIdForTab = isMainDevTab ? 'devices' : 'extra_tabs';
    const tabIndices = (cfgDraft.devices || []).map((d, idx) => ((d.tab || 'geraete') === activeTabObj.id ? idx : -1)).filter(idx => idx !== -1);
    const devRows = tabIndices.map((idx, pos) => {
      const d = cfgDraft.devices[idx];
      return `<div style="background:rgba(255,255,255,.02);padding:10px;border-radius:10px;margin-bottom:8px;border:1px solid rgba(255,255,255,.05)">
        <div class="cfg-row">
          ${fld('Name', `data-d-i="${idx}" data-d-k="name" value="${esc(d.name || '')}"`)}
          ${sel('Icon', `<option value="">Automatisch</option>` + CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${d.icon === val ? 'selected' : ''}>${lab}</option>`).join(''), `data-d-i="${idx}" data-d-k="icon"`)}
          ${fld('Haupt-Entität', `list="ha-entities-list" data-d-i="${idx}" data-d-k="entity" value="${esc(d.entity || '')}"`)}
          ${fld('Leistungs-Sensor (W)', `list="ha-entities-list" data-d-i="${idx}" data-d-k="power" value="${esc(d.power || '')}"`)}
          ${fld('Energie-Sensor (kWh)', `list="ha-entities-list" data-d-i="${idx}" data-d-k="energy" value="${esc(d.energy || '')}"`)}
          <div class="order-btns"><button class="btn-move" data-act="cfgMoveDevInTab" data-tab="${esc(activeTabObj.id)}" data-pos="${pos}" data-dir="-1" ${pos === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMoveDevInTab" data-tab="${esc(activeTabObj.id)}" data-pos="${pos}" data-dir="1" ${pos === tabIndices.length - 1 ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelDev" data-i="${idx}">✕</button></div>
        </div>
        ${itemShowOnPickerHtml(d, 'dev', idx)}
      </div>`;
    }).join('');

    tGeraete += box(`🔌 Reiter: ${esc(activeTabObj.name)}`, 'Wähle für jedes Gerät per Klick aus, in welchen Raum-Tabs (z. B. Home, Büro, Wohnzimmer) und auf welchen eigenen Unterseiten es angezeigt werden soll.', `
      ${placementBarHtml(cardIdForTab, 'devices', activeTabObj.name)}
      <div class="cfg-row" style="margin-bottom:12px">
        ${fld('Reiter-Name ändern', `data-devtab-name="${esc(activeTabObj.id)}" value="${esc(activeTabObj.name)}"`)}
        ${activeTabObj.id !== 'geraete' ? `<button class="btn-danger" data-act="cfgDelDevTab" data-id="${esc(activeTabObj.id)}">Diesen Reiter komplett löschen</button>` : ''}
      </div>
      ${devRows || '<div class="mut sm">Keine Geräte in diesem Reiter.</div>'}
      <button class="iconbtn" data-act="cfgAddDev" data-tab="${esc(activeTabObj.id)}" style="margin-top:8px">+ Gerät hinzufügen</button>
    `, true, placementStatusBadgeHtml(cardIdForTab, 'devices', `${tabIndices.length} Geräte`), `devtab_${activeTabObj.id}`);
  }

  // ---------- TAB 5: KLIMA, WETTER & LÜFTUNG ----------
  const vnt = cfgDraft.ventilation || {};
  let tKlima = box('☀️ Wetter-Kachel, 7-Tage-Vorhersage & Regenradar', 'Steuert die kombinierte Raumklima-/Wetter-Kachel, das 7-Tage-Vorhersage-Popup und die 60-Minuten-Regenvorschau.', `
    ${placementBarHtml('climate', 'climate', w.title || 'Raumklima & Wetter')}
    <div class="cfg-row" style="margin-bottom:8px">
      <label><input type="checkbox" data-cbool="weather.showCard" ${w.showCard !== false ? 'checked' : ''}> Wetter-Teil in der Raumklima-Kachel einblenden</label>
      <label><input type="checkbox" data-cbool="weather.showForecast" ${w.showForecast ? 'checked' : ''}> 7-Tage-Vorhersage (bei Klick auf Wetter) aktivieren</label>
    </div>
    <div class="cfg-row">
      ${fld('Kachel-Titel', `data-cpath="weather.title" value="${esc(w.title || 'Wetter')}"`)}
      ${fld('Ort / Zusatz (z.B. Berlin)', `data-cpath="weather.label" value="${esc(w.label || '')}"`)}
      ${fld('Haupt-Wetter (weather.*)', `list="ha-entities-list" data-cpath="weather.entity" value="${esc(w.entity || '')}"`)}
      ${fld('Eigene Temp.-Entität', `list="ha-entities-list" data-cpath="weather.tempEntity" value="${esc(w.tempEntity || '')}"`)}
      ${fld('Vorhersage-Entität', `list="ha-entities-list" data-cpath="weather.forecastEntity" value="${esc(w.forecastEntity || '')}"`)}
      ${fld('Eigener Regen-/DWD-Sensor (optional)', `list="ha-entities-list" data-cpath="weather.rainEntity" value="${esc(w.rainEntity || '')}"`)}
    </div>
    <div style="margin-top:8px">
      <span class="cfg-desc" style="margin-bottom:8px">Zusätzliche Detail-Werte (z.B. Luftfeuchte, Wind) in der Wetter-Kachel:</span>
      ${(w.items || []).map((it, wi) => `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px;margin-bottom:4px">
        ${fld('Bezeichnung', `data-wi-i="${wi}" data-wi-k="label" value="${esc(it.label || '')}"`)}
        ${fld('Entität (leer = Wetter-Attr.)', `list="ha-entities-list" data-wi-i="${wi}" data-wi-k="entity" value="${esc(it.entity || '')}"`)}
        ${fld('Attribut (z.B. wind_speed)', `data-wi-i="${wi}" data-wi-k="attr" value="${esc(it.attr || '')}"`)}
        ${fld('Einheit', `data-wi-i="${wi}" data-wi-k="unit" value="${esc(it.unit || '')}"`)}
        ${sel('Icon', CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(it.icon || 'drop') === val ? 'selected' : ''}>${lab}</option>`).join(''), `data-wi-i="${wi}" data-wi-k="icon"`)}
        <div class="order-btns"><button class="btn-danger" data-act="cfgDelWItem" data-i="${wi}">✕</button></div>
      </div>`).join('')}
      <button class="iconbtn" data-act="cfgAddWItem" style="margin-top:6px">+ Detailwert hinzufügen</button>
    </div>
    <div style="margin-top:14px;padding-top:12px;border-top:1px dashed var(--line)">
      <span class="cfg-desc" style="font-weight:600;margin-bottom:6px;display:block">🌧️ Eigenständige 60-Minuten Regenradar-Kachel:</span>
      ${placementBarHtml('rain_timeline', 'rain_timeline', 'Regenradar')}
    </div>`, true, placementStatusBadgeHtml('climate', 'weather_forecast'), 'allgemein_weather') +
    box('🌡️ Globale Klima-Kacheln (unter dem Temperatur-Bogen)', 'Diese Mini-Kacheln erscheinen unter dem Temperatur-Drehregler in der Raumklima-Kachel.', climateTilesEditorHtml('g'), false, `<span class="cfg-badge-info">${((cfgDraft.climate && cfgDraft.climate.tiles) || []).length} Kacheln</span>`, 'klima_global') +
    box('🌬️ Smarte Lüftungsempfehlung & Fenster-Timer', 'Berechnet die absolute Feuchte (g/m³) innen vs. außen und warnt bei zu lange geöffneten Fenstern/Türen.', `
      ${placementBarHtml('ventilation', 'ventilation', 'Smarte Lüftungsempfehlung')}
      <div class="cfg-row" style="margin-bottom:10px">
        <label><input type="checkbox" data-cbool="ventilation.showOpenTimer" ${vnt.showOpenTimer !== false ? 'checked' : ''}> ⏱️ Fenster- &amp; Tür-Offen-Timer in der Kachel anzeigen</label>
      </div>
      <div class="cfg-row">
        ${fld('Außentemperatur-Sensor (°C)', `list="ha-entities-list" data-cpath="ventilation.outdoorTemp" value="${esc(vnt.outdoorTemp || '')}"`)}
        ${fld('Außenluftfeuchte-Sensor (%)', `list="ha-entities-list" data-cpath="ventilation.outdoorHum" value="${esc(vnt.outdoorHum || '')}"`)}
        ${fld('Auskühlungswarnung nach (Minuten)', `type="number" min="1" max="120" data-cpath="ventilation.openWarnMinutes" value="${vnt.openWarnMinutes || 10}"`)}
        ${fld('Auskühlungs-Schwelle Außentemp (°C)', `type="number" step="0.5" data-cpath="ventilation.warnOutdoorTempThreshold" value="${vnt.warnOutdoorTempThreshold != null ? vnt.warnOutdoorTempThreshold : 12}"`)}
      </div>
      <div style="margin-top:12px;padding-top:12px;border-top:1px dashed var(--line)">
        <span class="cfg-desc">Räume für die Lüftungsberechnung:</span>
        ${(vnt.rooms || []).map((vr, vi) => `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px;margin-bottom:6px">
          ${fld('Raum-Name', `list="cfg-room-names" data-vr-i="${vi}" data-vr-k="name" value="${esc(vr.name || '')}"`)}
          ${fld('Raumtemperatur (°C)', `list="ha-entities-list" data-vr-i="${vi}" data-vr-k="temp" value="${esc(vr.temp || '')}"`)}
          ${fld('Raumluftfeuchte (%)', `list="ha-entities-list" data-vr-i="${vi}" data-vr-k="hum" value="${esc(vr.hum || '')}"`)}
          <div class="order-btns"><button class="btn-move" data-act="cfgMoveVentRoom" data-i="${vi}" data-dir="-1" ${vi === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMoveVentRoom" data-i="${vi}" data-dir="1" ${vi === (vnt.rooms || []).length - 1 ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelVentRoom" data-i="${vi}">✕</button></div>
        </div>`).join('')}
        <button class="iconbtn" data-act="cfgAddVentRoom" style="margin-top:6px">+ Raum hinzufügen</button>
      </div>
    `, false, placementStatusBadgeHtml('ventilation', 'ventilation', `${(vnt.rooms || []).length} Räume`), 'klima_ventilation') +
    (cfgDraft.climateRooms || []).map((cr, i) => {
      const helperItems = (cr.settings && cr.settings.groups && cr.settings.groups[0] && cr.settings.groups[0].items) || [];
      return box(`🏠 Klima-Raum #${i + 1}: ${esc(cr.name)}`, 'Raumkarte auf der Klima-Unterseite (und als Widget „Klima-Raumkarte“ auch auf eigenen Unterseiten wie Büro einbindbar).', `
      <div class="cfg-row">
        <label><input type="checkbox" data-cr-i="${i}" data-cr-k="show" ${cr.show !== false ? 'checked' : ''}> Raum auf Klima-Seite anzeigen</label>
        ${fld('Raumname', `data-cr-i="${i}" data-cr-k="name" value="${esc(cr.name)}"`)}
        ${sel('Icon', CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(cr.icon || 'home') === val ? 'selected' : ''}>${lab}</option>`).join(''), `data-cr-i="${i}" data-cr-k="icon"`)}
        ${fld('Boost-Schalter (optional)', `list="ha-entities-list" data-cr-i="${i}" data-cr-k="boost" value="${esc(cr.boost ? cr.boost.entity : '')}"`)}
      </div>

      <div style="margin-top:10px;padding-top:10px;border-top:1px dashed var(--line)">
        <span class="cfg-desc">Klima-Geräte (Thermostate / Klimaanlagen in diesem Raum):</span>
        ${(cr.devices || []).map((dv, di) => `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px;margin-top:6px">
          ${fld('Bezeichnung', `data-crd-ri="${i}" data-crd-di="${di}" data-crd-k="name" value="${esc(dv.name || '')}"`)}
          ${fld('Klima-Entität (climate.*)', `list="ha-entities-list" data-crd-ri="${i}" data-crd-di="${di}" data-crd-k="entity" value="${esc(dv.entity || '')}"`)}
          ${sel('Icon', CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(dv.icon || 'radiator') === val ? 'selected' : ''}>${lab}</option>`).join(''), `data-crd-ri="${i}" data-crd-di="${di}" data-crd-k="icon"`)}
          <label><input type="checkbox" data-crd-ri="${i}" data-crd-di="${di}" data-crd-k="toggle" ${dv.toggle ? 'checked' : ''}> Ein/Aus-Schalter</label>
          <label><input type="checkbox" data-crd-ri="${i}" data-crd-di="${di}" data-crd-k="readonly" ${dv.readonly ? 'checked' : ''}> Nur lesen</label>
          <button class="btn-danger" data-act="cfgDelCRDev" data-ri="${i}" data-di="${di}">✕</button>
        </div>`).join('')}
        <button class="iconbtn" data-act="cfgAddCRDev" data-ri="${i}" style="margin-top:6px">+ Thermostat / Klimagerät hinzufügen</button>
      </div>

      <div style="margin-top:10px;padding-top:10px;border-top:1px dashed var(--line)">
        <span class="cfg-desc">Sensor-Chips oben in der Raumkarte (z.B. Ist-Temperatur, Luftfeuchte):</span>
        ${(cr.sensors || []).map((sn, si) => `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px;margin-top:6px">
          ${sel('Icon', CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(sn.icon || 'thermo') === val ? 'selected' : ''}>${lab}</option>`).join(''), `data-crs-ri="${i}" data-crs-si="${si}" data-crs-k="icon"`)}
          ${fld('Entität', `list="ha-entities-list" data-crs-ri="${i}" data-crs-si="${si}" data-crs-k="entity" value="${esc(sn.entity || '')}"`)}
          ${fld('Attribut (optional)', `data-crs-ri="${i}" data-crs-si="${si}" data-crs-k="attr" value="${esc(sn.attr || '')}"`)}
          ${fld('Einheit', `data-crs-ri="${i}" data-crs-si="${si}" data-crs-k="unit" value="${esc(sn.unit || '')}"`)}
          <button class="btn-danger" data-act="cfgDelCRSens" data-ri="${i}" data-si="${si}">✕</button>
        </div>`).join('')}
        <button class="iconbtn" data-act="cfgAddCRSens" data-ri="${i}" style="margin-top:6px">+ Raum-Sensor hinzufügen</button>
      </div>

      <div style="margin-top:10px;padding-top:10px;border-top:1px dashed var(--line)">
        <span class="cfg-desc">24h-Verlaufsdiagramme in der Raumkarte:</span>
        ${(cr.charts || []).map((ch, chi) => `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px;margin-top:6px">
          ${fld('Diagramm-Titel', `data-crc-ri="${i}" data-crc-ci="${chi}" data-crc-k="title" value="${esc(ch.title || '')}"`)}
          ${fld('Entität', `list="ha-entities-list" data-crc-ri="${i}" data-crc-ci="${chi}" data-crc-k="entity" value="${esc(ch.entity || '')}"`)}
          ${fld('Attribut (optional)', `data-crc-ri="${i}" data-crc-ci="${chi}" data-crc-k="attr" value="${esc(ch.attr || '')}"`)}
          <button class="btn-danger" data-act="cfgDelCRChart" data-ri="${i}" data-ci="${chi}">✕</button>
        </div>`).join('')}
        <button class="iconbtn" data-act="cfgAddCRChart" data-ri="${i}" style="margin-top:6px">+ 24h-Diagramm hinzufügen</button>
      </div>

      <div style="margin-top:10px;padding-top:10px;border-top:1px dashed var(--line)">
        <span class="cfg-desc">Einstellungs-Popup Helfer (z.B. Zeitpläne, Offsets, Automatisierungen):</span>
        ${helperItems.map((hi, hii) => `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px;margin-top:6px">
          ${fld('Anzeigename', `data-crh-ri="${i}" data-crh-hi="${hii}" data-crh-k="name" value="${esc(hi.name || '')}"`)}
          ${fld('Helfer-Entität (input_*, switch.*, number.*)', `list="ha-entities-list" data-crh-ri="${i}" data-crh-hi="${hii}" data-crh-k="entity" value="${esc(hi.entity || '')}"`)}
          <button class="btn-danger" data-act="cfgDelCRHelper" data-ri="${i}" data-hi="${hii}">✕</button>
        </div>`).join('')}
        <button class="iconbtn" data-act="cfgAddCRHelper" data-ri="${i}" style="margin-top:6px">+ Einstellungs-Helfer hinzufügen</button>
      </div>
      `, false, `<div class="order-btns"><span class="cfg-badge-${cr.show !== false ? 'on' : 'off'}">${cr.show !== false ? '🟢 Klima-Seite' : '⚪ Aus'}</span><button class="btn-move" data-act="cfgMoveCRoom" data-i="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMoveCRoom" data-i="${i}" data-dir="1" ${i === cfgDraft.climateRooms.length - 1 ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelCRoom" data-i="${i}">Löschen</button></div>`, `climate_room_${i}`);
    }).join('') +
    `<button class="btn-pri" data-act="cfgAddCRoom" style="align-self:flex-start">+ Klima-Raum hinzufügen</button>`;

  // ---------- TAB 6: ENERGIE, PV & WALLBOX ----------
  let tEnergie = box('⚡ Platzierung der Energie- & Verbrauchs-Metriken', 'Wo sollen deine Metrik-Kacheln (Strom, PV, Wasser, Gas) im Dashboard und auf Unterseiten erscheinen?', `
    ${placementBarHtml('metrics', 'metrics', 'Metriken')}
  `, true, placementStatusBadgeHtml('metrics', 'metrics', `${(cfgDraft.metrics || []).length} Metriken`), 'energie_metrics_place') +
  (cfgDraft.metrics || []).map((m, mi) => box(`📊 Metrik #${mi + 1}: ${esc(m.title || 'Neu')}`, 'Konfiguriere Tageswert, 24h-Kurve, Vortagesvergleich, Autarkiegrad und Detail-Popups.', `
    <div class="cfg-row" style="background:rgba(255,255,255,.025);padding:10px 12px;border-radius:10px;border:1px solid var(--line);margin-bottom:10px">
      <label style="font-weight:600;cursor:pointer"><input type="checkbox" data-m-bool-i="${mi}" data-m-bool-k="show" ${m.show !== false ? 'checked' : ''}> Diese Metrik aktivieren</label>
      <label><input type="checkbox" data-m-bool-i="${mi}" data-m-bool-k="showChart" ${m.showChart !== false ? 'checked' : ''}> 24h-Diagramm (Sparkline)</label>
      <label><input type="checkbox" data-m-bool-i="${mi}" data-m-bool-k="showCompare" ${m.showCompare !== false ? 'checked' : ''}> Gestern-Vergleich / Trend</label>
      <label><input type="checkbox" data-m-bool-i="${mi}" data-m-bool-k="showSubButtons" ${m.showSubButtons !== false ? 'checked' : ''}> Popup-Unterbuttons</label>
      <label><input type="checkbox" data-m-bool-i="${mi}" data-m-bool-k="showLive" ${m.showLive !== false ? 'checked' : ''}> Aktueller Live-Wert</label>
      <label><input type="checkbox" data-m-bool-i="${mi}" data-m-bool-k="showAutarky" ${m.showAutarky ? 'checked' : ''}> ☀️ Autarkiegrad in Kopfzeile</label>
    </div>
    <div class="cfg-row" style="margin-top:6px;padding:8px 12px;background:rgba(255,255,255,.02);border-radius:8px;border:1px solid var(--line);${m.showAutarky ? '' : 'display:none'}">
      ${sel('Berechnung', [['day', 'Tageswert (00:00 bis jetzt)'], ['live', 'Live (aktuelle Leistung)']].map(([v, l]) => `<option value="${v}" ${(m.autarkyMode || 'day') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-m-i="${mi}" data-m-k="autarkyMode"`)}
      ${fld('Autarkiegrad-Sensor (optional, überschreibt die Berechnung)', `list="ha-entities-list" data-m-i="${mi}" data-m-k="autarkyEntity" value="${esc(m.autarkyEntity || '')}"`)}
      ${fld('Netzbezug-Sensor (W/kW oder kWh) (für automatische Berechnung)', `list="ha-entities-list" data-m-i="${mi}" data-m-k="gridImportEntity" value="${esc(m.gridImportEntity || '')}"`)}
      ${fld('PV-Ertrag / Erzeugung-Sensor (für Berechnung)', `list="ha-entities-list" data-m-i="${mi}" data-m-k="pvEntity" value="${esc(m.pvEntity || '')}"`)}
    </div>
    <div class="cfg-row">
      ${fld('Titel', `data-m-i="${mi}" data-m-k="title" value="${esc(m.title || '')}"`)}
      ${fld('Haupt-Entität (Tageswert)', `list="ha-entities-list" data-m-i="${mi}" data-m-k="entity" value="${esc(m.entity || '')}"`)}
      ${fld('Einheit (z.B. kWh)', `data-m-i="${mi}" data-m-k="unit" value="${esc(m.unit || '')}"`)}
      ${fld('Vortages-Entität (optional, nur bei „Ganzer Vortag“)', `list="ha-entities-list" data-m-i="${mi}" data-m-k="yesterdayEntity" value="${esc(m.yesterdayEntity || '')}"`)}
    </div>
    <div class="cfg-row">
      ${sel('Vergleich mit gestern', [['sameTime', 'Bis zur gleichen Uhrzeit (Verbrauch bis jetzt)'], ['fullDay', 'Ganzer Vortag'], ['rolling', 'Wert vor 24 h (gleitend)']].map(([v, l]) => `<option value="${v}" ${(m.cmpPeriod || 'sameTime') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-m-i="${mi}" data-m-k="cmpPeriod"`)}
      ${sel('Datenquelle des Vergleichs', [['auto', 'Automatisch (W/kW = Leistung, sonst Zähler)'], ['counter', 'Zähler / Tageswert (kWh, m³ …)'], ['power', 'Leistung (W/kW) → in kWh umrechnen']].map(([v, l]) => `<option value="${v}" ${(m.cmpSource || 'auto') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-m-i="${mi}" data-m-k="cmpSource"`)}
      ${sel('Anzeige', [['percent', '% (z.B. 8% mehr als gestern)'], ['absolute', 'Absolut (z.B. +0,6 kWh mehr als gestern)'], ['both', 'Beides']].map(([v, l]) => `<option value="${v}" ${(m.cmpDisplay || 'percent') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-m-i="${mi}" data-m-k="cmpDisplay"`)}
      ${fld('Vergleichs-Entität (optional, sonst Haupt-Entität)', `list="ha-entities-list" data-m-i="${mi}" data-m-k="cmpEntity" value="${esc(m.cmpEntity || '')}"`)}
    </div>
    <div class="cfg-row">
      ${fld('Live-Entität (für 24h-Chart)', `list="ha-entities-list" data-m-i="${mi}" data-m-k="chart" value="${esc(m.chart || '')}"`)}
      ${sel('Modus', `<option value="avg" ${(m.mode || 'avg') === 'avg' ? 'selected' : ''}>Durchschnitt</option><option value="last" ${m.mode === 'last' ? 'selected' : ''}>Letzter Wert</option>`, `data-m-i="${mi}" data-m-k="mode"`)}
      ${fld('Live-Einheit (z.B. W)', `data-m-i="${mi}" data-m-k="chartUnit" value="${esc(m.chartUnit || '')}"`)}
    </div>
    <div style="margin-top:10px;padding-top:10px;border-top:1px dashed var(--line)">
      <span class="cfg-desc">Popup-Unterbuttons (z.B. Solar / Akku / Netz) – komplett visuell ohne Textcodes:</span>
      ${(m.subButtons || []).map((sb, sbi) => `<div style="background:rgba(255,255,255,.025);padding:10px;border-radius:10px;border:1px solid var(--line);margin-top:8px">
        <div class="cfg-row">
          ${fld('Button-Name', `data-sb-mi="${mi}" data-sb-i="${sbi}" data-sb-k="name" value="${esc(sb.name || '')}"`)}
          ${sel('Icon', CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(sb.icon || 'bolt') === val ? 'selected' : ''}>${lab}</option>`).join(''), `data-sb-mi="${mi}" data-sb-i="${sbi}" data-sb-k="icon"`)}
          ${sel('Farbe', [['warn', 'Gelb / Solar'], ['ok', 'Grün / Akku'], ['cool', 'Blau / Netz'], ['acc2', 'Lila']].map(([v, l]) => `<option value="${v}" ${sb.color === v ? 'selected' : ''}>${l}</option>`).join(''), `data-sb-mi="${mi}" data-sb-i="${sbi}" data-sb-k="color"`)}
          <button class="btn-danger" data-act="cfgDelSubBtn" data-mi="${mi}" data-sbi="${sbi}">Button löschen</button>
        </div>
        <div style="margin-top:8px">
          <span class="cfg-desc">Entitäten in diesem Popup:</span>
          ${(sb.entities || []).map((se, sei) => `<div class="cfg-row" style="margin-top:4px">
            ${fld('Anzeigename', `data-sbe-mi="${mi}" data-sbe-sbi="${sbi}" data-sbe-ei="${sei}" data-sbe-k="name" value="${esc(se.name || '')}"`)}
            ${fld('Entität', `list="ha-entities-list" data-sbe-mi="${mi}" data-sbe-sbi="${sbi}" data-sbe-ei="${sei}" data-sbe-k="entity" value="${esc(se.entity || '')}"`)}
            ${fld('Einheit', `data-sbe-mi="${mi}" data-sbe-sbi="${sbi}" data-sbe-ei="${sei}" data-sbe-k="unit" value="${esc(se.unit || 'W')}"`)}
            <label><input type="checkbox" data-sbe-mi="${mi}" data-sbe-sbi="${sbi}" data-sbe-ei="${sei}" data-sbe-k="chart" ${se.chart !== false ? 'checked' : ''}> 24h-Kurve</label>
            <button class="btn-danger" data-act="cfgDelSubBtnEnt" data-mi="${mi}" data-sbi="${sbi}" data-ei="${sei}">✕</button>
          </div>`).join('')}
          <button class="iconbtn" data-act="cfgAddSubBtnEnt" data-mi="${mi}" data-sbi="${sbi}" style="margin-top:6px">+ Entitäts-Zeile hinzufügen</button>
        </div>
      </div>`).join('')}
      <button class="iconbtn" data-act="cfgAddSubBtn" data-mi="${mi}" style="margin-top:8px">+ Popup-Button hinzufügen</button>
    </div>
    `, mi === 0, `<div class="order-btns"><span class="cfg-badge-${m.show !== false ? 'on' : 'off'}">${m.show !== false ? '🟢 Aktiv' : '⚪ Aus'}</span><button class="btn-move" data-act="cfgMoveMetric" data-i="${mi}" data-dir="-1" ${mi === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMoveMetric" data-i="${mi}" data-dir="1" ${mi === cfgDraft.metrics.length - 1 ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelMetric" data-i="${mi}">Löschen</button></div>`, `metric_${mi}`)).join('') +
    `<button class="btn-pri" data-act="cfgAddMetric" style="align-self:flex-start">+ Neue Metrik-Kachel</button>` +
    box('🔋 Batteriespeicher-Prognose (Restlaufzeit & Ladeprognose)', 'Berechnet automatisch die verbleibende Akkulaufzeit (aktuelle Last / Grundlast) und die Uhrzeit der Vollladung bei PV-Überschuss.', `
      ${placementBarHtml('battery_forecast', 'battery_forecast', 'Speicher-Laufzeit & Prognose')}
      <div class="cfg-row">
        ${fld('Nutzbare Akkukapazität (kWh)', `type="number" step="0.1" min="0.5" max="100" data-cpath="batteryForecast.capacityKwh" value="${(cfgDraft.batteryForecast || {}).capacityKwh || 10}"`)}
        ${fld('Notstrom- / Min-Reserve (%)', `type="number" min="0" max="50" data-cpath="batteryForecast.minSoC" value="${(cfgDraft.batteryForecast || {}).minSoC != null ? (cfgDraft.batteryForecast || {}).minSoC : 5}"`)}
        ${fld('Fallback-Grundlast bei Standby (W)', `type="number" min="50" max="3000" data-cpath="batteryForecast.defaultBaseLoad" value="${(cfgDraft.batteryForecast || {}).defaultBaseLoad || 450}"`)}
      </div>
      <div class="cfg-row" style="margin-top:6px">
        ${fld('SoC-Sensor (% Ladezustand)', `list="ha-entities-list" data-cpath="batteryForecast.socEntity" value="${esc((cfgDraft.batteryForecast || {}).socEntity || '')}"`)}
        ${fld('Ladeleistung (W)', `list="ha-entities-list" data-cpath="batteryForecast.chargePowerEntity" value="${esc((cfgDraft.batteryForecast || {}).chargePowerEntity || '')}"`)}
        ${fld('Entladeleistung (W)', `list="ha-entities-list" data-cpath="batteryForecast.dischargePowerEntity" value="${esc((cfgDraft.batteryForecast || {}).dischargePowerEntity || '')}"`)}
      </div>
      <div class="cfg-row" style="margin-top:6px">
        ${fld('Hausverbrauch (W)', `list="ha-entities-list" data-cpath="batteryForecast.housePowerEntity" value="${esc((cfgDraft.batteryForecast || {}).housePowerEntity || '')}"`)}
        ${fld('PV-Erzeugung (W)', `list="ha-entities-list" data-cpath="batteryForecast.pvPowerEntity" value="${esc((cfgDraft.batteryForecast || {}).pvPowerEntity || '')}"`)}
      </div>
      <span class="cfg-desc" style="margin-top:8px">Tipp: Wenn Entitätsfelder leer bleiben, erkennt der Hub kompatible Sensoren (Senec, Sungrow, Fronius, Huawei etc.) automatisch aus deiner Power-Flow-Konfiguration!</span>
    `, false, placementStatusBadgeHtml('battery_forecast', 'battery_forecast'), 'energie_battery_forecast') +
    box('💶 Dynamische Strompreise (Tibber / EPEX)', 'Zeigt die aktuellen Strompreise (Cent/kWh) für 24 Stunden als Balkendiagramm inkl. Einfärbung (Grün/Günstig bis Rot/Teuer).', `
      ${placementBarHtml('energy_prices', 'energy_prices', (cfgDraft.energyPrices || {}).title || 'Dynamische Strompreise')}
      <div class="cfg-row">
        ${fld('Titel', `data-cpath="energyPrices.title" value="${esc((cfgDraft.energyPrices || {}).title || 'Dynamische Strompreise')}"`)}
        ${fld('Preisentität (z.B. sensor.tibber_prices)', `list="ha-entities-list" data-cpath="energyPrices.entity" value="${esc((cfgDraft.energyPrices || {}).entity || '')}"`)}
        ${sel('Einheit', [['Cent', 'Cent (z.B. 28.5)'], ['EUR', 'Euro (z.B. 0.285)']].map(([v, l]) => `<option value="${v}" ${((cfgDraft.energyPrices || {}).priceUnit || 'Cent') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-cpath="energyPrices.priceUnit"`)}
      </div>
      <div class="cfg-row" style="margin-top:6px">
        ${fld('Schwelle: Günstig (unter)', `type="number" step="0.1" data-cpath="energyPrices.cheapThreshold" value="${(cfgDraft.energyPrices || {}).cheapThreshold != null ? (cfgDraft.energyPrices || {}).cheapThreshold : 20}"`)}
        ${fld('Schwelle: Teuer (über)', `type="number" step="0.1" data-cpath="energyPrices.expensiveThreshold" value="${(cfgDraft.energyPrices || {}).expensiveThreshold != null ? (cfgDraft.energyPrices || {}).expensiveThreshold : 32}"`)}
      </div>
    `, false, placementStatusBadgeHtml('energy_prices', 'energy_prices'), 'energie_prices') +
    box('🚗 Wallbox & E-Auto', 'Zentrale Kachel für die Steuerung der Wallbox und die Anzeige des Auto-Akkus.', `
      ${placementBarHtml('wallbox', 'wallbox', (cfgDraft.wallbox || {}).title || 'Wallbox')}
      <div class="cfg-row">
        ${fld('Titel', `data-cpath="wallbox.title" value="${esc((cfgDraft.wallbox || {}).title || 'Wallbox')}"`)}
        ${fld('Auto-Akku SoC (%)', `list="ha-entities-list" data-cpath="wallbox.socEntity" value="${esc((cfgDraft.wallbox || {}).socEntity || '')}"`)}
      </div>
      <div class="cfg-row" style="margin-top:6px">
        ${fld('Aktuelle Ladeleistung (W/kW)', `list="ha-entities-list" data-cpath="wallbox.powerEntity" value="${esc((cfgDraft.wallbox || {}).powerEntity || '')}"`)}
        ${fld('Wallbox Status-Sensor', `list="ha-entities-list" data-cpath="wallbox.statusEntity" value="${esc((cfgDraft.wallbox || {}).statusEntity || '')}"`)}
        ${fld('Lademodus (input_select/switch)', `list="ha-entities-list" data-cpath="wallbox.modeEntity" value="${esc((cfgDraft.wallbox || {}).modeEntity || '')}"`)}
      </div>
    `, false, placementStatusBadgeHtml('wallbox', 'wallbox'), 'energie_wallbox') +
    box('🔄 Power-Flow Sensoren (Energiefluss)', 'Sensoren für das Power-Flow Widget (auf der Startseite & auf Unterseiten platzierbar) sowie als automatische Datenquelle für die Speicherprognose.', `
      ${placementBarHtml('power_flow', 'power_flow', 'Power Flow')}
      ${(cfgDraft.powerFlow || []).map((pf, pfi) => `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px;margin-top:6px">
        ${fld('Bezeichnung', `data-pf-i="${pfi}" data-pf-k="label" value="${esc(pf.label || '')}"`)}
        ${fld('Entität', `list="ha-entities-list" data-pf-i="${pfi}" data-pf-k="entity" value="${esc(pf.entity || '')}"`)}
        ${fld('Einheit', `data-pf-i="${pfi}" data-pf-k="unit" value="${esc(pf.unit || 'W')}"`)}
        ${sel('Icon', CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(pf.icon || 'bolt') === val ? 'selected' : ''}>${lab}</option>`).join(''), `data-pf-i="${pfi}" data-pf-k="icon"`)}
        <button class="btn-danger" data-act="cfgDelPF" data-i="${pfi}">✕</button>
      </div>`).join('')}
      <button class="iconbtn" data-act="cfgAddPF" style="margin-top:6px">+ Power-Flow Sensor hinzufügen</button>
    `, false, placementStatusBadgeHtml('power_flow', 'power_flow', `${(cfgDraft.powerFlow || []).length} Sensoren`), 'energie_cal_pf');

  // ---------- TAB 7: SICHERHEIT, KAMERAS & ALERTS ----------
  const secDoors = (cfgDraft.security && cfgDraft.security.doors) || [];
  let tKameras = box('🔒 Türschlösser, Fenster & Türen', 'Türschlösser inkl. Akku-Anzeige, Fensterkontakte und zusätzliche Türsensoren.', `
    <span class="cfg-desc" style="font-weight:600;display:block;margin-bottom:4px">🛡️ Obere Status-Leiste &amp; Türschloss-Pills:</span>
    ${placementBarHtml('status', 'status', 'Sicherheits-Status')}
    <span class="cfg-desc" style="font-weight:600;display:block;margin-bottom:4px">🔒 Sicherheits-Kachel (Schlösser, Fenster &amp; Kameras):</span>
    ${placementBarHtml('security', 'security', 'Sicherheit')}
    <span class="cfg-desc">Türschlösser &amp; Akku-Anzeige (Reihenfolge, Position &amp; Stil frei wählbar):</span>
    ${(cfgDraft.security.locks || []).map((lk, i) => `<div style="background:rgba(255,255,255,.025);padding:10px;border-radius:10px;border:1px solid var(--line);margin-bottom:8px">
      <div class="cfg-row">
        ${fld('Bezeichnung', `data-lk-i="${i}" data-lk-k="name" value="${esc(lk.name || '')}"`)}
        ${fld('Schloss-Entität (lock.*)', `list="ha-entities-list" data-lk-i="${i}" data-lk-k="entity" value="${esc(lk.entity || '')}"`)}
        ${fld('Akku-Entität (sensor.* optional)', `list="ha-entities-list" data-lk-i="${i}" data-lk-k="battery" value="${esc(lk.battery || '')}"`)}
        <div class="order-btns"><button class="btn-move" data-act="cfgMoveLock" data-i="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMoveLock" data-i="${i}" data-dir="1" ${i === cfgDraft.security.locks.length - 1 ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelLock" data-i="${i}">✕</button></div>
      </div>
      <div class="cfg-row" style="margin-top:8px">
        ${sel('Wo anzeigen? (Position)', [
          ['pill', 'In der Schloss-Pille (zwischen 🔒 und 🔓)'],
          ['subtext', 'Links im Status-Text („Alle Systeme normal · 🔋 85%“)'],
          ['above', 'Als schwebendes Mini-Label oben auf der Schloss-Pille'],
          ['card', 'Nur unten in der Sicherheits-Kachel'],
          ['both', 'Oben in der Schloss-Pille + unten in der Sicherheits-Kachel'],
          ['off', 'Ausblenden']
        ].map(([v, l]) => `<option value="${v}" ${(lk.batPos || 'pill') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-lk-i="${i}" data-lk-k="batPos"`)}
        ${sel('Wie anzeigen? (Darstellungs-Stil)', [
          ['badge', 'Farbiges Badge (Grün / Gelb / Rot mit Icon & %)'],
          ['minimal', 'Dezent / Minimal (nur dezentes Icon + %)'],
          ['text', 'Nur Text (z. B. „85%“ oder „Akku 85%“)'],
          ['warn_only', 'Nur bei niedrigem Akku anzeigen (≤ 25%)']
        ].map(([v, l]) => `<option value="${v}" ${(lk.batStyle || 'badge') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-lk-i="${i}" data-lk-k="batStyle"`)}
      </div>
    </div>`).join('')}
    <button class="iconbtn" data-act="cfgAddLock" style="margin-bottom:14px">+ Türschloss hinzufügen</button>

    <div style="margin-bottom:14px;padding-top:10px;border-top:1px dashed var(--line)">
      <span class="cfg-desc">🪟 Fensterkontakte (binary_sensor.*):</span>
      ${entityChipsHtml(cfgDraft.security.windows || [], 'secWin', '', 'binary_sensor.* auswählen…')}
    </div>

    <div style="margin-bottom:6px;padding-top:10px;border-top:1px dashed var(--line)">
      <span class="cfg-desc">🚪 Türkontakte (binary_sensor.* – werden auch im Lüftungs-/Offen-Timer berücksichtigt):</span>
      ${secDoors.map((d, di) => {
        const dObj = typeof d === 'string' ? { name: '', entity: d } : (d || {});
        return `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px;margin-top:6px">
          ${fld('Tür-Bezeichnung (z.B. Terrassentür)', `data-sd-i="${di}" data-sd-k="name" value="${esc(dObj.name || '')}"`)}
          ${fld('Türkontakt-Entität (binary_sensor.*)', `list="ha-entities-list" data-sd-i="${di}" data-sd-k="entity" value="${esc(dObj.entity || '')}"`)}
          <div class="order-btns"><button class="btn-danger" data-act="cfgDelSecDoor" data-i="${di}">✕</button></div>
        </div>`;
      }).join('')}
      <button class="iconbtn" data-act="cfgAddSecDoor" style="margin-top:6px">+ Türkontakt hinzufügen</button>
    </div>`, true, placementStatusBadgeHtml('security', 'security'), 'security_all') +
  box('📷 Kameras & go2rtc Streams', 'Hybride Kamera-Streams (lokal go2rtc WebRTC + unterwegs Home Assistant Proxy) für die Kamera-Seite und Unterseiten.', `
    <div class="cfg-row" style="margin-bottom:12px">
      ${fld('Lokaler go2rtc Host (optional, z.B. http://192.168.178.4:1984)', `data-cpath="go2rtcHost" value="${esc(cfgDraft.go2rtcHost || '')}"`)}
    </div>
    <span class="cfg-desc" style="margin-bottom:8px;display:block">Kamera-Liste (Tipp: Hinterlege die HA Kamera-Entität, damit das Bild auch unterwegs in der Companion App geladen wird!):</span>
    ${(cfgDraft.webrtcCameras || []).map((c, i) => `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px;margin-bottom:4px">
      <label><input type="checkbox" data-cam-i="${i}" data-cam-k="show" ${c.show !== false ? 'checked' : ''}> Sichtbar</label>
      ${fld('Kamera-Name', `data-cam-i="${i}" data-cam-k="name" value="${esc(c.name)}"`)}
      ${fld('HA Kamera-Entität (camera.* für App & Unterwegs)', `list="ha-entities-list" data-cam-i="${i}" data-cam-k="entity" value="${esc(c.entity || '')}"`)}
      ${fld('go2rtc Stream-Name (für lokales LAN)', `data-cam-i="${i}" data-cam-k="stream" value="${esc(c.stream || '')}"`)}
      <div class="order-btns"><button class="btn-move" data-act="cfgMoveCam" data-i="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMoveCam" data-i="${i}" data-dir="1" ${i === cfgDraft.webrtcCameras.length - 1 ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelCam" data-i="${i}">✕</button></div>
    </div>`).join('')}
    <button class="iconbtn" data-act="cfgAddCam" style="margin-top:6px">+ Kamera hinzufügen</button>`, true, `<span class="cfg-badge-info">${(cfgDraft.webrtcCameras || []).length} Kameras</span>`, 'security_cams') +
  box('🛎️ Event-Popup (Türklingel / Bewegung)', 'Zeigt automatisch ein großes Vollbild-Popup der Kamera, sobald der Auslöser auf „on“ springt – inkl. Seiten-Filter und Nachlaufzeit.', (() => {
    const bp = cfgDraft.bellPopup || {};
    const curBehavior = bp.behavior !== undefined ? bp.behavior : (bp.show ? 'popup' : 'none');
    const curFilter = bp.pageFilter || 'all';
    const allowed = Array.isArray(bp.allowedPages) ? bp.allowedPages : ['dashboard', 'kameras'];
    const holdSec = bp.triggerHoldSeconds != null ? bp.triggerHoldSeconds : 10;
    const pageChoices = [
      ['dashboard', '🏠 Startseite (Alle Raum-Tabs)'],
      ['room:Home', '🏠 Nur Raum-Tab: Home'],
      ...(cfgDraft.rooms || []).slice(1).filter(r => r && r.name).map(r => [`room:${r.name}`, `📍 Raum-Tab: ${r.name}`]),
      ['kameras', '📷 Kameras-Seite'],
      ['klima', '🌡️ Klima-Seite'],
      ...(cfgDraft.customPages || []).filter(p => p && p.id).map(p => [`page:${p.id}`, `📄 Unterseite: ${p.label || p.id}`])
    ];
    const pagePills = pageChoices.map(([key, lbl]) => {
      const on = allowed.includes(key);
      return `<button type="button" class="chip ${on ? 'on' : ''}" data-act="cfgBellPageToggle" data-page="${esc(key)}" style="font-size:11px;padding:4px 10px">${on ? '✓ ' : '+ '}${esc(lbl)}</button>`;
    }).join('');

    return `
    <div class="cfg-row" style="margin-bottom:10px">
      ${sel('Trigger-Verhalten bei Erkennung (on)', [
        ['popup', '📹 Kamera-Popup automatisch öffnen'],
        ['none', '🚫 Kein Popup öffnen (Deaktiviert)']
      ].map(([v, l]) => `<option value="${v}" ${curBehavior === v ? 'selected' : ''}>${l}</option>`).join(''), `data-cpath="bellPopup.behavior"`)}
      ${sel('Seiten-Filter (Wo soll das Popup erscheinen?)', [
        ['all', '🌐 Auf allen Seiten anzeigen (Standard)'],
        ['selected', '🎯 Nur auf ausgewählten Seiten anzeigen…']
      ].map(([v, l]) => `<option value="${v}" ${curFilter === v ? 'selected' : ''}>${l}</option>`).join(''), `data-cpath="bellPopup.pageFilter"`)}
      ${fld('Nachlaufzeit nach „off“ (Hold-Time in Sek.)', `type="number" min="0" max="600" data-cpath="bellPopup.triggerHoldSeconds" value="${holdSec}"`)}
    </div>
    ${curFilter === 'selected' ? `
    <div style="margin-bottom:12px;padding:10px 12px;border-radius:10px;background:rgba(124,108,240,.07);border:1px solid rgba(124,108,240,.25)">
      <span class="cfg-desc" style="font-weight:600;margin-bottom:6px">📍 Auf diesen Seiten darf das Kamera-Popup aufpoppen:</span>
      <div style="display:flex;gap:6px;flex-wrap:wrap">${pagePills}</div>
    </div>` : ''}
    <div class="cfg-row">
      ${fld('Auslöser (binary_sensor.*, z.B. Türklingel / Bewegung)', `list="ha-entities-list" data-cpath="bellPopup.triggerEntity" value="${esc(bp.triggerEntity || '')}"`)}
      ${fld('Kamera (HA camera.* für App & Fernzugriff)', `list="ha-entities-list" data-cpath="bellPopup.cameraEntity" value="${esc(bp.cameraEntity || '')}"`)}
      ${fld('go2rtc Stream-Name (für lokales LAN, z.B. Eingang-sub)', `data-cpath="bellPopup.webrtc" value="${esc(bp.webrtc || '')}"`)}
    </div>
    <div class="cfg-row" style="margin-top:6px">
      ${fld('Popup Titel', `data-cpath="bellPopup.title" value="${esc(bp.title || 'Türklingel')}"`)}
      ${fld('Sicherheits-Timeout / Max. Dauer (Sek., 0 = unbegrenzt solange on)', `type="number" min="0" max="3600" data-cpath="bellPopup.durationSec" value="${bp.durationSec != null ? bp.durationSec : 30}"`)}
    </div>
    <span class="cfg-desc" style="margin-top:6px">Hinweis: Solange der Sensor auf „on“ steht, bleibt das Popup geöffnet. Erst beim Wechsel von „on“ auf „off“ läuft die Nachlaufzeit (${holdSec}s) herunter. Ein erneutes „on“ während der Nachlaufzeit setzt den Timer zurück.</span>`;
  })(), false, `<span class="cfg-badge-${((cfgDraft.bellPopup || {}).behavior ? (cfgDraft.bellPopup.behavior === 'popup') : (cfgDraft.bellPopup || {}).show) ? 'on' : 'off'}">${((cfgDraft.bellPopup || {}).behavior ? (cfgDraft.bellPopup.behavior === 'popup') : (cfgDraft.bellPopup || {}).show) ? '🟢 Aktiv' : '⚪ Aus'}</span>`, 'sec_bell') +
  box('🚨 Bedingte Warn-Karten (Alerts)', 'Karten, die im Normalzustand unsichtbar sind und nur aufpoppen, wenn ein kritischer Zustand eintritt (z.B. Wassermelder, Rauchmelder, Akku < 15%).', `
    ${placementBarHtml('alerts', 'alerts', 'Warnungen')}
    ${(cfgDraft.alerts || []).map((al, ai) => `<div style="background:rgba(255,255,255,.025);padding:10px;border-radius:10px;border:1px solid var(--line);margin-bottom:8px">
      <div class="cfg-row">
        <label><input type="checkbox" data-al-i="${ai}" data-al-k="show" ${al.show !== false ? 'checked' : ''}> Aktiv</label>
        ${fld('Warn-Titel', `data-al-i="${ai}" data-al-k="title" value="${esc(al.title || '')}"`)}
        ${fld('Nachricht', `data-al-i="${ai}" data-al-k="message" value="${esc(al.message || '')}"`)}
        ${sel('Dringlichkeit (Farbe)', [['danger', 'Kritisch (Rot)'], ['warn', 'Warnung (Gelb / Orange)'], ['info', 'Hinweis (Lila / Blau)']].map(([v, l]) => `<option value="${v}" ${(al.color || 'warn') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-al-i="${ai}" data-al-k="color"`)}
        <div class="order-btns"><button class="btn-move" data-act="cfgMoveAlert" data-i="${ai}" data-dir="-1" ${ai === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMoveAlert" data-i="${ai}" data-dir="1" ${ai === (cfgDraft.alerts || []).length - 1 ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelAlert" data-i="${ai}">✕</button></div>
      </div>
      <div class="cfg-row" style="margin-top:6px">
        ${fld('Prüf-Entität', `list="ha-entities-list" data-al-i="${ai}" data-al-k="entity" value="${esc(al.entity || '')}"`)}
        ${sel('Bedingung', [
          ['==', 'ist gleich (==)'],
          ['!=', 'ist ungleich (!=)'],
          ['<', 'kleiner als (<)'],
          ['<=', 'kleiner oder gleich (<=)'],
          ['>', 'größer als (>)'],
          ['>=', 'größer oder gleich (>=)'],
          ['not_empty', 'nicht leer / verfügbar']
        ].map(([v, l]) => `<option value="${v}" ${(al.op || '==') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-al-i="${ai}" data-al-k="op"`)}
        ${fld('Vergleichswert (z.B. on / 15)', `data-al-i="${ai}" data-al-k="val" value="${esc(al.val || '')}"`)}
        ${sel('Icon', CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(al.icon || 'shield') === val ? 'selected' : ''}>${lab}</option>`).join(''), `data-al-i="${ai}" data-al-k="icon"`)}
      </div>
      <div class="cfg-row" style="margin-top:6px">
        ${fld('Optional: Entität für Direkt-Aktion (Beheben-Button)', `list="ha-entities-list" data-al-i="${ai}" data-al-k="actionEntity" value="${esc(al.actionEntity || '')}"`)}
        ${fld('Service (z.B. turn_off, lock)', `data-al-i="${ai}" data-al-k="actionService" value="${esc(al.actionService || 'turn_off')}"`)}
      </div>
    </div>`).join('')}
    <button class="iconbtn" data-act="cfgAddAlert" style="margin-top:6px">+ Warn-Regel hinzufügen</button>
  `, false, placementStatusBadgeHtml('alerts', 'alerts', `${(cfgDraft.alerts || []).length} Regeln`), 'sec_alerts');

  // ---------- TAB 8: KALENDER & EIGENE SEITEN ----------
  const roomPageGenButtons = (cfgDraft.rooms || []).filter((rm, idx) => idx > 0 && rm && rm.name).map(rm => {
    const hasPage = (cfgDraft.customPages || []).some(p => p && ((p.label && p.label.toLowerCase() === rm.name.toLowerCase()) || p.id === 'room_' + safeId(rm.name).toLowerCase()));
    return `<button type="button" class="chip ${hasPage ? 'on' : ''}" data-act="cfgGenRoomPage" data-room="${esc(rm.name)}" style="font-size:11.5px;padding:5px 11px" title="Komplette Raum-Unterseite für „${esc(rm.name)}“ mit Geräten, Lichtern, Rolläden & Klima erstellen/öffnen">${hasPage ? '✓ ' : '+ '}🏠 ${esc(rm.name)}</button>`;
  }).join('');

  const calStylesList = (typeof CALENDAR_STYLES !== 'undefined' && Array.isArray(CALENDAR_STYLES)) ? CALENDAR_STYLES : [
    ['list',   '📋 7-Tage-Liste (Classic)'],
    ['agenda', '⚡ Kompakt-Agenda (Nur Termine)'],
    ['google', '🟦 Google-Kalender-Stil'],
    ['apple',  '🍎 Apple-Kalender-Stil (Split)'],
    ['board',  '🗂️ Wochen-Board (7 Spalten)'],
    ['month',  '📅 Monats-Kalender (Raster)']
  ];
  const curHomeCalStyle = cfgDraft.calendarHomeStyle || (cfgDraft.calendars && cfgDraft.calendars.calendarHomeStyle) || 'agenda';
  const curPageCalStyle = cfgDraft.calendarPageStyle || (cfgDraft.calendars && cfgDraft.calendars.calendarPageStyle) || 'apple';

  let tKalender = box('📅 Familienkalender & Abfallkalender (Entitäten, Optik & Platzierung)', 'Wähle deine Home Assistant Kalender-Entitäten aus und lege die Darstellung für das Home-Widget sowie die dedizierte Kalender-Seite getrennt fest.', `
    <div style="margin-bottom:14px">
      <span class="cfg-desc" style="font-weight:600;display:block;margin-bottom:4px">📅 Familienkalender (calendar.*):</span>
      ${placementBarHtml('calendar', 'calendar', 'Familienkalender')}
      <div class="cfg-row" style="margin-bottom:10px">
        ${sel('Optik für Home-Widget (Startseite)', calStylesList.map(([v, l]) => `<option value="${esc(v)}" ${curHomeCalStyle === v ? 'selected' : ''}>${esc(l)}</option>`).join(''), `data-cpath="calendarHomeStyle"`)}
        ${sel('Optik für Kalender-Seite (Unterseite)', calStylesList.map(([v, l]) => `<option value="${esc(v)}" ${curPageCalStyle === v ? 'selected' : ''}>${esc(l)}</option>`).join(''), `data-cpath="calendarPageStyle"`)}
      </div>
      ${entityChipsHtml((cfgDraft.calendars || {}).familyEntities || [], 'calFam', '', 'calendar.* auswählen…')}
    </div>
    <div style="padding-top:12px;border-top:1px dashed var(--line)">
      <span class="cfg-desc" style="font-weight:600;display:block;margin-bottom:4px">🗑️ Abfallkalender (calendar.*):</span>
      ${placementBarHtml('trash', 'trash', 'Abfallkalender')}
      ${entityChipsHtml((cfgDraft.calendars || {}).trashEntities || [], 'calTrash', '', 'calendar.* auswählen…')}
    </div>`, true, placementStatusBadgeHtml('calendar', 'calendar', `${((cfgDraft.calendars || {}).familyEntities || []).length + ((cfgDraft.calendars || {}).trashEntities || []).length} Kalender`), 'kalender_entities') +
  box('✨ 1-Klick Raum-Unterseite generieren (Raum als eigene Menü-Seite)', 'Erstellt für einen bestehenden oder neuen Raum (z. B. Büro, Wohnzimmer, Werkstatt) automatisch eine eigene Unterseite in der linken Seitenleiste – fertig bestückt mit Geräten, Lichtern, Rolläden, Raumklima und Lüftung dieses Raums.', `
    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
      ${roomPageGenButtons}
      <button type="button" class="btn-pri" data-act="cfgGenRoomPage" data-room="__prompt__" style="padding:6px 14px;font-size:12px">✨ Beliebige Raum-Unterseite (z. B. Büro) generieren…</button>
    </div>
  `, true, `<span class="cfg-badge-info">1-Klick Generator</span>`, 'kalender_room_gen') +
  (cfgDraft.customPages || []).map((p, pi) => {
    const boxKey = `page_${p.id || pi}`;
    const pgParsed = parseColsMode(p.layout || 'grid', 'auto', 2);
    const maxWCol = clamp(Math.max(pgParsed.cols || 2, 6), 4, 12);
    const wColOpts = [
      ['auto', 'Automatisch einordnen'],
      ...Array.from({ length: maxWCol }, (_, i) => [String(i + 1), `Immer in Spalte ${i + 1}`]),
      ['full', 'Volle Seitenbreite']
    ];

    return box(`📄 Unterseite: ${esc(p.label)}`, 'Eigene Menü-Unterseite (z. B. Büro, Kalender, Statistik, Technik, Sport) – alle Module und Widgets frei platzierbar.', `
      <div class="cfg-row">
        ${fld('Menü-Name', `data-pg-i="${pi}" data-pg-k="label" value="${esc(p.label)}"`)}
        ${fld('Kleine Dachzeile (Eyebrow)', `data-pg-i="${pi}" data-pg-k="eyebrow" value="${esc(p.eyebrow || '')}"`)}
        ${fld('Überschrift', `data-pg-i="${pi}" data-pg-k="title" value="${esc(p.title || '')}"`)}
        ${sel('Menü-Icon', CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(p.icon || 'chart') === val ? 'selected' : ''}>${lab}</option>`).join(''), `data-pg-i="${pi}" data-pg-k="icon"`)}
      </div>
      <div class="cfg-row">
        ${fld('Einleitungstext (Intro)', `data-pg-i="${pi}" data-pg-k="intro" value="${esc(p.intro || '')}"`)}
        ${sel('Seiten-Spaltenlayout (Vorlage)', [
          ['grid', 'Automatisches Raster (Nebeneinander)'],
          ['2col-asym', '2 Spalten asymmetrisch (Links breit, Rechts schmal)'],
          ['1col', '1 Spalte (Alles untereinander)'],
          ['2col', '2 feste Spalten (frei zuordenbar)'],
          ['3col', '3 feste Spalten (frei zuordenbar)'],
          ['4col', '4 feste Spalten (frei zuordenbar)'],
          ['5col', '5 feste Spalten (frei zuordenbar)'],
          ['6col', '6 feste Spalten (frei zuordenbar)']
        ].map(([v, l]) => `<option value="${v}" ${(p.layout || 'grid') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-pg-i="${pi}" data-pg-k="layout"`)}
        ${fld('Oder freie Spaltenzahl (1–12)', `type="number" min="1" max="12" data-pg-cols-i="${pi}" value="${pgParsed.mode === 'cols' ? pgParsed.cols : ''}"`)}
      </div>
      <div style="margin-top:12px;padding-top:12px;border-top:1px dashed var(--line)">
        <span class="cfg-desc">Widgets &amp; Kacheln auf dieser Unterseite:</span>
        ${(p.widgets || []).map((w, wi) => {
          let extraWidgetCfg = '';
          const roomFilterTypes = ['devices', 'covers', 'favorites', 'ventilation'];
          const noTargetInputTypes = ['sports_hub', 'weather_forecast', 'rain_timeline', 'battery_forecast', 'energy_prices', 'wallbox', 'appliances', 'quick_routines', 'presence', 'system_health', 'security', 'status', 'alerts', 'climate', 'calendar', 'trash', 'power_flow', 'stat_group'];

          let targetInputHtml = '';
          if (roomFilterTypes.includes(w.type)) {
            targetInputHtml = fld('Raum-Filter (leer = alle Räume, oder z.B. Büro)', `list="cfg-room-names" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="room" value="${esc(w.room || w.entity || '')}"`);
          } else if (w.type === 'lights') {
            targetInputHtml = fld('Licht-Gruppe / Raum (leer = alle Gruppen)', `list="cfg-room-names" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="room" value="${esc(w.room || w.entity || '')}"`);
          } else if (w.type === 'climate_room') {
            const crOpts = `<option value="">— Alle Klima-Räume —</option>` + (cfgDraft.climateRooms || []).map(cr => `<option value="${esc(cr.name)}" ${(w.room || w.entity || '') === cr.name ? 'selected' : ''}>${esc(cr.name)}</option>`).join('');
            targetInputHtml = sel('Welcher Klima-Raum?', crOpts, `data-pg-i="${pi}" data-w-i="${wi}" data-w-k="room"`);
          } else if (w.type === 'iframe') {
            targetInputHtml = fld('Webseiten-URL (https://… oder /local/…)', `data-pg-i="${pi}" data-w-i="${wi}" data-w-k="url" value="${esc(w.url || w.entity || '')}"`);
          } else if (w.type === 'camera') {
            targetInputHtml = fld('HA Kamera-Entität (camera.*)', `list="ha-entities-list" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="entity" value="${esc(w.entity || '')}"`) +
              fld('go2rtc Stream-Name (optional)', `data-pg-i="${pi}" data-w-i="${wi}" data-w-k="stream" value="${esc(w.stream || '')}"`);
          } else if (!noTargetInputTypes.includes(w.type)) {
            targetInputHtml = fld('Haupt-Entität (sensor.*, todo.* …)', `list="ha-entities-list" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="entity" value="${esc(w.entity || '')}"`);
          }

          if (w.type === 'stat_group') {
            extraWidgetCfg = `<div style="margin-top:8px;padding-top:8px;border-top:1px dashed var(--line)">
              <span class="cfg-desc">24h-Kurven in dieser Statistik-Kachel:</span>
              ${(w.items || []).map((sit, sii) => `<div class="cfg-row" style="margin-top:4px">
                ${fld('Name', `data-wsi-pi="${pi}" data-wsi-wi="${wi}" data-wsi-si="${sii}" data-wsi-k="name" value="${esc(sit.name || '')}"`)}
                ${fld('Entität', `list="ha-entities-list" data-wsi-pi="${pi}" data-wsi-wi="${wi}" data-wsi-si="${sii}" data-wsi-k="entity" value="${esc(sit.entity || '')}"`)}
                ${fld('Attribut (optional)', `data-wsi-pi="${pi}" data-wsi-wi="${wi}" data-wsi-si="${sii}" data-wsi-k="attr" value="${esc(sit.attr || '')}"`)}
                ${fld('Farbe', `data-wsi-pi="${pi}" data-wsi-wi="${wi}" data-wsi-si="${sii}" data-wsi-k="color" value="${esc(sit.color || '#a99bff')}"`, 'color')}
                <button class="btn-danger" data-act="cfgDelWStatItem" data-pi="${pi}" data-wi="${wi}" data-si="${sii}">✕</button>
              </div>`).join('')}
              <button class="iconbtn" data-act="cfgAddWStatItem" data-pi="${pi}" data-wi="${wi}" style="margin-top:6px">+ Kurve hinzufügen</button>
            </div>`;
          } else if (w.type === 'power_flow') {
            extraWidgetCfg = `<div class="cfg-row" style="margin-top:6px">
              ${sel('Darstellung', [['auto', 'Automatisch (HACS-Karte, sonst Kacheln)'], ['card', 'Immer HACS-Karte'], ['native', 'Immer Kacheln'], ['svg', 'Eigene Kreis-Grafik']].map(([v, l]) => `<option value="${v}" ${(w.mode || 'auto') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-pg-i="${pi}" data-w-i="${wi}" data-w-k="mode"`)}
              ${fld('Solar-Entität (PV)', `list="ha-entities-list" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="pvEntity" value="${esc(w.pvEntity || '')}"`)}
              ${fld('Netzbezug-Entität', `list="ha-entities-list" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="gridImportEntity" value="${esc(w.gridImportEntity || '')}"`)}
              ${fld('Netzeinspeisung-Entität', `list="ha-entities-list" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="gridExportEntity" value="${esc(w.gridExportEntity || '')}"`)}
              ${fld('Hausverbrauch-Entität', `list="ha-entities-list" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="homeEntity" value="${esc(w.homeEntity || '')}"`)}
              ${fld('Akku-Ladung (% / SoC)', `list="ha-entities-list" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="batterySocEntity" value="${esc(w.batterySocEntity || '')}"`)}
            </div>`;
          } else if (w.type === 'buli_team') {
            extraWidgetCfg = `<div style="margin-top:8px">
              <span class="cfg-desc">Teamtracker-Entitäten (z.B. sensor.team_tracker_bvb, sensor.team_tracker_cl):</span>
              ${entityChipsHtml(w.entities || (w.entity ? [w.entity] : []), 'wBuli', `${pi}_${wi}`, 'sensor.team_tracker_* auswählen…')}
            </div>`;
          } else if (w.type === 'calendar') {
            extraWidgetCfg = `<div class="cfg-row" style="margin-top:6px">
              ${sel('Kalender-Optik (leer = Standard der Kalender-Seite)', `<option value="">Standard der Kalender-Seite nutzen</option>` + calStylesList.map(([v, l]) => `<option value="${esc(v)}" ${(w.style || '') === v ? 'selected' : ''}>${esc(l)}</option>`).join(''), `data-pg-i="${pi}" data-w-i="${wi}" data-w-k="style"`)}
              ${fld('Zeitraum in Tagen (z.B. 7 oder 14)', `type="number" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="daysCount" value="${w.daysCount || w.days || 14}"`)}
            </div>`;
          } else if (w.type === 'entity_info') {
            extraWidgetCfg = `<div class="cfg-row" style="margin-top:6px">
              ${fld('Angezeigte Attribute (Format: attr:Label,attr2:Label2 – leer = alle)', `data-pg-i="${pi}" data-w-i="${wi}" data-w-k="fields" value="${esc(w.fields || '')}"`)}
            </div>`;
          } else if (w.type === 'sports_hub') {
            const curPresetKey = `${w.sport || 'soccer'}|${w.league || 'ger.1'}|${w.teamId || ''}`;
            const presetGroupsHtml = `<option value="">— Eigene Auswahl / Über Live-Suche gewählt —</option>` +
              (typeof SPORTS_QUICK_PRESETS !== 'undefined' ? SPORTS_QUICK_PRESETS : []).map(grp =>
                `<optgroup label="${esc(grp.group)}">${grp.items.map(it => `<option value="${esc(it.id)}" ${curPresetKey === it.id ? 'selected' : ''}>${esc(it.label)}</option>`).join('')}</optgroup>`
              ).join('');

            const sState = (typeof sportsHubState !== 'undefined' && sportsHubState.editorSearch) || {};
            const isMySearch = sState.targetPi === pi && sState.targetWi === wi;
            const searchResHtml = isMySearch ? (
              sState.loading
                ? `<div class="mut sm" style="margin-top:6px">Suche nach „${esc(sState.query)}“…</div>`
                : (sState.results && sState.results.length
                  ? `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">${sState.results.map(r => `
                      <button type="button" class="chip" data-act="sportsPickResult" data-pi="${pi}" data-wi="${wi}" data-sport="${esc(r.sport)}" data-league="${esc(r.league)}" data-tid="${esc(r.id)}" data-tname="${esc(r.name)}" data-tlogo="${esc(r.logo || '')}">
                        ${r.logo ? `<img src="${esc(r.logo)}" style="width:16px;height:16px;object-fit:contain" alt="">` : '🏆'}
                        <b>${esc(r.name)}</b>
                        <small class="mut">(${esc(r.sport)} · ${esc(r.league)})</small>
                      </button>`).join('')}</div>`
                  : `<div class="mut sm" style="margin-top:6px">Keine Treffer für „${esc(sState.query)}“ gefunden.</div>`)
            ) : '';

            extraWidgetCfg = `<div style="margin-top:10px;padding-top:10px;border-top:1px dashed var(--line);display:flex;flex-direction:column;gap:10px">
              <span class="cfg-desc">🏆 <b>Universal Sport-Center (Google-Sports-Style)</b> – Keine Home Assistant Integration nötig! Wähle direkt deinen Verein oder deine Liga oder suche weltweit nach jedem Team:</span>
              <div class="cfg-row">
                ${sel('Verein oder Liga (Schnellauswahl)', presetGroupsHtml, `data-act="sportsPresetSelect" data-pi="${pi}" data-wi="${wi}"`)}
                <div class="cfg-field float" style="flex:1.2;min-width:220px">
                  <div style="display:flex;gap:6px">
                    <input type="text" class="cfg-in" id="sp-search-${pi}-${wi}" placeholder="z.B. SC Freiburg, Arsenal, Real Madrid, Lakers, 49ers…" value="${esc(isMySearch ? sState.query : '')}">
                    <button type="button" class="btn-pri" data-act="sportsSearchBtn" data-pi="${pi}" data-wi="${wi}" style="white-space:nowrap;padding:0 14px">🔍 Suchen</button>
                  </div>
                  <label>Freie Live-Suche (Weltweit alle Vereine &amp; Sportarten)</label>
                </div>
              </div>
              ${searchResHtml}
              <div class="cfg-row">
                ${sel('Darstellungs-Modus', [
                  ['google', 'Komplettes Google-Sport-Center (2-Spalten Übersicht + Tabs: Spiele, Tabelle, Team)'],
                  ['matches_only', 'Nur Spielplan & Ergebnisse-Karte'],
                  ['table_only', 'Nur Liga-Tabelle'],
                  ['roster_only', 'Nur Team-Kader']
                ].map(([v, l]) => `<option value="${v}" ${(w.viewMode || 'google') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-pg-i="${pi}" data-w-i="${wi}" data-w-k="viewMode"`)}
                ${fld('Kommende Spiele (Anzahl)', `type="number" min="1" max="10" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="upcomingCount" value="${w.upcomingCount || 4}"`)}
                ${fld('Tabellen-Zeilen (Übersicht)', `type="number" min="3" max="20" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="tableRows" value="${w.tableRows || 6}"`)}
              </div>
              <div class="cfg-row" style="gap:16px">
                <label><input type="checkbox" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="showHeader" ${w.showHeader !== false ? 'checked' : ''}> Vereins-/Liga-Kopfzeile &amp; Tabs anzeigen</label>
                <label><input type="checkbox" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="showFocusMatch" ${w.showFocusMatch !== false ? 'checked' : ''}> Großes Fokus-Spiel (Live / Letztes Spiel) anzeigen</label>
                <label><input type="checkbox" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="showUpcoming" ${w.showUpcoming !== false ? 'checked' : ''}> Nächste Spiele Kacheln anzeigen</label>
                <label><input type="checkbox" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="showTable" ${w.showTable !== false ? 'checked' : ''}> Tabelle rechts daneben anzeigen</label>
                <label><input type="checkbox" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="crossComp" ${w.crossComp !== false ? 'checked' : ''}> Wettbewerbsübergreifend (Liga + DFB-Pokal + Europapokal)</label>
              </div>
              <div class="cfg-row" style="opacity:.75">
                ${fld('Sportart-Code (z.B. soccer, football, basketball, tennis)', `data-pg-i="${pi}" data-w-i="${wi}" data-w-k="sport" value="${esc(w.sport || 'soccer')}"`)}
                ${fld('Liga-Code (z.B. ger.1, ger.2, uefa.champions, nfl)', `data-pg-i="${pi}" data-w-i="${wi}" data-w-k="league" value="${esc(w.league || 'ger.1')}"`)}
                ${fld('Team-ID (leer = ganze Liga)', `data-pg-i="${pi}" data-w-i="${wi}" data-w-k="teamId" value="${esc(w.teamId || '')}"`)}
              </div>
            </div>`;
          } else if (w.type === 'trash') {
            extraWidgetCfg = `<div class="cfg-row" style="margin-top:6px">
              ${fld('Vorschau in Tagen (z.B. 14 oder 30)', `type="number" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="maxDays" value="${w.maxDays || w.days || 30}"`)}
              ${fld('Max. Einträge', `type="number" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="maxItems" value="${w.maxItems || 25}"`)}
              ${fld('Untertitel', `data-pg-i="${pi}" data-w-i="${wi}" data-w-k="subtitle" value="${esc(w.subtitle || 'Nächste Abholungen')}"`)}
            </div>`;
          }

          return `<div style="background:rgba(255,255,255,.025);padding:10px;border-radius:10px;border:1px solid var(--line);margin-bottom:8px">
            <div class="cfg-row">
              <label><input type="checkbox" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="show" ${w.show !== false ? 'checked' : ''}> Sichtbar</label>
              ${sel('Widget- / Kachel-Typ', widgetTypeOptgroupsHtml(w.type), `data-pg-i="${pi}" data-w-i="${wi}" data-w-k="type"`)}
              ${sel('Spalten-Zuweisung', wColOpts.map(([v, l]) => `<option value="${v}" ${String(w.col || 'auto') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-pg-i="${pi}" data-w-i="${wi}" data-w-k="col"`)}
              ${fld('Titel (optional)', `data-pg-i="${pi}" data-w-i="${wi}" data-w-k="title" value="${esc(w.title || '')}"`)}
              ${targetInputHtml}
              <div class="order-btns"><button class="btn-move" data-act="cfgMoveWidget" data-pi="${pi}" data-wi="${wi}" data-dir="-1" ${wi === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMoveWidget" data-pi="${pi}" data-wi="${wi}" data-dir="1" ${wi === p.widgets.length - 1 ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelWidget" data-pi="${pi}" data-wi="${wi}">✕</button></div>
            </div>
            ${extraWidgetCfg}
          </div>`;
        }).join('')}
        <button class="iconbtn" data-act="cfgAddWidget" data-pi="${pi}" style="margin-top:6px">+ Widget / Kachel zu „${esc(p.label)}“ hinzufügen</button>
      </div>`, false, `<div class="order-btns"><span class="cfg-badge-info">${(p.widgets || []).length} Widgets</span><button class="btn-move" data-act="cfgMovePage" data-pi="${pi}" data-dir="-1" ${pi === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMovePage" data-pi="${pi}" data-dir="1" ${pi === cfgDraft.customPages.length - 1 ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelPage" data-pi="${pi}">Löschen</button></div>`, boxKey);
  }).join('') +
  `<button class="btn-pri" data-act="cfgAddPage" style="align-self:flex-start">+ Neue eigene Unterseite anlegen (z.B. Büro, Technik, OG)</button>`;

  // ---------- TAB 9: SYSTEM & BACKUP ----------
  let tBackup = box('🚀 Schnellstart, Live-Sync & Automatische Erkennung', 'Lasse deine Home Assistant Räume, Lichter, Klimageräte, Rolläden und Kameras vollautomatisch erkennen oder erzwinge einen Tablet-Reload.', `
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn-pri" data-act="cfgAutoDiscover">🔍 HA-Räume &amp; Geräte automatisch einlesen</button>
      <button class="iconbtn" data-act="forceReloadApp">🔄 Tablet-Cache leeren &amp; Seite neu laden</button>
      <button class="iconbtn" data-act="cfgLoadTimoPreset">📦 Timo-Preset laden</button>
      <button class="iconbtn" data-act="cfgLoadEmpty">🧹 Leeres Start-Gerüst laden</button>
    </div>`, true, '', 'backup_quick') + box('💾 JSON Export / Import (Backup)', 'Sichere deine komplette Konfiguration als Datei oder spiele ein Backup ein.', `
    <div style="margin-top:10px">
      ${txt('JSON-Code', `id="cfg-json-area" style="font-family:monospace;font-size:12px" rows="12"`, JSON.stringify(cfgDraft, null, 2))}
    </div>
    <div style="display:flex;gap:10px;margin-top:10px">
      <button class="iconbtn" data-act="cfgApplyJson">JSON anwenden</button>
      <button class="iconbtn" data-act="cfgDownloadJson">Als .json speichern</button>
    </div>`, true, '', 'backup_json');

  const tabData = {
    'allgemein': tAllgemein,
    'layout': tLayout,
    'raeume': tRaeume,
    'geraete': tGeraete,
    'klima': tKlima,
    'energie': tEnergie,
    'kameras': tKameras,
    'kalender': tKalender,
    'backup': tBackup
  };

  const body = tabs.map(([id]) => `<div class="cfg-tab-content" data-tab="${id}" style="display:${cfgTab === id ? 'flex' : 'none'};flex-direction:column;gap:16px">${tabData[id]}</div>`).join('');

  document.getElementById('cfgsheet').innerHTML = `
    <div class="cfg-hdr">
      <b>Dashboard-Konfigurator</b>
      <div class="cfg-search">${ic('search', 16)}<input type="text" id="cfgSearch" class="cfg-in" placeholder="Suche (Räume, Geräte, Entitäten, Layout, Büro...)" autocomplete="off" value="${esc(searchVal)}"><span id="cfgSearchCount" class="cfg-search-count" hidden></span></div>
      <button type="button" class="iconbtn" data-act="forceReloadApp" title="Ansicht & Cache neu laden" style="padding:6px 10px;font-size:12px">🔄 Sync</button>
      <button class="x2" data-act="cfgClose">✕</button>
    </div>
    <div class="cfg-tabs">${tabBtns}</div>
    <div class="cfg-body">${body}</div>
    <div class="cfg-ftr">
      <span class="mut sm">100% No-Code UI · Änderungen werden beim Speichern live an alle offenen Tablets &amp; Geräte übertragen.</span>
      <div style="display:flex;gap:10px">
        <button class="iconbtn" data-act="cfgClose">Abbrechen</button>
        <button class="btn-pri" data-act="cfgSave">💾 Speichern &amp; Live Übertragen</button>
      </div>
    </div>`;

  cfgOpenBoxesInit = true;
  const newBody = document.querySelector('#cfgsheet .cfg-body');
  if (newBody && preserveScroll) {
    newBody.scrollTop = prevScroll;
    requestAnimationFrame(() => {
      if (newBody) newBody.scrollTop = prevScroll;
    });
  }

  if (searchVal) applyCfgSearch(searchVal);
}

const CFG_SKIP_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT', 'OPTION', 'OPTGROUP', 'SCRIPT', 'STYLE', 'SVG', 'DATALIST', 'MARK']);

function cfgSearchText(el) {
  const parts = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const p = node.parentElement;
      if (!p || CFG_SKIP_TAGS.has(p.tagName) || p.closest('select,svg,datalist')) return NodeFilter.FILTER_REJECT;
      return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  let n;
  while ((n = walker.nextNode())) parts.push(n.nodeValue);
  el.querySelectorAll('input, textarea, select').forEach(ctrl => {
    if (ctrl.tagName === 'SELECT') {
      const opt = ctrl.options[ctrl.selectedIndex];
      if (opt && opt.textContent) parts.push(opt.textContent);
    } else if (ctrl.type !== 'checkbox' && ctrl.type !== 'radio' && ctrl.type !== 'file' && ctrl.value) {
      parts.push(ctrl.value);
    }
  });
  return parts.join(' ').toLowerCase();
}

function clearCfgHighlights(root) {
  root.querySelectorAll('mark.cfg-hl').forEach(m => {
    const p = m.parentNode;
    if (!p) return;
    p.replaceChild(document.createTextNode(m.textContent), m);
    p.normalize();
  });
}

function highlightCfgMatches(root, q) {
  const nodes = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const p = node.parentElement;
      if (!p || CFG_SKIP_TAGS.has(p.tagName) || p.closest('select,svg,datalist,.cfg-search-hidden')) return NodeFilter.FILTER_REJECT;
      return node.nodeValue.toLowerCase().includes(q) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
    }
  });
  let n;
  while ((n = walker.nextNode())) nodes.push(n);
  nodes.forEach(node => {
    const text = node.nodeValue;
    const lower = text.toLowerCase();
    const frag = document.createDocumentFragment();
    let pos = 0;
    let idx;
    while ((idx = lower.indexOf(q, pos)) !== -1) {
      if (idx > pos) frag.appendChild(document.createTextNode(text.slice(pos, idx)));
      const mark = document.createElement('mark');
      mark.className = 'cfg-hl';
      mark.textContent = text.slice(idx, idx + q.length);
      frag.appendChild(mark);
      pos = idx + q.length;
    }
    if (pos < text.length) frag.appendChild(document.createTextNode(text.slice(pos)));
    if (node.parentNode) node.parentNode.replaceChild(frag, node);
  });
}

function applyCfgSearch(rawQuery) {
  const sheet = document.getElementById('cfgsheet');
  const body = sheet && sheet.querySelector('.cfg-body');
  if (!sheet || !body) return;
  const countEl = document.getElementById('cfgSearchCount');
  clearCfgHighlights(body);

  const q = (rawQuery || '').toLowerCase().trim();
  if (q) {
    if (cfgSearchPreOpen === null) cfgSearchPreOpen = new Set(cfgOpenBoxes);
    sheet.classList.add('cfg-searching');
    let matchedBoxes = 0;
    sheet.querySelectorAll('.cfg-tab-content').forEach(tabEl => {
      let tabHasMatch = false;
      tabEl.querySelectorAll('details.cfg-box').forEach(box => {
        if (cfgSearchText(box).includes(q)) {
          tabHasMatch = true;
          matchedBoxes++;
          box.classList.remove('cfg-search-hidden');
          box.open = true;
          const rows = Array.from(box.querySelectorAll('.cfg-row'));
          const matchedRows = rows.filter(r => cfgSearchText(r).includes(q));
          rows.forEach(r => r.classList.toggle('cfg-search-hidden', matchedRows.length > 0 && !matchedRows.includes(r)));
          highlightCfgMatches(box, q);
        } else {
          box.classList.add('cfg-search-hidden');
        }
      });
      tabEl.style.display = tabHasMatch ? 'flex' : 'none';
    });
    if (countEl) {
      countEl.hidden = false;
      countEl.textContent = `${matchedBoxes} Treffer`;
      countEl.classList.toggle('empty', matchedBoxes === 0);
    }
  } else {
    sheet.classList.remove('cfg-searching');
    sheet.querySelectorAll('.cfg-search-hidden').forEach(el => el.classList.remove('cfg-search-hidden'));
    sheet.querySelectorAll('.cfg-tab-content').forEach(c => {
      c.style.display = c.dataset.tab === cfgTab ? 'flex' : 'none';
    });
    if (cfgSearchPreOpen !== null) {
      cfgOpenBoxes.clear();
      cfgSearchPreOpen.forEach(k => cfgOpenBoxes.add(k));
      cfgSearchPreOpen = null;
    }
    sheet.querySelectorAll('details.cfg-box[data-box-key]').forEach(box => {
      box.open = cfgOpenBoxes.has(box.dataset.boxKey);
    });
    if (countEl) {
      countEl.hidden = true;
      countEl.textContent = '';
      countEl.classList.remove('empty');
    }
  }
}

function setByPath(obj, path, val) {
  if (!obj || typeof obj !== 'object' || !path) return;
  const parts = path.split('.');
  if (parts.some(p => p === '__proto__' || p === 'constructor' || p === 'prototype')) return;
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]] || typeof cur[parts[i]] !== 'object') cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = val;
}

document.addEventListener('input', e => {
  const t = e.target;

  if (t.id === 'cfgSearch') {
    applyCfgSearch(t.value);
    return;
  }

  if (t.dataset && t.dataset.kind === 'num') {
    const lab = document.querySelector(`.sv[data-v="${t.dataset.ent}"]`);
    if (lab) lab.textContent = `${fmt(parseFloat(t.value), 2)} ${t.dataset.unit || ''}`;
  }
  if (!cfgDraft) return;
  if (t.dataset.cpath) {
    let val = t.value;
    if (t.dataset.cpath === 'bellPopup.triggerHoldSeconds' || t.dataset.cpath === 'bellPopup.durationSec') {
      val = Math.max(0, parseInt(t.value, 10) || 0);
    }
    setByPath(cfgDraft, t.dataset.cpath, val);
    if (t.dataset.cpath === 'bellPopup.behavior') {
      if (!cfgDraft.bellPopup) cfgDraft.bellPopup = {};
      cfgDraft.bellPopup.show = val === 'popup';
      renderCfgModal(true);
    }
    if (t.dataset.cpath === 'bellPopup.pageFilter') {
      renderCfgModal(true);
    }
    if (t.dataset.cpath === 'calendarHomeStyle' || t.dataset.cpath === 'calendarPageStyle') {
      if (!cfgDraft.calendars) cfgDraft.calendars = {};
      cfgDraft.calendars[t.dataset.cpath] = t.value;
    }
    if (t.dataset.cpath === 'dashboardLayoutMode') renderCfgModal(true);
    if (t.dataset.cpath.startsWith('theme.')) {
      const prop = t.dataset.cpath.slice(6);
      const r = document.documentElement.style;
      const map = {
        greetingColor: '--hero-greet-color',
        nameColor: '--hero-name-color',
        activityColor: '--hero-activity-color',
        dateTimeColor: '--hero-datetime-color',
        acc: '--acc',
        acc2: '--acc2',
        bg: '--bg',
        ok: '--ok',
        warn: '--warn',
        cool: '--cool'
      };
      if (map[prop]) r.setProperty(map[prop], t.value);
    }
  }
  if (t.dataset.cbool) setByPath(cfgDraft, t.dataset.cbool, t.checked);
  if (t.dataset.customCols) {
    const n = clamp(parseInt(t.value, 10) || 0, 1, 12);
    if (n >= 1) {
      const key = t.dataset.customCols;
      cfgDraft[key] = key === 'dashboardCols' ? `${n}-col` : String(n);
    }
  }
  if (t.dataset.pgColsI != null) {
    const n = clamp(parseInt(t.value, 10) || 0, 1, 12);
    const pg = cfgDraft.customPages[+t.dataset.pgColsI];
    if (pg && n >= 1) pg.layout = `${n}col`;
  }

  // Dashboard Layout rows & Unified Placement Bars
  if (t.dataset.devprofK) {
    const k = t.dataset.devprofK;
    const val = k === 'returnToStartMins' ? (parseInt(t.value, 10) || 0) : t.value;
    saveDeviceProfile({ [k]: val });
    if (k === 'startView' || k === 'kioskOverride' || k === 'screensaverOverride') {
      renderCfgModal(true);
    }
    return;
  }
  if (t.dataset.dlwI != null) {
    const item = cfgDraft.dashboardLayout[+t.dataset.dlwI];
    if (item && item.widget) {
      const k = t.dataset.dlwK;
      item.widget[k] = t.value;
      if (k === 'room') item.widget.entity = t.value;
      if (k === 'title') item.label = `🧩 ${t.value || item.widget.type}`;
      if (k === 'type') {
        item.label = `🧩 ${item.widget.title || t.value}`;
        renderCfgModal(true);
      }
    }
    return;
  }
  if (t.dataset.dlwsiI != null) {
    const item = cfgDraft.dashboardLayout[+t.dataset.dlwsiI];
    const si = +t.dataset.dlwsiSi;
    if (item && item.widget && item.widget.items && item.widget.items[si]) {
      item.widget.items[si][t.dataset.dlwsiK] = t.value;
    }
    return;
  }
  if (t.dataset.dlI != null) {
    const item = cfgDraft.dashboardLayout[+t.dataset.dlI];
    const k = t.dataset.dlK;
    if (k === 'show') {
      item.show = t.checked;
      syncLayoutAndModuleShow(cfgDraft, false);
      renderCfgModal(true);
    } else if (k === 'col') {
      item.col = t.value === 'full' ? 'full' : (parseInt(t.value, 10) || 1);
      renderCfgModal(true);
    } else if (k === 'span') {
      item.span = parseInt(t.value, 10) || 12;
      renderCfgModal(true);
    } else if (k === 'scope') {
      item.scope = t.value;
      if (t.value === 'custom' && !Array.isArray(item.scopeRooms)) {
        item.scopeRooms = ['Home'];
      }
      renderCfgModal(true);
    } else {
      item[k] = t.value;
    }
  }

  if (t.dataset.wiI != null) {
    const item = cfgDraft.weather.items[+t.dataset.wiI];
    const k = t.dataset.wiK;
    item[k] = k === 'decimals' ? parseInt(t.value, 10) || 0 : t.value;
  }
  if (t.dataset.rI != null) {
    cfgDraft.rooms[+t.dataset.rI][t.dataset.rK] = t.value;
    if (t.dataset.rK === 'dynamicIdleMode') renderCfgModal(true);
  }
  if (t.dataset.rBoolI != null) {
    cfgDraft.rooms[+t.dataset.rBoolI][t.dataset.rBoolK] = t.checked;
    if (t.dataset.rBoolK === 'dynamicMotion') renderCfgModal(true);
  }
  if (t.dataset.cbRi != null) {
    const cb = cfgDraft.rooms[+t.dataset.cbRi].camButtons[+t.dataset.cbBi];
    cb[t.dataset.cbK] = t.value;
  }
  if (t.dataset.chipRi != null) {
    const chip = cfgDraft.rooms[+t.dataset.chipRi].chips[+t.dataset.chipCi];
    const k = t.dataset.chipK;
    chip[k] = k === 'decimals' ? parseInt(t.value, 10) || 0 : t.value;
  }
  if (t.dataset.dI != null) cfgDraft.devices[+t.dataset.dI][t.dataset.dK] = t.value;
  if (t.dataset.cvI != null) cfgDraft.covers[+t.dataset.cvI][t.dataset.cvK] = t.value;
  if (t.dataset.lmK) {
    if (!cfgDraft.lightsMain) cfgDraft.lightsMain = { mode: 'group', group: 0, entities: [] };
    const k = t.dataset.lmK;
    if (k === 'mode') { cfgDraft.lightsMain.mode = t.value; renderCfgModal(true); }
    else if (k === 'group') cfgDraft.lightsMain.group = parseInt(t.value, 10) || 0;
  }
  if (t.dataset.lI != null) {
    const g = cfgDraft.lights[+t.dataset.lI];
    const k = t.dataset.lK;
    if (k === 'mainSync') g.mainSync = t.checked;
    else g[k] = t.value;
  }
  if (t.dataset.camI != null) {
    const cam = cfgDraft.webrtcCameras[+t.dataset.camI];
    const k = t.dataset.camK;
    cam[k] = k === 'show' ? t.checked : t.value;
  }
  if (t.dataset.lkI != null) {
    cfgDraft.security.locks[+t.dataset.lkI][t.dataset.lkK] = t.value;
    cfgDraft.security.lock = cfgDraft.security.locks[0] ? cfgDraft.security.locks[0].entity : '';
  }
  if (t.dataset.mI != null) {
    const m = cfgDraft.metrics[+t.dataset.mI];
    const k = t.dataset.mK;
    m[k] = k === 'decimals' ? parseInt(t.value, 10) || 0 : t.value;
  }
  if (t.dataset.mBoolI != null) {
    const m = cfgDraft.metrics[+t.dataset.mBoolI];
    if (m) {
      m[t.dataset.mBoolK] = t.checked;
      if (t.dataset.mBoolK === 'showAutarky') renderCfgModal(true);
    }
  }
  if (t.dataset.favI != null) {
    if (!Array.isArray(cfgDraft.favorites)) cfgDraft.favorites = [];
    const f = cfgDraft.favorites[+t.dataset.favI];
    if (f) {
      const k = t.dataset.favK;
      if (k === 'show') f.show = t.checked;
      else f[k] = t.value;
    }
  }
  if (t.dataset.apI != null) {
    if (!cfgDraft.appliances) cfgDraft.appliances = { show: true, items: [] };
    if (!Array.isArray(cfgDraft.appliances.items)) cfgDraft.appliances.items = [];
    const item = cfgDraft.appliances.items[+t.dataset.apI];
    if (item) item[t.dataset.apK] = t.value;
  }
  if (t.dataset.sdI != null) {
    if (!Array.isArray(cfgDraft.security.doors)) cfgDraft.security.doors = [];
    let d = cfgDraft.security.doors[+t.dataset.sdI];
    if (typeof d === 'string') {
      d = { entity: d, name: '' };
      cfgDraft.security.doors[+t.dataset.sdI] = d;
    }
    if (d) d[t.dataset.sdK] = t.value;
  }
  if (t.dataset.rtI != null) {
    if (!Array.isArray(cfgDraft.routines)) cfgDraft.routines = [];
    if (cfgDraft.routines[+t.dataset.rtI]) cfgDraft.routines[+t.dataset.rtI][t.dataset.rtK] = t.value;
  }
  if (t.dataset.pmI != null) {
    if (!cfgDraft.presence) cfgDraft.presence = { show: false, members: [] };
    if (cfgDraft.presence.members[+t.dataset.pmI]) cfgDraft.presence.members[+t.dataset.pmI][t.dataset.pmK] = t.value;
  }
  if (t.dataset.vrI != null) {
    if (!cfgDraft.ventilation) cfgDraft.ventilation = { show: false, rooms: [] };
    if (cfgDraft.ventilation.rooms[+t.dataset.vrI]) cfgDraft.ventilation.rooms[+t.dataset.vrI][t.dataset.vrK] = t.value;
  }
  if (t.dataset.alI != null) {
    if (!Array.isArray(cfgDraft.alerts)) cfgDraft.alerts = [];
    const al = cfgDraft.alerts[+t.dataset.alI];
    if (al) {
      if (t.dataset.alK === 'show') al.show = t.checked;
      else al[t.dataset.alK] = t.value;
    }
  }
  if (t.dataset.ctI != null) {
    if (!cfgDraft.systemHealth) cfgDraft.systemHealth = { show: false, containers: [] };
    if (cfgDraft.systemHealth.containers[+t.dataset.ctI]) cfgDraft.systemHealth.containers[+t.dataset.ctI][t.dataset.ctK] = t.value;
  }
  if (t.dataset.hbI != null) {
    const b = cfgDraft.headerBadgeItems[+t.dataset.hbI];
    const k = t.dataset.hbK;
    if (k === 'maxDays') b[k] = parseInt(t.value, 10) || 2;
    else b[k] = t.value;
    if (k === 'type') renderCfgModal(true);
  }
  if (t.dataset.sbMi != null) {
    const sb = cfgDraft.metrics[+t.dataset.sbMi].subButtons[+t.dataset.sbI];
    sb[t.dataset.sbK] = t.value;
  }
  if (t.dataset.sbeMi != null) {
    const entObj = cfgDraft.metrics[+t.dataset.sbeMi].subButtons[+t.dataset.sbeSbi].entities[+t.dataset.sbeEi];
    const k = t.dataset.sbeK;
    entObj[k] = k === 'chart' ? t.checked : t.value;
  }
  if (t.dataset.pfI != null) {
    cfgDraft.powerFlow[+t.dataset.pfI][t.dataset.pfK] = t.value;
  }
  if (t.dataset.ctS != null) {
    const arr = getTileArr(t.dataset.ctS);
    const tile = arr && arr[+t.dataset.ctI];
    if (tile) {
      const k = t.dataset.ctK;
      tile[k] = t.type === 'checkbox' ? t.checked : (k === 'decimals' ? parseInt(t.value, 10) || 0 : t.value);
    }
  }
  if (t.dataset.devtabName) {
    const tabObj = (cfgDraft.deviceTabs || []).find(x => x.id === t.dataset.devtabName);
    if (tabObj) tabObj.name = t.value;
  }
  if (t.dataset.crI != null) {
    const cr = cfgDraft.climateRooms[+t.dataset.crI];
    const k = t.dataset.crK;
    if (k === 'show') cr.show = t.checked;
    else if (k === 'boost') cr.boost = t.value ? { entity: t.value, name: 'Boost' } : null;
    else cr[k] = t.value;
  }
  if (t.dataset.crdRi != null) {
    const dv = cfgDraft.climateRooms[+t.dataset.crdRi].devices[+t.dataset.crdDi];
    const k = t.dataset.crdK;
    dv[k] = (k === 'toggle' || k === 'readonly') ? t.checked : t.value;
  }
  if (t.dataset.crsRi != null) {
    const sn = cfgDraft.climateRooms[+t.dataset.crsRi].sensors[+t.dataset.crsSi];
    sn[t.dataset.crsK] = t.value;
  }
  if (t.dataset.crcRi != null) {
    const ch = cfgDraft.climateRooms[+t.dataset.crcRi].charts[+t.dataset.crcCi];
    ch[t.dataset.crcK] = t.value;
  }
  if (t.dataset.crhRi != null) {
    const cr = cfgDraft.climateRooms[+t.dataset.crhRi];
    if (!cr.settings || !cr.settings.groups || !cr.settings.groups[0]) {
      cr.settings = { title: `${cr.name} Einstellungen`, groups: [{ title: 'Einstellungen', items: [] }] };
    }
    const item = cr.settings.groups[0].items[+t.dataset.crhHi];
    if (item) item[t.dataset.crhK] = t.value;
  }
  if (t.dataset.pgI != null && t.dataset.wI == null) {
    cfgDraft.customPages[+t.dataset.pgI][t.dataset.pgK] = t.value;
  }
  if (t.dataset.act === 'sportsPresetSelect') {
    const w = cfgDraft.customPages[+t.dataset.pi].widgets[+t.dataset.wi];
    const val = t.value;
    if (w && val) {
      let found = null;
      (typeof SPORTS_QUICK_PRESETS !== 'undefined' ? SPORTS_QUICK_PRESETS : []).forEach(grp => {
        grp.items.forEach(it => { if (it.id === val) found = it; });
      });
      if (found) {
        w.sport = found.sport;
        w.league = found.league;
        w.teamId = found.teamId;
        w.teamName = found.teamName;
        w.title = found.teamName;
      } else {
        const [sp, lg, tid] = val.split('|');
        w.sport = sp || 'soccer';
        w.league = lg || 'ger.1';
        w.teamId = tid || '';
      }
      renderCfgModal(true);
    }
    return;
  }
  if (t.dataset.pgI != null && t.dataset.wI != null) {
    const w = cfgDraft.customPages[+t.dataset.pgI].widgets[+t.dataset.wI];
    const k = t.dataset.wK;
    if (['show', 'showHeader', 'showFocusMatch', 'showUpcoming', 'showTable', 'crossComp'].includes(k)) {
      w[k] = t.checked;
    } else if (['daysCount', 'maxDays', 'maxItems', 'upcomingCount', 'tableRows'].includes(k)) {
      w[k] = parseInt(t.value, 10) || 4;
    } else if (k === 'room') {
      w.room = t.value;
      w.entity = t.value;
    } else if (k === 'url') {
      w.url = t.value;
    } else if (k === 'stream') {
      w.stream = t.value;
    } else if (k === 'fields') {
      w.fields = t.value;
    } else if (k === 'entity') {
      if (w.type === 'iframe') w.url = t.value;
      else if (['devices', 'covers', 'favorites', 'lights', 'ventilation', 'climate_room'].includes(w.type)) {
        w.room = t.value;
        w.entity = t.value;
      } else {
        w.entity = t.value;
      }
    } else if (k === 'cardConfig') {
      try { w.cardConfig = t.value.trim() ? JSON.parse(t.value) : null; } catch (_) {}
    } else {
      w[k] = t.value;
      if (k === 'type') {
        if (w.type === 'sports_hub') {
          if (!w.sport) w.sport = 'soccer';
          if (!w.league) w.league = 'ger.1';
          if (w.teamId === undefined) { w.teamId = '126'; w.teamName = 'SC Freiburg'; w.title = 'SC Freiburg'; }
          if (!w.viewMode) w.viewMode = 'google';
          w.col = 'full';
          if (w.showHeader === undefined) w.showHeader = true;
          if (w.showFocusMatch === undefined) w.showFocusMatch = true;
          if (w.showUpcoming === undefined) w.showUpcoming = true;
          if (!w.upcomingCount) w.upcomingCount = 4;
          if (w.showTable === undefined) w.showTable = true;
          if (!w.tableRows) w.tableRows = 6;
          if (w.crossComp === undefined) w.crossComp = true;
        }
        renderCfgModal(true);
      }
    }
  }
  if (t.dataset.wsiPi != null) {
    const w = cfgDraft.customPages[+t.dataset.wsiPi].widgets[+t.dataset.wsiWi];
    if (w && w.items && w.items[+t.dataset.wsiSi]) {
      w.items[+t.dataset.wsiSi][t.dataset.wsiK] = t.value;
    }
  }
});

document.addEventListener('change', async e => {
  const t = e.target;
  if (t.dataset && t.dataset.act === 'uploadRoomImg') {
    const file = t.files && t.files[0];
    const idx = +t.dataset.i;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const b64 = reader.result;
      const h = getHass();
      if (h && typeof h.callWS === 'function') {
        try {
          const res = await h.callWS({ type: 'smarthome_hub/upload_image', filename: file.name, data: b64 });
          cfgDraft.rooms[idx].image = res.url;
          renderCfgModal(true);
          toast('Bild hochgeladen: ' + res.url);
        } catch (err) {
          const errMsg = (err && (err.message || err.error?.message || String(err))) || 'Unbekannter Fehler';
          toast('Upload fehlgeschlagen: ' + errMsg);
        }
      } else {
        cfgDraft.rooms[idx].image = b64;
        renderCfgModal(true);
        toast('Bild als Base64 übernommen (Demo)');
      }
    };
    reader.readAsDataURL(file);
    return;
  }
  const ent = t.dataset && t.dataset.ent; if (!ent) return;
  if (t.dataset.kind === 'num') call(dom(ent), 'set_value', { entity_id: ent, value: parseFloat(t.value) });
  else if (t.dataset.kind === 'sel') call(dom(ent), 'select_option', { entity_id: ent, option: t.value });
  else if (t.dataset.kind === 'dt' && t.value) {
    if (t.dataset.t === 'time') call('input_datetime', 'set_datetime', { entity_id: ent, time: t.value.length === 5 ? t.value + ':00' : t.value });
    else if (t.dataset.t === 'date') call('input_datetime', 'set_datetime', { entity_id: ent, date: t.value });
    else call('input_datetime', 'set_datetime', { entity_id: ent, datetime: t.value.replace('T', ' ') + (t.value.length === 16 ? ':00' : '') });
  }
});

document.addEventListener('toggle', e => {
  // Ignore auto-expand toggles during active search so pre-search state stays intact
  if (cfgSearchPreOpen !== null) return;
  const b = e.target && e.target.closest && e.target.closest('details.cfg-box');
  if (b && b.dataset && b.dataset.boxKey) {
    if (b.open) cfgOpenBoxes.add(b.dataset.boxKey);
    else cfgOpenBoxes.delete(b.dataset.boxKey);
  }
}, true);

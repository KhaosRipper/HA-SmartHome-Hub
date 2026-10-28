/* ==========================================================================
   Smart Home Hub – Visueller In-App Konfigurations-Editor (editor.js)
   100% No-Code UI Konfigurator (Layout, Spalten, Chip-Picker, Theme-Presets)
   ========================================================================== */

let cfgDraft = null;
let cfgTab = 'allgemein';
let cfgDevSubTab = 'geraete';
let lastOpenedBoxKey = null;

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
  ['mower', '🚜 Mähroboter (mower)'],
  ['blinds', '🪟 Rolladen (blinds)'],
  ['lock', '🔒 Schloss (lock)'],
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
  hero: '🖼️ Raum-Banner (Hero & Live-Kamera)',
  devices: '🔌 Geräteübersicht (Haupt-Reiter)',
  extra_tabs: '📑 Zusätzliche Geräte-Reiter',
  covers: '🪟 Rolladen-Steuerung',
  calendar: '📅 Familienkalender (7 Tage)',
  status: '🛡️ Sicherheits-Status & Türschloss-Pills',
  climate: '🌡️ Raumklima / Wetter-Kachel',
  metrics: '⚡ Energie- & Verbrauchs-Metriken',
  security: '🔒 Sicherheits-Kachel (Schlösser/Fenster/Kameras)',
  lights: '💡 Lichter-Gruppen & Hauptschalter',
  trash: '🗑️ Abfallkalender'
};

/* ---------- Visueller Multi-Entitäts Chip-Picker (ohne Komma-Listen!) ---------- */
function entityChipsHtml(list, groupKey, parentIdx = '', placeholder = 'Entität suchen & auswählen…') {
  const arr = Array.isArray(list) ? list : [];
  const chips = arr.map((ent, ci) => {
    const st = S(ent);
    const fn = st && st.attributes && st.attributes.friendly_name ? st.attributes.friendly_name : '';
    return `<span class="ent-chip" title="${esc(ent)}">
      <span class="ent-chip-txt">${fn ? `<b>${esc(fn)}</b> <small>${esc(ent)}</small>` : `<b>${esc(ent)}</b>`}</span>
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

function openCfgEditor(initialTab = null) {
  const tabMap = {
    gen: 'allgemein', allgemein: 'allgemein',
    layout: 'layout',
    rooms: 'raeume', raeume: 'raeume',
    devs: 'geraete', geraete: 'geraete',
    klima: 'klima',
    metrics: 'energie', energie: 'energie', badges: 'energie',
    sec: 'kameras', kameras: 'kameras',
    pages: 'seiten', seiten: 'seiten',
    backup: 'backup'
  };
  if (initialTab && tabMap[initialTab]) cfgTab = tabMap[initialTab];
  requirePin('editor', () => {
    cfgDraft = ensureConfigDefaults(JSON.parse(JSON.stringify(CONFIG)));
    if (!cfgDraft.deviceTabs.some(t => t.id === cfgDevSubTab)) cfgDevSubTab = cfgDraft.deviceTabs[0].id;
    renderCfgModal(false);
    document.getElementById('cfgmodal').classList.add('show');
  }, 'Dashboard-Editor entsperren');
}

function renderCfgModal(preserveScroll = true) {
  const prevBody = document.querySelector('#cfgsheet .cfg-body');
  const prevScroll = (preserveScroll && prevBody) ? prevBody.scrollTop : 0;
  const searchEl = document.getElementById('cfgSearch');
  const searchVal = searchEl ? searchEl.value : '';

  const tabs = [
    ['allgemein', '🎨 Allgemein & Design'],
    ['layout', '📐 Layout & Spalten'],
    ['raeume', '🏠 Räume & Badges'],
    ['geraete', '🔌 Geräte, Licht & Rollos'],
    ['klima', '🌡️ Klima-Baukasten'],
    ['energie', '⚡ Energie & Kalender'],
    ['kameras', '📷 Kameras & Sicherheit'],
    ['seiten', '📄 Eigene Seiten'],
    ['backup', '💾 Import / Backup']
  ];
  const tabBtns = tabs.map(([id, label]) => `<button class="pill ${cfgTab === id ? 'on' : ''}" data-act="cfgtab" data-tab="${id}">${label}</button>`).join('');

  const fld = (lbl, attrs, type = 'text') => `<div class="cfg-field float"><input type="${type}" class="cfg-in" placeholder=" " ${attrs}><label>${esc(lbl)}</label></div>`;
  const sel = (lbl, opts, attrs) => `<div class="cfg-field float"><select class="cfg-in" style="padding-top:16px" ${attrs}>${opts}</select><label style="top:4px;font-size:9px;color:var(--acc2)">${esc(lbl)}</label></div>`;
  const txt = (lbl, attrs, val) => `<div class="cfg-field float"><textarea class="cfg-in" placeholder=" " ${attrs}>${esc(val)}</textarea><label>${esc(lbl)}</label></div>`;
  const box = (title, desc, content, open = false, headRight = '') => `<details class="cfg-box" ${open ? 'open' : ''}><summary><div style="display:flex;flex-direction:column;gap:3px;margin-right:auto"><b>${title}</b><span class="cfg-desc">${desc}</span></div>${headRight}</summary><div class="cfg-box-body">${content}</div></details>`;

  const th = cfgDraft.theme || {};
  const pp = cfgDraft.pinProtect || {};
  const w = cfgDraft.weather || {};

  // ---------- TAB 1: ALLGEMEIN & DESIGN ----------
  const presetBtns = Object.entries(THEME_PRESETS || {}).map(([key, p]) => `
    <button type="button" class="theme-preset-btn ${th.preset === key ? 'on' : ''}" data-act="cfgThemePreset" data-preset="${esc(key)}">
      <span class="tp-dots">
        <i style="background:${p.bg}"></i>
        <i style="background:${p.acc}"></i>
        <i style="background:${p.ok}"></i>
      </span>
      <span>${esc(p.name)}</span>
    </button>`).join('');

  let tAllgemein = box('Seitenleiste & Dashboard-Infos', 'Grundlegende Texte, Begrüßung und Zeitanzeige.', `
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
    </div>`, true) +
    box('Design-Vorlagen, Farben & Form', 'Wähle ein fertiges Farbschema per Klick oder passe Farben, Rundungen und Abstände frei an.', `
    <div style="margin-bottom:12px">
      <span class="cfg-desc" style="display:block;margin-bottom:6px">1-Klick Design-Presets:</span>
      <div class="theme-presets-grid">${presetBtns}</div>
    </div>
    <div class="cfg-row">
      ${fld('Hintergrund', `data-cpath="theme.bg" value="${esc(th.bg || '#080912')}"`, 'color')}
      ${fld('Primärfarbe', `data-cpath="theme.acc" value="${esc(th.acc || '#7c6cf0')}"`, 'color')}
      ${fld('Akzent hell', `data-cpath="theme.acc2" value="${esc(th.acc2 || '#a99bff')}"`, 'color')}
      ${fld('Grün / OK', `data-cpath="theme.ok" value="${esc(th.ok || '#34d399')}"`, 'color')}
      ${fld('Warnung', `data-cpath="theme.warn" value="${esc(th.warn || '#f59e0b')}"`, 'color')}
      ${fld('Blau / Kühl', `data-cpath="theme.cool" value="${esc(th.cool || '#38bdf8')}"`, 'color')}
    </div>
    <div class="cfg-row" style="margin-top:8px">
      ${sel('Karten-Rundung (Form)', [
        ['12px', 'Kantig-Modern (12px)'],
        ['16px', 'Klassisch (16px)'],
        ['22px', 'Sanft abgerundet – Standard (22px)'],
        ['28px', 'Stark abgerundet (28px)']
      ].map(([v, l]) => `<option value="${v}" ${(th.radius || '22px') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-cpath="theme.radius"`)}
      ${sel('Abstands-Dichte (Layout)', [
        ['compact', 'Kompakt (mehr Inhalt auf Wandtablets)'],
        ['normal', 'Standard (ausgewogen)'],
        ['relaxed', 'Luftig (großzügige Abstände)']
      ].map(([v, l]) => `<option value="${v}" ${(th.density || 'normal') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-cpath="theme.density"`)}
    </div>`, true) +
    box('Wetter-Kachel & Vorhersage', 'Steuert die Wetter-Anzeige und die 7-Tage-Vorhersage.', `
    <div class="cfg-row">
      <label><input type="checkbox" data-cbool="weather.showCard" ${w.showCard !== false ? 'checked' : ''}> Aktuelle Wetter-Kachel anzeigen</label>
      <label><input type="checkbox" data-cbool="weather.showForecast" ${w.showForecast ? 'checked' : ''}> 7-Tage-Vorhersage (Popup) aktivieren</label>
    </div>
    <div class="cfg-row">
      ${fld('Kachel-Titel', `data-cpath="weather.title" value="${esc(w.title || 'Wetter')}"`)}
      ${fld('Ort / Zusatz (z.B. Berlin)', `data-cpath="weather.label" value="${esc(w.label || '')}"`)}
      ${fld('Haupt-Wetter (weather.*)', `list="ha-entities-list" data-cpath="weather.entity" value="${esc(w.entity || '')}"`)}
      ${fld('Eigene Temp.-Entität', `list="ha-entities-list" data-cpath="weather.tempEntity" value="${esc(w.tempEntity || '')}"`)}
      ${fld('Vorhersage-Entität', `list="ha-entities-list" data-cpath="weather.forecastEntity" value="${esc(w.forecastEntity || '')}"`)}
    </div>
    <div style="margin-top:6px">
      <span class="cfg-desc" style="margin-bottom:8px">Zusätzliche Detail-Werte (z.B. Luftfeuchte, Wind) in der Wetter-Kachel:</span>
      ${(w.items || []).map((it, wi) => `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px">
        ${fld('Bezeichnung', `data-wi-i="${wi}" data-wi-k="label" value="${esc(it.label || '')}"`)}
        ${fld('Entität (leer = Wetter-Attr.)', `list="ha-entities-list" data-wi-i="${wi}" data-wi-k="entity" value="${esc(it.entity || '')}"`)}
        ${fld('Attribut (z.B. wind_speed)', `data-wi-i="${wi}" data-wi-k="attr" value="${esc(it.attr || '')}"`)}
        ${fld('Einheit', `data-wi-i="${wi}" data-wi-k="unit" value="${esc(it.unit || '')}"`)}
        ${sel('Icon', CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(it.icon || 'drop') === val ? 'selected' : ''}>${lab}</option>`).join(''), `data-wi-i="${wi}" data-wi-k="icon"`)}
        <div class="order-btns"><button class="btn-danger" data-act="cfgDelWItem" data-i="${wi}">✕</button></div>
      </div>`).join('')}
      <button class="iconbtn" data-act="cfgAddWItem" style="margin-top:8px">+ Detailwert hinzufügen</button>
    </div>`) +
    box('Sicherheit & Kiosk-Modus', 'PIN-Schutz und Vollbild-Einstellungen für Wandtablets.', `
    <div class="cfg-row">
      <label><input type="checkbox" data-cbool="kioskMode" ${cfgDraft.kioskMode ? 'checked' : ''}> Kiosk-Vollbildmodus (HA-Sidebar ausblenden)</label>
      <label><input type="checkbox" data-cbool="hideSystemLinks" ${cfgDraft.hideSystemLinks ? 'checked' : ''}> HA-Systemlinks ausblenden</label>
      ${fld('Master PIN-Code', `data-cpath="pinCode" value="${esc(cfgDraft.pinCode)}"`, 'password')}
    </div>
    <div class="cfg-row" style="margin-top:8px">
      <label><input type="checkbox" data-cbool="pinProtect.editor" ${pp.editor ? 'checked' : ''}> PIN für Editor</label>
      <label><input type="checkbox" data-cbool="pinProtect.systemLinks" ${pp.systemLinks ? 'checked' : ''}> PIN für Systemlinks</label>
      <label><input type="checkbox" data-cbool="pinProtect.kioskExit" ${pp.kioskExit ? 'checked' : ''}> PIN für Kiosk-Exit</label>
      <label><input type="checkbox" data-cbool="pinProtect.doorUnlock" ${pp.doorUnlock ? 'checked' : ''}> PIN für Türschlösser</label>
    </div>`);

  // ---------- TAB 2: LAYOUT & SPALTEN ----------
  const dLayout = cfgDraft.dashboardLayout || DEFAULT_DASHBOARD_LAYOUT();
  const layoutRows = dLayout.map((item, li) => `
    <div class="cfg-row" style="background:rgba(255,255,255,.025);padding:10px 12px;border-radius:10px;border:1px solid var(--line);align-items:center">
      <label style="min-width:110px;font-weight:600;cursor:pointer">
        <input type="checkbox" data-dl-i="${li}" data-dl-k="show" ${item.show !== false ? 'checked' : ''}>
        ${item.show !== false ? '👁️ Sichtbar' : '🙈 Ausgeblendet'}
      </label>
      <div style="flex:1.4;min-width:200px;font-weight:600">${esc(DASHBOARD_CARD_LABELS[item.id] || item.label || item.id)}</div>
      ${sel('Spalte auf Startseite', [
        ['1', 'Spalte 1 (Links / Hauptbereich)'],
        ['2', 'Spalte 2 (Rechts / Seitenbereich)'],
        ['3', 'Spalte 3 (nur bei 3-Spalten-Layout)'],
        ['full', 'Volle Breite (über alle Spalten)']
      ].map(([v, l]) => `<option value="${v}" ${String(item.col || '1') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-dl-i="${li}" data-dl-k="col"`)}
      ${sel('Sichtbar in Raum-Tab', [
        ['all', 'In allen Raum-Tabs'],
        ['home', 'Nur im 1. Tab (Home)']
      ].map(([v, l]) => `<option value="${v}" ${(item.scope || 'all') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-dl-i="${li}" data-dl-k="scope"`)}
      <div class="order-btns">
        <button class="btn-move" data-act="cfgMoveDL" data-i="${li}" data-dir="-1" ${li === 0 ? 'disabled' : ''} title="Nach oben">▲</button>
        <button class="btn-move" data-act="cfgMoveDL" data-i="${li}" data-dir="1" ${li === dLayout.length - 1 ? 'disabled' : ''} title="Nach unten">▼</button>
      </div>
    </div>`).join('');

  let tLayout = box('Startseiten-Spalten & Kachel-Anordnung', 'Bestimme frei, wie viele Spalten die Startseite hat und welche Karte in welcher Spalte und Reihenfolge erscheint. Tipp: Über das ✏️-Symbol unten links in der Seitenleiste kannst du Karten auch direkt live auf dem Dashboard verschieben!', `
    <div class="cfg-row" style="margin-bottom:12px">
      ${sel('Spalten-Aufteilung der Startseite', [
        ['2-asym', '2 Spalten asymmetrisch – Links breit (1.55fr), Rechts kompakt (1fr) [Standard]'],
        ['2-equal', '2 Spalten gleich breit (50% / 50%)'],
        ['3-col', '3 Spalten gleich breit (ideal für große Wandtablets / Desktop)'],
        ['1-col', '1 Spalte (alles untereinander)']
      ].map(([v, l]) => `<option value="${v}" ${(cfgDraft.dashboardCols || '2-asym') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-cpath="dashboardCols"`)}
      <button type="button" class="iconbtn" data-act="cfgResetDL" style="align-self:center">↺ Standard-Reihenfolge wiederherstellen</button>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px">${layoutRows}</div>
  `, true) +
  box('Spalten-Anzahl für Klima & Kameras', 'Lege fest, wie viele Spalten auf den Unterseiten „Klima“ und „Kameras“ genutzt werden sollen.', `
    <div class="cfg-row">
      ${sel('Klima-Seite: Spalten', [
        ['auto', 'Automatisch (responsiv nach Bildschirmbreite)'],
        ['1', 'Immer 1 Spalte (untereinander)'],
        ['2', '2 Spalten nebeneinander'],
        ['3', '3 Spalten nebeneinander']
      ].map(([v, l]) => `<option value="${v}" ${String(cfgDraft.klimaCols || 'auto') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-cpath="klimaCols"`)}
      ${sel('Kamera-Seite: Spalten', [
        ['auto', 'Automatisch (responsiv nach Bildschirmbreite)'],
        ['1', 'Immer 1 Spalte (große Streams untereinander)'],
        ['2', '2 Spalten nebeneinander'],
        ['3', '3 Spalten nebeneinander']
      ].map(([v, l]) => `<option value="${v}" ${String(cfgDraft.camCols || 'auto') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-cpath="camCols"`)}
    </div>
    <span class="cfg-desc" style="margin-top:6px;display:block">Hinweis: Die Spalten und Zuordnungen für „Eigene Seiten“ (z.B. A+B in Spalte 1, C in Spalte 2) findest du im Reiter „📄 Eigene Seiten“ oder direkt per Klick auf ✏️ im Quick-Edit-Modus.</span>
  `, true);

  // ---------- TAB 3: RÄUME & BADGES ----------
  let tRaeume = (cfgDraft.rooms || []).map((r, i) => box(`Raum #${i + 1}: ${esc(r.name)}`, 'Hintergrundbild, Kamera-Stream, Raumklima und Temperatur-Badges.', `
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
    `, i === 0, `<div class="order-btns"><button class="btn-move" data-act="cfgMoveRoom" data-i="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMoveRoom" data-i="${i}" data-dir="1" ${i === (cfgDraft.rooms.length - 1) ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelRoom" data-i="${i}">Löschen</button></div>`)).join('') + `<button class="btn-pri" data-act="cfgAddRoom" style="align-self:flex-start">+ Neuen Raum hinzufügen</button>`;

  // ---------- TAB 4: GERÄTE, LICHT & ROLLÄDEN ----------
  const dTabs = cfgDraft.deviceTabs || [];
  if (!dTabs.some(t => t.id === cfgDevSubTab) && cfgDevSubTab !== 'lichter') cfgDevSubTab = dTabs[0] ? dTabs[0].id : 'geraete';

  let tGeraete = `<div class="cfg-subtabs">
    ${dTabs.map((t, ti) => `<div style="display:inline-flex;align-items:center;gap:3px">
      <button class="pill ${cfgDevSubTab === t.id ? 'on' : ''}" data-act="cfgDevTab" data-id="${esc(t.id)}">${esc(t.name)}</button>
      ${dTabs.length > 2 ? `<button class="btn-move" data-act="cfgMoveDevTab" data-i="${ti}" data-dir="-1" ${ti === 0 ? 'disabled' : ''}>◀</button><button class="btn-move" data-act="cfgMoveDevTab" data-i="${ti}" data-dir="1" ${ti === dTabs.length - 1 ? 'disabled' : ''}>▶</button>` : ''}
    </div>`).join('')}
    <button class="pill ${cfgDevSubTab === 'lichter' ? 'on' : ''}" style="background:rgba(255,255,255,.05);border-color:transparent" data-act="cfgDevTab" data-id="lichter">💡 Lichter-Karte</button>
    <button class="iconbtn" data-act="cfgAddDevTab">+ Weiteren Reiter erstellen</button>
  </div>`;

  if (cfgDevSubTab === 'covers') {
    const covs = (cfgDraft.covers || []).map((c, i) => `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px">
        ${fld('Rolladen Name', `data-cv-i="${i}" data-cv-k="name" value="${esc(c.name)}"`)}
        ${fld('Entität (cover.*)', `list="ha-entities-list" data-cv-i="${i}" data-cv-k="entity" value="${esc(c.entity)}"`)}
        <div class="order-btns"><button class="btn-move" data-act="cfgMoveCov" data-i="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMoveCov" data-i="${i}" data-dir="1" ${i === cfgDraft.covers.length - 1 ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelCov" data-i="${i}">✕</button></div>
      </div>`).join('');
    tGeraete += box('Rolläden', 'Zentrale Liste aller Rolläden für das Dashboard.', covs + `<button class="iconbtn" data-act="cfgAddCov" style="margin-top:8px">+ Rolladen hinzufügen</button>`, true);
  } else if (cfgDevSubTab === 'lichter') {
    const lm = cfgDraft.lightsMain || { mode: 'group', group: 0, entities: [] };
    const lmGroupOpts = (cfgDraft.lights || []).map((g, idx) => `<option value="${idx}" ${lm.group == idx ? 'selected' : ''}>${esc(g.name)}</option>`).join('');
    const lightsHtml = (cfgDraft.lights || []).map((g, i) => box(`Gruppe: ${esc(g.name)} (${(g.entities || []).length} Lampen)`, 'Lampen per Klick auswählen – auf dem Dashboard steuerbar inkl. Dimm-/Farb-Popup.', `
      <div class="cfg-row">
        ${fld('Gruppen-Name', `data-l-i="${i}" data-l-k="name" value="${esc(g.name)}"`)}
        <label><input type="checkbox" data-l-i="${i}" data-l-k="mainSync" ${g.mainSync !== false ? 'checked' : ''}> Im „Alle Lichter“-Hauptschalter berücksichtigen</label>
      </div>
      <div style="margin-top:8px">
        <span class="cfg-desc">Zugeordnete Lampen / Schalter:</span>
        ${entityChipsHtml(g.entities || [], 'lightGrp', i, 'light.* oder switch.* auswählen…')}
      </div>`, i === 0, `<div class="order-btns"><button class="btn-move" data-act="cfgMoveLight" data-i="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMoveLight" data-i="${i}" data-dir="1" ${i === cfgDraft.lights.length - 1 ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelLight" data-i="${i}">Löschen</button></div>`)).join('');

    tGeraete += box('Hauptschalter-Verhalten', 'Konfiguriere den Master-Switch oben rechts auf der Lichter-Karte.', `
      <div class="cfg-row">
        ${sel('Modus', `<option value="all" ${lm.mode === 'all' ? 'selected' : ''}>Alle synchronisierten Gruppen steuern</option><option value="group" ${lm.mode === 'group' ? 'selected' : ''}>Eine bestimmte Gruppe steuern</option><option value="custom" ${lm.mode === 'custom' ? 'selected' : ''}>Eigene Entitäten-Auswahl steuern</option>`, `data-lm-k="mode"`)}
        ${lm.mode === 'group' ? sel('Welche Gruppe?', lmGroupOpts, `data-lm-k="group"`) : ''}
      </div>
      ${lm.mode === 'custom' ? `<div style="margin-top:8px"><span class="cfg-desc">Eigene Hauptschalter-Entitäten:</span>${entityChipsHtml(lm.entities || [], 'lightsMain', '', 'light.* oder switch.* auswählen…')}</div>` : ''}`, true) + lightsHtml + `<button class="btn-pri" data-act="cfgAddLight" style="margin-top:10px">+ Neue Licht-Gruppe</button>`;
  } else {
    const activeTabObj = dTabs.find(t => t.id === cfgDevSubTab);
    const roomOpts = `<option value="">— Kein fester Raum —</option>` + (cfgDraft.rooms || []).map(r => `<option value="${esc(r.name)}">${esc(r.name)}</option>`).join('');
    const tabIndices = (cfgDraft.devices || []).map((d, idx) => ((d.tab || 'geraete') === activeTabObj.id ? idx : -1)).filter(idx => idx !== -1);
    const devRows = tabIndices.map((idx, pos) => {
      const d = cfgDraft.devices[idx];
      return `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px;margin-bottom:6px">
        ${fld('Name', `data-d-i="${idx}" data-d-k="name" value="${esc(d.name || '')}"`)}
        ${fld('Raum', `list="cfg-room-names" data-d-i="${idx}" data-d-k="room" value="${esc(d.room || '')}"`)}
        ${sel('Icon', `<option value="">Automatisch</option>` + CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${d.icon === val ? 'selected' : ''}>${lab}</option>`).join(''), `data-d-i="${idx}" data-d-k="icon"`)}
        ${fld('Haupt-Entität', `list="ha-entities-list" data-d-i="${idx}" data-d-k="entity" value="${esc(d.entity || '')}"`)}
        ${fld('Leistungs-Sensor (W)', `list="ha-entities-list" data-d-i="${idx}" data-d-k="power" value="${esc(d.power || '')}"`)}
        ${fld('Energie-Sensor (kWh)', `list="ha-entities-list" data-d-i="${idx}" data-d-k="energy" value="${esc(d.energy || '')}"`)}
        <div class="order-btns"><button class="btn-move" data-act="cfgMoveDevInTab" data-tab="${esc(activeTabObj.id)}" data-pos="${pos}" data-dir="-1" ${pos === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMoveDevInTab" data-tab="${esc(activeTabObj.id)}" data-pos="${pos}" data-dir="1" ${pos === tabIndices.length - 1 ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelDev" data-i="${idx}">✕</button></div>
      </div>`;
    }).join('');

    tGeraete += `<datalist id="cfg-room-names">${(cfgDraft.rooms || []).map(r => `<option value="${esc(r.name)}"></option>`).join('')}</datalist>` +
      box(`Reiter: ${esc(activeTabObj.name)}`, 'Tipp: Ein Klick auf ein Gerät im Dashboard öffnet automatisch das Detail-Popup (Dimmer, Farbe, Medien, Verlauf).', `
      <div class="cfg-row" style="margin-bottom:12px">
        ${fld('Reiter-Name ändern', `data-devtab-name="${esc(activeTabObj.id)}" value="${esc(activeTabObj.name)}"`)}
        ${activeTabObj.id !== 'geraete' ? `<button class="btn-danger" data-act="cfgDelDevTab" data-id="${esc(activeTabObj.id)}">Diesen Reiter komplett löschen</button>` : ''}
      </div>
      ${devRows || '<div class="mut sm">Keine Geräte in diesem Reiter.</div>'}
      <button class="iconbtn" data-act="cfgAddDev" data-tab="${esc(activeTabObj.id)}" style="margin-top:8px">+ Gerät hinzufügen</button>
    `, true);
  }

  // ---------- TAB 5: KLIMA-BAUKASTEN ----------
  let tKlima = box('Globale Klima-Kacheln (Startseite)', 'Diese Kacheln erscheinen unter dem Temperatur-Bogen auf der Startseite.', climateTilesEditorHtml('g'), false) +
    (cfgDraft.climateRooms || []).map((cr, i) => {
      const helperItems = (cr.settings && cr.settings.groups && cr.settings.groups[0] && cr.settings.groups[0].items) || [];
      return box(`Klima-Raum #${i + 1}: ${esc(cr.name)}`, 'Raumkarte auf der Klima-Unterseite (Sensoren, Heizgeräte, 24h-Kurven & Helfer).', `
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
      `, i === 0, `<div class="order-btns"><button class="btn-move" data-act="cfgMoveCRoom" data-i="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMoveCRoom" data-i="${i}" data-dir="1" ${i === cfgDraft.climateRooms.length - 1 ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelCRoom" data-i="${i}">Löschen</button></div>`);
    }).join('') +
    `<button class="btn-pri" data-act="cfgAddCRoom" style="align-self:flex-start">+ Klima-Raum hinzufügen</button>`;

  // ---------- TAB 6: ENERGIE & KALENDER ----------
  let tEnergie = (cfgDraft.metrics || []).map((m, mi) => box(`Metrik: ${esc(m.title || 'Neu')}`, 'Konfiguriere Kacheln wie Strom, PV, Gas oder Wasser.', `
    <div class="cfg-row">
      ${fld('Titel', `data-m-i="${mi}" data-m-k="title" value="${esc(m.title || '')}"`)}
      ${fld('Haupt-Entität (Tageswert)', `list="ha-entities-list" data-m-i="${mi}" data-m-k="entity" value="${esc(m.entity || '')}"`)}
      ${fld('Einheit (z.B. kWh)', `data-m-i="${mi}" data-m-k="unit" value="${esc(m.unit || '')}"`)}
      ${fld('Vortages-Entität (optional)', `list="ha-entities-list" data-m-i="${mi}" data-m-k="yesterdayEntity" value="${esc(m.yesterdayEntity || '')}"`)}
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
    `, mi === 0, `<div class="order-btns"><button class="btn-move" data-act="cfgMoveMetric" data-i="${mi}" data-dir="-1" ${mi === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMoveMetric" data-i="${mi}" data-dir="1" ${mi === cfgDraft.metrics.length - 1 ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelMetric" data-i="${mi}">Löschen</button></div>`)).join('') +
    `<button class="btn-pri" data-act="cfgAddMetric" style="align-self:flex-start">+ Neue Metrik-Kachel</button>` +
    box('Header-Badges (Startseiten-Banner)', 'Dynamische Anzeigen (z.B. PV/Akku, Waschmaschine, Müll) mit visueller Bedingungs-Logik.', `
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
    `) +
    box('Kalender & Power-Flow Kacheln', 'Wähle Kalender-Entitäten und Energiefluss-Sensoren bequem per Klick aus.', `
    <div style="margin-bottom:12px">
      <span class="cfg-desc">Familienkalender (calendar.*):</span>
      ${entityChipsHtml((cfgDraft.calendars || {}).familyEntities || [], 'calFam', '', 'calendar.* auswählen…')}
    </div>
    <div style="margin-bottom:12px">
      <span class="cfg-desc">Abfallkalender (calendar.*):</span>
      ${entityChipsHtml((cfgDraft.calendars || {}).trashEntities || [], 'calTrash', '', 'calendar.* auswählen…')}
    </div>
    <div style="margin-top:12px;padding-top:12px;border-top:1px dashed var(--line)">
      <span class="cfg-desc">Power-Flow Kachel-Sensoren (für native Darstellung):</span>
      ${(cfgDraft.powerFlow || []).map((pf, pfi) => `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px;margin-top:6px">
        ${fld('Bezeichnung', `data-pf-i="${pfi}" data-pf-k="label" value="${esc(pf.label || '')}"`)}
        ${fld('Entität', `list="ha-entities-list" data-pf-i="${pfi}" data-pf-k="entity" value="${esc(pf.entity || '')}"`)}
        ${fld('Einheit', `data-pf-i="${pfi}" data-pf-k="unit" value="${esc(pf.unit || 'W')}"`)}
        ${sel('Icon', CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(pf.icon || 'bolt') === val ? 'selected' : ''}>${lab}</option>`).join(''), `data-pf-i="${pfi}" data-pf-k="icon"`)}
        <button class="btn-danger" data-act="cfgDelPF" data-i="${pfi}">✕</button>
      </div>`).join('')}
      <button class="iconbtn" data-act="cfgAddPF" style="margin-top:6px">+ Power-Flow Sensor hinzufügen</button>
    </div>`);

  // ---------- TAB 7: KAMERAS & SICHERHEIT ----------
  let tKameras = box('Sicherheit & Kameras', 'Türschlösser, Fenstersensoren und hybride Kamera-Streams (lokal go2rtc + unterwegs Home Assistant Proxy).', `
    <span class="cfg-desc">Türschlösser (Reihenfolge anpassbar):</span>
    ${(cfgDraft.security.locks || []).map((lk, i) => `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px;margin-bottom:4px">
      ${fld('Bezeichnung', `data-lk-i="${i}" data-lk-k="name" value="${esc(lk.name || '')}"`)}
      ${fld('Entität (lock.*)', `list="ha-entities-list" data-lk-i="${i}" data-lk-k="entity" value="${esc(lk.entity || '')}"`)}
      <div class="order-btns"><button class="btn-move" data-act="cfgMoveLock" data-i="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMoveLock" data-i="${i}" data-dir="1" ${i === cfgDraft.security.locks.length - 1 ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelLock" data-i="${i}">✕</button></div>
    </div>`).join('')}
    <button class="iconbtn" data-act="cfgAddLock" style="margin-bottom:14px">+ Türschloss hinzufügen</button>

    <div style="margin-bottom:14px">
      <span class="cfg-desc">Fenster- / Türkontakte (binary_sensor.*):</span>
      ${entityChipsHtml(cfgDraft.security.windows || [], 'secWin', '', 'binary_sensor.* auswählen…')}
    </div>

    <div class="cfg-row">
      ${fld('Lokaler go2rtc Host (optional, z.B. http://192.168.178.4:1984)', `data-cpath="go2rtcHost" value="${esc(cfgDraft.go2rtcHost || '')}"`)}
    </div>

    <span class="cfg-desc" style="margin-top:16px;display:block">Kamera-Ansicht (Tipp: Hinterlege die HA Kamera-Entität, damit das Bild auch unterwegs in der Companion App geladen wird!):</span>
    ${(cfgDraft.webrtcCameras || []).map((c, i) => `<div class="cfg-row" style="background:rgba(255,255,255,.02);padding:8px;border-radius:8px;margin-bottom:4px">
      <label><input type="checkbox" data-cam-i="${i}" data-cam-k="show" ${c.show !== false ? 'checked' : ''}> Sichtbar</label>
      ${fld('Kamera-Name', `data-cam-i="${i}" data-cam-k="name" value="${esc(c.name)}"`)}
      ${fld('HA Kamera-Entität (camera.* für App & Unterwegs)', `list="ha-entities-list" data-cam-i="${i}" data-cam-k="entity" value="${esc(c.entity || '')}"`)}
      ${fld('go2rtc Stream-Name (für lokales LAN)', `data-cam-i="${i}" data-cam-k="stream" value="${esc(c.stream || '')}"`)}
      <div class="order-btns"><button class="btn-move" data-act="cfgMoveCam" data-i="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMoveCam" data-i="${i}" data-dir="1" ${i === cfgDraft.webrtcCameras.length - 1 ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelCam" data-i="${i}">✕</button></div>
    </div>`).join('')}
    <button class="iconbtn" data-act="cfgAddCam">+ Kamera hinzufügen</button>`, true);

  // ---------- TAB 8: EIGENE SEITEN ----------
  let tSeiten = (cfgDraft.customPages || []).map((p, pi) => {
    const boxKey = `page_${p.id || pi}`;
    const isOpen = lastOpenedBoxKey ? lastOpenedBoxKey === boxKey : pi === 0;

    return box(`Menü-Seite: ${esc(p.label)}`, 'Konfiguriere Spalten-Layout und Widgets für diese eigene Unterseite.', `
      <div class="cfg-row">
        ${fld('Menü-Name', `data-pg-i="${pi}" data-pg-k="label" value="${esc(p.label)}"`)}
        ${fld('Kleine Dachzeile (Eyebrow)', `data-pg-i="${pi}" data-pg-k="eyebrow" value="${esc(p.eyebrow || '')}"`)}
        ${fld('Überschrift', `data-pg-i="${pi}" data-pg-k="title" value="${esc(p.title || '')}"`)}
        ${sel('Menü-Icon', CHIP_ICON_OPTIONS.map(([val, lab]) => `<option value="${val}" ${(p.icon || 'chart') === val ? 'selected' : ''}>${lab}</option>`).join(''), `data-pg-i="${pi}" data-pg-k="icon"`)}
      </div>
      <div class="cfg-row">
        ${fld('Einleitungstext (Intro)', `data-pg-i="${pi}" data-pg-k="intro" value="${esc(p.intro || '')}"`)}
        ${sel('Seiten-Spaltenlayout', [
          ['grid', 'Automatisches Raster (Nebeneinander)'],
          ['column', '1 Spalte (Alles untereinander)'],
          ['2col', '2 feste Spalten (z.B. Widget A+B in Spalte 1, C in Spalte 2)'],
          ['2col-asym', '2 Spalten asymmetrisch (Links breit, Rechts schmal)'],
          ['3col', '3 feste Spalten (frei zuordenbar)']
        ].map(([v, l]) => `<option value="${v}" ${(p.layout || 'grid') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-pg-i="${pi}" data-pg-k="layout"`)}
      </div>
      <div style="margin-top:12px;padding-top:12px;border-top:1px dashed var(--line)">
        <span class="cfg-desc">Widgets auf dieser Seite (jedes Widget kann einer festen Spalte zugewiesen werden):</span>
        ${(p.widgets || []).map((w, wi) => {
          let extraWidgetCfg = '';
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
              ${fld('Zeitraum in Tagen (z.B. 7 oder 14)', `type="number" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="daysCount" value="${w.daysCount || 7}"`)}
            </div>`;
          } else if (w.type === 'trash') {
            extraWidgetCfg = `<div class="cfg-row" style="margin-top:6px">
              ${fld('Vorschau in Tagen (z.B. 14 oder 30)', `type="number" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="maxDays" value="${w.maxDays || 14}"`)}
              ${fld('Max. Einträge', `type="number" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="maxItems" value="${w.maxItems || 10}"`)}
              ${fld('Untertitel', `data-pg-i="${pi}" data-w-i="${wi}" data-w-k="subtitle" value="${esc(w.subtitle || 'Nächste Abholungen')}"`)}
            </div>`;
          }

          return `<div style="background:rgba(255,255,255,.025);padding:10px;border-radius:10px;border:1px solid var(--line);margin-bottom:8px">
            <div class="cfg-row">
              <label><input type="checkbox" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="show" ${w.show !== false ? 'checked' : ''}> Sichtbar</label>
              ${sel('Widget-Typ', [['entity_info', 'A) Entitäts-Info'], ['stat_group', 'B) 24h Statistik-Kurven'], ['devices', 'C) Geräteliste'], ['calendar', 'D) Familienkalender'], ['trash', 'E) Abfallkalender'], ['todo', 'F) Aufgaben / To-Do'], ['power_flow', 'G) Power Flow (Energiefluss)'], ['weather_forecast', 'H) Wetter 7-Tage'], ['iframe', 'I) Webseite / Iframe'], ['buli_team', 'J) Mein Verein (Teamtracker)'], ['buli_table', 'K) Bundesliga Tabelle'], ['buli_matchday', 'L) Spieltag Übersicht'], ['f1_next', 'M) Formel 1 - Rennen'], ['f1_standings', 'N) Formel 1 - WM']].map(([v, l]) => `<option value="${v}" ${w.type === v ? 'selected' : ''}>${l}</option>`).join(''), `data-pg-i="${pi}" data-w-i="${wi}" data-w-k="type"`)}
              ${sel('Spalten-Zuweisung', [
                ['auto', 'Automatisch einordnen'],
                ['1', 'Immer in Spalte 1'],
                ['2', 'Immer in Spalte 2'],
                ['3', 'Immer in Spalte 3'],
                ['full', 'Volle Seitenbreite']
              ].map(([v, l]) => `<option value="${v}" ${String(w.col || 'auto') === v ? 'selected' : ''}>${l}</option>`).join(''), `data-pg-i="${pi}" data-w-i="${wi}" data-w-k="col"`)}
              ${fld('Titel', `data-pg-i="${pi}" data-w-i="${wi}" data-w-k="title" value="${esc(w.title || '')}"`)}
              ${fld('Haupt-Entität / URL / Raum', `list="ha-entities-list" data-pg-i="${pi}" data-w-i="${wi}" data-w-k="entity" value="${esc(w.entity || w.url || w.room || '')}"`)}
              <div class="order-btns"><button class="btn-move" data-act="cfgMoveWidget" data-pi="${pi}" data-wi="${wi}" data-dir="-1" ${wi === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMoveWidget" data-pi="${pi}" data-wi="${wi}" data-dir="1" ${wi === p.widgets.length - 1 ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelWidget" data-pi="${pi}" data-wi="${wi}">✕</button></div>
            </div>
            ${extraWidgetCfg}
          </div>`;
        }).join('')}
        <button class="iconbtn" data-act="cfgAddWidget" data-pi="${pi}" style="margin-top:6px">+ Widget hinzufügen</button>
      </div>`, isOpen, `<div class="order-btns"><button class="btn-move" data-act="cfgMovePage" data-pi="${pi}" data-dir="-1" ${pi === 0 ? 'disabled' : ''}>▲</button><button class="btn-move" data-act="cfgMovePage" data-pi="${pi}" data-dir="1" ${pi === cfgDraft.customPages.length - 1 ? 'disabled' : ''}>▼</button><button class="btn-danger" data-act="cfgDelPage" data-pi="${pi}">Löschen</button></div>`);
  }).join('') +
  `<button class="btn-pri" data-act="cfgAddPage" style="align-self:flex-start">+ Neue Unterseite anlegen</button>`;

  // ---------- TAB 9: BACKUP ----------
  let tBackup = box('Schnellstart & Automatische Erkennung', 'Lasse deine Home Assistant Räume, Lichter, Klimageräte, Rolläden und Kameras vollautomatisch erkennen oder lade ein Preset.', `
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn-pri" data-act="cfgAutoDiscover">🔍 HA-Räume & Geräte automatisch einlesen</button>
      <button class="iconbtn" data-act="cfgLoadTimoPreset">📦 Timo-Preset laden</button>
      <button class="iconbtn" data-act="cfgLoadEmpty">🧹 Leeres Start-Gerüst laden</button>
    </div>`, true) + box('JSON Export / Import (Backup)', 'Sichere deine komplette Konfiguration als Datei oder spiele ein Backup ein.', `
    <div style="margin-top:10px">
      ${txt('JSON-Code', `id="cfg-json-area" style="font-family:monospace;font-size:12px" rows="12"`, JSON.stringify(cfgDraft, null, 2))}
    </div>
    <div style="display:flex;gap:10px;margin-top:10px">
      <button class="iconbtn" data-act="cfgApplyJson">JSON anwenden</button>
      <button class="iconbtn" data-act="cfgDownloadJson">Als .json speichern</button>
    </div>`, true);

  const tabData = {
    'allgemein': tAllgemein,
    'layout': tLayout,
    'raeume': tRaeume,
    'geraete': tGeraete,
    'klima': tKlima,
    'energie': tEnergie,
    'kameras': tKameras,
    'seiten': tSeiten,
    'backup': tBackup
  };

  const body = tabs.map(([id]) => `<div class="cfg-tab-content" data-tab="${id}" style="display:${(cfgTab === id && !searchVal) || searchVal ? 'flex' : 'none'};flex-direction:column;gap:16px">${tabData[id]}</div>`).join('');

  document.getElementById('cfgsheet').innerHTML = `
    <div class="cfg-hdr">
      <b>Dashboard-Konfigurator</b>
      <div class="cfg-search">${ic('search', 16)}<input type="text" id="cfgSearch" class="cfg-in" placeholder="Suche (Räume, Geräte, Entitäten, Layout...)" autocomplete="off" value="${esc(searchVal)}"></div>
      <button class="x2" data-act="cfgClose">✕</button>
    </div>
    <div class="cfg-tabs" style="display:${searchVal ? 'none' : 'flex'}">${tabBtns}</div>
    <div class="cfg-body">${body}</div>
    <div class="cfg-ftr">
      <span class="mut sm">100% No-Code UI · Änderungen werden direkt in Home Assistant gespeichert.</span>
      <div style="display:flex;gap:10px">
        <button class="iconbtn" data-act="cfgClose">Abbrechen</button>
        <button class="btn-pri" data-act="cfgSave">💾 Speichern & Übernehmen</button>
      </div>
    </div>`;

  const newBody = document.querySelector('#cfgsheet .cfg-body');
  if (newBody && preserveScroll) newBody.scrollTop = prevScroll;

  if (searchVal) {
    const searchInput = document.getElementById('cfgSearch');
    if (searchInput) searchInput.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

function setByPath(obj, path, val) {
  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]]) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = val;
}

document.addEventListener('input', e => {
  const t = e.target;

  if (t.id === 'cfgSearch') {
    const q = t.value.toLowerCase().trim();
    const tabContainer = document.querySelector('.cfg-tabs');
    const contents = document.querySelectorAll('.cfg-tab-content');

    if (q) {
      if (tabContainer) tabContainer.style.display = 'none';
      contents.forEach(c => c.style.display = 'flex');
      document.querySelectorAll('details.cfg-box').forEach(box => {
        const txt = box.textContent.toLowerCase();
        if (txt.includes(q)) {
          box.style.display = 'flex';
          box.open = true;
          box.querySelectorAll('.cfg-row, .cfg-field.float').forEach(r => {
            if (r.classList.contains('cfg-row')) {
              r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none';
            }
          });
        } else {
          box.style.display = 'none';
        }
      });
    } else {
      if (tabContainer) tabContainer.style.display = 'flex';
      contents.forEach(c => c.style.display = c.dataset.tab === cfgTab ? 'flex' : 'none');
      document.querySelectorAll('details.cfg-box').forEach(box => {
        box.style.display = 'flex';
        box.open = false;
        box.querySelectorAll('.cfg-row, .cfg-field.float').forEach(r => r.style.display = '');
      });
      document.querySelectorAll('.cfg-tab-content').forEach(c => {
        const firstBox = c.querySelector('details.cfg-box');
        if (firstBox) firstBox.open = true;
      });
    }
    return;
  }

  if (t.dataset && t.dataset.kind === 'num') {
    const lab = document.querySelector(`.sv[data-v="${t.dataset.ent}"]`);
    if (lab) lab.textContent = `${fmt(parseFloat(t.value), 2)} ${t.dataset.unit || ''}`;
  }
  if (!cfgDraft) return;
  if (t.dataset.cpath) setByPath(cfgDraft, t.dataset.cpath, t.value);
  if (t.dataset.cbool) setByPath(cfgDraft, t.dataset.cbool, t.checked);

  // Dashboard Layout rows
  if (t.dataset.dlI != null) {
    const item = cfgDraft.dashboardLayout[+t.dataset.dlI];
    const k = t.dataset.dlK;
    if (k === 'show') { item.show = t.checked; renderCfgModal(true); }
    else if (k === 'col') item.col = t.value === 'full' ? 'full' : (parseInt(t.value, 10) || 1);
    else item[k] = t.value;
  }

  if (t.dataset.wiI != null) {
    const item = cfgDraft.weather.items[+t.dataset.wiI];
    const k = t.dataset.wiK;
    item[k] = k === 'decimals' ? parseInt(t.value, 10) || 0 : t.value;
  }
  if (t.dataset.rI != null) cfgDraft.rooms[+t.dataset.rI][t.dataset.rK] = t.value;
  if (t.dataset.rBoolI != null) {
    cfgDraft.rooms[+t.dataset.rBoolI][t.dataset.rBoolK] = t.checked;
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
  if (t.dataset.pgI != null && t.dataset.wI != null) {
    const w = cfgDraft.customPages[+t.dataset.pgI].widgets[+t.dataset.wI];
    const k = t.dataset.wK;
    if (k === 'show') w.show = t.checked;
    else if (k === 'daysCount' || k === 'maxDays' || k === 'maxItems') w[k] = parseInt(t.value, 10) || 7;
    else if (k === 'entity') {
      if (w.type === 'iframe') w.url = t.value;
      else if (w.type === 'devices') w.room = t.value;
      else w.entity = t.value;
    } else if (k === 'cardConfig') {
      try { w.cardConfig = t.value.trim() ? JSON.parse(t.value) : null; } catch (_) {}
    } else {
      w[k] = t.value;
      if (k === 'type') renderCfgModal(true);
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
        } catch (err) { toast('Upload fehlgeschlagen'); }
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

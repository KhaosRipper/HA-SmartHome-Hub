/* ==========================================================================
   Smart Home Hub – Charts, Verläufe, Wettervorhersage & Detail-Modals (charts.js)
   ========================================================================== */

/* ---------- Wettervorhersage-State (Täglich & Stündlich für Popup) ---------- */
const weatherForecastState = {
  loading: false, loadedAt: 0, entity: '',
  days: [], hourly: [], error: '',
  tab: 'temp', selectedDay: 0
};

async function refreshWeatherForecast(force = false) {
  const wCfg = CONFIG.weather || {};
  const fcEntity = (wCfg.forecastEntity || wCfg.entity || '').trim();
  if (!fcEntity) return;
  if (!force && weatherForecastState.entity === fcEntity && weatherForecastState.loadedAt && Date.now() - weatherForecastState.loadedAt < 15 * 60 * 1000) return;

  if (DEMO) {
    const conds = ['rainy', 'rainy', 'cloudy', 'partlycloudy', 'partlycloudy', 'sunny', 'partlycloudy', 'partlycloudy'];
    const now = new Date();
    weatherForecastState.days = Array.from({ length: 8 }, (_, i) => {
      const d = new Date(now.getTime() + i * 86400000);
      return {
        datetime: d.toISOString(),
        condition: conds[i % conds.length],
        temperature: [12, 14, 13, 19, 14, 15, 14, 13][i],
        templow: [8, 9, 8, 8, 6, 5, 4, 4][i],
        precipitation_probability: [68, 75, 25, 15, 40, 10, 15, 20][i],
        precipitation: [1.7, 9.1, 0.1, 0, 1.2, 0, 0, 0][i],
        wind_speed: [18, 24, 15, 12, 20, 14, 11, 13][i],
        wind_bearing: [210, 225, 190, 180, 240, 90, 85, 110][i]
      };
    });
    weatherForecastState.hourly = Array.from({ length: 8 * 24 }, (_, idx) => {
      const t = new Date(now.getTime() + idx * 3600000);
      const hr = t.getHours();
      return {
        datetime: t.toISOString(),
        condition: conds[Math.floor(idx / 24) % conds.length],
        temperature: Math.round(10 + Math.sin((hr - 6) / 24 * Math.PI * 2) * 4),
        precipitation_probability: Math.round(clamp(35 + Math.sin(idx / 4) * 35, 0, 100)),
        precipitation: Math.max(0, +(Math.sin(idx / 5) * 1.2).toFixed(1)),
        wind_speed: Math.round(14 + Math.sin(idx / 3) * 12),
        wind_bearing: (180 + idx * 15) % 360
      };
    });
    weatherForecastState.entity = fcEntity;
    weatherForecastState.error = '';
    weatherForecastState.loadedAt = Date.now();
    return;
  }

  const h = getHass();
  if (!h || weatherForecastState.loading) return;
  weatherForecastState.loading = true;
  weatherForecastState.error = '';

  const fetchType = async (fType) => {
    if (typeof h.callWS === 'function') {
      try {
        const res = await h.callWS({
          type: 'call_service',
          domain: 'weather',
          service: 'get_forecasts',
          service_data: { type: fType },
          target: { entity_id: fcEntity },
          return_response: true
        });
        const resp = (res && res.response) || res || {};
        const entData = resp[fcEntity] || Object.values(resp)[0];
        if (entData && Array.isArray(entData.forecast) && entData.forecast.length) return entData.forecast;
      } catch (_) {}
    }
    if (typeof h.callApi === 'function') {
      try {
        const res = await h.callApi('POST', 'services/weather/get_forecasts?return_response', { entity_id: fcEntity, type: fType });
        const resp = (res && res.service_response) || res || {};
        const entData = resp[fcEntity] || Object.values(resp)[0];
        if (entData && Array.isArray(entData.forecast) && entData.forecast.length) return entData.forecast;
      } catch (_) {}
    }
    return [];
  };

  try {
    let [dailyList, hourlyList] = await Promise.all([fetchType('daily'), fetchType('hourly')]);
    if (!dailyList.length) dailyList = await fetchType('twice_daily');
    if (!dailyList.length) {
      const st = S(fcEntity);
      if (st && st.attributes && Array.isArray(st.attributes.forecast)) dailyList = st.attributes.forecast;
    }

    if (!dailyList.length && hourlyList.length) {
      const byDay = new Map();
      hourlyList.forEach(item => {
        const dayKey = String(item.datetime || '').slice(0, 10);
        if (!dayKey) return;
        if (!byDay.has(dayKey)) {
          byDay.set(dayKey, { ...item, templow: item.templow ?? item.temperature });
        } else {
          const cur = byDay.get(dayKey);
          if (item.temperature != null) {
            cur.temperature = Math.max(cur.temperature ?? item.temperature, item.temperature);
            cur.templow = Math.min(cur.templow ?? item.temperature, item.templow ?? item.temperature);
          }
          if (item.precipitation != null) cur.precipitation = (cur.precipitation || 0) + Number(item.precipitation || 0);
          if (item.precipitation_probability != null) cur.precipitation_probability = Math.max(cur.precipitation_probability || 0, item.precipitation_probability);
          if (item.wind_speed != null) cur.wind_speed = Math.max(cur.wind_speed || 0, item.wind_speed);
        }
      });
      dailyList = Array.from(byDay.values());
    }

    weatherForecastState.days = dailyList.slice(0, 8);
    weatherForecastState.hourly = hourlyList;
    weatherForecastState.entity = fcEntity;
    weatherForecastState.loadedAt = Date.now();
    if (weatherForecastState.selectedDay >= weatherForecastState.days.length) weatherForecastState.selectedDay = 0;
  } catch (err) {
    weatherForecastState.error = `Vorhersage nicht abrufbar (${fcEntity}).`;
    weatherForecastState.loadedAt = Date.now();
  } finally {
    weatherForecastState.loading = false;
    if (sm.open && sm.mode === 'weather') renderWeatherModal();
    tick(true);
  }
}

/* Baut 8 Zeitpunkte (3-Stunden-Raster) für den ausgewählten Tag im Popup */
function getSlotsForSelectedDay() {
  const days = weatherForecastState.days || [];
  const selDay = days[weatherForecastState.selectedDay] || days[0];
  if (!selDay) return [];

  const targetDateStr = String(selDay.datetime || '').slice(0, 10);
  const hourly = weatherForecastState.hourly || [];

  let dayHours = hourly.filter(h => String(h.datetime || '').slice(0, 10) === targetDateStr);
  if (weatherForecastState.selectedDay === 0 && dayHours.length < 6 && hourly.length >= 8) {
    dayHours = hourly.slice(0, 24);
  }

  if (dayHours.length >= 4) {
    const out = [];
    const step = Math.max(1, Math.floor(dayHours.length / 8));
    for (let i = 0; i < dayHours.length && out.length < 8; i += step) {
      const it = dayHours[i];
      const dt = new Date(it.datetime);
      out.push({
        time: `${pad(dt.getHours())}:00`,
        temp: Math.round(Number(it.temperature ?? selDay.temperature ?? 15)),
        rainPct: it.precipitation_probability != null
          ? Math.round(Number(it.precipitation_probability))
          : (it.precipitation != null ? Math.min(100, Math.round(Number(it.precipitation) * 25)) : 0),
        rainMm: Number(it.precipitation ?? 0),
        wind: Math.round(Number(it.wind_speed ?? selDay.wind_speed ?? 10)),
        bearing: Number(it.wind_bearing ?? selDay.wind_bearing ?? 200),
        condition: it.condition || selDay.condition
      });
    }
    return out;
  }

  const tMax = Number(selDay.temperature ?? 16);
  const tMin = Number(selDay.templow ?? (tMax - 6));
  const baseRainPct = selDay.precipitation_probability != null
    ? Number(selDay.precipitation_probability)
    : (selDay.precipitation ? Math.min(95, Math.round(Number(selDay.precipitation) * 20)) : 10);
  const baseWind = Number(selDay.wind_speed ?? 14);
  const baseBear = Number(selDay.wind_bearing ?? 215);
  const hours = ['01:00', '04:00', '07:00', '10:00', '13:00', '16:00', '19:00', '22:00'];
  const curve = [0.15, 0.0, 0.25, 0.65, 0.95, 1.0, 0.65, 0.3];

  return hours.map((hStr, i) => ({
    time: hStr,
    temp: Math.round(tMin + (tMax - tMin) * curve[i]),
    rainPct: Math.round(clamp(baseRainPct * (0.6 + Math.sin(i) * 0.4), 0, 100)),
    rainMm: +(Number(selDay.precipitation || 0) / 8).toFixed(1),
    wind: Math.round(baseWind * (0.75 + curve[i] * 0.4)),
    bearing: (baseBear + (i - 3) * 10 + 360) % 360,
    condition: selDay.condition
  }));
}

function renderWeatherChartSVG(slots, tab) {
  if (!slots.length) return '<div class="mut sm" style="padding:30px 0;text-align:center">Keine Verlaufsdaten verfügbar</div>';
  const W = 680, H = 140, padL = 32, padR = 32, padT = 28, padB = 28;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const X = i => padL + (i * plotW / Math.max(1, slots.length - 1));

  if (tab === 'temp') {
    const temps = slots.map(s => s.temp);
    const minT = Math.min(...temps) - 2, maxT = Math.max(...temps) + 2;
    const Y = v => padT + plotH * (1 - (v - minT) / Math.max(1, maxT - minT));
    const pts = slots.map((s, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(s.temp).toFixed(1)}`).join(' ');
    const area = `${pts} L${X(slots.length - 1).toFixed(1)},${H - padB} L${X(0).toFixed(1)},${H - padB} Z`;
    const labels = slots.map((s, i) => `
      <text x="${X(i).toFixed(1)}" y="${(Y(s.temp) - 10).toFixed(1)}" text-anchor="middle" fill="#f2f3fa" font-size="12" font-weight="700">${s.temp}</text>
      <text x="${X(i).toFixed(1)}" y="${H - 6}" text-anchor="middle" fill="#8b8fa8" font-size="11">${s.time}</text>`).join('');
    return `<div class="wfc-chart-wrap"><svg viewBox="0 0 ${W} ${H}">
      <defs><linearGradient id="wfcTempG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f59e0b" stop-opacity=".38"/><stop offset="1" stop-color="#f59e0b" stop-opacity=".03"/></linearGradient></defs>
      <path d="${area}" fill="url(#wfcTempG)"/>
      <path d="${pts}" fill="none" stroke="#facc15" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      ${labels}
    </svg></div>`;
  }

  if (tab === 'rain') {
    const colW = plotW / slots.length;
    const bars = slots.map((s, i) => {
      const pct = clamp(s.rainPct, 0, 100);
      const bh = Math.max(3, (pct / 100) * plotH);
      const x0 = padL + i * colW;
      const y0 = padT + (plotH - bh);
      const cx = x0 + colW / 2;
      return `
        <rect x="${(x0 + 2).toFixed(1)}" y="${y0.toFixed(1)}" width="${(colW - 4).toFixed(1)}" height="${bh.toFixed(1)}" fill="rgba(56,189,248,.18)"/>
        <line x1="${(x0 + 2).toFixed(1)}" x2="${(x0 + colW - 2).toFixed(1)}" y1="${y0.toFixed(1)}" y2="${y0.toFixed(1)}" stroke="#38bdf8" stroke-width="2.5"/>
        <text x="${cx.toFixed(1)}" y="${padT - 8}" text-anchor="middle" fill="#7dd3fc" font-size="11" font-weight="700">${pct}%</text>
        <text x="${cx.toFixed(1)}" y="${H - 6}" text-anchor="middle" fill="#8b8fa8" font-size="11">${s.time}</text>`;
    }).join('');
    return `<div class="wfc-chart-wrap"><svg viewBox="0 0 ${W} ${H}">${bars}</svg></div>`;
  }

  const cols = slots.map(s => `
    <div class="wfc-wind-col">
      <div class="wfc-wind-val">${s.wind} km/h</div>
      <div class="wfc-wind-arr" style="transform:rotate(${(s.bearing + 180) % 360}deg)" title="Windrichtung ${Math.round(s.bearing)}°">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
      </div>
      <div class="wfc-wind-time">${s.time}</div>
    </div>`).join('');
  return `<div class="wfc-wind-grid">${cols}</div>`;
}

function renderWeatherModal() {
  const wCfg = CONFIG.weather || {};
  const fcEntity = (wCfg.forecastEntity || wCfg.entity || '').trim();
  const s = fcEntity ? S(fcEntity) : null;
  const a = (s && s.attributes) || {};

  const days = weatherForecastState.days || [];
  const selIdx = clamp(weatherForecastState.selectedDay, 0, Math.max(0, days.length - 1));
  const selDay = days[selIdx] || {};
  const slots = getSlotsForSelectedDay();

  let topTemp = selIdx === 0 && wCfg.tempEntity && num(wCfg.tempEntity) != null
    ? num(wCfg.tempEntity)
    : (selIdx === 0 && a.temperature != null ? Number(a.temperature) : Number(selDay.temperature ?? 15));
  const topCond = selDay.condition || (s && s.state) || 'partlycloudy';
  const topSym = WEATHER_SYMBOLS[topCond] || '🌤️';
  const topCondText = WEATHER_CONDITIONS_DE[topCond] || topCond;

  const rainProb = selDay.precipitation_probability != null
    ? `${fmt(Number(selDay.precipitation_probability), 0)}%`
    : (selDay.precipitation != null ? `${fmt(Number(selDay.precipitation), 1)} mm` : '0%');
  const humid = selIdx === 0 && a.humidity != null ? `${fmt(Number(a.humidity), 0)}%` : (selDay.humidity != null ? `${fmt(Number(selDay.humidity), 0)}%` : '—');
  const windVal = selDay.wind_speed != null ? `${fmt(Number(selDay.wind_speed), 0)} ${a.wind_speed_unit || 'km/h'}` : (a.wind_speed != null ? `${fmt(Number(a.wind_speed), 0)} km/h` : '—');

  const dtObj = selDay.datetime ? new Date(selDay.datetime) : new Date();
  const dayLong = selIdx === 0
    ? dtObj.toLocaleDateString('de-DE', { weekday: 'long' }) + ', ' + new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    : dtObj.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit' });

  const daysStrip = days.slice(0, 8).map((d, i) => {
    const dt = d.datetime ? new Date(d.datetime) : new Date(Date.now() + i * 86400000);
    const shortDay = dt.toLocaleDateString('de-DE', { weekday: 'short' });
    const sym = WEATHER_SYMBOLS[d.condition] || '🌤️';
    const hi = d.temperature != null ? `${fmt(Number(d.temperature), 0)}°` : '—';
    const lo = d.templow != null ? `<span>${fmt(Number(d.templow), 0)}°</span>` : '';
    return `<button class="wfc-day ${i === selIdx ? 'on' : ''}" data-act="wfcDay" data-i="${i}">
      <div class="wfc-day-name">${esc(shortDay)}</div>
      <div class="wfc-day-ico">${sym}</div>
      <div class="wfc-day-t">${hi}${lo}</div>
    </button>`;
  }).join('');

  const sheet = document.getElementById('smsheet');
  sheet.classList.add('wfc-wide');
  sheet.innerHTML = `
    <div class="smh" style="margin-bottom:10px">
      <b>${esc(wCfg.forecastTitle || 'Wettervorhersage')}</b>
      <button class="x2" data-act="smClose">✕</button>
    </div>
    <div class="wfc-top">
      <div class="wfc-top-left">
        <div class="wfc-big-ico">${topSym}</div>
        <div class="wfc-big-temp">${fmt(topTemp, 0)}<sup>${esc(wCfg.tempUnit || '°C')}</sup></div>
        <div class="wfc-meta">
          <span>Niederschlag: ${esc(rainProb)}</span>
          <span>Luftfeuchte: ${esc(humid)}</span>
          <span>Wind: ${esc(windVal)}</span>
        </div>
      </div>
      <div class="wfc-top-right">
        <h3>${esc(wCfg.title || 'Wetter')}${wCfg.label ? ' · ' + esc(wCfg.label) : ''}</h3>
        <div>${esc(dayLong)}</div>
        <div>${esc(topCondText)}</div>
      </div>
    </div>
    <div class="wfc-tabs">
      <button class="wfc-tab ${weatherForecastState.tab === 'temp' ? 'on' : ''}" data-act="wfcTab" data-tab="temp">Temperatur</button>
      <button class="wfc-tab ${weatherForecastState.tab === 'rain' ? 'on' : ''}" data-act="wfcTab" data-tab="rain">Niederschlag</button>
      <button class="wfc-tab ${weatherForecastState.tab === 'wind' ? 'on' : ''}" data-act="wfcTab" data-tab="wind">Wind</button>
    </div>
    ${renderWeatherChartSVG(slots, weatherForecastState.tab)}
    <div class="wfc-days">${daysStrip || '<div class="mut sm">Lade Vorhersagedaten…</div>'}</div>`;
}

function openWeatherModal() {
  sm.mode = 'weather';
  sm.open = true;
  refreshWeatherForecast();
  renderWeatherModal();
  document.getElementById('sm').classList.add('show');
}

/* ---------- Verlaufsdaten (5-Minuten-Auflösung) ---------- */
function seriesPointDate(i, len, range7 = false) {
  const totalSpanMs = range7 ? 168 * 3600e3 : 24 * 3600e3;
  const stepMs = totalSpanMs / Math.max(1, len - 1);
  return new Date(Date.now() - (len - 1 - i) * stepMs);
}

async function loadSeries(id, mode, hours, attr, offsetDays = 0) {
  if (!id) return null;
  const realNow = new Date();
  const now = new Date(realNow.getTime() - (offsetDays * 86400000));
  const start = new Date(now);
  const useHours = hours || (offsetDays > 0 ? 24 : Math.max(24, realNow.getHours() + 1));
  const stepMin = useHours <= 24 ? 5 : 60;
  const stepMs = stepMin * 60 * 1000;

  start.setTime(now.getTime() - useHours * 3600e3);
  start.setTime(Math.floor(start.getTime() / stepMs) * stepMs);

  const n = Math.floor((now.getTime() - start.getTime()) / stepMs) + 1;

  if (DEMO) {
    let v = 5;
    return Array.from({ length: n }, (_, i) => {
      if (useHours <= 24) {
        const t = (i + offsetDays * 288) / 24;
        return +(21 + Math.sin(t) * 1.5 + Math.cos(t * 2.5) * 0.3).toFixed(2);
      }
      return mode === 'last' ? (v += 8) : +(300 + Math.sin(i / 2) * 180).toFixed(1);
    });
  }

  const h = getHass(); if (!h) return null;
  const url = `history/period/${start.toISOString()}?filter_entity_id=${id}&end_time=${encodeURIComponent(now.toISOString())}${attr ? '' : '&minimal_response&no_attributes'}`;
  const res = await h.callApi('GET', url);
  const arr = (res && res[0]) || [];
  const pts = arr.map(p => ({
    t: new Date(p.last_changed || p.last_updated).getTime(),
    v: parseFloat(attr ? (p.attributes && p.attributes[attr]) : p.state)
  })).filter(p => !isNaN(p.v));
  if (!pts.length) return null;

  const out = []; let prev = null;
  for (let i = 0; i < n; i++) {
    const a = start.getTime() + i * stepMs, b = a + stepMs;
    const inB = pts.filter(p => p.t >= a && p.t < b);
    const before = pts.filter(p => p.t < a).pop();
    if (before) prev = before.v;
    let val = prev;
    if (inB.length) val = mode === 'last' ? inB[inB.length - 1].v : inB.reduce((s, p) => s + p.v, 0) / inB.length;
    if (val != null) prev = val;
    out.push(val != null ? +val.toFixed(2) : null);
  }
  return out;
}

async function loadYesterdayMetric(m) {
  if (m.yesterdayEntity) {
    const val = num(m.yesterdayEntity);
    if (val != null) return val;
  }
  if (DEMO) return m.id === 'energy' ? 13.48 : 171.4;
  const h = getHass(); if (!h || !m.entity) return null;
  const end = new Date(Date.now() - 24 * 3600e3);
  const start = new Date(end.getTime() - 24 * 3600e3);
  const url = `history/period/${start.toISOString()}?filter_entity_id=${m.entity}&end_time=${encodeURIComponent(end.toISOString())}&minimal_response&no_attributes`;
  const res = await h.callApi('GET', url);
  const arr = (res && res[0]) || [];
  const pts = arr.map(p => parseFloat(p.state)).filter(v => Number.isFinite(v));
  return pts.length ? pts[pts.length - 1] : null;
}

async function refreshSeries() {
  for (const m of CONFIG.metrics || []) {
    if (m.chart) {
      try {
        series[m.chart] = await loadSeries(m.chart, m.mode || 'avg');
        series[m.chart + '_yest'] = await loadSeries(m.chart, m.mode || 'avg', 0, null, 1);
      } catch (e) {}
    }
    if (m.subButtons) {
      for (const btn of m.subButtons) {
        for (const ent of btn.entities || []) {
          if (ent.chart && ent.entity) {
            try {
              series['sub:' + ent.entity] = await loadSeries(ent.entity, 'avg');
              series['sub:' + ent.entity + '_yest'] = await loadSeries(ent.entity, 'avg', 0, null, 1);
            } catch (e) {}
          }
        }
      }
    }
    try { yesterdayMetricVals[m.id] = await loadYesterdayMetric(m); } catch (e) {}
  }
  for (const r of CONFIG.climateRooms || []) for (const c of r.charts || []) {
    const key = '24:' + c.entity + (c.attr ? ':' + c.attr : '');
    try { series[key] = await loadSeries(c.entity, 'avg', 24, c.attr); } catch (e) {}
  }
  await refreshCustomPageSeries(false);
  ui.seriesVer++;
  if (sm.open && sm.mode === 'metric') renderChartModal();
  tick(true);
}

async function refreshCustomPageSeries(redraw = true) {
  const statWidgets = (CONFIG.customPages || []).flatMap(p => p.widgets || []).filter(w => w.type === 'stat_group');
  const statItems = statWidgets.flatMap(w => w.items || []);
  await Promise.all(statItems.map(async item => {
    if (!item.entity) return;
    const key = 'stats:' + item.entity + (item.attr ? ':' + item.attr : '');
    try { series[key] = await loadSeries(item.entity, item.mode || 'avg', 24, item.attr); } catch (e) {}
  }));
  if (redraw) { ui.seriesVer++; tick(true); }
}

/* ---------- Sparkline-Rendering mit Scrubber ---------- */
const sparkData = {};

function spark(ser, id, opt = {}, ser2 = null) {
  const ok1 = ser && ser.filter(v => v != null).length >= 2;
  const ok2 = ser2 && ser2.filter(v => v != null).length >= 2;
  if (!ok1 && !ok2) return '<div class="mut sm" style="padding:20px 0;text-align:center">Keine Verlaufsdaten</div>';

  const getVals = s => {
    if (!s) return [];
    let last = s.find(v => v != null) || 0;
    return s.map(v => { if (v != null) last = v; return last; });
  };

  const vals1 = getVals(ser), vals2 = getVals(ser2), allVals = [...vals1, ...vals2];
  const mn0 = Math.min(...allVals), mx0 = Math.max(...allVals);
  let lo, hi;
  if (opt.fit) {
    if (opt.min != null && opt.max != null) { lo = Math.min(opt.min, mn0); hi = Math.max(opt.max, mx0); }
    else { const p = ((mx0 - mn0) || 1) * 0.2; lo = mn0 - p; hi = mx0 + p; }
  } else { lo = Math.min(0, mn0); hi = mx0 === lo ? lo + 1 : mx0 * 1.1; }

  const W = opt.W || 340, H = opt.H || 110, pr = 42, pt = 14, pb = 26;
  const dec = opt.dec ?? ((opt.fit ? hi - lo : hi) > 20 ? 0 : 1), pw = W - pr, gid = 'sg' + safeId(id);
  const lineColor = opt.color || '#8f81ff', fillColor = opt.color || '#7c6cf0';
  const Y = v => pt + (H - pt - pb) * (1 - (v - lo) / (hi - lo || 1));

  sparkData[gid] = {
    vals1, vals2, opt, pw, W, H, pt, pb, lo, hi, dec,
    unit: opt.unit || '',
    range7: !!opt.range7
  };

  let svgContent = [hi, (hi + lo) / 2, lo].map(v =>
    `<line x1="0" x2="${pw}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}" stroke="rgba(255,255,255,.07)"/><text x="${W}" y="${(Y(v) + 3).toFixed(1)}" text-anchor="end" fill="#8b8fa8" font-size="9">${fmt(v, dec)}</text>`
  ).join('');

  if (vals2.length) {
    const X2 = i => i * pw / (vals2.length - 1 || 1);
    const line2 = vals2.map((v, i) => `${i ? 'L' : 'M'}${X2(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
    svgContent += `<path d="${line2}" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="2" stroke-dasharray="4 4" stroke-linejoin="round"/>`;
  }

  if (vals1.length) {
    const X1 = i => i * pw / (vals1.length - 1 || 1);
    const line1 = vals1.map((v, i) => `${i ? 'L' : 'M'}${X1(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
    const area1 = `${line1} L${X1(vals1.length - 1).toFixed(1)},${H - pb} L0,${H - pb} Z`;
    const lx = X1(vals1.length - 1), ly = Y(vals1[vals1.length - 1]);
    svgContent += `<path d="${area1}" fill="url(#${gid})"/><path d="${line1}" fill="none" stroke="${lineColor}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" r="4" fill="#fff" stroke="${fillColor}" stroke-width="2"/>`;
  }

  const timeLabels = opt.range7 ? vals1.map((_, i) => {
    const dt = seriesPointDate(i, vals1.length, true);
    const prevDt = i > 0 ? seriesPointDate(i - 1, vals1.length, true) : null;
    if (prevDt && prevDt.getDate() === dt.getDate()) return '';
    const x = i * pw / (vals1.length - 1 || 1);
    const tx = Math.min(pw - 14, Math.max(14, x));
    return `<line x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${pt}" y2="${H - pb}" stroke="rgba(255,255,255,.06)"/><text x="${tx.toFixed(1)}" y="${H - 6}" text-anchor="middle" fill="#8b8fa8" font-size="10">${esc(dt.toLocaleDateString('de-DE', { weekday: 'short' }))}</text>`;
  }).join('') : vals1.map((_, i) => {
    const dt = seriesPointDate(i, vals1.length, false);
    const prevDt = i > 0 ? seriesPointDate(i - 1, vals1.length, false) : null;
    const isHourMark = (!prevDt || prevDt.getHours() !== dt.getHours()) && (dt.getHours() % 4 === 0) && (dt.getMinutes() === 0 || dt.getMinutes() < 6);
    const isLast = i === vals1.length - 1;
    if (isHourMark || isLast) {
      const x = (i * pw / (vals1.length - 1 || 1)).toFixed(1);
      return `<text x="${x}" y="${H - 6}" text-anchor="middle" fill="#8b8fa8" font-size="10">${pad(dt.getHours())}:00</text>`;
    }
    return '';
  }).join('');

  const scrubberUI = `
    <g class="scrubber-ui" id="scrub-${gid}" style="display:none;pointer-events:none">
      <line class="scrub-line" x1="0" y1="${pt}" x2="0" y2="${H - pb}" stroke="rgba(255,255,255,.7)" stroke-width="1.5" stroke-dasharray="3 3"/>
      <circle class="scrub-dot2" cx="0" cy="0" r="3.5" fill="rgba(255,255,255,.7)" stroke="#8b8fa8" stroke-width="1.5" style="display:none"/>
      <circle class="scrub-dot1" cx="0" cy="0" r="5" fill="#fff" stroke="${lineColor}" stroke-width="2.5"/>
      <g class="scrub-tip" transform="translate(0, 0)">
        <rect class="scrub-tip-bg" x="-45" y="-32" width="90" height="28" rx="6" fill="#12132a" stroke="rgba(255,255,255,.2)" stroke-width="1"/>
        <text class="scrub-tip-txt1" x="0" y="-18" text-anchor="middle" fill="#f2f3fa" font-size="11" font-weight="700">0</text>
        <text class="scrub-tip-txt2" x="0" y="-7" text-anchor="middle" fill="#8b8fa8" font-size="9">00:00</text>
      </g>
    </g>
    <rect class="scrub-overlay" data-spark-id="${gid}" data-act="chartScrubClick" x="0" y="0" width="${pw}" height="${H}" fill="transparent" style="cursor:crosshair;touch-action:pan-y"/>
  `;

  return `<svg viewBox="0 0 ${W} ${H}" class="spark-svg" data-spark-id="${gid}" style="width:100%;height:auto;overflow:visible"><defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${fillColor}" stop-opacity=".45"/><stop offset="1" stop-color="${fillColor}" stop-opacity="0"/></linearGradient></defs>${svgContent}${timeLabels}${scrubberUI}</svg>`;
}

/* ---------- Scrubber Interaktion (Mouse & Touch) ---------- */
function updateChartScrubber(e, overlay) {
  const el = overlay || e.target.closest('.scrub-overlay');
  if (!el) return;
  const gid = el.dataset.sparkId;
  const meta = sparkData[gid];
  if (!meta || !meta.vals1 || !meta.vals1.length) return;

  const svg = el.closest('svg');
  if (!svg) return;
  const scrubGroup = svg.querySelector('.scrubber-ui');
  if (!scrubGroup) return;

  const rect = el.getBoundingClientRect();
  const relX = clamp(e.clientX - rect.left, 0, rect.width);
  const frac = rect.width > 0 ? relX / rect.width : 0;

  const totalPts = meta.vals1.length;
  const idx = clamp(Math.round(frac * (totalPts - 1)), 0, totalPts - 1);
  const val1 = meta.vals1[idx];
  const val2 = meta.vals2 && meta.vals2.length > idx ? meta.vals2[idx] : null;

  const X = idx * meta.pw / (totalPts - 1 || 1);
  const Y1 = meta.pt + (meta.H - meta.pt - meta.pb) * (1 - (val1 - meta.lo) / (meta.hi - meta.lo || 1));

  const line = scrubGroup.querySelector('.scrub-line');
  line.setAttribute('x1', X.toFixed(1));
  line.setAttribute('x2', X.toFixed(1));

  const dot1 = scrubGroup.querySelector('.scrub-dot1');
  dot1.setAttribute('cx', X.toFixed(1));
  dot1.setAttribute('cy', Y1.toFixed(1));

  const dot2 = scrubGroup.querySelector('.scrub-dot2');
  if (val2 != null && dot2) {
    const Y2 = meta.pt + (meta.H - meta.pt - meta.pb) * (1 - (val2 - meta.lo) / (meta.hi - meta.lo || 1));
    dot2.setAttribute('cx', X.toFixed(1));
    dot2.setAttribute('cy', Y2.toFixed(1));
    dot2.style.display = '';
  } else if (dot2) {
    dot2.style.display = 'none';
  }

  const dt = seriesPointDate(idx, totalPts, meta.range7);
  const timeStr = meta.range7
    ? `${dt.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' })}, ${pad(dt.getHours())}:${pad(dt.getMinutes())}`
    : `${pad(dt.getHours())}:${pad(dt.getMinutes())} Uhr`;

  let valStr = `${fmt(val1, meta.dec)} ${meta.unit}`.trim();
  if (val2 != null) {
    valStr += ` (Gestern: ${fmt(val2, meta.dec)})`;
  }

  const tip = scrubGroup.querySelector('.scrub-tip');
  const tipTxt1 = tip.querySelector('.scrub-tip-txt1');
  const tipTxt2 = tip.querySelector('.scrub-tip-txt2');
  const tipBg = tip.querySelector('.scrub-tip-bg');

  tipTxt1.textContent = valStr;
  tipTxt2.textContent = timeStr;

  const textWidth = Math.max(90, Math.max(valStr.length * 7.2, timeStr.length * 6.5) + 18);
  tipBg.setAttribute('width', textWidth);
  tipBg.setAttribute('x', -textWidth / 2);

  const tipX = clamp(X, textWidth / 2 + 4, meta.pw - textWidth / 2 - 4);
  const tipY = (Y1 > 40) ? (Y1 - 8) : (Y1 + 38);
  tip.setAttribute('transform', `translate(${tipX.toFixed(1)}, ${tipY.toFixed(1)})`);

  scrubGroup.style.display = '';
}

function hideAllChartScrubbers() {
  document.querySelectorAll('.scrubber-ui').forEach(el => { el.style.display = 'none'; });
}

let scrubActive = false;
let scrubStartX = 0;
let scrubStartY = 0;
let scrubMoved = false;

document.addEventListener('pointerdown', ev => {
  const overlay = ev.target.closest('.scrub-overlay');
  if (!overlay) return;
  scrubActive = true;
  scrubMoved = false;
  scrubStartX = ev.clientX;
  scrubStartY = ev.clientY;
  updateChartScrubber(ev, overlay);
});

document.addEventListener('pointermove', ev => {
  const overlay = ev.target.closest('.scrub-overlay');
  if (overlay) {
    if (scrubActive && Math.hypot(ev.clientX - scrubStartX, ev.clientY - scrubStartY) > 10) {
      scrubMoved = true;
    }
    updateChartScrubber(ev, overlay);
  } else if (!scrubActive) {
    hideAllChartScrubbers();
  }
});

function endScrub(ev) {
  if (!scrubActive) return;
  scrubActive = false;
  setTimeout(() => { scrubMoved = false; }, 200);
  if (ev.pointerType === 'touch') {
    setTimeout(hideAllChartScrubbers, 2500);
  } else {
    hideAllChartScrubbers();
  }
}
document.addEventListener('pointerup', endScrub);
document.addEventListener('pointercancel', endScrub);

/* ---------- Modal für Klima-Einstellungen & Energie ---------- */
const sm = { open: false, mode: null, room: null, metricId: null, energyBtn: null };

function smItem(it) {
  const E = esc(it.entity), s = S(it.entity), d = dom(it.entity);
  const name = esc(it.name || (s && s.attributes && s.attributes.friendly_name) || it.entity);
  if (!s) return `<div class="sr"><span>${name}</span><span class="mut sm">nicht gefunden</span></div>`;
  const a = s.attributes || {};
  if (d === 'input_number' || d === 'number') {
    const unit = a.unit_of_measurement || '';
    return `<div class="sr col"><div class="srl"><span>${name}</span><b class="sv" data-v="${E}">${fmt(parseFloat(s.state), 2)} ${esc(unit)}</b></div>
      <input type="range" data-ent="${E}" data-kind="num" data-unit="${esc(unit)}" min="${a.min ?? 0}" max="${a.max ?? 100}" step="${a.step ?? 1}" value="${esc(s.state)}"></div>`;
  }
  if (d === 'input_datetime') {
    const t = a.has_time && !a.has_date ? 'time' : a.has_date && !a.has_time ? 'date' : 'datetime-local';
    let v = String(s.state);
    if (t === 'time') v = v.slice(0, 5); else if (t === 'datetime-local') v = v.replace(' ', 'T').slice(0, 16);
    return `<div class="sr"><span>${name}</span><input type="${t}" data-ent="${E}" data-kind="dt" data-t="${t}" value="${esc(v)}"></div>`;
  }
  if (d === 'input_boolean' || d === 'switch') return `<div class="sr"><span>${name}</span><div class="sw ${s.state === 'on' ? 'on' : ''}" data-act="smTog" data-e="${E}"><i></i></div></div>`;
  if (d === 'input_select' || d === 'select') {
    const opts = (a.options || []).map(o => `<option value="${esc(o)}" ${o === s.state ? 'selected' : ''}>${esc(o)}</option>`).join('');
    return `<div class="sr"><span>${name}</span><select data-ent="${E}" data-kind="sel">${opts}</select></div>`;
  }
  const n = parseFloat(s.state);
  return `<div class="sr"><span>${name}</span><b>${isNaN(n) ? esc(s.state) : fmt(n, 1) + ' ' + esc(a.unit_of_measurement || '')}</b></div>`;
}

function renderSM() {
  const r = (CONFIG.climateRooms || [])[sm.room]; if (!r || !r.settings) return;
  const groups = (r.settings.groups || []).map(g => `<div class="sg"><div class="sgt">${esc(g.title)}</div>${(g.items || []).map(smItem).join('')}</div>`).join('');
  document.getElementById('smsheet').innerHTML = `<div class="smh"><b>${esc(r.settings.title || r.name + ' Einstellungen')}</b><button class="x2" data-act="smClose">✕</button></div>${groups}`;
}
function openSM(i) { sm.mode = 'room'; sm.room = i; sm.open = true; renderSM(); document.getElementById('sm').classList.add('show'); }

function openEnergyModal(metricId, btnId, isUpdate = false) {
  const metric = (CONFIG.metrics || []).find(x => x.id === metricId) || (CONFIG.metrics || [])[0];
  if (!metric || !metric.subButtons) return;
  const btn = metric.subButtons.find(x => x.id === btnId);
  if (!btn) return;
  sm.mode = 'energy'; sm.metricId = metric.id; sm.energyBtn = btnId; sm.open = true;

  const nowHour = new Date().getHours();
  const rows = (btn.entities || []).map(ent => {
    const s = S(ent.entity);
    const v = s && s.state && !['unknown','unavailable'].includes(s.state) ? parseFloat(s.state) : NaN;
    const valStr = !isNaN(v) ? `${fmt(v, 1)} ${ent.unit || ''}` : (s ? s.state : '—');

    const ser = series['sub:' + ent.entity] || [];
    const serYest = series['sub:' + ent.entity + '_yest'] || [];

    let maxInfo = '—', minInfo = '—';
    if (ser.filter(x => x != null).length > 0) {
      const valid = ser.map((val, idx) => ({ val, idx })).filter(x => x.val != null);
      if (valid.length) {
        const maxObj = valid.reduce((max, cur) => cur.val > max.val ? cur : max, valid[0]);
        const minObj = valid.reduce((min, cur) => cur.val < min.val ? cur : min, valid[0]);
        const maxH = (nowHour - ser.length + 1 + maxObj.idx + 24) % 24;
        const minH = (nowHour - ser.length + 1 + minObj.idx + 24) % 24;
        maxInfo = `${fmt(maxObj.val, 1)} ${ent.unit || ''} (um ${pad(maxH)}:00 Uhr)`;
        minInfo = `${fmt(minObj.val, 1)} ${ent.unit || ''} (um ${pad(minH)}:00 Uhr)`;
      }
    }

    const chartHtml = ent.chart ? `<div class="chart" style="width:100%;margin-top:12px">${spark(ser, 'sub' + ent.entity, { fit: true, W: 650, H: 150, color: `var(--${btn.color || 'acc'})` }, serYest)}</div>` : '';

    return `<div class="sr col" style="background:rgba(255,255,255,.03);padding:16px;border-radius:14px;border:1px solid var(--line);margin-bottom:14px;align-items:stretch;gap:8px;">
      <div class="srl" style="display:flex;justify-content:space-between;align-items:center;width:100%;">
        <span style="font-weight:600;font-size:14px;color:#f2f3fa">${esc(ent.name)}</span>
        <b style="font-size:18px">${esc(valStr)}</b>
      </div>
      <div style="display:flex;gap:16px;font-size:11px;color:var(--mut);flex-wrap:wrap">
        <span>📈 Höchstwert: <strong style="color:var(--txt)">${maxInfo}</strong></span>
        <span>📉 Tiefstwert: <strong style="color:var(--txt)">${minInfo}</strong></span>
      </div>
      <div style="font-size:10px;color:var(--mut)">Durchgezogene Linie: Heute · Gestrichelte Linie: Gestern (letzte 24h)</div>
      ${chartHtml}
    </div>`;
  }).join('');

  document.getElementById('smsheet').innerHTML = `
    <div class="smh" style="margin-bottom:18px;">
      <div style="display:flex;align-items:center;gap:10px;color:var(--${btn.color || 'acc'})">${ic(btn.icon, 22)} <b style="color:var(--txt);font-size:18px">${esc(btn.name)}</b></div>
      <button class="x2" data-act="smClose">✕</button>
    </div>
    ${rows}`;

  if (!isUpdate) document.getElementById('sm').classList.add('show');
}

function getChartCtx() {
  if (sm.chartType === 'metric') {
    const m = (CONFIG.metrics || []).find(x => x.id === sm.metricId);
    if (!m) return null;
    return {
      id: m.id, title: m.title || 'Verlauf', mode: m.mode || 'avg', dec: m.decimals ?? 1,
      ent: m.chart, attr: null, unit: m.unit || '', cUnit: m.chartUnit || '',
      todayVal: num(m.entity), liveVal: num(m.chart),
      key24: m.chart, prev24: m.chart + '_yest', key7: '7d:' + m.chart
    };
  }

  const isKlima = sm.chartType === 'klima';
  const s = S(sm.cEnt), a = (s && s.attributes) || {};
  const rawVal = s ? (sm.cAttr ? a[sm.cAttr] : s.state) : null;
  const val = rawVal != null ? parseFloat(rawVal) : null;
  const kBase = (isKlima ? '24:' : 'stats:') + sm.cEnt + (sm.cAttr ? ':' + sm.cAttr : '');

  return {
    id: sm.cEnt + (sm.cAttr || ''), title: sm.cName || 'Verlauf', mode: sm.cMode || 'avg', dec: sm.cDec,
    ent: sm.cEnt, attr: sm.cAttr, unit: sm.cUnit || '', cUnit: sm.cUnit || '',
    todayVal: val, liveVal: val,
    key24: kBase, prev24: kBase + '_yest', key7: '7d:' + kBase
  };
}

async function ensure24hPrevLoaded() {
  const ctx = getChartCtx();
  if (!ctx || series[ctx.prev24] !== undefined) return;
  series[ctx.prev24] = null;
  try {
    series[ctx.prev24] = await loadSeries(ctx.ent, ctx.mode, 24, ctx.attr, 1);
    if (sm.open && sm.mode === 'chart' && sm.range === '24h') renderChartModal();
  } catch (e) {}
}

async function loadChartRange() {
  const ctx = getChartCtx();
  if (!ctx || sm.range !== '7d') return;
  if (series[ctx.key7] && series[ctx.key7 + '_t'] && Date.now() - series[ctx.key7 + '_t'] < 5 * 60 * 1000) return;

  sm.loading = true; renderChartModal();
  try {
    const [cur, prev] = await Promise.all([
      loadSeries(ctx.ent, ctx.mode, 168, ctx.attr),
      loadSeries(ctx.ent, ctx.mode, 168, ctx.attr, 7).catch(() => null)
    ]);
    series[ctx.key7] = cur; series[ctx.key7 + '_prev'] = prev; series[ctx.key7 + '_t'] = Date.now();
  } catch (e) {
    series[ctx.key7] = null; series[ctx.key7 + '_prev'] = null;
  }
  sm.loading = false;
  if (sm.open && sm.mode === 'chart') renderChartModal();
}

function renderChartModal() {
  const ctx = getChartCtx(); if (!ctx) return;
  const is7 = sm.range === '7d';
  const ser = is7 ? series[ctx.key7] : series[ctx.key24];
  const prev = is7 ? series[ctx.key7 + '_prev'] : series[ctx.prev24];

  const pts = (ser || []).map((v, i) => ({ v, i })).filter(p => p.v != null);
  let stats = '';
  if (pts.length) {
    const hi = pts.reduce((a, b) => (b.v > a.v ? b : a));
    const lo = pts.reduce((a, b) => (b.v < a.v ? b : a));
    const avg = pts.reduce((sum, p) => sum + p.v, 0) / pts.length;
    const when = p => {
      const d = seriesPointDate(p.i, ser.length);
      return is7 ? `${d.toLocaleDateString('de-DE', { weekday: 'short' })}, ${pad(d.getHours())}:00 Uhr` : `um ${pad(d.getHours())}:00 Uhr`;
    };
    stats = `<div class="mc-stats">
      <span>📈 Höchstwert: <strong>${fmt(hi.v, 1)} ${esc(ctx.cUnit)}</strong> (${esc(when(hi))})</span>
      <span>📉 Tiefstwert: <strong>${fmt(lo.v, 1)} ${esc(ctx.cUnit)}</strong> (${esc(when(lo))})</span>
      <span>Ø <strong>${fmt(avg, 1)} ${esc(ctx.cUnit)}</strong></span></div>`;
  }

  const chartHtml = (is7 && sm.loading)
    ? '<div class="mut sm" style="padding:70px 0;text-align:center">Lade Verlaufsdaten …</div>'
    : `<div class="chart chart-big" style="margin-top:6px">${spark(ser, 'mc' + ctx.id + (is7 ? '7' : '1'), { fit: true, W: 650, H: 240, range7: is7, unit: ctx.cUnit || ctx.unit || '', dec: ctx.dec }, prev)}</div>`;

  const topVals = sm.chartType === 'metric' ? `
    <div><div class="mc-big">${fmt(ctx.todayVal, ctx.dec)}<span class="unit">${esc(ctx.unit)}</span></div><small>Heute</small></div>
    ${ctx.liveVal != null ? `<div><div class="mc-big">${fmt(ctx.liveVal, 0)}<span class="unit">${esc(ctx.cUnit)}</span></div><small>${ctx.mode === 'last' ? 'Letzter Wert' : 'Aktuell'}</small></div>` : ''}
  ` : `
    <div><div class="mc-big">${fmt(ctx.todayVal, ctx.dec)}<span class="unit">${esc(ctx.cUnit)}</span></div><small>Aktuell</small></div>
  `;

  const sheet = document.getElementById('smsheet');
  sheet.classList.remove('wfc-wide');
  sheet.innerHTML = `
    <div class="smh"><b>${esc(ctx.title)}</b><button class="x2" data-act="smClose">✕</button></div>
    <div class="mc-top">${topVals}</div>
    <div class="wfc-tabs">
      <button class="wfc-tab ${is7 ? '' : 'on'}" data-act="chartRange" data-r="24h">24 Stunden</button>
      <button class="wfc-tab ${is7 ? 'on' : ''}" data-act="chartRange" data-r="7d">7 Tage</button>
    </div>
    ${chartHtml}${stats}
    <div class="mut" style="margin-top:8px;font-size:10px">Durchgezogen: ${is7 ? 'letzte 7 Tage' : 'letzte 24 Stunden'} · Gestrichelt: ${is7 ? 'die 7 Tage davor' : 'dieselben 24h am Vortag'}</div>`;
}

function openChartModal(el) {
  sm.mode = 'chart';
  sm.chartType = el.dataset.type;
  sm.metricId = el.dataset.mid;
  sm.cEnt = el.dataset.entity;
  sm.cAttr = el.dataset.attr;
  sm.cName = el.dataset.name;
  sm.cUnit = el.dataset.unit;
  sm.cDec = parseInt(el.dataset.dec || '1', 10);
  sm.cMode = el.dataset.mode || 'avg';
  sm.range = '24h';
  sm.loading = false;
  sm.open = true;
  renderChartModal();
  document.getElementById('sm').classList.add('show');
  ensure24hPrevLoaded();
}

function closeSM() {
  sm.open = false;
  document.getElementById('smsheet').classList.remove('wfc-wide');
  document.getElementById('sm').classList.remove('show');
}

// ---------- PHASE 3: SMART DEVICE & LIGHT GROUP DETAIL MODALS ----------
const RGB_PRESETS = [
  { name: 'Warmweiß', rgb: [255, 197, 143], hex: '#ffc58f' },
  { name: 'Neutral', rgb: [255, 241, 224], hex: '#fff1e0' },
  { name: 'Kaltweiß', rgb: [212, 235, 255], hex: '#d4ebff' },
  { name: 'Amber', rgb: [255, 147, 41], hex: '#ff9329' },
  { name: 'Koralle', rgb: [255, 94, 87], hex: '#ff5e57' },
  { name: 'Magenta', rgb: [236, 72, 153], hex: '#ec4899' },
  { name: 'Violett', rgb: [139, 92, 246], hex: '#8b5cf6' },
  { name: 'Ozean', rgb: [56, 189, 248], hex: '#38bdf8' },
  { name: 'Smaragd', rgb: [16, 185, 129], hex: '#10b981' }
];

function rgbToHex(rgb) {
  if (!Array.isArray(rgb) || rgb.length < 3) return '#fbbf24';
  return '#' + rgb.slice(0, 3).map(x => Math.max(0, Math.min(255, Math.round(Number(x) || 0))).toString(16).padStart(2, '0')).join('');
}

function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [255, 200, 120];
}

async function openDeviceDetailModal(entityId, customName = '') {
  if (!entityId) return;
  sm.mode = 'devDetail';
  sm.devEnt = entityId;
  sm.devName = customName || '';
  sm.open = true;
  renderDeviceDetailModal();
  document.getElementById('sm').classList.add('show');

  // Load 24h history sparkline for numeric/sensor or power-bearing devices
  const k = 'dev24:' + entityId;
  if (series[k] === undefined) {
    series[k] = null;
    try {
      series[k] = await loadSeries(entityId, 'avg', 24);
      if (sm.open && sm.mode === 'devDetail' && sm.devEnt === entityId) renderDeviceDetailModal();
    } catch (e) {}
  }
}

function renderDeviceDetailModal() {
  const ent = sm.devEnt;
  if (!ent) return;
  const s = S(ent) || { state: 'unavailable', attributes: {} };
  const a = s.attributes || {};
  const dom = ent.split('.')[0];
  const title = sm.devName || a.friendly_name || ent;
  const isOn = ['on', 'playing', 'open', 'heating', 'cooling', 'heat', 'cool', 'auto', 'heat_cool'].includes(s.state);

  // Linked device config (if configured in CONFIG.devices)
  const devCfg = (CONFIG.devices || []).find(d => d.entity === ent || d.state === ent);
  const powerVal = devCfg && devCfg.power ? num(devCfg.power) : (a.current_power_w ?? a.power ?? null);
  const energyVal = devCfg && devCfg.energy ? num(devCfg.energy) : null;
  const since = s.last_changed ? sinceStr(s.last_changed) : null;

  let bodyHtml = '';

  if (dom === 'light') {
    const bri = a.brightness != null ? Math.round((Number(a.brightness) / 255) * 100) : (isOn ? 100 : 0);
    const minK = a.min_color_temp_kelvin || 2000;
    const maxK = a.max_color_temp_kelvin || 6500;
    const curK = a.color_temp_kelvin || Math.round((minK + maxK) / 2);
    const curHex = rgbToHex(a.rgb_color);
    const effects = Array.isArray(a.effect_list) ? a.effect_list : [];
    const curEffect = a.effect || '';

    bodyHtml = `
      <div class="dd-top">
        <div class="dd-hero-stat">
          <div class="dd-badge ${isOn ? 'on' : ''}">${IC.bulb}</div>
          <div>
            <div class="dd-state-lbl">${isOn ? `Eingeschaltet · ${bri}%` : 'Ausgeschaltet'}</div>
            <div class="dd-sub-lbl">${since ? `Seit ${esc(since)}` : esc(ent)}</div>
          </div>
        </div>
        <button class="sw ${isOn ? 'on' : ''}" data-act="ddToggle" data-e="${esc(ent)}"></button>
      </div>

      <div class="dd-sec">
        <div class="dd-sec-hd"><span>☀️ Helligkeit</span><strong id="dd-bri-lbl">${bri}%</strong></div>
        <input type="range" class="dd-slider dd-slider-bri" min="0" max="100" value="${bri}" data-act="ddLightBri" data-e="${esc(ent)}">
        <div class="dd-pills">
          ${[10, 25, 50, 75, 100].map(p => `<button class="chip ${Math.abs(bri - p) <= 4 && isOn ? 'on' : ''}" data-act="ddLightBriBtn" data-e="${esc(ent)}" data-v="${p}">${p}%</button>`).join('')}
        </div>
      </div>

      <div class="dd-sec">
        <div class="dd-sec-hd"><span>🌡️ Farbtemperatur</span><strong id="dd-ct-lbl">${curK} K</strong></div>
        <input type="range" class="dd-slider dd-slider-ct" min="${minK}" max="${maxK}" step="100" value="${curK}" data-act="ddLightCt" data-e="${esc(ent)}">
        <div class="dd-pills">
          <button class="chip" data-act="ddLightCtBtn" data-e="${esc(ent)}" data-v="2200">Kerze (2200K)</button>
          <button class="chip" data-act="ddLightCtBtn" data-e="${esc(ent)}" data-v="2700">Warm (2700K)</button>
          <button class="chip" data-act="ddLightCtBtn" data-e="${esc(ent)}" data-v="4000">Neutral (4000K)</button>
          <button class="chip" data-act="ddLightCtBtn" data-e="${esc(ent)}" data-v="6000">Tageslicht (6000K)</button>
        </div>
      </div>

      <div class="dd-sec">
        <div class="dd-sec-hd"><span>🎨 Lichtfarbe (RGB)</span></div>
        <div class="dd-swatches">
          ${RGB_PRESETS.map(p => `<button class="dd-swatch" style="background:${p.hex}" title="${esc(p.name)}" data-act="ddLightRgbSwatch" data-e="${esc(ent)}" data-rgb="${p.rgb.join(',')}"></button>`).join('')}
          <label class="dd-swatch dd-swatch-picker" title="Freie Farbwahl">
            <input type="color" value="${curHex}" data-act="ddLightColorPick" data-e="${esc(ent)}">
            <span>＋</span>
          </label>
        </div>
      </div>

      ${effects.length ? `
      <div class="dd-sec">
        <div class="dd-sec-hd"><span>✨ Effekt (WLED / Szene)</span></div>
        <div class="dd-pills">
          ${effects.map(ef => `<button class="chip ${curEffect === ef ? 'on' : ''}" data-act="ddLightEffect" data-e="${esc(ent)}" data-v="${esc(ef)}">${esc(ef)}</button>`).join('')}
        </div>
      </div>` : ''}
    `;
  } else if (dom === 'media_player') {
    const vol = a.volume_level != null ? Math.round(Number(a.volume_level) * 100) : 30;
    const muted = !!a.is_volume_muted;
    const sources = Array.isArray(a.source_list) ? a.source_list : [];
    const curSrc = a.source || '';
    const mediaTitle = a.media_title || a.app_name || stateLabel(s.state);
    const mediaArtist = a.media_artist || a.media_series_title || '';

    bodyHtml = `
      <div class="dd-top">
        <div class="dd-hero-stat">
          <div class="dd-badge ${isOn ? 'on' : ''}">${IC.tv}</div>
          <div>
            <div class="dd-state-lbl">${esc(mediaTitle)}</div>
            <div class="dd-sub-lbl">${esc(mediaArtist || stateLabel(s.state))}</div>
          </div>
        </div>
        <button class="sw ${s.state !== 'off' && s.state !== 'standby' ? 'on' : ''}" data-act="ddMediaPower" data-e="${esc(ent)}"></button>
      </div>

      <div class="dd-sec">
        <div class="dd-media-transport">
          <button class="btn" data-act="ddMediaCmd" data-e="${esc(ent)}" data-cmd="media_previous_track" title="Zurück">${IC.prev}</button>
          <button class="btn primary dd-play-btn" data-act="ddMediaCmd" data-e="${esc(ent)}" data-cmd="media_play_pause" title="Play / Pause">${s.state === 'playing' ? IC.pause : IC.play}</button>
          <button class="btn" data-act="ddMediaCmd" data-e="${esc(ent)}" data-cmd="media_next_track" title="Weiter">${IC.next}</button>
          <button class="btn ${muted ? 'danger' : ''}" data-act="ddMediaMute" data-e="${esc(ent)}" data-mute="${muted ? '0' : '1'}" title="Stumm">${muted ? '🔇 Stumm' : '🔊 Ton an'}</button>
        </div>
      </div>

      <div class="dd-sec">
        <div class="dd-sec-hd"><span>🔊 Lautstärke</span><strong id="dd-vol-lbl">${vol}%</strong></div>
        <input type="range" class="dd-slider" min="0" max="100" value="${vol}" data-act="ddMediaVol" data-e="${esc(ent)}">
        <div class="dd-pills">
          ${[15, 30, 50, 75, 100].map(p => `<button class="chip ${Math.abs(vol - p) <= 3 ? 'on' : ''}" data-act="ddMediaVolBtn" data-e="${esc(ent)}" data-v="${p}">${p}%</button>`).join('')}
        </div>
      </div>

      ${sources.length ? `
      <div class="dd-sec">
        <div class="dd-sec-hd"><span>📺 Quelle / Eingang</span></div>
        <div class="dd-pills">
          ${sources.map(src => `<button class="chip ${curSrc === src ? 'on' : ''}" data-act="ddMediaSource" data-e="${esc(ent)}" data-v="${esc(src)}">${esc(src)}</button>`).join('')}
        </div>
      </div>` : ''}
    `;
  } else if (dom === 'cover') {
    const pos = a.current_position ?? (s.state === 'open' ? 100 : 0);
    bodyHtml = `
      <div class="dd-top">
        <div class="dd-hero-stat">
          <div class="dd-badge ${pos > 0 ? 'on' : ''}">${IC.blinds}</div>
          <div>
            <div class="dd-state-lbl">${pos === 0 ? 'Geschlossen (0%)' : `Geöffnet (${pos}%)`}</div>
            <div class="dd-sub-lbl">${esc(stateLabel(s.state))}</div>
          </div>
        </div>
        <div class="cbtns">
          <button class="cbtn" data-act="cov" data-e="${esc(ent)}" data-fn="open_cover">▲</button>
          <button class="cbtn" data-act="cov" data-e="${esc(ent)}" data-fn="stop_cover">■</button>
          <button class="cbtn" data-act="cov" data-e="${esc(ent)}" data-fn="close_cover">▼</button>
        </div>
      </div>

      <div class="dd-sec">
        <div class="dd-sec-hd"><span>🪟 Position</span><strong id="dd-cov-lbl">${pos}%</strong></div>
        <input type="range" class="dd-slider" min="0" max="100" value="${pos}" data-act="ddCoverPos" data-e="${esc(ent)}">
        <div class="dd-pills">
          ${[0, 25, 50, 75, 100].map(p => `<button class="chip ${Math.abs(pos - p) <= 3 ? 'on' : ''}" data-act="covPos" data-e="${esc(ent)}" data-pos="${p}">${p === 0 ? 'Zu (0%)' : p === 100 ? 'Auf (100%)' : p + '%'}</button>`).join('')}
        </div>
      </div>
    `;
  } else if (dom === 'climate') {
    const curT = a.current_temperature ?? '–';
    const targT = a.temperature ?? 21;
    const minT = a.min_temp ?? 7;
    const maxT = a.max_temp ?? 30;
    const stepT = a.target_temp_step || 0.5;
    const hvacModes = a.hvac_modes || ['off', 'heat', 'auto'];
    const presets = a.preset_modes || [];
    const fanModes = a.fan_modes || [];

    bodyHtml = `
      <div class="dd-top">
        <div class="dd-hero-stat">
          <div class="dd-badge ${s.state !== 'off' ? 'on' : ''}">${IC.thermo}</div>
          <div>
            <div class="dd-state-lbl">Ist: ${fmt(curT, 1)} °C · Ziel: ${fmt(targT, 1)} °C</div>
            <div class="dd-sub-lbl">Modus: ${esc(HVAC_LABELS[s.state] || s.state)}</div>
          </div>
        </div>
        <div class="klima-stepper">
          <button data-act="kStep" data-e="${esc(ent)}" data-d="-0.5">−</button>
          <span class="t">${fmt(targT, 1)}°</span>
          <button data-act="kStep" data-e="${esc(ent)}" data-d="0.5">+</button>
        </div>
      </div>

      <div class="dd-sec">
        <div class="dd-sec-hd"><span>🎯 Zieltemperatur</span><strong id="dd-clim-lbl">${fmt(targT, 1)} °C</strong></div>
        <input type="range" class="dd-slider" min="${minT}" max="${maxT}" step="${stepT}" value="${targT}" data-act="ddClimTemp" data-e="${esc(ent)}">
      </div>

      <div class="dd-sec">
        <div class="dd-sec-hd"><span>🔥 Betriebsmodus</span></div>
        <div class="dd-pills">
          ${hvacModes.map(m => `<button class="chip ${s.state === m ? 'on' : ''}" data-act="kMode" data-e="${esc(ent)}" data-m="${esc(m)}">${esc(HVAC_LABELS[m] || m)}</button>`).join('')}
        </div>
      </div>

      ${presets.length ? `
      <div class="dd-sec">
        <div class="dd-sec-hd"><span>⚡ Profil (Preset)</span></div>
        <div class="dd-pills">
          ${presets.map(p => `<button class="chip ${a.preset_mode === p ? 'on' : ''}" data-act="kPreset" data-e="${esc(ent)}" data-p="${esc(p)}">${esc(PRESET_LABELS[p] || p)}</button>`).join('')}
        </div>
      </div>` : ''}

      ${fanModes.length ? `
      <div class="dd-sec">
        <div class="dd-sec-hd"><span>🌀 Lüfterstufe</span></div>
        <div class="dd-pills">
          ${fanModes.map(f => `<button class="chip ${a.fan_mode === f ? 'on' : ''}" data-act="kFan" data-e="${esc(ent)}" data-f="${esc(f)}">${esc(FAN_LABELS[f] || f)}</button>`).join('')}
        </div>
      </div>` : ''}
    `;
  } else {
    // Switch, fan, input_boolean, sensor, binary_sensor, etc.
    const canToggle = ['switch', 'input_boolean', 'fan', 'automation', 'script', 'scene', 'lock', 'vacuum', 'LawnMower'].includes(dom);
    const unit = a.unit_of_measurement || '';
    const ser = series['dev24:' + ent];
    const hasChart = Array.isArray(ser) && ser.some(v => v != null);

    bodyHtml = `
      <div class="dd-top">
        <div class="dd-hero-stat">
          <div class="dd-badge ${isOn ? 'on' : ''}">${IC.plug}</div>
          <div>
            <div class="dd-state-lbl">${esc(stateLabel(s.state))}${unit ? ' ' + esc(unit) : ''}</div>
            <div class="dd-sub-lbl">${since ? `Seit ${esc(since)}` : esc(ent)}</div>
          </div>
        </div>
        ${canToggle ? `<button class="sw ${isOn ? 'on' : ''}" data-act="ddToggle" data-e="${esc(ent)}"></button>` : ''}
      </div>

      ${(powerVal != null || energyVal != null) ? `
      <div class="dd-metrics-grid">
        ${powerVal != null ? `<div class="dd-metric-box"><small>Aktuelle Leistung</small><strong>${fmt(powerVal, 0)} W</strong></div>` : ''}
        ${energyVal != null ? `<div class="dd-metric-box"><small>Energie / Verbrauch</small><strong>${fmt(energyVal, 2)} kWh</strong></div>` : ''}
      </div>` : ''}

      ${hasChart ? `
      <div class="dd-sec">
        <div class="dd-sec-hd"><span>📈 24h Verlauf</span></div>
        <div class="chart" style="height:120px">${spark(ser, 'ddsp_' + ent.replace(/\W/g, ''), { fit: true, W: 520, H: 120, unit, dec: 1 })}</div>
      </div>` : ''}
    `;
  }

  const sheet = document.getElementById('smsheet');
  sheet.classList.remove('wfc-wide');
  sheet.innerHTML = `
    <div class="smh">
      <div><b>${esc(title)}</b><div class="mut" style="font-size:11px;font-weight:400">${esc(ent)}</div></div>
      <button class="x2" data-act="smClose">✕</button>
    </div>
    ${bodyHtml}
  `;
}

function openLightGroupModal(idx) {
  const grp = (CONFIG.lights || [])[idx];
  if (!grp) return;
  sm.mode = 'lgrpDetail';
  sm.lgrpIdx = idx;
  sm.open = true;
  renderLightGroupModal();
  document.getElementById('sm').classList.add('show');
}

function renderLightGroupModal() {
  const grp = (CONFIG.lights || [])[sm.lgrpIdx];
  if (!grp) return;
  const ents = grp.entities || [];
  const exGrpArr = Array.isArray(grp.excludeGroup) ? grp.excludeGroup : [];
  const exMainArr = Array.isArray(grp.excludeMain) ? grp.excludeMain : [];
  const toggleEnts = getGroupToggleEntities(grp);
  const onEnts = ents.filter(e => S(e)?.state === 'on');
  const toggleOnEnts = toggleEnts.filter(e => S(e)?.state === 'on');
  const isAnyOn = onEnts.length > 0;
  const isToggleOn = toggleOnEnts.length > 0;

  // Average brightness across on lights
  let avgBri = isAnyOn ? 100 : 0;
  const bris = onEnts.map(e => S(e)?.attributes?.brightness).filter(v => v != null);
  if (bris.length) avgBri = Math.round((bris.reduce((a, b) => a + Number(b), 0) / bris.length / 255) * 100);

  const exclCount = exGrpArr.filter(e => ents.includes(e)).length;
  const subInfo = exclCount > 0
    ? `Gruppenschalter steuert ${toggleEnts.length} von ${ents.length} Lampen (${exclCount} ausgenommen)`
    : 'Gesamte Gruppe steuern';

  const sheet = document.getElementById('smsheet');
  sheet.classList.remove('wfc-wide');
  sheet.innerHTML = `
    <div class="smh">
      <div><b>💡 ${esc(grp.name || 'Lichtgruppe')}</b><div class="mut" style="font-size:11px;font-weight:400">${onEnts.length} von ${ents.length} aktiv</div></div>
      <button class="x2" data-act="smClose">✕</button>
    </div>

    <div class="dd-top">
      <div class="dd-hero-stat">
        <div class="dd-badge ${isAnyOn ? 'on' : ''}">${IC.bulb}</div>
        <div>
          <div class="dd-state-lbl">${isAnyOn ? `${onEnts.length} eingeschaltet (${avgBri}%)` : 'Alle ausgeschaltet'}</div>
          <div class="dd-sub-lbl">${esc(subInfo)}</div>
        </div>
      </div>
      <button class="sw ${isToggleOn ? 'on' : ''}" data-act="lgrp" data-i="${sm.lgrpIdx}" title="Gekoppelte Lampen der Gruppe ein-/ausschalten"></button>
    </div>

    <div class="dd-sec">
      <div class="dd-sec-hd"><span>☀️ Gruppen-Helligkeit</span><strong id="dd-grp-bri-lbl">${avgBri}%</strong></div>
      <input type="range" class="dd-slider dd-slider-bri" min="0" max="100" value="${avgBri}" data-act="ddGrpBri" data-i="${sm.lgrpIdx}">
      <div class="dd-pills">
        ${[10, 25, 50, 75, 100].map(p => `<button class="chip ${Math.abs(avgBri - p) <= 5 && isAnyOn ? 'on' : ''}" data-act="ddGrpBriBtn" data-i="${sm.lgrpIdx}" data-v="${p}">${p}%</button>`).join('')}
      </div>
    </div>

    <div class="dd-sec">
      <div class="dd-sec-hd"><span>🎨 Gruppen-Farbe & Temperatur</span></div>
      <div class="dd-swatches">
        ${RGB_PRESETS.map(p => `<button class="dd-swatch" style="background:${p.hex}" title="${esc(p.name)}" data-act="ddGrpRgbSwatch" data-i="${sm.lgrpIdx}" data-rgb="${p.rgb.join(',')}"></button>`).join('')}
      </div>
    </div>

    <div class="dd-sec">
      <div class="dd-sec-hd">
        <span>💡 Einzelne Lampen & Schalter-Kopplung (${ents.length})</span>
        <span class="mut" style="font-size:11px">💡=Gruppenschalter · ⚡=Hauptschalter</span>
      </div>
      <div class="dd-lamp-list">
        ${ents.map(e => {
          const st = S(e);
          const on = st?.state === 'on';
          const b = st?.attributes?.brightness != null ? Math.round((Number(st.attributes.brightness) / 255) * 100) : (on ? 100 : 0);
          const nm = st?.attributes?.friendly_name || e;
          const exGrp = exGrpArr.includes(e);
          const exMain = exMainArr.includes(e);
          return `
            <div class="dd-lamp-row">
              <div class="dd-lamp-info" data-act="devDetail" data-e="${esc(e)}" data-name="${esc(nm)}" title="Details & Farbe öffnen">
                <span class="dot ${on ? 'ok' : 'off'}"></span>
                <div>
                  <div class="dd-lamp-name">${esc(nm)}</div>
                  <div class="dd-lamp-sub">${on ? `An · ${b}%` : 'Aus'} · <span class="link-hint">Feinsteuerung ↗</span></div>
                </div>
              </div>
              <div class="dd-lamp-actions">
                <button type="button" class="dd-excl-btn ${exGrp ? 'excl' : 'on'}" data-act="ddToggleExclGrp" data-i="${sm.lgrpIdx}" data-e="${esc(e)}" title="${exGrp ? 'Vom Gruppenschalter ausgeschlossen (Klick zum Einschließen)' : 'Im Gruppenschalter enthalten (Klick zum Ausschließen)'}">
                  ${exGrp ? '🔒 Gruppe' : '💡 Gruppe'}
                </button>
                <button type="button" class="dd-excl-btn ${exMain ? 'excl' : 'on'}" data-act="ddToggleExclMain" data-i="${sm.lgrpIdx}" data-e="${esc(e)}" title="${exMain ? 'Vom Master-Hauptschalter ausgeschlossen (Klick zum Einschließen)' : 'Im Master-Hauptschalter enthalten (Klick zum Ausschließen)'}">
                  ${exMain ? '🔒 Haupt' : '⚡ Haupt'}
                </button>
                <button class="sw ${on ? 'on' : ''}" data-act="ddToggle" data-e="${esc(e)}"></button>
              </div>
            </div>`;
        }).join('')}
      </div>
    </div>
  `;
}

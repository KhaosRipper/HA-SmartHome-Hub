/* ==========================================================================
   Smart Home Hub – Universal Sport-Center im Google-Sports-Look (sports.js)
   Unterstützt Fußball (1./2./3. Liga, DFB-Pokal, CL, EL, ECL, int. Ligen),
   NFL, NBA, NHL, Tennis (ATP/WTA), Formel 1 & freie Live-Suche ohne API-Key
   ========================================================================== */

const SPORTS_QUICK_PRESETS = [
  { group: '🇩🇪 Beliebte Vereine (1. & 2. Bundesliga)', items: [
    { id: 'soccer|ger.1|126',  label: '⚽ SC Freiburg (Bundesliga + Pokal + Europa)', sport: 'soccer', league: 'ger.1', teamId: '126',  teamName: 'SC Freiburg' },
    { id: 'soccer|ger.1|132',  label: '⚽ FC Bayern München',                         sport: 'soccer', league: 'ger.1', teamId: '132',  teamName: 'FC Bayern München' },
    { id: 'soccer|ger.1|124',  label: '⚽ Borussia Dortmund (BVB)',                   sport: 'soccer', league: 'ger.1', teamId: '124',  teamName: 'Borussia Dortmund' },
    { id: 'soccer|ger.1|134',  label: '⚽ VfB Stuttgart',                             sport: 'soccer', league: 'ger.1', teamId: '134',  teamName: 'VfB Stuttgart' },
    { id: 'soccer|ger.1|131',  label: '⚽ Bayer 04 Leverkusen',                       sport: 'soccer', league: 'ger.1', teamId: '131',  teamName: 'Bayer Leverkusen' },
    { id: 'soccer|ger.1|125',  label: '⚽ Eintracht Frankfurt',                       sport: 'soccer', league: 'ger.1', teamId: '125',  teamName: 'Eintracht Frankfurt' },
    { id: 'soccer|ger.1|11420',label: '⚽ RB Leipzig',                                sport: 'soccer', league: 'ger.1', teamId: '11420',teamName: 'RB Leipzig' },
    { id: 'soccer|ger.1|137',  label: '⚽ SV Werder Bremen',                          sport: 'soccer', league: 'ger.1', teamId: '137',  teamName: 'Werder Bremen' },
    { id: 'soccer|ger.1|268',  label: '⚽ Borussia Mönchengladbach',                  sport: 'soccer', league: 'ger.1', teamId: '268',  teamName: 'Borussia M\'gladbach' },
    { id: 'soccer|ger.1|598',  label: '⚽ 1. FC Union Berlin',                        sport: 'soccer', league: 'ger.1', teamId: '598',  teamName: '1. FC Union Berlin' },
    { id: 'soccer|ger.1|2950', label: '⚽ 1. FSV Mainz 05',                           sport: 'soccer', league: 'ger.1', teamId: '2950', teamName: 'Mainz 05' },
    { id: 'soccer|ger.1|3841', label: '⚽ FC Augsburg',                               sport: 'soccer', league: 'ger.1', teamId: '3841', teamName: 'FC Augsburg' },
    { id: 'soccer|ger.1|138',  label: '⚽ VfL Wolfsburg',                             sport: 'soccer', league: 'ger.1', teamId: '138',  teamName: 'VfL Wolfsburg' },
    { id: 'soccer|ger.1|7911', label: '⚽ TSG Hoffenheim',                            sport: 'soccer', league: 'ger.1', teamId: '7911', teamName: 'TSG Hoffenheim' },
    { id: 'soccer|ger.1|270',  label: '⚽ FC St. Pauli',                              sport: 'soccer', league: 'ger.1', teamId: '270',  teamName: 'FC St. Pauli' },
    { id: 'soccer|ger.1|6418', label: '⚽ 1. FC Heidenheim',                          sport: 'soccer', league: 'ger.1', teamId: '6418', teamName: '1. FC Heidenheim' },
    { id: 'soccer|ger.2|127',  label: '⚽ Hamburger SV (HSV)',                        sport: 'soccer', league: 'ger.2', teamId: '127',  teamName: 'Hamburger SV' },
    { id: 'soccer|ger.2|122',  label: '⚽ 1. FC Köln',                                sport: 'soccer', league: 'ger.2', teamId: '122',  teamName: '1. FC Köln' },
    { id: 'soccer|ger.2|133',  label: '⚽ FC Schalke 04',                             sport: 'soccer', league: 'ger.2', teamId: '133',  teamName: 'FC Schalke 04' },
    { id: 'soccer|ger.2|2919', label: '⚽ Karlsruher SC (KSC)',                       sport: 'soccer', league: 'ger.2', teamId: '2919', teamName: 'Karlsruher SC' },
    { id: 'soccer|ger.2|129',  label: '⚽ 1. FC Kaiserslautern',                      sport: 'soccer', league: 'ger.2', teamId: '129',  teamName: '1. FC Kaiserslautern' },
    { id: 'soccer|ger.2|128',  label: '⚽ Hertha BSC',                                sport: 'soccer', league: 'ger.2', teamId: '128',  teamName: 'Hertha BSC' },
    { id: 'soccer|ger.2|9707', label: '⚽ Fortuna Düsseldorf',                        sport: 'soccer', league: 'ger.2', teamId: '9707', teamName: 'Fortuna Düsseldorf' },
    { id: 'soccer|ger.2|2428', label: '⚽ Hannover 96',                               sport: 'soccer', league: 'ger.2', teamId: '2428', teamName: 'Hannover 96' }
  ]},
  { group: '🏆 Fußball-Ligen & Pokale (Komplett-Ansicht)', items: [
    { id: 'soccer|ger.1|',            label: '🇩🇪 1. Bundesliga (Spieltag & Tabelle)',     sport: 'soccer', league: 'ger.1',            teamId: '', teamName: '1. Bundesliga' },
    { id: 'soccer|ger.2|',            label: '🇩🇪 2. Bundesliga (Spieltag & Tabelle)',     sport: 'soccer', league: 'ger.2',            teamId: '', teamName: '2. Bundesliga' },
    { id: 'soccer|ger.3|',            label: '🇩🇪 3. Liga (Spieltag & Tabelle)',           sport: 'soccer', league: 'ger.3',            teamId: '', teamName: '3. Liga' },
    { id: 'soccer|ger.dfb_pokal|',    label: '🏆 DFB-Pokal (Alle Spiele)',                sport: 'soccer', league: 'ger.dfb_pokal',    teamId: '', teamName: 'DFB-Pokal' },
    { id: 'soccer|uefa.champions|',   label: '⭐ UEFA Champions League',                  sport: 'soccer', league: 'uefa.champions',   teamId: '', teamName: 'Champions League' },
    { id: 'soccer|uefa.europa|',      label: '🌍 UEFA Europa League',                     sport: 'soccer', league: 'uefa.europa',      teamId: '', teamName: 'Europa League' },
    { id: 'soccer|uefa.europa.conf|', label: '🟢 UEFA Conference League',                 sport: 'soccer', league: 'uefa.europa.conf', teamId: '', teamName: 'Conference League' },
    { id: 'soccer|eng.1|',            label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League (England)',              sport: 'soccer', league: 'eng.1',            teamId: '', teamName: 'Premier League' },
    { id: 'soccer|esp.1|',            label: '🇪🇸 LaLiga (Spanien)',                      sport: 'soccer', league: 'esp.1',            teamId: '', teamName: 'LaLiga' },
    { id: 'soccer|ita.1|',            label: '🇮🇹 Serie A (Italien)',                     sport: 'soccer', league: 'ita.1',            teamId: '', teamName: 'Serie A' }
  ]},
  { group: '🏈🎾🏎️ Weitere Sportarten (US-Sport, Tennis, Motorsport)', items: [
    { id: 'football|nfl|',   label: '🏈 NFL Football (Spielplan & Standings)',   sport: 'football',   league: 'nfl', teamId: '', teamName: 'NFL Football' },
    { id: 'basketball|nba|', label: '🏀 NBA Basketball (Spielplan & Standings)', sport: 'basketball', league: 'nba', teamId: '', teamName: 'NBA Basketball' },
    { id: 'hockey|nhl|',     label: '🏒 NHL Eishockey (Spielplan & Standings)',  sport: 'hockey',     league: 'nhl', teamId: '', teamName: 'NHL Eishockey' },
    { id: 'tennis|atp|',     label: '🎾 ATP Tennis Tour (Herren Live & Matches)',sport: 'tennis',     league: 'atp', teamId: '', teamName: 'ATP Tennis' },
    { id: 'tennis|wta|',     label: '🎾 WTA Tennis Tour (Damen Live & Matches)', sport: 'tennis',     league: 'wta', teamId: '', teamName: 'WTA Tennis' },
    { id: 'racing|f1|',      label: '🏎️ Formel 1 (Rennkalender & Ergebnisse)',   sport: 'racing',     league: 'f1',  teamId: '', teamName: 'Formel 1' }
  ]}
];

const SPORTS_TEAM_SHORT_DE = {
  'SC Freiburg': 'Freiburg',
  'Bayern Munich': 'Bayern',
  'FC Bayern München': 'Bayern',
  'Borussia Dortmund': 'Dortmund',
  'Bayer Leverkusen': 'Leverkusen',
  'VfB Stuttgart': 'Stuttgart',
  'Eintracht Frankfurt': 'Frankfurt',
  'RB Leipzig': 'Leipzig',
  'VfL Wolfsburg': 'Wolfsburg',
  'Werder Bremen': 'Bremen',
  'SV Werder Bremen': 'Bremen',
  'Borussia Monchengladbach': 'Gladbach',
  'Borussia Mönchengladbach': 'Gladbach',
  '1. FC Union Berlin': 'Union Berlin',
  'Mainz': 'Mainz 05',
  '1. FSV Mainz 05': 'Mainz 05',
  'FC Augsburg': 'Augsburg',
  'TSG Hoffenheim': 'Hoffenheim',
  '1. FC Heidenheim 1846': 'Heidenheim',
  'St. Pauli': 'St. Pauli',
  'FC St. Pauli': 'St. Pauli',
  'Holstein Kiel': 'Holstein Kiel',
  'VfL Bochum': 'Bochum',
  'Hamburg SV': 'HSV',
  'Hamburger SV': 'HSV',
  'FC Cologne': '1. FC Köln',
  '1. FC Köln': '1. FC Köln',
  'FC Schalke 04': 'Schalke 04',
  'Schalke 04': 'Schalke 04',
  'Karlsruher SC': 'Karlsruhe',
  '1. FC Kaiserslautern': 'K\'lautern',
  'Hertha Berlin': 'Hertha BSC',
  'Fortuna Düsseldorf': 'Düsseldorf',
  'Hannover 96': 'Hannover 96'
};

function cleanSportsTeamName(name, short = false) {
  if (!name) return '';
  const s = String(name).trim();
  if (short && SPORTS_TEAM_SHORT_DE[s]) return SPORTS_TEAM_SHORT_DE[s];
  if (s === 'Bayern Munich') return 'FC Bayern München';
  if (s === 'FC Cologne') return '1. FC Köln';
  if (s === 'Hamburg SV') return 'Hamburger SV';
  if (s === 'Hertha Berlin') return 'Hertha BSC';
  if (s === 'Borussia Monchengladbach') return 'Borussia M\'gladbach';
  return s;
}

function translateLeagueNameDe(raw) {
  if (!raw) return '';
  const s = String(raw).trim();
  if (/german bundesliga/i.test(s) && !/2\./.test(s)) return 'Bundesliga';
  if (/german 2\. bundesliga/i.test(s)) return '2. Bundesliga';
  if (/german 3\. liga/i.test(s)) return '3. Liga';
  if (/german cup|dfb-pokal/i.test(s)) return 'DFB-Pokal';
  if (/uefa champions league/i.test(s)) return 'Champions League';
  if (/uefa europa conference|uefa conference/i.test(s)) return 'Conference League';
  if (/uefa europa league/i.test(s)) return 'Europa League';
  if (/english premier league/i.test(s)) return 'Premier League';
  if (/spanish laliga/i.test(s)) return 'LaLiga';
  if (/italian serie a/i.test(s)) return 'Serie A';
  if (/club friendly/i.test(s)) return 'Testspiel';
  return s;
}

function translateRoundDe(raw) {
  if (!raw) return '';
  let s = String(raw).trim();
  s = s.replace(/Round of 16/i, 'Achtelfinale')
       .replace(/Quarterfinals?/i, 'Viertelfinale')
       .replace(/Semifinals?/i, 'Halbfinale')
       .replace(/Final/i, 'Finale')
       .replace(/1st Round|First Round/i, '1. Runde')
       .replace(/2nd Round|Second Round/i, 'Zweite Runde')
       .replace(/3rd Round|Third Round/i, '3. Runde')
       .replace(/League Phase/i, 'Ligaphase')
       .replace(/Group Stage/i, 'Gruppenphase')
       .replace(/Regular Season/i, 'Liga');
  return s;
}

// State & Cache für alle Sport-Widgets
const sportsHubState = {
  cache: {},       // key -> { loading, loadedAt, error, teamInfo, events, focusEvent, focusSummary, standings, standLeagueName, roster }
  uiState: {},     // widgetKey -> { tab: 'overview'|'matches'|'table'|'roster', compFilter: 'all', matchSubTab: 'upcoming' }
  modal: {         // State für das Match-Detail-Modal (#sm)
    loading: false,
    sport: 'soccer',
    league: 'all',
    eventId: '',
    tab: 'events', // 'events' | 'stats' | 'lineups'
    summary: null,
    fallback: null
  },
  editorSearch: {  // Live-Suchergebnisse im Editor
    loading: false,
    query: '',
    results: [],
    targetPi: null,
    targetWi: null
  }
};

function getSportsWidgetConfigKey(w) {
  const sport = w.sport || 'soccer';
  const league = w.league || 'ger.1';
  const teamId = w.teamId || '';
  const cross = w.crossComp !== false ? '1' : '0';
  return `${sport}|${league}|${teamId}|${cross}`;
}

function getSportsUiState(widgetKey) {
  if (!sportsHubState.uiState[widgetKey]) {
    sportsHubState.uiState[widgetKey] = {
      tab: 'overview',
      compFilter: 'all',
      matchSubTab: 'upcoming'
    };
  }
  return sportsHubState.uiState[widgetKey];
}

function extractScoreVal(competitor) {
  if (!competitor || competitor.score == null) return '';
  if (typeof competitor.score === 'object') {
    return String(competitor.score.displayValue ?? competitor.score.value ?? '');
  }
  return String(competitor.score);
}

function normalizeEspnEvent(ev, defaultSport = 'soccer', defaultLeague = 'ger.1') {
  if (!ev || !ev.id) return null;
  const comp = (ev.competitions && ev.competitions[0]) || {};
  const competitors = comp.competitors || [];
  const home = competitors.find(c => c.homeAway === 'home') || competitors[0] || {};
  const away = competitors.find(c => c.homeAway === 'away') || competitors[1] || {};
  const hTeam = home.team || home.athlete || {};
  const aTeam = away.team || away.athlete || {};

  const statusObj = comp.status || ev.status || {};
  const stType = statusObj.type || {};
  const state = stType.state || 'pre'; // 'pre' | 'in' | 'post'
  const completed = !!stType.completed || state === 'post';

  const rawLeague = (ev.league && (ev.league.name || ev.league.shortName))
    || (comp.league && (comp.league.name || comp.league.shortName))
    || (ev.season && ev.season.slug)
    || '';
  const leagueSlug = (ev.league && ev.league.slug) || (comp.league && comp.league.slug) || defaultLeague || 'all';
  const leagueName = translateLeagueNameDe(rawLeague) || translateLeagueNameDe(defaultLeague);
  const roundRaw = (comp.leg && comp.leg.displayValue) || (ev.week && ev.week.text) || (ev.seasonType && ev.seasonType.name) || '';
  const roundName = translateRoundDe(roundRaw);

  const dateMs = ev.date ? new Date(ev.date).getTime() : 0;
  const hLogo = hTeam.logos?.[0]?.href || hTeam.logo || (home.athlete && home.athlete.flag && home.athlete.flag.href) || '';
  const aLogo = aTeam.logos?.[0]?.href || aTeam.logo || (away.athlete && away.athlete.flag && away.athlete.flag.href) || '';

  // Torschützen/Details falls direkt im Scoreboard-Event enthalten
  const inlineDetails = (comp.details || []).map(d => {
    const clock = d.clock?.displayValue || '';
    const athlete = d.athletesInvolved?.[0]?.displayName || d.athletesInvolved?.[0]?.shortName || '';
    const isGoal = !!d.scoringPlay;
    const isCard = /card/i.test(d.type?.text || '');
    const isRed = /red/i.test(d.type?.text || '');
    const teamId = d.team?.id || '';
    return { clock, athlete, isGoal, isCard, isRed, teamId, text: d.type?.text || '' };
  });

  return {
    id: String(ev.id),
    sport: defaultSport,
    leagueSlug,
    leagueName,
    roundName,
    date: ev.date || '',
    dateMs,
    state,
    completed,
    statusDetail: stType.shortDetail || stType.detail || '',
    displayClock: statusObj.displayClock || '',
    venue: comp.venue?.fullName || '',
    home: {
      id: String(hTeam.id || home.id || ''),
      name: cleanSportsTeamName(hTeam.displayName || hTeam.name || home.displayName || 'Heim', false),
      shortName: cleanSportsTeamName(hTeam.shortDisplayName || hTeam.name || hTeam.displayName || 'Heim', true),
      abbr: hTeam.abbreviation || '',
      logo: hLogo,
      score: extractScoreVal(home),
      winner: !!home.winner
    },
    away: {
      id: String(aTeam.id || away.id || ''),
      name: cleanSportsTeamName(aTeam.displayName || aTeam.name || away.displayName || 'Gast', false),
      shortName: cleanSportsTeamName(aTeam.shortDisplayName || aTeam.name || aTeam.displayName || 'Gast', true),
      abbr: aTeam.abbreviation || '',
      logo: aLogo,
      score: extractScoreVal(away),
      winner: !!away.winner
    },
    inlineDetails
  };
}

function parseSummaryDetails(summaryJson) {
  if (!summaryJson) return { scorers: [], cards: [], stats: [], rosters: [], venue: '', attendance: 0, videos: [] };
  const comp = summaryJson.header?.competitions?.[0] || {};
  const rawDetails = comp.details || summaryJson.keyEvents || [];
  const scorers = [];
  const cards = [];

  rawDetails.forEach(d => {
    const clock = d.clock?.displayValue || '';
    const player = d.athletesInvolved?.[0]?.displayName || d.participants?.[0]?.athlete?.displayName || '';
    const typeText = d.type?.text || '';
    const teamId = String(d.team?.id || '');
    const isGoal = !!d.scoringPlay || /goal|penalty|own goal/i.test(typeText);
    const isOwnGoal = !!d.ownGoal || /own goal/i.test(typeText);
    const isPen = !!d.penaltyKick || /penalty/i.test(typeText);
    const isYellow = /yellow/i.test(typeText);
    const isRed = /red/i.test(typeText);

    if (isGoal && player) {
      let suffix = '';
      if (isOwnGoal) suffix = ' (ET)';
      else if (isPen) suffix = ' (11m)';
      scorers.push({ clock, player: `${player}${suffix}`, teamId, typeText });
    } else if ((isYellow || isRed) && player) {
      cards.push({ clock, player, teamId, isRed, typeText });
    }
  });

  // Team-Statistiken aus boxscore.teams
  const boxTeams = summaryJson.boxscore?.teams || [];
  const stats = [];
  if (boxTeams.length === 2) {
    const t0 = boxTeams[0].statistics || [];
    const t1 = boxTeams[1].statistics || [];
    const statLabelsDe = {
      possessionPct: 'Ballbesitz (%)',
      totalShots: 'Torschüsse gesamt',
      shotsOnTarget: 'Schüsse aufs Tor',
      wonCorners: 'Eckbälle',
      foulsCommitted: 'Fouls',
      offsides: 'Abseits',
      yellowCards: 'Gelbe Karten',
      redCards: 'Rote Karten',
      saves: 'Paraden',
      accuratePasses: 'Angekommene Pässe',
      passPct: 'Passquote (%)'
    };
    Object.entries(statLabelsDe).forEach(([key, labelDe]) => {
      const s0 = t0.find(x => x.name === key);
      const s1 = t1.find(x => x.name === key);
      if (s0 && s1) {
        stats.push({
          label: labelDe,
          homeVal: s0.displayValue ?? String(s0.value ?? '0'),
          awayVal: s1.displayValue ?? String(s1.value ?? '0'),
          homeNum: parseFloat(s0.displayValue ?? s0.value) || 0,
          awayNum: parseFloat(s1.displayValue ?? s1.value) || 0
        });
      }
    });
    // Fallback falls andere Sportart (NFL/NBA)
    if (!stats.length && t0.length) {
      t0.slice(0, 8).forEach((s0, idx) => {
        const s1 = t1[idx];
        if (s0 && s1) {
          stats.push({
            label: s0.label || s0.abbreviation || s0.name,
            homeVal: s0.displayValue ?? '',
            awayVal: s1.displayValue ?? '',
            homeNum: parseFloat(s0.displayValue) || 0,
            awayNum: parseFloat(s1.displayValue) || 0
          });
        }
      });
    }
  }

  // Aufstellungen aus rosters
  const rosters = (summaryJson.rosters || []).map(r => {
    const t = r.team || {};
    const rosterList = r.roster || [];
    const starters = rosterList.filter(p => p.starter).map(p => ({
      name: p.athlete?.displayName || '',
      jersey: p.jersey || '',
      pos: p.position?.abbreviation || ''
    }));
    const subs = rosterList.filter(p => !p.starter).map(p => ({
      name: p.athlete?.displayName || '',
      jersey: p.jersey || '',
      pos: p.position?.abbreviation || ''
    }));
    return {
      teamId: String(t.id || ''),
      teamName: cleanSportsTeamName(t.displayName || t.name || '', false),
      teamLogo: t.logos?.[0]?.href || t.logo || '',
      formation: r.formation || '',
      starters,
      subs
    };
  });

  const venue = summaryJson.gameInfo?.venue?.fullName || comp.venue?.fullName || '';
  const attendance = summaryJson.gameInfo?.attendance || 0;
  const videos = (summaryJson.videos || []).map(v => ({
    title: v.headline || v.title || 'Highlight-Clip',
    url: v.links?.web?.href || v.links?.source?.mezzanine?.href || ''
  })).filter(v => v.url);

  return { scorers, cards, stats, rosters, venue, attendance, videos };
}

async function fetchJsonSafe(url) {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    return await r.json();
  } catch (e) {
    return null;
  }
}

async function ensureSportsHubData(w, force = false) {
  const key = getSportsWidgetConfigKey(w);
  let entry = sportsHubState.cache[key];
  const now = Date.now();
  const hasLive = entry && entry.events && entry.events.some(ev => ev.state === 'in');
  const ttl = hasLive ? 60 * 1000 : 5 * 60 * 1000;

  if (entry && entry.loading) return entry;
  if (!force && entry && entry.loadedAt && (now - entry.loadedAt < ttl)) return entry;

  if (!entry) {
    entry = {
      loading: true,
      loadedAt: 0,
      error: null,
      teamInfo: null,
      events: [],
      focusEvent: null,
      focusSummary: null,
      standings: [],
      standLeagueName: '',
      roster: []
    };
    sportsHubState.cache[key] = entry;
  } else {
    entry.loading = true;
  }

  const sport = w.sport || 'soccer';
  const league = w.league || 'ger.1';
  const teamId = String(w.teamId || '').trim();
  const crossComp = w.crossComp !== false && sport === 'soccer';
  const schedLeague = crossComp ? 'all' : league;

  try {
    if (teamId) {
      // 1. Team-Schedule (Vergangenheit/Live + Zukunft) + Tabelle + Kader parallel abrufen
      const [pastJson, fixJson, standJson, rosterJson] = await Promise.all([
        fetchJsonSafe(`https://site.api.espn.com/apis/site/v2/sports/${sport}/${schedLeague}/teams/${teamId}/schedule`),
        sport === 'soccer'
          ? fetchJsonSafe(`https://site.api.espn.com/apis/site/v2/sports/${sport}/${schedLeague}/teams/${teamId}/schedule?fixture=true`)
          : Promise.resolve(null),
        fetchJsonSafe(`https://site.api.espn.com/apis/v2/sports/${sport}/${league}/standings`),
        fetchJsonSafe(`https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/teams/${teamId}/roster`)
      ]);

      const rawTeam = pastJson?.team || fixJson?.team || rosterJson?.team || {};
      entry.teamInfo = {
        id: String(rawTeam.id || teamId),
        name: cleanSportsTeamName(rawTeam.displayName || rawTeam.name || w.teamName || w.title || 'Verein', false),
        logo: rawTeam.logos?.[0]?.href || rawTeam.logo || w.teamLogo || '',
        standingSummary: rawTeam.standingSummary || '',
        color: rawTeam.color ? `#${rawTeam.color}` : ''
      };

      // Alle Events zusammenführen, deduplizieren und chronologisch sortieren
      const combined = [...(pastJson?.events || []), ...(fixJson?.events || [])];
      const seenIds = new Set();
      const normEvents = [];
      combined.forEach(ev => {
        if (!ev || !ev.id || seenIds.has(String(ev.id))) return;
        seenIds.add(String(ev.id));
        const n = normalizeEspnEvent(ev, sport, league);
        if (n) normEvents.push(n);
      });
      normEvents.sort((a, b) => a.dateMs - b.dateMs);
      entry.events = normEvents;

      // Fokus-Spiel bestimmen (1. LIVE-Spiel, 2. Heute anstehendes Spiel innerhalb 12h, 3. Zuletzt beendetes Spiel, 4. Nächstes Spiel)
      const liveEv = normEvents.find(e => e.state === 'in');
      const finishedEvs = normEvents.filter(e => e.state === 'post' || e.completed);
      const upcomingEvs = normEvents.filter(e => e.state === 'pre' && !e.completed);
      const lastFinished = finishedEvs.length ? finishedEvs[finishedEvs.length - 1] : null;
      const nextUpcoming = upcomingEvs.length ? upcomingEvs[0] : null;

      let focusEv = liveEv || lastFinished || nextUpcoming || null;
      // Falls das letzte Spiel schon mehr als 6 Tage her ist und innerhalb der nächsten 36h ein neues Spiel ansteht, zeige trotzdem das letzte Ergebnis im Fokus (wie Google), außer es ist gar kein vergangenes Spiel da
      entry.focusEvent = focusEv;

      // Für das Fokus-Spiel direkt die Summary (Torschützen, Stadion) laden
      if (focusEv && (focusEv.state === 'in' || focusEv.state === 'post')) {
        const sumLeague = sport === 'soccer' ? 'all' : league;
        const sumJson = await fetchJsonSafe(`https://site.api.espn.com/apis/site/v2/sports/${sport}/${sumLeague}/summary?event=${focusEv.id}`);
        entry.focusSummary = parseSummaryDetails(sumJson);
      } else {
        entry.focusSummary = null;
      }

      // Tabelle parsen
      entry.standings = parseStandingsEntries(standJson);
      entry.standLeagueName = translateLeagueNameDe(standJson?.name || standJson?.shortName || league);

      // Kader parsen
      entry.roster = parseRosterEntries(rosterJson);
    } else {
      // Liga-Modus (ohne spezifisches Team): Scoreboard + Standings laden
      const [sbJson, standJson] = await Promise.all([
        fetchJsonSafe(`https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/scoreboard`),
        fetchJsonSafe(`https://site.api.espn.com/apis/v2/sports/${sport}/${league}/standings`)
      ]);

      const lgInfo = sbJson?.leagues?.[0] || {};
      entry.teamInfo = {
        id: '',
        name: translateLeagueNameDe(lgInfo.name || w.teamName || w.title || league),
        logo: lgInfo.logos?.[0]?.href || '',
        standingSummary: lgInfo.season?.type?.name ? translateRoundDe(lgInfo.season.type.name) : ''
      };

      const normEvents = (sbJson?.events || []).map(ev => normalizeEspnEvent(ev, sport, league)).filter(Boolean);
      normEvents.sort((a, b) => a.dateMs - b.dateMs);
      entry.events = normEvents;

      const liveEv = normEvents.find(e => e.state === 'in');
      const finishedEvs = normEvents.filter(e => e.state === 'post' || e.completed);
      entry.focusEvent = liveEv || (finishedEvs.length ? finishedEvs[finishedEvs.length - 1] : normEvents[0]) || null;
      if (entry.focusEvent && (entry.focusEvent.state === 'in' || entry.focusEvent.state === 'post')) {
        const sumJson = await fetchJsonSafe(`https://site.api.espn.com/apis/site/v2/sports/${sport}/${league}/summary?event=${entry.focusEvent.id}`);
        entry.focusSummary = parseSummaryDetails(sumJson);
      }

      entry.standings = parseStandingsEntries(standJson);
      entry.standLeagueName = translateLeagueNameDe(standJson?.name || lgInfo.name || league);
      entry.roster = [];
    }

    entry.loadedAt = Date.now();
    entry.error = null;
  } catch (err) {
    entry.error = 'Sportdaten konnten nicht geladen werden.';
  } finally {
    entry.loading = false;
    if (typeof tick === 'function') tick(true);
  }
  return entry;
}

function parseStandingsEntries(standJson) {
  if (!standJson) return [];
  let rawEntries = standJson.children?.[0]?.standings?.entries || standJson.standings?.entries || [];
  // Falls mehrere Gruppen/Conferences (z.B. NFL/NBA), zusammenführen
  if (!rawEntries.length && Array.isArray(standJson.children)) {
    rawEntries = standJson.children.flatMap(ch => ch.standings?.entries || ch.children?.flatMap(sub => sub.standings?.entries || []) || []);
  }
  return rawEntries.map((ent, idx) => {
    const tm = ent.team || ent.athlete || {};
    const stats = ent.stats || [];
    const getStatVal = (name, fallback = 0) => {
      const s = stats.find(x => x.name === name);
      return s ? (s.value ?? s.displayValue ?? fallback) : fallback;
    };
    const getStatDisp = (name, fallback = '0') => {
      const s = stats.find(x => x.name === name);
      return s ? String(s.displayValue ?? s.value ?? fallback) : fallback;
    };
    const rank = parseInt(getStatVal('rank', idx + 1), 10) || (idx + 1);
    const gp = getStatDisp('gamesPlayed', '0');
    const w = getStatDisp('wins', '0');
    const d = getStatDisp('ties', '0');
    const l = getStatDisp('losses', '0');
    const gf = getStatDisp('pointsFor', '0');
    const ga = getStatDisp('pointsAgainst', '0');
    const diffNum = parseFloat(getStatVal('pointDifferential', 0)) || 0;
    const diffDisp = getStatDisp('pointDifferential', String(diffNum));
    const pts = getStatDisp('points', getStatDisp('winPercent', '0'));

    return {
      id: String(tm.id || ''),
      rank,
      name: cleanSportsTeamName(tm.displayName || tm.name || '', false),
      shortName: cleanSportsTeamName(tm.shortDisplayName || tm.name || tm.displayName || '', true),
      logo: tm.logos?.[0]?.href || tm.logo || '',
      noteColor: ent.note?.color || '',
      noteText: ent.note?.description || '',
      gp, w, d, l, gf, ga, diffNum, diffDisp, pts
    };
  });
}

function parseRosterEntries(rosterJson) {
  if (!rosterJson || !Array.isArray(rosterJson.athletes)) return [];
  // ESPN gibt bei Soccer ein flaches Array von Athleten zurück, bei US-Sport teils gruppiert
  const flat = [];
  rosterJson.athletes.forEach(item => {
    if (Array.isArray(item.items)) {
      item.items.forEach(sub => flat.push(sub));
    } else {
      flat.push(item);
    }
  });
  return flat.map(a => {
    const stats = a.statistics?.splits?.categories || [];
    let apps = 0, goals = 0;
    stats.forEach(cat => {
      (cat.stats || []).forEach(st => {
        if (st.name === 'appearances') apps = st.value || 0;
        if (st.name === 'totalGoals') goals = st.value || 0;
      });
    });
    const posName = a.position?.displayName || a.position?.name || '';
    const posAbbr = a.position?.abbreviation || '';
    let group = 'Mittelfeld';
    if (/goalkeeper|tor/i.test(posName) || posAbbr === 'G' || posAbbr === 'GK') group = 'Torhüter';
    else if (/defender|back|abwehr/i.test(posName) || ['D', 'CD', 'CB', 'LB', 'RB', 'DF'].includes(posAbbr)) group = 'Abwehr';
    else if (/forward|striker|attacker|sturm/i.test(posName) || ['F', 'FW', 'ST', 'CF', 'LW', 'RW'].includes(posAbbr)) group = 'Angriff';

    return {
      id: String(a.id || ''),
      name: a.displayName || a.fullName || '',
      jersey: a.jersey || '–',
      group,
      posAbbr,
      age: a.age || '',
      country: a.citizenship || '',
      flag: a.flag?.href || '',
      apps,
      goals
    };
  });
}

function formatSportsMatchDate(dateMs, state, statusDetail, displayClock) {
  if (!dateMs) return statusDetail || '';
  const d = new Date(dateMs);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const matchDayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((matchDayStart - todayStart) / 86400000);

  const timeStr = d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  const dateShort = d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });

  if (state === 'in') {
    return `● LIVE ${displayClock || statusDetail || ''}`.trim();
  }
  if (state === 'post') {
    if (diffDays === 0) return 'Endstand · Heute';
    if (diffDays === -1) return 'Endstand · Gestern';
    return `Endstand · ${d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })}`;
  }
  if (diffDays === 0) return `Heute, ${timeStr}`;
  if (diffDays === 1) return `Morgen, ${timeStr}`;
  return `${dateShort} · ${timeStr}`;
}

function buildYoutubeHighlightsUrl(homeName, awayName, leagueName, dateMs) {
  const year = dateMs ? new Date(dateMs).getFullYear() : new Date().getFullYear();
  const q = `${homeName} ${awayName} ${leagueName || ''} Highlights Zusammenfassung ${year}`.replace(/\s+/g, ' ').trim();
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
}

/* ---------- Google-Sports Haupt-Renderer ---------- */
function sportsHubCard(w, widgetKey = 'sh_default') {
  const entry = ensureSportsHubData(w, false);
  const uiSt = getSportsUiState(widgetKey);
  const viewMode = w.viewMode || 'google'; // 'google' | 'matches_only' | 'table_only' | 'roster_only'
  const teamId = String(w.teamId || '').trim();
  const sport = w.sport || 'soccer';
  const league = w.league || 'ger.1';

  const activeTab = viewMode === 'matches_only' ? 'matches'
    : viewMode === 'table_only' ? 'table'
    : viewMode === 'roster_only' ? 'roster'
    : (uiSt.tab || 'overview');

  if (!entry || (entry.loading && !entry.loadedAt)) {
    return `<section class="card gsp-card">
      <div class="gsp-loading">
        <div class="gsp-spinner"></div>
        <span>Lade Live-Sportdaten (${esc(w.teamName || w.title || 'Sport-Center')})…</span>
      </div>
    </section>`;
  }

  const tInfo = entry.teamInfo || { name: w.teamName || w.title || 'Sport-Center', logo: '' };
  const standings = entry.standings || [];
  const myStandRow = teamId ? standings.find(r => r.id === teamId || r.name.toLowerCase() === (tInfo.name || '').toLowerCase()) : null;
  const rankSubtitle = myStandRow
    ? `${myStandRow.rank}. in der ${entry.standLeagueName || translateLeagueNameDe(league)}`
    : (tInfo.standingSummary || entry.standLeagueName || translateLeagueNameDe(league));

  // Header mit Vereinslogo, Name, Platzierung & Google-Pill-Tabs
  const showHeader = w.showHeader !== false;
  const headerHtml = showHeader ? `
    <div class="gsp-hdr">
      <div class="gsp-hdr-left">
        ${tInfo.logo ? `<img class="gsp-club-logo" src="${esc(tInfo.logo)}" alt="">` : `<div class="gsp-club-fallback">${ic('soccer', 26)}</div>`}
        <div class="gsp-hdr-titles">
          <div class="gsp-club-name">${esc(w.title || tInfo.name)}</div>
          <div class="gsp-club-sub">${esc(rankSubtitle)}</div>
        </div>
      </div>
      <div class="gsp-hdr-right">
        ${viewMode === 'google' ? `
          <div class="gsp-tabs">
            <button type="button" class="gsp-tab ${activeTab === 'overview' ? 'on' : ''}" data-act="sportsTab" data-wkey="${esc(widgetKey)}" data-tab="overview">Übersicht</button>
            <button type="button" class="gsp-tab ${activeTab === 'matches' ? 'on' : ''}" data-act="sportsTab" data-wkey="${esc(widgetKey)}" data-tab="matches">Spiele</button>
            ${standings.length ? `<button type="button" class="gsp-tab ${activeTab === 'table' ? 'on' : ''}" data-act="sportsTab" data-wkey="${esc(widgetKey)}" data-tab="table">Tabelle</button>` : ''}
            ${teamId && entry.roster && entry.roster.length ? `<button type="button" class="gsp-tab ${activeTab === 'roster' ? 'on' : ''}" data-act="sportsTab" data-wkey="${esc(widgetKey)}" data-tab="roster">Team</button>` : ''}
          </div>
        ` : ''}
        <button type="button" class="gsp-refresh-btn" data-act="sportsRefresh" data-wkey="${esc(widgetKey)}" title="Sportdaten jetzt aktualisieren">↻</button>
      </div>
    </div>
  ` : '';

  // Inhalt je nach gewähltem Tab
  let bodyHtml = '';
  if (activeTab === 'overview') {
    bodyHtml = renderGoogleOverviewTab(w, entry, widgetKey);
  } else if (activeTab === 'matches') {
    bodyHtml = renderGoogleMatchesTab(w, entry, widgetKey, uiSt);
  } else if (activeTab === 'table') {
    bodyHtml = renderGoogleFullTableTab(w, entry, teamId);
  } else if (activeTab === 'roster') {
    bodyHtml = renderGoogleRosterTab(w, entry);
  }

  return `<section class="card gsp-card">${headerHtml}${bodyHtml}</section>`;
}

function renderFocusMatchBlock(ev, focusSummary, sport, isHighlightShown = true) {
  if (!ev) return `<div class="mut sm" style="padding:14px">Aktuell kein Spiel verfügbar.</div>`;
  const isLive = ev.state === 'in';
  const isPost = ev.state === 'post' || ev.completed;
  const compLine = [ev.leagueName, ev.roundName].filter(Boolean).join(' · ');
  const statusStr = formatSportsMatchDate(ev.dateMs, ev.state, ev.statusDetail, ev.displayClock);

  // Torschützen aus focusSummary oder inlineDetails
  let scorers = focusSummary?.scorers || [];
  if (!scorers.length && ev.inlineDetails && ev.inlineDetails.length) {
    scorers = ev.inlineDetails.filter(d => d.isGoal && d.athlete).map(d => ({
      clock: d.clock,
      player: d.athlete,
      teamId: d.teamId
    }));
  }
  const homeScorers = scorers.filter(s => s.teamId === ev.home.id);
  const awayScorers = scorers.filter(s => s.teamId === ev.away.id);
  const hasScorers = homeScorers.length > 0 || awayScorers.length > 0;

  const ytUrl = buildYoutubeHighlightsUrl(ev.home.name, ev.away.name, ev.leagueName, ev.dateMs);

  return `
    <div class="gsp-focus" data-act="sportsMatchDetail" data-sport="${esc(sport)}" data-league="${esc(ev.leagueSlug || 'all')}" data-event="${esc(ev.id)}" data-home="${esc(ev.home.name)}" data-away="${esc(ev.away.name)}" data-date="${ev.dateMs}">
      <div class="gsp-focus-meta">
        <span>${esc(compLine || 'Spiel')}</span>
        ${ev.venue ? `<span class="mut">· ${esc(ev.venue)}</span>` : ''}
      </div>
      <div class="gsp-focus-main">
        <div class="gsp-focus-team">
          ${ev.home.logo ? `<img src="${esc(ev.home.logo)}" alt="">` : `<div class="gsp-logo-ph">${ic('soccer', 22)}</div>`}
          <span class="gsp-focus-tname">${esc(ev.home.shortName)}</span>
        </div>
        <div class="gsp-focus-center">
          ${(isLive || isPost) ? `
            <div class="gsp-focus-score ${isLive ? 'live' : ''}">
              <span>${esc(ev.home.score || '0')}</span>
              <span class="gsp-score-sep">–</span>
              <span>${esc(ev.away.score || '0')}</span>
            </div>
          ` : `
            <div class="gsp-focus-vs">vs</div>
          `}
          <div class="gsp-focus-status ${isLive ? 'live' : ''}">${esc(statusStr)}</div>
        </div>
        <div class="gsp-focus-team">
          ${ev.away.logo ? `<img src="${esc(ev.away.logo)}" alt="">` : `<div class="gsp-logo-ph">${ic('soccer', 22)}</div>`}
          <span class="gsp-focus-tname">${esc(ev.away.shortName)}</span>
        </div>
      </div>

      ${hasScorers ? `
        <div class="gsp-focus-scorers">
          <div class="gsp-scorer-col left">
            ${homeScorers.map(s => `<div>⚽ <b>${esc(s.clock)}</b> ${esc(s.player)}</div>`).join('')}
          </div>
          <div class="gsp-scorer-col right">
            ${awayScorers.map(s => `<div>${esc(s.player)} <b>${esc(s.clock)}</b> ⚽</div>`).join('')}
          </div>
        </div>
      ` : ''}

      <div class="gsp-focus-actions" data-act="noop">
        ${isHighlightShown && (isPost || isLive) ? `
          <a class="gsp-pill-btn yt" href="${esc(ytUrl)}" target="_blank" rel="noopener noreferrer" title="Zusammenfassung & Highlights auf YouTube öffnen">
            ▶ Zusammenfassung
          </a>
        ` : ''}
        <button type="button" class="gsp-pill-btn" data-act="sportsMatchDetail" data-sport="${esc(sport)}" data-league="${esc(ev.leagueSlug || 'all')}" data-event="${esc(ev.id)}" data-home="${esc(ev.home.name)}" data-away="${esc(ev.away.name)}" data-date="${ev.dateMs}">
          ℹ️ Spiel-Details &amp; Aufstellung
        </button>
      </div>
    </div>
  `;
}

function renderGoogleOverviewTab(w, entry, widgetKey) {
  const sport = w.sport || 'soccer';
  const teamId = String(w.teamId || '').trim();
  const showFocus = w.showFocusMatch !== false;
  const showUpcoming = w.showUpcoming !== false;
  const upcomingCount = clamp(parseInt(w.upcomingCount, 10) || 4, 1, 10);
  const showTable = w.showTable !== false && (entry.standings && entry.standings.length > 0);
  const tableRowsCount = clamp(parseInt(w.tableRows, 10) || 6, 3, 20);

  const focusId = entry.focusEvent ? entry.focusEvent.id : '';
  const upcomingEvs = (entry.events || []).filter(e => e.id !== focusId && (e.state === 'pre' || !e.completed)).slice(0, upcomingCount);

  const upcomingGridHtml = showUpcoming && upcomingEvs.length ? `
    <div class="gsp-upcoming-grid">
      ${upcomingEvs.map(ev => {
        const d = ev.dateMs ? new Date(ev.dateMs) : null;
        const dateLine = d ? d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' }) : '';
        const timeLine = d ? d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : '';
        const isNonDefaultLeague = ev.leagueSlug && w.league && ev.leagueSlug !== w.league;
        return `
          <div class="gsp-up-tile" data-act="sportsMatchDetail" data-sport="${esc(sport)}" data-league="${esc(ev.leagueSlug || 'all')}" data-event="${esc(ev.id)}" data-home="${esc(ev.home.name)}" data-away="${esc(ev.away.name)}" data-date="${ev.dateMs}">
            <div class="gsp-up-teams">
              ${isNonDefaultLeague ? `<div class="gsp-up-comp">${esc(ev.leagueName)}</div>` : ''}
              <div class="gsp-up-trow">
                ${ev.home.logo ? `<img src="${esc(ev.home.logo)}" alt="">` : `<span class="gsp-up-dot"></span>`}
                <span class="${ev.home.id === teamId ? 'me' : ''}">${esc(ev.home.shortName)}</span>
              </div>
              <div class="gsp-up-trow">
                ${ev.away.logo ? `<img src="${esc(ev.away.logo)}" alt="">` : `<span class="gsp-up-dot"></span>`}
                <span class="${ev.away.id === teamId ? 'me' : ''}">${esc(ev.away.shortName)}</span>
              </div>
            </div>
            <div class="gsp-up-time">
              <div>${esc(dateLine)}</div>
              <b>${esc(timeLine)}</b>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  ` : '';

  const leftColHtml = `
    <div class="gsp-panel">
      <div class="gsp-panel-hdr" data-act="sportsTab" data-wkey="${esc(widgetKey)}" data-tab="matches">
        <div><b>Spiele</b></div>
        <span class="gsp-chevron">›</span>
      </div>
      ${showFocus ? renderFocusMatchBlock(entry.focusEvent, entry.focusSummary, sport, true) : ''}
      ${upcomingGridHtml}
      <div class="gsp-panel-ftr">
        <span class="mut sm">Alle Zeitangaben: Mitteleuropäische Zeit</span>
        <button type="button" class="gsp-more-pill" data-act="sportsTab" data-wkey="${esc(widgetKey)}" data-tab="matches">Vollständiger Spielplan ›</button>
      </div>
    </div>
  `;

  if (!showTable) {
    return `<div class="gsp-single">${leftColHtml}</div>`;
  }

  // Kompakte Tabelle rechts (smart um den eigenen Verein zentriert, wie bei Google!)
  const allRows = entry.standings || [];
  let sliceStart = 0;
  if (teamId) {
    const myIdx = allRows.findIndex(r => r.id === teamId);
    if (myIdx !== -1 && allRows.length > tableRowsCount) {
      sliceStart = clamp(myIdx - Math.floor(tableRowsCount / 2), 0, allRows.length - tableRowsCount);
    }
  }
  const visibleRows = allRows.slice(sliceStart, sliceStart + tableRowsCount);

  const rightColHtml = `
    <div class="gsp-panel">
      <div class="gsp-panel-hdr" data-act="sportsTab" data-wkey="${esc(widgetKey)}" data-tab="table">
        <div>
          <b>Tabelle</b>
          <div class="mut sm">${esc(entry.standLeagueName || 'Liga')}</div>
        </div>
        <span class="gsp-chevron">›</span>
      </div>
      <div class="gsp-table-wrap">
        <div class="gsp-trow hdr">
          <div class="c-rk"></div>
          <div class="c-tm">Verein</div>
          <div class="c-num">Sp</div>
          <div class="c-num">S</div>
          <div class="c-num">U</div>
          <div class="c-num">N</div>
          <div class="c-num">TD</div>
          <div class="c-pts">Pkte</div>
        </div>
        ${visibleRows.map(r => {
          const isMe = teamId && r.id === teamId;
          return `
            <div class="gsp-trow ${isMe ? 'me' : ''}">
              <div class="c-rk">${r.rank}</div>
              <div class="c-tm">
                ${r.logo ? `<img src="${esc(r.logo)}" alt="">` : ''}
                <span>${esc(r.shortName)}</span>
              </div>
              <div class="c-num">${esc(r.gp)}</div>
              <div class="c-num">${esc(r.w)}</div>
              <div class="c-num">${esc(r.d)}</div>
              <div class="c-num">${esc(r.l)}</div>
              <div class="c-num">${esc(r.diffDisp)}</div>
              <div class="c-pts">${esc(r.pts)}</div>
            </div>
          `;
        }).join('')}
      </div>
      ${allRows.length > tableRowsCount ? `
        <div class="gsp-panel-ftr" style="justify-content:flex-end">
          <button type="button" class="gsp-more-pill" data-act="sportsTab" data-wkey="${esc(widgetKey)}" data-tab="table">Komplette Tabelle (${allRows.length}) ›</button>
        </div>
      ` : ''}
    </div>
  `;

  return `<div class="gsp-grid">${leftColHtml}${rightColHtml}</div>`;
}

function renderGoogleMatchesTab(w, entry, widgetKey, uiSt) {
  const sport = w.sport || 'soccer';
  const teamId = String(w.teamId || '').trim();
  const allEvs = entry.events || [];

  // Wettbewerbs-Filter ermitteln
  const comps = [];
  const seenComp = new Set();
  allEvs.forEach(e => {
    if (e.leagueName && !seenComp.has(e.leagueName)) {
      seenComp.add(e.leagueName);
      comps.push(e.leagueName);
    }
  });

  const activeComp = uiSt.compFilter || 'all';
  const filtered = activeComp === 'all' ? allEvs : allEvs.filter(e => e.leagueName === activeComp);

  const pastEvs = filtered.filter(e => e.state === 'post' || e.completed).slice().reverse();
  const upcomingEvs = filtered.filter(e => e.state !== 'post' && !e.completed);

  const subTab = uiSt.matchSubTab || (upcomingEvs.length ? 'upcoming' : 'results');
  const listToShow = subTab === 'results' ? pastEvs : upcomingEvs;

  const compFilterHtml = comps.length > 1 ? `
    <div class="gsp-filter-row">
      <button type="button" class="chip ${activeComp === 'all' ? 'on' : ''}" data-act="sportsCompFilter" data-wkey="${esc(widgetKey)}" data-comp="all">Alle Wettbewerbe (${allEvs.length})</button>
      ${comps.map(c => `<button type="button" class="chip ${activeComp === c ? 'on' : ''}" data-act="sportsCompFilter" data-wkey="${esc(widgetKey)}" data-comp="${esc(c)}">${esc(c)}</button>`).join('')}
    </div>
  ` : '';

  const rowsHtml = listToShow.map(ev => {
    const isLive = ev.state === 'in';
    const isPost = ev.state === 'post' || ev.completed;
    const statusStr = formatSportsMatchDate(ev.dateMs, ev.state, ev.statusDetail, ev.displayClock);
    const ytUrl = buildYoutubeHighlightsUrl(ev.home.name, ev.away.name, ev.leagueName, ev.dateMs);

    return `
      <div class="gsp-match-row" data-act="sportsMatchDetail" data-sport="${esc(sport)}" data-league="${esc(ev.leagueSlug || 'all')}" data-event="${esc(ev.id)}" data-home="${esc(ev.home.name)}" data-away="${esc(ev.away.name)}" data-date="${ev.dateMs}">
        <div class="gsp-mrow-meta">
          <span class="gsp-mrow-comp">${esc([ev.leagueName, ev.roundName].filter(Boolean).join(' · '))}</span>
          <span class="gsp-mrow-date ${isLive ? 'live' : ''}">${esc(statusStr)}</span>
        </div>
        <div class="gsp-mrow-main">
          <div class="gsp-mrow-team home ${ev.home.id === teamId ? 'me' : ''}">
            <span>${esc(ev.home.name)}</span>
            ${ev.home.logo ? `<img src="${esc(ev.home.logo)}" alt="">` : ''}
          </div>
          <div class="gsp-mrow-score ${isLive ? 'live' : ''}">
            ${(isLive || isPost) ? `${esc(ev.home.score || '0')} : ${esc(ev.away.score || '0')}` : 'vs'}
          </div>
          <div class="gsp-mrow-team away ${ev.away.id === teamId ? 'me' : ''}">
            ${ev.away.logo ? `<img src="${esc(ev.away.logo)}" alt="">` : ''}
            <span>${esc(ev.away.name)}</span>
          </div>
        </div>
        ${(isPost || isLive) ? `
          <div class="gsp-mrow-acts" data-act="noop">
            <a class="gsp-mini-btn" href="${esc(ytUrl)}" target="_blank" rel="noopener noreferrer">▶ Highlights</a>
            <button type="button" class="gsp-mini-btn" data-act="sportsMatchDetail" data-sport="${esc(sport)}" data-league="${esc(ev.leagueSlug || 'all')}" data-event="${esc(ev.id)}" data-home="${esc(ev.home.name)}" data-away="${esc(ev.away.name)}" data-date="${ev.dateMs}">Details ›</button>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="gsp-panel">
      <div class="gsp-subtabs">
        <button type="button" class="pill ${subTab === 'upcoming' ? 'on' : ''}" data-act="sportsSubTab" data-wkey="${esc(widgetKey)}" data-sub="upcoming">📅 Kommende Spiele (${upcomingEvs.length})</button>
        <button type="button" class="pill ${subTab === 'results' ? 'on' : ''}" data-act="sportsSubTab" data-wkey="${esc(widgetKey)}" data-sub="results">✅ Ergebnisse (${pastEvs.length})</button>
      </div>
      ${compFilterHtml}
      <div class="gsp-match-list">
        ${rowsHtml || '<div class="mut sm" style="padding:16px">Keine Spiele in dieser Ansicht gefunden.</div>'}
      </div>
    </div>
  `;
}

function renderGoogleFullTableTab(w, entry, teamId) {
  const rows = entry.standings || [];
  if (!rows.length) {
    return `<div class="gsp-panel"><div class="mut sm" style="padding:16px">Keine Tabellendaten für diesen Wettbewerb verfügbar.</div></div>`;
  }
  return `
    <div class="gsp-panel">
      <div class="gsp-panel-hdr" style="cursor:default">
        <div><b>${esc(entry.standLeagueName || 'Tabelle')}</b></div>
      </div>
      <div class="gsp-table-wrap">
        <div class="gsp-trow hdr">
          <div class="c-rk">#</div>
          <div class="c-tm">Verein</div>
          <div class="c-num">Sp</div>
          <div class="c-num">S</div>
          <div class="c-num">U</div>
          <div class="c-num">N</div>
          <div class="c-goals">Tore</div>
          <div class="c-num">TD</div>
          <div class="c-pts">Pkte</div>
        </div>
        ${rows.map(r => {
          const isMe = teamId && r.id === teamId;
          return `
            <div class="gsp-trow ${isMe ? 'me' : ''}">
              <div class="c-rk" style="border-left:3px solid ${r.noteColor || 'transparent'}">${r.rank}</div>
              <div class="c-tm">
                ${r.logo ? `<img src="${esc(r.logo)}" alt="">` : ''}
                <span>${esc(r.name)}</span>
              </div>
              <div class="c-num">${esc(r.gp)}</div>
              <div class="c-num">${esc(r.w)}</div>
              <div class="c-num">${esc(r.d)}</div>
              <div class="c-num">${esc(r.l)}</div>
              <div class="c-goals mut">${esc(r.gf)}:${esc(r.ga)}</div>
              <div class="c-num">${esc(r.diffDisp)}</div>
              <div class="c-pts">${esc(r.pts)}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderGoogleRosterTab(w, entry) {
  const roster = entry.roster || [];
  if (!roster.length) {
    return `<div class="gsp-panel"><div class="mut sm" style="padding:16px">Keine Kaderdaten verfügbar.</div></div>`;
  }
  const groups = ['Torhüter', 'Abwehr', 'Mittelfeld', 'Angriff'];
  return `
    <div class="gsp-panel">
      ${groups.map(grp => {
        const players = roster.filter(p => p.group === grp);
        if (!players.length) return '';
        return `
          <div class="gsp-roster-sec">
            <div class="gsp-roster-title">${esc(grp)} (${players.length})</div>
            <div class="gsp-roster-grid">
              ${players.map(p => `
                <div class="gsp-player-card">
                  <div class="gsp-jersey">${esc(p.jersey)}</div>
                  <div class="gsp-pinfo">
                    <b>${esc(p.name)}</b>
                    <small>${esc([p.country, p.age ? `${p.age} J.` : ''].filter(Boolean).join(' · '))}</small>
                  </div>
                  ${(p.apps || p.goals) ? `<div class="gsp-pstats">${p.apps ? `<span>${p.apps} Sp.</span>` : ''}${p.goals ? `<b>⚽ ${p.goals}</b>` : ''}</div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

/* ---------- Interaktives Spiel-Detail-Modal (#sm) ---------- */
async function openSportsMatchModal(sport, league, eventId, homeName, awayName, dateMs) {
  sm.open = true;
  sm.mode = 'sportsMatch';
  sportsHubState.modal = {
    loading: true,
    sport: sport || 'soccer',
    league: league || 'all',
    eventId: String(eventId || ''),
    tab: 'events',
    summary: null,
    fallback: { homeName, awayName, dateMs: Number(dateMs) || 0 }
  };
  document.getElementById('sm').classList.add('on');
  renderSportsMatchModal();

  const sumLeague = (sport === 'soccer') ? 'all' : (league || 'all');
  const raw = await fetchJsonSafe(`https://site.api.espn.com/apis/site/v2/sports/${sport}/${sumLeague}/summary?event=${eventId}`);
  sportsHubState.modal.loading = false;
  sportsHubState.modal.summary = raw;
  if (sm.open && sm.mode === 'sportsMatch') {
    renderSportsMatchModal();
  }
}

function renderSportsMatchModal() {
  const m = sportsHubState.modal;
  const sheet = document.getElementById('smsheet');
  if (!sheet) return;

  if (m.loading) {
    sheet.innerHTML = `
      <div class="sm-hdr">
        <div><b>Spiel-Details</b><div class="mut sm">${esc(m.fallback?.homeName || '')} vs ${esc(m.fallback?.awayName || '')}</div></div>
        <button class="x2" data-act="smClose">✕</button>
      </div>
      <div class="gsp-loading" style="padding:36px 0"><div class="gsp-spinner"></div><span>Lade Aufstellungen, Torschützen &amp; Statistiken…</span></div>
    `;
    return;
  }

  const raw = m.summary;
  const comp = raw?.header?.competitions?.[0] || {};
  const competitors = comp.competitors || [];
  const home = competitors.find(c => c.homeAway === 'home') || competitors[0] || {};
  const away = competitors.find(c => c.homeAway === 'away') || competitors[1] || {};
  const hTeam = home.team || {};
  const aTeam = away.team || {};

  const hName = cleanSportsTeamName(hTeam.displayName || hTeam.name || m.fallback?.homeName || 'Heim', false);
  const aName = cleanSportsTeamName(aTeam.displayName || aTeam.name || m.fallback?.awayName || 'Gast', false);
  const hLogo = hTeam.logos?.[0]?.href || hTeam.logo || '';
  const aLogo = aTeam.logos?.[0]?.href || aTeam.logo || '';
  const hScore = home.score ?? '–';
  const aScore = away.score ?? '–';
  const statusText = comp.status?.type?.shortDetail || comp.status?.type?.detail || '';
  const leagueName = translateLeagueNameDe(raw?.header?.league?.name || '');

  const parsed = parseSummaryDetails(raw);
  const ytUrl = buildYoutubeHighlightsUrl(hName, aName, leagueName, m.fallback?.dateMs);

  let tabBody = '';
  if (m.tab === 'events') {
    const scorersHtml = parsed.scorers.length ? parsed.scorers.map(s => {
      const isHome = s.teamId === String(hTeam.id || '');
      return `<div class="gsp-ev-row ${isHome ? 'home' : 'away'}">
        <span class="gsp-ev-min">${esc(s.clock)}</span>
        <span class="gsp-ev-ic">⚽</span>
        <b>${esc(s.player)}</b>
      </div>`;
    }).join('') : '<div class="mut sm">Keine Tore verzeichnet.</div>';

    const cardsHtml = parsed.cards.length ? parsed.cards.map(c => {
      const isHome = c.teamId === String(hTeam.id || '');
      return `<div class="gsp-ev-row ${isHome ? 'home' : 'away'}">
        <span class="gsp-ev-min">${esc(c.clock)}</span>
        <span class="gsp-ev-ic">${c.isRed ? '🟥' : '🟨'}</span>
        <span>${esc(c.player)}</span>
      </div>`;
    }).join('') : '';

    tabBody = `
      <div class="gsp-modal-sec">
        <div class="gsp-modal-stitle">⚽ Tore &amp; Spielereignisse</div>
        <div class="gsp-ev-list">${scorersHtml}</div>
        ${cardsHtml ? `<div class="gsp-modal-stitle" style="margin-top:14px">🟨 Karten</div><div class="gsp-ev-list">${cardsHtml}</div>` : ''}
      </div>
    `;
  } else if (m.tab === 'stats') {
    tabBody = parsed.stats.length ? `
      <div class="gsp-modal-sec">
        ${parsed.stats.map(st => {
          const total = (st.homeNum + st.awayNum) || 1;
          const hPct = Math.round((st.homeNum / total) * 100);
          return `<div class="gsp-stat-bar-row">
            <div class="gsp-stat-vals"><b>${esc(st.homeVal)}</b><span>${esc(st.label)}</span><b>${esc(st.awayVal)}</b></div>
            <div class="gsp-stat-track"><div class="gsp-stat-fill" style="width:${hPct}%"></div></div>
          </div>`;
        }).join('')}
      </div>
    ` : '<div class="mut sm" style="padding:16px 0">Für dieses Spiel liegen noch keine Team-Statistiken vor.</div>';
  } else if (m.tab === 'lineups') {
    tabBody = parsed.rosters.length ? `
      <div class="gsp-lineups-grid">
        ${parsed.rosters.map(r => `
          <div class="gsp-lineup-col">
            <div class="gsp-lineup-hdr">
              ${r.teamLogo ? `<img src="${esc(r.teamLogo)}" alt="">` : ''}
              <div><b>${esc(r.teamName)}</b>${r.formation ? `<div class="mut sm">Formation: ${esc(r.formation)}</div>` : ''}</div>
            </div>
            <div class="gsp-modal-stitle">Startelf</div>
            ${r.starters.map(p => `<div class="gsp-lineup-p"><span class="num">${esc(p.jersey)}</span><b>${esc(p.name)}</b><small class="mut">${esc(p.pos)}</small></div>`).join('') || '<div class="mut sm">Noch nicht bekannt</div>'}
            ${r.subs.length ? `<div class="gsp-modal-stitle" style="margin-top:10px">Bank</div>${r.subs.map(p => `<div class="gsp-lineup-p mut"><span class="num">${esc(p.jersey)}</span><span>${esc(p.name)}</span><small>${esc(p.pos)}</small></div>`).join('')}` : ''}
          </div>
        `).join('')}
      </div>
    ` : '<div class="mut sm" style="padding:16px 0">Aufstellungen sind für dieses Spiel noch nicht veröffentlicht.</div>';
  }

  sheet.innerHTML = `
    <div class="sm-hdr">
      <div>
        <b>${esc(leagueName || 'Spiel-Details')}</b>
        <div class="mut sm">${esc([parsed.venue, parsed.attendance ? `${parsed.attendance.toLocaleString('de-DE')} Zuschauer` : ''].filter(Boolean).join(' · '))}</div>
      </div>
      <button class="x2" data-act="smClose">✕</button>
    </div>

    <div class="gsp-focus" style="cursor:default;margin-bottom:14px">
      <div class="gsp-focus-main">
        <div class="gsp-focus-team">
          ${hLogo ? `<img src="${esc(hLogo)}" alt="">` : ''}
          <span class="gsp-focus-tname">${esc(hName)}</span>
        </div>
        <div class="gsp-focus-center">
          <div class="gsp-focus-score"><span>${esc(String(hScore))}</span><span class="gsp-score-sep">–</span><span>${esc(String(aScore))}</span></div>
          <div class="gsp-focus-status">${esc(statusText)}</div>
        </div>
        <div class="gsp-focus-team">
          ${aLogo ? `<img src="${esc(aLogo)}" alt="">` : ''}
          <span class="gsp-focus-tname">${esc(aName)}</span>
        </div>
      </div>
      <div class="gsp-focus-actions" style="justify-content:center;margin-top:12px">
        <a class="gsp-pill-btn yt" href="${esc(ytUrl)}" target="_blank" rel="noopener noreferrer">▶ Zusammenfassung / Highlights auf YouTube ansehen</a>
        ${parsed.videos.map(v => `<a class="gsp-pill-btn" href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">🎬 ${esc(v.title)}</a>`).join('')}
      </div>
    </div>

    <div class="gsp-tabs" style="margin-bottom:12px">
      <button type="button" class="gsp-tab ${m.tab === 'events' ? 'on' : ''}" data-act="sportsModalTab" data-tab="events">⚽ Tore &amp; Karten (${parsed.scorers.length})</button>
      <button type="button" class="gsp-tab ${m.tab === 'stats' ? 'on' : ''}" data-act="sportsModalTab" data-tab="stats">📊 Statistik (${parsed.stats.length})</button>
      <button type="button" class="gsp-tab ${m.tab === 'lineups' ? 'on' : ''}" data-act="sportsModalTab" data-tab="lineups">👕 Aufstellungen</button>
    </div>

    ${tabBody}
  `;
}

/* ---------- Live-Suche im Editor für beliebige Vereine & Sportarten ---------- */
async function searchSportsTeamsInEditor(query, pi, wi) {
  const q = String(query || '').trim();
  if (!q) return;
  sportsHubState.editorSearch = { loading: true, query: q, results: [], targetPi: pi, targetWi: wi };
  if (typeof renderCfgModal === 'function') renderCfgModal(true);

  const json = await fetchJsonSafe(`https://site.web.api.espn.com/apis/common/v3/search?query=${encodeURIComponent(q)}&limit=10`);
  const items = json?.items || [];
  const results = items.filter(it => it.type === 'team' || it.type === 'league').map(it => ({
    kind: it.type,
    id: it.type === 'team' ? String(it.id || '') : '',
    name: it.displayName || it.shortDisplayName || '',
    sport: it.sport || 'soccer',
    league: it.defaultLeagueSlug || it.league || 'ger.1',
    logo: it.logos?.[0]?.href || ''
  }));

  sportsHubState.editorSearch = { loading: false, query: q, results, targetPi: pi, targetWi: wi };
  if (typeof renderCfgModal === 'function') renderCfgModal(true);
}

function refreshAllSportsHubs(force = false) {
  (CONFIG.customPages || []).forEach(p => {
    (p.widgets || []).forEach(w => {
      if (w && w.type === 'sports_hub' && w.show !== false) {
        ensureSportsHubData(w, force);
      }
    });
  });
}

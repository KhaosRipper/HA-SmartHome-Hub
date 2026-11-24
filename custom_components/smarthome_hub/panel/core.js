/* ==========================================================================
   Smart Home Hub – Core Module (core.js)
   Icons, Helfer, State, HA-Bridge, Theme, Kiosk, PIN & Konfigurations-Speicher
   ========================================================================== */

const VERSION = '3.7.6';

/* ---------- Mehrsprachigkeit (i18n: Deutsch & Englisch) ---------- */
const I18N = {
  de: {
    'cal.style.list': '📋 7-Tage-Liste (Classic)',
    'cal.style.agenda': '⚡ Kompakt-Agenda (Nur Termine)',
    'cal.style.google': '🟦 Google-Kalender-Stil',
    'cal.style.apple': '🍎 Apple-Kalender-Stil (Split)',
    'cal.style.board': '🗂️ Wochen-Board (7 Spalten)',
    'cal.style.month': '📅 Monats-Kalender (Raster)',
    'cal.short.list': 'Liste',
    'cal.short.agenda': 'Agenda',
    'cal.short.google': 'Google',
    'cal.short.apple': 'Apple',
    'cal.short.board': 'Board',
    'cal.short.month': 'Monat',
    'cal.title': 'Kalender',
    'cal.page_title': 'Familienkalender',
    'cal.sub_14d': 'Familienkalender · 14 Tage',
    'cal.sub_month': 'Monatsübersicht',
    'cal.sub_7d': 'Familienkalender · 7 Tage',
    'cal.today': 'Heute',
    'cal.tomorrow': 'Morgen',
    'cal.all_day': 'Ganztägig',
    'cal.clock_suffix': ' Uhr',
    'cal.no_events': 'Keine Termine',
    'cal.no_events_period': 'Keine Termine im gewählten Zeitraum',
    'cal.more_events': '+{n} weitere',
    'cal.events_count': '{n} Termine',
    'cal.single_event': '1 Termin',
    'cal.prev_month': 'Vorheriger Monat',
    'cal.next_month': 'Nächster Monat',
    'cal.switch_style': 'Kalender-Optik wechseln',
    'cal.wd_mon': 'Mo',
    'cal.wd_tue': 'Di',
    'cal.wd_wed': 'Mi',
    'cal.wd_thu': 'Do',
    'cal.wd_fri': 'Fr',
    'cal.wd_sat': 'Sa',
    'cal.wd_sun': 'So',
    'trash.title': 'Abfallkalender',
    'trash.sub_30d': 'Nächste 30 Tage',
    'trash.empty': 'Keine anstehenden Abholtermine gefunden',
    'trash.today': 'Heute!',
    'trash.tomorrow': 'Morgen!',
    'trash.in_days': 'in {n} Tagen',
    'trash.alert_title': 'Müllabfuhr {when}: {types}',
    'trash.alert_sub': 'Bitte Tonne(n) rechtzeitig bereitstellen ({date})',
    'trash.alert_done': '✓ Erledigt',
    'state.on': 'Eingeschaltet',
    'state.off': 'Ausgeschaltet',
    'state.open': 'Geöffnet',
    'state.closed': 'Geschlossen',
    'state.playing': 'Spielt ab',
    'state.paused': 'Pausiert',
    'state.idle': 'Bereit',
    'state.standby': 'Standby',
    'state.locked': 'Verriegelt',
    'state.unlocked': 'Entriegelt',
    'state.unavailable': 'Nicht verfügbar',
    'state.unknown': 'Unbekannt',
    'state.heating': 'Heizt',
    'state.active': 'Aktiv',
    'state.ready': 'Bereit',
    'state.mowing': 'Mäht',
    'state.docked': 'In Station',
    'state.returning': 'Fährt zur Station',
    'state.error': 'Fehler!',
    'hvac.heat': 'Heizen',
    'hvac.cool': 'Kühlen',
    'hvac.auto': 'Auto',
    'hvac.off': 'Aus',
    'hvac.dry': 'Entfeuchten',
    'hvac.fan_only': 'Lüfter',
    'hvac.heat_cool': 'Auto',
    'preset.boost': 'Boost',
    'preset.eco': 'Eco',
    'preset.comfort': 'Komfort',
    'preset.away': 'Abwesend',
    'preset.home': 'Zuhause',
    'preset.sleep': 'Schlafen',
    'preset.activity': 'Aktiv',
    'preset.none': 'Normal',
    'fan.auto': 'Auto',
    'fan.low': 'Niedrig',
    'fan.medium': 'Mittel',
    'fan.high': 'Hoch',
    'fan.quiet': 'Leise',
    'fan.turbo': 'Turbo',
    'fan.off': 'Aus',
    'weather_cond.clear-night': 'Klare Nacht',
    'weather_cond.cloudy': 'Bewölkt',
    'weather_cond.exceptional': 'Besondere Wetterlage',
    'weather_cond.fog': 'Nebelig',
    'weather_cond.hail': 'Hagel',
    'weather_cond.lightning': 'Gewitter',
    'weather_cond.lightning-rainy': 'Gewitter mit Regen',
    'weather_cond.partlycloudy': 'Teilweise bewölkt',
    'weather_cond.pouring': 'Starker Regen',
    'weather_cond.rainy': 'Regen',
    'weather_cond.snowy': 'Schnee',
    'weather_cond.snowy-rainy': 'Schneeregen',
    'weather_cond.sunny': 'Sonnig',
    'weather_cond.windy': 'Windig',
    'weather_cond.windy-variant': 'Windig',
    'weather.title': 'Wetter',
    'weather.home': 'Zuhause',
    'weather.forecast_7d': 'Wettervorhersage · 7 Tage',
    'weather.hourly': 'Stündlich (Nächste 24h)',
    'weather.daily_7d': '7-Tage-Trend',
    'weather.loading': 'Lade Vorhersage von Home Assistant…',
    'weather.no_data': 'Keine Vorhersagedaten verfügbar.',
    'weather.humidity': 'Luftfeuchtigkeit',
    'weather.wind': 'Wind',
    'weather.pressure': 'Luftdruck',
    'weather.precipitation': 'Niederschlag',
    'weather.outdoor_temp': 'Außentemperatur',
    'rain.title': 'Regenradar · 60 Min.',
    'rain.sub': 'Niederschlags-Timeline',
    'rain.now': 'Jetzt',
    'rain.dry_60m': 'Trocken (60m)',
    'rain.raining_stop': '🌧️ Aktuell Niederschlag (~{mm} mm) – Lässt gegen {time} Uhr nach.',
    'rain.raining_cont': '🌧️ Aktuell Niederschlag (~{mm} mm) in der nächsten Stunde.',
    'rain.soon': '🌦️ Regen droht in ca. {mins} Min. ({time} Uhr) – Vor dem Gassigehen noch abwarten!',
    'rain.advice_dry': '🌤️ Nächste 60 Minuten trocken – Perfekt zum Lüften & Gassigehen 🐕',
    'rain.prob_max': 'Max. {prob}% Regenrisiko',
    'nav.dashboard': 'Dashboard',
    'nav.rooms': 'Räume',
    'nav.klima': 'Raumklima',
    'nav.cameras': 'Kameras',
    'nav.calendar': 'Kalender',
    'nav.quick_edit': 'Quick-Edit Layout',
    'nav.quick_edit_exit': 'Quick-Edit beenden',
    'nav.fullscreen': 'Vollbild umschalten',
    'nav.configurator': 'Dashboard-Konfigurator',
    'nav.ha_settings': 'Einstellungen',
    'nav.family': 'Familie',
    'nav.owner': 'Hausbesitzer',
    'hero.hello': 'Hallo',
    'hero.active_in': 'in {room} aktiv',
    'hero.no_active_in': 'Keine aktiven Geräte in {room}',
    'hero.device_singular': 'Gerät',
    'hero.device_plural': 'Geräte',
    'hero.all_closed': 'Alle geschlossen',
    'hero.open_count': '{n} geöffnet',
    'hero.door_locked': 'Verriegelt',
    'hero.door_unlocked': 'Entriegelt',
    'hero.window': 'Fenster',
    'hero.door': 'Tür',
    'hero.lock': 'Türschloss',
    'dev.all_rooms': 'Alle Räume',
    'dev.only_room': 'Nur {room}',
    'dev.none_in_room': 'Keine Geräte in „{room}“. Tippe oben rechts auf „Alle Räume“.',
    'dev.target': 'Ziel',
    'dev.opened': 'Geöffnet',
    'dev.closed': 'Geschlossen',
    'dev.open_pct': 'Offen · {pct}%',
    'dev.covers_title': 'Rolläden',
    'dev.all_up': 'Alle hoch',
    'dev.all_stop': 'Stopp',
    'dev.all_down': 'Alle runter',
    'dev.no_covers': 'Keine Rolläden für diesen Raum hinterlegt.',
    'klima.title': 'Raumklima',
    'klima.main_area': 'Hauptbereich',
    'klima.actual': 'Aktuell',
    'klima.target': 'Ziel',
    'klima.heating_to': 'Heizt auf {t}°',
    'klima.cooling_to': 'Kühlt auf {t}°',
    'klima.holding': 'Hält {t}°',
    'klima.off': 'Ausgeschaltet',
    'klima.mode': 'Modus',
    'klima.fan': 'Lüfter',
    'klima.preset': 'Profil',
    'klima.comfort': 'Komfort',
    'klima.normal_mode': 'Normalbetrieb',
    'klima.no_entity': 'Keine Klima-Entität für diesen Raum hinterlegt.',
    'klima.rooms_overview': 'Räume im Überblick',
    'klima.devices_total': '{n} Klimageräte',
    'klima.active_count': '{n} aktiv',
    'klima.all_off': 'Alle aus',
    'klima.avg_actual': 'Ø Ist-Temperatur',
    'klima.avg_humidity': 'Ø Luftfeuchtigkeit',
    'klima.boost_all': '🔥 Boost alle',
    'klima.eco_all': '🌿 Eco (19°C)',
    'klima.off_all': '⏻ Alle aus',
    'sec.title': 'Sicherheit',
    'sec.locks_doors': 'Türschloss & Türen',
    'sec.windows': 'Fensterkontakte',
    'sec.tap_confirm': 'Tippen zum Bestätigen!',
    'sec.unlock': 'Aufschließen',
    'sec.lock': 'Abschließen',
    'sec.open': 'Offen',
    'sec.closed': 'Geschlossen',
    'sec.open_since': 'Offen ({m} Min.)',
    'fav.title': 'Schnellauswahl',
    'fav.sub': 'Favoriten',
    'lights.title': 'Lichter',
    'lights.on_count': '{on} / {total} an',
    'lights.all_off': 'Alle aus',
    'alert.attention': 'Achtung',
    'alert.fix': 'Beheben',
    'pres.title': 'Familien-Präsenz',
    'pres.attendance': 'Anwesenheit',
    'pres.empty': 'Keine Familienmitglieder konfiguriert. Konfigurator → Allgemein → Familien-Präsenz.',
    'pres.home': 'Zuhause',
    'pres.away': 'Unterwegs',
    'pres.home_count': '{home} / {total} zuhause',
    'rout.title': 'Szenen & Routinen',
    'rout.empty': 'Keine Routinen konfiguriert. Konfigurator → Allgemein → Szenen & Routinen.',
    'rout.tap_run': 'Antippen zum Starten',
    'rout.started': 'Routine gestartet: {name}',
    'vent.title': 'Lüftungsempfehlung',
    'vent.empty': 'Keine Räume konfiguriert. Konfigurator → Klima & Wetter → Lüftungsempfehlung.',
    'vent.open_warn_title': 'Fenster zu lange geöffnet! (Auskühlungsschutz)',
    'vent.outdoor': 'Außen',
    'vent.recommend_count': '{n}× Lüften empfohlen',
    'vent.optimal_all': 'Klima optimal',
    'vent.abs_diff': 'Δ {diff} g/m³ abs. Feuchte',
    'vent.status_recommend': '🌬️ Jetzt lüften! Außenluft trockener',
    'vent.status_warm': '☀️ Außen zu warm – Fenster geschlossen halten',
    'vent.status_humid': '💧 Außen schwüler – Nicht lüften',
    'vent.status_ok': '✓ Raumklima optimal',
    'vent.inside': 'Innen',
    'vent.outside': 'Außen',
    'bat.title': 'Speicher-Prognose',
    'bat.empty': 'Kein Batteriespeicher-Sensor gefunden. Konfigurator → Energie → Speicher-Prognose.',
    'bat.charging': 'Lädt ({w} W)',
    'bat.discharging': 'Entlädt ({w} W)',
    'bat.standby': 'Standby (~{w} W)',
    'bat.full_at': 'Voll um ca.',
    'bat.empty_at': 'Reicht bis ca.',
    'bat.remaining': 'Restlaufzeit',
    'bat.charge_dur': 'Ladedauer',
    'bat.cap_usable': 'Nutzbar ({kwh} kWh)',
    'bat.eta_today': '{time} Uhr',
    'bat.eta_tomorrow': 'Morgen {time} Uhr',
    'bat.desc_charging': 'Voll in ca. {dur} ({eta}) bei {w} W Ladung',
    'bat.desc_discharging': 'Reicht ca. {dur} ({eta}) bei {w} W Entladung',
    'bat.desc_idle': 'Reicht ca. {dur} (bei Ø {w} W Grundlast)',
    'bat.short_charging': 'Voll in ca. {dur}',
    'bat.short_discharging': 'Reicht ca. {dur}',
    'sys.title': 'Server & Docker',
    'sys.empty': 'Keine System-Sensoren konfiguriert. Konfigurator → Geräte → System-Health.',
    'sys.cpu': 'CPU-Last',
    'sys.ram': 'RAM',
    'sys.disk': 'SSD / Disk',
    'sys.temp': 'Temperatur',
    'energy.flow_title': 'Energiefluss',
    'energy.flow_sub': 'Live Power Flow',
    'energy.autarky': 'Autarkie',
    'energy.self_consumption': 'Eigenverbrauch',
    'energy.live_flow': 'Aktueller Energiefluss',
    'energy.pv_gen': 'PV-Erzeugung',
    'energy.home_consumption': 'Hausverbrauch',
    'energy.battery': 'Speicher',
    'energy.grid': 'Stromnetz',
    'energy.charging': 'Lädt mit {v}',
    'energy.discharging': 'Entlädt mit {v}',
    'energy.standby': 'Standby',
    'energy.feed_in': 'Einspeisung {v}',
    'energy.grid_import': 'Netzbezug {v}',
    'energy.balanced': 'Ausgeglichen',
    'energy.prices_title': 'Dynamische Strompreise',
    'energy.prices_empty': 'Kein Strompreis-Sensor (Tibber / EPEX Spot / Nordpool) hinterlegt.',
    'energy.price_favorable': '🟢 Günstig',
    'energy.price_expensive': '🔴 Teuer',
    'energy.price_normal': '🟡 Normal',
    'energy.now': 'Aktuell',
    'energy.avg_today': 'Ø Heute',
    'energy.min': 'Min',
    'energy.max': 'Max',
    'energy.wallbox_title': 'Wallbox',
    'energy.wallbox_empty': 'Keine Wallbox-Sensoren konfiguriert.',
    'energy.car_soc': 'Fahrzeug-Akku',
    'energy.charge_power': 'Ladeleistung',
    'energy.charge_mode': 'Lademodus',
    'energy.connected': 'Verbunden',
    'energy.not_connected': 'Nicht verbunden',
    'energy.start': '▶ Start',
    'energy.stop': '⏹ Stopp',
    'energy.vs_yesterday': 'vs. gestern',
    'energy.autarky_day': 'Autarkie (Heute)',
    'energy.autarky_month': 'Autarkie (Monat)',
    'energy.autarky_total': 'Autarkie (Gesamt)',
    'energy.self_ratio': '{pct}% Eigenstrom',
    'energy.history': 'Verlauf',
    'energy.today': 'Heute',
    'energy.month': 'Monat',
    'energy.total': 'Gesamt',
    'energy.live': 'Aktuell',
    'app.title': 'Haushaltsgeräte',
    'app.empty': 'Keine Haushaltsgeräte konfiguriert. Konfigurator → Geräte → Haushaltsgeräte.',
    'app.finished': '✓ Fertig! (Antippen)',
    'app.running': 'Läuft',
    'app.off': 'Aus',
    'app.tap_ack': 'Fertig bestätigt',
    'app.rem_min': 'noch ~{m} Min.',
    'task.points': 'Punkte',
    'task.streak_days': 'Tage Streak',
    'task.open_tasks': 'Offene Aufgaben ({n})',
    'task.all_done': '🎉 Alle Aufgaben für heute erledigt!',
    'task.rewards': 'Belohnungen ({n})',
    'task.done_toast': 'Aufgabe erledigt!',
    'cam.title': 'Kameras',
    'cam.live_streams': '{n} Live-Streams',
    'cam.connecting': 'Verbinde Live-Stream…',
    'cam.paused': 'Pausiert (Tab inaktiv)',
    'cam.live': 'LIVE',
    'cam.snapshot': 'Snapshot',
    'cam.unavailable': 'Kamera nicht erreichbar',
    'cam.reload': 'Stream neu laden',
    'cam.fullscreen': 'Vollbild',
    'cam.hold_badge': 'Schließt in {s}s',
    'cam.doorbell': 'Türklingel',
    'pin.required': 'PIN erforderlich',
    'pin.wrong': 'Falsche PIN',
    'pin.unlock_title': 'PIN zum Aufschließen',
    'pin.kiosk_exit_title': 'PIN für Kiosk-Exit',
    'pin.config_title': 'PIN für Konfigurator',
    'toast.saved_server': 'Konfiguration gespeichert & an alle Geräte übertragen',
    'toast.saved_local': 'Lokal gespeichert (Backend-Verbindung prüfen)',
    'toast.saved_demo': 'Konfiguration im Browser gespeichert (Demo)',
    'toast.reloading': '🔄 Lade Dashboard komplett neu…',
    'toast.no_ha': 'Keine Verbindung zu Home Assistant',
    'toast.discovered': '{rooms} Räume & {devs} Geräte erkannt!',
    'toast.discover_err': 'Fehler beim Auto-Import: {msg}',
    'toast.default_set': 'Als Standard gesetzt – Seite neu laden (F5)',
    'toast.default_err': 'Konnte Standard nicht setzen',
    'qe.active': 'Quick-Edit Modus aktiv',
    'qe.card_visible': 'Sichtbar',
    'qe.card_hidden': 'Ausgeblendet',
    'qe.open_config': 'Konfigurator öffnen',
    'qe.done': '✓ Fertig & Speichern',
    'qe.col_left': '⬅️ Hauptspalte',
    'qe.col_right': '➡️ Seitenspalte',
    'qe.col_full': '↔️ Volle Breite',
    'qe.width_full': '100% Breite',
    'qe.width_half': '50% Breite (1/2)',
    'qe.width_third': '33% Breite (1/3)',
    'qe.width_twothird': '66% Breite (2/3)',
    'qe.width_quarter': '25% Breite (1/4)',
    'qe.move_up': 'Nach oben',
    'qe.move_down': 'Nach unten',
    'qe.hide': 'Ausblenden',
    'qe.show': 'Einblenden',
    'cfg.title': 'Dashboard Konfigurator',
    'cfg.search_placeholder': 'Einstellung, Modul oder Begriff suchen (z. B. Kamera, Wetter, PIN, Müll, Akku)…',
    'cfg.search_clear': 'Suche löschen',
    'cfg.search_matches': '{n} Treffer',
    'cfg.search_no_results': 'Keine Einstellungen für „{q}“ gefunden.',
    'cfg.reset_search': 'Suche zurücksetzen',
    'cfg.expand_all': 'Alle ausklappen',
    'cfg.collapse_all': 'Alle einklappen',
    'cfg.export': 'Export',
    'cfg.import': 'Import',
    'cfg.cancel': 'Abbrechen',
    'cfg.save': 'Speichern & Anwenden',
    'cfg.tab_general': '🏠 Allgemein & Layout',
    'cfg.tab_rooms': '🛋️ Räume & Banner',
    'cfg.tab_devices': '💡 Geräte & Licht',
    'cfg.tab_climate': '🌡️ Klima & Wetter',
    'cfg.tab_energy': '⚡ Energie & PV',
    'cfg.tab_calendar': '📅 Kalender & Müll',
    'cfg.tab_cameras': '🛡️ Sicherheit & Kameras',
    'cfg.tab_pages': '📑 Eigene Seiten',
    'cfg.lang_label': 'Sprache / Language',
    'cfg.lang_auto': '🌐 Automatisch (Home Assistant Sprache)',
    'cfg.lang_de': '🇩🇪 Deutsch',
    'cfg.lang_en': '🇬🇧 English',
    'cfg.lang_global': 'Globale Einstellung übernehmen',
    'chart.current': 'Aktuell',
    'chart.min': 'Minimum',
    'chart.max': 'Maximum',
    'chart.avg': 'Durchschnitt',
    'chart.close': 'Schließen',
    'chart.brightness': 'Helligkeit',
    'chart.color_temp': 'Farbtemperatur',
    'chart.color': 'Farbe',
    'chart.effects': 'Effekte',
    'chart.volume': 'Lautstärke',
    'chart.source': 'Quelle',
    'chart.position': 'Position',
    'chart.history_24h': '24h Verlauf',
    'chart.individual_lights': 'Einzellampen in dieser Gruppe',
    'sports.live': 'LIVE',
    'sports.finished': 'Beendet',
    'sports.upcoming': 'Anstehend',
    'sports.matchday': 'Spieltag',
    'sports.table': 'Tabelle',
    'sports.standings': 'WM-Stand',
    'sports.next_race': 'Nächstes Rennen',
    'sports.qualifying': 'Qualifying',
    'sports.sprint': 'Sprint',
    'sports.race': 'Rennen',
    'sports.calendar': 'Rennkalender',
    'sports.drivers': 'Fahrer-WM',
    'sports.constructors': 'Konstrukteure',
    'sports.focus': 'Fokus',
    'sports.schedule': 'Spielplan',
    'sports.results': 'Ergebnisse',
    'showon.everywhere': 'Überall',
    'cal.no_events_day': 'Keine Termine an diesem Tag.',
    'cal.no_events_next_days': 'Keine anstehenden Termine in den nächsten {n} Tagen.',
    'cal.free': 'Frei',
    'cal.sub_days': 'Familienkalender · {n} Tage',
    'trash.next_days': 'Nächste {n} Tage',
    'trash.no_pickup': 'Keine Abholung ({sub}).',
    'trash.green': 'Grüngut',
    'trash.bio': 'Biotonne',
    'trash.yellow': 'Gelber Sack',
    'trash.glass': 'Altglas',
    'trash.paper': 'Papier',
    'trash.residual': 'Restmüll',
    'trash.bulky': 'Sperrmüll',
    'trash.general': 'Abfall',
    'status.all_normal': 'Alle Systeme normal',
    'status.home_secure': 'Zuhause ist gesichert',
    'status.unlocked_item': '{name} entriegelt',
    'status.windows_open': '{n} Fenster offen',
    'hero.night': 'Gute Nacht',
    'hero.morning': 'Guten Morgen',
    'hero.day': 'Guten Tag',
    'hero.evening': 'Guten Abend',
    'hero.guest': 'Gast',
    'hero.default_greet': 'Das passiert gerade bei dir zuhause.',
    'hero.motion': 'Erkennung',
    'dev.this_room': 'Dieser Raum',
    'dev.col_device': 'Gerät',
    'dev.col_status': 'Status',
    'dev.col_power': 'Leistung',
    'dev.col_runtime': 'Laufzeit',
    'dev.col_today': 'Heute',
    'dev.col_position': 'Position',
    'dev.col_control': 'Steuerung',
    'mh.title': 'Media Hub',
    'mh.no_players': 'Keine Media-Player konfiguriert. Im Konfigurator unter „Media Hub / Audio“ festlegen.',
    'mh.nothing_playing': 'Keine aktive Wiedergabe',
    'mh.unknown_artist': 'Unbekannter Interpret',
    'mh.select_player': 'Player wählen',
    'mh.prev': 'Vorheriger Titel',
    'mh.play_pause': 'Wiedergabe / Pause',
    'mh.next': 'Nächster Titel',
    'mh.vol_down': 'Leiser',
    'mh.vol_up': 'Lauter',
    'mh.mute': 'Stumm',
    'mh.multiroom': 'Multiroom',
    'mh.multiroom_title': 'Multiroom-Gruppe & Lautstärke',
    'mh.multiroom_master': 'Master',
    'mh.multiroom_presets': 'Gruppen-Presets',
    'mh.multiroom_joined': 'Verbunden',
    'mh.multiroom_join': 'Verbinden',
    'mh.search_placeholder': 'Suchen oder Audio-/YouTube-URL eingeben…',
    'mh.search_btn': 'Suchen',
    'mh.search_clear': 'Suche leeren',
    'mh.search_toggle': 'Suche öffnen',
    'mh.searching': 'Suche läuft…',
    'mh.no_results': 'Keine Treffer gefunden.',
    'mh.play_url': 'URL direkt abspielen',
    'mh.radio_favs_empty': 'Noch keine Radio-Favoriten hinterlegt. Nutze die Suche oder ergänze Sender im Konfigurator.',
    'mh.direct_url_hint': 'Füge eine direkte Stream-URL (.mp3/.m3u8) oder YouTube-/SoundCloud-URL ein, um sie sofort abzuspielen.',
    'mh.tab_search_hint': 'Gib einen Suchbegriff ein, um {source} zu durchsuchen.',
    'mh.type.track': 'Titel',
    'mh.type.artist': 'Interpret',
    'mh.type.album': 'Album',
    'mh.type.radio': 'Radio',
    'mh.tab.radio': '📻 Radio',
    'mh.tab.ytube_free': '▶️ YT Music',
    'mh.tab.local_library': '💾 Lokal',
    'mh.tab.direct_url': '🔗 URL',
    'mh.tab.spotify': '🟢 Spotify',
    'mh.tab.music_assistant': '🎵 Music Assistant',
    'mh.toast_playing': 'Wiedergabe gestartet: {title}',
    'mh.toast_preset': 'Gruppe aktiviert: {name}',
    'mh.swipe_hint': 'Wischen zum Wechseln',
    'mh.err_ytube_no_entity': 'Keine ytube_music_player-Entität im Konfigurator gewählt.',
    'mh.err_ytube_missing': 'Integration „ytube_music_player“ ist in Home Assistant nicht verfügbar.',
    'mh.err_local_no_entity': 'Kein Medienserver-Player (Emby/Jellyfin/DLNA) konfiguriert.',
    'mh.err_spotify_no_entity': 'Keine Spotify-/SpotifyPlus-Entität konfiguriert.',
    'mh.err_spotify_missing': 'Spotify / SpotifyPlus Dienst nicht verfügbar.',
    'mh.err_ma_missing': 'Music Assistant Integration ist nicht installiert oder nicht aktiv.',
    'mh.err_radio_browse': 'Radio Browser Live-Suche nicht verfügbar (Favoriten aktiv).',
    'mh.err_extractor_missing': 'Für YouTube/SoundCloud-URLs wird die HA-Integration „media_extractor“ benötigt.',
    'mh.err_invalid_url': 'Bitte eine gültige http:// oder https:// URL eingeben.',
    'mh.err_no_player': 'Kein Ziel-Player ausgewählt.',
    'mh.err_search_failed': 'Suche fehlgeschlagen – Provider-Status prüfen.',
    'mh.err_provider_unknown': 'Unbekannter Medien-Provider.',
    'mh.err_nothing_selected': 'Kein Medienelement ausgewählt.',
    'mh.cfg_tab': '🎵 Media Hub / Audio',
    'mh.cfg_box_profile': '🎛️ Aktivierung, Betriebsprofil & Musik-Quellen',
    'mh.cfg_box_profile_desc': 'Läuft standardmäßig 100 % ohne Abo (Radio Browser, ytube_music_player, Emby/Jellyfin/DLNA, Direkt-URL). Optional mit Spotify/SpotifyPlus oder Music Assistant.',
    'mh.cfg_title': 'Widget-Titel',
    'mh.cfg_profile': 'Betriebsprofil',
    'mh.cfg_profile_free': 'Free Direct (0 € / Ohne Abo)',
    'mh.cfg_profile_hybrid': 'Hybrid Premium (Free + Spotify / SpotifyPlus)',
    'mh.cfg_profile_ma': 'Music Assistant (All-in-One-Modus)',
    'mh.cfg_radio_enable': 'Webradio (Radio Browser) aktivieren',
    'mh.cfg_radio_live': 'Radio Browser Live-Suche aktivieren',
    'mh.cfg_ytube_enable': 'YouTube Music Free (ytube_music_player via HACS)',
    'mh.cfg_ytube_ent': 'ytube_music_player Entität',
    'mh.cfg_local_enable': 'Lokale Bibliothek / Medienserver (Emby, Jellyfin, DLNA)',
    'mh.cfg_local_ent': 'Medienserver-Entität (media_player.*)',
    'mh.cfg_direct_enable': 'Direkt-URL / media_extractor (Audio, YouTube, SoundCloud)',
    'mh.cfg_spotify_enable': 'Spotify / SpotifyPlus aktivieren (optional)',
    'mh.cfg_spotify_mode': 'Spotify-Backend',
    'mh.cfg_spotify_ent': 'Spotify-Entität (media_player.*)',
    'mh.cfg_ma_enable': 'Music Assistant aktivieren',
    'mh.cfg_ma_entry': 'Music Assistant Config-Entry-ID (optional)',
    'mh.cfg_box_players': '🔊 Ausgabe-Player (media_player.*)',
    'mh.cfg_box_players_desc': 'Wähle deine Lautsprecher/Verstärker aus Home Assistant und vergib optionale Kurznamen.',
    'mh.cfg_default_player': 'Standard-Master-Player',
    'mh.cfg_player_entity': 'Player-Entität (media_player.*)',
    'mh.cfg_player_name': 'Anzeigename (optional)',
    'mh.cfg_add_player': '+ Player hinzufügen',
    'mh.cfg_detected_players': 'Erkannte media_player Entitäten (1-Klick):',
    'mh.cfg_box_multiroom': '🔗 Multiroom & Gruppen-Presets',
    'mh.cfg_box_multiroom_desc': 'Automatische Erkennung gruppierbarer Lautsprecher (Feature-Bit 524288) oder manuelle Auswahl + Presets.',
    'mh.cfg_mr_enable': 'Multiroom-Steuerung im Widget aktivieren',
    'mh.cfg_mr_override': 'Gruppierbare Player manuell einschränken (leer = automatisch via Feature-Bit 524288):',
    'mh.cfg_mr_presets': 'Multiroom-Presets',
    'mh.cfg_mr_preset_name': 'Gruppenname',
    'mh.cfg_mr_preset_master': 'Master-Player',
    'mh.cfg_mr_preset_members': 'Mitglieder',
    'mh.cfg_add_preset': '+ Gruppen-Preset hinzufügen',
    'mh.cfg_box_radio': '📻 Radio-Favoriten',
    'mh.cfg_box_radio_desc': 'Eigene Sender mit Name, media_content_id/Stream-URL und Icon hinzufügen, sortieren oder löschen.',
    'mh.cfg_rf_name': 'Sendername',
    'mh.cfg_rf_cid': 'media_content_id oder Stream-URL',
    'mh.cfg_rf_icon': 'Icon / Emoji',
    'mh.cfg_add_rf': '+ Radio-Favorit hinzufügen',
    'mh.cfg_box_ui': '📱 Suche, Touch-Optimierung & Widget-Layout',
    'mh.cfg_box_ui_desc': 'Wand-Tablet-Dichte (48×48px Touch-Ziele), Swipe-Gesten, Suchleisten-Position & Design.',
    'mh.cfg_search_scope': 'Suchbereich',
    'mh.cfg_scope_tab': 'Nur aktiver Quellen-Tab',
    'mh.cfg_scope_combined': 'Kombinierte Suche über alle aktiven Quellen',
    'mh.cfg_media_types': 'Suchbare Medientypen:',
    'mh.cfg_density': 'Bedienmodus / UI-Dichte',
    'mh.cfg_density_std': 'Standard (Desktop & Kompakt)',
    'mh.cfg_density_touch': 'Wand-Tablet Touch (≥ 48×48px & 16px Suche)',
    'mh.cfg_tab_swipe': 'Tab-Swipe (Wischen zwischen Quellen-Tabs)',
    'mh.cfg_track_swipe': 'Track-Swipe (Wischen auf Now-Playing-Banner)',
    'mh.cfg_search_pos': 'Suchleisten-Position',
    'mh.cfg_pos_header': 'Header (oben)',
    'mh.cfg_pos_below_tabs': 'Unter den Tabs',
    'mh.cfg_pos_footer': 'Footer (unten)',
    'mh.cfg_search_style': 'Suchleisten-Stil',
    'mh.cfg_style_full': 'Voll (Input + Filter-Chips)',
    'mh.cfg_style_compact': 'Kompakt (Schmal)',
    'mh.cfg_style_icon': 'Nur Icon (Overlay ausklappbar)',
    'mh.cfg_player_style': 'Player-Auswahlstil',
    'mh.cfg_pstyle_pills': 'Quick-Switch-Pills',
    'mh.cfg_pstyle_dropdown': 'Dropdown-Auswahl',
    'mh.cfg_vol_style': 'Lautstärke-Stil',
    'mh.cfg_vstyle_slider': 'Slider + Mute',
    'mh.cfg_vstyle_buttons': 'Buttons (Vol − / Mute / Vol +)',
    'mh.cfg_show_cover': 'Cover-Art (entity_picture) anzeigen',
    'mh.cfg_radio_cols': 'Radio-Grid Spaltenanzahl (1–4)'
  },
  en: {
    'cal.style.list': '📋 7-Day List (Classic)',
    'cal.style.agenda': '⚡ Compact Agenda (Events only)',
    'cal.style.google': '🟦 Google Calendar Style',
    'cal.style.apple': '🍎 Apple Calendar Style (Split)',
    'cal.style.board': '🗂️ Weekly Board (7 Columns)',
    'cal.style.month': '📅 Monthly Calendar (Grid)',
    'cal.short.list': 'List',
    'cal.short.agenda': 'Agenda',
    'cal.short.google': 'Google',
    'cal.short.apple': 'Apple',
    'cal.short.board': 'Board',
    'cal.short.month': 'Month',
    'cal.title': 'Calendar',
    'cal.page_title': 'Family Calendar',
    'cal.sub_14d': 'Family Calendar · 14 Days',
    'cal.sub_month': 'Monthly Overview',
    'cal.sub_7d': 'Family Calendar · 7 Days',
    'cal.today': 'Today',
    'cal.tomorrow': 'Tomorrow',
    'cal.all_day': 'All day',
    'cal.clock_suffix': '',
    'cal.no_events': 'No events',
    'cal.no_events_period': 'No events in selected period',
    'cal.more_events': '+{n} more',
    'cal.events_count': '{n} events',
    'cal.single_event': '1 event',
    'cal.prev_month': 'Previous month',
    'cal.next_month': 'Next month',
    'cal.switch_style': 'Switch calendar style',
    'cal.wd_mon': 'Mon',
    'cal.wd_tue': 'Tue',
    'cal.wd_wed': 'Wed',
    'cal.wd_thu': 'Thu',
    'cal.wd_fri': 'Fri',
    'cal.wd_sat': 'Sat',
    'cal.wd_sun': 'Sun',
    'trash.title': 'Waste Collection',
    'trash.sub_30d': 'Next 30 Days',
    'trash.empty': 'No upcoming collection dates found',
    'trash.today': 'Today!',
    'trash.tomorrow': 'Tomorrow!',
    'trash.in_days': 'in {n} days',
    'trash.alert_title': 'Waste pickup {when}: {types}',
    'trash.alert_sub': 'Please put out bin(s) in time ({date})',
    'trash.alert_done': '✓ Done',
    'state.on': 'On',
    'state.off': 'Off',
    'state.open': 'Open',
    'state.closed': 'Closed',
    'state.playing': 'Playing',
    'state.paused': 'Paused',
    'state.idle': 'Idle',
    'state.standby': 'Standby',
    'state.locked': 'Locked',
    'state.unlocked': 'Unlocked',
    'state.unavailable': 'Unavailable',
    'state.unknown': 'Unknown',
    'state.heating': 'Heating',
    'state.active': 'Active',
    'state.ready': 'Ready',
    'state.mowing': 'Mowing',
    'state.docked': 'Docked',
    'state.returning': 'Returning to dock',
    'state.error': 'Error!',
    'hvac.heat': 'Heat',
    'hvac.cool': 'Cool',
    'hvac.auto': 'Auto',
    'hvac.off': 'Off',
    'hvac.dry': 'Dry',
    'hvac.fan_only': 'Fan',
    'hvac.heat_cool': 'Auto',
    'preset.boost': 'Boost',
    'preset.eco': 'Eco',
    'preset.comfort': 'Comfort',
    'preset.away': 'Away',
    'preset.home': 'Home',
    'preset.sleep': 'Sleep',
    'preset.activity': 'Active',
    'preset.none': 'Normal',
    'fan.auto': 'Auto',
    'fan.low': 'Low',
    'fan.medium': 'Medium',
    'fan.high': 'High',
    'fan.quiet': 'Quiet',
    'fan.turbo': 'Turbo',
    'fan.off': 'Off',
    'weather_cond.clear-night': 'Clear night',
    'weather_cond.cloudy': 'Cloudy',
    'weather_cond.exceptional': 'Exceptional weather',
    'weather_cond.fog': 'Foggy',
    'weather_cond.hail': 'Hail',
    'weather_cond.lightning': 'Thunderstorm',
    'weather_cond.lightning-rainy': 'Thunderstorm & rain',
    'weather_cond.partlycloudy': 'Partly cloudy',
    'weather_cond.pouring': 'Heavy rain',
    'weather_cond.rainy': 'Rainy',
    'weather_cond.snowy': 'Snowy',
    'weather_cond.snowy-rainy': 'Sleet',
    'weather_cond.sunny': 'Sunny',
    'weather_cond.windy': 'Windy',
    'weather_cond.windy-variant': 'Windy',
    'weather.title': 'Weather',
    'weather.home': 'Home',
    'weather.forecast_7d': 'Weather Forecast · 7 Days',
    'weather.hourly': 'Hourly (Next 24h)',
    'weather.daily_7d': '7-Day Trend',
    'weather.loading': 'Loading forecast from Home Assistant…',
    'weather.no_data': 'No forecast data available.',
    'weather.humidity': 'Humidity',
    'weather.wind': 'Wind',
    'weather.pressure': 'Pressure',
    'weather.precipitation': 'Precipitation',
    'weather.outdoor_temp': 'Outdoor Temp',
    'rain.title': 'Rain Radar · 60 Min',
    'rain.sub': 'Precipitation Timeline',
    'rain.now': 'Now',
    'rain.dry_60m': 'Dry (60m)',
    'rain.raining_stop': '🌧️ Currently raining (~{mm} mm) – Expected to stop around {time}.',
    'rain.raining_cont': '🌧️ Currently raining (~{mm} mm) for the next hour.',
    'rain.soon': '🌦️ Rain expected in ~{mins} min ({time}) – Hold off before heading out!',
    'rain.advice_dry': '🌤️ Dry for the next 60 minutes – Great for airing out & walks 🐕',
    'rain.prob_max': 'Max {prob}% rain risk',
    'nav.dashboard': 'Dashboard',
    'nav.rooms': 'Rooms',
    'nav.klima': 'Climate',
    'nav.cameras': 'Cameras',
    'nav.calendar': 'Calendar',
    'nav.quick_edit': 'Quick-Edit Layout',
    'nav.quick_edit_exit': 'Exit Quick-Edit',
    'nav.fullscreen': 'Toggle Fullscreen',
    'nav.configurator': 'Dashboard Configurator',
    'nav.ha_settings': 'Settings',
    'nav.family': 'Family',
    'nav.owner': 'Homeowner',
    'hero.hello': 'Hello',
    'hero.active_in': 'active in {room}',
    'hero.no_active_in': 'No active devices in {room}',
    'hero.device_singular': 'device',
    'hero.device_plural': 'devices',
    'hero.all_closed': 'All closed',
    'hero.open_count': '{n} open',
    'hero.door_locked': 'Locked',
    'hero.door_unlocked': 'Unlocked',
    'hero.window': 'Windows',
    'hero.door': 'Door',
    'hero.lock': 'Door Lock',
    'dev.all_rooms': 'All rooms',
    'dev.only_room': 'Only {room}',
    'dev.none_in_room': 'No devices in "{room}". Tap "All rooms" in the top right.',
    'dev.target': 'Target',
    'dev.opened': 'Open',
    'dev.closed': 'Closed',
    'dev.open_pct': 'Open · {pct}%',
    'dev.covers_title': 'Covers',
    'dev.all_up': 'All up',
    'dev.all_stop': 'Stop',
    'dev.all_down': 'All down',
    'dev.no_covers': 'No covers configured for this room.',
    'klima.title': 'Room Climate',
    'klima.main_area': 'Main area',
    'klima.actual': 'Current',
    'klima.target': 'Target',
    'klima.heating_to': 'Heating to {t}°',
    'klima.cooling_to': 'Cooling to {t}°',
    'klima.holding': 'Holding {t}°',
    'klima.off': 'Off',
    'klima.mode': 'Mode',
    'klima.fan': 'Fan',
    'klima.preset': 'Preset',
    'klima.comfort': 'Comfort',
    'klima.normal_mode': 'Normal mode',
    'klima.no_entity': 'No climate entity configured for this room.',
    'klima.rooms_overview': 'Rooms Overview',
    'klima.devices_total': '{n} climate devices',
    'klima.active_count': '{n} active',
    'klima.all_off': 'All off',
    'klima.avg_actual': 'Avg Current Temp',
    'klima.avg_humidity': 'Avg Humidity',
    'klima.boost_all': '🔥 Boost all',
    'klima.eco_all': '🌿 Eco (19°C)',
    'klima.off_all': '⏻ All off',
    'sec.title': 'Security',
    'sec.locks_doors': 'Door Locks & Doors',
    'sec.windows': 'Window Sensors',
    'sec.tap_confirm': 'Tap again to confirm!',
    'sec.unlock': 'Unlock',
    'sec.lock': 'Lock',
    'sec.open': 'Open',
    'sec.closed': 'Closed',
    'sec.open_since': 'Open ({m} min)',
    'fav.title': 'Quick Access',
    'fav.sub': 'Favorites',
    'lights.title': 'Lights',
    'lights.on_count': '{on} / {total} on',
    'lights.all_off': 'All off',
    'alert.attention': 'Alert',
    'alert.fix': 'Resolve',
    'pres.title': 'Family Presence',
    'pres.attendance': 'Presence',
    'pres.empty': 'No family members configured. Configurator → General → Family Presence.',
    'pres.home': 'Home',
    'pres.away': 'Away',
    'pres.home_count': '{home} / {total} home',
    'rout.title': 'Scenes & Routines',
    'rout.empty': 'No routines configured. Configurator → General → Scenes & Routines.',
    'rout.tap_run': 'Tap to run',
    'rout.started': 'Routine started: {name}',
    'vent.title': 'Ventilation Advice',
    'vent.empty': 'No rooms configured. Configurator → Climate & Weather → Ventilation Advice.',
    'vent.open_warn_title': 'Window open too long! (Heat loss protection)',
    'vent.outdoor': 'Outdoor',
    'vent.recommend_count': '{n}× Air out recommended',
    'vent.optimal_all': 'Climate optimal',
    'vent.abs_diff': 'Δ {diff} g/m³ abs. humidity',
    'vent.status_recommend': '🌬️ Ventilate now! Outdoor air is drier',
    'vent.status_warm': '☀️ Too warm outside – Keep windows closed',
    'vent.status_humid': '💧 More humid outside – Do not ventilate',
    'vent.status_ok': '✓ Room climate optimal',
    'vent.inside': 'Indoor',
    'vent.outside': 'Outdoor',
    'bat.title': 'Battery Forecast',
    'bat.empty': 'No battery sensor found. Configurator → Energy → Battery Forecast.',
    'bat.charging': 'Charging ({w} W)',
    'bat.discharging': 'Discharging ({w} W)',
    'bat.standby': 'Standby (~{w} W)',
    'bat.full_at': 'Full around',
    'bat.empty_at': 'Lasts until',
    'bat.remaining': 'Remaining time',
    'bat.charge_dur': 'Charge duration',
    'bat.cap_usable': 'Usable ({kwh} kWh)',
    'bat.eta_today': '{time}',
    'bat.eta_tomorrow': 'Tomorrow {time}',
    'bat.desc_charging': 'Full in ~{dur} ({eta}) at {w} W charge',
    'bat.desc_discharging': 'Lasts ~{dur} ({eta}) at {w} W discharge',
    'bat.desc_idle': 'Lasts ~{dur} (at avg {w} W base load)',
    'bat.short_charging': 'Full in ~{dur}',
    'bat.short_discharging': 'Lasts ~{dur}',
    'sys.title': 'Server & Docker',
    'sys.empty': 'No system sensors configured. Configurator → Devices → System Health.',
    'sys.cpu': 'CPU Load',
    'sys.ram': 'RAM',
    'sys.disk': 'SSD / Disk',
    'sys.temp': 'Temperature',
    'energy.flow_title': 'Power Flow',
    'energy.flow_sub': 'Live Power Flow',
    'energy.autarky': 'Autarky',
    'energy.self_consumption': 'Self-Consumption',
    'energy.live_flow': 'Current Power Flow',
    'energy.pv_gen': 'PV Generation',
    'energy.home_consumption': 'Home Load',
    'energy.battery': 'Battery',
    'energy.grid': 'Grid',
    'energy.charging': 'Charging at {v}',
    'energy.discharging': 'Discharging at {v}',
    'energy.standby': 'Standby',
    'energy.feed_in': 'Exporting {v}',
    'energy.grid_import': 'Importing {v}',
    'energy.balanced': 'Balanced',
    'energy.prices_title': 'Dynamic Electricity Prices',
    'energy.prices_empty': 'No electricity price sensor (Tibber / EPEX Spot / Nordpool) configured.',
    'energy.price_favorable': '🟢 Low',
    'energy.price_expensive': '🔴 High',
    'energy.price_normal': '🟡 Normal',
    'energy.now': 'Current',
    'energy.avg_today': 'Avg Today',
    'energy.min': 'Min',
    'energy.max': 'Max',
    'energy.wallbox_title': 'Wallbox',
    'energy.wallbox_empty': 'No wallbox sensors configured.',
    'energy.car_soc': 'Vehicle Battery',
    'energy.charge_power': 'Charging Power',
    'energy.charge_mode': 'Charge Mode',
    'energy.connected': 'Connected',
    'energy.not_connected': 'Disconnected',
    'energy.start': '▶ Start',
    'energy.stop': '⏹ Stop',
    'energy.vs_yesterday': 'vs. yesterday',
    'energy.autarky_day': 'Autarky (Today)',
    'energy.autarky_month': 'Autarky (Month)',
    'energy.autarky_total': 'Autarky (Total)',
    'energy.self_ratio': '{pct}% self-powered',
    'energy.history': 'History',
    'energy.today': 'Today',
    'energy.month': 'Month',
    'energy.total': 'Total',
    'energy.live': 'Live',
    'app.title': 'Appliances',
    'app.empty': 'No appliances configured. Configurator → Devices → Appliances.',
    'app.finished': '✓ Done! (Tap)',
    'app.running': 'Running',
    'app.off': 'Off',
    'app.tap_ack': 'Acknowledged',
    'app.rem_min': '~{m} min left',
    'task.points': 'Points',
    'task.streak_days': 'Day Streak',
    'task.open_tasks': 'Open Tasks ({n})',
    'task.all_done': '🎉 All tasks completed for today!',
    'task.rewards': 'Rewards ({n})',
    'task.done_toast': 'Task completed!',
    'cam.title': 'Cameras',
    'cam.live_streams': '{n} Live Streams',
    'cam.connecting': 'Connecting live stream…',
    'cam.paused': 'Paused (tab inactive)',
    'cam.live': 'LIVE',
    'cam.snapshot': 'Snapshot',
    'cam.unavailable': 'Camera unreachable',
    'cam.reload': 'Reload stream',
    'cam.fullscreen': 'Fullscreen',
    'cam.hold_badge': 'Closes in {s}s',
    'cam.doorbell': 'Doorbell',
    'pin.required': 'PIN required',
    'pin.wrong': 'Incorrect PIN',
    'pin.unlock_title': 'PIN to Unlock',
    'pin.kiosk_exit_title': 'PIN to Exit Kiosk',
    'pin.config_title': 'PIN for Configurator',
    'toast.saved_server': 'Configuration saved & synced to all devices',
    'toast.saved_local': 'Saved locally (check backend connection)',
    'toast.saved_demo': 'Configuration saved in browser (Demo)',
    'toast.reloading': '🔄 Reloading dashboard…',
    'toast.no_ha': 'No connection to Home Assistant',
    'toast.discovered': '{rooms} rooms & {devs} devices discovered!',
    'toast.discover_err': 'Auto-import error: {msg}',
    'toast.default_set': 'Set as default – reload page (F5)',
    'toast.default_err': 'Could not set default panel',
    'qe.active': 'Quick-Edit Mode active',
    'qe.card_visible': 'Visible',
    'qe.card_hidden': 'Hidden',
    'qe.open_config': 'Open Configurator',
    'qe.done': '✓ Done & Save',
    'qe.col_left': '⬅️ Main column',
    'qe.col_right': '➡️ Side column',
    'qe.col_full': '↔️ Full width',
    'qe.width_full': '100% Width',
    'qe.width_half': '50% Width (1/2)',
    'qe.width_third': '33% Width (1/3)',
    'qe.width_twothird': '66% Width (2/3)',
    'qe.width_quarter': '25% Width (1/4)',
    'qe.move_up': 'Move up',
    'qe.move_down': 'Move down',
    'qe.hide': 'Hide',
    'qe.show': 'Show',
    'cfg.title': 'Dashboard Configurator',
    'cfg.search_placeholder': 'Search setting, module or keyword (e.g. camera, weather, PIN, waste, battery)…',
    'cfg.search_clear': 'Clear search',
    'cfg.search_matches': '{n} matches',
    'cfg.search_no_results': 'No settings found for "{q}".',
    'cfg.reset_search': 'Reset search',
    'cfg.expand_all': 'Expand all',
    'cfg.collapse_all': 'Collapse all',
    'cfg.export': 'Export',
    'cfg.import': 'Import',
    'cfg.cancel': 'Cancel',
    'cfg.save': 'Save & Apply',
    'cfg.tab_general': '🏠 General & Layout',
    'cfg.tab_rooms': '🛋️ Rooms & Banner',
    'cfg.tab_devices': '💡 Devices & Lights',
    'cfg.tab_climate': '🌡️ Climate & Weather',
    'cfg.tab_energy': '⚡ Energy & PV',
    'cfg.tab_calendar': '📅 Calendar & Waste',
    'cfg.tab_cameras': '🛡️ Security & Cameras',
    'cfg.tab_pages': '📑 Custom Pages',
    'cfg.lang_label': 'Language / Sprache',
    'cfg.lang_auto': '🌐 Automatic (Home Assistant language)',
    'cfg.lang_de': '🇩🇪 Deutsch',
    'cfg.lang_en': '🇬🇧 English',
    'cfg.lang_global': 'Use global setting',
    'chart.current': 'Current',
    'chart.min': 'Minimum',
    'chart.max': 'Maximum',
    'chart.avg': 'Average',
    'chart.close': 'Close',
    'chart.brightness': 'Brightness',
    'chart.color_temp': 'Color Temperature',
    'chart.color': 'Color',
    'chart.effects': 'Effects',
    'chart.volume': 'Volume',
    'chart.source': 'Source',
    'chart.position': 'Position',
    'chart.history_24h': '24h History',
    'chart.individual_lights': 'Individual lights in this group',
    'sports.live': 'LIVE',
    'sports.finished': 'Finished',
    'sports.upcoming': 'Upcoming',
    'sports.matchday': 'Matchday',
    'sports.table': 'Standings',
    'sports.standings': 'Standings',
    'sports.next_race': 'Next Race',
    'sports.qualifying': 'Qualifying',
    'sports.sprint': 'Sprint',
    'sports.race': 'Race',
    'sports.calendar': 'Race Calendar',
    'sports.drivers': 'Drivers',
    'sports.constructors': 'Constructors',
    'sports.focus': 'Focus',
    'sports.schedule': 'Schedule',
    'sports.results': 'Results',
    'showon.everywhere': 'Everywhere',
    'cal.no_events_day': 'No events on this day.',
    'cal.no_events_next_days': 'No upcoming events in the next {n} days.',
    'cal.free': 'Free',
    'cal.sub_days': 'Family Calendar · {n} Days',
    'trash.next_days': 'Next {n} Days',
    'trash.no_pickup': 'No pickup ({sub}).',
    'trash.green': 'Green waste',
    'trash.bio': 'Organic waste',
    'trash.yellow': 'Recycling',
    'trash.glass': 'Glass',
    'trash.paper': 'Paper',
    'trash.residual': 'Residual waste',
    'trash.bulky': 'Bulky waste',
    'trash.general': 'Waste',
    'status.all_normal': 'All systems normal',
    'status.home_secure': 'Home is secure',
    'status.unlocked_item': '{name} unlocked',
    'status.windows_open': '{n} windows open',
    'hero.night': 'Good night',
    'hero.morning': 'Good morning',
    'hero.day': 'Good afternoon',
    'hero.evening': 'Good evening',
    'hero.guest': 'Guest',
    'hero.default_greet': 'Here is what is happening at home.',
    'hero.motion': 'Motion',
    'dev.this_room': 'This room',
    'dev.col_device': 'Device',
    'dev.col_status': 'Status',
    'dev.col_power': 'Power',
    'dev.col_runtime': 'Runtime',
    'dev.col_today': 'Today',
    'dev.col_position': 'Position',
    'dev.col_control': 'Controls',
    'mh.title': 'Media Hub',
    'mh.no_players': 'No media players configured. Set them in Configurator → Media Hub / Audio.',
    'mh.nothing_playing': 'Nothing playing',
    'mh.unknown_artist': 'Unknown artist',
    'mh.select_player': 'Select player',
    'mh.prev': 'Previous track',
    'mh.play_pause': 'Play / Pause',
    'mh.next': 'Next track',
    'mh.vol_down': 'Volume down',
    'mh.vol_up': 'Volume up',
    'mh.mute': 'Mute',
    'mh.multiroom': 'Multiroom',
    'mh.multiroom_title': 'Multiroom Group & Volume',
    'mh.multiroom_master': 'Master',
    'mh.multiroom_presets': 'Group Presets',
    'mh.multiroom_joined': 'Joined',
    'mh.multiroom_join': 'Join',
    'mh.search_placeholder': 'Search or paste audio/YouTube URL…',
    'mh.search_btn': 'Search',
    'mh.search_clear': 'Clear search',
    'mh.search_toggle': 'Toggle search',
    'mh.searching': 'Searching…',
    'mh.no_results': 'No results found.',
    'mh.play_url': 'Play URL directly',
    'mh.radio_favs_empty': 'No radio favorites configured yet. Use search or add stations in the configurator.',
    'mh.direct_url_hint': 'Paste a direct stream URL (.mp3/.m3u8) or YouTube/SoundCloud link to play immediately.',
    'mh.tab_search_hint': 'Enter a search query above to search {source}.',
    'mh.type.track': 'Track',
    'mh.type.artist': 'Artist',
    'mh.type.album': 'Album',
    'mh.type.radio': 'Radio',
    'mh.tab.radio': '📻 Radio',
    'mh.tab.ytube_free': '▶️ YT Music',
    'mh.tab.local_library': '💾 Local',
    'mh.tab.direct_url': '🔗 URL',
    'mh.tab.spotify': '🟢 Spotify',
    'mh.tab.music_assistant': '🎵 Music Assistant',
    'mh.toast_playing': 'Playing: {title}',
    'mh.toast_preset': 'Group activated: {name}',
    'mh.swipe_hint': 'Swipe to switch',
    'mh.err_ytube_no_entity': 'No ytube_music_player entity selected in configurator.',
    'mh.err_ytube_missing': 'Integration "ytube_music_player" is not available in Home Assistant.',
    'mh.err_local_no_entity': 'No local media server player (Emby/Jellyfin/DLNA) configured.',
    'mh.err_spotify_no_entity': 'No Spotify/SpotifyPlus entity configured.',
    'mh.err_spotify_missing': 'Spotify / SpotifyPlus service not available.',
    'mh.err_ma_missing': 'Music Assistant integration is not installed or active.',
    'mh.err_radio_browse': 'Radio Browser live search unavailable (favorites active).',
    'mh.err_extractor_missing': 'The HA "media_extractor" integration is required for YouTube/SoundCloud URLs.',
    'mh.err_invalid_url': 'Please enter a valid http:// or https:// URL.',
    'mh.err_no_player': 'No target player selected.',
    'mh.err_search_failed': 'Search failed – check provider status.',
    'mh.err_provider_unknown': 'Unknown media provider.',
    'mh.err_nothing_selected': 'No media item selected.',
    'mh.cfg_tab': '🎵 Media Hub / Audio',
    'mh.cfg_box_profile': '🎛️ Activation, Provider Profile & Audio Sources',
    'mh.cfg_box_profile_desc': 'Runs 100% subscription-free by default (Radio Browser, ytube_music_player, Emby/Jellyfin/DLNA, Direct URL). Optionally switch to Spotify/SpotifyPlus or Music Assistant.',
    'mh.cfg_title': 'Widget Title',
    'mh.cfg_profile': 'Operating Profile',
    'mh.cfg_profile_free': 'Free Direct (€0 / No Subscription)',
    'mh.cfg_profile_hybrid': 'Hybrid Premium (Free + Spotify / SpotifyPlus)',
    'mh.cfg_profile_ma': 'Music Assistant (All-in-One Mode)',
    'mh.cfg_radio_enable': 'Enable Webradio (Radio Browser)',
    'mh.cfg_radio_live': 'Enable Radio Browser live search',
    'mh.cfg_ytube_enable': 'YouTube Music Free (ytube_music_player via HACS)',
    'mh.cfg_ytube_ent': 'ytube_music_player Entity',
    'mh.cfg_local_enable': 'Local Library / Media Server (Emby, Jellyfin, DLNA)',
    'mh.cfg_local_ent': 'Media Server Entity (media_player.*)',
    'mh.cfg_direct_enable': 'Direct URL / media_extractor (Audio, YouTube, SoundCloud)',
    'mh.cfg_spotify_enable': 'Enable Spotify / SpotifyPlus (optional)',
    'mh.cfg_spotify_mode': 'Spotify Backend',
    'mh.cfg_spotify_ent': 'Spotify Entity (media_player.*)',
    'mh.cfg_ma_enable': 'Enable Music Assistant',
    'mh.cfg_ma_entry': 'Music Assistant Config Entry ID (optional)',
    'mh.cfg_box_players': '🔊 Output Players (media_player.*)',
    'mh.cfg_box_players_desc': 'Select your speakers/receivers from Home Assistant and assign optional short names.',
    'mh.cfg_default_player': 'Default Master Player',
    'mh.cfg_player_entity': 'Player Entity (media_player.*)',
    'mh.cfg_player_name': 'Display Name (optional)',
    'mh.cfg_add_player': '+ Add Player',
    'mh.cfg_detected_players': 'Detected media_player entities (1-Click):',
    'mh.cfg_box_multiroom': '🔗 Multiroom & Group Presets',
    'mh.cfg_box_multiroom_desc': 'Automatic detection of groupable speakers (feature bit 524288) or manual selection + presets.',
    'mh.cfg_mr_enable': 'Enable Multiroom control in widget',
    'mh.cfg_mr_override': 'Manually restrict groupable players (empty = auto via feature bit 524288):',
    'mh.cfg_mr_presets': 'Multiroom Presets',
    'mh.cfg_mr_preset_name': 'Group Name',
    'mh.cfg_mr_preset_master': 'Master Player',
    'mh.cfg_mr_preset_members': 'Members',
    'mh.cfg_add_preset': '+ Add Group Preset',
    'mh.cfg_box_radio': '📻 Radio Favorites',
    'mh.cfg_box_radio_desc': 'Add, reorder, or delete custom stations with name, media_content_id/stream URL, and icon.',
    'mh.cfg_rf_name': 'Station Name',
    'mh.cfg_rf_cid': 'media_content_id or Stream URL',
    'mh.cfg_rf_icon': 'Icon / Emoji',
    'mh.cfg_add_rf': '+ Add Radio Favorite',
    'mh.cfg_box_ui': '📱 Search, Touch Optimization & Widget Layout',
    'mh.cfg_box_ui_desc': 'Wall-tablet density (48×48px touch targets), swipe gestures, search bar position & style.',
    'mh.cfg_search_scope': 'Search Scope',
    'mh.cfg_scope_tab': 'Active source tab only',
    'mh.cfg_scope_combined': 'Combined search across all active sources',
    'mh.cfg_media_types': 'Searchable media types:',
    'mh.cfg_density': 'UI Density / Control Mode',
    'mh.cfg_density_std': 'Standard (Desktop & Compact)',
    'mh.cfg_density_touch': 'Wall-Tablet Touch (≥ 48×48px & 16px search)',
    'mh.cfg_tab_swipe': 'Tab Swipe (horizontal swipe between source tabs)',
    'mh.cfg_track_swipe': 'Track Swipe (swipe on Now-Playing banner)',
    'mh.cfg_search_pos': 'Search Bar Position',
    'mh.cfg_pos_header': 'Header (top)',
    'mh.cfg_pos_below_tabs': 'Below Tabs',
    'mh.cfg_pos_footer': 'Footer (bottom)',
    'mh.cfg_search_style': 'Search Bar Style',
    'mh.cfg_style_full': 'Full (Input + Filter Chips)',
    'mh.cfg_style_compact': 'Compact (Slim)',
    'mh.cfg_style_icon': 'Icon Only (Expandable Overlay)',
    'mh.cfg_player_style': 'Player Selector Style',
    'mh.cfg_pstyle_pills': 'Quick-Switch Pills',
    'mh.cfg_pstyle_dropdown': 'Dropdown Select',
    'mh.cfg_vol_style': 'Volume Style',
    'mh.cfg_vstyle_slider': 'Slider + Mute',
    'mh.cfg_vstyle_buttons': 'Buttons (Vol − / Mute / Vol +)',
    'mh.cfg_show_cover': 'Show Cover Art (entity_picture)',
    'mh.cfg_radio_cols': 'Radio Grid Columns (1–4)'
  }
};

const DEFAULT_DE_TO_EN = {
  'Wetter': 'Weather',
  'Zuhause': 'Home',
  'Wettervorhersage · 7 Tage': 'Weather Forecast · 7 Days',
  'Luftfeuchtigkeit': 'Humidity',
  'Wind': 'Wind',
  'Luftdruck': 'Pressure',
  'Niederschlag': 'Precipitation',
  'Raumklima': 'Room Climate',
  'Hauptbereich': 'Main area',
  'Modus': 'Mode',
  'Lüfter': 'Fan',
  'Geräte': 'Devices',
  'Rolläden': 'Covers',
  'Kalender': 'Calendar',
  'Familienkalender': 'Family Calendar',
  'Familienkalender · 14 Tage': 'Family Calendar · 14 Days',
  'Abfallkalender': 'Waste Collection',
  'Nächste 30 Tage': 'Next 30 Days',
  'Statistik': 'Statistics',
  'Aufgaben': 'Tasks',
  'Energie': 'Energy',
  'Wasser': 'Water',
  'Autarkie': 'Autarky',
  'Vergrößern': 'Expand',
  'Haustür': 'Front Door',
  'Türklingel': 'Doorbell',
  'Dynamische Strompreise': 'Dynamic Electricity Prices',
  'Haushaltsgeräte': 'Appliances',
  'Haushaltsgerät': 'Appliance',
  'Server & Docker': 'Server & Docker',
  'Familie': 'Family',
  'Hausbesitzer': 'Homeowner',
  '🚨 Bedingte Warn-Karten': '🚨 Conditional Alert Cards',
  '🖼️ Raum-Banner (Hero & Kamera)': '🖼️ Room Banner (Hero & Camera)',
  '👥 Familien-Präsenz': '👥 Family Presence',
  '⚡ Szenen & Routinen': '⚡ Scenes & Routines',
  '🔌 Geräteübersicht': '🔌 Devices Overview',
  '📑 Zusätzliche Geräte-Reiter': '📑 Extra Device Tabs',
  '🧺 Haushaltsgeräte-Monitor': '🧺 Appliances Monitor',
  '🪟 Rolläden-Steuerung': '🪟 Covers Control',
  '📅 Familienkalender': '📅 Family Calendar',
  '🛡️ Sicherheits-Status & Türschloss': '🛡️ Security Status & Door Lock',
  '🌡️ Raumklima & Wetter-Kachel': '🌡️ Room Climate & Weather Card',
  '🌧️ Regenradar (60-Minuten-Vorschau)': '🌧️ Rain Radar (60-Min Preview)',
  '🌬️ Smarte Lüftungsempfehlung': '🌬️ Smart Ventilation Advice',
  '⭐ Schnellauswahl / Favoriten': '⭐ Quick Access / Favorites',
  '💶 Dynamische Strompreise': '💶 Dynamic Electricity Prices',
  '⚡ Metriken (Energie / Wasser)': '⚡ Metrics (Energy / Water)',
  '🔄 Power Flow (Energiefluss)': '🔄 Power Flow',
  '🔋 Speicher-Restlaufzeit & Prognose': '🔋 Battery Runtime & Forecast',
  '🚗 Wallbox & E-Auto': '🚗 Wallbox & EV',
  '🔒 Sicherheit (Schlösser/Fenster)': '🔒 Security (Locks/Windows)',
  '💡 Lichter-Gruppen': '💡 Light Groups',
  '🖥️ System-Health (Server/Docker)': '🖥️ System Health (Server/Docker)',
  '🗑️ Abfallkalender': '🗑️ Waste Collection'
};

function getLang() {
  try {
    const prof = typeof getDeviceProfile === 'function' ? getDeviceProfile() : null;
    if (prof && (prof.language === 'de' || prof.language === 'en')) return prof.language;
  } catch (e) {}
  const cfgObj = (typeof cfgDraft !== 'undefined' && cfgDraft && document.getElementById('cfgmodal')?.classList?.contains('show'))
    ? cfgDraft
    : (typeof CONFIG !== 'undefined' ? CONFIG : null);
  const cfgLang = cfgObj && cfgObj.language;
  if (cfgLang === 'de' || cfgLang === 'en') return cfgLang;
  try {
    const h = typeof getHass === 'function' ? getHass() : null;
    const haLang = h && (h.language || (h.locale && h.locale.language));
    if (haLang) return String(haLang).toLowerCase().startsWith('de') ? 'de' : 'en';
  } catch (e) {}
  try {
    if (typeof navigator !== 'undefined' && navigator.language) {
      return String(navigator.language).toLowerCase().startsWith('de') ? 'de' : 'en';
    }
  } catch (e) {}
  return 'de';
}

function getLocale() {
  return getLang() === 'en' ? 'en-US' : 'de-DE';
}

function t(key, vars = null) {
  const lang = getLang();
  const dict = I18N[lang] || I18N.de;
  let str = dict[key] !== undefined ? dict[key] : (I18N.de[key] !== undefined ? I18N.de[key] : String(key));
  if (vars && typeof vars === 'object') {
    Object.keys(vars).forEach(k => {
      str = str.replace(new RegExp('\\{' + k + '\\}', 'g'), String(vars[k] ?? ''));
    });
  }
  return str;
}

function tDefault(str) {
  if (str == null) return '';
  const s = String(str);
  if (getLang() !== 'en') return s;
  return DEFAULT_DE_TO_EN[s] !== undefined ? DEFAULT_DE_TO_EN[s] : s;
}

function tr(deStr, enStr) {
  return getLang() === 'en' ? enStr : deStr;
}

const CALENDAR_STYLE_IDS = ['list', 'agenda', 'google', 'apple', 'board', 'month'];
const CALENDAR_STYLES = CALENDAR_STYLE_IDS.map(id => {
  const row = [id, '', ''];
  Object.defineProperty(row, 1, { get: () => t('cal.style.' + id), enumerable: true });
  Object.defineProperty(row, 2, { get: () => t('cal.short.' + id), enumerable: true });
  return row;
});
const VALID_CALENDAR_STYLES = new Set(CALENDAR_STYLE_IDS);
function normalizeCalendarStyle(val, fallback = 'agenda') {
  const s = String(val || '').trim().toLowerCase();
  return VALID_CALENDAR_STYLES.has(s) ? s : fallback;
}

const ICONS = {
  check:'<path d="M20 6L9 17l-5-5"/>',
  home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
  devices:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  auto:'<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M6 8.5v3.5a3 3 0 0 0 3 3h6.5"/>',
  bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
  scenes:'<path d="M12 3l2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 16.9 6.4 20.1l1.4-6.3L3 9.5l6.4-.6z"/>',
  cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  settings:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
  bulb:'<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
  thermo:'<path d="M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0z"/>',
  tv:'<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>',
  speaker:'<rect x="6" y="3" width="12" height="18" rx="2"/><circle cx="12" cy="14" r="3"/>',
  camera:'<path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="12.5" r="3.5"/>',
  plug:'<path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0zM12 17v5"/>',
  drop:'<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
  blinds:'<path d="M4 4h16M6 4v16M18 4v16M8 8h8M8 12h8M8 16h8"/>',
  up:'<path d="M18 15l-6-6-6 6"/>',
  down:'<path d="M6 9l6 6 6-6"/>',
  stop:'<rect x="6" y="6" width="12" height="12" rx="1.5"/>',
  mower:'<rect x="4" y="9" width="13" height="7" rx="2"/><circle cx="7.5" cy="18" r="2"/><circle cx="15" cy="18" r="2"/><path d="M17 11h3l1 5"/>',
  lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  unlock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/>',
  window:'<rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M12 3v18M4 12h16"/>',
  leaf:'<path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15zM5 19l8-8"/>',
  bell:'<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>',
  moon:'<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  door:'<path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14M4 20h16M14 12v.01"/>',
  fan:'<circle cx="12" cy="12" r="1.6"/><path d="M12 10.4C12 6 14 3 17 4s2 5-3.4 7M13.6 12c4.4 0 7.4 2 6.4 5s-5 2-7-3.4M12 13.6c0 4.4-2 7.4-5 6.4s-2-5 3.4-7M10.4 12C6 12 3 10 4 7s5-2 7 3.4"/>',
  sun:'<circle cx="12" cy="12" r="3.5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
  filter:'<path d="M4 6h16M7 12h10M10 18h4"/>',
  expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  fire:'<path d="M12 3s5 4 5 9a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3 1-5 1-8z"/>',
  radiator:'<path d="M6 5v14M10 5v14M14 5v14M18 5v14M3 8h3M18 8h3M3 16h3M18 16h3"/>',
  ac:'<rect x="3" y="5" width="18" height="8" rx="2"/><path d="M7 17c0 1 1 2 1 3M12 17c0 1 1 2 1 3M17 17c0 1 1 2 1 3"/>',
  sofa:'<path d="M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v5H3z"/>',
  bed:'<path d="M3 18V6M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="1.5"/>',
  shower:'<path d="M5 12a7 7 0 0 1 14 0zM12 5V3M8 16v1.5M12 16v2.5M16 16v1.5"/>',
  teddy:'<circle cx="12" cy="13" r="7"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="6.5" r="2.5"/><circle cx="9.5" cy="12" r=".6"/><circle cx="14.5" cy="12" r=".6"/><path d="M10 16a3 3 0 0 0 4 0"/>',
  chart:'<path d="M3 3v18h18"/><path d="M7 14l4-4 4 3 5-7"/>',
  race:'<path d="M5 21V4"/><path d="M5 4h13l-2 4 2 4H5"/><path d="M9 7h2M13 9h2"/>',
  soccer:'<circle cx="12" cy="12" r="9"/><path d="M9 9l3-2 3 2-1 4h-4zM9 9l-3-1M15 9l3-1M10 13l-2 4M14 13l2 4M8 17l-4 1M16 17l4 1"/>',
  tasks:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8l1.5 1.5L12 7M14 9h3M8 15l1.5 1.5L12 14M14 16h3"/>',
  battery:'<rect x="3" y="7" width="17" height="10" rx="2"/><path d="M22 10v4M7 10v4M10 10v4M13 10v4"/>',
  dishwasher:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 8h16M8 5.5h.01M11 5.5h.01"/><circle cx="12" cy="14" r="4"/>',
  washing:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M4 8h16M8 5.5h.01M11 5.5h.01"/><circle cx="12" cy="14" r="4"/>',
  trash:'<path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 10v7M14 10v7"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  batteryClock:'<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10h2"/><circle cx="17" cy="17" r="4"/><path d="M17 15v2l1.5 1"/>',
  batteryCharge:'<rect x="3" y="6" width="17" height="12" rx="2"/><path d="M20 10h2v4h-2M11 8l-3 5h3l-1 3 4-6h-3z"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff:'<path d="M9.9 4.2A9.1 9.1 0 0 1 12 4c6.5 0 10 8 10 8a18.5 18.5 0 0 1-2.2 3.2M14.1 14.1a3 3 0 1 1-4.2-4.2"/><path d="M1 1l22 22"/><path d="M6.6 6.6A18.2 18.2 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6"/>',
  layout:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
  sliders:'<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
  play:'<polygon points="6 4 20 12 6 20 6 4"/>',
  pause:'<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>',
  prev:'<polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/>',
  next:'<polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/>',
  music:'<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  radio:'<circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>',
  volume:'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
  volumeMute:'<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>'
};
const ic = (n, s = 18) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[n] || ICONS.plug}</svg>`;

/* ---------- Helfer ---------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dom = id => String(id || '').split('.')[0];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const fmt = (v, d = 1) => v == null || isNaN(v) ? '—' : v.toLocaleString(getLocale(), { minimumFractionDigits: 0, maximumFractionDigits: d });
const pad = n => String(n).padStart(2, '0');
const fmtDur = ms => { const s = Math.max(0, Math.floor(ms / 1000)); return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s % 3600 / 60))}:${pad(s % 60)}`; };
const HVAC_DE = new Proxy({ heat:'Heizen', cool:'Kühlen', auto:'Auto', off:'Aus', dry:'Entfeuchten', fan_only:'Lüfter', heat_cool:'Auto' }, {
  get: (target, k) => typeof k === 'string' && I18N.de['hvac.' + k] ? t('hvac.' + k) : target[k]
});
const PRESET_DE = new Proxy({ boost:'Boost', eco:'Eco', comfort:'Komfort', away:'Abwesend', home:'Zuhause', sleep:'Schlafen', activity:'Aktiv', none:'Normal' }, {
  get: (target, k) => typeof k === 'string' && I18N.de['preset.' + k] ? t('preset.' + k) : target[k]
});
const HVAC_LABELS = HVAC_DE;
const PRESET_LABELS = PRESET_DE;
const FAN_LABELS = new Proxy({ auto:'Auto', low:'Niedrig', medium:'Mittel', high:'Hoch', quiet:'Leise', turbo:'Turbo', off:'Aus' }, {
  get: (target, k) => typeof k === 'string' && I18N.de['fan.' + k] ? t('fan.' + k) : target[k]
});
const IC = new Proxy(ICONS, { get: (_, k) => ic(String(k), 20) });
const sinceStr = iso => { const ms = Date.parse(iso); return Number.isFinite(ms) ? fmtDur(Date.now() - ms) : ''; };
const stateLabel = st => (I18N.de['state.' + st] ? t('state.' + st) : st);
const safeId = s => String(s).replace(/[^a-z0-9]/gi, '_');

const WEATHER_CONDITIONS_DE = new Proxy({
  'clear-night': 'Klare Nacht', cloudy: 'Bewölkt', exceptional: 'Besondere Wetterlage', fog: 'Nebelig', hail: 'Hagel',
  lightning: 'Gewitter', 'lightning-rainy': 'Gewitter mit Regen', partlycloudy: 'Teilweise bewölkt', pouring: 'Starker Regen',
  rainy: 'Regen', snowy: 'Schnee', 'snowy-rainy': 'Schneeregen', sunny: 'Sonnig', windy: 'Windig', 'windy-variant': 'Windig'
}, {
  get: (target, k) => typeof k === 'string' && I18N.de['weather_cond.' + k] ? t('weather_cond.' + k) : target[k]
});
const WEATHER_SYMBOLS = {
  'clear-night': '🌙', cloudy: '☁️', exceptional: '🌡️', fog: '🌫️', hail: '🌨️', lightning: '🌩️',
  'lightning-rainy': '⛈️', partlycloudy: '🌤️', pouring: '🌧️', rainy: '🌧️', snowy: '❄️',
  'snowy-rainy': '🌨️', sunny: '☀️', windy: '💨', 'windy-variant': '💨'
};

const THEME_PRESETS = {
  midnight:   { name: 'Midnight Purple',         bg: '#080912', acc: '#7c6cf0', acc2: '#a99bff', ok: '#34d399', warn: '#f59e0b', cool: '#38bdf8', radius: '22px' },
  ocean:      { name: 'Ocean Deep Blue',         bg: '#060c18', acc: '#0284c7', acc2: '#38bdf8', ok: '#10b981', warn: '#f59e0b', cool: '#06b6d4', radius: '20px' },
  emerald:    { name: 'Emerald Forest',          bg: '#05120d', acc: '#059669', acc2: '#34d399', ok: '#10b981', warn: '#f59e0b', cool: '#2dd4bf', radius: '20px' },
  amber:      { name: 'Warm Sunset & Bronze',    bg: '#120a06', acc: '#ea580c', acc2: '#fb923c', ok: '#10b981', warn: '#f59e0b', cool: '#38bdf8', radius: '18px' },
  slate:      { name: 'Pure Slate Pro',          bg: '#090d16', acc: '#6366f1', acc2: '#a5b4fc', ok: '#22c55e', warn: '#f59e0b', cool: '#06b6d4', radius: '18px' },
  nordic:     { name: 'Nordic Frost (Ice Cyan)', bg: '#080f14', acc: '#0ea5e9', acc2: '#7dd3fc', ok: '#2dd4bf', warn: '#fbbf24', cool: '#38bdf8', radius: '16px' },
  cyberpunk:  { name: 'Cyber Neon (Synthwave)',  bg: '#0d0614', acc: '#ec4899', acc2: '#f472b6', ok: '#10b981', warn: '#fbbf24', cool: '#06b6d4', radius: '14px' },
  dracula:    { name: 'Dracula Glow',            bg: '#10111a', acc: '#a855f7', acc2: '#c084fc', ok: '#4ade80', warn: '#facc15', cool: '#22d3ee', radius: '18px' },
  oled:       { name: 'OLED Pure Black',         bg: '#000000', acc: '#4f46e5', acc2: '#818cf8', ok: '#16a34a', warn: '#eab308', cool: '#0284c7', radius: '26px' },
  rose:       { name: 'Rose Gold & Velvet',      bg: '#14080c', acc: '#f43f5e', acc2: '#fb7185', ok: '#10b981', warn: '#f59e0b', cool: '#38bdf8', radius: '22px' },
  coffee:     { name: 'Espresso & Kupfer',       bg: '#110c08', acc: '#c2410c', acc2: '#f97316', ok: '#84cc16', warn: '#eab308', cool: '#38bdf8', radius: '16px' },
  monochrome: { name: 'Monochrome Minimalist',   bg: '#0d0f12', acc: '#94a3b8', acc2: '#cbd5e1', ok: '#22c55e', warn: '#f59e0b', cool: '#38bdf8', radius: '12px' }
};

function moveItem(arr, idx, dir) {
  const target = idx + dir;
  if (!Array.isArray(arr) || target < 0 || target >= arr.length) return;
  const tmp = arr[idx];
  arr[idx] = arr[target];
  arr[target] = tmp;
}

function parseColsMode(val, defaultMode = 'auto', defaultCols = 2) {
  const s = String(val ?? '').trim().toLowerCase();
  if (!s || s === 'auto' || s === 'grid') return { mode: 'auto', cols: defaultCols };
  if (s === '2-asym' || s === '2col-asym' || s === 'asym') return { mode: 'asym', cols: 2 };
  if (s === '2-equal') return { mode: 'cols', cols: 2 };
  if (s === 'column' || s === '1-col' || s === '1col') return { mode: 'cols', cols: 1 };
  const m = s.match(/^(\d+)/);
  if (m) {
    const n = clamp(parseInt(m[1], 10) || defaultCols, 1, 12);
    return { mode: 'cols', cols: n };
  }
  return { mode: defaultMode, cols: defaultCols };
}

function getLocksList(secObj = CONFIG.security) {
  const sec = secObj || {};
  if (Array.isArray(sec.locks) && sec.locks.length) {
    return sec.locks.filter(l => l && l.entity).map(l => ({
      ...l,
      battery: l.battery || '',
      batPos: l.batPos || 'pill',
      batStyle: l.batStyle || 'badge'
    }));
  }
  if (sec.lock) return [{ name: 'Haustür', entity: sec.lock, battery: '', batPos: 'pill', batStyle: 'badge' }];
  return [];
}

function DEFAULT_CLIMATE_TILES() {
  return [
    { type: 'hvac', show: true, label: 'Modus',  entity: '', attr: '', icon: 'sun' },
    { type: 'fan',  show: true, label: 'Lüfter', entity: '', attr: '', icon: 'fan' }
  ];
}

function DEFAULT_MEDIA_HUB_CONFIG() {
  return {
    show: false,
    title: 'Media Hub',
    profile: 'free_direct',
    players: [],
    defaultPlayer: '',
    providers: {
      radio: { enabled: true, liveSearch: true },
      ytube_free: { enabled: false, entity: '' },
      local_library: { enabled: false, entity: '' },
      direct_url: { enabled: true },
      spotify: { enabled: false, mode: 'spotifyplus', entity: '' },
      music_assistant: { enabled: false, configEntryId: '' }
    },
    multiroom: {
      enabled: true,
      groupablePlayers: [],
      presets: []
    },
    radioFavorites: [],
    search: {
      scope: 'active_tab',
      mediaTypes: ['track', 'artist', 'album', 'radio']
    },
    ui: {
      density: 'standard',
      tabSwipe: true,
      trackSwipe: false,
      searchPosition: 'below_tabs',
      searchStyle: 'full',
      playerSelectorStyle: 'pills',
      volumeStyle: 'slider',
      showCoverArt: true,
      radioGridCols: 2
    }
  };
}

function calcAbsoluteHumidity(t, rh) {
  if (t == null || rh == null || isNaN(t) || isNaN(rh)) return null;
  const T = parseFloat(t);
  const RH = parseFloat(rh);
  const vSat = 6.112 * Math.exp((17.67 * T) / (T + 243.5));
  const vAct = (RH / 100) * vSat;
  const ah = (216.7 * vAct) / (273.15 + T);
  return Number.isFinite(ah) ? +ah.toFixed(1) : null;
}

function DEFAULT_DASHBOARD_LAYOUT() {
  return [
    { id: 'alerts',           label: '🚨 Bedingte Warn-Karten',           col: 1, show: true,  scope: 'all',  cfgTab: 'kameras' },
    { id: 'hero',             label: '🖼️ Raum-Banner (Hero & Kamera)',    col: 1, show: true,  scope: 'all',  cfgTab: 'raeume' },
    { id: 'presence',         label: '👥 Familien-Präsenz',               col: 1, show: true,  scope: 'all',  cfgTab: 'allgemein' },
    { id: 'quick_routines',   label: '⚡ Szenen & Routinen',               col: 1, show: true,  scope: 'home', cfgTab: 'allgemein' },
    { id: 'devices',          label: '🔌 Geräteübersicht',                col: 1, show: true,  scope: 'all',  cfgTab: 'geraete' },
    { id: 'extra_tabs',       label: '📑 Zusätzliche Geräte-Reiter',      col: 1, show: true,  scope: 'all',  cfgTab: 'geraete' },
    { id: 'appliances',       label: '🧺 Haushaltsgeräte-Monitor',        col: 1, show: true,  scope: 'all',  cfgTab: 'geraete' },
    { id: 'covers',           label: '🪟 Rolläden-Steuerung',             col: 1, show: true,  scope: 'home', cfgTab: 'geraete' },
    { id: 'calendar',         label: '📅 Familienkalender',               col: 1, show: true,  scope: 'home', cfgTab: 'kalender' },
    { id: 'status',           label: '🛡️ Sicherheits-Status & Türschloss', col: 2, show: true,  scope: 'all',  cfgTab: 'kameras' },
    { id: 'climate',          label: '🌡️ Raumklima & Wetter-Kachel',      col: 2, show: true,  scope: 'all',  cfgTab: 'klima' },
    { id: 'rain_timeline',    label: '🌧️ Regenradar (60-Minuten-Vorschau)', col: 2, show: true, scope: 'all',  cfgTab: 'klima' },
    { id: 'ventilation',      label: '🌬️ Smarte Lüftungsempfehlung',     col: 2, show: true,  scope: 'all',  cfgTab: 'klima' },
    { id: 'favorites',        label: '⭐ Schnellauswahl / Favoriten',     col: 2, show: true,  scope: 'all',  cfgTab: 'geraete' },
    { id: 'energy_prices',    label: '💶 Dynamische Strompreise',         col: 2, show: false, scope: 'all',  cfgTab: 'energie' },
    { id: 'metrics',          label: '⚡ Metriken (Energie / Wasser)',    col: 2, show: true,  scope: 'all',  cfgTab: 'energie' },
    { id: 'power_flow',       label: '🔄 Power Flow (Energiefluss)',      col: 2, show: false, scope: 'home', cfgTab: 'energie' },
    { id: 'battery_forecast', label: '🔋 Speicher-Restlaufzeit & Prognose', col: 2, show: true, scope: 'all',  cfgTab: 'energie' },
    { id: 'wallbox',          label: '🚗 Wallbox & E-Auto',               col: 2, show: false, scope: 'all',  cfgTab: 'energie' },
    { id: 'security',         label: '🔒 Sicherheit (Schlösser/Fenster)', col: 2, show: true,  scope: 'all',  cfgTab: 'kameras' },
    { id: 'lights',           label: '💡 Lichter-Gruppen',                col: 2, show: true,  scope: 'all',  cfgTab: 'geraete' },
    { id: 'media_hub',        label: '🎵 Media Hub / Audio',              col: 1, show: false, scope: 'all',  cfgTab: 'media' },
    { id: 'system_health',    label: '🖥️ System-Health (Server/Docker)',  col: 2, show: false, scope: 'all',  cfgTab: 'geraete' },
    { id: 'trash',            label: '🗑️ Abfallkalender',                 col: 2, show: true,  scope: 'home', cfgTab: 'kalender' }
  ];
}

function isCardInRoomScope(item, roomObj, isHome) {
  if (!item) return false;
  const sc = item.scope || 'all';
  if (sc === 'all') return true;
  if (sc === 'home') return !!isHome;
  if (sc === 'none') return false;
  const rName = (roomObj && roomObj.name) || '';
  if (sc.startsWith('room:')) {
    return rName === sc.slice(5);
  }
  if (sc === 'custom' && Array.isArray(item.scopeRooms)) {
    return item.scopeRooms.includes(rName);
  }
  return true;
}

function normalizeItemShowOn(item, defaultLoc = 'Home') {
  if (!item || typeof item !== 'object') return [defaultLoc];
  if (Array.isArray(item.showOn) && item.showOn.length) {
    return item.showOn.filter(Boolean);
  }
  if (item.room && String(item.room).trim()) {
    return [String(item.room).trim()];
  }
  return [defaultLoc];
}

function isItemVisibleInContext(item, ctx = {}) {
  if (!item) return false;
  if (ctx.showAll) return true;
  const locs = normalizeItemShowOn(item, ctx.defaultLoc || 'Home');
  const lowerLocs = locs.map(l => String(l).toLowerCase());
  if (lowerLocs.includes('all')) return true;

  if (ctx.explicitFilter && String(ctx.explicitFilter).trim()) {
    const f = String(ctx.explicitFilter).trim().toLowerCase();
    if (lowerLocs.includes(f) || lowerLocs.includes('room:' + f) || lowerLocs.includes('page:' + f)) {
      return true;
    }
    return false;
  }

  if (ctx.pageId) {
    const pid = String(ctx.pageId).toLowerCase();
    if (lowerLocs.includes('page:' + pid) || lowerLocs.includes(pid)) return true;
    if (ctx.pageLabel) {
      const pl = String(ctx.pageLabel).toLowerCase();
      if (lowerLocs.includes(pl) || lowerLocs.includes('room:' + pl)) return true;
    }
    return false;
  }

  const rName = String(ctx.roomName || 'Home').toLowerCase();
  if (lowerLocs.includes(rName) || lowerLocs.includes('room:' + rName)) return true;
  return false;
}

function formatItemShowOnSummary(item, cfg = CONFIG) {
  const locs = normalizeItemShowOn(item, 'Home');
  if (locs.includes('all')) return t('showon.everywhere');
  const pages = (cfg && cfg.customPages) || [];
  return locs.map(l => {
    if (l.startsWith('page:')) {
      const pid = l.slice(5);
      const pg = pages.find(p => p && p.id === pid);
      return pg ? `📄 ${tDefault(pg.label)}` : l;
    }
    if (l.startsWith('room:')) return l.slice(5);
    return l;
  }).join(', ');
}

const MODULE_SHOW_PROP_MAP = {
  presence: ['presence', 'show'],
  ventilation: ['ventilation', 'show'],
  battery_forecast: ['batteryForecast', 'show'],
  energy_prices: ['energyPrices', 'show'],
  wallbox: ['wallbox', 'show'],
  appliances: ['appliances', 'show'],
  system_health: ['systemHealth', 'show'],
  media_hub: ['mediaHub', 'show'],
  rain_timeline: ['weather', 'showRainTimeline']
};

function syncLayoutAndModuleShow(cfg, preferModuleFlag = false) {
  if (!cfg || !Array.isArray(cfg.dashboardLayout)) return;
  Object.entries(MODULE_SHOW_PROP_MAP).forEach(([cardId, [modKey, propKey]]) => {
    const dlItem = cfg.dashboardLayout.find(x => x && x.id === cardId);
    const modObj = cfg[modKey];
    if (!dlItem || !modObj || typeof modObj !== 'object') return;
    if (preferModuleFlag) {
      if (modObj[propKey] === false) dlItem.show = false;
      else if (modObj[propKey] === true && dlItem.show === undefined) dlItem.show = true;
      modObj[propKey] = dlItem.show !== false;
    } else {
      modObj[propKey] = dlItem.show !== false;
    }
  });
}

/* ---------- Fenster- & Tür-Offen-Timer & Auskühlungsschutz ---------- */
function getOpenWindowsAndDoors(customWarnMinutes = null) {
  const sec = CONFIG.security || {};
  const vent = CONFIG.ventilation || {};
  const warnMins = customWarnMinutes ?? (vent.openWarnMinutes || 10);
  const outT = num(vent.outdoorTemp);
  const isCold = outT != null ? outT <= (vent.warnOutdoorTempThreshold ?? 12) : true;

  const itemsToCheck = [];
  (sec.windows || []).forEach(w => {
    if (w) itemsToCheck.push({ entity: w, type: 'window' });
  });
  (sec.doors || []).forEach(d => {
    if (typeof d === 'string') itemsToCheck.push({ entity: d, type: 'door' });
    else if (d && d.entity) itemsToCheck.push({ entity: d.entity, name: d.name, type: 'door' });
  });

  const now = Date.now();
  const openList = [];

  itemsToCheck.forEach(it => {
    const s = S(it.entity);
    if (!s) return;
    const isOpen = s.state === 'on' || s.state === 'open' || s.state === 'unlocked';
    if (!isOpen) return;

    const fn = (s.attributes && s.attributes.friendly_name) || it.name || it.entity;
    const since = s.last_changed ? Date.parse(s.last_changed) : now;
    const durationMs = Math.max(0, now - since);
    const minsOpen = Math.floor(durationMs / 60000);
    const isOverdue = minsOpen >= warnMins;

    openList.push({
      entity: it.entity,
      name: fn,
      type: it.type,
      since,
      durationMs,
      minsOpen,
      isOverdue,
      warnTriggered: isOverdue && isCold
    });
  });

  openList.sort((a, b) => b.durationMs - a.durationMs);

  return {
    openItems: openList,
    hasWarn: openList.some(x => x.warnTriggered),
    warnMinutes: warnMins,
    outdoorTemp: outT,
    isCold
  };
}

/* ---------- Speicher-Restlaufzeit & Ladeprognose ---------- */
function calcBatteryForecast() {
  const bf = CONFIG.batteryForecast || {};
  const pf = CONFIG.powerFlow || [];

  const findEnt = (regex) => {
    const item = pf.find(x => regex.test(x.label || '') || regex.test(x.entity || ''));
    return item ? item.entity : '';
  };

  const socEnt = bf.socEntity || findEnt(/speicher|akku|battery/i) || 'sensor.senec_battery_charge_percent';
  const chgEnt = bf.chargePowerEntity || findEnt(/lad|charge/i) || 'sensor.senec_battery_charge_power';
  const disEnt = bf.dischargePowerEntity || findEnt(/entlad|discharge/i) || 'sensor.senec_battery_discharge_power';
  const houseEnt = bf.housePowerEntity || findEnt(/haus|home|verbr/i) || 'sensor.senec_house_power';
  const pvEnt = bf.pvPowerEntity || findEnt(/pv|solar|prod/i) || 'sensor.senec_solar_generated_power';

  const soc = num(socEnt);
  if (soc == null) return null;

  const capacityKwh = parseFloat(bf.capacityKwh) || 10.0;
  const minSoC = parseFloat(bf.minSoC ?? 5);
  const maxSoC = parseFloat(bf.maxSoC ?? 100);

  const chgPower = Math.max(0, num(chgEnt) || 0);
  const disPower = Math.max(0, num(disEnt) || 0);
  const housePower = Math.max(0, num(houseEnt) || 450);
  const pvPower = Math.max(0, num(pvEnt) || 0);

  const totalWh = capacityKwh * 1000;
  const currentWh = (soc / 100) * totalWh;
  const usableWh = Math.max(0, ((soc - minSoC) / 100) * totalWh);
  const neededWh = Math.max(0, ((maxSoC - soc) / 100) * totalWh);

  const now = new Date();

  // 1. Ladung aktiv (> 40 W)
  if (chgPower >= 40) {
    const hoursToFull = neededWh / chgPower;
    const etaMs = Date.now() + Math.min(hoursToFull * 3600000, 48 * 3600000);
    const eta = new Date(etaMs);
    const h = Math.floor(hoursToFull);
    const m = Math.round((hoursToFull - h) * 60);
    const durStr = h > 0 ? `${h}h ${m}m` : `${m}m`;
    const etaStr = eta.toLocaleTimeString(getLocale(), { hour: '2-digit', minute: '2-digit' });
    const isToday = eta.getDate() === now.getDate();
    const etaFmt = isToday ? t('bat.eta_today', { time: etaStr }) : t('bat.eta_tomorrow', { time: etaStr });

    return {
      state: 'charging',
      soc,
      powerW: chgPower,
      hoursRemaining: hoursToFull,
      durationStr: durStr,
      etaStr: etaFmt,
      desc: t('bat.desc_charging', { dur: durStr, eta: etaFmt, w: fmt(chgPower, 0) }),
      shortDesc: t('bat.short_charging', { dur: durStr }),
      targetTime: etaStr
    };
  }

  // 2. Entladung aktiv (> 40 W)
  if (disPower >= 40) {
    const hoursToEmpty = usableWh / disPower;
    const etaMs = Date.now() + Math.min(hoursToEmpty * 3600000, 72 * 3600000);
    const eta = new Date(etaMs);
    const h = Math.floor(hoursToEmpty);
    const m = Math.round((hoursToEmpty - h) * 60);
    const durStr = h > 0 ? `${h}h ${m}m` : `${m}m`;
    const etaStr = eta.toLocaleTimeString(getLocale(), { hour: '2-digit', minute: '2-digit' });
    const isToday = eta.getDate() === now.getDate();
    const etaFmt = isToday ? t('bat.eta_today', { time: etaStr }) : t('bat.eta_tomorrow', { time: etaStr });

    return {
      state: 'discharging',
      soc,
      powerW: disPower,
      hoursRemaining: hoursToEmpty,
      durationStr: durStr,
      etaStr: etaFmt,
      desc: t('bat.desc_discharging', { dur: durStr, eta: etaFmt, w: fmt(disPower, 0) }),
      shortDesc: t('bat.short_discharging', { dur: durStr }),
      targetTime: etaStr
    };
  }

  // 3. Standby / Idle -> Berechnung anhand Hausverbrauch bzw. Grundlast
  const effectiveLoad = housePower > 50 ? housePower : (bf.defaultBaseLoad || 450);
  const hoursToEmpty = usableWh / effectiveLoad;
  const etaMs = Date.now() + Math.min(hoursToEmpty * 3600000, 72 * 3600000);
  const eta = new Date(etaMs);
  const h = Math.floor(hoursToEmpty);
  const m = Math.round((hoursToEmpty - h) * 60);
  const durStr = h > 0 ? `${h}h ${m}m` : `${m}m`;
  const etaStr = eta.toLocaleTimeString(getLocale(), { hour: '2-digit', minute: '2-digit' });
  const isToday = eta.getDate() === now.getDate();
  const etaFmt = isToday ? t('bat.eta_today', { time: etaStr }) : t('bat.eta_tomorrow', { time: etaStr });

  return {
    state: 'idle',
    soc,
    powerW: effectiveLoad,
    hoursRemaining: hoursToEmpty,
    durationStr: durStr,
    etaStr: etaFmt,
    desc: t('bat.desc_idle', { dur: durStr, w: fmt(effectiveLoad, 0) }),
    shortDesc: t('bat.short_discharging', { dur: durStr }),
    targetTime: etaStr
  };
}

/* ---------- 60-Minuten Regenradar / Niederschlags-Timeline ---------- */
function getRainTimeline60Min() {
  const wCfg = CONFIG.weather || {};
  const hourly = weatherForecastState.hourly || [];
  const customRainEnt = wCfg.rainEntity ? S(wCfg.rainEntity) : null;

  const slots = [];
  const now = new Date();

  let rainProb = 0;
  let rainMm = 0;

  if (hourly.length >= 1) {
    const curHour = hourly[0] || {};
    const nextHour = hourly[1] || curHour;

    const curP = Number(curHour.precipitation || 0);
    const nextP = Number(nextHour.precipitation || 0);
    const curProb = Number(curHour.precipitation_probability || (curP > 0 ? 80 : 0));
    const nextProb = Number(nextHour.precipitation_probability || (nextP > 0 ? 80 : 0));

    rainProb = Math.max(curProb, nextProb);
    rainMm = Math.max(curP, nextP);

    for (let i = 0; i <= 6; i++) {
      const frac = i / 6;
      const slotTime = new Date(now.getTime() + i * 10 * 60000);
      const slotLabel = i === 0 ? t('rain.now') : `+${i * 10}m`;
      const timeStr = `${pad(slotTime.getHours())}:${pad(slotTime.getMinutes())}`;
      
      const prob = Math.round(curProb + (nextProb - curProb) * frac);
      const mm = +(curP + (nextP - curP) * frac).toFixed(1);

      slots.push({
        idx: i,
        label: slotLabel,
        time: timeStr,
        prob,
        mm
      });
    }
  } else {
    const isRainingNow = (S(wCfg.entity)?.state || '').includes('rain');
    for (let i = 0; i <= 6; i++) {
      const slotTime = new Date(now.getTime() + i * 10 * 60000);
      const mm = isRainingNow ? Math.max(0, +(1.2 - i * 0.15).toFixed(1)) : 0;
      const prob = isRainingNow ? Math.max(0, 90 - i * 12) : 5;
      slots.push({
        idx: i,
        label: i === 0 ? t('rain.now') : `+${i * 10}m`,
        time: `${pad(slotTime.getHours())}:${pad(slotTime.getMinutes())}`,
        prob,
        mm
      });
    }
    rainProb = slots[0].prob;
    rainMm = slots[0].mm;
  }

  let advice = '';
  let statusClass = 'dry';
  const firstRainSlot = slots.find(s => s.prob >= 40 || s.mm > 0.1);

  if (slots[0].mm > 0.1 || slots[0].prob >= 60) {
    statusClass = 'raining';
    const stopSlot = slots.find(s => s.mm <= 0.1 && s.prob < 40);
    advice = stopSlot
      ? t('rain.raining_stop', { mm: slots[0].mm, time: stopSlot.time })
      : t('rain.raining_cont', { mm: slots[0].mm });
  } else if (firstRainSlot && firstRainSlot.idx > 0) {
    statusClass = 'soon';
    advice = t('rain.soon', { mins: firstRainSlot.idx * 10, time: firstRainSlot.time });
  } else {
    statusClass = 'dry';
    advice = t('rain.advice_dry');
  }

  return {
    slots,
    rainProb,
    rainMm,
    advice,
    statusClass
  };
}

function ensureConfigDefaults(cfg) {
  if (!cfg.language || !['auto', 'de', 'en'].includes(cfg.language)) cfg.language = 'auto';
  if (!cfg.theme) cfg.theme = {};
  if (!cfg.theme.bg) cfg.theme.bg = '#080912';
  if (!cfg.theme.acc) cfg.theme.acc = '#7c6cf0';
  if (!cfg.theme.acc2) cfg.theme.acc2 = '#a99bff';
  if (!cfg.theme.ok) cfg.theme.ok = '#34d399';
  if (!cfg.theme.warn) cfg.theme.warn = '#f59e0b';
  if (!cfg.theme.cool) cfg.theme.cool = '#38bdf8';
  if (!cfg.theme.radius) cfg.theme.radius = '20';
  if (!cfg.theme.density) cfg.theme.density = 'normal';
  if (cfg.theme.greetingColor === undefined) cfg.theme.greetingColor = '';
  if (cfg.theme.nameColor === undefined) cfg.theme.nameColor = '';
  if (cfg.theme.activityColor === undefined) cfg.theme.activityColor = '';
  if (cfg.theme.dateTimeColor === undefined) cfg.theme.dateTimeColor = '';

  if (!cfg.dateTimeSize) cfg.dateTimeSize = 13;
  if (!cfg.dashboardCols) cfg.dashboardCols = '2-asym';
  if (!cfg.dashboardLayoutMode) cfg.dashboardLayoutMode = 'columns';
  if (cfg.dashboardColRatio === undefined) cfg.dashboardColRatio = '';
  if (!cfg.klimaCols) cfg.klimaCols = 'auto';
  if (!cfg.camCols) cfg.camCols = 'auto';

  const defLayout = DEFAULT_DASHBOARD_LAYOUT();
  if (!Array.isArray(cfg.dashboardLayout) || !cfg.dashboardLayout.length) {
    cfg.dashboardLayout = JSON.parse(JSON.stringify(defLayout));
  } else {
    // Fehlende Standard-Blöcke ergänzen, bestehende Reihenfolge & Einstellungen behalten
    defLayout.forEach(defItem => {
      const existing = cfg.dashboardLayout.find(x => x && x.id === defItem.id);
      if (!existing) {
        cfg.dashboardLayout.push(JSON.parse(JSON.stringify(defItem)));
      } else {
        if (!existing.label) existing.label = defItem.label;
        if (!existing.cfgTab) existing.cfgTab = defItem.cfgTab;
        if (existing.show === undefined) existing.show = true;
        if (!existing.col) existing.col = defItem.col;
        if (!existing.scope) existing.scope = defItem.scope;
      }
    });
  }

  cfg.dashboardLayout.forEach(item => {
    if (!item.width) item.width = '100';
    if (!item.span) {
      if (item.col === 'full') item.span = 12;
      else if (item.width === '50') item.span = 6;
      else if (item.width === '33') item.span = 4;
      else if (item.width === '66') item.span = 8;
      else if (item.width === '25') item.span = 3;
      else if (item.col === '2') item.span = 4;
      else item.span = 8;
    }
  });

  if (!cfg.security) cfg.security = { lock: '', locks: [], windows: [], cameras: [] };
  if (!Array.isArray(cfg.security.locks)) {
    cfg.security.locks = cfg.security.lock ? [{ name: 'Haustür', entity: cfg.security.lock }] : [];
  }
  if (!cfg.pinProtect || typeof cfg.pinProtect !== 'object') {
    cfg.pinProtect = { editor: true, systemLinks: true, kioskExit: true, doorUnlock: false };
  } else {
    if (cfg.pinProtect.editor === undefined) cfg.pinProtect.editor = true;
    if (cfg.pinProtect.systemLinks === undefined) cfg.pinProtect.systemLinks = true;
    if (cfg.pinProtect.kioskExit === undefined) cfg.pinProtect.kioskExit = true;
    if (cfg.pinProtect.doorUnlock === undefined) cfg.pinProtect.doorUnlock = false;
  }
  
  cfg.security.locks.forEach(l => {
    if (l.battery === undefined) l.battery = '';
    if (!l.batPos) l.batPos = 'pill';
    if (!l.batStyle) l.batStyle = 'badge';
  });
  if (!Array.isArray(cfg.security.windows)) cfg.security.windows = [];
  if (!Array.isArray(cfg.security.doors)) cfg.security.doors = [];
  if (!Array.isArray(cfg.security.cameras)) cfg.security.cameras = [];

  if (!Array.isArray(cfg.alerts)) cfg.alerts = [];
  if (!Array.isArray(cfg.routines)) cfg.routines = [];
  if (!cfg.presence || typeof cfg.presence !== 'object') cfg.presence = { show: false, members: [] };
  if (!Array.isArray(cfg.presence.members)) cfg.presence.members = [];
  if (!cfg.ventilation || typeof cfg.ventilation !== 'object') cfg.ventilation = { show: false, outdoorTemp: '', outdoorHum: '', rooms: [] };
  if (!Array.isArray(cfg.ventilation.rooms)) cfg.ventilation.rooms = [];
  if (cfg.ventilation.showOpenTimer === undefined) cfg.ventilation.showOpenTimer = true;
  if (cfg.ventilation.openWarnMinutes === undefined) cfg.ventilation.openWarnMinutes = 10;
  if (cfg.ventilation.warnOutdoorTempThreshold === undefined) cfg.ventilation.warnOutdoorTempThreshold = 12;

  if (!cfg.batteryForecast || typeof cfg.batteryForecast !== 'object') {
    cfg.batteryForecast = {
      show: true,
      capacityKwh: 10,
      minSoC: 5,
      maxSoC: 100,
      defaultBaseLoad: 450,
      socEntity: '',
      chargePowerEntity: '',
      dischargePowerEntity: '',
      housePowerEntity: '',
      pvPowerEntity: ''
    };
  } else {
    if (cfg.batteryForecast.show === undefined) cfg.batteryForecast.show = true;
    if (!cfg.batteryForecast.capacityKwh) cfg.batteryForecast.capacityKwh = 10;
    if (cfg.batteryForecast.minSoC === undefined) cfg.batteryForecast.minSoC = 5;
    if (cfg.batteryForecast.maxSoC === undefined) cfg.batteryForecast.maxSoC = 100;
    if (cfg.batteryForecast.defaultBaseLoad === undefined) cfg.batteryForecast.defaultBaseLoad = 450;
  }

  if (!cfg.energyPrices || typeof cfg.energyPrices !== 'object') {
    cfg.energyPrices = { show: false, entity: '', title: 'Dynamische Strompreise', priceUnit: 'Cent' };
  }
  if (!cfg.wallbox || typeof cfg.wallbox !== 'object') {
    cfg.wallbox = { show: false, title: 'Wallbox', socEntity: '', powerEntity: '', statusEntity: '', modeEntity: '' };
  }
  if (!cfg.appliances || typeof cfg.appliances !== 'object') {
    cfg.appliances = { show: false, title: 'Haushaltsgeräte', items: [] };
  }
  if (!Array.isArray(cfg.appliances.items)) cfg.appliances.items = [];
  if (cfg.appliances.show === undefined) cfg.appliances.show = cfg.appliances.items.length > 0;
  cfg.appliances.items.forEach(a => {
    if (!a.name) a.name = 'Haushaltsgerät';
    if (!a.icon) a.icon = 'washing';
  });

  if (!cfg.screensaver || typeof cfg.screensaver !== 'object') {
    cfg.screensaver = { show: true, timeoutMins: 3 };
  } else {
    if (cfg.screensaver.show === undefined) cfg.screensaver.show = true;
    if (cfg.screensaver.timeoutMins === undefined) cfg.screensaver.timeoutMins = 3;
  }

  if (!cfg.bellPopup || typeof cfg.bellPopup !== 'object') {
    cfg.bellPopup = {
      show: false,
      behavior: 'none',
      pageFilter: 'all',
      allowedPages: ['dashboard', 'kameras'],
      triggerHoldSeconds: 10,
      triggerEntity: '',
      cameraEntity: '',
      webrtc: '',
      title: 'Türklingel',
      durationSec: 30
    };
  } else {
    if (cfg.bellPopup.behavior === undefined) {
      cfg.bellPopup.behavior = cfg.bellPopup.show ? 'popup' : 'none';
    }
    cfg.bellPopup.show = cfg.bellPopup.behavior === 'popup';
    if (!cfg.bellPopup.pageFilter) cfg.bellPopup.pageFilter = 'all';
    if (!Array.isArray(cfg.bellPopup.allowedPages)) cfg.bellPopup.allowedPages = ['dashboard', 'kameras'];
    if (cfg.bellPopup.triggerHoldSeconds === undefined || isNaN(Number(cfg.bellPopup.triggerHoldSeconds))) {
      cfg.bellPopup.triggerHoldSeconds = 10;
    } else {
      cfg.bellPopup.triggerHoldSeconds = Math.max(0, Number(cfg.bellPopup.triggerHoldSeconds));
    }
    if (cfg.bellPopup.webrtc === undefined) cfg.bellPopup.webrtc = '';
    if (cfg.bellPopup.durationSec === undefined) cfg.bellPopup.durationSec = 30;
  }

  if (!cfg.systemHealth || typeof cfg.systemHealth !== 'object') cfg.systemHealth = { show: false, title: 'Server & Docker', cpu: '', ram: '', disk: '', temp: '', containers: [] };
  if (!Array.isArray(cfg.systemHealth.containers)) cfg.systemHealth.containers = [];

  const mhDef = DEFAULT_MEDIA_HUB_CONFIG();
  if (!cfg.mediaHub || typeof cfg.mediaHub !== 'object') {
    cfg.mediaHub = JSON.parse(JSON.stringify(mhDef));
  } else {
    const mh = cfg.mediaHub;
    if (mh.show === undefined) mh.show = mhDef.show;
    if (!mh.title) mh.title = mhDef.title;
    if (!['free_direct', 'hybrid_premium', 'music_assistant'].includes(mh.profile)) mh.profile = mhDef.profile;
    if (!Array.isArray(mh.players)) mh.players = [];
    mh.players = mh.players.map(p => (typeof p === 'string' ? { entity: p, name: '' } : { entity: String((p && p.entity) || ''), name: String((p && p.name) || '') })).filter(p => p.entity);
    if (mh.defaultPlayer === undefined) mh.defaultPlayer = '';
    if (!mh.providers || typeof mh.providers !== 'object') mh.providers = {};
    Object.entries(mhDef.providers).forEach(([pk, pdef]) => {
      if (!mh.providers[pk] || typeof mh.providers[pk] !== 'object') mh.providers[pk] = Object.assign({}, pdef);
      else {
        Object.entries(pdef).forEach(([fk, fv]) => {
          if (mh.providers[pk][fk] === undefined) mh.providers[pk][fk] = fv;
        });
      }
    });
    if (!['spotifyplus', 'spotify'].includes(mh.providers.spotify.mode)) mh.providers.spotify.mode = 'spotifyplus';
    if (!mh.multiroom || typeof mh.multiroom !== 'object') mh.multiroom = JSON.parse(JSON.stringify(mhDef.multiroom));
    if (mh.multiroom.enabled === undefined) mh.multiroom.enabled = true;
    if (!Array.isArray(mh.multiroom.groupablePlayers)) mh.multiroom.groupablePlayers = [];
    if (!Array.isArray(mh.multiroom.presets)) mh.multiroom.presets = [];
    mh.multiroom.presets = mh.multiroom.presets.map(pr => ({
      name: String((pr && pr.name) || ''),
      master: String((pr && pr.master) || ''),
      members: Array.isArray(pr && pr.members) ? pr.members.filter(Boolean) : []
    }));
    if (!Array.isArray(mh.radioFavorites)) mh.radioFavorites = [];
    mh.radioFavorites = mh.radioFavorites.map(rf => ({
      name: String((rf && rf.name) || ''),
      contentId: String((rf && rf.contentId) || ''),
      icon: String((rf && rf.icon) || '📻')
    }));
    if (!mh.search || typeof mh.search !== 'object') mh.search = JSON.parse(JSON.stringify(mhDef.search));
    if (!['active_tab', 'combined'].includes(mh.search.scope)) mh.search.scope = 'active_tab';
    if (!Array.isArray(mh.search.mediaTypes) || !mh.search.mediaTypes.length) mh.search.mediaTypes = ['track', 'artist', 'album', 'radio'];
    if (!mh.ui || typeof mh.ui !== 'object') mh.ui = JSON.parse(JSON.stringify(mhDef.ui));
    if (!['standard', 'tablet_touch'].includes(mh.ui.density)) mh.ui.density = 'standard';
    if (mh.ui.tabSwipe === undefined) mh.ui.tabSwipe = true;
    if (mh.ui.trackSwipe === undefined) mh.ui.trackSwipe = false;
    if (!['header', 'below_tabs', 'footer'].includes(mh.ui.searchPosition)) mh.ui.searchPosition = 'below_tabs';
    if (!['full', 'compact', 'icon_only'].includes(mh.ui.searchStyle)) mh.ui.searchStyle = 'full';
    if (!['dropdown', 'pills'].includes(mh.ui.playerSelectorStyle)) mh.ui.playerSelectorStyle = 'pills';
    if (!['slider', 'buttons'].includes(mh.ui.volumeStyle)) mh.ui.volumeStyle = 'slider';
    if (mh.ui.showCoverArt === undefined) mh.ui.showCoverArt = true;
    const rgc = parseInt(mh.ui.radioGridCols, 10);
    mh.ui.radioGridCols = clamp(Number.isFinite(rgc) ? rgc : 2, 1, 4);
  }
  const mhDlItem = cfg.dashboardLayout.find(x => x && x.id === 'media_hub');
  if (mhDlItem && cfg.mediaHub.show === true && mhDlItem.show === false && !cfg._mhSyncedOnce) {
    mhDlItem.show = true;
  }
  cfg._mhSyncedOnce = true;

  if (!Array.isArray(cfg.deviceTabs) || !cfg.deviceTabs.length) {
    cfg.deviceTabs = [
      { id: 'geraete', name: 'Geräte' },
      { id: 'covers', name: 'Rolläden' }
    ];
  }
  if (!Array.isArray(cfg.favorites)) cfg.favorites = [];
  cfg.favorites.forEach(f => {
    if (f.show === undefined) f.show = true;
  });

  if (!Array.isArray(cfg.metrics)) cfg.metrics = [];
  cfg.metrics.forEach(m => {
    if (m.show === undefined) m.show = true;
    if (m.showChart === undefined) m.showChart = true;
    if (m.showCompare === undefined) m.showCompare = true;
    if (m.showSubButtons === undefined) m.showSubButtons = true;
    if (m.showLive === undefined) m.showLive = true;
    if (m.autarkyMode === undefined) m.autarkyMode = 'day';
  });
  if (!Array.isArray(cfg.rooms) || !cfg.rooms.length) cfg.rooms = [{ name: 'Home', image: '', color: '#2a2370', chips: [] }];
  cfg.rooms.forEach(r => {
    if (!Array.isArray(r.chips)) r.chips = [];
    if (r.showLiveBadge === undefined) r.showLiveBadge = true;
    if (!Array.isArray(r.camButtons)) {
      r.camButtons = (r.webrtc || r.camera)
        ? [{ name: 'Vergrößern', icon: 'expand', stream: '', entity: '' }]
        : [];
    }
  });

  if (!cfg.climate) cfg.climate = { title: 'Raumklima', label: 'Hauptbereich', entity: '', min: 16, max: 30, step: 0.5 };
  if (!Array.isArray(cfg.climate.tiles)) cfg.climate.tiles = DEFAULT_CLIMATE_TILES();

  if (!cfg.weather) cfg.weather = {};
  if (cfg.weather.showCard === undefined) cfg.weather.showCard = true;
  if (cfg.weather.title === undefined) cfg.weather.title = 'Wetter';
  if (cfg.weather.label === undefined) cfg.weather.label = 'Zuhause';
  if (cfg.weather.tempUnit === undefined) cfg.weather.tempUnit = '°C';
  if (cfg.weather.showForecast === undefined) cfg.weather.showForecast = false;
  if (cfg.weather.showRainTimeline === undefined) cfg.weather.showRainTimeline = true;
  if (cfg.weather.rainEntity === undefined) cfg.weather.rainEntity = '';
  if (!cfg.weather.forecastTitle) cfg.weather.forecastTitle = 'Wettervorhersage · 7 Tage';
  if (!Array.isArray(cfg.weather.items)) {
    cfg.weather.items = [
      { label: 'Luftfeuchtigkeit', entity: '', attr: 'humidity',      unit: '%',    icon: 'drop',   decimals: 0 },
      { label: 'Wind',             entity: '', attr: 'wind_speed',    unit: 'km/h', icon: 'fan',    decimals: 1 },
      { label: 'Luftdruck',        entity: '', attr: 'pressure',      unit: 'hPa',  icon: 'thermo', decimals: 0 },
      { label: 'Niederschlag',     entity: '', attr: 'precipitation', unit: 'mm',   icon: 'drop',   decimals: 1 }
    ];
  }
  if (!cfg.lightsMain) cfg.lightsMain = { mode: 'group', group: 0, entities: [] };
  if (!Array.isArray(cfg.lights)) cfg.lights = [];
  cfg.lights.forEach(g => {
    if (!Array.isArray(g.entities)) g.entities = [];
    if (!Array.isArray(g.excludeGroup)) g.excludeGroup = [];
    if (!Array.isArray(g.excludeMain)) g.excludeMain = [];
    if (!Array.isArray(g.showOn) || !g.showOn.length) {
      if (g.room && String(g.room).trim()) {
        g.showOn = [String(g.room).trim()];
      } else {
        const gLow = String(g.name || '').toLowerCase();
        const matchedRoom = (cfg.rooms || []).find((rm, idx) => idx > 0 && rm && rm.name && (
          rm.name.toLowerCase() === gLow ||
          rm.name.toLowerCase().includes(gLow) ||
          (gLow === 'living' && rm.name.toLowerCase().includes('wohn'))
        ));
        g.showOn = matchedRoom ? ['Home', matchedRoom.name] : ['Home'];
      }
    }
  });
  if (!Array.isArray(cfg.covers)) cfg.covers = [];
  cfg.covers.forEach(c => {
    c.showOn = normalizeItemShowOn(c, 'Home');
    c.room = c.showOn.includes('all') ? '' : (c.showOn.find(x => !x.startsWith('page:')) || '');
  });
  if (!Array.isArray(cfg.devices)) cfg.devices = [];
  cfg.devices.forEach(d => {
    d.showOn = normalizeItemShowOn(d, 'Home');
    d.room = d.showOn.includes('all') ? 'Alle' : (d.showOn.find(x => !x.startsWith('page:')) || d.room || 'Home');
  });
  cfg.favorites.forEach(f => {
    f.showOn = normalizeItemShowOn(f, 'Home');
    f.room = f.showOn.includes('all') ? '' : (f.showOn.find(x => !x.startsWith('page:')) || '');
  });
  cfg.appliances.items.forEach(a => {
    a.showOn = normalizeItemShowOn(a, 'Home');
  });
  if (!Array.isArray(cfg.webrtcCameras)) cfg.webrtcCameras = [];
  if (!Array.isArray(cfg.climateRooms)) cfg.climateRooms = [];
  if (!Array.isArray(cfg.powerFlow)) cfg.powerFlow = [];
  if (!cfg.calendars) cfg.calendars = { weatherEntity: '', familyEntities: [], trashEntities: [] };
  if (!Array.isArray(cfg.calendars.familyEntities)) cfg.calendars.familyEntities = [];
  if (!Array.isArray(cfg.calendars.trashEntities)) cfg.calendars.trashEntities = [];
  const legacyCalStyle = cfg.calendarStyle || cfg.calendars.style || '';
  cfg.calendarHomeStyle = normalizeCalendarStyle(cfg.calendarHomeStyle || cfg.calendars.calendarHomeStyle || cfg.calendars.homeStyle || legacyCalStyle, 'agenda');
  cfg.calendarPageStyle = normalizeCalendarStyle(cfg.calendarPageStyle || cfg.calendars.calendarPageStyle || cfg.calendars.pageStyle || legacyCalStyle, 'apple');
  cfg.calendars.calendarHomeStyle = cfg.calendarHomeStyle;
  cfg.calendars.calendarPageStyle = cfg.calendarPageStyle;

  if (!Array.isArray(cfg.customPages)) cfg.customPages = [];
  cfg.customPages.forEach(p => {
    if (!p.layout) p.layout = 'grid';
    if (!Array.isArray(p.widgets)) p.widgets = [];
    // Automatische Migration der bestehenden Bundesliga-Seite auf das neue Google-Style Sport-Center (SC Freiburg)
    if (p.id === 'bundesliga' && !p._sportsHubMigrated) {
      p._sportsHubMigrated = true;
      const hasSportsHub = p.widgets.some(w => w && w.type === 'sports_hub');
      if (!hasSportsHub) {
        p.widgets.forEach(w => {
          if (w && ['buli_team', 'buli_table', 'buli_matchday'].includes(w.type)) w.show = false;
        });
        p.widgets.unshift({
          type: 'sports_hub',
          title: 'SC Freiburg',
          sport: 'soccer',
          league: 'ger.1',
          teamId: '126',
          teamName: 'SC Freiburg',
          viewMode: 'google',
          col: 'full',
          show: true,
          showHeader: true,
          showFocusMatch: true,
          showUpcoming: true,
          upcomingCount: 4,
          showTable: true,
          tableRows: 6,
          crossComp: true
        });
      }
    }
    p.widgets.forEach(w => {
      if (w.show === undefined) w.show = true;
      if (!w.col) w.col = w.type === 'sports_hub' ? 'full' : 'auto';
      if (w.type === 'sports_hub') {
        if (!w.sport) w.sport = 'soccer';
        if (!w.league) w.league = 'ger.1';
        if (!w.viewMode) w.viewMode = 'google';
        if (w.showHeader === undefined) w.showHeader = true;
        if (w.showFocusMatch === undefined) w.showFocusMatch = true;
        if (w.showUpcoming === undefined) w.showUpcoming = true;
        if (!w.upcomingCount) w.upcomingCount = 4;
        if (w.showTable === undefined) w.showTable = true;
        if (!w.tableRows) w.tableRows = 6;
        if (w.crossComp === undefined) w.crossComp = true;
      }
    });
  });

  syncLayoutAndModuleShow(cfg, !cfg._v32Synced);
  cfg._v32Synced = true;

  return cfg;
}

function getHass() {
  try { const ha = window.parent.document.querySelector('home-assistant'); if (ha && ha.hass) return ha.hass; } catch (e) {}
  return null;
}
let DEMO = !getHass();

/* ---------- Theme, Kiosk-Modus & HA-Seitenleiste Live-Update ---------- */
function applyTheme() {
  const th = CONFIG.theme || {};
  const r = document.documentElement.style;
  if (th.bg) r.setProperty('--bg', th.bg);
  if (th.acc) r.setProperty('--acc', th.acc);
  if (th.acc2) r.setProperty('--acc2', th.acc2);
  if (th.ok) r.setProperty('--ok', th.ok);
  if (th.warn) r.setProperty('--warn', th.warn);
  if (th.cool) r.setProperty('--cool', th.cool);
  if (th.greetingColor) r.setProperty('--hero-greet-color', th.greetingColor);
  else r.removeProperty('--hero-greet-color');
  if (th.nameColor) r.setProperty('--hero-name-color', th.nameColor);
  else r.removeProperty('--hero-name-color');
  if (th.activityColor) r.setProperty('--hero-activity-color', th.activityColor);
  else r.removeProperty('--hero-activity-color');
  if (th.dateTimeColor) r.setProperty('--hero-datetime-color', th.dateTimeColor);
  else r.removeProperty('--hero-datetime-color');
  const rad = parseInt(String(th.radius || '22').replace('px', ''), 10);
  r.setProperty('--r', (Number.isFinite(rad) ? rad : 22) + 'px');
  const dtSize = clamp(parseInt(CONFIG.dateTimeSize, 10) || 13, 10, 48);
  r.setProperty('--dt-size', dtSize + 'px');
  const dens = th.density || 'normal';
  const isRelaxed = dens === 'relaxed' || dens === 'spacious';
  const gapVal = dens === 'compact' ? '12px' : isRelaxed ? '22px' : '16px';
  r.setProperty('--gap', gapVal);
  r.setProperty('--grid-gap', gapVal);
  r.setProperty('--card-pad', dens === 'compact' ? '14px' : isRelaxed ? '22px' : '18px');
}

function syncHASidebarDOM(title, icon) {
  try {
    const ha = window.parent.document.querySelector('home-assistant');
    if (ha && ha.hass && ha.hass.panels && ha.hass.panels['smarthome-hub']) {
      ha.hass.panels['smarthome-hub'].title = title || 'Smart Home Hub';
      ha.hass.panels['smarthome-hub'].icon = icon || 'mdi:home-automation';
    }
    const main = ha && ha.shadowRoot && ha.shadowRoot.querySelector('home-assistant-main');
    const drawer = main && main.shadowRoot && main.shadowRoot.querySelector('ha-drawer');
    const sidebar = (drawer && drawer.querySelector('ha-sidebar')) || (main && main.shadowRoot && main.shadowRoot.querySelector('ha-sidebar'));
    if (sidebar && sidebar.shadowRoot) {
      const link = sidebar.shadowRoot.querySelector('a[href="/smarthome-hub"], paper-icon-item[data-panel="smarthome-hub"], ha-md-list-item[href="/smarthome-hub"]');
      if (link) {
        const textEl = link.querySelector('.item-text, span[slot="headline"], span');
        if (textEl) textEl.textContent = title || 'Smart Home Hub';
        const iconEl = link.querySelector('ha-icon');
        if (iconEl && icon) iconEl.setAttribute('icon', icon);
      }
    }
  } catch (e) { console.warn('Sidebar-DOM-Sync:', e); }
}

function applyKioskMode(enable) {
  try {
    const ha = window.parent.document.querySelector('home-assistant');
    const main = ha && ha.shadowRoot && ha.shadowRoot.querySelector('home-assistant-main');
    const drawer = main && main.shadowRoot && main.shadowRoot.querySelector('ha-drawer');
    if (main) {
      if (enable) main.setAttribute('narrow', '');
      else main.removeAttribute('narrow');
    }
    if (drawer && drawer.shadowRoot) {
      const aside = drawer.shadowRoot.querySelector('aside, .mdc-drawer');
      if (aside) aside.style.display = enable ? 'none' : '';
    }
  } catch (e) { console.warn('Kiosk-Steuerung nicht möglich:', e); }
}

/* ---------- PIN-Schutz ---------- */
const pinState = { buffer: '', onSuccess: null, title: '', verifying: false };

function requirePin(featureKey, actionFn, title = null) {
  const pin = String(CONFIG.pinCode || '').trim();
  const protect = CONFIG.pinProtect || {};
  if (!pin || !protect[featureKey]) { actionFn(); return; }
  pinState.buffer = '';
  pinState.verifying = false;
  pinState.onSuccess = actionFn;
  pinState.title = title || t('pin.required');
  renderPinModal();
  document.getElementById('pinmodal').classList.add('show');
}

function renderPinModal() {
  const len = Math.max(4, String(CONFIG.pinCode || '').length);
  const dots = Array.from({ length: len }, (_, i) => `<div class="pin-dot ${i < pinState.buffer.length ? 'filled' : ''}"></div>`).join('');
  const keys = ['1','2','3','4','5','6','7','8','9','C','0','⌫'].map(k => `<button class="pin-key" data-act="pinkey" data-k="${k}">${k}</button>`).join('');
  document.getElementById('pinsheet').innerHTML = `
    <div class="smh"><b>${esc(pinState.title)}</b><button class="x2" data-act="pinClose">✕</button></div>
    <div class="pin-dots">${dots}</div>
    <div class="pin-pad">${keys}</div>`;
}

async function handlePinKey(k) {
  if (pinState.verifying) return;
  const target = String(CONFIG.pinCode || '').trim();
  if (k === 'C') pinState.buffer = '';
  else if (k === '⌫') pinState.buffer = pinState.buffer.slice(0, -1);
  else pinState.buffer += k;
  renderPinModal();
  if (!target || pinState.buffer.length < target.length) return;

  const candidate = pinState.buffer;
  const h = getHass();
  let valid = false;
  if (h && typeof h.callWS === 'function') {
    pinState.verifying = true;
    try {
      const res = await h.callWS({ type: 'smarthome_hub/verify_pin', pin: candidate });
      valid = !!(res && res.valid);
    } catch (e) {
      valid = false;
    } finally {
      pinState.verifying = false;
    }
  } else {
    valid = candidate === target;
  }

  const modalEl = document.getElementById('pinmodal');
  if (!modalEl || !modalEl.classList.contains('show')) {
    pinState.buffer = '';
    pinState.onSuccess = null;
    return;
  }
  if (valid) {
    modalEl.classList.remove('show');
    pinState.buffer = '';
    const cb = pinState.onSuccess;
    pinState.onSuccess = null;
    if (cb) cb();
  } else {
    toast(t('pin.wrong'));
    pinState.buffer = '';
    setTimeout(renderPinModal, 250);
  }
}

/* ---------- Lokales Endgeräte-Profil (Tablet / Büro / PC) ---------- */
const DEVICE_PROFILE_KEY = 'smarthome_hub_device_profile';

function getDeviceProfile() {
  try {
    const raw = localStorage.getItem(DEVICE_PROFILE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      deviceName: parsed.deviceName || '',
      startView: parsed.startView || '',
      startRoom: parsed.startRoom || '',
      returnToStartMins: parsed.returnToStartMins != null ? Number(parsed.returnToStartMins) : 0,
      kioskOverride: parsed.kioskOverride || 'global',
      screensaverOverride: parsed.screensaverOverride || 'global',
      language: parsed.language || 'global'
    };
  } catch (e) {
    return { deviceName: '', startView: '', startRoom: '', returnToStartMins: 0, kioskOverride: 'global', screensaverOverride: 'global', language: 'global' };
  }
}

function saveDeviceProfile(prof) {
  const clean = Object.assign(getDeviceProfile(), prof || {});
  try {
    localStorage.setItem(DEVICE_PROFILE_KEY, JSON.stringify(clean));
  } catch (e) {}
  applyKioskMode(getEffectiveKioskMode());
  return clean;
}

function getEffectiveKioskMode() {
  const prof = getDeviceProfile();
  if (prof.kioskOverride === 'on') return true;
  if (prof.kioskOverride === 'off') return false;
  return !!(CONFIG && CONFIG.kioskMode);
}

function getEffectiveScreensaverShow() {
  const prof = getDeviceProfile();
  if (prof.screensaverOverride === 'on') return true;
  if (prof.screensaverOverride === 'off') return false;
  return !!(CONFIG && CONFIG.screensaver && CONFIG.screensaver.show !== false);
}

function applyDeviceStartView(isIdleReturn = false) {
  if (typeof ui === 'undefined' || !CONFIG) return false;
  const prof = getDeviceProfile();
  let changed = false;
  if (prof.startView) {
    // Prüfen, ob eine konfigurierte customPage noch existiert
    if (prof.startView.startsWith('page:')) {
      const pid = prof.startView.slice(5);
      const exists = (CONFIG.customPages || []).some(p => p && p.id === pid);
      if (exists && ui.view !== prof.startView) {
        ui.view = prof.startView;
        localStorage.setItem('hub_view', ui.view);
        changed = true;
      }
    } else if (ui.view !== prof.startView) {
      ui.view = prof.startView;
      localStorage.setItem('hub_view', ui.view);
      changed = true;
    }
  }
  if ((!prof.startView || prof.startView === 'dashboard') && prof.startRoom) {
    const rIdx = (CONFIG.rooms || []).findIndex(r => r && r.name && r.name.toLowerCase() === prof.startRoom.toLowerCase());
    if (rIdx >= 0 && ui.room !== rIdx) {
      ui.room = rIdx;
      changed = true;
    }
  }
  if (changed && isIdleReturn && typeof tick === 'function') {
    tick(true);
  }
  return changed;
}

/* ---------- Konfiguration laden / speichern & Multi-Device Live-Sync ---------- */
let _lastOwnSaveTs = 0;
let _lastKnownUpdatedAt = 0;
let _lastKnownServerDigest = '';
let _lastKnownAssetHash = '';
let _subscribedConnection = null;
let _initialDeviceProfileApplied = false;
let _lastSignedUrlsAt = 0;
const UPLOAD_SIGN_REFRESH_MS = 30 * 60 * 1000;

function _configDigest(cfg) {
  if (!cfg || typeof cfg !== 'object') return '';
  const copy = Object.assign({}, cfg);
  delete copy._updatedAt;
  return JSON.stringify(copy).replace(/(\/api\/smarthome_hub\/uploads\/[^"'?]+)\?authSig=[^"'&]+/g, '$1');
}

function _syncSignedUploadUrls(target, source) {
  if (!target || !source || typeof target !== 'object' || typeof source !== 'object') return false;
  if (Array.isArray(target) !== Array.isArray(source)) return false;
  let updated = false;
  const prefix = '/api/smarthome_hub/uploads/';
  for (const key of Object.keys(target)) {
    const tv = target[key];
    const sv = source[key];
    if (typeof tv === 'string' && typeof sv === 'string') {
      if (tv.startsWith(prefix) && sv.startsWith(prefix) && tv.split('?')[0] === sv.split('?')[0] && tv !== sv) {
        target[key] = sv;
        updated = true;
      }
    } else if (tv && sv && typeof tv === 'object' && typeof sv === 'object') {
      if (_syncSignedUploadUrls(tv, sv)) updated = true;
    }
  }
  return updated;
}

async function loadConfigFromServer(isRemoteUpdate = false) {
  let h = getHass();
  // Falls das Panel im HA-Iframe lädt, aber ha.hass beim Start auf einem Tablet noch 100-500ms braucht:
  if (!h && window.parent && window.parent !== window && !isRemoteUpdate) {
    for (let attempt = 0; attempt < 15; attempt++) {
      await new Promise(r => setTimeout(r, 150));
      h = getHass();
      if (h && typeof h.callWS === 'function') break;
    }
  }
  DEMO = !h;
  if (h && typeof h.callWS === 'function') {
    try {
      const res = await h.callWS({ type: 'smarthome_hub/get_config' });
      if (res && res.asset_hash) {
        if (_lastKnownAssetHash && _lastKnownAssetHash !== res.asset_hash) {
          forceReloadApp(true);
          return;
        }
        _lastKnownAssetHash = res.asset_hash;
      }
      if (res && res.config && Object.keys(res.config).length > 0) {
        _lastKnownUpdatedAt = res.config._updatedAt || 0;
        _lastKnownServerDigest = _configDigest(res.config);
        _lastSignedUrlsAt = Date.now();
        CONFIG = ensureConfigDefaults(Object.assign(JSON.parse(JSON.stringify(EMPTY_CONFIG)), res.config));
        localStorage.setItem('smarthome_hub_backup_cfg', JSON.stringify(CONFIG));
      } else {
        const local = localStorage.getItem('smarthome_hub_backup_cfg');
        if (local) CONFIG = ensureConfigDefaults(Object.assign(JSON.parse(JSON.stringify(EMPTY_CONFIG)), JSON.parse(local)));
      }
    } catch (e) {
      const local = localStorage.getItem('smarthome_hub_backup_cfg');
      if (local) CONFIG = ensureConfigDefaults(Object.assign(JSON.parse(JSON.stringify(EMPTY_CONFIG)), JSON.parse(local)));
    }
    populateEntityDatalist();
    ensureHassLiveSync();
  }
  ensureConfigDefaults(CONFIG);
  applyTheme();
  applyKioskMode(getEffectiveKioskMode());
  if (!_initialDeviceProfileApplied && !isRemoteUpdate) {
    _initialDeviceProfileApplied = true;
    applyDeviceStartView(false);
  }
  syncHASidebarDOM(CONFIG.sidebarTitle, CONFIG.sidebarIcon);
  if (typeof probeGo2rtc === 'function') probeGo2rtc(true);
  if (isRemoteUpdate) {
    if (typeof rebuildEntitiesList === 'function') rebuildEntitiesList();
    if (typeof refreshSeries === 'function') refreshSeries();
    if (typeof refreshWeatherForecast === 'function') refreshWeatherForecast(true);
    if (typeof refreshHomeCalendars === 'function') refreshHomeCalendars(true);
    if (typeof tick === 'function') tick(true);
  }
}

async function saveConfigToServer(newCfg) {
  syncLayoutAndModuleShow(newCfg, false);
  CONFIG = ensureConfigDefaults(newCfg);
  const payloadCfg = JSON.parse(JSON.stringify(CONFIG));
  _lastOwnSaveTs = Date.now();
  CONFIG._updatedAt = _lastOwnSaveTs;
  const h = getHass();
  localStorage.setItem('smarthome_hub_backup_cfg', JSON.stringify(CONFIG));
  applyTheme();
  applyKioskMode(getEffectiveKioskMode());
  syncHASidebarDOM(CONFIG.sidebarTitle, CONFIG.sidebarIcon);
  if (typeof probeGo2rtc === 'function') probeGo2rtc(true);
  if (h && typeof h.callWS === 'function') {
    DEMO = false;
    ensureHassLiveSync();
    try {
      const res = await h.callWS({ type: 'smarthome_hub/save_config', config: payloadCfg });
      if (CONFIG.pinCode) {
        CONFIG.pinCode = '*'.repeat(String(CONFIG.pinCode).trim().length);
      }
      const confirmedTs = (res && res.updated_at) || _lastOwnSaveTs;
      _lastKnownUpdatedAt = confirmedTs;
      CONFIG._updatedAt = confirmedTs;
      _lastKnownServerDigest = _configDigest(CONFIG);
      localStorage.setItem('smarthome_hub_backup_cfg', JSON.stringify(CONFIG));
      syncHASidebarDOM(CONFIG.sidebarTitle, CONFIG.sidebarIcon);
      if (/\/api\/smarthome_hub\/uploads\/[^"'?]+["']/.test(JSON.stringify(CONFIG))) {
        await loadConfigFromServer(true);
      }
      toast(t('toast.saved_server'));
    } catch (e) {
      toast(t('toast.saved_local'));
    }
  } else {
    toast(t('toast.saved_demo'));
  }
  rebuildEntitiesList();
  refreshSeries();
  refreshWeatherForecast(true);
  refreshHomeCalendars(true);
  tick(true);
}

function ensureHassLiveSync() {
  const h = getHass();
  if (!h) return;
  if (DEMO) {
    DEMO = false;
    loadConfigFromServer(true);
    return;
  }
  const conn = h.connection;
  if (conn && typeof conn.subscribeEvents === 'function' && _subscribedConnection !== conn) {
    _subscribedConnection = conn;
    conn.subscribeEvents(ev => {
      const remoteTs = ev && ev.data && ev.data.updated_at;
      if (Date.now() - _lastOwnSaveTs < 2500) return;
      if (remoteTs && remoteTs === _lastKnownUpdatedAt) return;
      const cfgModal = document.getElementById('cfgmodal');
      if (cfgModal && cfgModal.classList.contains('show')) return;
      loadConfigFromServer(true);
    }, 'smarthome_hub_config_updated').catch(() => {
      _subscribedConnection = null;
    });
  }
}

async function checkRemoteConfigUpdate() {
  const h = getHass();
  if (!h || typeof h.callWS !== 'function') return;
  if (DEMO) {
    DEMO = false;
    await loadConfigFromServer(true);
    return;
  }
  ensureHassLiveSync();
  const cfgModal = document.getElementById('cfgmodal');
  if (cfgModal && cfgModal.classList.contains('show')) return;
  if (typeof ui !== 'undefined' && ui.editMode) return;
  if (Date.now() - _lastOwnSaveTs < 3000) return;
  try {
    const res = await h.callWS({ type: 'smarthome_hub/get_config' });
    if (res && res.asset_hash && _lastKnownAssetHash && res.asset_hash !== _lastKnownAssetHash) {
      forceReloadApp(true);
      return;
    }
    if (res && res.asset_hash) _lastKnownAssetHash = res.asset_hash;
    if (res && res.config && Object.keys(res.config).length > 0) {
      const remoteTs = res.config._updatedAt || 0;
      const remoteDigest = _configDigest(res.config);
      const changedByTs = remoteTs > 0 && remoteTs !== _lastKnownUpdatedAt;
      const changedByDigest = !remoteTs && _lastKnownServerDigest && remoteDigest !== _lastKnownServerDigest;
      if (changedByTs || changedByDigest) {
        _lastKnownUpdatedAt = remoteTs;
        _lastKnownServerDigest = remoteDigest;
        await loadConfigFromServer(true);
      } else if (Date.now() - _lastSignedUrlsAt >= UPLOAD_SIGN_REFRESH_MS) {
        const refreshed = _syncSignedUploadUrls(CONFIG, res.config);
        _lastSignedUrlsAt = Date.now();
        if (refreshed && typeof syncHeroMedia === 'function' && CONFIG.rooms && typeof ui !== 'undefined' && CONFIG.rooms[ui.room]) {
          syncHeroMedia(CONFIG.rooms[ui.room]);
        }
      }
    }
  } catch (e) {
    _lastSignedUrlsAt = 0;
  }
}

function forceReloadApp(silent = false) {
  if (!silent) toast(t('toast.reloading'));
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('_cb', String(Date.now()));
    window.location.replace(url.toString());
  } catch (e) {
    window.location.reload();
  }
}

function populateEntityDatalist() {
  const h = getHass();
  const dl = document.getElementById('ha-entities-list');
  if (!h || !h.states || !dl) return;
  dl.innerHTML = Object.keys(h.states).sort().map(id => {
    const fn = h.states[id].attributes && h.states[id].attributes.friendly_name;
    return `<option value="${esc(id)}">${esc(fn || id)}</option>`;
  }).join('');
}

/* ---------- Auto-Discovery ---------- */
async function autoDiscoverFromHA() {
  const h = getHass();
  if (!h) { toast(t('toast.no_ha')); return; }
  try {
    const [areas, devices, entities] = await Promise.all([
      h.callWS({ type: 'config/area_registry/list' }),
      h.callWS({ type: 'config/device_registry/list' }),
      h.callWS({ type: 'config/entity_registry/list' })
    ]);
    const devArea = {};
    devices.forEach(d => { if (d.area_id) devArea[d.id] = d.area_id; });

    const newRooms = [{ name: 'Home', image: '', color: '#2a2370', showLiveBadge: true, camButtons: [], chips: [] }];
    const areaMap = {};
    areas.forEach(a => {
      areaMap[a.area_id] = a.name;
      newRooms.push({ name: a.name, image: '', color: '#2a2350', showLiveBadge: true, camButtons: [], chips: [] });
    });

    const newDevs = [];
    const newCovers = [];
    entities.forEach(e => {
      if (e.disabled_by) return;
      const aId = e.area_id || devArea[e.device_id];
      const roomName = areaMap[aId] || 'Home';
      const d = dom(e.entity_id);
      const st = h.states[e.entity_id];
      const name = (st && st.attributes && st.attributes.friendly_name) || e.name || e.entity_id;
      if (['light', 'switch', 'climate', 'media_player', 'fan', 'lawn_mower'].includes(d)) {
        newDevs.push({ name, room: roomName, entity: e.entity_id, tab: 'geraete' });
        if (d === 'climate') {
          const rObj = newRooms.find(r => r.name === roomName);
          if (rObj && !rObj.climate) rObj.climate = e.entity_id;
        }
      } else if (d === 'cover') {
        newCovers.push({ name, entity: e.entity_id });
      }
    });

    cfgDraft.rooms = newRooms;
    cfgDraft.devices = newDevs.slice(0, 60);
    cfgDraft.covers = newCovers;
    renderCfgModal(true);
    toast(t('toast.discovered', { rooms: newRooms.length, devs: newDevs.length }));
  } catch (e) {
    toast(t('toast.discover_err', { msg: e.message }));
  }
}

/* ---------- Demo-Status & HA-Zugriff ---------- */
function demoState(id) {
  const d = dom(id), n = id.toLowerCase();
  const code = [...id].reduce((a, c) => a + c.charCodeAt(0), 0);
  let state = 'on', attributes = { friendly_name: id };
  if (d === 'sensor') {
    if (/temp/.test(n)) state = '22.4';
    else if (/feucht|humid/.test(n)) state = '45';
    else if (/percent|ladestand/.test(n)) state = '65';
    else if (/kwh|energie|energy|verbrauch_heute/.test(n)) state = '12.4';
    else if (/wasser|water/.test(n)) state = '180';
    else if (/leist|power|watt|verbrauch/.test(n)) state = String(Math.round(530 + Math.sin(Date.now() / 60000) * 150));
    else state = 'Gut';
  } else if (d === 'light') {
    state = code % 2 ? 'on' : 'off';
    attributes = {
      friendly_name: id,
      brightness: 204,
      color_temp_kelvin: 3200,
      min_color_temp_kelvin: 2000,
      max_color_temp_kelvin: 6500,
      rgb_color: [124, 108, 240],
      supported_color_modes: ['rgb', 'color_temp'],
      effect_list: ['Solid', 'Rainbow', 'Breathe', 'Aurora', 'Candle'],
      effect: 'Solid'
    };
  } else if (d === 'media_player') {
    state = 'playing';
    attributes = {
      friendly_name: id,
      volume_level: 0.35,
      is_volume_muted: false,
      media_title: 'Abendprogramm',
      source: 'HDMI 1',
      source_list: ['TV', 'HDMI 1', 'Netflix', 'YouTube', 'Spotify']
    };
  } else if (d === 'climate') {
    state = /klimaanlage/.test(n) ? 'off' : 'heat';
    attributes = { current_temperature: 21.8, temperature: 21.5, target_temp_step: 0.5, min_temp: 5, max_temp: 30, hvac_modes: ['heat','cool','auto','off'], hvac_action: 'heating', preset_modes: ['none','boost'], preset_mode: 'none', fan_modes: ['auto','low','medium','high'], fan_mode: 'auto' };
  } else if (d === 'binary_sensor') state = 'off';
  else if (d === 'lock') state = 'locked';
  else if (d === 'camera') state = 'idle';
  else if (d === 'weather') { state = 'partlycloudy'; attributes = { friendly_name: id, temperature: 16.8, temperature_unit: '°C', humidity: 68, humidity_unit: '%', pressure: 1015, pressure_unit: 'hPa', wind_speed: 12, wind_speed_unit: 'km/h', precipitation: 0, precipitation_unit: 'mm' }; }
  else if (d === 'cover') { state = code % 2 ? 'open' : 'closed'; attributes = { current_position: code % 2 ? 100 : 0 }; }
  else state = code % 3 ? 'on' : 'off';
  return { state, attributes, last_changed: new Date(Date.now() - (code % 5 + 1) * 3600e3).toISOString() };
}

function S(id) {
  if (!id) return undefined;
  if (DEMO) return demoState(id);
  const h = getHass();
  return h && h.states[id];
}
const num = id => { const s = S(id); const v = parseFloat(s && s.state); return isNaN(v) ? null : v; };

function call(domain, service, data, refresh = true) {
  if (DEMO) { toast(`Demo: ${domain}.${service}`); return; }
  const h = getHass();
  if (h) h.callService(domain, service, data);
  if (refresh) setTimeout(() => tick(true), 500);
}

function navigate(path) {
  if (!path) return;
  const p = String(path).trim();
  if (/^javascript:/i.test(p)) return;
  try {
    if (p.startsWith('/')) {
      window.parent.history.pushState(null, '', p);
      window.parent.dispatchEvent(new CustomEvent('location-changed'));
      return;
    }
  } catch (e) {}
  if (/^https?:\/\//i.test(p) || p.startsWith('/')) {
    window.open(p, '_blank', 'noopener,noreferrer');
  }
}

let toastT;
function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ---------- UI-Zustand ---------- */
const coverDrag = { active: false, el: null, entity: null, pointerId: null, lastSentAt: 0, lastSentPos: null };
const ui = {
  room: 0,
  view: localStorage.getItem('hub_view') || 'dashboard',
  showAll: false,
  editMode: false,
  profileMenuOpen: false,
  unlockArmedEntity: null,
  unlockArmedUntil: 0,
  seriesVer: 0
};
const series = {};
const yesterdayMetricVals = {};


/* ---------- Hub als Standard-Dashboard in HA-Profil eintragen ---------- */
async function setHubAsDefaultPanel() {
  const PANEL = 'smarthome-hub';
  const h = getHass();
  if (!h) { toast(t('toast.no_ha')); return; }
  let ok = false;
  // 1) Pro Browser/Gerät (ältere HA-Versionen & Fallback)
  try {
    window.parent.localStorage.setItem('defaultPanel', JSON.stringify(PANEL));
    ok = true;
  } catch (e) {}
  // 2) Pro HA-Benutzerkonto (neuere HA-Versionen), bestehende Werte bleiben erhalten
  try {
    const cur = await h.callWS({ type: 'frontend/get_user_data', key: 'core' });
    const val = Object.assign({}, (cur && cur.value) || {}, { defaultPanel: PANEL });
    await h.callWS({ type: 'frontend/set_user_data', key: 'core', value: val });
    ok = true;
  } catch (e) {}
  toast(ok ? t('toast.default_set') : t('toast.default_err'));
}

/* ---------- Neutrales Start-Gerüst für Neuinstallationen ---------- */
const EMPTY_CONFIG = {
  sidebarTitle: "Smart Home Hub",
  sidebarIcon: "mdi:home-automation",
  title: "Smart Home",
  subtitle: "Home Assistant",
  userName: "",
  role: "Bewohner",
  showDateTime: true,
  dateTimeLocale: "de-DE",
  dateTimeTimeZone: "Europe/Berlin",
  greetingEntity: "",
  greetingIgnore: ["bereit"],
  go2rtcHost: "",

  kioskMode: false,
  hideSystemLinks: false,
  pinCode: "",
  pinProtect: {
    editor: true,
    systemLinks: true,
    kioskExit: true,
    doorUnlock: false
  },

  theme: {
    bg: "#080912",
    acc: "#7c6cf0",
    acc2: "#a99bff",
    ok: "#34d399",
    warn: "#f59e0b",
    cool: "#38bdf8"
  },

  systemLinks: [
    { label: "Geräte",        icon: "devices",  path: "/config/devices/dashboard" },
    { label: "Automationen",  icon: "auto",     path: "/config/automation/dashboard" },
    { label: "Energie",       icon: "bolt",     path: "/energy" },
    { label: "Sicherheit",    icon: "shield",   path: "/logbook" },
    { label: "Szenen",        icon: "scenes",   path: "/config/scene/dashboard" },
    { label: "Skripte",       icon: "cal",      path: "/config/script/dashboard" },
    { label: "Einstellungen", icon: "settings", path: "/config/dashboard" }
  ],

  headerBadgeItems: [
    { type: 'entity', title: 'Akku leer in', icon: 'batteryClock', format: '[W1]', colorLogic: 'default:orange',
      entity1: 'sensor.batterie_leer_um_4', conditionEnt: 'sensor.senec_battery_discharge_power', conditionOp: '>', conditionVal: '10' },
    { type: 'entity', title: 'Akku voll in', icon: 'batteryCharge', format: '[W1]', colorLogic: 'default:green',
      entity1: 'sensor.batterie_voll_um', conditionEnt: 'sensor.senec_battery_charge_power', conditionOp: '>', conditionVal: '10' },
    { type: 'entity', title: 'Geschirrspüler', icon: 'dishwasher', format: '[W1]% - [W2]', colorLogic: 'default:blue',
      entity1: 'sensor.geschirrspuler_programm_fortschritt', entity2: 'sensor.geschirrspuler_programm_endzeit', conditionEnt: 'sensor.geschirrspuler_programm_fortschritt', conditionOp: '>', conditionVal: '0' },
    { type: 'entity', title: 'Waschmaschine', icon: 'washing', format: '[W1]', colorLogic: 'default:blue',
      entity1: 'sensor.waschmaschine_ende', conditionEnt: 'sensor.waschmaschine_ende', conditionOp: 'not_empty', conditionVal: '' },
    { type: 'calendar', title: 'Abfall', icon: 'trash', format: 'Nächste 2 Tage', colorLogic: 'default:trash', maxDays: 2 }
  ],

  calendars: {
    weatherEntity: "",
    familyEntities: [],
    trashEntities: []
  },

  powerFlow: [],

  webrtcCameras: [],
  covers: [],
  deviceTabs: [
    { id: "geraete", name: "Geräte" },
    { id: "covers",  name: "Rolläden" }
  ],
  rooms: [
    {
      name: "Home",
      image: "",
      color: "#2a2370",
      webrtc: "",
      camera: "",
      showLiveBadge: true,
      camButtons: [],
      chips: []
    }
  ],
  devices: [],
  climate: { title: "Raumklima", label: "Hauptbereich", entity: "", min: 16, max: 30, step: 0.5 },

  weather: {
    showCard: true,
    title: "Wetter",
    label: "Zuhause",
    entity: "",
    tempEntity: "",
    tempUnit: "°C",
    showForecast: true,
    forecastTitle: "Wettervorhersage · 7 Tage",
    forecastEntity: "",
    items: [
      { label: "Luftfeuchtigkeit", entity: "", attr: "humidity",      unit: "%",    icon: "drop",   decimals: 0 },
      { label: "Wind",             entity: "", attr: "wind_speed",    unit: "km/h", icon: "fan",    decimals: 1 },
      { label: "Luftdruck",        entity: "", attr: "pressure",      unit: "hPa",  icon: "thermo", decimals: 0 },
      { label: "Niederschlag",     entity: "", attr: "precipitation", unit: "mm",   icon: "drop",   decimals: 1 }
    ]
  },

  climateRooms: [],
  metrics: [],
  security: {
    lock: "",
    locks: [],
    windows: [],
    cameras: []
  },
  lights: [],

  customPages: [
    {
      id: "kalender",
      label: "Kalender",
      icon: "calendar",
      eyebrow: "Termine & Abholungen",
      title: "Kalender",
      intro: "Familienkalender und Abfallkalender im Überblick.",
      widgets: [
        { type: "calendar", title: "Familienkalender · 14 Tage", days: 14 },
        { type: "trash", title: "Abfallkalender", days: 30, maxItems: 25, subtitle: "Nächste 30 Tage" }
      ]
    },
    {
      id: "statistik",
      label: "Statistik",
      icon: "chart",
      eyebrow: "Verläufe",
      title: "Statistik",
      intro: "24-Stunden-Verläufe und aktuelle Leistungsdaten.",
      widgets: []
    }
  ]
};

/* ---------- Vollständiges Preset aus deiner bestehenden Konfiguration ---------- */
const TIMO_PRESET_CONFIG = {
  sidebarTitle: "Smart Home Hub",
  sidebarIcon: "mdi:home-automation",
  title: "Home",
  subtitle: "Home Assistant",
  userName: "Familie Mittenmüller",
  role: "Hausbesitzer",
  showDateTime: true,
  dateTimeLocale: "de-DE",
  dateTimeTimeZone: "Europe/Berlin",
  greetingEntity: "",
  greetingIgnore: ["bereit"],
  go2rtcHost: "http://192.168.178.4:1984",

  kioskMode: false,
  hideSystemLinks: false,
  pinCode: "",
  pinProtect: {
    editor: true,
    systemLinks: true,
    kioskExit: true,
    doorUnlock: false
  },

  theme: {
    bg: "#080912",
    acc: "#7c6cf0",
    acc2: "#a99bff",
    ok: "#34d399",
    warn: "#f59e0b",
    cool: "#38bdf8"
  },

  systemLinks: [
    { label: "Geräte",        icon: "devices",  path: "/config/devices/dashboard" },
    { label: "Automationen",  icon: "auto",     path: "/config/automation/dashboard" },
    { label: "Energie",       icon: "bolt",     path: "/energy" },
    { label: "Sicherheit",    icon: "shield",   path: "/logbook" },
    { label: "Szenen",        icon: "scenes",   path: "/config/scene/dashboard" },
    { label: "Skripte",       icon: "cal",      path: "/config/script/dashboard" },
    { label: "Einstellungen", icon: "settings", path: "/config/dashboard" }
  ],

  headerBadgeItems: [
    { type: 'entity', title: 'Akku leer in', icon: 'batteryClock', format: '[W1]', colorLogic: 'default:orange',
      entity1: 'sensor.batterie_leer_um_4', conditionEnt: 'sensor.senec_battery_discharge_power', conditionOp: '>', conditionVal: '10' },
    { type: 'entity', title: 'Akku voll in', icon: 'batteryCharge', format: '[W1]', colorLogic: 'default:green',
      entity1: 'sensor.batterie_voll_um', conditionEnt: 'sensor.senec_battery_charge_power', conditionOp: '>', conditionVal: '10' },
    { type: 'entity', title: 'Geschirrspüler', icon: 'dishwasher', format: '[W1]% - [W2]', colorLogic: 'default:blue',
      entity1: 'sensor.geschirrspuler_programm_fortschritt', entity2: 'sensor.geschirrspuler_programm_endzeit', conditionEnt: 'sensor.geschirrspuler_programm_fortschritt', conditionOp: '>', conditionVal: '0' },
    { type: 'entity', title: 'Waschmaschine', icon: 'washing', format: '[W1]', colorLogic: 'default:blue',
      entity1: 'sensor.waschmaschine_ende', conditionEnt: 'sensor.waschmaschine_ende', conditionOp: 'not_empty', conditionVal: '' },
    { type: 'calendar', title: 'Abfall', icon: 'trash', format: 'Nächste 2 Tage', colorLogic: 'default:trash', maxDays: 2 }
  ],

  calendars: {
    weatherEntity: "weather.aussen_wetter_urloffen",
    familyEntities: ["calendar.familie", "calendar.familie_2"],
    trashEntities: ["calendar.abfallkalender2025", "calendar.abfallkalender2026"]
  },

  powerFlow: [
    { label: "Produktion PV",      entity: "sensor.senec_solar_generated_power",     unit: "W", icon: "sun" },
    { label: "Hausverbrauch",      entity: "sensor.senec_house_power",               unit: "W", icon: "plug" },
    { label: "Netzbezug",          entity: "sensor.senec_grid_imported_power",       unit: "W", icon: "plug" },
    { label: "Netzeinspeisung",    entity: "sensor.senec_grid_exported_power",       unit: "W", icon: "plug" },
    { label: "Batterie Ladung",    entity: "sensor.senec_battery_charge_power",      unit: "W", icon: "bolt" },
    { label: "Batterie Entladung", entity: "sensor.senec_battery_discharge_power",   unit: "W", icon: "bolt" },
    { label: "Ladezustand",        entity: "sensor.senec_battery_charge_percent",    unit: "%", icon: "battery" }
  ],

  webrtcCameras: [
    { name: "Eingang",       stream: "Eingang-sub",       entity: "camera.eingang" },
    { name: "Hof",           stream: "Hof-sub",           entity: "camera.hof" },
    { name: "Werkstatt",     stream: "Werkstatt-sub",     entity: "camera.werkstatt" },
    { name: "Carport",       stream: "Carport-sub",       entity: "" },
    { name: "Parkplatz",     stream: "Parkplatz-sub",     entity: "camera.parkplatz" },
    { name: "Garten",        stream: "Garten-sub",        entity: "camera.garten" },
    { name: "Hintereingang", stream: "Hintereingang-sub", entity: "camera.hintereingang" }
  ],

  covers: [
    { name: "Carport hinten",  entity: "cover.shellyplus2pm_cc7b5c895dc4_cover_0" },
    { name: "Carport vornen",  entity: "cover.shellyplus2pm_cc7b5c894a14_cover_0" },
    { name: "Rolladen Garten", entity: "cover.rolladen_garten_cover_0" },
    { name: "Rolladen WC",     entity: "cover.rolladen_wc" }
  ],

  deviceTabs: [
    { id: "geraete", name: "Geräte" },
    { id: "covers",  name: "Rolläden" }
  ],

  rooms: [
    { name: "Home", image: "Haus.jpg", color: "#2a2370", webrtc: "Eingang-sub", camera: "camera.eingang_standardauflosung",
      showLiveBadge: true,
      camButtons: [
        { name: "Vergrößern", icon: "expand", stream: "", entity: "" }
      ],
      chips: [
        { icon: "thermo",  entity: "sensor.appenweier_temperatur",            unit: "°C" },
        { icon: "bolt",    entity: "sensor.senec_house_power",                unit: "W", decimals: 0, cls: "blue" },
        { icon: "sun",     entity: "sensor.senec_solar_generated_power",      unit: "W", decimals: 0, cls: "amber" },
        { icon: "battery", entity: "sensor.senec_battery_charge_percent",     unit: "%", decimals: 0, cls: "battery" },
        { icon: "drop",    entity: "sensor.appenweier_luftfeuchtigkeit",      unit: "%", decimals: 0 } ] },
    { name: "Wohnzimmer", image: "wohnzimmer.jpg", color: "#2a2350", climate: "climate.heizung_wohnzimmer", showLiveBadge: true, camButtons: [], chips: [
        { icon: "thermo", entity: "sensor.heizung_wohnzimmer_temperatur", unit: "°C" },
        { icon: "drop",   entity: "sensor.heizung_wohnzimmer_luftfeuchtigkeit", unit: "%", decimals: 0 } ] },
    { name: "Küche/Esszimmer", image: "kueche.jpg", color: "#3a2a22", climate: "climate.heizung_esszimmer", showLiveBadge: true, camButtons: [], chips: [
        { icon: "thermo", entity: "climate.heizung_esszimmer", attr: "current_temperature", unit: "°C" } ] },
    { name: "Bad", image: "bad.jpg", color: "#3a2a22", climate: "climate.bad_thermostat", showLiveBadge: true, camButtons: [], chips: [
        { icon: "thermo", entity: "sensor.bad_temperatur", unit: "°C" } ] },
    { name: "Lilly", image: "lilly.jpg", color: "#1f6a5a", showLiveBadge: true, camButtons: [], chips: [] },
    { name: "Mila", image: "mila.jpg", color: "#1f7a4a", showLiveBadge: true, camButtons: [], chips: [] },
    { name: "Ella", image: "ella.jpg", color: "#1f8a5a", climate: "climate.ella_thermostat_heizung", showLiveBadge: true, camButtons: [], chips: [
        { icon: "thermo", entity: "sensor.ella_thermostat_heizung_local_temperature", unit: "°C" } ] },
    { name: "Lia", image: "lia.jpg", color: "#1f5a4a", showLiveBadge: true, camButtons: [], chips: [] },
    { name: "Garten", image: "garten.jpg", color: "#1f3a2c", showLiveBadge: true, camButtons: [], chips: [] }
  ],

  devices: [
    { name: "Treppenaufgang", room: "Home",            entity: "switch.treppenaufgang", icon: "bulb", tab: "geraete" },
    { name: "Flur",           room: "Home",            entity: "switch.flur", icon: "bulb", tab: "geraete" },
    { name: "Licht vorne",    room: "Wohnzimmer",      entity: "switch.wohnzimmer_licht_vorne", icon: "bulb", tab: "geraete" },
    { name: "Licht hinten",   room: "Wohnzimmer",      entity: "switch.wohnzimmer_licht_hinten", icon: "bulb", tab: "geraete" },
    { name: "LED",            room: "Wohnzimmer",      entity: "light.wled_couch", icon: "bulb", tab: "geraete" },
    { name: "Fernseher",      room: "Wohnzimmer",      entity: "media_player.wohnzimmer_2", icon: "tv", tab: "geraete" },
    { name: "Heizung",        room: "Wohnzimmer",      entity: "climate.heizung_wohnzimmer", tab: "geraete" },
    { name: "Klimaanlage",    room: "Wohnzimmer",      entity: "climate.klimaanlage_wohnzimmer", tab: "geraete" },
    { name: "Deckenlicht",    room: "Küche/Esszimmer", entity: "switch.kuchenlicht", tab: "geraete" },
    { name: "Unterschrank",   room: "Küche/Esszimmer", entity: "switch.unterbauleuchte", tab: "geraete" },
    { name: "Esstisch",       room: "Küche/Esszimmer", entity: "switch.esstisch", tab: "geraete" },
    { name: "Heizung",        room: "Küche/Esszimmer", entity: "climate.heizung_esszimmer", tab: "geraete" },
    { name: "Heizung",        room: "Bad",             entity: "climate.heizung_bad_2", tab: "geraete" },
    { name: "Steckdose",      room: "Lilly",           entity: "switch.steckdose_hinter_bett", tab: "geraete" },
    { name: "Heizung",        room: "Ella",            entity: "climate.ella_thermostat_heizung", tab: "geraete" },
    { name: "Deckenlicht",    room: "Lia",             entity: "switch.ella_licht", tab: "geraete" },
    { name: "Kuschelecke",    room: "Lia",             entity: "switch.shellyplus1_78ee4ccffb80_switch_0", tab: "geraete" },
    { name: "Pool-Pumpe",     room: "Garten",          entity: "switch.pool_pumpe", icon: "drop", power: "sensor.pool_pumpe_leistung", tab: "geraete" },
    { name: "Mähroboter",     room: "Garten",          entity: "lawn_mower.mahlanie_2", icon: "mower", tab: "geraete" },
    { name: "Grillecke",      room: "Garten",          entity: "switch.lichterkette_grillecke", tab: "geraete" }
  ],

  climate: { title: "Raumklima", label: "Wohnzimmer", entity: "climate.heizung_wohnzimmer", min: 16, max: 30, step: 0.5 },

  weather: {
    showCard: true,
    title: "Wetter",
    label: "Zimmern",
    entity: "weather.appenweier",
    tempEntity: "sensor.appenweier_temperatur",
    tempUnit: "°C",
    showForecast: true,
    forecastTitle: "Wettervorhersage · 7 Tage",
    forecastEntity: "weather.appenweier",
    items: [
      { label: "Luftfeuchtigkeit", entity: "sensor.appenweier_luftfeuchtigkeit", attr: "humidity",      unit: "%",    icon: "drop",   decimals: 0 },
      { label: "Wind",             entity: "",                                   attr: "wind_speed",    unit: "km/h", icon: "fan",    decimals: 1 },
      { label: "Luftdruck",        entity: "",                                   attr: "pressure",      unit: "hPa",  icon: "thermo", decimals: 0 },
      { label: "Niederschlag",     entity: "",                                   attr: "precipitation", unit: "mm",   icon: "drop",   decimals: 1 }
    ]
  },

  climateRooms: [
    { name: "Wohnzimmer", icon: "sofa",
      sensors: [
        { entity: "sensor.heizung_wohnzimmer_temperatur", icon: "thermo", unit: "°C" },
        { entity: "sensor.heizung_wohnzimmer_luftfeuchtigkeit", icon: "drop", unit: "%", decimals: 0 } ],
      devices: [
        { entity: "climate.heizung_wohnzimmer", name: "Heizung", icon: "radiator", presets: ["boost"] },
        { entity: "climate.klimaanlage_wohnzimmer", name: "Klimaanlage", icon: "ac", toggle: true } ],
      charts: [
        { entity: "sensor.heizung_wohnzimmer_temperatur", title: "Temperatur", min: 15, max: 30 },
        { entity: "sensor.heizung_wohnzimmer_luftfeuchtigkeit", title: "Luftfeuchtigkeit", decimals: 0 } ] },
    { name: "Küche/Esszimmer", icon: "radiator",
      sensors: [ { entity: "climate.heizung_esszimmer", attr: "current_temperature", icon: "thermo", unit: "°C" } ],
      boost: { entity: "input_boolean.heizung_esszimmer_boost", name: "Boost" },
      settings: { title: "Küche/Esszimmer Einstellungen", groups: [
        { title: "Zieltemperaturen", items: [
          { entity: "input_number.heizung_esszimmer_komfort",      name: "Komfort" },
          { entity: "input_number.heizung_esszimmer_komfort_kalt", name: "Komfort, wenn es draußen unter 5 °C hat" },
          { entity: "input_number.heizung_esszimmer_normal",       name: "Normal (restliche Zeit)" },
          { entity: "input_number.heizung_esszimmer_sommer",       name: "Sommer (Außentemperatur über 15 °C)" } ] },
        { title: "Komfortzeiten", items: [
          { entity: "input_datetime.heizung_esszimmer_morgen_start", name: "Morgens von" },
          { entity: "input_datetime.heizung_esszimmer_morgen_ende",  name: "Morgens bis" },
          { entity: "input_datetime.heizung_esszimmer_abend_start",  name: "Abends von" },
          { entity: "input_datetime.heizung_esszimmer_abend_ende",   name: "Abends bis" },
          { entity: "sensor.durchschnittstemperatur_24h",            name: "Außentemperatur Ø 24h (steuert Sommer/Winter)" } ] } ] },
      devices: [ { entity: "climate.heizung_esszimmer", name: "Heizung", icon: "radiator" } ],
      charts: [ { entity: "climate.heizung_esszimmer", attr: "current_temperature", title: "Temperatur", min: 15, max: 30 } ] },
    { name: "Schlafzimmer", icon: "bed",
      sensors: [ { entity: "sensor.temperatur_schlafzimmer_dachboden", icon: "thermo", unit: "°C" } ],
      devices: [ { entity: "climate.klimaanlage_dachboden", name: "Klimaanlage", icon: "ac", toggle: true } ],
      charts: [ { entity: "sensor.temperatur_schlafzimmer_dachboden", title: "Temperatur", min: 15, max: 30 } ] },
    { name: "Bad", icon: "shower",
      sensors: [ { entity: "sensor.bad_temperatur", icon: "thermo", unit: "°C" } ],
      boost: { entity: "input_boolean.heizung_bad_boost", name: "Boost" },
      settings: { title: "Bad Einstellungen", groups: [
        { title: "Zieltemperaturen", items: [
          { entity: "input_number.heizung_bad_komfort",      name: "Komfort" },
          { entity: "input_number.heizung_bad_komfort_kalt", name: "Komfort, wenn es draußen unter 5 °C hat" },
          { entity: "input_number.heizung_bad_normal",       name: "Normal (restliche Zeit)" },
          { entity: "input_number.heizung_bad_sommer",       name: "Sommer (Außentemperatur über 15 °C)" } ] },
        { title: "Komfortzeiten", items: [
          { entity: "input_datetime.heizung_bad_morgen_start", name: "Morgens von" },
          { entity: "input_datetime.heizung_bad_morgen_ende",  name: "Morgens bis" },
          { entity: "input_datetime.heizung_bad_abend_start",  name: "Abends von" },
          { entity: "input_datetime.heizung_bad_abend_ende",   name: "Abends bis" },
          { entity: "sensor.durchschnittstemperatur_24h",      name: "Außentemperatur Ø 24h (steuert Sommer/Winter)" } ] } ] },
      devices: [
        { entity: "climate.bad_thermostat", name: "Heizung", icon: "radiator" },
        { entity: "climate.heizung_bad_2", name: "Heizkörperventil", icon: "radiator", readonly: true } ],
      charts: [ { entity: "sensor.bad_temperatur", title: "Temperatur", min: 15, max: 30 } ] },
    { name: "Ella", icon: "teddy",
      sensors: [ { entity: "sensor.ella_thermostat_heizung_local_temperature", icon: "thermo", unit: "°C" } ],
      settings: { title: "Ella Einstellungen", groups: [
        { title: "Zieltemperaturen", items: [
          { entity: "input_number.ella_temp_komfort", name: "Komfort (tagsüber, wenn es kalt ist)" },
          { entity: "input_number.ella_temp_absenk",  name: "Absenkung (nachts / wenn es warm ist)" } ] },
        { title: "Außentemperatur-Schwellen", items: [
          { entity: "input_number.ella_schwelle_kalt", name: "Ab hier volle Komforttemperatur (unter)" },
          { entity: "input_number.ella_schwelle_warm", name: "Ab hier nur noch Absenkung (über)" } ] },
        { title: "Zeiten", items: [
          { entity: "input_datetime.ella_tag_start",   name: "Tagbetrieb ab" },
          { entity: "input_datetime.ella_nacht_start", name: "Nachtabsenkung ab" },
          { entity: "sensor.durchschnittstemperatur_24h", name: "Außentemperatur Ø 24h" },
          { entity: "sensor.ella_ziel_temperatur",     name: "Berechnete Ziel-Temperatur" } ] } ] },
      devices: [ { entity: "climate.ella_thermostat_heizung", name: "Heizung", icon: "radiator" } ],
      charts: [ { entity: "sensor.ella_thermostat_heizung_local_temperature", title: "Temperatur", min: 15, max: 30 } ] }
  ],

  metrics: [
    { id: "energy", title: "Energieverbrauch", entity: "sensor.senec_main_unit_senec_hausverbrauch_heute", unit: "kWh", decimals: 1,
      chart: "sensor.senec_house_power", mode: "avg", chartUnit: "W",
      subButtons: [
        { id: "solar", name: "Solar", icon: "sun", color: "warn",
          entities: [ { entity: "sensor.senec_solar_generated_power", name: "Produktion PV", unit: "W", chart: true } ] },
        { id: "akku", name: "Akku", icon: "battery", color: "ok",
          entities: [
            { entity: "sensor.senec_battery_charge_percent", name: "Ladezustand", unit: "%", chart: false },
            { entity: "sensor.senec_battery_charge_power", name: "Ladung", unit: "W", chart: true },
            { entity: "sensor.senec_battery_discharge_power", name: "Entladung", unit: "W", chart: true } ] },
        { id: "netz", name: "Netz", icon: "plug", color: "cool",
          entities: [
            { entity: "sensor.senec_grid_imported_power", name: "Netzbezug", unit: "W", chart: true },
            { entity: "sensor.senec_grid_exported_power", name: "Netzeinspeisung", unit: "W", chart: true } ] }
      ]
    },
    { id: "water", title: "Wasserverbrauch", entity: "sensor.wasserzaehler_wasserverbrauch_letzte_24_stunden", unit: "m³", decimals: 0,
      chart: "sensor.wasserverbrauch_letzter_stunde", mode: "last" }
  ],

  security: {
    lock: "lock.eingang_2",
    locks: [
      { name: "Haustür", entity: "lock.eingang_2" }
    ],
    windows: ["binary_sensor.fenster_wohnzimmer", "binary_sensor.fenster_kueche"],
    cameras: ["camera.eingang", "camera.garten", "camera.hintereingang", "camera.hof", "camera.parkplatz", "camera.werkstatt"]
  },

  lights: [
    { name: "Living", entities: ["switch.wohnzimmer_licht_vorne", "switch.wohnzimmer_licht_hinten"] },
    { name: "Küche",  entities: ["switch.kuchenlicht", "switch.esstisch", "switch.unterbauleuchte"] },
    { name: "Lia",    entities: ["switch.ella_licht", "switch.shellyplus1_78ee4ccffb80_switch_0"] },
    { name: "Haus",   entities: ["switch.treppenaufgang", "switch.flur"] },
    { name: "Garten", entities: ["switch.lichterkette_grillecke"] }
  ],

  customPages: [
    {
      id: "kalender", label: "Kalender", icon: "calendar",
      eyebrow: "Termine & Abholungen", title: "Kalender",
      intro: "Familienkalender der kommenden 14 Tage und Abfallkalender der nächsten 30 Tage im Überblick.",
      widgets: [
        { type: "calendar", title: "Familienkalender · 14 Tage", days: 14 },
        { type: "trash", title: "Abfallkalender", days: 30, maxItems: 25, subtitle: "Nächste 30 Tage" }
      ]
    },
    {
      id: "statistik", label: "Statistik", icon: "chart",
      eyebrow: "Verläufe", title: "Statistik",
      intro: "Wasser, Internet, Raumtemperaturen, Heizkreis sowie PV- und Stromleistung im 24-Stunden-Verlauf.",
      widgets: [
        { type: "stat_group", title: "Wasserverbrauch", icon: "drop", items: [
          { entity: "sensor.wasserverbrauch_letzter_stunde", name: "Wasserverbrauch", unit: "L", mode: "last", decimals: 1, color: "#1a5fb4" } ] },
        { type: "stat_group", title: "Internet", icon: "plug", items: [
          { entity: "sensor.cloudflare_speed_test_25mb_down", name: "Download", unit: "Mbit/s", color: "#ff4757" },
          { entity: "sensor.cloudflare_speed_test_10mb_up",   name: "Upload",   unit: "Mbit/s", color: "#378ADD" },
          { entity: "sensor.cloudflare_speed_test_latency",   name: "Ping",     unit: "ms",     color: "#2ecc71" } ] },
        { type: "stat_group", title: "Temperatur", icon: "thermo", items: [
          { entity: "sensor.heizung_wohnzimmer_temperatur", name: "Wohnzimmer", unit: "°C", color: "#ff4757" },
          { entity: "climate.heizung_esszimmer", attr: "current_temperature", name: "Küche/Esszimmer", unit: "°C", color: "#ff7f50" },
          { entity: "sensor.bad_temperatur", name: "Bad", unit: "°C", color: "#378ADD" },
          { entity: "sensor.ella_thermostat_heizung_local_temperature", name: "Ella", unit: "°C", color: "#2ecc71" },
          { entity: "sensor.temperatur_schlafzimmer_dachboden", name: "Schlafzimmer", unit: "°C", color: "#9b59b6" },
          { entity: "sensor.appenweier_temperatur", name: "Außen", unit: "°C", color: "#e5a50a" } ] },
        { type: "stat_group", title: "Heizung & Solar", icon: "fire", items: [
          { entity: "sensor.pufferspeicher", name: "Pufferspeicher", unit: "°C", color: "#ff4757" },
          { entity: "sensor.solar_vorlauf",  name: "Solar Vorlauf",  unit: "°C", color: "#378ADD" },
          { entity: "sensor.solar_rucklauf", name: "Solar Rücklauf", unit: "°C", color: "#2ecc71" },
          { entity: "sensor.holz_vorlauf",   name: "Holz Vorlauf",   unit: "°C", color: "#9b59b6" },
          { entity: "sensor.holz_rucklauf",  name: "Holz Rücklauf",  unit: "°C", color: "#e5a50a" } ] },
        { type: "stat_group", title: "PV & Stromverbrauch", icon: "bolt", items: [
          { entity: "sensor.senec_solar_generated_power",     name: "Produktion", unit: "W", color: "#f39c12" },
          { entity: "sensor.senec_house_power",               name: "Verbrauch",  unit: "W", color: "#378ADD" },
          { entity: "sensor.senec_battery_charge_power",      name: "Beladung",   unit: "W", color: "#ff4757" },
          { entity: "sensor.senec_battery_discharge_power",   name: "Entladung",  unit: "W", color: "#9b59b6" } ] },
        { type: "power_flow", title: "Power Flow" }
      ]
    },
    {
      id: "aufgaben", label: "Aufgaben", icon: "tasks",
      eyebrow: "Familie", title: "Familienplaner Aufgaben",
      intro: "Familienaufgaben aus TaskMate oder Home Assistant To-Do.",
      widgets: [
        { type: "todo", mode: "taskmate", entity: "sensor.taskmate_overview", children: [
          { name: "Lilly", id: "ee0d235fb83a4a99" }, { name: "Mila", id: "c235e4fdf3bf43e1" },
          { name: "Ella",  id: "4485c5b52dc440ec" }, { name: "Lia",  id: "bd9bc94b7dc042e4" },
          { name: "Timo",  id: "6bf3973ac5cc49b5" }, { name: "Joyce", id: "70e8eaa1e3744966" } ] }
      ]
    },
    {
      id: "f1", label: "Formel 1", icon: "race",
      eyebrow: "Motorsport", title: "Formel 1",
      intro: "Nächstes Rennen, Saisoninformationen und Fahrerwertung.",
      widgets: [
        { type: "entity_info", entity: "sensor.f1_next_race", title: "Nächstes Rennen", fields: "race_name:Rennen,circuit_name:Strecke,location:Ort,country:Land,date:Datum,start_time:Startzeit" },
        { type: "entity_info", entity: "sensor.f1_session_f1_current_session", title: "Aktuelle Session", fields: "session_name:Session,date:Datum,start_time:Startzeit" },
        { type: "entity_info", entity: "sensor.f1_session_f1_session_status", title: "Session-Status", fields: "session_status:Status,session_name:Session,track_status:Streckenstatus" },
        { type: "entity_info", entity: "sensor.f1_championship_f1_driver_standings", title: "WM-Stand (Fahrer)", fields: "standings:Fahrerwertung,season:Saison" }
      ]
    },
    {
      id: "bundesliga", label: "Bundesliga", icon: "soccer",
      eyebrow: "Fußball", title: "Bundesliga",
      intro: "Informationen zum Verein und Spieltag.",
      widgets: [
        { type: "sports_hub", title: "SC Freiburg", sport: "soccer", league: "ger.1", teamId: "126", teamName: "SC Freiburg", viewMode: "google", col: "full", show: true, showHeader: true, showFocusMatch: true, showUpcoming: true, upcomingCount: 4, showTable: true, tableRows: 6, crossComp: true },
        { type: "buli_team", entity: "sensor.sc_freiburg", title: "Mein Verein (HA-Sensor)", show: false },
        { type: "buli_table", entity: "sensor.bund_scoreboard2", title: "1. Bundesliga Tabelle (HA-Sensor)", show: false },
        { type: "buli_matchday", title: "Spieltag Übersicht (HA-Sensor)", show: false }
      ]
    }
  ]
};

let CONFIG = JSON.parse(JSON.stringify(EMPTY_CONFIG));

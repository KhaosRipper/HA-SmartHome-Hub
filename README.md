# Smart Home Hub für Home Assistant / for Home Assistant

[🇩🇪 Deutsch](#-deutsch) | [🇬🇧 English](#-english)

<img width="1904" height="1080" alt="image" src="https://github.com/user-attachments/assets/7b1eb930-f27f-4f8b-a44e-33729f46738a" />

---

## 🇩🇪 Deutsch

Ein modernes, modulares und hochgradig anpassbares Smart-Home-Dashboard für Home Assistant im edlen Dark-Design – **vollständig zweisprachig (Deutsch & Englisch)** inklusive automatischer Home-Assistant-Spracherkennung.

### ✨ Features

#### 🎨 Oberfläche, Layout & Mehrsprachigkeit
- **Vollständig zweisprachig (DE / EN):** Richtet sich standardmäßig automatisch nach der Sprache deines Home-Assistant-Profils (`de*` → Deutsch, alle übrigen Sprachen → Englisch) und lässt sich im Konfigurator global oder pro Endgerät fest umschalten.
- **Moderne Benutzeroberfläche:** Übersichtlich strukturierte Startseite (Dashboard) mit integriertem Raum-Banner, Live-Kamera, dynamischen Header-Badges und Schnellstart-Pillen.
- **Flexibles Raster & Quick-Edit:** Wähle zwischen asymmetrischen Spalten-Layouts (z. B. 70/30, 65/35, 50/50) oder einem freien 12-Spalten-Grid und verschiebe Kacheln direkt über den Quick-Edit-Modus.
- **Modernes Profil-Popover-Menü:** Floating-Glassmorphism-Menü unten in der Seitenleiste für Schnell-Bearbeitung, Vollbild/Kiosk und den Konfigurator.
- **12 Design-Presets & Anpassung:** Umschaltbare Farb- und Theme-Vorlagen (z. B. *Midnight Purple*, *OLED Pure Black*, *Nordic Frost*, *Cyber Neon*) sowie individuelle Rundungen, Dichte-Stufen und Banner-Textfarben.
- **Lokale Endgeräte-Profile & OLED-Screensaver:** Gerätespezifische Startansichten und Spracheinstellungen (z. B. für Wandtablet Flur, Tablet Büro oder PC), automatische Rückkehr nach Inaktivität und ein minimalistischer Uhren-/Wetter-Screensaver als Burn-In-Schutz.

#### 🛠️ Visueller No-Code-Konfigurator
- **100 % In-App-Konfiguration:** Alle Räume, Geräte, Lichtgruppen, Metriken und eigenen Seiten lassen sich direkt im Browser über einen grafischen Editor anpassen – ganz ohne YAML-Dateien.
- **Intelligente Live-Suche & Seiten-Steuerung:** Durchsucht alle Tabs, Labels und Entitäts-IDs in Echtzeit (mit automatischem Aufklappen, Treffer-Hervorhebung und Zähler), erlaubt 1-Klick-Raum-Unterseiten und bietet einen gesicherten Datei-Upload für eigene Raum-Hintergründe.

#### 📅 Familienkalender & Zusatzseiten
- **6 wählbare Kalender-Optiken + Live-Umschalter:** Getrennt konfigurierbar für das Home-Widget und die Kalender-Seite sowie direkt im Header umschaltbar zwischen **7-Tage-Liste**, **Kompakt-Agenda**, **Google-Kalender-Stil**, **Apple-Kalender-Stil (Split)**, **Wochen-Board (7 Spalten)** und **Monats-Kalender** (inkl. dynamischem Monats-Abruf).
- **Modulare Zusatz-Widgets:** Vorabend-Müllerinnerung (ab 17:00 Uhr), Universal Sport-Center (Fußball, NFL, NBA, NHL, Tennis, Formel 1 inkl. Live-Suche ohne API-Key), 7-Tage-Wettervorhersage und TaskMate/To-Do-Listen.

#### 📷 Kameras, Sicherheit & PIN-Schutz
- **Hybride Live-Kameras:** Nahtlose Integration von `go2rtc` (mit automatischem Pausieren außerhalb des Sichtfelds) sowie automatischer Umschaltung auf Home-Assistant-Stream und Live-Snapshot-Polling für unterwegs/Companion App.
- **Intelligentes Event-Kamera-Popup:** Öffnet bei Türklingel oder Bewegungserkennung (z. B. Frigate/AI) automatisch das Live-Kamerabild im Vollbild-Popup – inklusive wählbarem Trigger-Verhalten, Seiten-Filter (überall oder nur ausgewählte Seiten) und einstellbarer Nachlaufzeit (Hold-Time).
- **Kiosk-Modus & Serverseitiger PIN-Schutz:** Blende die Home Assistant Seitenleiste aus und schütze Editor, Systemlinks, Kiosk-Exit oder Türschlösser (inkl. Akku-Anzeige) mit einer PIN, die im Backend per SHA-256-Hash geprüft wird.
- **Fenster- & Tür-Offen-Timer:** Live-Timer geöffneter Fenster/Türen mit automatischer Auskühlungswarnung bei kalter Außenluft.

#### ⚡ Energie, Klima & Smart-Home-Steuerung
- **Interaktive Verlaufs-Popups:** Jedes Diagramm (Metriken, Raumklima, benutzerdefinierte Statistiken) lässt sich antippen und bietet eine detaillierte 24h- sowie 7-Tage-Großansicht mit Höchst-, Tiefst- und Durchschnittswerten sowie Vergleichslinien zum Vortag/Vorwoche.
- **Energie-Suite & Haushalt:** Speicher-Restlaufzeit- & Ladeprognose, Autarkiegrad-Anzeige, dynamische Strompreise (Tibber / EPEX Spot), Wallbox/E-Auto-Kachel, Haushaltsgeräte-Monitor (Waschmaschine, Trockner, Spülmaschine) und 60-Minuten-Regenradar.
- **Detail-Popups & Konfigurierbare Klima-Kacheln:** Feinsteuerung für Lichter (Helligkeit, Farbtemperatur, RGB, Effekte, Gruppenschalter-Ausnahmen), Medienplayer, Rolläden und Klimaanlagen.

---

### 🚀 Installation via HACS (Empfohlen)

1. Öffne **HACS** in deinem Home Assistant.
2. Klicke oben rechts auf die **drei Punkte** ⋮ und wähle **Benutzerdefiniertes Repository hinzufügen** (*Custom repositories*).
3. Füge die URL dieses GitHub-Repositories ein:  
   `https://github.com/KhaosRipper/HA-SmartHome-Hub`
4. Wähle als Kategorie **Integration** aus und klicke auf **Hinzufügen**.
5. Suche in HACS nach **Smart Home Hub**, klicke darauf und wähle **Herunterladen**.
6. **Starte Home Assistant einmal neu** (*Einstellungen → System → Neustart*).

---

### ⚙️ Erste Schritte & Einrichtung

1. Gehe nach dem Neustart auf **Einstellungen** → **Geräte & Dienste** → **Integration hinzufügen**.
2. Suche nach **Smart Home Hub** und füge die Integration hinzu.
3. In deiner linken Home Assistant Seitenleiste taucht nun der neue Menüpunkt auf.
4. Klicke im Dashboard unten links auf deine **Profil-Kachel** (bzw. das Popover-Menü), um den **Dashboard-Konfigurator** zu öffnen.
5. Nutze im Tab *System & Backup* entweder den **Auto-Discovery-Button**, um deine HA-Räume automatisch einzulesen, oder lade das mitgelieferte **Timo-Preset** als Startvorlage.

---

### 🏠 Als Standard-Dashboard festlegen (Browser & Companion App)

Damit der **Smart Home Hub** beim Öffnen von Home Assistant (und in der Companion App auf dem Wand-Tablet/Smartphone) direkt als Standard-Startseite geladen wird, lege ein neues Lovelace-Dashboard an und binde das Panel im **Raw-Konfigurationseditor** ein:

1. Gehe in Home Assistant auf **Einstellungen** → **Dashboards** → **Dashboard hinzufügen** (unten rechts) → **Neues Dashboard von Grund auf**.
2. Vergib einen Namen (z. B. *Smart Home Hub*) und klicke auf **Erstellen**.
3. Öffne das neu erstellte Dashboard in der Seitenleiste, klicke oben rechts auf das **Stift-Symbol** (Dashboard bearbeiten) → **drei Punkte `⋮`** → **Raw-Konfigurationseditor**.
4. Ersetze den vorhandenen Inhalt komplett durch folgende Konfiguration und klicke auf **Speichern**:

```yaml
views:
  - title: Home
    path: hub
    panel: true
    cards:
      - type: iframe
        url: /smarthome_hub_static/index.html
        aspect_ratio: 100%
```

5. Gehe anschließend zurück zu **Einstellungen** → **Dashboards**, wähle das neue Dashboard aus und klicke auf **Als Standard festlegen** (bzw. wähle es in der Home Assistant Companion App unter *Einstellungen → Companion App → Standard-Dashboard* aus).

---

## 🇬🇧 English

A modern, modular, and highly customizable Smart Home Dashboard for Home Assistant in a sleek dark design – **fully bilingual (German & English)** with automatic Home Assistant language detection.

### ✨ Features

#### 🎨 Interface, Layout & Multilingual Support
- **Fully Bilingual (DE / EN):** Automatically adapts to your Home Assistant profile language by default (`de*` → German, all other languages → English) and can be manually overridden globally or per device in the configurator.
- **Modern User Interface:** Cleanly structured home view with an integrated room banner, live camera feed, dynamic header badges, and quick-action pills.
- **Flexible Grid & Quick-Edit:** Choose between asymmetric column layouts (e.g., 70/30, 65/35, 50/50) or a free 12-column grid, and rearrange cards directly via Quick-Edit mode.
- **Modern Profile Popover Menu:** Floating glassmorphism menu at the bottom of the sidebar for Quick-Edit, Fullscreen/Kiosk mode, and the Configurator.
- **12 Design Presets & Customization:** Switchable color and theme presets (e.g., *Midnight Purple*, *OLED Pure Black*, *Nordic Frost*, *Cyber Neon*) along with custom border radii, density levels, and banner text colors.
- **Local Device Profiles & OLED Screensaver:** Device-specific start views and language overrides (e.g., hallway wall tablet, office tablet, or PC), automatic return after inactivity, and a minimalist clock/weather screensaver for burn-in protection.

#### 🛠️ Visual No-Code Configurator
- **100% In-App Configuration:** Customize all rooms, devices, light groups, metrics, and custom pages directly in your browser using a graphical editor – completely without YAML files.
- **Smart Live Search & Page Management:** Searches across all tabs, labels, and entity IDs in real time (with automatic section expansion, match highlighting, and hit counter), supports 1-click room subpages, and includes secure file uploads for custom room backgrounds.

#### 📅 Family Calendar & Extra Pages
- **6 Selectable Calendar Styles + Live Switcher:** Independently configurable for the home widget and the full calendar page, plus a live header switcher between **7-Day List**, **Compact Agenda**, **Google Calendar Style**, **Apple Calendar Style (Split)**, **Week Board (7 Columns)**, and **Month Calendar** (with dynamic month fetching).
- **Modular Add-on Widgets:** Evening waste collection reminder (from 5:00 PM), Universal Sports Center (Soccer, NFL, NBA, NHL, Tennis, Formula 1 with live search and no API key required), 7-day weather forecast, and TaskMate/To-Do lists.

#### 📷 Cameras, Security & PIN Protection
- **Hybrid Live Cameras:** Seamless integration of `go2rtc` (automatically pausing streams outside the viewport) with automatic fallback to Home Assistant streams and live snapshot polling for mobile/Companion App use.
- **Smart Event Camera Popup:** Automatically opens the live camera feed in a fullscreen popup upon doorbell rings or motion/AI detection (e.g., Frigate) – including selectable trigger behavior, page filters (everywhere or selected pages only), and configurable hold time.
- **Kiosk Mode & Server-Side PIN Protection:** Hide the Home Assistant sidebar and protect the editor, system links, kiosk exit, or door locks (including battery level badges) with a PIN verified on the backend via SHA-256 hash.
- **Window & Door Open Timer:** Live duration timers for open windows/doors with automatic cooling warnings when outdoor temperatures drop.

#### ⚡ Energy, Climate & Smart Home Control
- **Interactive History Popups:** Tap any chart (metrics, room climate, custom statistics) to open a high-resolution 24h and 7-day view with min, max, and average values plus comparison lines for the previous day/week.
- **Energy Suite & Household:** Battery remaining runtime & charge forecast, self-sufficiency display, dynamic electricity pricing (Tibber / EPEX Spot), EV wallbox card, household appliance monitor (washing machine, dryer, dishwasher), and 60-minute rain radar.
- **Detail Popups & Configurable Climate Cards:** Fine-grained controls for lights (brightness, color temperature, RGB, effects, group switch exclusions), media players, covers/blinds, and climate/AC units.

---

### 🚀 Installation via HACS (Recommended)

1. Open **HACS** in your Home Assistant instance.
2. Click the **three dots** ⋮ in the top-right corner and select **Custom repositories**.
3. Enter the URL of this GitHub repository:  
   `https://github.com/KhaosRipper/HA-SmartHome-Hub`
4. Select **Integration** as the category and click **Add**.
5. Search for **Smart Home Hub** in HACS, open it, and click **Download**.
6. **Restart Home Assistant** (*Settings → System → Restart*).

---

### ⚙️ Getting Started & Setup

1. After restarting, go to **Settings** → **Devices & Services** → **Add Integration**.
2. Search for **Smart Home Hub** and add the integration.
3. A new entry will appear in your left Home Assistant sidebar.
4. Click your **Profile Tile** (or popover menu) at the bottom left of the dashboard to open the **Dashboard Configurator**.
5. In the *System & Backup* tab, either click the **Auto-Discovery** button to import your Home Assistant areas automatically or load the included **Timo Preset** as a starting template.

---

### 🏠 Set as Default Dashboard (Browser & Companion App)

To load **Smart Home Hub** directly as your default start screen when opening Home Assistant (and in the Companion App on wall tablets/smartphones), create a new Lovelace dashboard and embed the panel via the **Raw configuration editor**:

1. In Home Assistant, go to **Settings** → **Dashboards** → **Add Dashboard** (bottom right) → **New dashboard from scratch**.
2. Enter a name (e.g., *Smart Home Hub*) and click **Create**.
3. Open the newly created dashboard from the sidebar, click the **Pencil icon** (Edit dashboard) in the top right → **three dots `⋮`** → **Raw configuration editor**.
4. Replace the entire existing content with the following configuration and click **Save**:

```yaml
views:
  - title: Home
    path: hub
    panel: true
    cards:
      - type: iframe
        url: /smarthome_hub_static/index.html
        aspect_ratio: 100%
```

5. Return to **Settings** → **Dashboards**, select your new dashboard, and click **Set as default** (or select it in the Home Assistant Companion App under *Settings → Companion App → Default dashboard*).

---

## 📸 Screenshots

### 1. Haupt-Dashboard / Main Dashboard
<img width="1902" height="916" alt="image" src="https://github.com/user-attachments/assets/83f6a311-c3b4-4c76-82cc-54570f1def57" />

*Haupt-Dashboard mit Hero-Banner, Raumauswahl, Live-Badges, Gerätesteuerung und Metrik-Kacheln. / Main dashboard with hero banner, room selector, live badges, device controls, and metric cards.*

### 2. Visueller In-App-Konfigurator / Visual In-App Configurator
<img width="1651" height="197" alt="image" src="https://github.com/user-attachments/assets/270c21ac-e5bd-436f-9f85-d06247c69cca" />

<img width="1094" height="873" alt="image" src="https://github.com/user-attachments/assets/ec5d5524-1e55-4c2a-85eb-2a06f4f39bf2" />

*Grafischer No-Code-Editor mit Live-Suche für Räume, Geräte, Kalender-Optiken, Kamera-Popups, Metrik-Kacheln und Design-Presets. / Graphical no-code editor with live search for rooms, devices, calendar styles, camera popups, metric cards, and design presets.*

### 3. Interaktives Wetter-Popup / Interactive Weather Popup
<img width="769" height="480" alt="image" src="https://github.com/user-attachments/assets/936a94ad-a466-42c4-ac95-0e52c7248444" />
<img width="773" height="479" alt="image" src="https://github.com/user-attachments/assets/6a9bb0de-e150-4c50-8f06-666bcb926781" />
<img width="779" height="437" alt="image" src="https://github.com/user-attachments/assets/895a221a-45d1-496f-b139-79166a8e308c" />
<img width="354" height="336" alt="image" src="https://github.com/user-attachments/assets/051f5149-3de1-4317-b472-bfc8ad122a24" />
<img width="351" height="460" alt="image" src="https://github.com/user-attachments/assets/6051db07-abd1-47db-bbb5-eea885c90c82" />

*7-Tage-Vorhersage mit 3-Stunden-Intervallen für Temperatur, Niederschlag und Windrichtung. / 7-day forecast with 3-hour intervals for temperature, precipitation, and wind direction.*

### 4. Detail-Verläufe & Chart-Popup / Detailed History & Chart Popup
<img width="739" height="555" alt="image" src="https://github.com/user-attachments/assets/5a4ecf4d-8125-49c3-9f1f-4d7853ec3a7d" />

*Jedes Verlaufsdiagramm lässt sich für eine hochauflösende 24h- / 7-Tage-Vergleichsansicht inklusive Extremwerten antippen. / Tap any history chart for a high-resolution 24h / 7-day comparison view including min/max values.*

---

## 🙏 Danksagung & Inspiration / Acknowledgements & Inspiration

- **Familie & Freunde / Family & Friends:** Ein großes Dankeschön an meine Familie und Freunde für die vielen Ideen, Inspirationen und das geduldige Testen im Alltag. / A huge thank you to my family and friends for all the ideas, inspiration, and patient everyday testing.
- **Entwicklung / Development:** Erstellt und maßgeschneidert für Home Assistant mit Unterstützung von KI. / Built and tailored for Home Assistant with AI assistance.

---

## 📄 Lizenz / License

Dieses Projekt ist unter der [MIT License](LICENSE) lizenziert. / This project is licensed under the [MIT License](LICENSE).

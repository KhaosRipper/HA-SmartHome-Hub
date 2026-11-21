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

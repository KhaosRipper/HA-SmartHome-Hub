# Smart Home Hub für Home Assistant

Ein modernes, modulares und hochgradig anpassbares Smart-Home-Dashboard für Home Assistant im edlen Dark-Design. 

<img width="1904" height="919" alt="image" src="https://github.com/user-attachments/assets/8abafa1d-00f6-407a-9819-97320b0304fd" />

---

## ✨ Features

- **Moderne Benutzeroberfläche:** Übersichtlich strukturierte Startseite (Dashboard) mit integriertem Hero-Hintergrund, Live-Kamera und Schnellstart-Pillen.
- **Visueller In-App-Konfigurator:** Alle Räume, Entitäten, Metriken und Design-Farben lassen sich direkt im Browser über einen grafischen Editor anpassen – ganz ohne mühsames Bearbeiten von YAML-Dateien.
- **Interaktive Verlaufs-Popups:** Jedes Diagramm (Metriken, Raumklima, benutzerdefinierte Statistiken) lässt sich antippen und bietet eine detaillierte 24h- sowie 7-Tage-Großansicht mit automatischen Höchst-, Tiefst- und Durchschnittswerten sowie Vergleichslinien zum Vortag/Vorwoche.
- **Konfigurierbare Klima-Kacheln:** Frei belegbare Kacheln für Betriebsmodus, Lüfterstufen oder eigene Helfer (z. B. `climate.*`, `fan.*`, `switch.*`, `select.*`) – global oder individuell pro Raum einstellbar.
- **In-App Datei-Upload:** Lade eigene Hintergrundbilder für deine Räume direkt hoch; sie werden automatisch im Home-Assistant-Dateisystem gespeichert.
- **Kiosk-Modus & PIN-Schutz:** Blende die originale Home Assistant Seitenleiste aus (Vollbild) und schütze den Editor, Systemlinks oder das Entriegeln von Haustüren mit einer PIN.
- **WebRTC & Live-Kameras:** Nahtlose Integration von `go2rtc` (mit ressourcensparendem automatischem Pausieren außerhalb des Sichtfelds) sowie native HA-Kamerastreams und Lightbox-Großansicht.
- **Modulare Zusatzseiten:** Integrierte Widgets für 7-Tage-Wettervorhersage (stündliche Kurven für Temperatur, Wind & Regen), Familienkalender, Abfallkalender, TaskMate/To-Do-Listen und Statistiken.

---

## 🚀 Installation via HACS (Empfohlen)

1. Öffne **HACS** in deinem Home Assistant.
2. Klicke oben rechts auf die **drei Punkte** ⋮ und wähle **Benutzerdefiniertes Repository hinzufügen** (*Custom repositories*).
3. Füge die URL dieses GitHub-Repositories ein:  
   `https://github.com/KhaosRipper/HA-SmartHome-Hub`
4. Wähle als Kategorie **Integration** aus und klicke auf **Hinzufügen**.
5. Suche in HACS nach **Smart Home Hub**, klicke darauf und wähle **Herunterladen**.
6. **Starte Home Assistant einmal neu** (*Einstellungen → System → Neustart*).

---

## ⚙️ Erste Schritte & Einrichtung

1. Gehe nach dem Neustart auf **Einstellungen** → **Geräte & Dienste** → **Integration hinzufügen**.
2. Suche nach **Smart Home Hub** und füge die Integration hinzu.
3. In deiner linken Home Assistant Seitenleiste taucht nun der neue Menüpunkt auf.
4. Klicke im Dashboard unten links auf das **Zahnrad-Symbol**, um den Konfigurator zu öffnen.
5. Nutze im Tab *Import / Backup* entweder den **Auto-Discovery-Button**, um deine HA-Räume automatisch einzulesen, oder lade das mitgelieferte **Timo-Preset** als Startvorlage.

---

## 📸 Screenshots

### 1. Das Haupt-Dashboard
<img width="1903" height="918" alt="image" src="https://github.com/user-attachments/assets/99688995-4f24-4773-b818-350483a084ec" />

*Haupt-Dashboard mit Hero-Banner, Raumauswahl, Live-Badges, Gerätesteuerung und Metrik-Kacheln.*

### 2. Der visuelle In-App-Konfigurator
<img width="1054" height="806" alt="image" src="https://github.com/user-attachments/assets/82f2b70c-2a88-432a-a6bb-f66d981c015d" />

*Grafischer Editor für Räume, Geräte, Wetter-Details, Metrik-Kacheln und Themes.*

### 3. Das interaktive Wetter-Popup
<img width="897" height="584" alt="image" src="https://github.com/user-attachments/assets/43348db7-1ba6-4c5c-812a-e4719b6e3072" />

*7-Tage-Vorhersage mit 3-Stunden-Intervallen für Temperatur, Niederschlag und Windrichtung.*

### 4. Detail-Verläufe & Chart-Popup
<!-- Hier kannst du bei Gelegenheit einen Screenshot deines neuen Chart-Großansichts-Popups einfügen -->
*Jedes Verlaufsdiagramm lässt sich für eine hochauflösende 24h- / 7-Tage-Vergleichsansicht inklusive Extremwerten antippen.*

---

## 🙏 Danksagung & Inspiration

- **UI/UX Design:** Dieses Dashboard ist visuell inspiriert und abgewandelt von dem Konzept ["Smart Home Dashboard UI/UX IoT Control Panel" auf Dribbble](https://dribbble.com/shots/27413660-Smart-Home-Dashboard-UI-UX-IoT-Control-Panel).
- **Entwicklung:** Erstellt und maßgeschneidert für Home Assistant mit Unterstützung von KI.

---

## 📄 Lizenz
Dieses Projekt ist unter der [MIT License](LICENSE) lizenziert.

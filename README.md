# Smart Home Hub für Home Assistant

Ein modernes, modulares und hochgradig anpassbares Smart-Home-Dashboard für Home Assistant im edlen Dark-Design. 

<img width="1904" height="919" alt="image" src="https://github.com/user-attachments/assets/8abafa1d-00f6-407a-9819-97320b0304fd" />


---

## ✨ Features

- **Moderne Benutzeroberfläche:** Übersichtlich strukturierte Startseite (Dashboard) mit integriertem Hero-Hintergrund, Live-Kamera und Schnellstart-Pillen.
- **Visueller In-App-Konfigurator:** Alle Räume, Entitäten, Metriken und Design-Farben lassen sich direkt im Browser über einen grafischen Editor anpassen (kein mühsames Bearbeiten von YAML-Dateien nötig).
- **In-App Datei-Upload:** Lade eigene Hintergrundbilder für deine Räume direkt hoch, sie werden automatisch im Home-Assistant-Verzeichnis gespeichert.
- **Kiosk-Modus & PIN-Schutz:** Blende die originale Home Assistant Seitenleiste aus (Vollbild) und schütze den Editor, Systemlinks oder das Entriegeln von Haustüren mit einer PIN.
- **WebRTC & Live-Kameras:** Nahtlose Integration von `go2rtc` (mit automatischem Pausieren außerhalb des Sichtfelds) sowie native HA-Kamerastreams und Lightbox-Ansicht.
- **Modulare Zusatzseiten:** Integrierte Widgets für Wettervorhersage (7 Tage mit stündlichen Temperatur-, Wind- und Niederschlags-Diagrammen), Familienkalender, Abfallkalender, TaskMate/To-Do-Listen und Statistiken.

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
3. In deiner linken Seitenleiste taucht nun der neue Menüpunkt auf.
4. Klicke im Dashboard unten links auf das **Zahnrad (⚙️)**, um den Konfigurator zu öffnen.
5. Nutze im Tab *Import / Backup* entweder den **Auto-Discovery-Button**, um deine HA-Räume automatisch einzulesen, oder lade das mitgelieferte **Timo-Preset** als Startvorlage.

---

## 📸 Screenshots

*(Füge hier passende Screenshots ein, um dein Dashboard zu präsentieren)*

### 1. Das Haupt-Dashboard
<img width="1903" height="918" alt="image" src="https://github.com/user-attachments/assets/99688995-4f24-4773-b818-350483a084ec" />

*(Beschreibung: Zeigt das Haupt-Dashboard mit Hero-Banner, Raum-Auswahl, Kacheln und Header-Badges)*

### 2. Der visuelle In-App-Konfigurator
<img width="1054" height="806" alt="image" src="https://github.com/user-attachments/assets/82f2b70c-2a88-432a-a6bb-f66d981c015d" />

*(Beschreibung: Zeigt den visuellen Editor mit Tabs für Räume, Geräte, Wetter und Metriken)*

### 3. Das interaktive Wetter-Popup
<img width="897" height="584" alt="image" src="https://github.com/user-attachments/assets/43348db7-1ba6-4c5c-812a-e4719b6e3072" />

*(Beschreibung: Zeigt das Popup mit Temperatur-, Wind- und Niederschlags-Verlauf)*

---

## 🙏 Danksagung & Inspiration

* **UI/UX Design:** Dieses Dashboard ist visuell inspiriert und abgewandelt von dem wunderbaren Konzept ["Smart Home Dashboard UI/UX IoT Control Panel" auf Dribbble](https://dribbble.com/shots/27413660-Smart-Home-Dashboard-UI-UX-IoT-Control-Panel).
* **Entwicklung:** Der Code, die Integration und die Logik dieses Projekts wurden mit Unterstützung von KI erstellt und für Home Assistant maßgeschneidert.

---

## 📄 Lizenz
Dieses Projekt ist unter der [MIT License](LICENSE) lizenziert.

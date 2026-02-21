# CheckIt!

**Dein digitaler Schulplaner als Progressive Web App**

CheckIt! ist ein digitaler Aufgabenplaner für Schülerinnen und Schüler am Gymnasium.
Alle Daten bleiben lokal im Browser gespeichert – nichts wird auf einen Server hochgeladen.

> **[CheckIt! öffnen](https://mrckurz.github.io/checkIt/)**

---

## Features

| Feature | Beschreibung |
|---------|-------------|
| **Aufgaben** | Hausübungen, Lernen, Tests, Haushalt und mehr verwalten |
| **Prioritäten** | Hoch, Mittel, Niedrig – damit du weißt, was zuerst dran ist |
| **Kalender** | Monatsansicht mit farbigen Markierungen für fällige Aufgaben |
| **Erinnerungen** | Browser-Benachrichtigungen vor Fälligkeit |
| **Offline** | Funktioniert ohne Internetverbindung (PWA) |
| **Installierbar** | Auf dem Handy als App installierbar |

### Weitere Features

- Zweisprachig: Deutsch & Englisch
- Dark Mode: Helles, dunkles und System-Design
- Datenschutz: Alle Daten bleiben im Browser (IndexedDB)
- Suche und Filter nach Kategorie, Priorität und Status

---

## Tech Stack

| Technologie | Einsatz |
|-------------|---------|
| [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org/) | UI-Framework |
| [Vite](https://vite.dev) | Build Tool & Dev Server |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling |
| [Dexie.js](https://dexie.org/) | IndexedDB-Wrapper für lokale Speicherung |
| [date-fns](https://date-fns.org/) | Datumsformatierung & -berechnung |
| [Lucide React](https://lucide.dev/) | Icons |
| [Zustand](https://zustand.docs.pmnd.rs/) | State Management |
| [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) | Service Worker & Web App Manifest |
| [react-i18next](https://react.i18next.com/) | Internationalisierung (DE/EN) |
| [React Router](https://reactrouter.com/) | Client-seitiges Routing |
| [Vitest](https://vitest.dev/) | Unit Testing |

---

## Lokale Entwicklung

### Voraussetzungen

- [Node.js](https://nodejs.org/) >= 18
- npm >= 9

### Setup

```bash
git clone https://github.com/mrckurz/checkIt.git
cd checkIt
npm install
npm run dev
```

Die App ist dann unter `http://localhost:5173/checkIt/` erreichbar.

### Build

```bash
npm run build
```

---

## Tests

```bash
npm test           # Tests einmalig ausführen
npm run test:watch # Tests im Watch-Modus
```

---

## Deployment

Automatisch via **GitHub Actions** auf **GitHub Pages** bei jedem Push auf `main`.

---

## Lizenz

[MIT](LICENSE) – Copyright (c) 2026 FH-Prof. DI Dr. Marc Kurz

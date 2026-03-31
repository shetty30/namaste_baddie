# 💅 Namaste Baddie

> Pick a mood. Get one move. Start now.

A **desi-maximalist productivity app** built for people who overthink, under-start, and need a vibe check before they can do anything.

Not a planner.
Not a habit tracker.
Not another boring productivity tool.

This is a **mood-based action launcher** — available on desktop (Windows/Mac/Linux) and mobile (PWA).

---

## Features

### Mood Timer
Pick how you're actually feeling right now. The app gives you a tone, a timer, and one job.

| Mood | Vibe | Timers |
|------|------|--------|
| 😴 Lazy | Do the smallest version. Abhi. | 2, 5, 10 min |
| 😵 Overwhelmed | One thing. Bas. Nothing else. | 5, 10, 25 min |
| 😶 Can't Start | Starting first. Feelings later. | 5, 10 min |
| 😒 Bored | Fine. Make something useful. | 5, 10, 20 min |

Complete a session → earn points → level up.

### Points & Levels
Every minute you focus earns you 1 point. Progress through 6 levels:

`Beginner Baddie` → `Rising Baddie` → `Focused Baddie` → `Power Baddie` → `Elite Baddie` → `Legend Baddie`

### Streak Tracker
Come back every day to keep your streak alive. Miss a day and it resets.

### Deep Focus Mode
Open-ended focus timer with no fixed end time. Clock keeps running until you stop it. Full points awarded.

### Mini Games (Focus Breaks)
Three built-in games to reset your brain between sessions:

- **Memory** — flip cards, find matching emoji pairs
- **Reaction** — tap when the screen turns green. Average reaction time tracked over 5 rounds
- **Breathe** — guided 4-4-4-4 box breathing exercise

### Notes
Quick personal notes with color labels. Create, edit, delete. Persists locally.

### Daily Fuel (Quotes)
Mood-matched motivational quotes in the same Hinglish tone as the app. 6 quotes per mood, cycling on tap.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) (v18 or later)
- npm

### Install & Run

```bash
# Clone the repo
git clone https://github.com/shetty30/namaste_baddie.git
cd namaste_baddie

# Install dependencies
npm install

# Run the app
npm start
```

---

## Build for Desktop

Generates your app icon and packages a distributable.

```bash
npm run dist
```

Output is in the `dist/` folder.

| Platform | Command | Output |
|----------|---------|--------|
| Windows | `npm run dist:win` | `dist/Namaste Baddie-x.x.x-win.zip` |
| Mac | `npm run dist:mac` | `dist/Namaste Baddie-x.x.x.dmg` |
| Linux | `npm run dist:linux` | `dist/Namaste Baddie-x.x.x.AppImage` |

Unzip (Windows) or open the installer → the app installs like any other desktop app.

---

## Install on Mobile (PWA)

The app is a fully offline-capable Progressive Web App. No app store needed.

**Step 1** — Host it (free):
- Push to GitHub → go to **Settings → Pages** → set branch to `main`, folder to `/ (root)` → Save
- Your URL: `https://<your-username>.github.io/namaste_baddie/`

**Step 2** — Install on phone:
- **Android** → open Chrome → visit the URL → tap ⋮ menu → **Add to Home Screen**
- **iPhone** → open Safari → visit the URL → tap Share → **Add to Home Screen**

It will appear on your home screen with the app icon and run fullscreen like a native app. Works offline after the first load.

---

## Project Structure

```
namaste-baddie/
├── main.js              # Electron main process
├── preload.js           # Electron preload (storage bridge)
├── index.html           # Root redirect (for GitHub Pages)
├── package.json         # Scripts + electron-builder config
├── scripts/
│   └── gen-icons.js     # Generates app icons (no dependencies)
├── build/
│   └── icon.png         # 512×512 icon for electron-builder
├── data/
│   └── sessions.json    # Local session storage (desktop)
└── src/
    ├── namaste_baddie_v2.html  # The entire app (single file)
    ├── manifest.json           # PWA manifest
    ├── sw.js                   # Service worker (offline support)
    └── assets/
        ├── icon-192.png        # PWA icon
        └── icon-512.png        # PWA icon
```

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Desktop shell | Electron |
| Frontend | Vanilla HTML/CSS/JS (single file, no framework) |
| Storage (desktop) | Node.js `fs` via Electron preload |
| Storage (web) | `localStorage` |
| Fonts | Playfair Display, Syne, DM Sans, DM Mono |
| Packaging | electron-builder |
| Mobile | PWA — manifest + service worker |

---

## Scripts

| Command | What it does |
|---------|-------------|
| `npm start` | Run the app in Electron |
| `npm run icons` | Generate app icons from code (no Photoshop needed) |
| `npm run dist` | Build desktop app for current platform |
| `npm run dist:win` | Build for Windows |
| `npm run dist:mac` | Build for Mac |
| `npm run dist:linux` | Build for Linux |

---

## Data & Privacy

Everything stays on your device. No accounts, no cloud sync, no tracking.

- **Desktop:** sessions saved to `data/sessions.json`
- **Web/PWA:** data stored in browser `localStorage`

Clearing browser data or uninstalling the app removes everything.

---

*Built with chai, spite, and the belief that starting badly is still starting.*

# TimeBoxer

TimeBoxer is a lightweight Electron + React desktop app for time blocking and focused planning. Everything is stored locally (via `localStorage` inside the renderer), so no account or network is required.

## Getting started

```bash
npm install
npm run dev # starts Vite + Electron
```

The dev script spins up Vite on port `5173` and launches Electron once the renderer is ready. Use `npm run build` followed by `npm start` to run the production renderer inside Electron after bundling.

> **Note**: Packaging installers is outside of this example, but tools like `electron-builder` can be added easily.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Runs Vite and Electron side by side for live development |
| `npm run build` | Builds the renderer using Vite |
| `npm start` | Starts Electron in production mode using the built renderer |

## Architecture overview

- **Electron shell** (`electron/main.js`) bootstraps a `BrowserWindow` and loads the Vite dev server or the production `dist/index.html`.
- **React + Vite** live in `src/`. The UI uses Tailwind CSS for styling and `react-beautiful-dnd` for drag-and-drop interactions.
- **State management** is powered by Zustand (`src/store/useTimeboxStore.ts`). The store keeps tasks, per-day schedules, and the selected date. Zustand's `persist` middleware stores the entire tree inside `localStorage` for a local-only experience.
- **Drag & drop**: tasks in the to-do list can be dragged into the hourly timeline. Existing blocks can also be dragged between time slots to reposition them.
- **Persistence**: because the state is stored with `localStorage`, every change (tasks, schedules, analytics inputs) is automatically saved.
- **Analytics** are computed on the fly (`src/utils/analytics.ts`) for the currently selected day and surfaced in the `AnalyticsPanel`.

## Feature highlights

- Maintain a categorized to-do list (Work / Personal / Urgent) with drag-and-drop onto the day view.
- Resizable / movable blocks in a simple hourly lane with visual category cues.
- Quick controls to mark blocks as completed, pending, or carry unfinished work to the next day.
- One-click carry-forward button to duplicate unfinished blocks onto tomorrow while marking today’s blocks as `carriedForward`.
- Real-time analytics: total hours scheduled, completed hours, completion counts, and a friendly productivity insight.

## Data model

- `Task` – global to-do items with category metadata.
- `DaySchedule` – stores the blocks scheduled for a specific ISO date.
- `Block` – links a task to a start/end time, status, and optional `carriedFromDate` metadata.

All of this state lives in the persisted Zustand store and is serialized to a single JSON blob in `localStorage`.

# Graham Scan Visualizer

An interactive PixiJS + TypeScript demo for exploring the Graham scan convex hull algorithm.

The app renders a set of wall endpoints as draggable points, computes their convex hull in real time, and shows a split-screen comparison between the original footprint and the hull result.

## Features

- Interactive convex hull visualization built with `pixi.js`
- Multiple preset scenarios to load from a level-selection menu
- Drag wall endpoints to new positions and recompute the hull instantly
- Split-view comparison with a draggable divider:
  - **Before**: bounding rectangle / original occupied area
  - **After**: convex hull polygon
- Hull vertices are highlighted and numbered in traversal order
- Points snap to a 50px grid while dragging

## How it works

Each scenario is defined as a list of wall segments. The application:

1. Collects the wall endpoints as points.
2. Finds the lowest point as the starting anchor.
3. Sorts the remaining points by polar angle.
4. Builds the convex hull by removing points that create a right turn.
5. Draws the resulting hull polygon and highlights the points that belong to it.

The hull logic lives in [src/main.ts](src/main.ts).

## Getting started

### Requirements

- Node.js 18+
- `pnpm`

### Install

```bash
pnpm install
```

### Start the development server

```bash
pnpm dev
```

Then open the local URL shown by Vite in your browser.

### Build for production

```bash
pnpm build
```

### Preview the production build

```bash
pnpm preview
```

## Available scripts

- `pnpm dev` — run the Vite development server
- `pnpm build` — type-check and build the project
- `pnpm preview` — preview the production bundle
- `pnpm check` — run Biome checks
- `pnpm check:fix` — run Biome checks and apply fixes
- `pnpm lint` — run ESLint

## Controls

- **Drag a point** — move a wall endpoint
- **Drag the vertical divider** — compare the before/after views
- **Esc** — return to the scenario menu
- **R** — reset the current scenario

## Project structure

- [src/main.ts](src/main.ts) — application setup, scene management, interaction logic, and Graham scan implementation
- [public/style.css](public/style.css) — global page styles
- [index.html](index.html) — app entry HTML

## Tech stack

- TypeScript
- Vite
- PixiJS
- Biome
- ESLint

## Notes

- The canvas is scaled responsively to fit the browser window.
- The default startup path currently opens one of the predefined scenarios automatically.
- All gameplay and visualization logic is contained in a single entry file, which makes the project easy to explore and refactor.

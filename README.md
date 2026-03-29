# UI Automation practice (Playwright + Vite/React)

This repo contains:
- `app/`: a small demo web app (DemoShop) designed for stable UI automation
- `tests/`: Playwright tests + simple Page Objects

## Prerequisites
- Node.js + npm installed

## Install
From the repo root:

```bash
npm i
cd app
npm i
```

## Run the app

```bash
npm run dev
```

Then open `http://localhost:5173`.

Test accounts:
- `user / user123`
- `admin / admin123`

## Run Playwright tests
Playwright is configured with a `webServer`, so it will start the Vite dev server automatically.

Headless:

```bash
npm run test:e2e
```

UI mode:

```bash
npm run test:e2e:ui
```

Open the last HTML report:

```bash
npm run report
```


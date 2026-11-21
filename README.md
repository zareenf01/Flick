# Flick

Flick turns a link to your web app into a product walkthrough. You paste a URL and say what to show. An agent opens the app in a real browser, clicks through the flow, and records every step with the exact position of what it clicked. Flick then builds a smooth walkthrough from that run, with a gliding cursor, camera zooms that follow the action and captions for each step.

One run gives you three things: an interactive demo people can click through, an MP4 video, and a written step-by-step guide.

## Status

Early development. Project setup is done; sign up and login come next.

## Layout

```
flick/
  frontend/   Next.js app: pages, components, styles
  backend/    Hono API server, database, worker
```

The two are npm workspaces in one repo. In development the frontend forwards every `/api/*` request to the backend, so the browser only talks to one origin and session cookies stay first-party.

## Stack

- Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS
- Backend: Hono on Node, TypeScript, zod, pino
- Database: PostgreSQL 17 with Drizzle ORM and SQL migrations
- Accounts, sessions, job queue and live updates are built on our own Postgres, with no outside database or auth service
- A worker process in the backend that drives Chromium with Playwright and Stagehand
- Gemini as the default model, Claude Haiku as a paid fallback

## Running locally

You need Node 20 or newer and PostgreSQL 17. On macOS with Homebrew:

```bash
brew install postgresql@17
brew services start postgresql@17
createdb flick
```

Then from the repo root:

```bash
npm install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
npm run db:migrate
npm run dev
```

`npm run dev` starts the frontend on http://localhost:3000, the backend on http://localhost:4000 and the worker. `GET /api/health` reports whether the database is reachable.

## Environment variables

Backend (`backend/.env`):

| Name                           | What it is for                                       |
| ------------------------------ | ---------------------------------------------------- |
| `PORT`                         | Port the API server listens on                       |
| `APP_URL`                      | URL of the frontend                                  |
| `DATABASE_URL`                 | Postgres connection string                           |
| `STORAGE_DIR`                  | Folder for screenshots and exported videos           |
| `LOG_LEVEL`                    | `fatal`, `error`, `warn`, `info`, `debug` or `trace` |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini API key from Google AI Studio                 |
| `ANTHROPIC_API_KEY`            | Optional paid fallback model                         |

Frontend (`frontend/.env.local`):

| Name          | What it is for                           |
| ------------- | ---------------------------------------- |
| `BACKEND_URL` | Where `/api/*` requests are forwarded to |

## Scripts

Run these from the repo root.

| Script                 | What it does                                |
| ---------------------- | ------------------------------------------- |
| `npm run dev`          | Start frontend, backend and worker together |
| `npm run dev:frontend` | Start only the frontend                     |
| `npm run dev:backend`  | Start only the backend                      |
| `npm run dev:worker`   | Start only the worker                       |
| `npm run build`        | Build both apps                             |
| `npm run lint`         | ESLint in both apps                         |
| `npm run typecheck`    | TypeScript in both apps                     |
| `npm test`             | Backend tests with Vitest                   |
| `npm run format`       | Format with Prettier                        |
| `npm run db:generate`  | Create a migration from schema changes      |
| `npm run db:migrate`   | Apply migrations                            |
| `npm run db:studio`    | Browse the database in Drizzle Studio       |

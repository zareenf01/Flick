# Flick

Flick turns a link to your web app into a product walkthrough. You paste a URL and say what to show. An agent opens the app in a real browser, clicks through the flow, and records every step with the exact position of what it clicked. Flick then builds a smooth walkthrough from that run, with a gliding cursor, camera zooms that follow the action and captions for each step.

One run gives you three things: an interactive demo people can click through, an MP4 video, and a written step-by-step guide.

## Layout

```
flick/
  frontend/   Next.js app: landing page and app screens
  server/     Hono API, database and worker
```

## Stack

- Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS, Motion
- Server: Hono on Node, TypeScript, zod, pino
- Database: PostgreSQL with Drizzle ORM
- Accounts, sessions, job queue and live updates are built on our own Postgres, with no outside database or auth service
- A worker that drives Chromium with Playwright and Stagehand

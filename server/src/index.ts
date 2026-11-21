import "./load-env.js";
import { serve } from "@hono/node-server";
import { app } from "./app.js";
import { pool } from "./db/index.js";
import { env } from "./env.js";
import { log } from "./log.js";

const server = serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  log.info({ port: info.port }, "server ready");
});

let stopping = false;

function stop(signal: string) {
  if (stopping) return;
  stopping = true;
  log.info({ signal }, "server stopping");
  server.close(() => {
    void pool.end().then(() => process.exit(0));
  });
}

process.on("SIGINT", () => stop("SIGINT"));
process.on("SIGTERM", () => stop("SIGTERM"));

import { Hono } from "hono";
import { pool } from "./db/index.js";

export const app = new Hono().basePath("/api");

app.get("/health", async (c) => {
  try {
    await pool.query("select 1");
    return c.json({ ok: true, database: "up" });
  } catch {
    return c.json({ ok: false, database: "down" }, 503);
  }
});

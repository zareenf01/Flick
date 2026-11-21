import { afterAll, describe, expect, it } from "vitest";
import { app } from "./app.js";
import { pool } from "./db/index.js";

afterAll(() => pool.end());

describe("GET /api/health", () => {
  it("reports the database as up", async () => {
    const res = await app.request("/api/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, database: "up" });
  });

  it("returns 404 for unknown routes", async () => {
    const res = await app.request("/api/nope");
    expect(res.status).toBe(404);
  });
});

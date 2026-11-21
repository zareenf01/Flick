import { describe, expect, it } from "vitest";
import { parseEnv } from "./env.js";

describe("parseEnv", () => {
  it("fills defaults", () => {
    const env = parseEnv({ DATABASE_URL: "postgres://localhost:5433/flick" });
    expect(env.PORT).toBe(4000);
    expect(env.APP_URL).toBe("http://localhost:3000");
    expect(env.STORAGE_DIR).toBe("./storage");
    expect(env.LOG_LEVEL).toBe("info");
  });

  it("reads the port as a number", () => {
    const env = parseEnv({
      DATABASE_URL: "postgres://localhost:5433/flick",
      PORT: "4100",
    });
    expect(env.PORT).toBe(4100);
  });

  it("requires a database url", () => {
    expect(() => parseEnv({})).toThrow(/DATABASE_URL/);
  });

  it("rejects a non-postgres database url", () => {
    expect(() =>
      parseEnv({ DATABASE_URL: "mysql://localhost:3306/flick" }),
    ).toThrow(/DATABASE_URL/);
  });
});

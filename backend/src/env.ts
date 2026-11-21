import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  APP_URL: z.url().default("http://localhost:3000"),
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
  STORAGE_DIR: z.string().min(1).default("./storage"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1).optional(),
  ANTHROPIC_API_KEY: z.string().min(1).optional(),
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(source: Record<string, string | undefined>): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    throw new Error(
      `Invalid environment variables\n${z.prettifyError(result.error)}`,
    );
  }
  return result.data;
}

export const env = parseEnv(process.env);

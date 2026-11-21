import "./load-env.js";
import { pool } from "./db/index.js";
import { log } from "./log.js";

const CHANNEL = "jobs";

async function main() {
  const client = await pool.connect();
  await client.query(`LISTEN ${CHANNEL}`);

  client.on("notification", (message) => {
    log.info(
      { channel: message.channel, payload: message.payload },
      "notified",
    );
  });

  let stopping = false;
  const stop = async (signal: string) => {
    if (stopping) return;
    stopping = true;
    log.info({ signal }, "worker stopping");
    client.release();
    await pool.end();
    process.exit(0);
  };

  process.on("SIGINT", () => void stop("SIGINT"));
  process.on("SIGTERM", () => void stop("SIGTERM"));

  log.info({ channel: CHANNEL }, "worker ready");
}

main().catch((error) => {
  log.fatal({ err: error }, "worker failed to start");
  process.exit(1);
});

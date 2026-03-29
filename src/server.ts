import http from "http";
import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";

const app = createApp();
const server = http.createServer(app);

/** Запуск HTTP-сервера */
server.listen(env.port, () => {
  logger.info(`${env.appName} is running on port ${env.port}`);
});

/** Graceful shutdown */
function shutdown(signal: string) {
  logger.info(`Received ${signal}. Shutting down gracefully...`);

  server.close((err) => {
    if (err) {
      logger.error({ err }, "Error during server shutdown");
      process.exit(1);
    }

    logger.info("Server shutdown complete");
    process.exit(0);
  });

  // Если через 10 секунд сервер не закрылся, принудительно завершаем процесс
  setTimeout(() => {
    logger.error("Forcing shutdown due to timeout");
    process.exit(1);
  }, 10000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "Uncaught exception");
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  logger.fatal({ reason }, "Unhandled rejection");
  process.exit(1);
});

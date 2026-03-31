import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import routes from "./routes";
import { env } from "./config/env";

import { requestIdMiddleware } from "./common/middleware/request-id";
import { notFoundMiddleware } from "./common/middleware/not-found";
import { errorHandler } from "./common/middleware/error-handler";

import { logger } from "./config/logger";
import cookieParser from "cookie-parser";

export const createApp = () => {
  const app = express();

  /** Безопасные HTTP-заголовки */
  app.use(helmet());

  app.use(cors({ origin: env.clientUrl, credentials: true }));

  /** Парсим JSON в теле запроса */
  app.use(express.json());

  /** Парсинг x-www-form-urlencoded для форм */
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  /** Добавляем уникальный requestId к каждому запросу */
  app.use(requestIdMiddleware);

  /** Логируем HTTP-запросы в dev-режиме. TODO: перенести на pino-http */
  if (!env.isProduction) {
    app.use(
      morgan("dev", {
        stream: {
          write: (message: string) => logger.info(message.trim()),
        },
      }),
    );
  }

  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: `Welcome to ${env.appName}!`,
    });
  });

  /** Регистрируем роуты */
  app.use('/api', routes);

  /** Обработка 404 - не найдено */
  app.use(notFoundMiddleware);

  /** Глобальный обработчик ошибок (должен быть последним) */
  app.use(errorHandler);

  return app;
};

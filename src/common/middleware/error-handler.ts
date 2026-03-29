import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";
import { logger } from "../../config/logger";
import { env } from "../../config/env";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const requestId = req.requestId;

  // наша "контролируемая" ошибка
  if (err instanceof AppError) {
    logger.warn(
      {
        requestId,
        method: req.method,
        url: req.originalUrl,
        statusCode: err.statusCode,
        details: err.details,
      },
      `Error message: ${err.message}`,
    );

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details ?? null,
      requestId,
    });

    return;
  }

  // непредвиденная ошибка
  logger.error(
    {
      requestId,
      method: req.method,
      url: req.originalUrl,
      err,
    },
    `Unexpected error: ${err instanceof Error ? err.message : String(err)}`,
  );

  res.status(500).json({
    success: false,
    message: env.isProduction ? "Internal server error" : String(err),
    requestId,
    stack: env.isProduction
      ? undefined
      : err instanceof Error
        ? err.stack
        : undefined,
  });
}

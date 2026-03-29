import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";

export function notFoundMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const error = new AppError(
    `Route ${req.method} ${req.originalUrl} not found`,
    404,
  );
  next(error);
}

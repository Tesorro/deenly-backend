import type { Request, Response, NextFunction } from "express";
import { env } from "../../config/env";

export class HealthController {
  /** Простой эндпоинт для проверки, что сервер жив.
   * Удобно для docker, nginx и т.д.
   */
  static getStatus(req: Request, res: Response) {
    res.status(200).json({
      status: "ok",
      success: true,
      message: "Service is running",
      environment: env.nodeEnv,
      uptime: process.uptime(),
      appName: env.appName,
      timestamp: new Date().toISOString(),
    });
  }
}

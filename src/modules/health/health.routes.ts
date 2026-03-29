import { Router } from "express";
import { HealthController } from "./health.controller";

const router = Router();

router.get("/", HealthController.getStatus);

export default router;

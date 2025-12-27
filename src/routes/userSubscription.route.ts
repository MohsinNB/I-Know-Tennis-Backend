import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getMySubscription } from "../controllers/userSubscription.controller";

const router = Router();

router.get("/my", authMiddleware, getMySubscription);

export default router;

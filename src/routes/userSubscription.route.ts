import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  buySubscription,
  getMySubscription,
} from "../controllers/userSubscription.controller";

const router = Router();

router.post("/buy", authMiddleware, buySubscription);
router.get("/my", authMiddleware, getMySubscription);

export default router;

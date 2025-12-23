import { Router } from "express";
import {
  createSubscriptionPlan,
  getAllSubscriptionPlans,
  updateSubscriptionPlan,
} from "../controllers/subscription.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/admin.middleware";

const router = Router();

router.post("/", authMiddleware, isAdmin, createSubscriptionPlan);

router.get("/", authMiddleware, getAllSubscriptionPlans);

router.put("/:planId", authMiddleware, isAdmin, updateSubscriptionPlan);

export default router;

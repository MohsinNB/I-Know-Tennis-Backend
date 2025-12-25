import { Router } from "express";
import {
  createSubscriptionPlan,
  deactivateSubscriptionPlan,
  getAllSubscriptionPlans,
  updateSubscriptionPlan,
} from "../controllers/subscription.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/admin.middleware";

const router = Router();

router.post("/", authMiddleware, isAdmin, createSubscriptionPlan);

router.get("/", authMiddleware, getAllSubscriptionPlans);

router.put("/:planId", authMiddleware, isAdmin, updateSubscriptionPlan);
router.patch(
  "/:planId/deactivate",
  authMiddleware,
  isAdmin,
  deactivateSubscriptionPlan
);

export default router;

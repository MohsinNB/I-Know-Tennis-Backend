import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createCheckoutSession } from "../controllers/stripe.controller";

const router = Router();

router.post("/checkout", authMiddleware, createCheckoutSession);

export default router;

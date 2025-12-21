import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getProfile, updateMyName } from "../controllers/profile.controller";

const router = Router();

router.get("/me", authMiddleware, getProfile);
router.patch("/me", authMiddleware, updateMyName);

export default router;

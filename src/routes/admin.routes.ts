import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getAllUsers,
  getDashboardStats,
  getLeaderboard,
} from "../controllers/admin.controller";
import { isAdmin } from "../middlewares/admin.middleware";

const router = Router();

router.get("/dashboard", authMiddleware, isAdmin, getDashboardStats);
router.get("/users", authMiddleware, isAdmin, getAllUsers);
router.get("/leaderboard", authMiddleware, isAdmin, getLeaderboard);

export default router;

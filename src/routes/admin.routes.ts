import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getAllUsers,
  getDashboardStats,
  getLeaderboard,
  getMonthWiseUserJoining,
  getQuizAttendance,
} from "../controllers/admin.controller";
import { isAdmin } from "../middlewares/admin.middleware";

const router = Router();

router.get("/dashboard", authMiddleware, isAdmin, getDashboardStats);
router.get("/users", authMiddleware, isAdmin, getAllUsers);
router.get("/leaderboard", authMiddleware, getLeaderboard);
router.get("/quiz-attendance", authMiddleware, isAdmin, getQuizAttendance);
router.get(
  "/users/month-wise",
  authMiddleware,
  isAdmin,
  getMonthWiseUserJoining
);

export default router;

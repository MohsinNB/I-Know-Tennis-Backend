import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getAllUsers,
  getDashboardStats,
} from "../controllers/admin.controller";
import { isAdmin } from "../middlewares/admin.middleware";

const router = Router();

router.get("/dashboard", authMiddleware, isAdmin, getDashboardStats);
router.get("/users", authMiddleware, isAdmin, getAllUsers);

export default router;

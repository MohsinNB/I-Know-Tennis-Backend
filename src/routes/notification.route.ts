import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getNotifications,
  getUnreadCount,
  readNotification,
  readAllNotifications,
} from "../controllers/controllers.notification";

const router = Router();

router.use(authMiddleware);

router.get("/", authMiddleware, getNotifications);
router.get("/unread-count", authMiddleware, getUnreadCount);
router.patch("/:id/read", authMiddleware, readNotification);
router.patch("/read-all", authMiddleware, readAllNotifications);

export default router;

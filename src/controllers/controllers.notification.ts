import { Request, Response } from "express";
import {
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/notification.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export const getNotifications = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId as string;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const result = await getUserNotifications(userId, page, limit);
  res.status(200).json(result);
};

export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId as string;
  const count = await getUnreadNotificationCount(userId);

  res.status(200).json({ count });
};

export const readNotification = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId as string;
  const { id } = req.params;

  const notification = await markNotificationAsRead(userId, id);
  res.status(200).json(notification);
};

export const readAllNotifications = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId as string;

  await markAllNotificationsAsRead(userId);
  res.status(200).json({ message: "All notifications marked as read" });
};

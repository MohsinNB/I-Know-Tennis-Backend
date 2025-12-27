import { Types } from "mongoose";
import { Notification, NotificationType } from "../models/notification.model";

/**
 * Generic notification sender
 * Core method – সব জায়গা থেকে ultimately এটা call হবে
 */
interface NotifyUserParams {
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, any>;
}

export const notifyUser = async ({
  recipientId,
  type,
  title,
  message,
  metadata = {},
}: NotifyUserParams): Promise<void> => {
  try {
    // 1️⃣ Always save notification in DB (source of truth)
    const notification = await Notification.create({
      recipient: new Types.ObjectId(recipientId),
      type,
      title,
      message,
      metadata,
    });

    // 2️⃣ Best-effort real-time emit (socket)
    try {
      console.log("🔔 Emitting notification to user 1:", recipientId);
      const { emitToUser } = await import("../socket/socket");
      console.log("🔔 Emitting notification to user 2:", recipientId);
      emitToUser(recipientId, notification);
    } catch (socketError) {
      // socket fail করলে ignore (side-effect)
      console.error("Socket emit failed:", socketError);
    }
  } catch (error) {
    // notification fail করলেও core flow থামবে না
    console.error("Failed to create notification:", error);
  }
};

interface LeaderboardNotificationParams {
  userId: string;
  leaderboardType: "weekly" | "monthly";
  newRank: number;
  previousRank?: number;
}

export const notifyLeaderboardRankChange = async ({
  userId,
  leaderboardType,
  newRank,
  previousRank,
}: LeaderboardNotificationParams): Promise<void> => {
  /**
   * Noise prevention rule:
   * - rank same or worse হলে notification যাবে না
   */
  if (previousRank && newRank >= previousRank) {
    return;
  }

  const title = "Leaderboard Update 🎉";

  const message = previousRank
    ? `You moved up from #${previousRank} to #${newRank} on the ${leaderboardType} leaderboard. Great job!`
    : `Congratulations! You are now ranked #${newRank} on the ${leaderboardType} leaderboard.`;

  await notifyUser({
    recipientId: userId,
    type: NotificationType.LEADERBOARD_POSITION,
    title,
    message,
    metadata: {
      leaderboardType,
      newRank,
      previousRank,
    },
  });
};
export const getUserNotifications = async (
  userId: string,
  page = 1,
  limit = 20
) => {
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    Notification.find({ recipient: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Notification.countDocuments({
      recipient: new Types.ObjectId(userId),
    }),
  ]);

  return {
    data: notifications,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
export const getUnreadNotificationCount = async (userId: string) => {
  return Notification.countDocuments({
    recipient: new Types.ObjectId(userId),
    isRead: false,
  });
};

export const markNotificationAsRead = async (
  userId: string,
  notificationId: string
) => {
  return Notification.findOneAndUpdate(
    {
      _id: notificationId,
      recipient: new Types.ObjectId(userId),
      isRead: false,
    },
    {
      isRead: true,
      readAt: new Date(),
    },
    { new: true }
  );
};
export const markAllNotificationsAsRead = async (userId: string) => {
  return Notification.updateMany(
    {
      recipient: new Types.ObjectId(userId),
      isRead: false,
    },
    {
      isRead: true,
      readAt: new Date(),
    }
  );
};

export const deleteNotification = async (notificationId: string) => {
  return Notification.findByIdAndDelete(notificationId);
};

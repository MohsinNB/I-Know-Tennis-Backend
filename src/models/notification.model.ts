import { Schema, model, Types } from "mongoose";

export enum NotificationType {
  SUBSCRIPTION_ACTIVATED = "SUBSCRIPTION_ACTIVATED",
  SUBSCRIPTION_EXPIRING = "SUBSCRIPTION_EXPIRING",
  PAYMENT_SUCCESS = "PAYMENT_SUCCESS",
  PAYMENT_FAILED = "PAYMENT_FAILED",

  LEADERBOARD_POSITION = "LEADERBOARD_POSITION",

  ADMIN_NEW_USER = "ADMIN_NEW_USER",
  ADMIN_NEW_SUBSCRIPTION = "ADMIN_NEW_SUBSCRIPTION",
}

export interface INotification {
  recipient: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  readAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes (performance)
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

export const Notification = model<INotification>(
  "Notification",
  notificationSchema
);

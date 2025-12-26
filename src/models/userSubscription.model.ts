import { Schema, model, Types } from "mongoose";

export interface IUserSubscription {
  user: Types.ObjectId;
  plan: Types.ObjectId | any;
  startDate: Date;
  endDate: Date;
  status: "active" | "expired" | "canceled";
  stripeSessionId?: string;
}

const UserSubscriptionSchema = new Schema<IUserSubscription>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, //  one subscription per user
    },
    plan: {
      type: Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    stripeSessionId: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "expired", "canceled"],
      default: "active",
    },
  },
  { timestamps: true }
);

export const UserSubscription = model<IUserSubscription>(
  "UserSubscription",
  UserSubscriptionSchema
);

import { IUser } from "../interfaces/user.interface";
import { model, Schema } from "mongoose";

export const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
      default: "user",
    },

    profilePic: {
      type: String,
      default: "",
    },

    agreedToTerms: {
      type: Boolean,
      required: true,
      default: false,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailOtp: {
      type: String,
    },

    emailOtpExpiresAt: {
      type: Date,
    },

    // 🔹 Subscription
    subscriptionPlan: {
      type: Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true,
    },

    subscriptionType: {
      type: String,
      enum: ["free", "monthly", "yearly"],
      required: true,
      default: "free",
    },

    subscriptionStart: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);

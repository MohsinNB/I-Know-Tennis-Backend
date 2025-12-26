import { Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  password?: string;

  role: "user" | "admin";
  profilePic?: string;

  agreedToTerms: boolean;
  isEmailVerified: boolean;

  emailOtp?: string;
  emailOtpExpiresAt?: Date;

  // 🔹 Subscription
  subscriptionPlan?: Types.ObjectId;
  subscriptionType?: "free" | "monthly" | "yearly";
  subscriptionStart?: Date;
}

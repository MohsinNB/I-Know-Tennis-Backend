import { Document } from "mongoose";

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
}

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

    agreedToTerms: {
      type: Boolean,
      required: true,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailOtp: { type: String, required: false },
    emailOtpExpiresAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);

import { Request, Response } from "express";
import { User } from "../models/user.model";
import { sendResponse } from "../utils/sendResponse";
import status from "http-status-codes";

export const verifyEmailOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.json({ message: "Email already verified" });
    }

    if (
      user.emailOtp !== otp ||
      !user.emailOtpExpiresAt ||
      user.emailOtpExpiresAt < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isEmailVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpiresAt = undefined;

    await user.save();

    sendResponse(res, status.OK, {
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    sendResponse(res, status.INTERNAL_SERVER_ERROR, {
      success: false,
      message: "Email not verified",
    });
  }
};

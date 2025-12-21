import { Request, Response } from "express";
import {
  forgotPasswordService,
  loginUserService,
  resetPasswordService,
} from "../services/auth.service";
import { sendResponse } from "../utils/sendResponse";
import status from "http-status-codes";

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await loginUserService(email, password);
    const { token, user } = result;

    sendResponse(res, status.OK, {
      success: true,
      message: "Login successfully",
      data: {
        token,
        user,
      },
    });
  } catch (error: any) {
    sendResponse(res, status.BAD_REQUEST, {
      success: false,
      message: error.message,
    });
  }
};
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendResponse(res, status.BAD_REQUEST, {
        success: false,
        message: "Email is required",
      });
    }

    const result = await forgotPasswordService(email);

    sendResponse(res, status.OK, {
      success: true,
      message: "OTP sent to your email",
      data: {
        otp: result,
      },
    });
  } catch (error: any) {
    sendResponse(res, status.BAD_REQUEST, {
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return sendResponse(res, status.BAD_REQUEST, {
        success: false,
        message: "All fields are required",
      });
    }

    await resetPasswordService(email, otp, newPassword);

    sendResponse(res, status.OK, {
      success: true,
      message: "Password reset successfully",
    });
  } catch (error: any) {
    sendResponse(res, status.BAD_REQUEST, {
      success: false,
      message: error.message,
    });
  }
};

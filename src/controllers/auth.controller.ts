import { Request, Response } from "express";
import { loginUserService } from "../services/auth.service";
import { sendResponse } from "../utils/sendResponse";
import codes from "http-status-codes";

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

    sendResponse(res, codes.OK, {
      success: true,
      message: "Login successfully",
      data: {
        token,
        user,
      },
    });
  } catch (error: any) {
    sendResponse(res, codes.BAD_REQUEST, {
      success: false,
      message: error.message,
    });
  }
};

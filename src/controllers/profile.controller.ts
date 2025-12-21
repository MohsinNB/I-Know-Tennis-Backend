import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  getMyProfileService,
  updateMyNameService,
} from "../services/profile.service";
import { sendResponse } from "../utils/sendResponse";
import status from "http-status-codes";

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId as string;

    const user = await getMyProfileService(userId);

    sendResponse(res, status.OK, {
      success: true,
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (error: any) {
    sendResponse(res, status.NOT_FOUND, {
      success: false,
      message: error.message,
    });
  }
};

export const updateMyName = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId as string;
    const { name } = req.body;

    if (!name) {
      return sendResponse(res, status.BAD_REQUEST, {
        success: false,
        message: "Name is required",
      });
    }

    const user = await updateMyNameService(userId, name);

    sendResponse(res, status.OK, {
      success: true,
      message: "Name updated successfully",
      data: user,
    });
  } catch (error: any) {
    sendResponse(res, status.NOT_FOUND, {
      success: false,
      message: error.message,
    });
  }
};

import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  getMyProfileService,
  updateProfileService,
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

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId as string;
    const { name } = req.body;
    const file = req.file;

    // Check if at least one field is provided to avoid empty updates
    if (!name && !file) {
      return sendResponse(res, status.BAD_REQUEST, {
        success: false,
        message: "Please provide a name or a profile picture to update",
      });
    }

    // Call the unified service
    const user = await updateProfileService(userId, { name, file });

    sendResponse(res, status.OK, {
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error: any) {
    // Determine status code based on error message or type
    const statusCode =
      error.message === "User not found"
        ? status.NOT_FOUND
        : status.INTERNAL_SERVER_ERROR;

    sendResponse(res, statusCode, {
      success: false,
      message: error.message || "An unexpected error occurred",
    });
  }
};

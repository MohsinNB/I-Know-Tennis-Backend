import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  getDashboardStatsService,
  getMonthWiseUserJoiningService,
} from "../services/admin.service";
import { getAllUsersService } from "../services/admin.service";
import { getLeaderboardService } from "../services/admin.service";
import { getQuizAttendanceService } from "../services/admin.service";
import { sendResponse } from "../utils/sendResponse";
import status from "http-status-codes";

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  const filter = req.query.filter as string | undefined;

  const data = await getDashboardStatsService(filter);

  res.json({
    success: true,
    data,
  });
  sendResponse(res, status.OK, {
    success: true,
    data: data,
    message: "Dashboard stats retrived successfully",
  });
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await getAllUsersService();

    sendResponse(res, status.OK, {
      success: true,
      data: users,
    });
  } catch (error: any) {
    sendResponse(res, status.BAD_REQUEST, {
      success: false,
      message: error.message,
    });
  }
};

export const getLeaderboard = async (req: AuthRequest, res: Response) => {
  try {
    const leaderboard = await getLeaderboardService();

    sendResponse(res, status.OK, {
      success: true,
      data: leaderboard,
    });
  } catch (error: any) {
    sendResponse(res, status.BAD_REQUEST, {
      success: false,
      message: error.message,
    });
  }
};

export const getQuizAttendance = async (req: AuthRequest, res: Response) => {
  try {
    const filter = req.query.filter as string;

    if (!filter) {
      return sendResponse(res, status.BAD_REQUEST, {
        success: false,
        message: "Filter is required (daily, weekly, monthly, yearly)",
      });
    }

    const attendance = await getQuizAttendanceService(filter);

    sendResponse(res, status.OK, {
      success: true,
      data: {
        filter,
        attendance,
      },
    });
  } catch (error: any) {
    sendResponse(res, status.BAD_REQUEST, {
      success: false,
      message: error.message,
    });
  }
};

export const getMonthWiseUserJoining = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const data = await getMonthWiseUserJoiningService();

    sendResponse(res, status.OK, {
      success: true,
      data: data,
    });
  } catch (error: any) {
    sendResponse(res, status.INTERNAL_SERVER_ERROR, {
      success: false,
      message: error.message,
    });
  }
};

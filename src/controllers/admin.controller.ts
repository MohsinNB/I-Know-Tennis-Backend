import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { getDashboardStatsService } from "../services/admin.service";
import { getAllUsersService } from "../services/admin.service";
import { getLeaderboardService } from "../services/admin.service";
import { getQuizAttendanceService } from "../services/admin.service";

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  const filter = req.query.filter as string | undefined;

  const data = await getDashboardStatsService(filter);

  res.json({
    success: true,
    data,
  });
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  const users = await getAllUsersService();

  res.json({
    success: true,
    data: users,
  });
};

export const getLeaderboard = async (req: AuthRequest, res: Response) => {
  const leaderboard = await getLeaderboardService();

  res.json({
    success: true,
    data: leaderboard,
  });
};

export const getQuizAttendance = async (req: AuthRequest, res: Response) => {
  const filter = req.query.filter as string;

  if (!filter) {
    return res.status(400).json({
      success: false,
      message: "Filter is required (daily, weekly, monthly, yearly)",
    });
  }

  const attendance = await getQuizAttendanceService(filter);

  res.json({
    success: true,
    data: {
      filter,
      attendance,
    },
  });
};

import { User } from "../models/user.model";
import { Quiz } from "../models/quiz.model";
import { QuizAttempt } from "../models/quizattempt.model";

export const getDashboardStatsService = async (filter?: string) => {
  const totalUsers = await User.countDocuments();
  const totalQuizzes = await Quiz.countDocuments();

  const completedAttempts = await QuizAttempt.countDocuments({
    status: "completed",
  });

  let attendanceCount = completedAttempts;

  if (filter) {
    const startDate = getStartDate(filter);
    attendanceCount = await QuizAttempt.countDocuments({
      status: "completed",
      createdAt: { $gte: startDate },
    });
  }

  const usersByMonth = await User.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return {
    totalUsers,
    totalQuizzes,
    quizAttempts: completedAttempts,
    quizAttendance: attendanceCount,
    activeSubscriptions: 0, // later
    totalRevenue: 0, // later
    usersByMonth,
  };
};

export const getAllUsersService = async () => {
  return await User.find()
    .select("_id name email phoneNumber role isEmailVerified createdAt")
    .sort({ createdAt: -1 });
};

export const getLeaderboardService = async () => {
  return await QuizAttempt.aggregate([
    {
      $match: { status: "completed" },
    },
    {
      $group: {
        _id: "$userId",
        totalScore: { $sum: "$totalScore" },
        quizzesAttempted: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        userId: "$user._id",
        name: "$user.name",
        email: "$user.email",
        totalScore: 1,
        quizzesAttempted: 1,
      },
    },
    {
      $sort: { totalScore: -1 },
    },
  ]);
};
const getStartDate = (filter: string) => {
  const now = new Date();

  switch (filter) {
    case "daily":
      now.setHours(0, 0, 0, 0);
      break;

    case "weekly":
      now.setDate(now.getDate() - 7);
      break;

    case "monthly":
      now.setMonth(now.getMonth() - 1);
      break;

    case "yearly":
      now.setFullYear(now.getFullYear() - 1);
      break;

    default:
      throw new Error("Invalid filter type");
  }

  return now;
};
export const getQuizAttendanceService = async (filter: string) => {
  const startDate = getStartDate(filter);

  const count = await QuizAttempt.countDocuments({
    status: "completed",
    createdAt: { $gte: startDate },
  });

  return count;
};
export const getMonthWiseUserJoiningService = async () => {
  const result = await User.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        totalUsers: { $sum: 1 },
      },
    },
    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        totalUsers: 1,
      },
    },
  ]);

  return result;
};

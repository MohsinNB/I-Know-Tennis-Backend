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
  }

  return now;
};
export const getAllUsersService = async () => {
  return await User.find()
    .select("_id name email phoneNumber role isEmailVerified createdAt")
    .sort({ createdAt: -1 });
};

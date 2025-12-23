import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { submitQuizService } from "../services/quizAttempt.service";
import { sendResponse } from "../utils/sendResponse";
import status from "http-status-codes";

export const submitQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const result = await submitQuizService(
      req.user!.userId,
      req.params.quizId,
      req.body.answers
    );

    sendResponse(res, status.OK, {
      success: true,
      message: "Login successfully",
      data: {
        result,
      },
    });
  } catch (error: any) {
    sendResponse(res, status.BAD_REQUEST, {
      success: false,
      message: error.message,
    });
  }
};

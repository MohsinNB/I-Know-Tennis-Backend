import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { submitQuizService } from "../services/quizAttempt.service";

export const submitQuiz = async (req: AuthRequest, res: Response) => {
  const result = await submitQuizService(
    req.user!.userId,
    req.params.quizId,
    req.body.answers
  );

  res.json({
    success: true,
    message: "Quiz submitted successfully",
    data: result,
  });
};

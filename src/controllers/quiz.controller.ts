import { Request, Response } from "express";
import { createQuizService, getQuizService } from "../services/quiz.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export const createQuiz = async (req: AuthRequest, res: Response) => {
  const quiz = await createQuizService(req.body, req.user!.userId);
  res.status(201).json({ success: true, data: quiz });
};

export const getQuiz = async (req: Request, res: Response) => {
  const quiz = await getQuizService(req.params.quizId);
  res.json({ success: true, data: quiz });
};

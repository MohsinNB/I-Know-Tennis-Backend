import { Request, Response } from "express";
import {
  createQuizService,
  deleteQuizService,
  getAllQuizzesService,
  getQuizService,
} from "../services/quiz.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Quiz } from "../models/quiz.model";
import { sendResponse } from "../utils/sendResponse";
import status from "http-status-codes";

export const createQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const quiz = await createQuizService(req.body, req.user!.userId);
    sendResponse(res, status.OK, {
      success: true,
      data: quiz,
      message: "Quiz created successfully",
    });
  } catch (error: any) {
    sendResponse(res, status.INTERNAL_SERVER_ERROR, {
      success: false,
      message: error.message,
    });
  }
};

export const getQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = await getQuizService(req.params.quizId);
    sendResponse(res, status.OK, {
      success: true,
      data: quiz,
      message: "Quiz retrieved successfully",
    });
  } catch (error: any) {
    sendResponse(res, status.INTERNAL_SERVER_ERROR, {
      success: false,
      message: error.message,
    });
  }
};

export const getAllQuizzes = async (req: Request, res: Response) => {
  try {
    const quizzes = await getAllQuizzesService();

    sendResponse(res, status.OK, {
      success: true,
      data: quizzes,
      message: "Quizzes retrieved successfully",
    });
  } catch (error: any) {
    sendResponse(res, status.INTERNAL_SERVER_ERROR, {
      success: false,
      message: error.message,
    });
  }
};

export const deleteQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { quizId } = req.params;

    const deletedQuiz = await deleteQuizService(quizId);

    if (!deletedQuiz) {
      return sendResponse(res, status.NOT_FOUND, {
        success: false,
        message: "Quiz not found",
      });
    }

    sendResponse(res, status.OK, {
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error: any) {
    sendResponse(res, status.INTERNAL_SERVER_ERROR, {
      success: false,
      message: error.message,
    });
  }
};

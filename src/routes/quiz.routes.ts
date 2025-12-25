import { Router } from "express";
import {
  createQuiz,
  deleteQuiz,
  getAllQuizzes,
  getQuiz,
} from "../controllers/quiz.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/admin.middleware";

const router = Router();

router.post("/", authMiddleware, isAdmin, createQuiz); // admin only
router.get("/", authMiddleware, getAllQuizzes);
router.get("/:quizId", authMiddleware, getQuiz); // user & admin
router.delete("/:quizId", authMiddleware, deleteQuiz);

export default router;

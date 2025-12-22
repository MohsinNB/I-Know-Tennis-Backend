import { Router } from "express";
import { createQuiz, getQuiz } from "../controllers/quiz.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createQuiz); // admin only later
router.get("/:quizId", authMiddleware, getQuiz);

export default router;

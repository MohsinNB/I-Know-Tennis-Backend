import { Router } from "express";
import { submitQuiz } from "../controllers/quizAttempt.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { isUser } from "../middlewares/user.middleware";

const router = Router();

router.post("/:quizId/submit", authMiddleware, isUser, submitQuiz);

export default router;

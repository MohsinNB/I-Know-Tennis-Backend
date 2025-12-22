import { Router } from "express";
import { submitQuiz } from "../controllers/quizAttempt.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/:quizId/submit", authMiddleware, submitQuiz);

export default router;

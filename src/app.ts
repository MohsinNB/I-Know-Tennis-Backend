import express, { Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import quizRoutes from "./routes/quiz.routes";
import attemptQuizRoutes from "./routes/quizAttempt.route";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth/profile", profileRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/quiz/attempt_quiz", attemptQuizRoutes);
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome. Your app is running",
  });
});

export default app;

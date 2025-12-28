import express, { Request, Response } from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import http from "http";
import profileRoutes from "./routes/profile.routes";
import quizRoutes from "./routes/quiz.routes";
import attemptQuizRoutes from "./routes/quizAttempt.route";
import adminRoutes from "./routes/admin.routes";
import subscriptionRoutes from "./routes/subscription.routes";
import userSubscriptionRoutes from "./routes/userSubscription.route";
import stripeRoutes from "./routes/stripe.route";
import { stripeWebhook } from "./controllers/webhookController";
import { initSocket } from "./socket/socket";
import notificationRoutes from "./routes/notification.route";
import path from "path";
const app = express();

const server = http.createServer(app);

initSocket(server);
app.use(cors());
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(express.static("public"));
app.use(express.json());

app.get("/dev/notifications", (req, res) => {
  return res.render("notifications");
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth/profile", profileRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/quiz/attempt_quiz", attemptQuizRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/subscription", userSubscriptionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payment", stripeRoutes);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome. Your app is running",
  });
});

export default app;

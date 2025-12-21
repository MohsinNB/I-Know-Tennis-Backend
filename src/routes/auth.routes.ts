import { Router } from "express";
import { loginUser } from "../controllers/auth.controller";
import { verifyEmailOtp } from "../controllers/verifyOtp.controller";
import { forgotPassword, resetPassword } from "../controllers/auth.controller";

const router = Router();

router.post("/login", loginUser);
router.post("/verify-email-otp", verifyEmailOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
export default router;

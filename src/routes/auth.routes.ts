import { Router } from "express";
import { loginUser } from "../controllers/auth.controller";
import { verifyEmailOtp } from "../controllers/verifyOtp.controller";

const router = Router();

router.post("/login", loginUser);
router.post("/verify-email-otp", verifyEmailOtp);

export default router;

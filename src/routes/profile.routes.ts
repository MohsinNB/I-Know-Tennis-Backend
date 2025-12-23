import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getProfile, updateProfile } from "../controllers/profile.controller";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.get("/me", authMiddleware, getProfile);
router.patch(
  "/update-profile",
  authMiddleware,
  upload.single("file"),
  updateProfile
);

export default router;

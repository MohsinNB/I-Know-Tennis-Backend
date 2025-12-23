import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const isUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "user") {
    return res.status(403).json({
      success: false,
      message: "User access required",
    });
  }

  next();
};

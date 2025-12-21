import { Request, Response } from "express";
import { registerUserService } from "../services/user.service";
import { sendResponse } from "../utils/sendResponse";
import status from "http-status-codes";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await registerUserService(req.body);

    const userObj = user.toObject();

    delete userObj.password;

    sendResponse(res, status.CREATED, {
      success: true,
      message: "User created successfully",
      data: userObj,
    });
  } catch (error: any) {
    sendResponse(res, status.BAD_REQUEST, {
      success: false,
      message: error.message,
    });
  }
};

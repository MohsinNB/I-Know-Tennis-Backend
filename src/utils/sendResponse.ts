import { Response } from "express";
import { TResponse } from "./response.type";

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  payload: TResponse<T>
) => {
  return res.status(statusCode).json(payload);
};

import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { createCheckoutSessionService } from "../services/stripe.service";
import { sendResponse } from "../utils/sendResponse";
import status from "http-status-codes";

export const createCheckoutSession = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { planId, billingCycle } = req.body;

    if (!planId || !billingCycle) {
      return sendResponse(res, status.BAD_REQUEST, {
        success: false,
        message: "Plan ID and billing cycle are required",
      });
    }

    const checkoutUrl = await createCheckoutSessionService(
      req.user!.userId,
      planId,
      billingCycle
    );

    sendResponse(res, status.OK, {
      success: true,
      data: {
        url: checkoutUrl,
      },
    });
  } catch (error: any) {
    sendResponse(res, status.BAD_REQUEST, {
      success: false,
      message: error.message,
    });
  }
};

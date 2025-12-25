import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  buySubscriptionService,
  getMySubscriptionService,
} from "../services/userSubscription.service";
import { sendResponse } from "../utils/sendResponse";
import status from "http-status-codes";

export const buySubscription = async (req: AuthRequest, res: Response) => {
  try {
    const { planId, billingCycle } = req.body;

    if (!planId || !billingCycle) {
      return sendResponse(res, status.BAD_REQUEST, {
        success: false,
        message: "Plan ID and billing cycle are required",
      });
    }

    const subscription = await buySubscriptionService(
      req.user!.userId,
      planId,
      billingCycle
    );

    sendResponse(res, status.OK, {
      success: true,
      message: "Subscription activated successfully",
      data: subscription,
    });
  } catch (error: any) {
    sendResponse(res, status.BAD_REQUEST, {
      success: false,
      message: error.message,
    });
  }
};

export const getMySubscription = async (req: AuthRequest, res: Response) => {
  try {
    const subscription = await getMySubscriptionService(req.user!.userId);
    if (subscription?.plan.monthlyPrice === 0) {
      throw new Error("You havn't any paid subscription yet");
    }
    console.log(subscription?.plan.monthlyPrice);

    sendResponse(res, status.OK, {
      success: true,
      data: subscription, // can be null
    });
  } catch (error: any) {
    sendResponse(res, status.INTERNAL_SERVER_ERROR, {
      success: false,
      message: error.message,
    });
  }
};

import { Request, Response } from "express";
import {
  createSubscriptionPlanService,
  deactivateSubscriptionPlanService,
  getAllSubscriptionPlansService,
  updateSubscriptionPlanService,
} from "../services/subscription.service";
import { sendResponse } from "../utils/sendResponse";
import status from "http-status-codes";

export const createSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    const { name, monthlyPrice, yearlyPrice, isDefault } = req.body;

    if (!name || !monthlyPrice || !yearlyPrice) {
      return sendResponse(res, status.BAD_REQUEST, {
        success: false,
        message: "All fields are required",
      });
    }

    const plan = await createSubscriptionPlanService(
      name,
      monthlyPrice,
      yearlyPrice,
      isDefault
    );

    sendResponse(res, status.OK, {
      success: true,
      message: "Subscription plan created",
      data: plan,
    });
  } catch (error: any) {
    sendResponse(res, status.INTERNAL_SERVER_ERROR, {
      success: false,
      message: error.message,
    });
  }
};

export const getAllSubscriptionPlans = async (req: Request, res: Response) => {
  try {
    const plans = await getAllSubscriptionPlansService();

    sendResponse(res, status.OK, {
      success: true,
      data: plans,
    });
  } catch (error: any) {
    sendResponse(res, status.INTERNAL_SERVER_ERROR, {
      success: false,
      message: error.message,
    });
  }
};

export const updateSubscriptionPlan = async (req: Request, res: Response) => {
  try {
    const updatedPlan = await updateSubscriptionPlanService(
      req.params.planId,
      req.body
    );

    sendResponse(res, status.OK, {
      success: true,
      message: "Subscription plan updated",
      data: updatedPlan,
    });
  } catch (error: any) {
    sendResponse(res, status.INTERNAL_SERVER_ERROR, {
      success: false,
      message: error.message,
    });
  }
};
export const deactivateSubscriptionPlan = async (
  req: Request,
  res: Response
) => {
  try {
    const plan = await deactivateSubscriptionPlanService(req.params.planId);

    sendResponse(res, status.OK, {
      success: true,
      message: "Subscription plan deactivated successfully",
      data: plan,
    });
  } catch (error: any) {
    sendResponse(res, status.BAD_REQUEST, {
      success: false,
      message: error.message,
    });
  }
};

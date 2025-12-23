import { Request, Response } from "express";
import {
  createSubscriptionPlanService,
  getAllSubscriptionPlansService,
  updateSubscriptionPlanService,
} from "../services/subscription.service";

export const createSubscriptionPlan = async (req: Request, res: Response) => {
  const { name, monthlyPrice, yearlyPrice, isDefault } = req.body;

  if (!name || !monthlyPrice || !yearlyPrice) {
    return res.status(400).json({
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

  res.status(201).json({
    success: true,
    message: "Subscription plan created",
    data: plan,
  });
};

export const getAllSubscriptionPlans = async (req: Request, res: Response) => {
  const plans = await getAllSubscriptionPlansService();

  res.json({
    success: true,
    data: plans,
  });
};

export const updateSubscriptionPlan = async (req: Request, res: Response) => {
  const updatedPlan = await updateSubscriptionPlanService(
    req.params.planId,
    req.body
  );

  res.json({
    success: true,
    message: "Subscription plan updated",
    data: updatedPlan,
  });
};

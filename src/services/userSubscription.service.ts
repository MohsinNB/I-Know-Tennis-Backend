import { SubscriptionPlan } from "../models/subscription.model";
import { UserSubscription } from "../models/userSubscription.model";
import { Types } from "mongoose";

export const buySubscriptionService = async (
  userId: string,
  planId: string,
  billingCycle: "monthly" | "yearly"
) => {
  const plan = await SubscriptionPlan.findById(planId);

  if (!plan) {
    throw new Error("Subscription plan not found");
  }

  if (!plan.isActive) {
    throw new Error("This subscription plan is inactive");
  }

  const existing = await UserSubscription.findOne({ user: userId });

  if (existing && existing.plan.toString() === planId) {
    throw new Error("You already have this subscription plan");
  }

  const startDate = new Date();
  const endDate = new Date(startDate);

  if (billingCycle === "monthly") {
    endDate.setDate(endDate.getDate() + 30);
  } else {
    endDate.setDate(endDate.getDate() + 365);
  }

  if (existing) {
    existing.plan = plan._id as Types.ObjectId;
    existing.startDate = startDate;
    existing.endDate = endDate;
    existing.status = "active";

    return await existing.save();
  }

  return await UserSubscription.create({
    user: userId,
    plan: plan._id,
    startDate,
    endDate,
    status: "active",
  });
};

export const getMySubscriptionService = async (userId: string) => {
  return await UserSubscription.findOne({ user: userId }).populate("plan");
};

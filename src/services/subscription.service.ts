import { SubscriptionPlan } from "../models/subscription.model";

export const createSubscriptionPlanService = async (
  name: string,
  monthlyPrice: number,
  yearlyPrice: number,
  isDefault: boolean = false
) => {
  const existing = await SubscriptionPlan.findOne({ name });
  if (existing) throw new Error("Subscription plan already exists");

  // Logic is now inside the model's pre-save hook!
  return await SubscriptionPlan.create({
    name,
    monthlyPrice,
    yearlyPrice,
    isDefault,
  });
};

export const updateSubscriptionPlanService = async (
  planId: string,
  updateData: any
) => {
  const plan = await SubscriptionPlan.findById(planId);
  if (!plan) throw new Error("Plan not found");

  // Merge the updates into the document
  Object.assign(plan, updateData);

  // We use .save() instead of findByIdAndUpdate
  // so the 'pre-save' hook in the model is triggered!
  return await plan.save();
};

export const getAllSubscriptionPlansService = async () => {
  return await SubscriptionPlan.find().sort({ createdAt: -1 });
};

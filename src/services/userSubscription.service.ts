import { SubscriptionPlan } from "../models/subscription.model";
import { User } from "../models/user.model";
import { UserSubscription } from "../models/userSubscription.model";
import mongoose, { ClientSession, Types } from "mongoose";

export const buySubscriptionService = async (
  userId: string,
  planId: string,
  billingCycle: "monthly" | "yearly",
  stripeSessionId?: string
) => {
  // 1. Idempotency Check
  if (stripeSessionId) {
    const alreadyProcessed = await UserSubscription.findOne({
      stripeSessionId,
    });
    if (alreadyProcessed) return alreadyProcessed;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const plan = await SubscriptionPlan.findById(planId).session(session);
    if (!plan) throw new Error("Plan not found");

    const startDate = new Date();
    const endDate = new Date(startDate);
    billingCycle === "monthly"
      ? endDate.setMonth(endDate.getMonth() + 1)
      : endDate.setFullYear(endDate.getFullYear() + 1);

    // 2. Build Dynamic Update Object
    const subscriptionUpdate: any = {
      plan: plan._id,
      startDate,
      endDate,
      status: "active",
    };

    // ONLY add the key if it exists. NEVER use "manual_override"
    if (stripeSessionId) {
      subscriptionUpdate.stripeSessionId = stripeSessionId;
    }

    const updatedSub = await UserSubscription.findOneAndUpdate(
      { user: userId },
      { $set: subscriptionUpdate },
      { session, upsert: true, new: true }
    );

    // 3. Sync User Type (Free vs Paid)
    const price =
      billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
    const type = price > 0 ? "paid" : "free";

    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          subscriptionPlan: plan._id,
          subscriptionType: type,
          subscriptionStart: startDate,
        },
      },
      { session }
    );

    await session.commitTransaction();
    return updatedSub;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getMySubscriptionService = async (userId: string) => {
  return await UserSubscription.findOne({ user: userId }).populate("plan");
};

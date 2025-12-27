import { stripe } from "../utils/stripe";
import { SubscriptionPlan } from "../models/subscription.model";
import { CLIENT_URL } from "../app/config/env";
import { User } from "../models/user.model";
// import { Types } from "mongoose";

export const createCheckoutSessionService = async (
  userId: string,
  planId: string,
  billingCycle: "monthly" | "yearly"
) => {
  const [plan, user] = await Promise.all([
    SubscriptionPlan.findById(planId),
    User.findById(userId),
  ]);
  console.log(typeof user);
  if (!plan) {
    throw new Error("Subscription plan not found");
  }

  if (!plan.isActive) {
    throw new Error("This subscription plan is inactive");
  }
  if (!user) {
    throw new Error("User not found in DB");
  }

  if (user.subscriptionPlan?.toString() === planId) {
    throw new Error("You already have this plan");
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: plan.name,
          },
          unit_amount:
            billingCycle === "monthly"
              ? Math.ceil(plan.monthlyPrice * 100)
              : Math.floor(plan.yearlyPrice * 100),
        },
        quantity: 1,
      },
    ],
    success_url: `${CLIENT_URL}/success`,
    cancel_url: `${CLIENT_URL}/cancel`,

    metadata: {
      userId: userId,
      planId: plan._id.toString(),
      billingCycle: billingCycle,
    },
  });

  return session.url;
};

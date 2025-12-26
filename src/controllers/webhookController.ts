import { Request, Response } from "express";
import Stripe from "stripe";
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from "../app/config/env";
import { buySubscriptionService } from "../services/userSubscription.service";

const stripe = new Stripe(STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  //  Only care about successful checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId;
    const billingCycle = session.metadata?.billingCycle as "monthly" | "yearly";

    if (!userId || !planId || !billingCycle) {
      console.error("Missing metadata in Stripe session");
      return res.status(400).json({ success: false });
    }

    try {
      await buySubscriptionService(userId, planId, billingCycle);
      console.log("Subscription activated via webhook");
    } catch (error) {
      console.error(" Subscription activation failed:", error);
    }
  }

  res.status(200).json({ received: true });
};

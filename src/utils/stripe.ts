import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "../app/config/env";

export const stripe = new Stripe(STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-12-15.clover",
});

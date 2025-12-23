import { User } from "../models/user.model";
import { hashPassword } from "../utils/hashPassword";
import { SubscriptionPlan } from "../models/subscription.model";

export const registerUserService = async (data: any) => {
  const { name, email, phoneNumber, password, confirmPassword, agreedToTerms } =
    data;

  if (!agreedToTerms) {
    throw new Error("You must agree to the terms to use this site");
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already registered");
  }

  const defaultPlan = await SubscriptionPlan.findOne({
    isDefault: true,
    isActive: true,
  });

  if (!defaultPlan) {
    throw new Error("Default subscription plan not found");
  }
  const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];

  const role = adminEmails.includes(email) ? "admin" : "user";
  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    phoneNumber,
    password: hashedPassword,
    agreedToTerms,
    role: "user", // 🔐 always user
    subscriptionPlan: defaultPlan._id,
    subscriptionType: "free",
    subscriptionStart: new Date(),
  });

  return user;
};

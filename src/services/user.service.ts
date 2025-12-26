import { User } from "../models/user.model";
import { hashPassword } from "../utils/hashPassword";
import { SubscriptionPlan } from "../models/subscription.model";
import { IUser } from "../interfaces/user.interface";

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
  const subscriptionPlan =
    defaultPlan.monthlyPrice === 0 && defaultPlan.yearlyPrice === 0
      ? defaultPlan._id
      : null;

  const user = await User.create({
    name,
    email,
    phoneNumber,
    password: hashedPassword,
    agreedToTerms,
    role,
    subscriptionPlan,
    subscriptionType: subscriptionPlan ? "free" : null,
    subscriptionStart: subscriptionPlan ? new Date() : null,
  } as IUser);

  return user;
};

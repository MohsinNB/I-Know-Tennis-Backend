import { User } from "../models/user.model";
import { hashPassword } from "../utils/hashPassword";
import { generateOtp } from "../utils/otp";
import { sendOtpEmail } from "./email.service";

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

  const hashedPassword = await hashPassword(password);

  const otp = generateOtp();

  const user = await User.create({
    name,
    email,
    phoneNumber,
    password: hashedPassword,
    agreedToTerms,
    emailOtp: otp,
    emailOtpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
  });

  await sendOtpEmail(email, otp);

  return user;
};

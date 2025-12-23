import { User } from "../models/user.model";
import { comparePassword, hashPassword } from "../utils/hashPassword";
import { signAccessToken } from "../utils/jwt";
import { generateOtp } from "../utils/otp";
import { sendOtpEmail } from "./email.service";

export const loginUserService = async (
  email: string,
  password: string,
  rememberMe: boolean
) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("User does not exist");
  }

  const isMatch = await comparePassword(password, user.password as string);

  if (!isMatch) {
    throw new Error("Wrong password");
  }

  const token = signAccessToken(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    rememberMe
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};
export const forgotPasswordService = async (email: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const otp = generateOtp();

  user.emailOtp = otp;
  user.emailOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();

  await sendOtpEmail(email, otp);

  return otp;
};
export const resetPasswordService = async (
  email: string,
  otp: string,
  createPassword: string,
  forgetPassword: string
) => {
  const user = await User.findOne({ email }).select(
    "+emailOtp +emailOtpExpiresAt +password"
  );

  if (!user) {
    throw new Error("User not found");
  }
  if (createPassword !== forgetPassword) {
    throw new Error("Password doesn't match");
  }

  if (!user.emailOtp || !user.emailOtpExpiresAt) {
    throw new Error("OTP not requested");
  }

  if (user.emailOtp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (user.emailOtpExpiresAt < new Date()) {
    throw new Error("OTP expired");
  }

  const hashedPassword = await hashPassword(createPassword);

  user.password = hashedPassword;
  user.emailOtp = undefined;
  user.emailOtpExpiresAt = undefined;

  await user.save();

  return true;
};

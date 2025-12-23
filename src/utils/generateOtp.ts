import { IUser } from "../interfaces/user.interface";
import { sendOtpEmail } from "../services/email.service";
import { generateOtp } from "./otp";

export const generateAndAttachOtp = async (user: IUser) => {
  const otp = generateOtp();

  user.emailOtp = otp;
  user.emailOtpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();
  await sendOtpEmail(user.email, otp);

  return otp;
};

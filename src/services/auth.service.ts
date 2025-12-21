import { User } from "../models/user.model";
import { comparePassword } from "../utils/hashPassword";
import { signAccessToken } from "../utils/jwt";

export const loginUserService = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("User does not exist");
  }

  const isMatch = await comparePassword(password, user.password as string);

  if (!isMatch) {
    throw new Error("Wrong password");
  }

  if (!user.isEmailVerified) {
    throw new Error("Please verify your email using OTP");
  }

  const token = signAccessToken({ userId: user._id.toString() });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

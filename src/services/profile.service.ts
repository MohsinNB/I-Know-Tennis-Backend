import { User } from "../models/user.model";

export const getMyProfileService = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const updateMyNameService = async (userId: string, name: string) => {
  const user = await User.findByIdAndUpdate(userId, { name }, { new: true });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

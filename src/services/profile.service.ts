import { User } from "../models/user.model";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

export const getMyProfileService = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const updateProfileService = async (
  userId: string,
  updateData: { name?: string; file?: Express.Multer.File }
) => {
  const { name, file } = updateData;
  const updates: Record<string, any> = {};

  // 1. Handle Name update if provided
  if (name) {
    updates.name = name;
  }

  // 2. Handle Profile Picture update if provided
  if (file) {
    const imageUrl = await uploadToCloudinary(file.buffer);
    updates.profilePic = imageUrl;
  }

  // 3. Ensure there is actually something to update
  if (Object.keys(updates).length === 0) {
    throw new Error("No update data provided");
  }

  // 4. Perform a single database call
  const user = await User.findByIdAndUpdate(userId, updates, { new: true });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

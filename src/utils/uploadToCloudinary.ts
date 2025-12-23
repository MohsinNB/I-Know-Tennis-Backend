import cloudinary from "../app/config/cloudinary";

export const uploadToCloudinary = (
  buffer: Buffer,
  folder = "profile_pictures"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            return reject(new Error("Cloudinary upload failed"));
          }
          resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
};

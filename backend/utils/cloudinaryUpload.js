// utils/cloudinaryUpload.js
import cloudinary from "../config/cloudinary.js";

export const uploadImageToCloudinary = async (file, folder) => {
  try {
    const options = { folder, resource_type: "auto" };
    const result = await cloudinary.uploader.upload(file, options);
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Image upload failed");
  }
};

export const uploadPdfToCloudinary = async (file, folder) => {
  try {
    const options = { folder, resource_type: "raw" };
    const result = await cloudinary.uploader.upload(file, options);
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading PDF:", error);
    throw new Error("PDF upload failed");
  }
};

// backend/test-upload.js
import cloudinary from "cloudinary";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), "backend/config.env") });

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const testFile = path.resolve(process.cwd(), "backend", "public", "images", "placeholder.png"); // thay file thật nếu có

cloudinary.v2.uploader.upload(testFile, { folder: "test-upload" })
  .then(res => { console.log("Upload OK:", res.secure_url); })
  .catch(err => { console.error("Upload ERROR:", err); });
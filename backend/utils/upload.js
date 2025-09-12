// backend/utils/upload.js
import fs from "fs";
import path from "path";
import cloudinary from "cloudinary";
import streamifier from "streamifier";

/**
 * Safe cloudinary config:
 * - Only call cloudinary.config when all env vars present.
 * - Provide boolean CLOUD_ENABLED
 */
const CLOUD_ENABLED = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

if (CLOUD_ENABLED) {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
} else {
  console.warn("[upload] Cloudinary disabled (missing env). Falling back to local storage.");
}

/**
 * Upload a buffer to cloudinary using upload_stream
 * returns the cloudinary response object
 */
export function uploadBufferToCloudinary(buffer, folder = "uploads") {
  if (!CLOUD_ENABLED) {
    throw new Error("Cloudinary not configured");
  }
  return new Promise((resolve, reject) => {
    const stream = cloudinary.v2.uploader.upload_stream({ folder }, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

/**
 * Upload a file-like object:
 * - express-fileupload style: file.tempFilePath, file.name
 * - multer-like: file.buffer, file.originalname
 *
 * Options:
 * - folder: subfolder under cloudinary or under backend public
 * - backendPublic: path to backend/public (for local fallback)
 *
 * Returns URL string (cloud secure_url or local /images/...)
 */
export async function uploadFileObject(fileObj, { folder = "services", backendPublic } = {}) {
  backendPublic = backendPublic || path.resolve(process.cwd(), "backend", "public");

  if (!fileObj) return null;

  // express-fileupload: tempFilePath
  if (fileObj.tempFilePath && fs.existsSync(fileObj.tempFilePath)) {
    if (CLOUD_ENABLED) {
      // upload file directly by path
      const res = await cloudinary.v2.uploader.upload(fileObj.tempFilePath, { folder });
      return res.secure_url;
    } else {
      // copy to backend public
      const relDir = path.join("images", folder);
      const destDir = path.join(backendPublic, relDir);
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
      const ext = path.extname(fileObj.name) || ".jpg";
      const fname = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`;
      const dest = path.join(destDir, fname);
      fs.copyFileSync(fileObj.tempFilePath, dest);
      return `/${path.join(relDir, fname).replace(/\\/g, "/")}`;
    }
  }

  // multer-like / buffer
  if (fileObj.buffer) {
    if (CLOUD_ENABLED) {
      const r = await uploadBufferToCloudinary(fileObj.buffer, folder);
      return r.secure_url;
    } else {
      const relDir = path.join("images", folder);
      const destDir = path.join(backendPublic, relDir);
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
      const ext = path.extname(fileObj.originalname) || ".jpg";
      const fname = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`;
      const dest = path.join(destDir, fname);
      fs.writeFileSync(dest, fileObj.buffer);
      return `/${path.join(relDir, fname).replace(/\\/g, "/")}`;
    }
  }

  return null;
}

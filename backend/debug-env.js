// backend/debug-env.js
import path from "path";
import dotenv from "dotenv";

// load explicit file (relative to project root's backend/config.env)
dotenv.config({ path: path.resolve(process.cwd(), "backend/config.env") });

console.log("cwd:", process.cwd());
console.log("config path:", path.resolve(process.cwd(), "backend/config.env"));
console.log("CLOUDINARY_CLOUD_NAME =", process.env.CLOUDINARY_CLOUD_NAME);
console.log("CLOUDINARY_API_KEY =", process.env.CLOUDINARY_API_KEY ? "SET" : "undefined");
console.log("CLOUDINARY_API_SECRET =", process.env.CLOUDINARY_API_SECRET ? "SET" : "undefined");
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import app from "./app.js";
import { dbConnection } from "./database/dbConnection.js";

// ESM: tạo __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load biến môi trường
dotenv.config({ path: path.resolve(__dirname, "config.env") });

// ====== CORS config (nếu dùng trực tiếp ở đây, còn bạn đã có trong app.js thì có thể giữ nguyên ở app.js) ======
import cors from "cors";
const allowedOrigins = [
  process.env.FRONTEND_URL_ONE || "http://localhost:5173",
  process.env.FRONTEND_URL_TWO || "http://localhost:3000",
  process.env.FRONTEND_URL_RENDER || "https://nhakhoaou.onrender.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Cho phép Postman/mobile app
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`❌ Blocked CORS request from: ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};
app.use(cors(corsOptions));

// ====== Serve frontend build ======
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");

  // Serve static files (css, js, images...)
  app.use(express.static(frontendPath));

  // Catch-all route → index.html
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });
}

// ====== Start server ======
const PORT = process.env.PORT || 7000;

(async () => {
  try {
    await dbConnection();
    app.listen(PORT, () => {
      console.log(`✅ Server started on PORT=${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err?.message || err);
    process.exit(1);
  }
})();

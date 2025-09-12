import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import app from "./app.js";
import { dbConnection } from "./database/dbConnection.js";
import cors from "cors";

// ESM: tạo __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load biến môi trường
dotenv.config({ path: path.resolve(__dirname, "config.env") });

// ====== CORS config ======
const allowedOrigins = [
  process.env.FRONTEND_URL_ONE || "http://localhost:5173",
  process.env.FRONTEND_URL_TWO || "http://localhost:3000",
  process.env.FRONTEND_URL_RENDER || "https://dental-clinic-5gnk.onrender.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Cho phép request không có origin (Postman, curl)
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`❌ Blocked CORS request from: ${origin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));

// ====== Serve frontend build (chỉ khi deploy) ======
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");

  // Serve static assets (CSS, JS, images…)
  app.use(express.static(frontendPath));

  // React Router fallback
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

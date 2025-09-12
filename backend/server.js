import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express from "express"; 
import app from "./app.js";
import { dbConnection } from "./database/dbConnection.js";

// ESM: tạo __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.resolve(__dirname, "config.env") });

// Serve frontend build (chỉ khi deploy)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
  });
}

// Dùng PORT do Render cấp, fallback cho local
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

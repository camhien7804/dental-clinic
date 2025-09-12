// backend/database/dbConnection.js
import mongoose from "mongoose";

export async function dbConnection() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URL || process.env.MONGODB || null;

  if (!mongoUri) {
    console.error("Missing MongoDB connection string. Set MONGO_URI or MONGODB_URL in config.env");
    // trả về rejected promise để server.js bắt và exit
    throw new Error("Missing MongoDB connection string (MONGO_URI / MONGODB_URL)");
  }

  try {
    // Hiện thông báo chuỗi kết nối (để debug) — nếu là atlas, dấu [atlas cluster]
    console.log("Connecting to MongoDB:", mongoUri.startsWith("mongodb+srv://") ? "[atlas cluster]" : mongoUri);

    // Không truyền các tuỳ chọn đã deprecated (một số warning bạn nhìn thấy)
    await mongoose.connect(mongoUri);

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message || err);
    throw err;
  }
}

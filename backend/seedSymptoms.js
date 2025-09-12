import mongoose from "mongoose";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import Symptom from "./models/Symptom.js";

dotenv.config({ path: "./config.env" });

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URL;

async function seedSymptoms() {
  try {
    await mongoose.connect(mongoUri);
    console.log("✅ Kết nối MongoDB thành công");

    const data = JSON.parse(readFileSync("symptoms.json", "utf-8"));

    for (const s of data) {
      const exists = await Symptom.findOne({ reply: s.reply });
      if (!exists) {
        await Symptom.create(s);
        console.log("➕ Thêm triệu chứng:", s.reply);
      } else {
        console.log("✅ Đã tồn tại:", s.reply);
      }
    }

    console.log("🎉 Seed symptoms xong!");
    process.exit();
  } catch (err) {
    console.error("❌ Lỗi seed:", err.message);
    process.exit(1);
  }
}

seedSymptoms();

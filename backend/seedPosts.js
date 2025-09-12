import mongoose from "mongoose";
import { readFileSync } from "fs";
import dotenv from "dotenv";
import Post from "./models/Post.js";

dotenv.config({ path: "./config.env" });

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URL;

async function seedPosts() {
  try {
    await mongoose.connect(mongoUri);
    console.log("✅ Kết nối MongoDB thành công");

    const data = JSON.parse(readFileSync("posts.json", "utf-8"));

    for (const p of data) {
      const exists = await Post.findOne({ slug: p.slug });
      if (!exists) {
        await Post.create(p);
        console.log("➕ Đã thêm:", p.title);
      } else {
        console.log("✅ Đã tồn tại:", p.title);
      }
    }

    console.log("🎉 Seed posts xong!");
    process.exit();
  } catch (err) {
    console.error("❌ Lỗi seed:", err.message);
    process.exit(1);
  }
}

seedPosts();

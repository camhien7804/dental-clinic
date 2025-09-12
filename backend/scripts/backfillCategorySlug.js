// backend/scripts/backfillCategorySlug.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Service from "../models/Service.js";

dotenv.config({ path: "./config.env" }); // hoặc .env nếu bạn đặt tên khác

function slugify(text = "") {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

async function run() {
  if (!process.env.MONGO_URI) {
    console.error("Missing MONGO_URI in config.env. Thêm MONGO_URI vào backend/config.env");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI, {});

  console.log("Connected to MongoDB — starting backfill...");
  const services = await Service.find({});
  let count = 0;
  for (const s of services) {
    const needs = (!s.categorySlug || s.categorySlug === "");
    if (needs) {
      s.categorySlug = slugify(s.category || s.name || "");
      await s.save();
      count++;
      console.log("Updated:", s._id.toString(), "=>", s.categorySlug);
    }
  }
  console.log(`Done. Updated ${count} documents.`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("Backfill failed:", err);
  process.exit(1);
});

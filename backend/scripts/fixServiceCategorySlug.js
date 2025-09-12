// backend/scripts/fixServiceCategorySlug.js
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), "backend/config.env") });

import mongoose from "mongoose";
import Service from "../models/Service.js";

function slugify(text = "") {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
}

async function main(){
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URL || process.env.MONGODB;
  if(!mongoUri) {
    console.error("Missing MONGO_URI/MONGODB_URL in backend/config.env");
    process.exit(1);
  }
  await mongoose.connect(mongoUri);
  const services = await Service.find({});
  let updated = 0;
  for (const s of services) {
    const slug = s.slug || slugify(s.name || s.title || s.code || "");
    const catSlug = s.categorySlug || (s.category ? slugify(s.category) : "");
    const changes = {};
    if (!s.slug || s.slug !== slug) changes.slug = slug;
    if (!s.categorySlug || s.categorySlug !== catSlug) changes.categorySlug = catSlug;
    if (Object.keys(changes).length) {
      await Service.findByIdAndUpdate(s._id, changes);
      updated++;
      console.log("Updated", s._id.toString(), changes);
    }
  }
  console.log("Done. Updated:", updated);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });

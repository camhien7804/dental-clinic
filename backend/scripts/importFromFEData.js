import 'dotenv/config';
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import crypto from "crypto";

import { dbConnection } from "../database/dbConnection.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
import Role from "../models/Role.js";
import DentistProfile from "../models/DentistProfile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARGS = process.argv.slice(2);
const DRY_RUN = process.env.DRY_RUN === "true" || ARGS.includes("--dry-run");
const UPLOAD_IMAGES = process.env.UPLOAD_IMAGES === "true" || ARGS.includes("--upload");
const FORCE_LOCAL = ARGS.includes("--local");

let cloudinary = null;
if (UPLOAD_IMAGES && !FORCE_LOCAL) {
  try {
    /* lazy import to avoid failure when not configured */
    const mod = await import("cloudinary");
    cloudinary = mod.v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  } catch (err) {
    console.warn("Cloudinary module not available or not configured. Falling back to local copy.", err.message);
    cloudinary = null;
  }
}

function randPass() {
  return "Dentist@" + crypto.randomBytes(3).toString("hex");
}

async function ensureRoles() {
  const names = ["Admin", "Dentist", "Patient"];
  for (const n of names) {
    if (DRY_RUN) {
      console.log("[DRY RUN] ensure role:", n);
      continue;
    }
    await Role.updateOne({ name: n }, { name: n }, { upsert: true });
  }
}

async function uploadOrCopyImage(srcPath, folder, slug, backendPublic) {
  // srcPath: absolute path on disk
  if (!srcPath || !fs.existsSync(srcPath)) return null;

  if (UPLOAD_IMAGES && cloudinary && !FORCE_LOCAL) {
    const res = await cloudinary.uploader.upload(srcPath, { folder });
    return res.secure_url;
  } else {
    // copy to backend public folder
    const relDestDir = path.join("images", folder);
    const destDir = path.join(backendPublic, relDestDir);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    const ext = path.extname(srcPath) || ".jpg";
    const destName = `${slug}${ext}`;
    const destPath = path.join(destDir, destName);
    fs.copyFileSync(srcPath, destPath);
    return `/${path.join(relDestDir, destName).replace(/\\/g, "/")}`;
  }
}

async function importServices(servicesArray, options) {
  const { FE_PUBLIC_PATH, BACKEND_PUBLIC_PATH } = options;
  let created = 0, updated = 0, skipped = 0;
  for (const s of servicesArray) {
    try {
      const slug = s.slug || s.id || (s.title && s.title.toLowerCase().replace(/\s+/g, "-"));
      const name = s.title || s.name || s.title || "Không tên";
      const payload = {
        name,
        title: s.title || s.name || name,
        slug,
        category: s.category || s.category || "Khác",
        minPrice: Number(s.priceMin ?? s.price ?? s.minPrice ?? 0),
        maxPrice: Number(s.priceMax ?? s.price ?? s.maxPrice ?? (s.priceMin ?? 0)),
        durationMins: s.durationMins || 30,
        detail: s.detail || {},
        tags: s.tags || [],
        image: s.image || s.detail?.gallery?.[0] || "",
        description: s.description || "",
        isActive: s.isActive == null ? true : !!s.isActive
      };

      // Preserve services.detail.content unchanged (already in payload.detail)
      // Normalize image path
      if (payload.image && !/^https?:\/\//i.test(payload.image)) {
        const candidate = path.resolve(FE_PUBLIC_PATH, payload.image.replace(/^\/+/,""));
        if (fs.existsSync(candidate)) {
          if (DRY_RUN) {
            console.log("[DRY RUN] Would upload/copy", candidate);
          } else {
            const result = await uploadOrCopyImage(candidate, "services", slug, BACKEND_PUBLIC_PATH);
            if (result) payload.image = result;
          }
        }
      }

      if (DRY_RUN) {
        console.log("[DRY RUN] Service upsert:", slug, payload.name);
        continue;
      }

      const existing = await Service.findOne({ slug });
      if (existing) {
        await Service.findByIdAndUpdate(existing._id, payload, { new: true, runValidators: true });
        updated++;
      } else {
        await Service.create(payload);
        created++;
      }
    } catch (err) {
      console.error("service import error", err.message);
      skipped++;
    }
  }
  return { created, updated, skipped };
}

async function importDoctors(doctorsArray, options) {
  const { FE_PUBLIC_PATH, BACKEND_PUBLIC_PATH } = options;
  let created = 0, updated = 0, skipped = 0;
  for (const d of doctorsArray) {
    try {
      const email = d.email || `${(d.slug || d.name || "no-name").toLowerCase().replace(/\s+/g,".")}@local`;
      const name = d.name || d.title || "Bác sĩ";
      const slug = d.slug || (name && name.toLowerCase().replace(/\s+/g,"-"));
      let avatarUrl = d.avatar || d.image || "";

      if (avatarUrl && !/^https?:\/\//i.test(avatarUrl)) {
        const candidate = path.resolve(FE_PUBLIC_PATH, avatarUrl.replace(/^\/+/,""));
        if (fs.existsSync(candidate)) {
          if (DRY_RUN) {
            console.log("[DRY RUN] Would upload/copy avatar", candidate);
          } else {
            const result = await uploadOrCopyImage(candidate, "doctors", slug, BACKEND_PUBLIC_PATH);
            if (result) avatarUrl = result;
          }
        }
      }

      if (DRY_RUN) {
        console.log("[DRY RUN] Dentist upsert:", name, email);
        continue;
      }

      // find existing by slug -> profile, else by email -> user
      let profile = await DentistProfile.findOne({ slug });
      let user = null;
      if (profile) user = await User.findById(profile.user);

      if (!user) user = await User.findOne({ email });

      if (!user) {
        const dentistRole = await Role.findOne({ name: "Dentist" }) || await Role.create({ name: "Dentist" });
        const pwd = randPass();
        const u = new User({ name, email, role: dentistRole._id, passwordHash: "tmp" });
        await u.setPassword(pwd);
        await u.save();

        const newProfile = {
          user: u._id,
          specialization: d.shortIntro || d.specialization || "",
          phone: d.phone || "",
          slug,
          avatar: avatarUrl || "",
          bullets: d.bullets || [],
          shortIntro: d.shortIntro || d.title || ""
        };

        await DentistProfile.updateOne({ user: u._id }, newProfile, { upsert: true });
        created++;
        console.log(`Created dentist ${email} with temp password: ${pwd}`);
      } else {
        const pid = profile ? profile._id : (await DentistProfile.findOne({ user: user._id }))?._id;
        const updateObj = {
          specialization: d.shortIntro || d.specialization || "",
          phone: d.phone || "",
          slug,
          avatar: avatarUrl || undefined,
          bullets: Array.isArray(d.bullets) ? d.bullets : (d.bullets ? [d.bullets] : []),
          shortIntro: d.shortIntro || d.title || ""
        };
        if (pid) {
          await DentistProfile.findByIdAndUpdate(pid, updateObj, { new: true, upsert: true });
        } else {
          updateObj.user = user._id;
          await DentistProfile.create(updateObj);
        }
        updated++;
      }
    } catch (err) {
      console.error("doctor import error", err.message);
      skipped++;
    }
  }
  return { created, updated, skipped };
}

function pathToFileURL(p) {
  const resolved = path.resolve(p);
  return new URL(`file://${resolved}`);
}

async function loadFEData(SERVICES_FILE, DOCTORS_FILE) {
  let services = [], doctors = [];
  try {
    const modS = await import(pathToFileURL(SERVICES_FILE).href);
    services = modS.services || modS.default || [];
  } catch (err) {
    console.warn("Không load được services file:", SERVICES_FILE, err.message);
  }
  try {
    const modD = await import(pathToFileURL(DOCTORS_FILE).href);
    doctors = modD.doctors || modD.default || [];
  } catch (err) {
    console.warn("Không load được doctors file:", DOCTORS_FILE, err.message);
  }
  return { services, doctors };
}

async function main() {
  const FE_SRC_DIR = process.env.FE_BASE_PATH || path.resolve(__dirname, "../../frontend/src/data");
  const FE_PUBLIC_PATH = process.env.FE_PUBLIC_PATH || path.resolve(__dirname, "../../frontend/public");
  const BACKEND_PUBLIC_PATH = process.env.BE_PUBLIC_PATH || path.resolve(__dirname, "../public");

  const SERVICES_FILE = path.resolve(FE_SRC_DIR, "services.js");
  const DOCTORS_FILE = path.resolve(FE_SRC_DIR, "doctors.js");

  console.log("DRY_RUN:", DRY_RUN, "UPLOAD_IMAGES:", UPLOAD_IMAGES, "FORCE_LOCAL:", FORCE_LOCAL);

  console.log("Connect DB...");
  await dbConnection(); // expects process.env.MONGO_URI
  console.log("Ensure roles...");
  await ensureRoles();

  console.log("Loading FE data from", SERVICES_FILE, DOCTORS_FILE);
  const { services, doctors } = await loadFEData(SERVICES_FILE, DOCTORS_FILE);

  if ((!services || services.length === 0) && (!doctors || doctors.length === 0)) {
    console.error("Không tìm thấy dữ liệu FE. Kiểm tra biến FE_BASE_PATH và đường dẫn file.");
    process.exit(1);
  }

  if (services && services.length) {
    console.log(`Importing ${services.length} services...`);
    const res = await importServices(services, { FE_PUBLIC_PATH, BACKEND_PUBLIC_PATH });
    console.log("Services result:", res);
  }

  if (doctors && doctors.length) {
    console.log(`Importing ${doctors.length} doctors...`);
    const res2 = await importDoctors(doctors, { FE_PUBLIC_PATH, BACKEND_PUBLIC_PATH });
    console.log("Doctors result:", res2);
  }

  console.log("Done.");
  process.exit(0);
}

main().catch(err => {
  console.error("Import script error:", err);
  process.exit(1);
});

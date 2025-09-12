import mongoose from "mongoose";
import dotenv from "dotenv";
import Role from "../models/Role.js";

dotenv.config({ path: "./config.env" });

const seedRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    await Role.deleteMany();

    const roles = [
      {
        name: "Admin",
        permissions: [
          "APPOINTMENT_MANAGE_ALL",
          "USER_MANAGE",
          "SERVICE_MANAGE",
          "DENTIST_MANAGE"
        ],
      },
      {
        name: "Dentist",
        permissions: [
          "APPOINTMENT_VIEW_ASSIGNED",
          "APPOINTMENT_CONFIRM"
        ],
      },
      {
        name: "Patient",
        permissions: [
          "APPOINTMENT_CREATE",
          "APPOINTMENT_VIEW_SELF"
        ],
      },
    ];

    await Role.insertMany(roles);
    console.log("✅ Roles seeded thành công!");
    process.exit();
  } catch (err) {
    console.error("❌ Lỗi khi seed:", err);
    process.exit(1);
  }
};

seedRoles();

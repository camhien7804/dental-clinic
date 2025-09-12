import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import Role from "../models/Role.js";
import User from "../models/User.js";

dotenv.config({ path: "./config.env" });

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    await User.deleteMany();

    const adminRole = await Role.findOne({ name: "Admin" });
    const dentistRole = await Role.findOne({ name: "Dentist" });
    const patientRole = await Role.findOne({ name: "Patient" });

    const hashPassword = async (pw) => {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(pw, salt);
    };

    await User.create([
      { name: "Super Admin", email: "admin@demo.com", passwordHash: await hashPassword("123456"), role: adminRole._id },
      { name: "Dr. A", email: "dentist@demo.com", passwordHash: await hashPassword("123456"), role: dentistRole._id },
      { name: "Patient B", email: "patient@demo.com", passwordHash: await hashPassword("123456"), role: patientRole._id }
    ]);

    console.log("✅ Seed Users thành công");
    process.exit();
  } catch (err) {
    console.error("❌ Lỗi seed:", err);
    process.exit(1);
  }
};

seedUsers();

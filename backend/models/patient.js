// models/patient.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: { type: String, enum: ["Nam", "Nữ", "Khác", "Male", "Female"], default: "Nam" },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  passwordHash: { type: String, required: true },
  dob: { type: Date },
  address: { type: String, trim: true }, // ✅ thêm địa chỉ
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
}, { timestamps: true });

patientSchema.methods.setPassword = async function (pw) {
  this.passwordHash = await bcrypt.hash(pw, 10);
};

patientSchema.methods.verifyPassword = function (pw) {
  return bcrypt.compare(pw, this.passwordHash);
};

export default mongoose.models.Patient || mongoose.model("Patient", patientSchema);

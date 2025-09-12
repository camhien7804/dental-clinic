//models/PatientProfile.js
import mongoose from "mongoose";

const patientProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  gender: { type: String, enum: ["Nam", "Nữ", "Khác"], default: "Nam" },
  phone: { type: String },
  dob: { type: Date },
  address: { type: String }
}, { timestamps: true });

export default mongoose.models.PatientProfile || mongoose.model("PatientProfile", patientProfileSchema);

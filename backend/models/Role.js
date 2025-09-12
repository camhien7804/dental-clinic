//models/Role.js
import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Admin | Dentist | Patient
  permissions: [{ type: String }] // danh sách quyền
}, { timestamps: true });

export default mongoose.models.Role || mongoose.model("Role", roleSchema);

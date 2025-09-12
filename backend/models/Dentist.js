import mongoose from "mongoose";
import bcrypt from "bcrypt";

const dentistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  avatarUrl: { type: String },
  workingDays: [String],
  workingHours: {
    start: { type: String },
    end: { type: String }
  },
  passwordHash: { type: String },  // cần để login
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" }, // 🔑 thêm dòng này
  createdAt: { type: Date, default: Date.now }
});

// Thêm method để setPassword
dentistSchema.methods.setPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(password, salt);
};

// Verify password
dentistSchema.methods.verifyPassword = async function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

const Dentist = mongoose.models.Dentist || mongoose.model("Dentist", dentistSchema);
export default Dentist;
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const dentistProfileSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    specialization: { type: String },
    experience: { type: Number },
    phone: { type: String },
    address: { type: String },
    clinic: { type: Schema.Types.ObjectId, ref: "Clinic" },

    // Thông tin hiển thị
    slug: { type: String, trim: true, lowercase: true, index: true },
    avatar: { type: String }, 
    bullets: [{ type: String }],
    shortIntro: { type: String },
    region: { type: String },
    title: { type: String },

    // Lịch làm việc
    workDays: {
      type: [String],
      enum: DAYS,
      default: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },
    workStart: { type: String, default: "08:00" },
    workEnd: { type: String, default: "17:00" },
  },
  { timestamps: true }
);

export default mongoose.models.DentistProfile || model("DentistProfile", dentistProfileSchema);
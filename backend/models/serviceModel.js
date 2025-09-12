import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên dịch vụ là bắt buộc"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    category: {
      type: String,
      enum: ["Khám tổng quát", "Điều trị", "Thẩm mỹ", "Khác"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    promotion: {
      type: String, // ví dụ: "Giảm 20% tháng 9"
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);

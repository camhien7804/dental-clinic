import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tiêu đề là bắt buộc"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      default: "Nha Khoa Parkway",
    },
    category: {
      type: String,
      enum: ["Kiến thức nha khoa", "Tin tức", "Khuyến mãi"],
      required: true,
    },
    tags: [String],
    thumbnail: {
      type: String, // link ảnh cloudinary
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);

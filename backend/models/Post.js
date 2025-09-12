import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    summary: { type: String, trim: true },
    content: { type: String, required: true },
    image: { type: String, default: "" }, // URL ảnh (Cloudinary hoặc local)
    tags: { type: [String], default: [] },
    slug: { type: String, unique: true, index: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// auto slug từ title
postSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }
  next();
});

export default mongoose.models.Post || mongoose.model("Post", postSchema);

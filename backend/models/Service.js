//backend/models/Service.js
import mongoose from "mongoose";

/**
 * Simple slugify that strips diacritics, non-alphanum and replaces spaces with '-'
 */
function slugify(str = "") {
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    title: { type: String, trim: true }, // optional alternative field from FE
    code: { type: String, trim: true, index: true, unique: false, sparse: true },
    slug: { type: String, trim: true, index: true },
    category: { type: String, trim: true, default: "" }, // display name
    categorySlug: { type: String, trim: true, default: "" }, // slug for routing/filter
    description: { type: String, default: "" },

    minPrice: { type: Number, default: 0 },
    maxPrice: { type: Number, default: 0 },
    durationMins: { type: Number, default: 30 },

    // ✅ thêm trường giảm giá
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },

    image: { type: String, default: "" },
    gallery: { type: [String], default: [] },

    isActive: { type: Boolean, default: true },

    // ✅ tags: ví dụ ["bán chạy", "khuyến mãi"]
    tags: { type: [String], default: [] },

    // flexible detail (rich content, sections, etc.)
    detail: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: "__v",
  }
);

// Ensure slug and categorySlug exist before validate/save
serviceSchema.pre("validate", function (next) {
  try {
    if (!this.slug && this.name) {
      this.slug = slugify(this.name);
    }
    if ((!this.categorySlug || this.categorySlug === "") && this.category) {
      this.categorySlug = slugify(this.category);
    }
  } catch (err) {
    console.error("serviceSchema.pre(validate) error:", err);
  }
  next();
});

// Optional: virtual to show display name (prefer title then name)
serviceSchema.virtual("displayName").get(function () {
  return this.title || this.name;
});

// Ensure toJSON includes virtuals
serviceSchema.set("toJSON", { virtuals: true });
serviceSchema.set("toObject", { virtuals: true });

const Service =
  mongoose.models.Service || mongoose.model("Service", serviceSchema);
export default Service;

// backend/controllers/serviceController.js
import Service from "../models/Service.js";
import cloudinary from "../config/cloudinary.js";

/* helper simple slugify (vi -> ascii, lowercase, replace spaces -> -) */
function slugify(text = "") {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
}

// ✅ Configure cloudinary from env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function getAllServices(req, res) {
  try {
    const { category, categorySlug, active, q } = req.query;
    const qObj = {};

    if (typeof active !== "undefined") qObj.isActive = active === "true";

    if (categorySlug) {
      qObj.categorySlug = categorySlug;
    } else if (category) {
      const maybeSlug = slugify(category);
      qObj.$or = [
        { categorySlug: maybeSlug },
        { category: new RegExp(`^${category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
      ];
    }

    if (q) qObj.name = new RegExp(q, "i");

    const services = await Service.find(qObj).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, data: services });
  } catch (err) {
    console.error("getAllServices:", err);
    return res.status(500).json({ success: false, message: "Lỗi lấy danh sách dịch vụ", error: err.message });
  }
}

// Support lookup by id OR slug in URL param
export async function getServiceByIdOrSlug(req, res) {
  try {
    const idOrSlug = req.params.id;
    let service = null;

    if (/^[0-9a-fA-F]{24}$/.test(idOrSlug)) {
      service = await Service.findById(idOrSlug).lean();
    }
    if (!service) {
      service = await Service.findOne({ slug: idOrSlug }).lean();
    }
    if (!service) return res.status(404).json({ success: false, message: "Không tìm thấy dịch vụ" });
    return res.json({ success: true, data: service });
  } catch (err) {
    console.error("getServiceByIdOrSlug:", err);
    return res.status(500).json({ success: false, message: "Lỗi lấy dịch vụ", error: err.message });
  }
}

// Backward-compatible alias if router expects getServiceById
export const getServiceById = getServiceByIdOrSlug;

export async function createService(req, res) {
  try {
    const {
      name,
      code,
      description,
      category,       // human readable
      categorySlug,   // prefer slug if supplied
      durationMins,
    } = req.body;

    let minPrice = req.body.minPrice ?? req.body.price ?? null;
    let maxPrice = req.body.maxPrice ?? req.body.price ?? null;
    if (minPrice != null) minPrice = Number(minPrice);
    if (maxPrice != null) maxPrice = Number(maxPrice);

    const finalName = name || req.body.title || "Không tên";
    const slug = slugify(req.body.slug || finalName);
    const finalCategorySlug = categorySlug || (category ? slugify(category) : "");

    let imageUrl = req.body.image || "";
    if (req.files && req.files.image) {
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
        const tmp = req.files.image;
        const uploadRes = await cloudinary.uploader.upload(tmp.tempFilePath, { folder: "services" });
        imageUrl = uploadRes.secure_url;
      } else {
        console.warn("⚠️ Cloudinary not configured — image file received but not uploaded.");
      }
    }

    const payload = {
      name: finalName,
      code,
      description: description || "",
      category: category || (finalCategorySlug ? finalCategorySlug.replace(/-/g, " ") : ""),
      categorySlug: finalCategorySlug,
      minPrice: minPrice != null ? minPrice : 0,
      maxPrice: maxPrice != null ? maxPrice : 0,
      durationMins: Number(durationMins || 30),
      image: imageUrl || "",
      slug,
      isActive: req.body.isActive == null ? true : req.body.isActive === "true" || req.body.isActive === true
    };

    const created = await Service.create(payload);
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error("createService error:", err);
    if (err.code === 11000) return res.status(409).json({ success: false, message: "Mã (code) hoặc slug đã tồn tại" });
    return res.status(500).json({ success: false, message: "Lỗi tạo dịch vụ", error: err.message });
  }
}

export async function updateService(req, res) {
  try {
    const id = req.params.id;
    const body = { ...req.body };

    if (body.name && !body.slug) body.slug = slugify(body.name);
    if (body.category && !body.categorySlug) body.categorySlug = slugify(body.category);

    if (req.files && req.files.image) {
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
        const tmp = req.files.image;
        const uploadRes = await cloudinary.uploader.upload(tmp.tempFilePath, { folder: "services" });
        body.image = uploadRes.secure_url;
      } else {
        console.warn("⚠️ Cloudinary not configured — image file received but not uploaded.");
      }
    }

    const updated = await Service.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: "Không tìm thấy dịch vụ" });
    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error("updateService error:", err);
    return res.status(500).json({ success: false, message: "Lỗi cập nhật dịch vụ", error: err.message });
  }
}

export async function deleteService(req, res) {
  try {
    const id = req.params.id;
    const deleted = await Service.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Không tìm thấy dịch vụ để xóa" });
    return res.json({ success: true, message: "Đã xóa dịch vụ" });
  } catch (err) {
    console.error("deleteService:", err);
    return res.status(500).json({ success: false, message: "Lỗi xóa dịch vụ", error: err.message });
  }
}

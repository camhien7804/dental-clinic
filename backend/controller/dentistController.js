// backend/controller/dentistController.js
import DentistProfile from "../models/DentistProfile.js";
import User from "../models/User.js";
import Role from "../models/Role.js";
import { uploadFileObject } from "../utils/upload.js";

/** 📌 Create dentist (Admin) */
export const createDentist = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      specialization,
      phone,
      address,
      slug,
      region,
      title,
      shortIntro,
      bullets,
      workDays,
      workStart,
      workEnd,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" });
    }

    // Check email tồn tại
    const existed = await User.findOne({ email });
    if (existed) {
      return res.status(409).json({ success: false, message: "Email đã tồn tại" });
    }

    // Tạo user với role Dentist
    const dentistRole = await Role.findOne({ name: "Dentist" });
    const user = new User({ name, email, role: dentistRole._id, passwordHash: "tmp" });
    await user.setPassword(password);
    await user.save();

    let avatar = req.body.avatarPath || "";

    // Upload avatar nếu có file
    try {
      const fileObj =
        (req.files && (req.files.image || req.files.avatar || req.files.file)) || null;
      if (fileObj) {
        const uploaded = await uploadFileObject(fileObj, { folder: "doctors" });
        if (uploaded) avatar = uploaded;
      } else if (req.file && req.file.buffer) {
        const uploaded = await uploadFileObject(req.file, { folder: "doctors" });
        if (uploaded) avatar = uploaded;
      }
    } catch (err) {
      console.error("createDentist upload error:", err);
      return res.status(500).json({
        success: false,
        message: "Không upload được ảnh",
        error: err.message,
      });
    }

    const profile = new DentistProfile({
      user: user._id,
      specialization,
      phone,
      address,
      slug: slug || String(name).toLowerCase().replace(/\s+/g, "-"),
      avatar,
      bullets: Array.isArray(bullets)
        ? bullets
        : bullets
        ? [bullets]
        : [],
      shortIntro,
      region,
      title,
      workDays: Array.isArray(workDays) ? workDays : [],
      workStart: workStart || "08:00",
      workEnd: workEnd || "17:00",
    });

    await profile.save();

    return res.status(201).json({
      success: true,
      message: "Tạo bác sĩ thành công",
      data: { user, profile },
    });
  } catch (err) {
    console.error("createDentist error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: err.message });
  }
};

/** 📌 Update dentist (Admin) */
export const updateDentist = async (req, res) => {
  try {
    const { id } = req.params;
    const body = { ...req.body };

    // Upload avatar nếu có file
    try {
      const fileObj =
        (req.files && (req.files.image || req.files.avatar)) || null;
      if (fileObj) {
        const uploaded = await uploadFileObject(fileObj, { folder: "doctors" });
        if (uploaded) body.avatar = uploaded;
      } else if (req.file && req.file.buffer) {
        const uploaded = await uploadFileObject(req.file, { folder: "doctors" });
        if (uploaded) body.avatar = uploaded;
      }
    } catch (err) {
      console.error("updateDentist upload error:", err);
      return res.status(500).json({
        success: false,
        message: "Không upload được ảnh",
        error: err.message,
      });
    }

    // parse bullets
    if (body.bullets && typeof body.bullets === "string") {
      try {
        body.bullets = JSON.parse(body.bullets);
      } catch {
        body.bullets = body.bullets.split("\n");
      }
    }

    // đảm bảo workDays là array
    if (body.workDays && typeof body.workDays === "string") {
      try {
        body.workDays = JSON.parse(body.workDays);
      } catch {
        body.workDays = body.workDays.split(",").map((d) => d.trim());
      }
    }

    const profile = await DentistProfile.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!profile) {
      return res.status(404).json({ success: false, message: "Không tìm thấy bác sĩ" });
    }

    return res.json({ success: true, message: "Cập nhật thành công", data: profile });
  } catch (err) {
    console.error("updateDentist error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: err.message });
  }
};

/** 📌 Get all dentists (public) */
export const getAllDentists = async (_req, res) => {
  try {
    const dentists = await DentistProfile.find()
      .populate("user", "name email")
      .lean();
    return res.json({ success: true, data: dentists });
  } catch (err) {
    console.error("getAllDentists error:", err);
    return res.status(500).json({ success: false, message: "Lỗi", error: err.message });
  }
};

/** 📌 Delete dentist (Admin) */
export const deleteDentist = async (req, res) => {
  try {
    const profile = await DentistProfile.findByIdAndDelete(req.params.id);
    if (!profile) {
      return res.status(404).json({ success: false, message: "Không tìm thấy bác sĩ" });
    }
    await User.findByIdAndDelete(profile.user);
    return res.json({ success: true, message: "Đã xóa bác sĩ" });
  } catch (err) {
    console.error("deleteDentist error:", err);
    return res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};

/** 📌 Update work schedule (Admin) */
export const updateWorkSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { workDays, workStart, workEnd } = req.body;

    const profile = await DentistProfile.findByIdAndUpdate(
      id,
      {
        workDays: Array.isArray(workDays) ? workDays : [],
        workStart: workStart || "08:00",
        workEnd: workEnd || "17:00",
      },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({ success: false, message: "Không tìm thấy bác sĩ" });
    }

    return res.json({ success: true, message: "Cập nhật lịch làm việc thành công", data: profile });
  } catch (err) {
    console.error("updateWorkSchedule error:", err);
    return res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};

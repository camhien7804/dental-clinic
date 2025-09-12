// backend/controllers/userAdminController.js
import User from "../models/User.js";
import Role from "../models/Role.js";

/** Lấy danh sách user */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().populate("role", "name");
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};

/** Tạo user mới (Admin thêm) */
export const createUser = async (req, res) => {
  try {
    const { name, email, password, roleName } = req.body;
    if (!name || !email || !password || !roleName) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin" });
    }

    const existed = await User.findOne({ email });
    if (existed) return res.status(409).json({ success: false, message: "Email đã tồn tại" });

    const role = await Role.findOne({ name: roleName });
    if (!role) return res.status(400).json({ success: false, message: "Role không hợp lệ" });

    const user = new User({ name, email, role: role._id, passwordHash: "tmp" });
    await user.setPassword(password);
    await user.save();

    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};

/** Cập nhật user */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, roleName } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy user" });

    if (name) user.name = name;
    if (roleName) {
      const role = await Role.findOne({ name: roleName });
      if (role) user.role = role._id;
    }
    await user.save();

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};

/** Xóa user */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy user" });
    res.json({ success: true, message: "Đã xóa user" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};

// controller/adminController.js
import Admin from "../models/Admin.js";
import Role from "../models/Role.js";
import { signLogin, sendAuthCookie } from "../utils/jwtToken.js";

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Thiếu thông tin" });
    }

    const existed = await Admin.findOne({ email });
    if (existed) return res.status(409).json({ message: "Email đã tồn tại" });

    const role = await Role.findOne({ name: "Admin" });
    const admin = new Admin({ name, email, passwordHash: "tmp", role: role._id });
    await admin.setPassword(password);
    await admin.save();

    const token = signLogin(admin);
    return sendAuthCookie(res, token, "Admin", 201, {
      id: admin._id,
      name: admin.name,
      role: "Admin",
      email: admin.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email }).populate("role");
    if (!admin || !(await admin.verifyPassword(password))) {
      return res.status(400).json({ message: "Email hoặc mật khẩu sai" });
    }

    const token = signLogin(admin);
    return sendAuthCookie(res, token, "Admin", 200, {
      id: admin._id,
      name: admin.name,
      role: "Admin",
      email: admin.email,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

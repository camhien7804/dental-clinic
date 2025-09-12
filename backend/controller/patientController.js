// controllers/patientController.js
import Patient from "../models/patient.js";
import Role from "../models/Role.js";
import { signLogin, sendAuthCookie } from "../utils/jwtToken.js";

/**
 * 📌 Lấy thông tin bệnh nhân hiện tại (dựa vào token)
 */
export const me = async (req, res) => {
  try {
    const p = await Patient.findById(req.user.id)
      .populate("role", "name permissions")
      .select("_id name email role phone gender dob address");
    
    if (!p) {
      return res.status(404).json({ success: false, message: "Không tìm thấy bệnh nhân" });
    }

    res.json({ success: true, user: p });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};

/**
 * 📌 Đăng ký tài khoản Patient
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, gender, phone, dob, address } = req.body;

    // validate cơ bản
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" });
    }

    // check trùng email
    const existed = await Patient.findOne({ email });
    if (existed) {
      return res.status(409).json({ success: false, message: "Email đã tồn tại" });
    }

    // lấy role Patient
    const patientRole = await Role.findOne({ name: "Patient" });
    if (!patientRole) {
      return res.status(500).json({ success: false, message: "Role Patient chưa được seed" });
    }

    // tạo Patient mới
    const p = new Patient({
      name,
      email,
      gender,
      phone,
      dob,
      address,
      passwordHash: "tmp", // placeholder
      role: patientRole._id,
    });

    await p.setPassword(password);
    await p.save();

    const token = signLogin(p);

    return sendAuthCookie(res, token, "Patient", 201, {
      id: p._id,
      name: p.name,
      email: p.email,
      role: "Patient",
      phone: p.phone,
      gender: p.gender,
      dob: p.dob,
      address: p.address,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};

/**
 * 📌 Login Patient
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" });
    }

    const p = await Patient.findOne({ email }).populate("role");
    if (!p || !(await p.verifyPassword(password))) {
      return res.status(400).json({ success: false, message: "Email hoặc mật khẩu không đúng" });
    }

    const token = signLogin(p);

    return sendAuthCookie(res, token, "Patient", 200, {
      id: p._id,
      name: p.name,
      email: p.email,
      role: "Patient",
      phone: p.phone,
      gender: p.gender,
      dob: p.dob,
      address: p.address,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};

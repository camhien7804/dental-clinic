// backend/controllers/authController.js
import crypto from "crypto";
import User from "../models/User.js";
import Role from "../models/Role.js";
import PatientProfile from "../models/PatientProfile.js";
import DentistProfile from "../models/DentistProfile.js";
import { signLogin, sendAuthCookie } from "../utils/jwtToken.js";
import { sendMail } from "../utils/mailer.js";

/** Đăng ký Patient */
export const registerPatient = async (req, res) => {
  try {
    const { fullName, email, password, phone, dob, address, gender } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" });
    }

    const existed = await User.findOne({ email });
    if (existed) return res.status(409).json({ success: false, message: "Email đã tồn tại" });

    const patientRole = await Role.findOne({ name: "Patient" });
    if (!patientRole) return res.status(500).json({ success: false, message: "Role Patient chưa tồn tại" });

    const user = new User({ name: fullName, email, role: patientRole._id, passwordHash: "tmp" });
    await user.setPassword(password);
    await user.save();

    const profile = new PatientProfile({ user: user._id, phone, dob, address, gender });
    await profile.save();

    return res.status(201).json({ success: true, message: "Đăng ký thành công" });
  } catch (err) {
    console.error("registerPatient error:", err);
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};

/** Đăng nhập */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Thiếu thông tin" });

    const user = await User.findOne({ email }).populate("role");
    if (!user || !(await user.verifyPassword(password))) {
      return res.status(400).json({ success: false, message: "Email hoặc mật khẩu sai" });
    }

    let profile = null;
    if (user.role?.name === "Patient") profile = await PatientProfile.findOne({ user: user._id });
    if (user.role?.name === "Dentist") profile = await DentistProfile.findOne({ user: user._id });

    const token = signLogin(user, profile ? profile._id : null);

    return sendAuthCookie(res, token, user.role?.name || "User", 200, {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role?.name || "User",
      profileId: profile?._id || null,
      profile,
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};

/** Quên mật khẩu */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Vui lòng nhập email" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "Không tìm thấy tài khoản" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 phút
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL_ONE || "http://localhost:5173"}/reset-password/${token}`;

    await sendMail({
      to: user.email,
      subject: "Khôi phục mật khẩu",
      html: `<h3>Xin chào ${user.name},</h3>
             <p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào link dưới đây để tiếp tục:</p>
             <a href="${resetUrl}" target="_blank">${resetUrl}</a>
             <p>Link có hiệu lực trong 15 phút.</p>`,
    });

    res.json({ success: true, message: "Đã gửi email khôi phục" });
  } catch (err) {
    console.error("forgotPassword error:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

/** Đặt lại mật khẩu */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ success: false, message: "Token hết hạn/không hợp lệ" });

    await user.setPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ success: true, message: "Đặt lại mật khẩu thành công" });
  } catch (err) {
    console.error("resetPassword error:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

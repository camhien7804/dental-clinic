// src/pages/auth/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({
    fullName: "",
    phone: "",
    dob: "",
    email: "",
    password: "",
    confirm: "",
    address: "",
    gender: "Nam",
  });

  const submit = async (e) => {
    e.preventDefault();
    if (!f.fullName || !f.email || !f.password) {
      return alert("Vui lòng nhập đầy đủ thông tin bắt buộc");
    }
    if (f.password !== f.confirm) {
      return alert("Mật khẩu nhập lại không khớp");
    }
    try {
      setLoading(true);
      await register(f);
      alert("Đăng ký thành công, vui lòng đăng nhập");
      nav("/login", { replace: true }); // ✅ chuyển về login
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-emerald-800 mb-4">Đăng ký tài khoản</h1>
        <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
          {[
            ["fullName", "Họ tên *"],
            ["phone", "Số điện thoại *"],
            ["dob", "Ngày sinh *", "date"],
            ["email", "Email *", "email"],
            ["password", "Mật khẩu *", "password"],
            ["confirm", "Xác nhận mật khẩu *", "password"],
            ["address", "Địa chỉ"],
          ].map(([k, label, type]) => (
            <div key={k} className="md:col-span-1">
              <label className="block text-sm font-medium">{label}</label>
              <input
                type={type || "text"}
                className="w-full border rounded-lg px-3 py-2"
                value={f[k]}
                onChange={(e) => setF((s) => ({ ...s, [k]: e.target.value }))}
              />
            </div>
          ))}

          <div className="md:col-span-1">
            <label className="block text-sm font-medium">Giới tính</label>
            <select
              value={f.gender}
              onChange={(e) => setF((s) => ({ ...s, gender: e.target.value }))}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              disabled={loading}
              className={`w-full py-2 rounded-full text-white ${
                loading ? "bg-gray-300" : "bg-emerald-700 hover:bg-emerald-800"
              }`}
            >
              {loading ? "Đang xử lý…" : "Tạo tài khoản"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

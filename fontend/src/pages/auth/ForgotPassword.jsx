// src/pages/auth/ForgotPassword.jsx
import { useState } from "react";
import api from "../../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/auth/forgot-password", { email });
      alert(res.data.message || "Đã gửi mail khôi phục");
    } catch (err) {
      alert(err?.response?.data?.message || "Lỗi gửi email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h1 className="text-xl font-bold mb-4">Quên mật khẩu</h1>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            placeholder="Nhập email đã đăng ký"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            disabled={loading}
            className="w-full py-2 rounded bg-emerald-700 text-white"
          >
            {loading ? "Đang gửi…" : "Gửi mail khôi phục"}
          </button>
        </form>
      </div>
    </div>
  );
}

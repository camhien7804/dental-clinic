// src/pages/auth/ResetPassword.jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";

export default function ResetPassword() {
  const { token } = useParams();
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return alert("Mật khẩu không khớp");
    try {
      setLoading(true);
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      alert(res.data.message || "Đặt lại thành công");
      nav("/login");
    } catch (err) {
      alert(err?.response?.data?.message || "Lỗi đặt lại mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h1 className="text-xl font-bold mb-4">Đặt lại mật khẩu</h1>
        <form onSubmit={submit} className="space-y-3">
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder="Mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder="Xác nhận mật khẩu"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <button
            disabled={loading}
            className="w-full py-2 rounded bg-emerald-700 text-white"
          >
            {loading ? "Đang xử lý…" : "Cập nhật mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
}

// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const getRoleHome = (role) => {
    if (role === "Admin") return "/admin";
    if (role === "Dentist") return "/dentist";
    return "/dashboard";
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = await login(form);
      const redirectTo = sp.get("redirect");
      nav(redirectTo || getRoleHome(user?.role), { replace: true });
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-emerald-800 mb-2">Đăng nhập</h1>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              placeholder="Nhập email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Mật khẩu</label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              placeholder="Nhập mật khẩu"
            />
          </div>
          <div className="flex justify-between text-sm">
            <Link to="/forgot-password" className="text-emerald-700 hover:underline">
              Quên mật khẩu?
            </Link>
            <Link to="/register" className="text-emerald-700 hover:underline">
              Đăng ký
            </Link>
          </div>
          <button
            disabled={loading}
            className={`w-full py-2 rounded-full text-white ${
              loading ? "bg-gray-300" : "bg-emerald-700 hover:bg-emerald-800"
            }`}
          >
            {loading ? "Đang đăng nhập…" : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}

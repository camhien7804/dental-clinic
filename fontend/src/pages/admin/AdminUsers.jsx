import { useEffect, useState } from "react";
import api from "../../api"; // axios instance có token

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", roleName: "Patient" });
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data.users || []);
    } catch (err) {
      console.error("Lỗi lấy danh sách user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/users/${editingId}`, form);
      } else {
        await api.post("/admin/users", form);
      }
      setForm({ name: "", email: "", password: "", roleName: "Patient" });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      console.error("Lỗi lưu user:", err);
    }
  };

  const editUser = (user) => {
    setEditingId(user._id);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      roleName: user.role?.name || "Patient",
    });
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa user này?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Lỗi xóa user:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Quản lý người dùng</h1>

      {/* Form thêm/sửa */}
      <form onSubmit={submitForm} className="mb-6 flex gap-2 items-end">
        <input
          type="text"
          name="name"
          placeholder="Tên"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        {!editingId && (
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        )}
        <select
          name="roleName"
          value={form.roleName}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="Patient">Patient</option>
          <option value="Dentist">Dentist</option>
          <option value="Admin">Admin</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {editingId ? "Cập nhật" : "Thêm mới"}
        </button>
      </form>

      {/* Bảng danh sách */}
      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Tên</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Vai trò</th>
              <th className="border p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td className="border p-2">{u.name}</td>
                <td className="border p-2">{u.email}</td>
                <td className="border p-2">{u.role?.name}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => editUser(u)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => deleteUser(u._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import api from "../../api";
import ServicesForm from "./ServicesForm"; // ✅ dùng form đã match BE

function ServiceRow({ s, onEdit, onDelete }) {
  const id = s._id || s.id || s.slug || s.code;
  return (
    <tr className="bg-white" key={id}>
      <td className="px-4 py-3">{s.name || s.title}</td>
      <td className="px-4 py-3">{s.code}</td>
      <td className="px-4 py-3">{s.isActive ? "Bán" : "Đã ẩn"}</td>
      <td className="px-4 py-3">
        <button
          onClick={() => onEdit(s)}
          className="mr-2 px-3 py-1 border rounded"
        >
          Sửa
        </button>
        <button
          onClick={() => onDelete(s)}
          className="px-3 py-1 border rounded text-red-600"
        >
          Xóa
        </button>
      </td>
    </tr>
  );
}

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  // bộ lọc
  const [categoryFilter, setCategoryFilter] = useState("");
  const [search, setSearch] = useState("");

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get("/services");
      const data = res.data?.data || [];
      setServices(data);
      setFiltered(data);
    } catch (err) {
      console.error("fetchServices error", err);
      alert("Lỗi khi lấy danh sách dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // filter + search
  useEffect(() => {
    let result = [...services];
    if (categoryFilter) {
      result = result.filter((s) => s.categorySlug === categoryFilter);
    }
    if (search.trim()) {
      const kw = search.toLowerCase();
      result = result.filter((s) => s.name?.toLowerCase().includes(kw));
    }
    setFiltered(result);
  }, [services, categoryFilter, search]);

  const openAdd = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setOpen(true);
  };

  const handleDelete = async (s) => {
    if (!confirm("Bạn chắc muốn xóa dịch vụ này?")) return;
    try {
      await api.delete(`/services/${s._id || s.id}`);
      await fetchServices();
    } catch (err) {
      console.error("delete service error", err);
      alert("Không xóa được: " + (err?.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-emerald-800">Quản lý dịch vụ</h2>
        <button
          onClick={openAdd}
          className="px-4 py-2 rounded bg-emerald-700 text-white"
        >
          Thêm dịch vụ
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="flex gap-3 mb-4">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">-- Chọn danh mục --</option>
          <option value="trong-rang-implant">Trồng răng Implant</option>
          <option value="nieng-rang">Niềng răng</option>
          <option value="nha-khoa-tong-quat">Nha khoa tổng quát</option>
          <option value="nha-khoa-tre-em">Nha khoa trẻ em</option>
        </select>

        <input
          type="text"
          placeholder="Tìm theo tên dịch vụ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
      </div>

      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <table className="w-full bg-white rounded shadow-sm">
          <thead className="text-left">
            <tr>
              <th className="px-4 py-2">Tên</th>
              <th className="px-4 py-2">Mã</th>
              <th className="px-4 py-2">Trạng thái</th>
              <th className="px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <ServiceRow
                key={s._id || s.id || s.code}
                s={s}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  Không tìm thấy dịch vụ nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40">
          <div className="bg-white rounded-lg w-[720px] p-6 shadow-lg max-h-[85vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editing ? "Sửa dịch vụ" : "Thêm dịch vụ"}
              </h3>
              <button
                onClick={() => {
                  setOpen(false);
                  setEditing(null);
                }}
              >
                Đóng
              </button>
            </div>

            {/* ✅ Dùng ServicesForm thay cho form inline */}
            <ServicesForm
              initial={editing}
              onSaved={fetchServices}
              onClose={() => {
                setOpen(false);
                setEditing(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

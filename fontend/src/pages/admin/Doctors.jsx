// src/pages/admin/Doctors.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../../api";
import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";

const empty = { name: "", email: "", password: "", specialization: "", phone: "" };

export default function AdminDoctors() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(empty);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetDelete, setTargetDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const res = await api.get("/dentists");
      setItems(res?.data?.data || []);
    } catch (e) {
      setError(e?.response?.data?.message || "Không thể tải danh sách bác sĩ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!q) return items;
    const s = q.toLowerCase();
    return items.filter((d) =>
      (d?.user?.name || "").toLowerCase().includes(s) ||
      (d?.user?.email || "").toLowerCase().includes(s) ||
      (d?.specialization || "").toLowerCase().includes(s)
    );
  }, [items, q]);

  function openCreate() {
    setEditingId(null);
    setForm(empty);
    setModalOpen(true);
  }
  function openEdit(row) {
    setEditingId(row._id);
    setForm({
      name: row?.user?.name || "",
      email: row?.user?.email || "",
      password: "",
      specialization: row?.specialization || "",
      phone: row?.phone || ""
    });
    setModalOpen(true);
  }

  function validateForm() {
    if (!editingId && (!form.name.trim() || !form.email.trim() || !form.password.trim())) {
      return "Tên, email và mật khẩu là bắt buộc khi tạo mới.";
    }
    if (!form.name.trim()) return "Tên bắt buộc.";
    return null;
  }

  async function submit(e) {
    e?.preventDefault();
    const v = validateForm();
    if (v) return setError(v);
    setSaving(true); setError("");
    try {
      if (editingId) {
        await api.put(`/dentists/${editingId}`, {
          specialization: form.specialization,
          phone: form.phone
        });
      } else {
        await api.post("/dentists", {
          name: form.name,
          email: form.email,
          password: form.password,
          specialization: form.specialization,
          phone: form.phone
        });
      }
      setModalOpen(false);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Lỗi server");
    } finally {
      setSaving(false);
    }
  }

  function askDelete(row) {
    setTargetDelete(row);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!targetDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/dentists/${targetDelete._id}`);
      setConfirmOpen(false);
      setTargetDelete(null);
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-700">Quản lý bác sĩ</h1>
        <div className="flex items-center gap-2">
          <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Tìm kiếm..." className="px-3 py-2 border rounded-lg"/>
          <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Thêm bác sĩ</button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500">Đang tải…</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="bg-white rounded-xl border overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Tên</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">Chuyên môn</th>
                <th className="px-3 py-2 text-left">SĐT</th>
                <th className="px-3 py-2 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td className="px-3 py-6 text-gray-500" colSpan={5}>Không có dữ liệu</td></tr>
              )}
              {filtered.map(d => (
                <tr key={d._id} className="border-t">
                  <td className="px-3 py-2">{d?.user?.name}</td>
                  <td className="px-3 py-2">{d?.user?.email}</td>
                  <td className="px-3 py-2">{d?.specialization || "-"}</td>
                  <td className="px-3 py-2">{d?.phone || "-"}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button onClick={()=>openEdit(d)} className="px-3 py-1 rounded border">Sửa</button>
                      <button onClick={()=>askDelete(d)} className="px-3 py-1 rounded border text-red-600">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} title={editingId ? "Cập nhật bác sĩ" : "Thêm bác sĩ"} onClose={()=>setModalOpen(false)} size="md">
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm">Tên</label>
            <input className="w-full border rounded px-3 py-2" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})}/>
          </div>
          {!editingId && (
            <>
              <div>
                <label className="block text-sm">Email</label>
                <input className="w-full border rounded px-3 py-2" value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})}/>
              </div>
              <div>
                <label className="block text-sm">Mật khẩu</label>
                <input type="password" className="w-full border rounded px-3 py-2" value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})}/>
              </div>
            </>
          )}
          <div>
            <label className="block text-sm">Chuyên môn</label>
            <input className="w-full border rounded px-3 py-2" value={form.specialization} onChange={(e)=>setForm({...form, specialization: e.target.value})}/>
          </div>
          <div>
            <label className="block text-sm">SĐT</label>
            <input className="w-full border rounded px-3 py-2" value={form.phone} onChange={(e)=>setForm({...form, phone: e.target.value})}/>
          </div>

          {error && <div className="text-red-600">{error}</div>}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={()=>setModalOpen(false)} className="px-4 py-2 rounded border">Hủy</button>
            <button type="submit" disabled={saving} className={`px-4 py-2 rounded text-white ${saving ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700"}`}>
              {saving ? "Đang lưu..." : (editingId ? "Cập nhật" : "Thêm")}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        title="Xác nhận xóa"
        message={`Bạn có chắc muốn xóa bác sĩ "${targetDelete?.user?.name}"?`}
        onCancel={()=>setConfirmOpen(false)}
        onConfirm={confirmDelete}
        loading={deleting}
      />
    </div>
  );
}

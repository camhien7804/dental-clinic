// src/pages/admin/Inventory.jsx
import { useEffect, useState } from "react";
import api from "../../api";
import Modal from "../../components/Modal";
import ConfirmDialog from "../../components/ConfirmDialog";

const empty = { sku: "", name: "", quantity: 0, unit: "pcs", minQuantity: 0, note: "" };

export default function AdminInventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetDelete, setTargetDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/inventory");
      setItems(res?.data?.data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Không thể tải kho vật tư");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditingId(null); setForm(empty); setModalOpen(true); setErr("");
  }
  function openEdit(row) {
    setEditingId(row._id); setForm({
      sku: row.sku || "",
      name: row.name || "",
      quantity: row.quantity ?? 0,
      unit: row.unit || "pcs",
      minQuantity: row.minQuantity ?? 0,
      note: row.note || ""
    }); setModalOpen(true);
  }

  async function submit(e) {
    e?.preventDefault();
    setSaving(true); setErr("");
    if (!form.sku || !form.name) { setErr("SKU và tên là bắt buộc"); setSaving(false); return; }
    try {
      const payload = {
        sku: form.sku,
        name: form.name,
        quantity: Number(form.quantity) || 0,
        unit: form.unit,
        minQuantity: Number(form.minQuantity) || 0,
        note: form.note
      };
      if (editingId) await api.put(`/inventory/${editingId}`, payload);
      else await api.post("/inventory", payload);
      setModalOpen(false);
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    } finally { setSaving(false); }
  }

  function askDelete(row) { setTargetDelete(row); setConfirmOpen(true); }
  async function confirmDelete() {
    if (!targetDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/inventory/${targetDelete._id}`);
      setConfirmOpen(false);
      await load();
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    } finally { setDeleting(false); }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-700">Kho vật tư</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Thêm vật tư</button>
      </div>

      {loading ? <div className="text-gray-500">Đang tải…</div> : err ? <div className="text-red-600">{err}</div> : (
        <div className="bg-white rounded-xl border overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">SKU</th>
                <th className="px-3 py-2 text-left">Tên</th>
                <th className="px-3 py-2 text-left">Số lượng</th>
                <th className="px-3 py-2 text-left">Đơn vị</th>
                <th className="px-3 py-2 text-left">Tồn tối thiểu</th>
                <th className="px-3 py-2 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && <tr><td className="px-3 py-6 text-gray-500" colSpan={6}>Chưa có dữ liệu</td></tr>}
              {items.map(it => (
                <tr key={it._id} className="border-t">
                  <td className="px-3 py-2">{it.sku}</td>
                  <td className="px-3 py-2">{it.name}</td>
                  <td className="px-3 py-2">{it.quantity}</td>
                  <td className="px-3 py-2">{it.unit}</td>
                  <td className="px-3 py-2">{it.minQuantity}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-2">
                      <button onClick={()=>openEdit(it)} className="px-3 py-1 rounded border">Sửa</button>
                      <button onClick={()=>askDelete(it)} className="px-3 py-1 rounded border text-red-600">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={()=>setModalOpen(false)} title={editingId ? "Cập nhật vật tư" : "Thêm vật tư"}>
        <form onSubmit={submit} className="space-y-3">
          <div><label className="block text-sm">SKU</label><input className="w-full border rounded px-3 py-2" value={form.sku} onChange={(e)=>setForm({...form, sku:e.target.value})}/></div>
          <div><label className="block text-sm">Tên</label><input className="w-full border rounded px-3 py-2" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})}/></div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="block text-sm">Số lượng</label><input type="number" className="w-full border rounded px-3 py-2" value={form.quantity} onChange={(e)=>setForm({...form, quantity:e.target.value})}/></div>
            <div><label className="block text-sm">Đơn vị</label><input className="w-full border rounded px-3 py-2" value={form.unit} onChange={(e)=>setForm({...form, unit:e.target.value})}/></div>
            <div><label className="block text-sm">Tồn tối thiểu</label><input type="number" className="w-full border rounded px-3 py-2" value={form.minQuantity} onChange={(e)=>setForm({...form, minQuantity:e.target.value})}/></div>
          </div>
          <div><label className="block text-sm">Ghi chú</label><textarea className="w-full border rounded px-3 py-2" value={form.note} onChange={(e)=>setForm({...form, note:e.target.value})}></textarea></div>

          {err && <div className="text-red-600">{err}</div>}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={()=>setModalOpen(false)} className="px-4 py-2 rounded border">Hủy</button>
            <button type="submit" disabled={saving} className={`px-4 py-2 rounded text-white ${saving ? "bg-gray-300" : "bg-blue-600 hover:bg-blue-700"}`}>{saving ? "Đang lưu..." : editingId ? "Cập nhật" : "Thêm"}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={confirmOpen} title="Xác nhận xóa" message={`Bạn có chắc muốn xóa "${targetDelete?.name}"?`} onCancel={()=>setConfirmOpen(false)} onConfirm={confirmDelete} loading={deleting} />
    </div>
  );
}

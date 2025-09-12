import { useState } from "react";
import api from "../../api";

export default function PatientHistory() {
  const [pid, setPid] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ treatmentNotes: "", prescriptions: "" });

  const load = async () => {
    if (!pid.trim()) return alert("Vui lòng nhập patientId");
    setLoading(true);
    try {
      const { data } = await api.get(`/appointments/patient/${pid}/history`);
      setRows(data.data || []);
    } catch (err) {
      console.error("Load patient history error:", err);
      alert(err?.response?.data?.message || "Không thể tải lịch sử điều trị");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (row) => {
    setEditingId(row._id);
    setEditForm({
      treatmentNotes: row.treatmentNotes || "",
      prescriptions: row.prescriptions ? row.prescriptions.join(", ") : "",
    });
  };

  const saveEdit = async (id) => {
    try {
      await api.put(`/appointments/${id}/history`, {
        treatmentNotes: editForm.treatmentNotes,
        prescriptions: editForm.prescriptions
          ? editForm.prescriptions.split(",").map((p) => p.trim())
          : [],
      });
      setEditingId(null);
      await load();
    } catch (err) {
      console.error("Update history error:", err);
      alert(err?.response?.data?.message || "Không thể cập nhật lịch sử điều trị");
    }
  };

  return (
    <div className="p-6 space-y-4 font-sans">
      <h1 className="text-2xl font-bold text-emerald-700">
        🧾 Lịch sử điều trị theo bệnh nhân
      </h1>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded w-full"
          placeholder="Nhập PatientProfileId..."
          value={pid}
          onChange={(e) => setPid(e.target.value)}
        />
        <button
          onClick={load}
          className="bg-emerald-700 text-white px-3 py-2 rounded hover:bg-emerald-800"
        >
          Tải
        </button>
      </div>

      {loading && <div className="text-gray-500">Đang tải…</div>}

      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="min-w-full text-sm font-sans">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Patient ID</th>
              <th className="px-3 py-2 text-left">Dịch vụ</th>
              <th className="px-3 py-2 text-left">Ngày</th>
              <th className="px-3 py-2 text-left">Giờ</th>
              <th className="px-3 py-2 text-left">Bác sĩ</th>
              <th className="px-3 py-2 text-left">Ghi chú điều trị</th>
              <th className="px-3 py-2 text-left">Đơn thuốc</th>
              <th className="px-3 py-2 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && !loading && (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-gray-500 text-center">
                  Không có dữ liệu
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r._id} className="border-t">
                {/* ✅ Hiện PatientProfileId */}
                <td className="px-3 py-2 text-xs text-gray-500">
                  {r?.patient?._id || "—"}
                </td>
                <td className="px-3 py-2">{r.service}</td>
                <td className="px-3 py-2">
                  {new Date(r.startAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-3 py-2">{r.timeSlot}</td>
                <td className="px-3 py-2">{r?.dentist?.user?.name || "—"}</td>
                <td className="px-3 py-2">
                  {editingId === r._id ? (
                    <textarea
                      value={editForm.treatmentNotes}
                      onChange={(e) =>
                        setEditForm({ ...editForm, treatmentNotes: e.target.value })
                      }
                      className="border p-1 w-full rounded"
                    />
                  ) : (
                    r.treatmentNotes || "—"
                  )}
                </td>
                <td className="px-3 py-2">
                  {editingId === r._id ? (
                    <input
                      type="text"
                      value={editForm.prescriptions}
                      onChange={(e) =>
                        setEditForm({ ...editForm, prescriptions: e.target.value })
                      }
                      className="border p-1 w-full rounded"
                      placeholder="Nhập thuốc, cách nhau bởi dấu phẩy"
                    />
                  ) : r?.prescriptions?.length ? (
                    r.prescriptions.join(", ")
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-3 py-2 space-x-2">
                  {editingId === r._id ? (
                    <>
                      <button
                        onClick={() => saveEdit(r._id)}
                        className="px-2 py-1 bg-green-600 text-white rounded"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-1 bg-gray-400 text-white rounded"
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEdit(r)}
                      className="px-2 py-1 bg-blue-600 text-white rounded"
                    >
                      Sửa
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

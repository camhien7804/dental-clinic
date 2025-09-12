import { useEffect, useState } from "react";
import api from "../../api";

export default function DentistAppointments() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/appointments/dentist/me");
      setRows(data.data || []);
    } catch (err) {
      console.error("Load appointments error:", err);
      alert(err?.response?.data?.message || "Không thể tải danh sách lịch hẹn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    if (!confirm(`Xác nhận đổi trạng thái lịch này sang "${status}"?`)) return;
    try {
      await api.put(`/appointments/${id}/status`, { status });
      await load();
    } catch (err) {
      console.error("Update status error:", err);
      alert(err?.response?.data?.message || "Không thể cập nhật trạng thái");
    }
  };

  const downloadInvoice = async (id) => {
    try {
      const res = await api.get(`/appointments/${id}/invoice`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Download invoice error:", err);
      alert("Không thể tải hóa đơn PDF.");
    }
  };

  return (
    <div className="p-6 space-y-4 font-sans">
      <h1 className="text-2xl font-bold text-emerald-700">📅 Quản lý lịch hẹn</h1>

      {loading && <div className="text-gray-500">Đang tải…</div>}

      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="min-w-full text-sm font-sans">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Patient ID</th>
              <th className="px-3 py-2 text-left">Bệnh nhân</th>
              <th className="px-3 py-2 text-left">Dịch vụ</th>
              <th className="px-3 py-2 text-left">Ngày</th>
              <th className="px-3 py-2 text-left">Giờ</th>
              <th className="px-3 py-2 text-left">Trạng thái</th>
              <th className="px-3 py-2 text-left">Ghi chú</th>
              <th className="px-3 py-2 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && !loading && (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-gray-500 text-center">
                  Không có lịch hẹn nào
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r._id} className="border-t">
                {/* ✅ Hiện PatientProfileId */}
                <td className="px-3 py-2 text-xs text-gray-500">
                  {r?.patient?._id || "—"}
                </td>
                <td className="px-3 py-2">
                  {r?.patient?.user?.name || r.patientName || "—"}
                </td>
                <td className="px-3 py-2">{r.service}</td>
                <td className="px-3 py-2">
                  {new Date(r.startAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-3 py-2">{r.timeSlot}</td>
                <td className="px-3 py-2 capitalize">{r.status}</td>
                <td className="px-3 py-2">{r.notes || "—"}</td>
                <td className="px-3 py-2 space-x-2">
                  {r.status === "pending" && (
                    <button
                      onClick={() => updateStatus(r._id, "confirmed")}
                      className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      ✅ Xác nhận
                    </button>
                  )}
                  {r.status === "confirmed" && (
                    <button
                      onClick={() => updateStatus(r._id, "completed")}
                      className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      🦷 Hoàn tất
                    </button>
                  )}
                  {r.status !== "cancelled" && r.status !== "completed" && (
                    <button
                      onClick={() => updateStatus(r._id, "cancelled")}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      ❌ Hủy
                    </button>
                  )}
                  <button
                    onClick={() => downloadInvoice(r._id)}
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    📄 Tải Phiếu Hẹn
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import api from "../../api";

export default function MyAppointments() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/appointments/me");
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

  const downloadInvoice = async (appointmentId) => {
    try {
      const res = await api.get(`/appointments/${appointmentId}/invoice`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice_${appointmentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Download invoice error:", err);
      alert("Không thể tải hóa đơn PDF.");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-green-700">📅 Lịch hẹn đã đặt</h1>
      {loading && <div className="text-gray-500">Đang tải…</div>}
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Dịch vụ</th>
              <th className="px-3 py-2 text-left">Ngày</th>
              <th className="px-3 py-2 text-left">Giờ</th>
              <th className="px-3 py-2 text-left">Bác sĩ</th>
              <th className="px-3 py-2 text-left">Trạng thái</th>
              <th className="px-3 py-2 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-gray-500 text-center">
                  Bạn chưa có lịch hẹn nào
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="px-3 py-2">{r.service}</td>
                <td className="px-3 py-2">
                  {new Date(r.startAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-3 py-2">{r.timeSlot}</td>
                <td className="px-3 py-2">{r?.dentist?.user?.name || "—"}</td>
                <td className="px-3 py-2 capitalize">{r.status}</td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => downloadInvoice(r._id)}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
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

import { useEffect, useState } from "react";
import api from "../../api";

export default function MyHistory() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/appointments/history/me");
      setRows(data.data || []);
    } catch (err) {
      console.error("Load history error:", err);
      alert(err?.response?.data?.message || "Không thể tải lịch sử khám");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-emerald-700">🧾 Lịch sử khám</h1>
      {loading && <div className="text-gray-500">Đang tải…</div>}
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Dịch vụ</th>
              <th className="px-3 py-2 text-left">Ngày</th>
              <th className="px-3 py-2 text-left">Giờ</th>
              <th className="px-3 py-2 text-left">Bác sĩ</th>
              <th className="px-3 py-2 text-left">Ghi chú</th>
              <th className="px-3 py-2 text-left">Đơn thuốc</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="px-3 py-6 text-gray-500 text-center">
                  Chưa có lịch sử khám
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
                <td className="px-3 py-2">{r.treatmentNotes || "—"}</td>
                <td className="px-3 py-2">
                  {r?.prescriptions?.length
                    ? r.prescriptions.join(", ")
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../api"; // axios instance

export default function BookingConfirm() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(state?.appointment || null);
  const [loading, setLoading] = useState(!state?.appointment);

  // Fallback: nếu state không có dữ liệu, gọi API lấy appointment mới nhất
  useEffect(() => {
    if (!state?.appointment) {
      const fetchLatest = async () => {
        try {
          setLoading(true);
          const res = await api.get("/appointments/latest");
          if (res?.data?.success) {
            setAppointment(res.data.data);
          }
        } catch (err) {
          console.error("Không load được lịch hẹn", err);
        } finally {
          setLoading(false);
        }
      };
      fetchLatest();
    }
  }, [state]);

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Đang tải dữ liệu...</div>;
  }

  if (!appointment) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-xl font-semibold mb-2 text-red-600">
          Thiếu dữ liệu lịch hẹn
        </h1>
        <p className="text-gray-600 mb-4">
          Vui lòng quay lại và đặt lịch hẹn mới.
        </p>
        <button
          onClick={() => navigate("/dat-lich")}
          className="px-4 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800"
        >
          ← Quay lại đặt lịch
        </button>
      </div>
    );
  }

  // Lấy thông tin từ state nếu có, fallback từ appointment nếu reload
  const serviceName = state?.serviceName || appointment?.service?.name || "Dịch vụ";
  const dateLabel = state?.dateLabel || new Date(appointment?.startAt).toLocaleDateString("vi-VN");
  const timeSlot = state?.timeSlot || new Date(appointment?.startAt).toLocaleTimeString("vi-VN");
  const downloadUrl = state?.downloadUrl;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-green-800">
        ✅ Đặt lịch thành công
      </h1>

      <div className="bg-white rounded-xl shadow p-5 space-y-3 border">
        <div><span className="text-gray-500">Mã lịch hẹn: </span><b>{appointment?._id}</b></div>
        <div><span className="text-gray-500">Dịch vụ: </span><b>{serviceName}</b></div>
        <div><span className="text-gray-500">Thời gian: </span><b>{dateLabel} • {timeSlot}</b></div>
        <div><span className="text-gray-500">Bác sĩ: </span>
          <b>{appointment?.dentist?.user?.name || "Sẽ được sắp xếp"}</b>
        </div>
        <div><span className="text-gray-500">Ghi chú: </span>
          <span>{appointment?.notes || "—"}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
        >
          ← Về Dashboard
        </button>

        {downloadUrl && (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800"
          >
            📄 Tải phiếu hẹn
          </a>
        )}
      </div>
    </div>
  );
}

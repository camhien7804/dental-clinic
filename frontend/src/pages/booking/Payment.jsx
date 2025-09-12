import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";

export default function Payment() {
  const { id } = useParams();
  const [appt, setAppt] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get(`/appointments/${id}`);
      if (res.data.success) setAppt(res.data.data);
    };
    fetchData();
  }, [id]);

  if (!appt) return <p className="text-center mt-10">Đang tải...</p>;

  const handlePay = async () => {
    const res = await api.put(`/appointments/${id}/pay`, {
      method: appt.paymentMethod,
      status: "paid",
      transactionId: `TXN-${Date.now()}`,
    });
    if (res.data.success) setAppt(res.data.data);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg space-y-6 mt-6">
      <h2 className="text-2xl font-bold text-green-700">Xác nhận thanh toán</h2>

      <div className="bg-gray-50 p-4 rounded-xl space-y-2">
        <p><b>Dịch vụ:</b> {appt.service}</p>
        <p><b>Bác sĩ:</b> {appt.dentist?.user?.name || "—"}</p>
        <p><b>Ngày:</b> {new Date(appt.appointmentDate).toLocaleDateString()}</p>
        <p><b>Khung giờ:</b> {appt.timeSlot}</p>
        <p><b>Giá:</b> {appt.servicePrice?.toLocaleString("vi-VN")} VND</p>
      </div>

      <div className="bg-green-50 p-4 rounded-xl">
        <p className="font-medium">Phương thức: {appt.paymentMethod}</p>
        <p>
          Trạng thái:{" "}
          <span
            className={`ml-2 font-semibold ${
              appt.paymentStatus === "paid"
                ? "text-green-600"
                : appt.paymentStatus === "failed"
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {appt.paymentStatus}
          </span>
        </p>
      </div>

      {appt.paymentStatus === "unpaid" && (
        <button
          onClick={handlePay}
          className="w-full py-3 rounded-xl text-white font-semibold shadow-lg transition
                     bg-gradient-to-r from-green-600 to-blue-600 hover:opacity-90"
        >
          Thanh toán ngay
        </button>
      )}
    </div>
  );
}

// src/pages/dentist/DentistDashboard.jsx
import { Link } from "react-router-dom";

export default function DentistDashboard() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-emerald-700">👨‍⚕️ Dashboard Bác sĩ</h1>

      <nav className="space-y-2">
        <Link to="/dentist/appointments" className="block text-blue-600">
          📅 Lịch hẹn của tôi
        </Link>
        <Link to="/dentist/patient-history" className="block text-blue-600">
          🧾 Lịch sử điều trị theo bệnh nhân
        </Link>
      </nav>

      <section className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="font-semibold">Tổng quan</h2>
        <p>
          Tại đây bác sĩ có thể xem lịch hẹn, xác nhận/hoàn tất/hủy và theo dõi lịch sử điều trị bệnh nhân.
        </p>
      </section>
    </div>
  );
}

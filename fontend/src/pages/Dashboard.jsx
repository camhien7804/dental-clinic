import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Xin chào, {user?.fullName || user?.name || "Khách"}
      </h1>

      <nav className="mt-4 space-y-2">
        <Link to="/" className="block text-blue-600">
          🏠 Trang chủ
        </Link>
        <Link to="/dat-lich" className="block text-blue-600">
          📅 Đặt lịch khám
        </Link>
        <Link to="/patient/appointments" className="block text-blue-600">
          🧾 Lịch sử đặt lịch
        </Link>
        <Link to="/patient/history" className="block text-blue-600">
          📚 Lịch sử khám
        </Link>
      </nav>

      <section className="mt-6 bg-white rounded p-4 shadow">
        <h2 className="font-semibold">Tổng quan</h2>
        <p>
          Ở đây bạn có thể xem lịch sử đặt lịch, lịch sử khám, đơn thuốc và thay đổi
          thông tin cá nhân.
        </p>
      </section>
    </div>
  );
}

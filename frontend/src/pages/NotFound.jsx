import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-6xl font-bold text-emerald-700 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-6">
        Xin lỗi, trang bạn tìm không tồn tại hoặc đã bị di chuyển.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition"
      >
        ⬅ Về trang chủ
      </Link>
    </div>
  );
}

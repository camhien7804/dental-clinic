import { useParams, Link } from "react-router-dom";
import { doctors } from "../data/doctors";

export default function DoctorDetail() {
  const { slug } = useParams();
  const doctor = doctors.find(d => d.slug === slug);

  if (!doctor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <p className="text-gray-600">Không tìm thấy bác sĩ.</p>
        <Link to="/bac-si" className="text-blue-600 underline">Quay lại danh sách</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:underline">Trang chủ</Link> <span>›</span>{" "}
        <Link to="/bac-si" className="hover:underline">Bác sĩ</Link> <span>›</span>{" "}
        <span className="text-gray-700">{doctor.name}</span>
      </div>

      <h1 className="text-3xl font-bold text-[#1A2954] mb-6">{doctor.name}</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* ảnh lớn bên trái (không bo tròn) */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <img
            src={doctor.avatar}
            alt={doctor.name}
            className="w-full h-[520px] object-contain"
          />
        </div>

        {/* thông tin bên phải */}
        <div>
          <h2 className="text-2xl font-semibold text-[#1A2954] mb-4">Thông tin bác sĩ</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li><b>Họ và tên:</b> {doctor.name}</li>
            <li><b>Khu vực:</b> {doctor.region}</li>
            <li><b>Chức danh:</b> {doctor.title}</li>
          </ul>

          <h3 className="mt-6 mb-3 font-semibold text-[#1A2954]">Các chứng chỉ/kinh nghiệm:</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            {doctor.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

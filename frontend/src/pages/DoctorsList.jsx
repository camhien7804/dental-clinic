import { Link } from "react-router-dom";
import { doctors } from "../data/doctors";

function DoctorCardWide({ d }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 relative overflow-hidden">
      <div className="grid md:grid-cols-2 gap-6 items-center">
        {/* Text trái */}
        <div>
          <div className="text-sm text-gray-500 mb-1">{d.title}</div>
          <h3 className="text-xl md:text-2xl font-bold text-[#1A2954]">{d.name}</h3>
          <ul className="list-disc pl-5 mt-3 space-y-2 text-gray-700">
            {d.bullets.slice(0,3).map((b, i) => <li key={i}>{b}</li>)}
          </ul>
          <Link
            to={`/bac-si/${d.slug}`}
            className="inline-block mt-4 px-4 py-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white"
          >
            Xem chi tiết
          </Link>
        </div>

        {/* Ảnh phải – full, không bo tròn */}
        <div className="relative">
          <img
            src={d.avatar}
            alt={d.name}
            className="w-full h-64 md:h-72 object-contain"
          />
          {/* trang trí nhẹ giống mẫu */}
          <div className="absolute -right-8 -bottom-8 w-52 h-52 bg-blue-50 rounded-full blur-2xl opacity-60 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

export default function DoctorsList() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-[#1A2954] mb-4">Đội ngũ bác sĩ</h1>
      {doctors.map((d) => <DoctorCardWide key={d.slug} d={d} />)}
    </div>
  );
}

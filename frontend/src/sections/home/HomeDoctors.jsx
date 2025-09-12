import { Link } from "react-router-dom";
import { doctors } from "../../data/doctors";

export default function HomeDoctors() {
  const top = doctors.slice(0, 3); // lấy 3 bác sĩ tiêu biểu

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h3 className="text-center text-2xl md:text-3xl font-bold text-[#1A2954] mb-6">
        Đội ngũ bác sĩ
      </h3>

      <div className="flex flex-col gap-6">
        {top.map((d) => (
          <div key={d.slug} className="bg-white rounded-2xl shadow-sm p-6 relative overflow-hidden">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              {/* Text trái */}
              <div>
                <div className="text-sm text-gray-500 mb-1">{d.title}</div>
                <h4 className="text-xl md:text-2xl font-bold text-[#1A2954]">{d.name}</h4>
                <ul className="list-disc pl-5 mt-3 space-y-2 text-gray-700">
                  {d.bullets.slice(0,5).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
                <Link
                  to={`/bac-si/${d.slug}`}
                  className="inline-block mt-4 px-4 py-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white"
                >
                  Xem chi tiết
                </Link>
              </div>

              {/* Ảnh phải – không bo tròn */}
              <div className="relative">
                <img
                  src={d.avatar}
                  alt={d.name}
                  className="w-full h-64 md:h-72 object-contain"
                />
                <div className="absolute -right-8 -bottom-8 w-52 h-52 bg-blue-50 rounded-full blur-2xl opacity-60 pointer-events-none" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* nút xem tất cả */}
      <div className="text-center mt-8">
        <Link
          to="/bac-si"
          className="inline-block px-5 py-2 rounded-full border border-blue-200 text-blue-700 hover:bg-blue-600 hover:text-white"
        >
          Xem tất cả bác sĩ
        </Link>
      </div>
    </section>
  );
}

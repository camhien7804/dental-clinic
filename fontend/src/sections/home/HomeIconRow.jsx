import { Link } from "react-router-dom";

const items = [
  ["🔥", "Ưu đãi mới nhất"],
  ["📅", "Đặt lịch hẹn"],
  ["🦷", "Niềng răng"],
  ["👨‍⚕️", "Tìm bác sĩ"],
  ["🏥", "Phòng khám"],
  ["📚", "Kiến thức"],
];

export default function HomeIconRow() {
  return (
    <section className="max-w-7xl mx-auto px-4 mt-8 md:mt-10">
      {/* dãy chip: đều, không lệch, không đè hero */}
      <div className="flex flex-wrap justify-center gap-5 md:gap-6">
        {items.map(([icon, label]) => (
          <div
            key={label}
            className="w-36 md:w-40 bg-white rounded-2xl shadow-sm hover:shadow-md
                       transition p-4 text-center"
          >
            <div className="mx-auto w-14 h-14 md:w-16 md:h-16 rounded-full
                            bg-gray-100 flex items-center justify-center text-2xl md:text-3xl mb-2">
              {icon}
            </div>
            <div className="text-sm md:text-base font-medium text-[#1A2954]">
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Nút đặt lịch dưới icon, căn giữa */}
      <div className="mt-6 flex justify-center">
        <Link
          to="/dat-lich"
          className="px-5 py-2 rounded-full bg-blue-700 text-white font-medium hover:bg-blue-800 transition"
        >
          📅 Đặt lịch
        </Link>
      </div>
    </section>
  );
}
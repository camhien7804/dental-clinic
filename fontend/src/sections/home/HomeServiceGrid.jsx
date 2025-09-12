// src/sections/home/HomeServiceGrid.jsx
import { Link } from "react-router-dom";
import {
  services,
  afterDiscount,
  afterDiscountRange,
  formatVND,
} from "../../data/services";

export default function HomeServiceGrid() {
  const list = services.slice(0, 8);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-1 h-6 bg-blue-600 rounded" />
        <h3 className="text-2xl md:text-3xl font-bold text-[#1A2954]">
          Chăm sóc sức khỏe răng miệng toàn diện
        </h3>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((s) => {
          const hasRange = s.priceMin != null && s.priceMax != null;
          const hasDiscount = (s.discountPercent || 0) > 0;
          let now = "",
            old = "";

          if (hasRange) {
            const [minNow, maxNow] = hasDiscount
              ? afterDiscountRange(
                  s.priceMin,
                  s.priceMax,
                  s.discountPercent
                )
              : [s.priceMin, s.priceMax];
            now = `${formatVND(minNow)} – ${formatVND(maxNow)}`;
            old = hasDiscount
              ? `${formatVND(s.priceMin)} – ${formatVND(s.priceMax)}`
              : "";
          } else {
            const v = hasDiscount
              ? afterDiscount(s.price, s.discountPercent)
              : s.price;
            now = formatVND(v);
            old = hasDiscount ? formatVND(s.price) : "";
          }

          return (
            <div
              key={s.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <div className="relative">
                {hasDiscount && (
                  <span className="absolute top-3 left-3 text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                    Giảm {s.discountPercent}%
                  </span>
                )}
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-44 object-cover"
                />
              </div>
              <div className="p-4">
                <div className="text-[#1A2954] font-semibold line-clamp-2">
                  {s.title}
                </div>
                <div className="mt-1 text-xs inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                  {s.category}
                </div>
                <div className="mt-2">
                  <div className="text-blue-700 font-semibold">{now}</div>
                  {old && (
                    <div className="text-sm text-gray-400 line-through">
                      {old}
                    </div>
                  )}
                </div>

                {/* Nút xem chi tiết */}
                <Link
                  to={`/dich-vu/${s.categorySlug}/${s.slug}`}
                  className="inline-block mt-3 px-3 py-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white"
                >
                  Xem chi tiết
                </Link>

                {/* Nút đặt lịch */}
                <Link
                  to={`/dat-lich?category=${s.categorySlug}`}
                  className="mt-2 inline-block rounded-full bg-emerald-50 text-emerald-700 px-3 py-2 hover:bg-emerald-600 hover:text-white"
                >
                  Đặt lịch
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

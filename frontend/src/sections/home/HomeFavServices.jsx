// src/sections/home/HomeFavServices.jsx
import { Link } from "react-router-dom";
import { services, formatVND, afterDiscount, afterDiscountRange } from "../../data/services";
export default function HomeFavServices() {
  const fav = services.filter(s => (s.tags||[]).includes("bán chạy")).slice(0,8);
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h3 className="text-center text-2xl md:text-3xl font-bold text-[#1A2954] mb-6">Dịch vụ được yêu thích</h3>
      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar">
        {fav.map((s) => {
          const hasRange = s.priceMin != null && s.priceMax != null;
          const hasDiscount = (s.discountPercent||0) > 0;
          let now="", old="";
          if (hasRange) {
            const [a,b] = hasDiscount ? afterDiscountRange(s.priceMin,s.priceMax,s.discountPercent) : [s.priceMin,s.priceMax];
            now = `${formatVND(a)} – ${formatVND(b)}`; old = hasDiscount ? `${formatVND(s.priceMin)} – ${formatVND(s.priceMax)}` : "";
          } else {
            const v = hasDiscount ? afterDiscount(s.price,s.discountPercent) : s.price;
            now = formatVND(v); old = hasDiscount ? formatVND(s.price) : "";
          }
          return (
            <div key={s.id} className="min-w-[260px] snap-start bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
              <img src={s.image} alt={s.title} className="w-full h-40 object-cover"/>
              <div className="p-4">
                <div className="font-semibold text-[#1A2954] line-clamp-2">{s.title}</div>
                <div className="mt-1 text-blue-700 font-semibold">{now}</div>
                {old && <div className="text-sm text-gray-400 line-through">{old}</div>}
                <Link to={`/dich-vu/${s.categorySlug}/${s.slug}`} className="inline-block mt-3 px-3 py-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white">Xem chi tiết</Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

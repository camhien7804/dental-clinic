// src/sections/home/HomeBeforeAfter.jsx
const items = [
  { before: "/images/nha_khoa_award.png", after:"/images/nha_khoa_award.png", note:"Ca chỉnh nha 18 tháng" },
  { before: "/images/nha_khoa_award.png", after:"/images/nha_khoa_award.png", note:"Phục hình Implant" },
];
export default function HomeBeforeAfter() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h3 className="text-center text-2xl md:text-3xl font-bold text-[#1A2954] mb-6">Trước & Sau điều trị</h3>
      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar">
        {items.map((it,i)=>(
          <div key={i} className="min-w-[520px] snap-start grid grid-cols-2 gap-4 bg-white rounded-2xl p-4 shadow-sm">
            <div className="relative">
              <img src={it.before} alt="" className="w-full h-48 object-cover rounded-xl"/>
              <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Trước điều trị</span>
            </div>
            <div className="relative">
              <img src={it.after} alt="" className="w-full h-48 object-cover rounded-xl"/>
              <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Sau điều trị</span>
            </div>
            <div className="col-span-2 text-center text-gray-600 text-sm">{it.note}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

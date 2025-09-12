// src/sections/home/HomeLocations.jsx
export default function HomeLocations() {
  const locs = [
    { img:"/images/home/loc-hcm.jpg", title:"TP. Hồ Chí Minh" },
    { img:"/images/home/loc-hn.jpg", title:"Hà Nội" },
    { img:"/images/home/loc-others.jpg", title:"Các tỉnh" },
  ];
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h3 className="text-center text-2xl md:text-3xl font-bold text-[#1A2954]">Tìm Nha Khoa OU gần nhất</h3>
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {locs.map((l,i)=>(
          <div key={i} className="group relative overflow-hidden rounded-2xl shadow-sm">
            <img src={l.img} alt="" className="w-full h-44 object-cover transition transform group-hover:scale-105 group-hover:brightness-110"/>
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex items-center justify-center text-white font-semibold">{l.title}</div>
          </div>
        ))}
      </div>
      <form className="mt-6 max-w-xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3">
        <input className="border rounded-xl px-3 py-2" placeholder="Họ và tên"/>
        <input className="border rounded-xl px-3 py-2" placeholder="Số điện thoại"/>
        <button className="bg-blue-600 text-white rounded-xl px-5 py-2 hover:bg-blue-700">Gửi</button>
      </form>
    </section>
  );
}

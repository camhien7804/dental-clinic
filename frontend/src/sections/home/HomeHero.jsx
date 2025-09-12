import { useRef, useEffect } from "react";

const slides = [
  { src: "/images/home/banner_pr01.png", title: "" },
  { src: "/images/home/banner_pr02.png", title: "" },
  { src: "/images/home/banner_pr04.png", title: "" },
];

export default function HomeHero() {
  const ref = useRef(null);

  const go = (dir) => {
    const w = ref.current?.clientWidth ?? 0;
    ref.current?.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  // Auto slide 5s
  useEffect(() => {
    const t = setInterval(() => go(1), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative">
      {/* overflow-x-auto để trượt theo slide, ẩn scrollbar + chặn overflow-y */}
      <div
        ref={ref}
        className="flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth no-scrollbar"
      >
        {slides.map((s, i) => (
          <div
            key={i}
            className="min-w-full h-[60vh] md:h-[70vh] relative snap-start bg-[#EEF2F6]"
          >
            {/* Nền fill 2 mép – không nhận sự kiện chuột */}
            <img
              src={s.src}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-60 pointer-events-none"
            />
            {/* Ảnh chính – không crop */}
            <img
              src={s.src}
              alt={s.title}
              className="relative z-10 w-full h-full object-contain pointer-events-none"
            />
            {/* Overlay – cũng không nhận sự kiện */}
            <div className="absolute inset-0 bg-black/10 z-20 pointer-events-none" />
            {/* Tiêu đề */}
            <div className="absolute inset-x-0 bottom-8 z-30 text-center text-white">
              <h2 className="text-2xl md:text-5xl font-bold drop-shadow">
                {s.title}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Nút điều hướng – đảm bảo nổi trên cùng và nhận click */}
      <button
        onClick={() => go(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-10 h-10 shadow z-50 pointer-events-auto"
        aria-label="Slide trước"
      >
        ‹
      </button>
      <button
        onClick={() => go(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-10 h-10 shadow z-50 pointer-events-auto"
        aria-label="Slide sau"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-40 pointer-events-none">
        {slides.map((_, i) => (
          <span key={i} className="w-2.5 h-2.5 rounded-full bg-white/70" />
        ))}
      </div>
    </section>
  );
}
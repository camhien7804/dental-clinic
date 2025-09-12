import React, { useEffect, useState } from "react";
import TopHeader from "./TopHeader";
import MainNav from "./MainNav";

export default function Header() {
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setPinned(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="relative z-[60]">
      {/* TopHeader */}
      <div
        className={`transition-transform duration-500 relative z-[60] ${
          pinned ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <TopHeader />
      </div>

      {/* MainNav luôn sticky nhưng z thấp hơn dropdown */}
      <div className="sticky top-0 z-50">
        <MainNav shrink={pinned} />
      </div>
    </header>
  );
}

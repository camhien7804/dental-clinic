import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Khi path đổi, tự động scroll lên đầu
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

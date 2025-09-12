import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { services } from "../data/services";

const MAP = {
  "trong-rang-implant": "implant",
  "nieng-rang": "ortho",
  "nha-khoa-tong-quat": "general",
  "nha-khoa-tre-em": "pediatric",
};

export function useBookingPrefill(setSpecialty) {
  const location = useLocation();
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const cat = q.get("category");
    const svc = q.get("service");
    if (cat && MAP[cat]) return setSpecialty(MAP[cat]);
    if (svc) {
      const found = services.find((s) => s.slug === svc);
      if (found && MAP[found.categorySlug]) setSpecialty(MAP[found.categorySlug]);
    }
  }, [location.search, setSpecialty]);
}

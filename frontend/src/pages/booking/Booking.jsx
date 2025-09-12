// src/pages/booking/Booking.jsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookingInline from "../../components/booking/BookingInline";
import { useAuth } from "../../contexts/AuthContext";

export default function Booking() {
  const auth = useAuth();
  const location = useLocation();
  const nav = useNavigate();

  // If not authenticated, redirect to login and include the redirect param
  useEffect(() => {
    if (!auth?.user) {
      // build full path including query
      const full = location.pathname + (location.search || "");
      nav(`/login?redirect=${encodeURIComponent(full)}`, { replace: true });
    }
  }, [auth?.user, location, nav]);

  // If authenticated, show BookingInline (BookingInline will also read query params for prefill)
  if (!auth?.user) return null; // while redirecting

  return <BookingInline open={true} onClose={() => nav(-1)} />;
}

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { services as localServices } from "../../data/services"; // fallback local mock
import api from "../../api"; // axios instance

export default function BookingInline({ open = true, onClose }) {
  const location = useLocation();
  const nav = useNavigate();

  const [services, setServices] = useState(localServices || []);
  const [loadingServices, setLoadingServices] = useState(true);
  const [dentists, setDentists] = useState([]);
  const [loadingDentists, setLoadingDentists] = useState(true);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    serviceName: "",
    serviceSlug: "",
    dentist: "",
    date: "",
    time: "",
    note: "",
  });

  // Load services
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await api.get("/services");
        if (!mounted) return;
        setServices(res.data?.data?.length ? res.data.data : localServices);
      } catch {
        setServices(localServices || []);
      } finally {
        if (mounted) setLoadingServices(false);
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  // Load dentists
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await api.get("/dentists");
        if (!mounted) return;
        setDentists(res.data?.data || []);
      } catch {
        setDentists([]);
      } finally {
        if (mounted) setLoadingDentists(false);
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  // Prefill service từ query
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const svc = q.get("service");
    if (svc) {
      setForm((f) => ({ ...f, serviceSlug: svc || f.serviceSlug || "" }));
    }
  }, [location.search]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.service || !form.date || !form.time) {
      return "Vui lòng nhập đủ Họ tên, SĐT, Dịch vụ, Ngày và Giờ.";
    }
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const vErr = validate();
    if (vErr) return alert(vErr);

    try {
      const found = (services || []).find(
        (s) =>
          form.service &&
          (s._id === form.service || s.slug === form.service || s.name === form.service)
      );

      const start = new Date(`${form.date}T${form.time}:00`);
      const duration = found?.durationMins ? Number(found.durationMins) : 30;
      const end = new Date(start.getTime() + duration * 60000);

      const formatTime = (d) =>
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      const timeSlot = `${formatTime(start)} - ${formatTime(end)}`;

      const body = {
        serviceId: found?._id || undefined,
        service: found?.name || form.serviceName || form.service,
        dentist: form.dentist || undefined,
        startAt: start.toISOString(),
        endAt: end.toISOString(),
        notes: form.note || "",
        name: form.name,
        phone: form.phone,
        email: form.email,
      };
        
      const res = await api.post("/appointments", body);

      if (res?.data?.success) {
        nav("/dat-lich/xac-nhan", {
          state: {
            serviceName: body.service,
            dateLabel: new Intl.DateTimeFormat("vi-VN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }).format(start),
            timeSlot,
            appointment: res.data.data || null,
            downloadUrl: res.data.downloadUrl,
          },
        });
        
        onClose?.();
      } else {
        alert(res?.data?.message || "Có lỗi khi đặt lịch");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Lỗi khi đặt lịch";
      alert(msg);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg mx-auto rounded-2xl shadow-lg p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold text-green-700">Đặt lịch khám</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          {/* Họ tên */}
          <div>
            <label className="block mb-1">Họ và tên *</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Nguyễn Văn A"
            />
          </div>

          {/* SĐT */}
          <div>
            <label className="block mb-1">Số điện thoại *</label>
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              placeholder="09xx..."
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              placeholder="you@email.com"
            />
          </div>

          {/* Dịch vụ */}
          <div>
            <label className="block mb-1">Dịch vụ *</label>
            {!loadingServices && services.length > 0 ? (
              <select
                name="service"
                value={form.service || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  const s = services.find(
                    (sv) => sv._id === val || sv.name === val || sv.slug === val
                  );
                  setForm((f) => ({
                    ...f,
                    service: s?._id || val,
                    serviceName: s?.name || s?.title || val,
                  }));
                }}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">-- Chọn dịch vụ --</option>
                {services.map((s) => (
                  <option key={s._id || s.slug} value={s._id || s.slug}>
                    {s.name || s.title}
                  </option>
                ))}
              </select>
            ) : (
              <input
                name="service"
                value={form.serviceName || form.service}
                onChange={onChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Ví dụ: Trồng răng Implant"
              />
            )}
          </div>

          {/* Bác sĩ */}
          <div>
            <label className="block mb-1">Chọn bác sĩ (không bắt buộc)</label>
            {!loadingDentists && dentists.length > 0 ? (
              <select
                name="dentist"
                value={form.dentist || ""}
                onChange={onChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value="">-- Tự động chọn bác sĩ phù hợp --</option>
                {dentists.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.user?.name} ({d.specialization})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-gray-500">Đang tải danh sách bác sĩ…</p>
            )}
          </div>

          {/* Ngày & giờ */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Ngày *</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={onChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block mb-1">Giờ *</label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={onChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block mb-1">Ghi chú</label>
            <textarea
              name="note"
              value={form.note}
              onChange={onChange}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition"
          >
            Xác nhận đặt lịch
          </button>
        </form>
      </div>
    </div>
  );
}

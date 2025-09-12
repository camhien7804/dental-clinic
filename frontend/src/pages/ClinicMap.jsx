import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Icon marker
const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2776/2776067.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Tọa độ demo
const clinicPosition = [10.789041, 106.693756];

// Giờ làm việc
const workingSchedule = {
  Mon: { open: 8, close: 20 },
  Tue: { open: 8, close: 20 },
  Wed: { open: 8, close: 20 },
  Thu: { open: 8, close: 20 },
  Fri: { open: 8, close: 20 },
  Sat: { open: 8, close: 17 },
  Sun: null,
};

// Ảnh demo
const clinicImages = ["/images/logo.png", "/images/logo.png", "/images/logo.png"];

// Review mặc định
const defaultReviews = [
  { name: "Nguyễn Văn A", avatar: "/images/logo.png", rating: 5, text: "Dịch vụ rất tốt, bác sĩ tận tâm, phòng khám sạch sẽ." },
  { name: "Trần Thị B", avatar: "/images/logo.png", rating: 4, text: "Nhân viên thân thiện, giá hợp lý. Sẽ quay lại!" },
  { name: "Lê Cường", avatar: "/images/logo.png", rating: 3, text: "Ổn, nhưng cần cải thiện thời gian chờ." },
];

// 👉 Hàm tính khoảng cách (Haversine)
function calcDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function ClinicMap() {
  const [isOpen, setIsOpen] = useState(false);
  const [reviews, setReviews] = useState(defaultReviews);
  const [form, setForm] = useState({ name: "", rating: 5, text: "" });
  const [darkMode, setDarkMode] = useState(false);
  const [distance, setDistance] = useState(null);
  const [filter, setFilter] = useState("all");

  // rating trung bình
  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  // Load reviews từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem("clinic_reviews");
    if (saved) setReviews(JSON.parse(saved));
  }, []);

  // Lưu reviews vào localStorage
  useEffect(() => {
    localStorage.setItem("clinic_reviews", JSON.stringify(reviews));
  }, [reviews]);

  // Check giờ mở cửa
  useEffect(() => {
    const now = new Date();
    const day = now.toLocaleDateString("en-US", { weekday: "short" });
    const hours = now.getHours();
    const schedule = workingSchedule[day];
    setIsOpen(schedule && hours >= schedule.open && hours < schedule.close);
  }, []);

  // Gửi đánh giá
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.text) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    const newReview = {
      name: form.name,
      avatar: "/images/logo.png",
      rating: parseInt(form.rating),
      text: form.text,
    };
    setReviews((prev) => [newReview, ...prev]);
    setForm({ name: "", rating: 5, text: "" });
  };

  // Chỉ đường từ vị trí hiện tại
  const handleDirectionsFromCurrent = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          window.open(
            `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${clinicPosition[0]},${clinicPosition[1]}`,
            "_blank"
          );
        },
        () => alert("Không lấy được vị trí của bạn.")
      );
    }
  };

  // Tính khoảng cách
  const handleCalcDistance = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const km = calcDistance(
            latitude,
            longitude,
            clinicPosition[0],
            clinicPosition[1]
          );
          setDistance(km.toFixed(2));
        },
        () => alert("Không lấy được vị trí để tính khoảng cách.")
      );
    }
  };

  // Lọc review theo filter
  const filteredReviews =
    filter === "all"
      ? reviews
      : reviews.filter((r) => r.rating === parseInt(filter));

  // Thống kê review
  const stats = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percent = reviews.length
      ? Math.round((count / reviews.length) * 100)
      : 0;
    return { star, count, percent };
  });

  // 📅 Giờ cao điểm & gợi ý
  const busyHours = [{ start: 9, end: 11 }, { start: 18, end: 20 }];
  const suggestedHours = [{ start: 14, end: 16 }];
  const nowHour = new Date().getHours();
  const isBusyNow = busyHours.some(
    (h) => nowHour >= h.start && nowHour < h.end
  );

  // 📊 Heatmap tuần (fake data)
  const heatmapData = {
    labels: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"],
    datasets: [
      {
        label: "Mức độ đông khách (%)",
        data: [70, 65, 80, 75, 90, 60, 30],
        backgroundColor: "rgba(16,185,129,0.7)",
      },
    ],
  };

  return (
    <div className="w-full min-h-screen p-4 space-y-6">
      <h1 className="text-2xl font-bold text-green-700">
        📍 Vị trí phòng khám
      </h1>
      <p className="text-gray-700">
        Địa chỉ:{" "}
        <span className="font-semibold">123 Đường ABC, Quận 3, TP.HCM</span>
      </p>

      {/* Rating trung bình */}
      <p className="text-yellow-600 font-medium">
        ⭐ Trung bình: {avgRating.toFixed(1)}/5 từ {reviews.length} đánh giá
      </p>

      {/* Switch light/dark */}
      <button
        onClick={() => setDarkMode((d) => !d)}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        {darkMode ? "🌞 Bản đồ sáng" : "🌙 Bản đồ tối"}
      </button>

      {/* Bản đồ */}
      <MapContainer
        center={clinicPosition}
        zoom={17}
        className="w-full h-[450px] rounded-xl shadow-lg"
      >
        <TileLayer
          url={
            darkMode
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
          attribution="&copy; OpenStreetMap"
        />
        <Marker position={clinicPosition} icon={customIcon}>
          <Popup maxWidth={300}>
            <div className="text-sm">
              <b className="text-green-700 text-base">Nha Khoa OU (Demo)</b>
              <p>123 Đường ABC, Quận 3, TP.HCM</p>
              <div className="mt-1 text-yellow-500 text-sm">
                ⭐ {avgRating.toFixed(1)}/5 ({reviews.length} đánh giá)
              </div>
              <p className="mt-1">
                {isOpen ? (
                  <span className="text-green-600 font-semibold">
                    ✅ Đang mở cửa
                  </span>
                ) : (
                  <span className="text-red-500 font-semibold">
                    ❌ Đã đóng cửa
                  </span>
                )}
              </p>

              {/* 📅 Giờ cao điểm & gợi ý */}
              <div className="mt-2">
                <p className="font-semibold">📅 Giờ cao điểm:</p>
                <ul className="list-disc ml-5">
                  {busyHours.map((h, i) => (
                    <li key={i}>
                      {h.start}:00 - {h.end}:00
                    </li>
                  ))}
                </ul>
                <p className="font-semibold mt-2">✨ Giờ gợi ý đặt hẹn:</p>
                <ul className="list-disc ml-5 text-green-700 font-medium">
                  {suggestedHours.map((h, i) => (
                    <li key={i}>
                      {h.start}:00 - {h.end}:00
                    </li>
                  ))}
                </ul>
                {isBusyNow && (
                  <p className="mt-2 text-red-500 font-semibold">
                    ⚠️ Hiện tại đang giờ cao điểm, bạn có thể chọn giờ vắng hơn.
                  </p>
                )}
              </div>

              {/* Hình ảnh */}
              <div className="grid grid-cols-3 gap-1 mt-2">
                {clinicImages.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="h-16 w-full object-cover rounded"
                  />
                ))}
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2 mt-3">
                <a
                  href="tel:+84987654321"
                  className="bg-green-600 text-white px-3 py-1 rounded text-center"
                >
                  📞 Gọi ngay
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${clinicPosition[0]},${clinicPosition[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-3 py-1 rounded text-center"
                >
                  🚗 Chỉ đường
                </a>
                <button
                  onClick={handleDirectionsFromCurrent}
                  className="bg-indigo-600 text-white px-3 py-1 rounded"
                >
                  📍 Chỉ đường từ vị trí của tôi
                </button>
                <button
                  onClick={handleCalcDistance}
                  className="bg-purple-600 text-white px-3 py-1 rounded"
                >
                  📏 Tính khoảng cách
                </button>
                {distance && (
                  <p className="text-sm text-gray-700">
                    ➡️ Cách phòng khám <b>{distance} km</b> (~
                    {Math.round(distance / 0.3)} phút đi xe máy)
                  </p>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Heatmap tuần */}
      <section>
        <h2 className="text-xl font-bold mb-3">📊 Biểu đồ lượng khách theo tuần</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <Bar
            data={heatmapData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true, max: 100 } },
            }}
          />
        </div>
      </section>

      {/* Thống kê + Filter + Reviews */}
      <section>
        <h2 className="text-xl font-bold mb-3">⭐ Đánh giá khách hàng</h2>

        {/* Thống kê review */}
        <div className="space-y-2 mb-4">
          {stats.map((s) => (
            <div key={s.star} className="flex items-center gap-2">
              <span className="w-12">{s.star} ⭐</span>
              <div className="flex-1 bg-gray-200 h-3 rounded">
                <div
                  className="bg-green-500 h-3 rounded"
                  style={{ width: `${s.percent}%` }}
                ></div>
              </div>
              <span className="w-12 text-right text-sm text-gray-600">
                {s.count}
              </span>
            </div>
          ))}
        </div>

        {/* Bộ lọc review */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded ${
              filter === "all"
                ? "bg-green-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Tất cả
          </button>
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              onClick={() => setFilter(star)}
              className={`px-3 py-1 rounded ${
                filter === star
                  ? "bg-green-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {star} ⭐
            </button>
          ))}
        </div>

        {/* Danh sách review */}
        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((r, i) => (
              <div
                key={i}
                className="flex items-start gap-3 border-b pb-3"
              >
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <b>{r.name}</b>
                    <span className="text-yellow-500">
                      {"⭐".repeat(r.rating)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{r.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Chưa có đánh giá phù hợp.</p>
          )}
        </div>
      </section>

      {/* Form gửi đánh giá */}
      <section className="mt-6">
        <h2 className="text-xl font-bold mb-3">✍️ Gửi đánh giá của bạn</h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-3 bg-gray-50 p-4 rounded-lg shadow"
        >
          <input
            type="text"
            placeholder="Tên của bạn"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded p-2"
          />
          <select
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: e.target.value })}
            className="w-full border rounded p-2"
          >
            <option value={5}>⭐ 5 - Rất tốt</option>
            <option value={4}>⭐ 4 - Tốt</option>
            <option value={3}>⭐ 3 - Bình thường</option>
            <option value={2}>⭐ 2 - Kém</option>
            <option value={1}>⭐ 1 - Rất tệ</option>
          </select>
          <textarea
            placeholder="Nội dung đánh giá..."
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            className="w-full border rounded p-2 h-24"
          ></textarea>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Gửi đánh giá
          </button>
        </form>
      </section>
    </div>
  );
}

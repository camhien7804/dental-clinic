import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import Breadcrumb from "../components/Breadcrumb";

const CATEGORY_NAMES = {
  "trong-rang-implant": "Trồng răng Implant",
  "nieng-rang": "Niềng răng",
  "nha-khoa-tong-quat": "Nha khoa tổng quát",
  "nha-khoa-tre-em": "Nha khoa trẻ em",
};

export default function ServiceCategory() {
  const { category } = useParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    async function load() {
      if (!category) return;
      setLoading(true);
      try {
        const res = await api.get(
          `/services?category=${encodeURIComponent(category)}`
        );
        setServices(res.data.data || []);
      } catch (err) {
        console.error("Load services by category error", err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [category]);

  const title = CATEGORY_NAMES[category] || (category || "Dịch vụ");

  // filter/sort
  const items = useMemo(() => {
    let arr = [...services];
    if (tab === "khuyen-mai") {
      arr = arr.filter((s) => (s.discountPercent || 0) > 0);
    }
    if (tab === "ban-chay") {
      arr = arr.filter((s) => (s.tags || []).includes("bán chạy"));
    }
    if (tab === "gia-asc") {
      arr.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0));
    }
    if (tab === "gia-desc") {
      arr.sort((a, b) => (b.minPrice || 0) - (a.minPrice || 0));
    }
    return arr;
  }, [tab, services]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "Trang chủ", to: "/" },
            { label: "Dịch vụ", to: "/dich-vu/trong-rang-implant" },
            { label: title }
          ]}
              />

        <h1 className="text-3xl font-bold text-emerald-800">{title}</h1>
      </div>

      {/* filter tabs */}
      <div className="mb-4 flex gap-3 flex-wrap">
        {[
          ["all", "Tất cả"],
          ["khuyen-mai", "🔥 Khuyến mãi"],
          ["ban-chay", "Bán chạy"],
          ["gia-asc", "Giá ↑"],
          ["gia-desc", "Giá ↓"],
        ].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`px-3 py-1 border rounded transition ${
              tab === k ? "bg-blue-100 font-medium" : "bg-white hover:bg-gray-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div>Đang tải...</div>
      ) : items.length === 0 ? (
        <div>Chưa có dịch vụ trong danh mục này.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((s) => (
            <div
              key={s._id || s.slug}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
            >
              {/* ảnh */}
              <div className="relative h-52 w-full overflow-hidden">
                <img
                  src={s.image || "/images/placeholder.png"}
                  alt={s.name}
                  className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
                />
                {s.discountPercent > 0 && (
                  <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                    Giảm {s.discountPercent}%
                  </span>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg line-clamp-2">
                  {s.title || s.name}
                </h3>

                {/* Tag danh mục + tags khác */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {s.category && (
                    <span className="inline-block text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      {s.category}
                    </span>
                  )}
                  {(s.tags || []).map((tag, i) => (
                    <span
                      key={i}
                      className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* giá + giảm giá */}
                <div className="mt-3 text-blue-600 font-bold">
                  {s.discountPercent > 0 ? (
                    <>
                      {s.minPrice && s.maxPrice ? (
                        <>
                          {`${Math.round(
                            (s.minPrice * (100 - s.discountPercent)) / 100
                          ).toLocaleString("vi-VN")}đ – ${Math.round(
                            (s.maxPrice * (100 - s.discountPercent)) / 100
                          ).toLocaleString("vi-VN")}đ`}
                        </>
                      ) : (
                        `${Math.round(
                          (s.minPrice * (100 - s.discountPercent)) / 100
                        ).toLocaleString("vi-VN")}đ`
                      )}
                      <div className="text-sm text-gray-400 line-through">
                        {s.minPrice && s.maxPrice
                          ? `${s.minPrice.toLocaleString(
                              "vi-VN"
                            )}đ – ${s.maxPrice.toLocaleString("vi-VN")}đ`
                          : `${s.minPrice.toLocaleString("vi-VN")}đ`}
                      </div>
                    </>
                  ) : s.minPrice && s.maxPrice ? (
                    `${s.minPrice.toLocaleString("vi-VN")}đ – ${s.maxPrice.toLocaleString("vi-VN")}đ`
                  ) : s.minPrice ? (
                    `${s.minPrice.toLocaleString("vi-VN")}đ`
                  ) : (
                    "Liên hệ"
                  )}
                </div>

                {/* nút hành động */}
                <div className="mt-4 flex gap-3">
                  <Link
                    to={`/dich-vu/${category}/${s.slug || s._id}`}
                    className="px-4 py-2 border rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition"
                  >
                    Xem chi tiết
                  </Link>
                  <Link
                    to={`/dat-lich?serviceId=${s._id || s.id || s.slug}`}
                    className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition"
                  >
                    Đặt lịch
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// src/pages/PricingPage.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../api";
import Breadcrumb from "../components/Breadcrumb";

// utils
const formatVnd = (n) => {
  if (n == null) return "";
  return `${Number(n).toLocaleString("vi-VN")}đ`;
};

// Hardcode categories khớp DB
const CATEGORIES = [
  { name: "Niềng răng", slug: "nieng-rang" },
  { name: "Trồng răng Implant", slug: "trong-rang-implant" },
  { name: "Nha khoa tổng quát", slug: "nha-khoa-tong-quat" },
  { name: "Nha khoa trẻ em", slug: "nha-khoa-tre-em" },
];

export default function PricingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const category = searchParams.get("category") || "nieng-rang";

  // Load services theo category
  useEffect(() => {
    async function loadServices() {
      if (!category) return;
      setLoading(true);
      try {
        const res = await api.get(`/services?category=${category}`);
        setServices(res.data.data || []);
        document.title = `Bảng giá ${category} | Nha khoa`;
      } catch (err) {
        console.error("Load services error", err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, [category]);

  const handleCategoryChange = (e) => {
    const slug = e.target.value;
    setSearchParams({ category: slug });
    navigate(`?category=${slug}`);
  };

  return (
    <div className="p-6 md:p-12">
      {/* breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Trang chủ", to: "/" },
          { label: "Bảng giá nha khoa" }
        ]}
      />

      {/* title */}
      <h1 className="text-3xl font-bold text-emerald-800 mb-6">
        Bảng giá dịch vụ làm răng mới nhất 2025
      </h1>

      {/* select category */}
      <div className="mb-6">
        <label className="mr-2 font-medium">Chọn dịch vụ:</label>
        <select
          value={category}
          onChange={handleCategoryChange}
          className="border px-3 py-2 rounded"
        >
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* table */}
        <div className="lg:col-span-3 bg-white rounded shadow overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="text-left px-4 py-3">Dịch vụ</th>
                <th className="text-left px-4 py-3">Giá</th>
                <th className="text-left px-4 py-3">Đơn vị tính</th>
                <th className="text-left px-4 py-3">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-6">
                    Đang tải...
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-6">
                    Chưa có dịch vụ
                  </td>
                </tr>
              ) : (
                services.map((s) => {
                  const hasDiscount = s.discountPercent > 0;
                  return (
                    <tr
                      key={s._id || s.slug}
                      className="border-b hover:bg-gray-50"
                    >
                      {/* tên + badge */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span>{s.name}</span>
                          {hasDiscount && (
                            <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                              -{s.discountPercent}%
                            </span>
                          )}
                        </div>
                      </td>

                      {/* giá */}
                      <td className="px-4 py-3">
                        {hasDiscount ? (
                          <div>
                            <div className="text-gray-400 text-sm line-through">
                              {formatVnd(s.minPrice)} – {formatVnd(s.maxPrice)}
                            </div>
                            <div className="text-red-600 font-bold">
                              {formatVnd(
                                Math.round(
                                  (s.minPrice * (100 - s.discountPercent)) / 100
                                )
                              )}{" "}
                              –{" "}
                              {formatVnd(
                                Math.round(
                                  (s.maxPrice * (100 - s.discountPercent)) / 100
                                )
                              )}
                            </div>
                          </div>
                        ) : s.minPrice && s.maxPrice ? (
                          `${formatVnd(s.minPrice)} – ${formatVnd(s.maxPrice)}`
                        ) : s.minPrice ? (
                          formatVnd(s.minPrice)
                        ) : (
                          "Liên hệ"
                        )}
                      </td>

                      {/* đơn vị */}
                      <td className="px-4 py-3">
                        {s.detail?.unit || "Liệu trình"}
                      </td>

                      {/* chi tiết */}
                      <td className="px-4 py-3">
                        <Link
                          to={`/dich-vu/${s.categorySlug}/${s.slug}`}
                          className="text-blue-600 hover:underline"
                        >
                          Chi tiết
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* sidebar ảnh */}
        <aside className="hidden lg:block">
          <img
            src="/images/nha_khoa_award.png"
            alt="Nha khoa"
            className="w-full h-full object-cover rounded"
          />
        </aside>
      </div>
    </div>
  );
}

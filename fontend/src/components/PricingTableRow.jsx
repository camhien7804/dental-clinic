//src/components/PricingTableRow.jsx
import { Link } from "react-router-dom";
import { formatVnd, applyDiscount } from "../utils/format";


export default function PricingTableRow({ service }) {
  const { name, slug, categorySlug, minPrice, maxPrice, discountPercent, detail } = service;
  const hasDiscount = discountPercent > 0;

  const discountedMin = applyDiscount(minPrice, discountPercent);
  const discountedMax = applyDiscount(maxPrice, discountPercent);

  return (
    <tr className="border-b hover:bg-gray-50 transition">
      {/* Tên dịch vụ */}
      <td className="px-4 py-3 font-medium">
        <div className="flex items-center gap-2">
          <span>{name}</span>
          {hasDiscount && (
            <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
              -{discountPercent}%
            </span>
          )}
        </div>
      </td>

      {/* Giá */}
      <td className="px-4 py-3">
        {hasDiscount ? (
          <div>
            <div className="text-gray-400 text-sm line-through">
              {minPrice && maxPrice
                ? `${formatVnd(minPrice)} – ${formatVnd(maxPrice)}`
                : formatVnd(minPrice)}
            </div>
            <div className="text-red-600 font-bold">
              {discountedMin && discountedMax
                ? `${formatVnd(discountedMin)} – ${formatVnd(discountedMax)}`
                : formatVnd(discountedMin)}
            </div>
          </div>
        ) : minPrice && maxPrice ? (
          `${formatVnd(minPrice)} – ${formatVnd(maxPrice)}`
        ) : minPrice ? (
          formatVnd(minPrice)
        ) : (
          "Liên hệ"
        )}
      </td>

      {/* Đơn vị */}
      <td className="px-4 py-3">{detail?.unit || "Liệu trình"}</td>

      {/* Link chi tiết */}
      <td className="px-4 py-3">
        <Link
          to={`/dich-vu/${categorySlug}/${slug}`}
          className="text-blue-600 hover:text-blue-800 hover:underline transition"
        >
          Chi tiết
        </Link>
      </td>
    </tr>
  );
}

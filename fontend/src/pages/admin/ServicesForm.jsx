import React, { useState } from "react";
import api from "../../api";

export default function ServicesForm({ initial, onSaved, onClose }) {
  const [form, setForm] = useState(
    initial || {
      name: "",
      title: "",
      code: "",
      minPrice: "",
      maxPrice: "",
      discountPercent: 0,
      category: "",
      categorySlug: "",
      description: "",
      durationMins: 30,
      tags: [],
      isActive: true,
    }
  );
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initial?.image || null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v != null && v !== "") {
          if (Array.isArray(v)) {
            v.forEach((item) => fd.append(k, item));
          } else {
            fd.append(k, v);
          }
        }
      });
      if (file) fd.append("image", file);

      let res;
      if (initial?._id) {
        // Edit mode
        res = await api.put(`/services/${initial._id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Add mode
        res = await api.post("/services", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      onSaved && onSaved(res.data.data);
      alert("Lưu thành công");
      onClose && onClose();
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-4 p-4 max-h-[80vh] overflow-y-auto"
    >
      {/* Tên */}
      <div>
        <label className="block text-sm font-medium">Tên dịch vụ</label>
        <input
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2"
          required
        />
      </div>

      {/* Tiêu đề */}
      <div>
        <label className="block text-sm font-medium">Tiêu đề (optional)</label>
        <input
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2"
        />
      </div>

      {/* Code */}
      <div>
        <label className="block text-sm font-medium">Mã (code)</label>
        <input
          value={form.code}
          onChange={(e) => handleChange("code", e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2"
        />
      </div>

      {/* Giá */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Giá tối thiểu</label>
          <input
            type="number"
            value={form.minPrice}
            onChange={(e) => handleChange("minPrice", e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Giá tối đa</label>
          <input
            type="number"
            value={form.maxPrice}
            onChange={(e) => handleChange("maxPrice", e.target.value)}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Giảm giá */}
      <div>
        <label className="block text-sm font-medium">Giảm giá (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          value={form.discountPercent}
          onChange={(e) => handleChange("discountPercent", e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2"
        />
      </div>

      {/* Danh mục */}
      <div>
        <label className="block text-sm font-medium">Danh mục</label>
        <select
          value={form.categorySlug}
          onChange={(e) => {
            const slug = e.target.value;
            const label = e.target.options[e.target.selectedIndex].text;
            setForm((f) => ({ ...f, categorySlug: slug, category: label }));
          }}
          className="mt-1 w-full border rounded px-3 py-2"
        >
          <option value="">-- Chọn danh mục --</option>
          <option value="trong-rang-implant">Trồng răng Implant</option>
          <option value="nieng-rang">Niềng răng</option>
          <option value="nha-khoa-tong-quat">Nha khoa tổng quát</option>
          <option value="nha-khoa-tre-em">Nha khoa trẻ em</option>
        </select>
      </div>

      {/* Mô tả */}
      <div>
        <label className="block text-sm font-medium">Mô tả</label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={3}
          className="mt-1 w-full border rounded px-3 py-2"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium">Tags</label>
        <input
          value={form.tags?.join(",") || ""}
          onChange={(e) =>
            handleChange("tags", e.target.value.split(",").map((t) => t.trim()))
          }
          className="mt-1 w-full border rounded px-3 py-2"
          placeholder="Ví dụ: bán chạy,khuyến mãi"
        />
      </div>

      {/* Thời lượng */}
      <div>
        <label className="block text-sm font-medium">Thời lượng (phút)</label>
        <input
          type="number"
          value={form.durationMins}
          onChange={(e) => handleChange("durationMins", e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2"
        />
      </div>

      {/* Ảnh + Preview */}
      <div>
        <label className="block text-sm font-medium">Ảnh</label>
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-32 h-32 object-contain mb-2 border rounded"
          />
        )}
        <input
          type="file"
          onChange={(e) => {
            const f = e.target.files[0];
            setFile(f);
            setPreview(URL.createObjectURL(f));
          }}
          className="mt-1 w-full"
        />
      </div>

      {/* Hiển thị */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => handleChange("isActive", e.target.checked)}
        />
        <label className="text-sm">Hiển thị</label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
      >
        {loading
          ? "Đang lưu..."
          : initial?._id
          ? "Cập nhật dịch vụ"
          : "Thêm dịch vụ"}
      </button>
    </form>
  );
}

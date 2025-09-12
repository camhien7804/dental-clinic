import { useState, useEffect } from "react";
import api from "../../api";

export default function AdminServices() {
  const [list, setList] = useState([]);
  const [filtered, setFiltered] = useState([]); // ✅ danh sách sau khi lọc
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [form, setForm] = useState({
    name: "",
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
    imagePath: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    load();
    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, []);

  // tải dịch vụ
  const load = async () => {
    try {
      const r = await api.get("/services");
      const data = r.data.data || [];
      setList(data);
      setFiltered(data); // ban đầu = full list
    } catch (err) {
      console.error(err);
      alert("Không lấy được dịch vụ. Kiểm tra kết nối.");
    }
  };

  // lọc khi search hoặc chọn category
  useEffect(() => {
    let result = [...list];
    if (categoryFilter) {
      result = result.filter((s) => s.categorySlug === categoryFilter);
    }
    if (search.trim()) {
      const kw = search.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(kw));
    }
    setFiltered(result);
  }, [list, search, categoryFilter]);

  function onFileChange(e) {
    const f = e.target.files?.[0];
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : "");
  }

  async function submit(e) {
    e.preventDefault();
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
      if (file) {
        fd.append("image", file);
      } else if (form.imagePath) {
        fd.append("image", form.imagePath);
      }

      await api.post("/services", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm({
        name: "",
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
        imagePath: "",
      });
      setFile(null);
      setPreview("");
      await load();
      alert("Tạo dịch vụ thành công");
    } catch (err) {
      console.error("create service err:", err);
      alert(err?.response?.data?.message || err.message || "Lỗi tạo dịch vụ");
    }
  }

  async function remove(id) {
    if (!confirm("Xóa dịch vụ này?")) return;
    try {
      await api.delete(`/services/${id}`);
      await load();
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại: " + (err?.response?.data?.message || err.message));
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-3">Quản lý dịch vụ</h1>

      {/* Bộ lọc */}
      <div className="flex items-center gap-3 mb-4">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">-- Chọn danh mục --</option>
          <option value="trong-rang-implant">Trồng răng Implant</option>
          <option value="nieng-rang">Niềng răng</option>
          <option value="nha-khoa-tong-quat">Nha khoa tổng quát</option>
          <option value="nha-khoa-tre-em">Nha khoa trẻ em</option>
        </select>

        <input
          type="text"
          placeholder="Tìm theo tên dịch vụ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 flex-1 rounded"
        />
      </div>

      {/* Form thêm dịch vụ */}
      <form
        onSubmit={submit}
        className="bg-white p-4 rounded shadow space-y-3 mb-6"
      >
        <input
          placeholder="Tên dịch vụ"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2"
          required
        />

        <input
          placeholder="Mã (code)"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          className="w-full border p-2"
        />

        <div className="flex gap-2">
          <input
            placeholder="Giá tối thiểu"
            type="number"
            value={form.minPrice}
            onChange={(e) => setForm({ ...form, minPrice: e.target.value })}
            className="border p-2 flex-1"
          />
          <input
            placeholder="Giá tối đa"
            type="number"
            value={form.maxPrice}
            onChange={(e) => setForm({ ...form, maxPrice: e.target.value })}
            className="border p-2 flex-1"
          />
        </div>

        <input
          placeholder="Giảm giá (%)"
          type="number"
          min="0"
          max="100"
          value={form.discountPercent}
          onChange={(e) =>
            setForm({ ...form, discountPercent: e.target.value })
          }
          className="w-full border p-2"
        />

        <input
          placeholder="Danh mục (vd: Trồng răng Implant)"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full border p-2"
        />

        <input
          placeholder="Slug danh mục (vd: trong-rang-implant)"
          value={form.categorySlug}
          onChange={(e) => setForm({ ...form, categorySlug: e.target.value })}
          className="w-full border p-2"
        />

        <textarea
          placeholder="Mô tả"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full border p-2"
          rows={3}
        />

        <input
          placeholder="Tags (vd: bán chạy,khuyến mãi)"
          value={form.tags?.join(",") || ""}
          onChange={(e) =>
            setForm({
              ...form,
              tags: e.target.value.split(",").map((t) => t.trim()),
            })
          }
          className="w-full border p-2"
        />

        <input
          placeholder="Thời lượng (phút)"
          type="number"
          value={form.durationMins}
          onChange={(e) =>
            setForm({ ...form, durationMins: e.target.value })
          }
          className="w-full border p-2"
        />

        <div>
          <label className="block text-sm">Path ảnh public</label>
          <input
            value={form.imagePath}
            onChange={(e) => setForm({ ...form, imagePath: e.target.value })}
            className="w-full border p-2"
          />
        </div>

        <div>
          <label className="block text-sm">Hoặc upload file</label>
          <input type="file" accept="image/*" onChange={onFileChange} />
          {preview && (
            <img src={preview} alt="preview" className="h-24 mt-2 rounded" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
          <label>Hiển thị</label>
        </div>

        <button className="px-4 py-2 bg-emerald-700 text-white rounded">
          Tạo dịch vụ
        </button>
      </form>

      {/* Danh sách dịch vụ */}
      <div>
        <h2 className="font-semibold mb-2">Danh sách dịch vụ</h2>
        <div className="grid grid-cols-3 gap-4">
          {filtered.map((s) => (
            <div
              key={s._id}
              className="p-3 bg-white rounded shadow flex flex-col"
            >
              <img
                src={s.image || "/images/placeholder.png"}
                alt={s.title || s.name}
                className="h-32 w-full object-cover rounded"
              />
              <div className="font-semibold mt-2">
                {s.name || s.title || s.code}
              </div>
              <div className="text-sm text-gray-600">{s.category}</div>
              {s.discountPercent > 0 && (
                <div className="text-sm text-red-600">
                  Giảm {s.discountPercent}%
                </div>
              )}
              <div className="text-xs text-gray-500">
                Tags: {s.tags?.join(", ")}
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  className="text-sm text-red-600"
                  onClick={() => remove(s._id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

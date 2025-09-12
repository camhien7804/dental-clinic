// src/pages/admin/AdminDoctors.jsx
import { useState, useEffect } from "react";
import api from "../../api";

const DAYS = [
  { value: "Mon", label: "Thứ 2" },
  { value: "Tue", label: "Thứ 3" },
  { value: "Wed", label: "Thứ 4" },
  { value: "Thu", label: "Thứ 5" },
  { value: "Fri", label: "Thứ 6" },
  { value: "Sat", label: "Thứ 7" },
  { value: "Sun", label: "Chủ nhật" },
];

export default function AdminDoctors() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    phone: "",
    shortIntro: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [scheduleForm, setScheduleForm] = useState({
    workDays: [],
    workStart: "08:00",
    workEnd: "17:00",
  });
  const [editingScheduleId, setEditingScheduleId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const r = await api.get("/dentists");
      setList(r.data.data || []);
    } catch (err) {
      console.error("Load dentists error:", err);
      setList([]);
    }
  };

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : "");
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("password", form.password || "Dentist@123");
      fd.append("specialization", form.specialization);
      fd.append("phone", form.phone);
      fd.append("shortIntro", form.shortIntro);

      // ✅ sửa: đồng bộ với BE (BE đang nhận field "avatar")
      if (file) fd.append("avatar", file);

      await api.post("/dentists", fd);
      setForm({
        name: "",
        email: "",
        password: "",
        specialization: "",
        phone: "",
        shortIntro: "",
      });
      setFile(null);
      setPreview("");
      await load();
      alert("Tạo bác sĩ thành công");
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm("Xóa bác sĩ này?")) return;
    try {
      await api.delete(`/dentists/${id}`);
      await load();
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  const openSchedule = (d) => {
    setEditingScheduleId(d._id);
    setScheduleForm({
      workDays: d.workDays || [],
      workStart: d.workStart || "08:00",
      workEnd: d.workEnd || "17:00",
    });
  };

  const saveSchedule = async () => {
    try {
      await api.put(`/dentists/${editingScheduleId}/schedule`, scheduleForm);
      alert("Cập nhật lịch làm việc thành công");
      setEditingScheduleId(null);
      await load();
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  const toggleWorkDay = (day) => {
    setScheduleForm((f) => {
      const exists = f.workDays.includes(day);
      return {
        ...f,
        workDays: exists
          ? f.workDays.filter((d) => d !== day)
          : [...f.workDays, day],
      };
    });
  };

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-2xl font-bold mb-3 text-emerald-700">
        👨‍⚕️ Quản lý bác sĩ
      </h1>

      {/* Form thêm bác sĩ */}
      <form
        onSubmit={submit}
        className="bg-white p-4 rounded shadow space-y-3 max-w-lg"
      >
        <h2 className="font-semibold text-lg mb-2">➕ Thêm bác sĩ</h2>
        <input
          placeholder="Tên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          placeholder="Mật khẩu"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          placeholder="Chuyên môn"
          value={form.specialization}
          onChange={(e) =>
            setForm({ ...form, specialization: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
        <input
          placeholder="Điện thoại"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <textarea
          placeholder="Mô tả ngắn"
          value={form.shortIntro}
          onChange={(e) =>
            setForm({ ...form, shortIntro: e.target.value })
          }
          className="w-full border p-2 rounded"
        />

        <div>
          <label className="block text-sm">Ảnh đại diện</label>
          <input type="file" accept="image/*" onChange={onFileChange} />
          {preview && (
            <img src={preview} alt="preview" className="h-24 mt-2 rounded" />
          )}
        </div>

        <button className="px-4 py-2 bg-emerald-700 text-white rounded hover:bg-emerald-800">
          Tạo bác sĩ
        </button>
      </form>

      {/* Danh sách bác sĩ */}
      <div>
        <h2 className="font-semibold mb-3 text-lg">📋 Danh sách bác sĩ</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {list.map((d) => (
            <div
              key={d._id}
              className="p-3 bg-white rounded shadow flex flex-col"
            >
              <img
                src={d.avatar || "/images/doctors/default.png"}
                alt={d.user?.name || d.slug}
                className="h-32 w-full object-cover rounded"
                // ✅ fallback an toàn nếu link Cloudinary lỗi
                onError={(e) => {
                  e.currentTarget.src = "/images/doctors/default.png";
                }}
              />
              <div className="font-semibold mt-2">{d.user?.name}</div>
              <div className="text-sm text-gray-600">{d.specialization}</div>
              <div className="text-xs text-gray-500">
                {d.phone || "Chưa có SĐT"}
              </div>
              <div className="mt-2 text-xs">
                <b>Lịch làm việc:</b>{" "}
                {d.workDays?.length > 0
                  ? d.workDays.join(", ")
                  : "Chưa thiết lập"}{" "}
                ({d.workStart || "--:--"} - {d.workEnd || "--:--"})
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  className="text-sm text-blue-600"
                  onClick={() => openSchedule(d)}
                >
                  🕒 Lịch làm việc
                </button>
                <button
                  className="text-sm text-red-600"
                  onClick={() => remove(d._id)}
                >
                  ❌ Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal chỉnh sửa lịch làm việc */}
      {editingScheduleId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              🕒 Chỉnh sửa lịch làm việc
            </h2>

            <div className="mb-3">
              <label className="block font-medium">Ngày làm việc</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {DAYS.map((d) => (
                  <label key={d.value} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={scheduleForm.workDays.includes(d.value)}
                      onChange={() => toggleWorkDay(d.value)}
                    />
                    {d.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mb-3">
              <div>
                <label className="block text-sm">Bắt đầu</label>
                <input
                  type="time"
                  value={scheduleForm.workStart}
                  onChange={(e) =>
                    setScheduleForm((f) => ({
                      ...f,
                      workStart: e.target.value,
                    }))
                  }
                  className="border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm">Kết thúc</label>
                <input
                  type="time"
                  value={scheduleForm.workEnd}
                  onChange={(e) =>
                    setScheduleForm((f) => ({
                      ...f,
                      workEnd: e.target.value,
                    }))
                  }
                  className="border p-2 rounded"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingScheduleId(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={saveSchedule}
                className="px-4 py-2 bg-emerald-700 text-white rounded hover:bg-emerald-800"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

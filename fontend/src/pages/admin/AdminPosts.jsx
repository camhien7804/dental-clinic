// src/pages/admin/AdminPosts.jsx
import { useEffect, useState } from "react";
import api from "../../api";

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null); // nếu có _id thì đang sửa
  const [form, setForm] = useState({
    title: "",
    summary: "",
    content: "",
    tags: "",
    image: null,
  });

  // load danh sách
  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/posts");
      setPosts(res.data.data || []);
    } catch (err) {
      console.error("Load posts error", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // submit (tạo mới hoặc update)
  async function submit(e) {
    e.preventDefault();
    try {
      const fd = new FormData();
      Object.keys(form).forEach((k) => {
        if (form[k]) fd.append(k, form[k]);
      });

      if (editing) {
        await api.put(`/posts/${editing}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Cập nhật thành công");
      } else {
        await api.post("/posts", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Thêm mới thành công");
      }
      setForm({ title: "", summary: "", content: "", tags: "", image: null });
      setEditing(null);
      load();
    } catch (err) {
      console.error("Save post error", err);
      alert("❌ Lỗi khi lưu");
    }
  }

  async function remove(id) {
    if (!window.confirm("Bạn chắc chắn muốn xóa bài viết này?")) return;
    try {
      await api.delete(`/posts/${id}`);
      alert("Đã xóa");
      load();
    } catch (err) {
      console.error("Delete post error", err);
    }
  }

  function edit(post) {
    setEditing(post._id);
    setForm({
      title: post.title,
      summary: post.summary,
      content: post.content,
      tags: (post.tags || []).join(", "),
      image: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Quản lý bài viết</h1>

      {/* Form */}
      <form onSubmit={submit} className="grid gap-3 bg-white p-4 rounded shadow mb-6">
        <input
          className="border p-2 rounded"
          placeholder="Tiêu đề"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Tóm tắt"
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
        />
        <textarea
          className="border p-2 rounded h-40"
          placeholder="Nội dung"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Tags (cách nhau dấu phẩy)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />
        <input
          type="file"
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
        />

        <button className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">
          {editing ? "💾 Cập nhật" : "➕ Thêm mới"}
        </button>
        {editing && (
          <button
            type="button"
            className="ml-2 px-4 py-2 border rounded"
            onClick={() => {
              setEditing(null);
              setForm({ title: "", summary: "", content: "", tags: "", image: null });
            }}
          >
            Hủy
          </button>
        )}
      </form>

      {/* Bảng */}
      <table className="w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2">Tiêu đề</th>
            <th className="text-left p-2">Ngày tạo</th>
            <th className="text-left p-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="3" className="p-4 text-center">
                Đang tải...
              </td>
            </tr>
          ) : posts.length === 0 ? (
            <tr>
              <td colSpan="3" className="p-4 text-center">
                Chưa có bài viết
              </td>
            </tr>
          ) : (
            posts.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-2">{p.title}</td>
                <td className="p-2">{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => edit(p)}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => remove(p._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

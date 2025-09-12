// src/pages/blog/PostDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api";

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.get(`/posts/${slug}`);
        setPost(res.data.data);
        document.title = `${res.data.data.title} | Kiến thức nha khoa`;
      } catch (err) {
        console.error("Load post error", err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) return <div className="p-6">Đang tải...</div>;
  if (!post) return <div className="p-6">Không tìm thấy bài viết.</div>;

  return (
    <div className="p-6 md:p-12 max-w-4xl mx-auto">
      {/* breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:underline">Trang chủ</Link> &gt;{" "}
        <Link to="/kien-thuc" className="hover:underline">Kiến thức nha khoa</Link> &gt;{" "}
        <span className="text-gray-700">{post.title}</span>
      </nav>

      {/* tiêu đề */}
      <h1 className="text-3xl font-bold text-emerald-800 mb-2">{post.title}</h1>
      <p className="text-gray-500 text-sm mb-4">
        🗓 {new Date(post.createdAt).toLocaleDateString("vi-VN")}
      </p>

      {/* ảnh chính */}
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-full max-h-96 object-cover rounded-lg mb-6"
        />
      )}

      {/* tóm tắt */}
      {post.summary && (
        <p className="text-lg text-gray-700 mb-4 leading-relaxed">{post.summary}</p>
      )}

      {/* nội dung */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* tags */}
      {post.tags?.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((t, idx) => (
            <span
              key={idx}
              className="px-3 py-1 text-sm bg-emerald-50 text-emerald-700 rounded-full"
            >
              #{t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
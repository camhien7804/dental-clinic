// src/pages/blog/BlogList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.get("/posts"); // BE: GET /api/v1/posts
        setPosts(res.data.data || []);
      } catch (err) {
        console.error("Load posts error", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-emerald-800 mb-6">
        Kiến Thức Nha Khoa
      </h1>

      {loading ? (
        <p>Đang tải...</p>
      ) : posts.length === 0 ? (
        <p>Chưa có bài viết.</p>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-lg shadow p-5 hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-blue-700 mb-2">
                {post.title}
              </h2>
              <p className="text-gray-500 text-sm mb-2">
                {new Date(post.createdAt).toLocaleDateString("vi-VN")}
              </p>
              <p className="text-gray-700 mb-3">{post.summary}</p>
              <Link
                to={`/kien-thuc/${post.slug}`}
                className="text-emerald-700 hover:underline font-medium"
              >
                Xem chi tiết →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

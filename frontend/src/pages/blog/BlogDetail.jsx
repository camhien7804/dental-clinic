import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api";

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    async function load() {
      const res = await api.get(`/posts/${slug}`);
      setPost(res.data.data);
    }
    load();
  }, [slug]);

  if (!post) return <div className="p-6">Đang tải...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <nav className="text-sm text-gray-500 mb-3">
        <Link to="/">Trang chủ</Link> &gt; <Link to="/kien-thuc">Kiến Thức</Link> &gt; {post.title}
      </nav>
      <h1 className="text-3xl font-bold text-emerald-800 mb-3">{post.title}</h1>
      <p className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleDateString("vi-VN")}</p>
      {post.image && <img src={post.image} alt={post.title} className="w-full max-h-[500px] object-cover rounded my-4" />}
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}

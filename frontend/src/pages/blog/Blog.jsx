// src/pages/Blog.jsx
import { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  useEffect(()=>{ api.get("/posts").then(res=>setPosts(res.data.data||[])) },[]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-emerald-800 mb-6">Kiến thức nha khoa</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map(p=>(
          <Link key={p._id} to={`/blog/${p._id}`} className="bg-white shadow rounded overflow-hidden hover:shadow-md transition">
            <img src={p.image||"/images/placeholder.png"} alt="" className="h-40 w-full object-cover"/>
            <div className="p-4">
              <h2 className="font-semibold text-lg mb-2">{p.title}</h2>
              <p className="text-gray-600 text-sm">{p.summary}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

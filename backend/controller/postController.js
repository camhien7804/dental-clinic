import Post from "../models/Post.js";
import cloudinary from "../config/cloudinary.js";

// ✅ Lấy danh sách tất cả bài viết
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: posts });
  } catch (err) {
    console.error("getPosts error:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// ✅ Lấy chi tiết bài viết theo slug
export const getPostBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const post = await Post.findOne({ slug }).lean();
    if (!post) return res.status(404).json({ success: false, message: "Không tìm thấy bài viết" });
    res.json({ success: true, data: post });
  } catch (err) {
    console.error("getPostBySlug error:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// ✅ Tạo bài viết mới
export const createPost = async (req, res) => {
  try {
    const { title, summary, content, tags } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Thiếu tiêu đề hoặc nội dung" });
    }

    let imageUrl = "";
    if (req.files && req.files.image) {
      const uploadRes = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: "posts",
      });
      imageUrl = uploadRes.secure_url;
    }

    const newPost = await Post.create({
      title,
      summary,
      content,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      image: imageUrl,
      author: req.user?._id || null, // nếu có auth
    });

    res.status(201).json({ success: true, data: newPost });
  } catch (err) {
    console.error("createPost error:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// ✅ Cập nhật bài viết
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, summary, content, tags } = req.body;

    const update = { title, summary, content };
    if (tags) update.tags = tags.split(",").map((t) => t.trim());

    if (req.files && req.files.image) {
      const uploadRes = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: "posts",
      });
      update.image = uploadRes.secure_url;
    }

    const post = await Post.findByIdAndUpdate(id, update, { new: true });
    if (!post) return res.status(404).json({ success: false, message: "Không tìm thấy bài viết" });

    res.json({ success: true, data: post });
  } catch (err) {
    console.error("updatePost error:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// ✅ Xóa bài viết
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Post.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Không tìm thấy bài viết" });
    res.json({ success: true, message: "Đã xóa bài viết" });
  } catch (err) {
    console.error("deletePost error:", err);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

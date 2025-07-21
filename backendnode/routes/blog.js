  const express = require("express");
  const router = express.Router();
  const { Op } = require("sequelize");
  const authenticate = require('../middlewares/authenticateToken');
  const Blog = require("../models/Blog");
  const User = require("../models/User");
  const BlogLike = require("../models/BlogLike");
  const BlogComment = require("../models/BlogComment");

  // ✅ GET: Lấy danh sách bài viết
  router.get("/", async (req, res) => {
    try {
      const posts = await Blog.findAll({
        include: [{ model: User, as: "Author", attributes: ["FullName", "Role"] }],
        order: [["LastUpdated", "DESC"]],
      });

      const postsWithDetails = await Promise.all(
        posts.map(async (post) => {
          const likeCount = await BlogLike.count({ where: { IDPost: post.IDPost } });
          const commentCount = await BlogComment.count({ where: { IDPost: post.IDPost } });

          const previewComments = await BlogComment.findAll({
            where: { IDPost: post.IDPost },
            include: [{ model: User, attributes: ["FullName"] }],
            order: [["CommentedAt", "ASC"]],
            limit: 3,
          });

          return {
            ...post.toJSON(),
            Author: post.Author ? (post.Author.Role === "Admin" ? "Admin" : post.Author.FullName) : "Không xác định",
            likeCount,
            commentCount,
            previewComments,
          };
        })
      );

      res.json(postsWithDetails);
    } catch (err) {
      console.error("❌ Lỗi khi lấy danh sách blog:", err);
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  });

  // ✅ POST: Đăng bài viết mới
  router.post("/", authenticate, async (req, res) => {
    if (req.user.Role !== "Admin") {
      return res.status(403).json({ message: "Bạn không có quyền đăng bài viết." });
    }
    const { Title, Content } = req.body;
    if (!Title || !Content) {
      return res.status(400).json({ message: "Thiếu tiêu đề hoặc nội dung" });
    }
    try {
      const post = await Blog.create({
        Title,
        Content,
        IDUser: req.user.IDUser, // Lấy IDUser từ token đã xác thực
        LastUpdated: new Date(),
      });
      res.status(201).json({ message: "Đăng bài thành công", post });
    } catch (err) {
      res.status(500).json({ message: "Lỗi server khi đăng bài", error: err.message });
    }
  });

  // ✅ PUT: Cập nhật bài viết
  router.put("/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
      const post = await Blog.findByPk(id);
      if (!post) return res.status(404).json({ message: "Không tìm thấy bài viết" });

      if (post.IDUser !== req.user.IDUser && req.user.Role !== "Admin") {
        return res.status(403).json({ message: "Không có quyền sửa bài viết này" });
      }

      await post.update({
        Title: title,
        Content: content,
        LastUpdated: new Date(),
      });

      res.json({ message: "✅ Cập nhật thành công", post });
    } catch (err) {
      res.status(500).json({ message: "Lỗi server khi cập nhật", error: err.message });
    }
  });

  // ✅ DELETE: Xoá bài viết
  router.delete("/:id", authenticate, async (req, res) => {
    const { id } = req.params;S

    try {
      const post = await Blog.findByPk(id);

      if (!post) {
        return res.status(404).json({ message: "❌ Không tìm thấy bài viết" });
      }

      console.log("🔍 IDUser bài viết:", post.IDUser, typeof post.IDUser);
      console.log("🔍 IDUser người dùng:", req.user.IDUser, typeof req.user.IDUser);
      console.log("🔍 Role người dùng:", req.user.Role);

      if (Number(post.IDUser) !== Number(req.user.IDUser) && req.user.Role !== "Admin") {
        return res.status(403).json({ message: "⚠️ Không có quyền xoá bài viết này" });
      }

      await post.destroy();
      return res.status(200).json({ message: "✅ Xoá bài viết thành công" });
    } catch (err) {
      console.error("❌ Lỗi xoá bài viết:", err);
      return res.status(500).json({ message: "❌ Lỗi server khi xoá", error: err.message });
    }
  });

  module.exports = router;

  // ✅ Lấy tất cả bình luận cho 1 bài viết
  router.get("/:id/comments", async (req, res) => {
    try {
      const IDPost = req.params.id;

      const comments = await BlogComment.findAll({
        where: { IDPost },
        include: [{ model: User, attributes: ["FullName"] }],
        order: [["CommentedAt", "ASC"]],
      });

      res.json(comments);
    } catch (err) {
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  });

  // ✅ Bình luận bài viết
  router.post("/:id/comment", authenticate, async (req, res) => {
    try {
      const IDPost = req.params.id;
      const IDUser = req.user.IDUser;
      const { content } = req.body;

      if (!content)
        return res.status(400).json({ message: "Nội dung bình luận không được để trống" });

      const comment = await BlogComment.create({ IDPost, IDUser, Content: content });

      res.json({ message: "Đã bình luận", comment });
    } catch (err) {
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  });

  // ✅ Like bài viết
  router.post("/:id/like", authenticate, async (req, res) => {
    try {
      const IDPost = req.params.id;
      const IDUser = req.user.IDUser;

      const existed = await BlogLike.findOne({ where: { IDPost, IDUser } });
      if (existed) {
        return res.status(400).json({ message: "Bạn đã thích bài này rồi" });
      }

      await BlogLike.create({ IDPost, IDUser });
      res.json({ message: "Đã thích bài viết" });
    } catch (err) {
      res.status(500).json({ message: "Lỗi server", error: err.message });
    }
  });

  module.exports = router;

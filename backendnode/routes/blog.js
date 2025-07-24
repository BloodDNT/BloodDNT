const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const authenticate = require("../middlewares/authenticateToken");
const Blog = require("../models/Blog");
const User = require("../models/User");
const BlogLike = require("../models/BlogLike");
const BlogComment = require("../models/BlogComment");
const BlogReport = require("../models/BlogReport");

// ✅ GET tất cả bài viết
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
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});

// ✅ POST: Đăng bài viết
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
      IDUser: req.user.IDUser,
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

    await post.update({ Title: title, Content: content, LastUpdated: new Date() });

    res.json({ message: "✅ Cập nhật thành công", post });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi cập nhật", error: err.message });
  }
});

// ✅ DELETE: Xoá bài viết
router.delete("/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Blog.findByPk(id);
    if (!post) return res.status(404).json({ message: "Không tìm thấy bài viết" });

    if (Number(post.IDUser) !== Number(req.user.IDUser) && req.user.Role !== "Admin") {
      return res.status(403).json({ message: "Không có quyền xoá bài viết này" });
    }

    await post.destroy();
    res.status(200).json({ message: "✅ Xoá bài viết thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi xoá", error: err.message });
  }
});

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

    if (!content) return res.status(400).json({ message: "Nội dung bình luận không được để trống" });

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

// ✅ Báo cáo bài viết

router.post("/report", authenticate, async (req, res) => {
try {
    console.log(req.body); // 🟢 Đặt ở đây để xem dữ liệu gửi lên

    const { IDPost, IDReporter, Reason } = req.body;
if (!IDPost || !IDReporter || !Reason) {
  return res.status(400).json({ error: 'Thiếu thông tin báo cáo' });
}
    const newReport = await BlogReport.create({
      IDPost,
      IDReporter,
      Reason
    });
console.log('🟢 newReport:', newReport.toJSON());
const reports = await BlogReport.findAll();
console.log('Tất cả báo cáo:', reports.map(r => r.toJSON()));
    res.status(201).json({ message: 'Gửi báo cáo thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi server', details: error.message });
  }
});


module.exports = router;

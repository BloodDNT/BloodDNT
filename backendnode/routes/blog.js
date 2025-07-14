const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { authenticate } = require('./auth');
const User = require('../models/User');
const BlogLike = require('../models/BlogLike');
const BlogComment = require('../models/BlogComment');
// Đăng bài mới
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content) return res.status(400).json({ message: 'Thiếu tiêu đề hoặc nội dung' });
    const post = await Blog.create({
      Title: title,
      Content: content,
      Category: category,
      IDUser: req.user.IDUser
    });
    res.json({ message: 'Đăng bài thành công', post });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// Lấy danh sách bài viết
router.get('/', async (req, res) => {
  try {
    const posts = await Blog.findAll({
      include: [{ model: User, attributes: ['FullName'] }],
      order: [['LastUpdated', 'DESC']]
    });

    // Lấy số like và comment cho từng bài
    const postsWithCounts = await Promise.all(posts.map(async post => {
      const likeCount = await BlogLike.count({ where: { IDPost: post.IDPost } });
      const commentCount = await BlogComment.count({ where: { IDPost: post.IDPost } });
      return {
        ...post.toJSON(),
        likeCount,
        commentCount
      };
    }));

    res.json(postsWithCounts);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});
// Like bài viết
router.post('/:id/like', authenticate, async (req, res) => {
  try {
    const IDPost = req.params.id;
    const IDUser = req.user.IDUser;
    // Kiểm tra đã like chưa
    const existed = await BlogLike.findOne({ where: { IDPost, IDUser } });
    if (existed) {
      return res.status(400).json({ message: 'Bạn đã thích bài này rồi' });
    }
    await BlogLike.create({ IDPost, IDUser });
    res.json({ message: 'Đã thích bài viết' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// Bình luận bài viết
router.post('/:id/comment', authenticate, async (req, res) => {
  try {
    const IDPost = req.params.id;
    const IDUser = req.user.IDUser;
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Nội dung bình luận không được để trống' });
    const comment = await BlogComment.create({ IDPost, IDUser, Content: content });
    res.json({ message: 'Đã bình luận', comment });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// Lấy danh sách bình luận cho 1 bài viết
router.get('/:id/comments', async (req, res) => {
  try {
    const IDPost = req.params.id;
    const comments = await BlogComment.findAll({
      where: { IDPost },
      include: [{ model: User, attributes: ['FullName'] }],
      order: [['CommentedAt', 'ASC']]
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});
router.get('/', async (req, res) => {
  try {
    const posts = await Blog.findAll({
      include: [{ model: User, attributes: ['FullName'] }],
      order: [['LastUpdated', 'DESC']]
    });

    // Lấy số like và comment cho từng bài
    const postsWithCounts = await Promise.all(posts.map(async post => {
      const likeCount = await BlogLike.count({ where: { IDPost: post.IDPost } });
      const commentCount = await BlogComment.count({ where: { IDPost: post.IDPost } });
      return {
        ...post.toJSON(),
        likeCount,
        commentCount
      };
    }));

    res.json(postsWithCounts);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

module.exports = router;
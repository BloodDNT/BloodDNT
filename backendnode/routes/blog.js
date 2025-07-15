
const express = require("express");
const router = express.Router();
const sequelize = require("../config/database");

const Blog = require('../models/Blog');
const { authenticate } = require('./auth');
const User = require('../models/User');
const BlogLike = require('../models/BlogLike');
const BlogComment = require('../models/BlogComment');

router.get("/", async (req, res) => {
    try {
        const [results] = await sequelize.query(`
       SELECT 
    b.IDPost, 
    b.Title, 
    CAST(b.Content AS NVARCHAR(MAX)) AS Content,
    b.LastUpdated,
    CASE 
        WHEN u.Role = 'Admin' THEN N'Admin' 
        ELSE u.FullName 
    END AS Author,
    u.Role,
    COUNT(DISTINCT bl.IDLike) AS LikeCount,
    COUNT(DISTINCT bc.IDComment) AS CommentCount
FROM Blog b
JOIN Users u ON b.IDUser = u.IDUser
LEFT JOIN BlogLike bl ON b.IDPost = bl.IDPost
LEFT JOIN BlogComment bc ON b.IDPost = bc.IDPost
GROUP BY 
    b.IDPost, 
    b.Title, 
    CAST(b.Content AS NVARCHAR(MAX)), 
    b.LastUpdated,
    u.FullName, 
    u.Role
ORDER BY b.IDPost DESC;
    `);

        res.json(results);
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách blog:", error);
        res.status(500).send("Lỗi server: " + error.message);
    }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await sequelize.query(`DELETE FROM Blog WHERE IDPost = ?`, {
      replacements: [id]
    });
    res.status(200).send("✅ Xoá bài viết thành công");
  } catch (error) {
    console.error("❌ Lỗi xoá blog:", error);
    res.status(500).send("Lỗi server khi xoá blog");
  }
});

router.post('/', async (req, res) => {
  console.log("BODY:", req.body); // Debug
  const { Title, Content, IDUser } = req.body;

  try {
    await sequelize.query(`
      INSERT INTO Blog (Title, Content, IDUser, LastUpdated)
      VALUES (?, ?, ?, GETDATE())
    `, {
      replacements: [Title, Content, IDUser]
    });

    res.status(201).send("✅ Đăng bài viết thành công");
  } catch (error) {
    console.error("❌ Lỗi thêm bài viết:", error);
    res.status(500).send("Lỗi server khi thêm blog");
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Title, Content } = req.body;

  try {
    await sequelize.query(`
      UPDATE Blog
      SET Title = @Title,
          Content = @Content,
          LastUpdated = GETDATE()
      WHERE IDPost = @id
    `, {
      replacements: { id, Title, Content }
    });

    res.status(200).send("✅ Cập nhật thành công");
  } catch (error) {
    console.error("❌ Lỗi cập nhật blog:", error);
    res.status(500).send("Lỗi server khi cập nhật blog");
  }
});



// ✅ Đăng bài mới
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content)
      return res.status(400).json({ message: 'Thiếu tiêu đề hoặc nội dung' });

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

// ✅ Lấy danh sách bài viết (kèm like/comment/3 bình luận đầu)
router.get('/', async (req, res) => {
  try {
    const posts = await Blog.findAll({
      include: [{ model: User, attributes: ['FullName'] }],
      order: [['LastUpdated', 'DESC']]
    });

    const postsWithDetails = await Promise.all(posts.map(async post => {
      const likeCount = await BlogLike.count({ where: { IDPost: post.IDPost } });
      const commentCount = await BlogComment.count({ where: { IDPost: post.IDPost } });

      const previewComments = await BlogComment.findAll({
        where: { IDPost: post.IDPost },
        include: [{ model: User, attributes: ['FullName'] }],
        order: [['CommentedAt', 'ASC']],
        limit: 3
      });

      return {
        ...post.toJSON(),
        likeCount,
        commentCount,
        previewComments
      };
    }));

    res.json(postsWithDetails);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// ✅ Lấy tất cả bình luận cho 1 bài viết
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


router.post('/:id/comment', authenticate, async (req, res) => {
  try {
    const IDPost = req.params.id;
    const IDUser = req.user.IDUser;
    const { content } = req.body;

    if (!content)
      return res.status(400).json({ message: 'Nội dung bình luận không được để trống' });

    const comment = await BlogComment.create({
      IDPost,
      IDUser,
      Content: content,
    });

    res.json({ message: 'Đã bình luận', comment });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});



module.exports = router;

const express = require("express");
const router = express.Router();
const sequelize = require("../config/database");

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


module.exports = router;
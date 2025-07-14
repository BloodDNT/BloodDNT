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

module.exports = router;

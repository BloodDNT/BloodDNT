const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');

// ✅ GET - Lấy danh sách thông báo của một user
router.get('/:idUser', async (req, res) => {
  let { idUser } = req.params;

  try {
    // Ép kiểu và loại bỏ khoảng trắng (nếu có)
    idUser = parseInt(idUser.trim(), 10);

    if (isNaN(idUser)) {
      return res.status(400).json({ error: 'IDUser không hợp lệ' });
    }

    const [results] = await sequelize.query(`
      SELECT 
        IDNotification,
        Type,
        Message,
        Status,
        FORMAT(SendDate, 'yyyy-MM-dd HH:mm:ss') AS SendDate
      FROM Notification
      WHERE IDUser = :idUser
      ORDER BY SendDate DESC
    `, {
      replacements: { idUser }
    });

    res.json(results);
  } catch (err) {
    console.error('❌ Error fetching notifications:', err);
    res.status(500).json({ error: 'Lỗi máy chủ khi lấy thông báo' });
  }
});

// ✅ PUT - Đánh dấu thông báo là đã đọc
router.put('/read/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const notificationId = parseInt(id.trim(), 10);
    if (isNaN(notificationId)) {
      return res.status(400).json({ error: 'ID thông báo không hợp lệ' });
    }

    await sequelize.query(`
      UPDATE Notification
      SET Status = 'Read'
      WHERE IDNotification = :id
    `, {
      replacements: { id: notificationId }
    });

    res.json({ message: 'Đã đánh dấu là đã đọc' });
  } catch (err) {
    console.error('❌ Error updating notification:', err);
    res.status(500).json({ error: 'Lỗi máy chủ khi cập nhật trạng thái' });
  }
});

module.exports = router;

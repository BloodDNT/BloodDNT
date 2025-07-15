const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');

// Lấy tất cả thông báo của người dùng
router.get('/:idUser', async (req, res) => {
  const { idUser } = req.params;

  try {
    const [results] = await sequelize.query(`
      SELECT * FROM Notifications
      WHERE IDUser = :idUser
      ORDER BY CreatedAt DESC
    `, { replacements: { idUser } });

    res.json(results);
  } catch (err) {
    console.error('❌ Error fetching notifications:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Đánh dấu đã đọc
router.put('/read/:idNotification', async (req, res) => {
  const { idNotification } = req.params;

  try {
    await sequelize.query(`
      UPDATE Notifications
      SET IsRead = 1
      WHERE IDNotification = :idNotification
    `, { replacements: { idNotification } });

    res.json({ message: 'Marked as read' });
  } catch (err) {
    console.error('❌ Error updating notification:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

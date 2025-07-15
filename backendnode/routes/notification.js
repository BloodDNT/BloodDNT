const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');

// GET - lấy danh sách thông báo của 1 user
router.get('/:idUser', async (req, res) => {
  const { idUser } = req.params;
  try {
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
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT - đánh dấu là đã đọc
router.put('/read/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await sequelize.query(`
      UPDATE Notification
      SET Status = 'Read'
      WHERE IDNotification = :id
    `, {
      replacements: { id }
    });

    res.json({ message: 'Đã đánh dấu là đã đọc' });
  } catch (err) {
    console.error('❌ Error updating notification:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

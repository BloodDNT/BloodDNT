const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');


// Lấy tất cả người dùng
router.get('/', async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT IDUser, FullName, Email, Role FROM Users ORDER BY IDUser DESC;
    `);
    res.json(results);
  } catch (err) {
    console.error("❌ Lỗi khi lấy danh sách người dùng:", err);
    res.status(500).json({ error: 'Lỗi server', message: err.message });
  }
});

// Thêm người dùng
router.post('/', async (req, res) => {
  const { FullName, Email, Password, Role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(Password, 10);

    await sequelize.query(`
  INSERT INTO Users (FullName, Email, Password, Role)
  VALUES (:FullName, :Email, :Password, :Role)
`, {
      replacements: { FullName, Email, Password: hashedPassword, Role }
    });
    res.status(201).json({ message: 'Người dùng đã được thêm.' });
  } catch (err) {
    console.error("❌ Lỗi khi thêm người dùng:", err);
    res.status(500).json({ error: 'Lỗi server', message: err.message });
  }
});

// Cập nhật người dùng
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { FullName, Email, Password, Role } = req.body;

  try {
    let query = `
      UPDATE Users SET 
        FullName = :FullName,
        Email = :Email,
    `;
    const replacements = { id, FullName, Email, Role };

    if (Password) {
      const hashedPassword = await bcrypt.hash(Password, 10);
      query += ` Password = :Password,`;
      replacements.Password = hashedPassword;
    }

    query += ` Role = :Role WHERE IDUser = :id`;

    await sequelize.query(query, { replacements });

    res.json({ message: 'Người dùng đã được cập nhật.' });
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật người dùng:", err);
    res.status(500).json({ error: 'Lỗi server', message: err.message });
  }
});

// Xoá người dùng
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await sequelize.query(`
      DELETE FROM Users WHERE IDUser = :id
    `, {
      replacements: { id }
    });
    res.status(204).send();
  } catch (err) {
    console.error("❌ Lỗi khi xoá người dùng:", err);
    res.status(500).json({ error: 'Lỗi server', message: err.message });
  }
});

module.exports = router;

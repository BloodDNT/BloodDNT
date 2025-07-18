const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sendVerificationEmail = require('../utils/sendVerificationEmail');

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
    const verificationToken = crypto.randomBytes(32).toString('hex');

    await sequelize.query(`
      INSERT INTO Users (FullName, Email, Password, Role, IsVerified, VerificationToken)
      VALUES (:FullName, :Email, :Password, :Role, 0, :VerificationToken)
    `, {
      replacements: {
        FullName,
        Email,
        Password: hashedPassword,
        Role,
        VerificationToken: verificationToken
      }
    });

    // Gửi email xác thực
    const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
    const verifyUrl = `${BASE_URL}/api/auth/verify-email?token=${verificationToken}`;

    await sendVerificationEmail(Email, verifyUrl);

    res.status(201).json({ message: 'Người dùng đã được thêm và đã gửi email xác thực.' });
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
        Email = :Email
    `;
    const replacements = { id, FullName, Email, Role };

    if (Password) {
      const hashedPassword = await bcrypt.hash(Password, 10);
      query += ` Password = :Password,`;
      replacements.Password = hashedPassword;
    }

    query += ` Role = :Role WHERE IDUser = :id`;
console.log("Query:", query);
console.log("Replacements:", replacements);
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

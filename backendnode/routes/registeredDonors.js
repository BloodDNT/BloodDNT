const express = require('express');
const router = express.Router();
const sequelize = require('../config/database'); // dùng Sequelize thay cho mssql pool

router.get('/', async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT 
        u.FullName, u.Email, u.PhoneNumber, r.DonateBloodDate, r.Status
      FROM RegisterDonateBlood r
      JOIN Users u ON r.IDUser = u.IDUser
      ORDER BY r.DonateBloodDate DESC;
    `);

    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy dữ liệu người hiến máu.' });
    }

    res.json(results);
  } catch (err) {
    console.error('❌ Lỗi khi truy vấn Registered Donors:', err);
    res.status(500).json({ error: 'Lỗi server', message: err.message });
  }
});

module.exports = router;

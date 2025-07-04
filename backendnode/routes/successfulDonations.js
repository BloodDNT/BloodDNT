const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT 
        u.FullName,
        d.DonateBloodDate,
        d.Volume AS Pack
      FROM DonationHistory d
      JOIN Users u ON d.IDUser = u.IDUser

    `);

    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy lượt hiến máu thành công trong tháng.' });
    }

    res.status(200).json(results);
  } catch (err) {
    console.error('❌ Lỗi khi truy vấn Successful Donations:', err);
    res.status(500).json({ error: 'Lỗi server', message: err.message });
  }
});

module.exports = router;

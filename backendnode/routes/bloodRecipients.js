const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT 
    u.FullName,
    gb.BloodType,
    bc.ComponentName,
    rdb.Quantity,
    rdb.UrgencyLevel,
    rdb.RequestDate,
    rdb.Status
FROM RequestDonateBlood rdb
JOIN Users u ON rdb.IDUser = u.IDUser
JOIN GroupBlood gb ON rdb.IDBlood = gb.IDBlood
JOIN BloodComponents bc ON rdb.IDComponents = bc.IDComponents
ORDER BY rdb.RequestDate DESC;


    `);

    res.json(results);
  } catch (err) {
    console.error('❌ Lỗi khi lấy danh sách người nhận máu:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

module.exports = router;

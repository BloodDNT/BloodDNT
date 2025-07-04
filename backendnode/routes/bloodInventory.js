const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT 
        gb.BloodType AS BloodType,
        SUM(CASE WHEN bc.ComponentName = N'Toàn phần' THEN bi.Quantity ELSE 0 END) AS whole,
        SUM(CASE WHEN bc.ComponentName = N'Hồng cầu' THEN bi.Quantity ELSE 0 END) AS redCells,
        SUM(CASE WHEN bc.ComponentName = N'Huyết tương' THEN bi.Quantity ELSE 0 END) AS plasma,
        SUM(CASE WHEN bc.ComponentName = N'Tiểu cầu' THEN bi.Quantity ELSE 0 END) AS platelets,
        SUM(bi.Quantity) AS total
      FROM BloodInventory bi
      JOIN GroupBlood gb ON bi.IDBlood = gb.IDBlood
      JOIN BloodComponents bc ON bi.IDComponents = bc.IDComponents
      GROUP BY gb.BloodType
      ORDER BY gb.BloodType
    `);

    res.json(results);
  } catch (err) {
    console.error('❌ Sequelize query error:', err);
    res.status(500).send('Lỗi server: ' + err.message);
  }
});

module.exports = router;

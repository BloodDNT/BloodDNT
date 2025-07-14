const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

router.get('/', async (req, res) => {
  try {
    const [results] = await sequelize.query(`
      SELECT 
        U.FullName AS Donor,
        CONVERT(VARCHAR, RDB.DonateBloodDate, 23) AS [Date],
        FORMAT(RDB.DonateBloodDate, 'hh:mm tt') AS [Time]
      FROM 
        RegisterDonateBlood RDB
      JOIN 
        Users U ON RDB.IDUser = U.IDUser

    `);

    res.json(results);
  } catch (err) {
    console.error("❌ Lỗi khi truy vấn upcoming appointments:", err);
    res.status(500).send("Lỗi server: " + err.message);
  }
});

module.exports = router;

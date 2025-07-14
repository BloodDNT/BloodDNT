const express = require('express');
const router = express.Router();
const sql = require('mssql');
const dbConfig = require('../config/database');

router.get('/donation-history/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  console.log("🧪 Nhận yêu cầu ID:", userId);

  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('IDUser', sql.Int, userId)
      .query(`
        SELECT 
          r.IDRegister,
          r.DonateBloodDate,
          g.BloodType AS BloodTypeName,
          r.IdentificationNumber,
          CAST(r.Note AS NVARCHAR(255)) AS Note,
          r.Status
        FROM RegisterDonateBlood r
        JOIN GroupBlood g ON r.IDBlood = g.IDBlood
        WHERE r.IDUser = @IDUser
        ORDER BY r.DonateBloodDate DESC;
      `);

    // ✅ Lọc ra object đơn giản, tránh vòng lặp circular
    const cleaned = result.recordset.map(row => ({
      IDRegister: row.IDRegister,
      DonateBloodDate: row.DonateBloodDate,
      BloodTypeName: row.BloodTypeName,
      IdentificationNumber: row.IdentificationNumber,
      Note: row.Note,
      Status: row.Status
    }));

    res.json(cleaned);
  } catch (err) {
    console.error('❌ Lỗi lấy lịch sử hiến máu:', err.message);
    console.error('📦 Stack trace:', err.stack);
    res.status(500).json({
      error: 'Lỗi máy chủ',
      message: err.message,
      stack: err.stack
    });
  }
});

// ✅ Đảm bảo export router đúng cách
module.exports = router;

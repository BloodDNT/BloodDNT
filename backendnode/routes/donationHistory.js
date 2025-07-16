const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');
const { Sequelize } = require('sequelize'); // ✅ Thêm dòng này

// Lấy lịch sử hiến máu của 1 người dùng
router.get('/:id', async (req, res) => {
  const idUser = req.params.id;

  try {
    const histories = await sequelize.query(`
        SELECT 
          h.[IDHistory],
          h.[DonateBloodDate],
          h.[IDRequest],
          h.[IDBlood],
          h.[Description],
          h.[NextDonateDate],
          h.[Volume],
          r.[IdentificationNumber],
          r.[Status],
          g.[BloodType] AS BloodTypeName
        FROM [dbo].[DonationHistory] h
        JOIN [dbo].[RequestDonateBlood] r ON r.IDRequest = h.IDRequest
        JOIN [dbo].[GroupBlood] g ON g.IDBlood = h.IDBlood
        WHERE h.IDUser = :idUser
        ORDER BY h.DonateBloodDate DESC
      `, {
        replacements: { idUser },
        type: sequelize.QueryTypes.SELECT
      });
      

    res.json(histories);
  } catch (error) {
    console.error('❌ Lỗi khi truy vấn lịch sử hiến máu:', error);
    res.status(500).json({ error: 'Lỗi server khi lấy lịch sử hiến máu' });
  }
});

module.exports = router;

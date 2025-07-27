const express = require('express');
const router = express.Router();

const RegisterDonateBlood = require('../models/RegisterDonateBlood');
const RequestDonateBlood = require('../models/RequestDonateBlood');
const DonationHistory = require('../models/DonationHistory');

// API lấy tất cả đơn của 1 người dùng
router.get('/:id', async (req, res) => {
  const IDUser = Number(req.params.id);
  try {
    const donations = await RegisterDonateBlood.findAll({ where: { IDUser } });
    const requests = await RequestDonateBlood.findAll({ where: { IDUser } });
    const history = await DonationHistory.findAll({ where: { IDUser } });

    res.json({
      donations,
      requests,
      history
    });
  } catch (err) {
    console.error('❌ Lỗi khi lấy đơn của người dùng:', err);
    res.status(500).json({ error: 'Lỗi server', details: err.message });
  }
});

// Xuất module router để dùng ở server.js
module.exports = router;

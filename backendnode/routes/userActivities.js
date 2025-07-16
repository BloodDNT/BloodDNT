const express = require('express');
const router = express.Router();
const RegisterDonateBlood = require('../models/BloodDonation');
const RequestDonateBlood = require('../models/RequestDonateBlood');

// Lấy đơn hiến máu và đơn yêu cầu của một user
router.get('/:id', async (req, res) => {
  const IDUser = Number(req.params.id);
  try {
    const donations = await RegisterDonateBlood.findAll({ where: { IDUser } });
    const requests = await RequestDonateBlood.findAll({ where: { IDUser } });

    res.json({
      donations,
      requests
    });
  } catch (err) {
    console.error('❌ Lỗi khi lấy đơn của người dùng:', err);
    res.status(500).json({ error: 'Lỗi server', details: err.message });
  }
});

module.exports = router;

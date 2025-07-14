// routes/history.js
const express = require('express');
const router = express.Router();
const RegisterDonateBlood = require('../models/BloodDonation');
const BloodRequest = require('../models/RequestDonateBlood'); // giả sử bạn có model này
const GroupBlood = require('../models/GroupBlood');

// Lấy cả 2 danh sách
router.get('/combined-history/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const donateList = await RegisterDonateBlood.findAll({
      where: { IDUser: userId },
      include: [{ model: GroupBlood, attributes: ['BloodTypeName'] }]
    });

    const requestList = await BloodRequest.findAll({
      where: { IDUser: userId },
      include: [{ model: GroupBlood, attributes: ['BloodTypeName'] }]
    });

    res.json({ donateList, requestList });
  } catch (err) {
    console.error('Lỗi khi lấy danh sách:', err);
    res.status(500).json({ error: 'Không thể lấy lịch sử' });
  }
});

module.exports = router;

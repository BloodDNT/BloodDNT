// routes/publicBloodRequestRoutes.js
const express = require('express');
const router = express.Router();
const RequestDonateBlood = require('../models/RequestDonateBlood');
const User = require('../models/User');

// ✅ Lấy chi tiết đơn yêu cầu máu (không cần đăng nhập)
router.get('/detail/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const request = await RequestDonateBlood.findOne({
      where: { IDRequest: id },
      include: [{ model: User }]
    });

    if (!request) {
      return res.status(404).json({ error: 'Không tìm thấy đơn yêu cầu máu' });
    }

    res.json({ data: request });

  } catch (err) {
    console.error('❌ Lỗi khi lấy chi tiết đơn:', err);
    res.status(500).json({ error: 'Lỗi server', details: err.message });
  }
});

module.exports = router;

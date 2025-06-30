const express = require('express');
const router = express.Router();
const EmergencyRequest = require('../models/EmergencyRequest');

// POST /api/emergency
router.post('/', async (req, res) => {
  try {
    const request = await EmergencyRequest.create(req.body);
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi tạo yêu cầu khẩn cấp', details: error.message });
  }
});

// GET /api/emergency
router.get('/', async (req, res) => {
  try {
    const list = await EmergencyRequest.findAll({ order: [['createdAt', 'DESC']] });
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách yêu cầu', details: error.message });
  }
});

module.exports = router;

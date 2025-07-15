// routes/requestDonateBlood.js
const express = require('express');
const QRCode = require('qrcode');
const router = express.Router();

const RequestDonateBlood = require('../models/RequestDonateBlood');
const User = require('../models/User');

// 🩸 Tạo đơn và QR
router.post('/', async (req, res) => {
  try {
    const {
      IDUser,
      IDComponents,
      IDBlood,
      Quantity,
      UrgencyLevel,
      IdentificationNumber,
      RequestDate
    } = req.body;

    if (!IDUser || !IDComponents || !IDBlood || !Quantity || !UrgencyLevel || !IdentificationNumber || !RequestDate) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin.' });
    }

    const newRequest = await RequestDonateBlood.create({
      IDUser,
      IDComponents,
      IDBlood,
      Quantity,
      UrgencyLevel,
      Status: 'Pending',
      IdentificationNumber,
      RequestDate,
      QRCodeValue: ''
    });

    const host = 'http://localhost:5173'; // thay bằng domain thật nếu có
    const qrText = `${host}/request/${newRequest.IDRequest}`;
    const qrImage = await QRCode.toDataURL(qrText);

    await newRequest.update({ QRCodeValue: qrImage });

    res.status(201).json({
      message: 'Tạo yêu cầu thành công ✅',
      data: {
        QRCode: qrImage,
        request: newRequest
      }
    });

  } catch (err) {
    console.error('❌ Lỗi khi tạo yêu cầu máu:', err);
    res.status(500).json({ error: 'Lỗi server', details: err.message });
  }
});

// 🧾 Lấy chi tiết đơn kèm thông tin người nhận
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

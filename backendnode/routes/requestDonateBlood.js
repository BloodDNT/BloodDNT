const express = require('express');
const QRCode = require('qrcode');
const router = express.Router();

const RequestDonateBlood = require('../models/RequestDonateBlood');

// POST: Gửi yêu cầu nhận máu
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

    // 🔒 Kiểm tra dữ liệu cơ bản
    if (!IDUser || !IDComponents || !IDBlood || !Quantity || !UrgencyLevel || !IdentificationNumber || !RequestDate) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin.' });
    }

    // 🔧 Tạo chuỗi QR chứa thông tin đơn
    const qrText = `User: ${IDUser} | Component: ${IDComponents} | Blood: ${IDBlood} | Quantity: ${Quantity} | Urgency: ${UrgencyLevel} | Date: ${RequestDate}`;
    
    // 🧠 Tạo mã QR
    const qrImage = await QRCode.toDataURL(qrText);

    // 💾 Thêm bản ghi vào DB
    const newRequest = await RequestDonateBlood.create({
      IDUser,
      IDComponents,
      IDBlood,
      Quantity,
      UrgencyLevel,
      Status: 'Pending',
      IdentificationNumber,
      RequestDate,
      QRCode: qrImage
    });

    // ✅ Trả kết quả
    res.status(201).json({ message: 'Tạo yêu cầu thành công ✅', data: newRequest });

  } catch (err) {
    console.error('❌ Lỗi khi tạo yêu cầu máu:', err);
    res.status(500).json({ error: 'Lỗi server', details: err.message });
  }
});

module.exports = router;

const express = require('express');
const QRCode = require('qrcode');
const router = express.Router();

const RequestDonateBlood = require('../models/RequestDonateBlood');
const User = require('../models/User');
const authenticateToken = require('../middlewares/authenticateToken'); // ⬅️ Thêm dòng này

// ✅ Tạo đơn yêu cầu máu + QR code
router.post('/', authenticateToken, async (req, res) => {
  try {
    const IDUser = req.user?.IDUser; // ⬅️ Lấy từ JWT

    if (!IDUser) {
      return res.status(401).json({ error: 'Không thể xác định người dùng.' });
    }

    const {
      IDComponents,
      IDBlood,
      Quantity,
      UrgencyLevel,
      IdentificationNumber,
      RequestDate
    } = req.body;

    if (!IDComponents || !IDBlood || !Quantity || !UrgencyLevel || !IdentificationNumber || !RequestDate) {
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

    const host = 'http://localhost:5173';
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

// ✅ Lấy chi tiết đơn yêu cầu máu (không cần login)
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

// ✅ Cập nhật đơn (chỉ người tạo được sửa)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const IDUser = req.user?.IDUser;
    const IDRequest = req.params.id;

    const request = await RequestDonateBlood.findOne({ where: { IDRequest, IDUser } });

    if (!request) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hoặc bạn không có quyền sửa.' });
    }

    const {
      IDComponents,
      IDBlood,
      Quantity,
      UrgencyLevel,
      Status,
      IdentificationNumber
    } = req.body;

    await request.update({
      IDComponents,
IDBlood,
      Quantity,
      UrgencyLevel,
      Status,
      IdentificationNumber
    });

    res.json({ message: '✅ Cập nhật thành công', request });

  } catch (err) {
    console.error('❌ Lỗi cập nhật đơn:', err);
    res.status(500).json({ error: 'Lỗi server', details: err.message });
  }
});

// ✅ Xoá đơn (chỉ người tạo được xoá)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const IDUser = req.user?.IDUser;
    const IDRequest = req.params.id;

    const request = await RequestDonateBlood.findOne({ where: { IDRequest, IDUser } });

    if (!request) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hoặc bạn không có quyền xoá.' });
    }

    await request.destroy();

    res.json({ message: '🗑️ Đã xoá đơn thành công' });

  } catch (err) {
    console.error('❌ Lỗi xoá đơn:', err);
    res.status(500).json({ error: 'Lỗi server', details: err.message });
  }
});
router.put('/cancel/:id', authenticateToken, async (req, res) => {
  try {
    const IDUser = req.user?.IDUser;
    const IDRequest = req.params.id;

    const request = await RequestDonateBlood.findOne({ where: { IDRequest, IDUser } });

    if (!request) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hoặc bạn không có quyền huỷ.' });
    }

    await request.update({ Status: 'Cancelled' });

    res.json({ message: '✅ Đã huỷ đơn yêu cầu thành công!' });

  } catch (err) {
    console.error('❌ Lỗi huỷ đơn yêu cầu:', err);
    res.status(500).json({ error: 'Lỗi server', details: err.message });
  }
});

module.exports = router;
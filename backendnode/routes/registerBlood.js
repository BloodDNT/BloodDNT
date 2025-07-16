const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const RegisterDonateBlood = require('../models/BloodDonation');
const User = require('../models/User');

// ✅ API tạo đơn hiến máu và sinh mã QR
router.post('/register-blood', async (req, res) => {
  try {
    const {
      IDUser,
      DonateBloodDate,
      IDBlood,
      IdentificationNumber,
      Note
    } = req.body;

    if (!IDUser || !DonateBloodDate || !IDBlood || !IdentificationNumber) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin.' });
    }

    const newRecord = await RegisterDonateBlood.create({
      IDUser,
      DonateBloodDate,
      IDBlood,
      IdentificationNumber,
      Note,
      Status: 'Pending',
      QRCode: '',
      IsCancelled: false
    });

    const host = 'http://localhost:5173';
    const qrText = `${host}/donation/${newRecord.IDRegister}`;
    const qrCode = await QRCode.toDataURL(qrText);

    await newRecord.update({ QRCode: qrCode });

    res.status(201).json({
      message: 'Đăng ký hiến máu thành công ✅',
      data: {
        QRCode: qrCode,
        donation: newRecord
      }
    });

  } catch (err) {
    console.error("❌ Lỗi tại API /register-blood:", err);
    res.status(500).json({ error: 'Đăng ký thất bại', details: err.message });
  }
});

// ✅ API xem chi tiết đơn hiến máu
router.get('/detail/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const record = await RegisterDonateBlood.findOne({
      where: { IDRegister: id },
      include: [{ model: User }]
    });

    if (!record) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hiến máu' });
    }

    res.json({ data: record });

  } catch (err) {
    console.error("❌ Lỗi khi lấy chi tiết đơn hiến máu:", err);
    res.status(500).json({ error: 'Lỗi server', details: err.message });
  }
});

// ✅ API cập nhật đơn
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await RegisterDonateBlood.update(req.body, { where: { IDRegister: id } });
    res.json({ message: 'Cập nhật thành công' });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi cập nhật', details: err.message });
  }
});

// ✅ API huỷ đơn hiến máu
router.put('/cancel/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const record = await RegisterDonateBlood.findByPk(id);
    if (!record) {
      return res.status(404).json({ error: 'Không tìm thấy đơn để huỷ' });
    }

    await record.update({ IsCancelled: true, Status: 'Canceled' });

    res.json({ message: 'Đơn hiến máu đã được huỷ thành công ❌' });
  } catch (err) {
    console.error('❌ Lỗi huỷ đơn:', err);
    res.status(500).json({ error: 'Lỗi server', details: err.message });
  }
});

module.exports = router;

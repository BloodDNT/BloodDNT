const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');

const RegisterDonateBlood = require('../models/BloodDonation');
const InitialHealthDeclaration = require('../models/InitialHealthDeclaration');
const Notification = require('../models/Notification');
const User = require('../models/User');

// ✅ API tạo đơn hiến máu + khai báo sức khỏe
router.post('/register-blood', async (req, res) => {
  const t = await RegisterDonateBlood.sequelize.transaction(); // dùng transaction

  try {
    const {
      IDUser,
      DonateBloodDate,
      IDBlood,
      IdentificationNumber,
      Note,
      BloodPressure,
      Weight,
      MedicalHistory,
      Eligible
    } = req.body;

    // Validate dữ liệu đầu vào
    if (!IDUser || !DonateBloodDate || !IDBlood || !IdentificationNumber) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin bắt buộc.' });
    }

    // 1. Tạo đơn hiến máu
    const newRecord = await RegisterDonateBlood.create({
      IDUser,
      DonateBloodDate,
      IDBlood,
      IdentificationNumber,
      Note,
      Status: 'Pending',
      QRCode: '',
      IsCancelled: false
    }, { transaction: t });

    // 2. Tạo mã QR
    const host = 'http://localhost:5173';
    const qrText = `${host}/donation/${newRecord.IDRegister}`;
    const qrCode = await QRCode.toDataURL(qrText);

    await newRecord.update({ QRCode: qrCode }, { transaction: t });

    // 3. Tạo bản ghi khai báo sức khỏe
    await InitialHealthDeclaration.create({
      IDRequest: newRecord.IDRegister,
      BloodPressure,
      Weight,
      MedicalHistory,
      Eligible: Eligible !== undefined ? Eligible : true
    }, { transaction: t });

    // 4. Gửi thông báo
    const formattedDate = new Date(DonateBloodDate).toLocaleDateString('vi-VN');
    await Notification.create({
      IDUser,
  Type: 'Thông báo hệ thống',
  Message: `Bạn đã đăng ký hiến máu vào ngày ${DonateBloodDate}`,
  Status: 'Unread',
  SendDate: new Date()
    }, { transaction: t });

    await t.commit();

    res.status(201).json({
      message: 'Đăng ký hiến máu và khai báo sức khỏe thành công ✅',
      data: {
        QRCode: qrCode,
        donation: newRecord
      }
    });

  } catch (err) {
    await t.rollback();
    console.error("❌ Lỗi khi tạo đơn:", err);
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

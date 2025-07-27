const express = require('express');
const router = express.Router();

const RegisterDonateBlood = require('../models/BloodDonation');
const InitialHealthDeclaration = require('../models/InitialHealthDeclaration');
const Notification = require('../models/Notification'); // thêm dòng này
const User = require('../models/User');

// ✅ API tạo đơn hiến máu + khai báo sức khỏe
router.post('/register-blood', async (req, res) => {
  const t = await RegisterDonateBlood.sequelize.transaction();

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
      Status: 'Pending'
    }, { transaction: t });

    // 2. Tạo bản ghi khai báo sức khỏe
    await InitialHealthDeclaration.create({
      IDRequest: newRecord.IDRegister,
      BloodPressure,
      Weight,
      MedicalHistory,
      Eligible: Eligible !== undefined ? Eligible : true
    }, { transaction: t });

    // 3. Tạo thông báo
    await Notification.create({
      IDUser,
      Title: 'Đăng ký hiến máu thành công',
      Message: `Bạn đã đăng ký hiến máu vào ngày ${new Date(DonateBloodDate).toLocaleDateString()} thành công. Mã đơn: ${newRecord.IDRegister}.`,
      IsRead: false,
      CreatedAt: new Date()
    }, { transaction: t });

    await t.commit();

    res.status(201).json({
      message: 'Đăng ký hiến máu và khai báo sức khỏe thành công ✅',
      data: newRecord
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

// ✅ API huỷ đơn
router.put('/cancel/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const record = await RegisterDonateBlood.findByPk(id);
    if (!record) {
      return res.status(404).json({ error: 'Không tìm thấy đơn để huỷ' });
    }

    await record.update({ Status: 'Cancelled' });

    // Thêm thông báo huỷ đơn
    await Notification.create({
      IDUser: record.IDUser,
      Title: 'Huỷ đơn hiến máu',
      Message: `Đơn hiến máu #${record.IDRegister} đã được huỷ.`,
      IsRead: false,
      CreatedAt: new Date()
    });

    res.json({ message: 'Đơn hiến máu đã được huỷ thành công ❌' });
  } catch (err) {
    console.error('❌ Lỗi huỷ đơn:', err);
    res.status(500).json({ error: 'Lỗi server', details: err.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { RegisterDonateBlood } = require('../models'); // Sequelize model
const { v4: uuidv4 } = require('uuid');

// API tạo bản ghi đăng ký hiến máu
router.post('/register-blood', async (req, res) => {
  try {
    const {
      IDUser,
      DonateBloodDate,
      IDBlood,
      IdentificationNumber,
      Note
    } = req.body;

    const IDRegister = uuidv4(); // tạo UUID
    const Status = 'Pending';
    const QRCode = ''; // generate sau

    await RegisterDonateBlood.create({
      IDRegister,
      IDUser,
      DonateBloodDate,
      IDBlood,
      IdentificationNumber,
      Note,
      Status,
      QRCode,
      DateTime: new Date() // thêm thời gian hệ thống
    });

    res.status(200).json({ message: 'Đăng ký hiến máu thành công' });
  } catch (err) {
    console.error('Lỗi khi insert:', err);
    res.status(500).json({ error: 'Đăng ký thất bại' });
  }
});

module.exports = router;

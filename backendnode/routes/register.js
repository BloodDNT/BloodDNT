const express = require('express');
const router = express.Router();
const QRCode = require('qrcode'); // ✅ Thêm dòng này

const RegisterDonateBlood = require('../models/BloodDonation'); 

router.post('/register-blood', async (req, res) => {
  try {
    const {
      IDUser,
      DonateBloodDate,
      IDBlood,
      IdentificationNumber,
      Note
    } = req.body;

    // Tạo nội dung mã QR từ dữ liệu người dùng
    const qrData = `UserID: ${IDUser}, Date: ${DonateBloodDate}, BloodID: ${IDBlood}`;
    const qrCode = await QRCode.toDataURL(qrData); // ✅ Sinh mã QR dạng base64

    // Lưu vào DB
    const newRecord = await RegisterDonateBlood.create({
      IDUser: parseInt(IDUser),
      DonateBloodDate,
      IDBlood: parseInt(IDBlood),
      IdentificationNumber,
      Note,
      Status: 'Pending',
      QRCode: qrCode // ✅ Gán mã QR vào cột QRCode
    });

    res.status(201).json({ message: 'Đăng ký thành công', data: newRecord });
  } catch (err) {
    console.error("❌ Lỗi tại API /register-blood:", err);
    res.status(500).json({ error: 'Đăng ký thất bại' });
  }
});

module.exports = router;

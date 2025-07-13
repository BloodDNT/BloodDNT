// routes/register.js
const express = require('express');
const router = express.Router();

const RegisterDonateBlood = require('../models/BloodDonation'); // 🧠 Đảm bảo đã import đúng model

router.post('/register-blood', async (req, res) => {
  try {
    const {
      IDUser,
      DonateBloodDate,
      IDBlood,
      IdentificationNumber,
      Note
    } = req.body;

    const newRecord = await RegisterDonateBlood.create({
      // ❌ Không cần IDRegister nếu là identity (auto increment)
      IDUser: parseInt(IDUser), // Đảm bảo là kiểu số
      DonateBloodDate,
      IDBlood: parseInt(IDBlood),
      IdentificationNumber,
      Note,
      Status: 'Pendings',
      QRCode: null
    });

    res.status(201).json({ message: 'Đăng ký thành công', data: newRecord });
  } catch (err) {
    console.error("❌ Lỗi tại API /register-blood:", err);
    res.status(500).json({ error: 'Đăng ký thất bại' });
  }
});

module.exports = router; // ✅ Thêm dòng này để export router

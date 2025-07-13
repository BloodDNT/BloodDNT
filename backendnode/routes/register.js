
const express = require('express');
const router = express.Router();

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

    const newRecord = await RegisterDonateBlood.create({
      
      IDUser: parseInt(IDUser), // Đảm bảo là kiểu số
      DonateBloodDate,
      IDBlood: parseInt(IDBlood),
      IdentificationNumber,
      Note,
      Status: 'Pending',
      QRCode: null
    });

    res.status(201).json({ message: 'Đăng ký thành công', data: newRecord });
  } catch (err) {
    console.error("❌ Lỗi tại API /register-blood:", err);
    res.status(500).json({ error: 'Đăng ký thất bại' });
  }
});

module.exports = router; // ✅ Thêm dòng này để export router

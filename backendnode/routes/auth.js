// routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticate = require('../middlewares/authenticateToken');

// === VALIDATORS === //
const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhoneNumber = phone => !phone || /^[0-9]{10,11}$/.test(phone);
const isValidCCCD = cccd => !cccd || /^[0-9]{12}$/.test(cccd);
const isOver18 = dob => {
  if (!dob) return true;
  const date = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - date.getFullYear();
  const m = now.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < date.getDate())) age--;
  return age >= 18;
};

// === REGISTER === //
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, address, dateOfBirth, gender, cccd } = req.body;

    if (!fullName || !email || !password)
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ Họ tên, Email, Mật khẩu' });

    if (!isValidEmail(email))
      return res.status(400).json({ message: 'Email không đúng định dạng' });

    if (!isValidPhoneNumber(phoneNumber))
      return res.status(400).json({ message: 'Số điện thoại phải chứa 10-11 số' });

    if (!isOver18(dateOfBirth))
      return res.status(400).json({ message: 'Người dùng phải trên 18 tuổi' });

    if (gender && !['Male', 'Female', 'Other'].includes(gender))
      return res.status(400).json({ message: 'Giới tính phải là Male, Female hoặc Other' });

    const existingUser = await User.findOne({ where: { Email: email } });
    if (existingUser)
      return res.status(400).json({ message: 'Email đã được sử dụng' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      FullName: fullName,
      Email: email,
      Password: hashedPassword,
      PhoneNumber: phoneNumber,
      Address: address,
      DateOfBirth: dateOfBirth,
      Gender: gender,
      CCCD: cccd,
      Role: 'User'
    });

    // ✅ FIX: dùng newUser
    const token = jwt.sign({ IDUser: newUser.IDUser }, process.env.JWT_SECRET || 'your_jwt_secret_key', { expiresIn: '1h' });

    res.status(201).json({
      message: 'Đăng ký thành công',
      token,
      user: {
        IDUser: newUser.IDUser,
        fullName: newUser.FullName,
        email: newUser.Email,
        phoneNumber: newUser.PhoneNumber,
        address: newUser.Address,
        dateOfBirth: newUser.DateOfBirth,
        gender: newUser.Gender
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// === LOGIN === //
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ email và mật khẩu' });

  try {
    const user = await User.findOne({ where: { Email: email } });
    if (!user)
      return res.status(400).json({ message: 'Email không tồn tại' });

    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch)
      return res.status(400).json({ message: 'Mật khẩu không đúng' });

    const token = jwt.sign({ IDUser: user.IDUser }, process.env.JWT_SECRET || 'your_jwt_secret_key', { expiresIn: '12h' });

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        IDUser: user.IDUser,
        fullName: user.FullName,
        email: user.Email,
        phoneNumber: user.PhoneNumber,
        address: user.Address,
        dateOfBirth: user.DateOfBirth,
        gender: user.Gender
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// === UPDATE === //
router.put('/update', authenticate, async (req, res) => {
  try {
    const userId = req.user.IDUser;
    const { fullName, phoneNumber, address, dateOfBirth, gender } = req.body;

    if (!fullName)
      return res.status(400).json({ message: 'Họ tên không được để trống' });

    if (!isValidPhoneNumber(phoneNumber))
      return res.status(400).json({ message: 'Số điện thoại phải chứa 10-11 số' });

    if (!isOver18(dateOfBirth))
      return res.status(400).json({ message: 'Người dùng phải trên 18 tuổi' });

    if (gender && !['Male', 'Female', 'Other'].includes(gender))
      return res.status(400).json({ message: 'Giới tính không hợp lệ' });

    await User.update(
      {
        FullName: fullName,
        PhoneNumber: phoneNumber,
        Address: address,
        DateOfBirth: dateOfBirth,
        Gender: gender,
      },
      { where: { IDUser: userId } }
    );

    const updatedUser = await User.findByPk(userId);
    res.json({
      message: 'Cập nhật thành công',
      user: {
        FullName: updatedUser.FullName,
        Email: updatedUser.Email,
        PhoneNumber: updatedUser.PhoneNumber,
        Address: updatedUser.Address,
        DateOfBirth: updatedUser.DateOfBirth,
        Gender: updatedUser.Gender,
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

module.exports = router;

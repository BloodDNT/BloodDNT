const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/User');
const authenticate = require('../middlewares/authenticateToken');
const sendVerificationEmail = require('../utils/sendVerificationEmail');

// === VALIDATORS === //
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhoneNumber = (phone) => !phone || /^[0-9]{10,11}$/.test(phone);
const isValidCCCD = (cccd) => !cccd || /^[0-9]{12}$/.test(cccd);
const isOver18 = (dob) => {
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
    const {
      fullName,
      email,
      password,
      phoneNumber,
      address,
      dateOfBirth,
      gender,
      cccd,
    } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ các trường bắt buộc (Họ tên, Email, Mật khẩu)' });
    }

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
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = await User.create({
      FullName: fullName,
      Email: email,
      Password: hashedPassword,
      PhoneNumber: phoneNumber,
      Address: address,
      DateOfBirth: dateOfBirth,
      Gender: gender,
      CCCD: cccd,
      Role: 'User',
      IsVerified: false,
      VerificationToken: verificationToken,
    });

    const verifyUrl = `http://localhost:5000/api/auth/verify-email?token=${verificationToken}`;
    try {
      await sendVerificationEmail(email, verifyUrl);
    } catch (err) {
      console.error('Lỗi gửi email xác minh:', err);
    }

    const token = jwt.sign(
      { IDUser: newUser.IDUser},
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác minh tài khoản!',
      token,
      user: {
        IDUser: newUser.IDUser,
        fullName: newUser.FullName,
        email: newUser.Email,
        phoneNumber: newUser.PhoneNumber,
        address: newUser.Address,
        dateOfBirth: newUser.DateOfBirth,
        gender: newUser.Gender,
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

    if (!user.IsVerified) {
      return res.status(403).json({ message: 'Tài khoản chưa xác minh email. Vui lòng kiểm tra email để xác minh.' });
    }

    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch)
      return res.status(400).json({ message: 'Mật khẩu không đúng' });

    // ✅ FIXED: dùng đúng user.Role
    const token = jwt.sign(
      { IDUser: user.IDUser, Role: user.Role },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '12h' }
    );

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
        gender: user.Gender,
        role: user.Role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});


// === VERIFY EMAIL === //
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  if (!token) return res.status(400).send('Thiếu mã xác minh');

  try {
    const user = await User.findOne({ where: { VerificationToken: token } });

    if (!user) {
      return res.status(400).send('Mã xác minh không hợp lệ hoặc đã hết hạn');
    }

    user.IsVerified = true;
    user.VerificationToken = null;
    await user.save();

    return res.send(`
      <h2>✅ Tài khoản của bạn đã được xác minh thành công!</h2>
      <p>Bạn có thể <a href="http://localhost:3000/login">đăng nhập</a> ngay bây giờ.</p>
    `);
  } catch (error) {
    console.error('Lỗi xác minh:', error);
    res.status(500).send('Đã có lỗi xảy ra khi xác minh');
  }
});

module.exports = router;

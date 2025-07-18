const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
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

// Middleware xác thực
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Chưa đăng nhập' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    req.user = { IDUser: decoded.IDUser }; // Sửa userId thành IDUser để nhất quán
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

// Hàm lấy tọa độ từ địa chỉ
const getLatLngFromAddress = async (address) => {
  if (!address) return null;
  const apiKey = process.env.GEOCODE_API_KEY;
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return {
        lat: data.results[0].geometry.lat,
        lng: data.results[0].geometry.lng,
      };
    }
    return null;
  } catch (error) {
    console.error('Lỗi khi lấy tọa độ từ địa chỉ:', error);
    return null;
  }
};

// Đăng ký
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, address, dateOfBirth, gender, cccd } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ các trường bắt buộc (Họ tên, Email, Mật khẩu)' });
    }

    // Kiểm tra định dạng email
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Email không đúng định dạng' });
    }

    // Kiểm tra định dạng số điện thoại
    if (!isValidPhoneNumber(phoneNumber)) {
      return res.status(400).json({ message: 'Số điện thoại phải chứa 10-11 số' });
    }

    // Kiểm tra định dạng CCCD
    if (!isValidCCCD(cccd)) {
      return res.status(400).json({ message: 'CCCD phải chứa 12 số' });
    }

    // Kiểm tra độ tuổi
    if (!isOver18(dateOfBirth)) {
      return res.status(400).json({ message: 'Người dùng phải trên 18 tuổi' });
    }

    // Kiểm tra giới tính
    if (gender && !['Male', 'Female', 'Other'].includes(gender)) {
      return res.status(400).json({ message: 'Giới tính phải là Male, Female hoặc Other' });
    }

    // Kiểm tra email và CCCD đã tồn tại
    const existingUser = await User.findOne({ where: { Email: email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    if (cccd) {
      const existingCCCD = await User.findOne({ where: { CCCD: cccd } });
      if (existingCCCD) {
        return res.status(400).json({ message: 'CCCD đã được sử dụng' });
      }
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const location = await getLatLngFromAddress(address);

    // Tạo người dùng mới
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
      Latitude: location?.lat || null,
      Longitude: location?.lng || null,
    });

    // Gửi email xác minh
    const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
    const verifyUrl = `${BASE_URL}/api/auth/verify-email?token=${verificationToken}`;
    try {
      await sendVerificationEmail(email, verifyUrl);
    } catch (err) {
      console.error('Lỗi gửi email xác minh:', err);
      return res.status(500).json({ message: 'Lỗi khi gửi email xác minh, nhưng tài khoản đã được tạo' });
    }

    // Tạo JWT
    const token = jwt.sign(
      { IDUser: newUser.IDUser, Role: newUser.Role },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác minh tài khoản!',
      token,
      user: {
        IDUser: newUser.IDUser,
        FullName: newUser.FullName,
        Email: newUser.Email,
        PhoneNumber: newUser.PhoneNumber,
        Address: newUser.Address,
        DateOfBirth: newUser.DateOfBirth,
        Gender: newUser.Gender,
        Role: newUser.Role,
      },
    });
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Đăng nhập
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ email và mật khẩu' });
    }

    // Tìm người dùng
    const user = await User.findOne({ where: { Email: email } });
    if (!user) {
      return res.status(400).json({ message: 'Email không tồn tại' });
    }

    // Kiểm tra xác minh email
    if (!user.IsVerified) {
      return res.status(403).json({ message: 'Tài khoản chưa xác minh email. Vui lòng kiểm tra email để xác minh.' });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu không đúng' });
    }

    // Tạo JWT
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
        FullName: user.FullName,
        Email: user.Email,
        PhoneNumber: user.PhoneNumber,
        Address: user.Address,
        DateOfBirth: user.DateOfBirth,
        Gender: user.Gender,
        Role: user.Role,
      },
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Cập nhật thông tin người dùng
router.put('/update', authenticate, async (req, res) => {
  try {
    const userId = req.user.IDUser;
    const { fullName, phoneNumber, address, dateOfBirth, gender, cccd } = req.body;

    // Kiểm tra người dùng tồn tại
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    // Kiểm tra các trường hợp cần validate
    if (!fullName) {
      return res.status(400).json({ message: 'Họ tên không được để trống' });
    }
    if (!isValidPhoneNumber(phoneNumber)) {
      return res.status(400).json({ message: 'Số điện thoại phải chứa 10-11 số' });
    }
    if (!isValidCCCD(cccd)) {
      return res.status(400).json({ message: 'CCCD phải chứa 12 số' });
    }
    if (!isOver18(dateOfBirth)) {
      return res.status(400).json({ message: 'Người dùng phải trên 18 tuổi' });
    }
    if (gender && !['Male', 'Female', 'Other'].includes(gender)) {
      return res.status(400).json({ message: 'Giới tính phải là Male, Female hoặc Other' });
    }
    if (cccd) {
      const existingCCCD = await User.findOne({ where: { CCCD: cccd, IDUser: { [Op.ne]: userId } } });
      if (existingCCCD) {
        return res.status(400).json({ message: 'CCCD đã được sử dụng' });
      }
    }

    // Cập nhật tọa độ nếu có địa chỉ mới
    const location = await getLatLngFromAddress(address);

    // Cập nhật thông tin
    await User.update(
      {
        FullName: fullName,
        PhoneNumber: phoneNumber,
        Address: address,
        DateOfBirth: dateOfBirth,
        Gender: gender,
        CCCD: cccd,
        Latitude: location?.lat || null,
        Longitude: location?.lng || null,
      },
      { where: { IDUser: userId } }
    );

    // Lấy thông tin người dùng sau khi cập nhật
    const updatedUser = await User.findByPk(userId);
    res.json({
      message: 'Cập nhật thông tin thành công',
      user: {
        IDUser: updatedUser.IDUser,
        FullName: updatedUser.FullName,
        Email: updatedUser.Email,
        PhoneNumber: updatedUser.PhoneNumber,
        Address: updatedUser.Address,
        DateOfBirth: updatedUser.DateOfBirth,
        Gender: updatedUser.Gender,
        Role: updatedUser.Role,
      },
    });
  } catch (error) {
    console.error('Lỗi cập nhật thông tin:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

// Xác minh email
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).send('Thiếu mã xác minh');
    }

    const user = await User.findOne({ where: { VerificationToken: token } });
    if (!user) {
      return res.status(400).send('Mã xác minh không hợp lệ hoặc đã hết hạn');
    }

    user.IsVerified = true;
    user.VerificationToken = null;
    await user.save();

    res.send(`
      <h2>✅ Tài khoản của bạn đã được xác minh thành công!</h2>
      <p>Bạn có thể <a href="http://localhost:3000/login">đăng nhập</a> ngay bây giờ.</p>
    `);
  } catch (error) {
    console.error('Lỗi xác minh:', error);
    res.status(500).send('Đã có lỗi xảy ra khi xác minh');
  }
});

module.exports = router;
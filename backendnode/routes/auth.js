const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendVerificationEmail = require('../utils/sendVerificationEmail');
const crypto = require('crypto');


const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Chưa đăng nhập' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    req.user = { IDUser: decoded.userId };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
};
// Hàm kiểm tra định dạng email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Hàm kiểm tra định dạng số điện thoại (10-11 số)
const isValidPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return true; // Không bắt buộc
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phoneNumber);
};


// Hàm kiểm tra độ tuổi (trên 18)
const isOver18 = (dateOfBirth) => {
  if (!dateOfBirth) return true; // Không bắt buộc
  const dob = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    return age - 1 >= 18;
  }
  return age >= 18;
};

// Đăng ký
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
  

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');


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
    });

    // Gửi email xác minh
    const verifyUrl = `http://localhost:5000/api/auth/verify-email?token=${verificationToken}`;
    try {
      await sendVerificationEmail(email, verifyUrl);
    } catch (err) {
      console.error('Lỗi gửi email xác minh:', err);
      // Không trả lỗi, vẫn cho đăng ký thành công nhưng báo không gửi được email
    }

    // Tạo JWT
    const token = jwt.sign({ IDUser: user.IDUser, Role: user.Role }, process.env.JWT_SECRET || 'your_jwt_secret_key', {
      expiresIn: '1h'
    });

    res.status(201).json({
      message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác minh tài khoản!',
      token,
      user: {
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

// Đăng nhập
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ email và mật khẩu' });
  }

  try {
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
    const token = jwt.sign({ IDUser: user.IDUser, Role: user.Role }, process.env.JWT_SECRET || 'your_jwt_secret_key', {
      expiresIn: '1h'
    });

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        IDUser: user.IDUser, // ✅ thêm dòng này
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


router.put('/update', authenticate, async (req, res) => {
    console.log('req.body:', req.body);
  try {
    const userId = req.user.IDUser;
    const { fullName, phoneNumber, address, dateOfBirth, gender } = req.body;

    // Kiểm tra các trường hợp cần validate
    if (!fullName) {
      return res.status(400).json({ message: 'Họ tên không được để trống' });
    }
    if (!isValidPhoneNumber(phoneNumber)) {
      return res.status(400).json({ message: 'Số điện thoại phải chứa 10-11 số' });
    }
    if (!isOver18(dateOfBirth)) {
      return res.status(400).json({ message: 'Người dùng phải trên 18 tuổi' });
    }
    if (gender && !['Male', 'Female', 'Other'].includes(gender)) {
      return res.status(400).json({ message: 'Giới tính phải là Male, Female hoặc Other' });
    }
    

    // Cập nhật thông tin
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

//xác minh email
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
module.exports.authenticate = authenticate;

require('dotenv').config();
const nodemailer = require('nodemailer');

module.exports = async function sendVerificationEmail(email, verifyUrl) {
  // Cấu hình transporter với Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Xác minh tài khoản',
    html: `
      <p>Chào bạn,</p>
      <p>Nhấn vào link sau để xác minh tài khoản:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>Nếu bạn không yêu cầu tạo tài khoản, hãy bỏ qua email này.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

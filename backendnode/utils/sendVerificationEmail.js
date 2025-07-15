// Fake email sender for development
module.exports = async function sendVerificationEmail(email, verifyUrl) {
  console.log(`[Fake email] Gửi xác minh tới: ${email} - Link: ${verifyUrl}`);
  // Để gửi email thật, hãy dùng nodemailer hoặc dịch vụ email khác
};

require('dotenv').config(); // Load biến môi trường từ .env
const sql = require('mssql');

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  options: {
    encrypt: false, // false nếu không dùng SSL
    trustServerCertificate: true, // cần thiết nếu là localhost
  }
};

async function testConnection() {
  try {
    await sql.connect(config);
    console.log('✅ Kết nối SQL Server thành công!');
    const result = await sql.query('SELECT GETDATE() AS ThoiGianHienTai');
    console.log('⏰ Thời gian hiện tại trên SQL Server:', result.recordset[0].ThoiGianHienTai);
    sql.close();
  } catch (err) {
    console.error('❌ Lỗi kết nối:', err.message);
  }
}

testConnection();

const sql = require("mssql");

const config = {
  user: "sa",
  password: "12345",
  server: "NguyenTuanKhang\\SQLEXPRESS",
  database: "system-blood",
  options: { encrypt: true, trustServerCertificate: true },
};

exports.checkExists = async (idUser) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input("IDUser", sql.Int, idUser)
      .query("SELECT COUNT(*) as count FROM Users WHERE IDUser = @IDUser");
    return result.recordset[0].count > 0;
  } catch (error) {
    console.error("Lỗi SQL khi kiểm tra IDUser:", error);
    throw error;
  }
};

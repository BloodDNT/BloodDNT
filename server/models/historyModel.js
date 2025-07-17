const sql = require("mssql");

const config = {
  user: "sa",
  password: "12345",
  server: "NguyenTuanKhang\\SQLEXPRESS",
  database: "system-blood",
  options: { encrypt: true, trustServerCertificate: true },
};

exports.getByUserId = async (userId) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(
        "SELECT IDHistory, IDUser, DonateBloodDate, IDRequest, IDBlood, Description, NextDonateDate, Volume FROM DonationHistory"
      );
    console.log("Kết quả truy vấn getByUserId:", result.recordset);
    return result.recordset;
  } catch (error) {
    console.error("Lỗi SQL getByUserId:", error);
    throw error;
  }
};

exports.getAll = async () => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(
        "SELECT IDHistory, IDUser, DonateBloodDate, IDRequest, IDBlood, Description, NextDonateDate, Volume FROM DonationHistory"
      );
    console.log("Kết quả truy vấn getAll:", result.recordset);
    return result.recordset;
  } catch (error) {
    console.error("Lỗi SQL getAll:", error);
    throw error;
  }
};

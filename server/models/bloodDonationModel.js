const sql = require("mssql");

const config = {
  user: "sa",
  password: "12345",
  server: "NguyenTuanKhang\\SQLEXPRESS",
  database: "system-blood",
  options: { encrypt: true, trustServerCertificate: true },
};

exports.addBloodDonation = async (idUser, volume, postDonationStatus) => {
  try {
    const pool = await sql.connect(config);
    await pool
      .request()
      .input("IDUser", sql.Int, idUser)
      .input("Volume", sql.Int, volume)
      .input("PostDonationStatus", sql.NVarChar, postDonationStatus)
      .query(
        "INSERT INTO BloodDonation (IDUser, Volume, PostDonationStatus) VALUES (@IDUser, @Volume, @PostDonationStatus)"
      );
  } catch (error) {
    console.error("Lỗi SQL khi thêm thông tin hiến máu:", error);
    throw error;
  }
};

exports.getBloodDonationHistory = async () => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(
        "SELECT IDDonation, IDUser, DonationDate, Volume, PostDonationStatus FROM BloodDonation"
      );
    console.log("Kết quả truy vấn getBloodDonationHistory:", result.recordset);
    return result.recordset;
  } catch (error) {
    console.error("Lỗi SQL khi lấy lịch sử hiến máu:", error);
    throw error;
  }
};

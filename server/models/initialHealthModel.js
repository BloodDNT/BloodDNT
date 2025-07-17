const sql = require("mssql");

const config = {
  user: "sa",
  password: "12345",
  server: "NguyenTuanKhang\\SQLEXPRESS",
  database: "system-blood",
  options: { encrypt: true, trustServerCertificate: true },
};

exports.getByIdRequest = async () => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(
        "SELECT IDDeclaration, IDRequest, DeclarationDate, BloodPressure, Weight, MedicalHistory, Eligible FROM InitialHealthDeclaration"
      );
    console.log("Kết quả truy vấn getByIdRequest:", result.recordset);
    return result.recordset; // Trả về toàn bộ bản ghi
  } catch (error) {
    console.error("Lỗi SQL khi lấy thông tin khai báo sức khỏe:", error);
    throw error;
  }
};

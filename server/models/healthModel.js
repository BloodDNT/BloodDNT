const sql = require("mssql");

const config = {
  user: "sa",
  password: "12345",
  server: "NguyenTuanKhang\\SQLEXPRESS",
  database: "system-blood",
  options: { encrypt: true, trustServerCertificate: true },
};

exports.addHealthCheck = async (idUser, healthData) => {
  try {
    const pool = await sql.connect(config);
    console.log("IDUser nhận được:", idUser); // Kiểm tra IDUser
    console.log("Dữ liệu sức khỏe nhận được:", healthData); // Kiểm tra dữ liệu gửi đến

    // Xử lý và kiểm tra dữ liệu đầu vào
    const parsedIdUser = parseInt(idUser);
    if (isNaN(parsedIdUser)) throw new Error("IDUser không phải là số hợp lệ");

    const parsedWeight = healthData.canNang
      ? parseFloat(healthData.canNang)
      : null;
    if (healthData.canNang && isNaN(parsedWeight))
      throw new Error("Cân nặng không hợp lệ");

    const eligible =
      healthData.duDieuKien === "true" || healthData.duDieuKien === true
        ? 1
        : 0;

    await pool
      .request()
      .input("IDUser", sql.Int, parsedIdUser)
      .input("BloodPressure", sql.NVarChar, healthData.huyetAp || null)
      .input("Weight", sql.Decimal(5, 2), parsedWeight)
      .input("TestResults", sql.NVarChar, healthData.ketQuaXetNghiem || null)
      .input("Eligible", sql.Bit, eligible)
      .query(
        "INSERT INTO HealthCheck (IDUser, BloodPressure, Weight, TestResults, Eligible) VALUES (@IDUser, @BloodPressure, @Weight, @TestResults, @Eligible)"
      );
  } catch (error) {
    console.error("Lỗi SQL khi thêm kiểm tra sức khỏe:", error);
    throw error;
  }
};

exports.getHealthCheckHistory = async () => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(
        "SELECT IDCheck, IDUser, CheckDate, BloodPressure, Weight, TestResults, Eligible FROM HealthCheck"
      );
    console.log("Kết quả truy vấn getHealthCheckHistory:", result.recordset);
    return result.recordset;
  } catch (error) {
    console.error("Lỗi SQL khi lấy lịch sử kiểm tra sức khỏe:", error);
    throw error;
  }
};

exports.getAllHealthCheckHistory = async () => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(
        "SELECT IDCheck, IDUser, CheckDate, BloodPressure, Weight, TestResults, Eligible FROM HealthCheck"
      );
    console.log("Dữ liệu từ HealthCheck:", result.recordset);
    return result.recordset;
  } catch (error) {
    console.error("Lỗi SQL khi lấy tất cả lịch sử kiểm tra sức khỏe:", error);
    throw error;
  }
};

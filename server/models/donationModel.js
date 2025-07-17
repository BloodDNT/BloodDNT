const sql = require("mssql");

const config = {
  user: "sa",
  password: "12345",
  server: "NguyenTuanKhang\\SQLEXPRESS",
  database: "system-blood",
  options: { encrypt: true, trustServerCertificate: true },
};

exports.getAll = async () => {
  const pool = await sql.connect(config);
  const result = await pool
    .request()
    .query("SELECT * FROM RegisterDonateBlood");
  return result.recordset;
};

exports.updateStatus = async (id, trangThai, lyDo) => {
  const pool = await sql.connect(config);
  await pool
    .request()
    .input("IDRegister", sql.Int, id)
    .input("Status", sql.NVarChar, trangThai)
    .input("Note", sql.NVarChar, lyDo)
    .query(
      "UPDATE RegisterDonateBlood SET Status = @Status, Note = @Note WHERE IDRegister = @IDRegister"
    );
};

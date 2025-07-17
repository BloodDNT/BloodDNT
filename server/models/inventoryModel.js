const sql = require("mssql");

const config = {
  user: "sa",
  password: "12345",
  server: "NguyenTuanKhang\\SQLEXPRESS",
  database: "system-blood",
  options: { encrypt: true, trustServerCertificate: true },
};

module.exports = {
  addInventory: async (
    idBlood,
    quantity,
    donationDate,
    expiryDate,
    finalTestResult
  ) => {
    try {
      const pool = await sql.connect(config);
      const transaction = new sql.Transaction(pool);
      await transaction.begin();
      try {
        await pool
          .request(transaction)
          .input("IDBlood", sql.Int, idBlood)
          .input("Quantity", sql.Int, quantity)
          .input("DonationDate", sql.DateTime2, donationDate)
          .input("ExpiryDate", sql.DateTime2, expiryDate)
          .input("FinalTestResult", sql.NVarChar, finalTestResult)
          .query(
            "INSERT INTO BloodInventory (IDBlood, Quantity, DonationDate, ExpiryDate, FinalTestResult) VALUES (@IDBlood, @Quantity, @DonationDate, @ExpiryDate, @FinalTestResult)"
          );

        const newInventory = await pool
          .request(transaction)
          .input("IDBlood", sql.Int, idBlood)
          .query(
            "SELECT TOP 1 IDInventory FROM BloodInventory WHERE IDBlood = @IDBlood ORDER BY IDInventory DESC"
          );
        const idInventory = newInventory.recordset[0].IDInventory;

        await pool
          .request(transaction)
          .input("IDInventory", sql.Int, idInventory)
          .input("TransactionType", sql.NVarChar, "NhapKho")
          .input("Quantity", sql.Int, quantity)
          .input("Purpose", sql.NVarChar, "Nhập kho mới")
          .query(
            "INSERT INTO BloodInventoryTransaction (IDInventory, TransactionType, Quantity, Purpose) VALUES (@IDInventory, @TransactionType, @Quantity, @Purpose)"
          );

        await transaction.commit();
      } catch (err) {
        await transaction.rollback();
        throw err;
      }
    } catch (error) {
      console.error("Lỗi SQL khi nhập kho máu:", error);
      throw error;
    }
  },

  removeInventory: async (idBlood, quantity, purpose) => {
    try {
      const pool = await sql.connect(config);
      const result = await pool
        .request()
        .input("IDBlood", sql.Int, idBlood)
        .input("Quantity", sql.Int, quantity)
        .input("Purpose", sql.NVarChar, purpose).query(`
          UPDATE bi
          SET bi.Quantity = bi.Quantity - @Quantity
          FROM BloodInventory bi
          WHERE bi.IDBlood = @IDBlood AND bi.Quantity >= @Quantity;

          INSERT INTO BloodInventoryTransaction (IDInventory, TransactionType, Quantity, Purpose)
          SELECT TOP 1 IDInventory, 'XuatKho', @Quantity, @Purpose
          FROM BloodInventory
          WHERE IDBlood = @IDBlood AND Quantity >= @Quantity;
        `);
      if (result.rowsAffected[0] === 0) {
        throw new Error("Không đủ số lượng trong kho để xuất");
      }
    } catch (error) {
      console.error("Lỗi SQL khi xuất kho máu:", error);
      throw error;
    }
  },

  getInventorySummary: async () => {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request().query(`
          SELECT 
            bi.IDBlood, COALESCE(gb.BloodType, 'Không xác định') AS BloodType, 
            SUM(bi.Quantity) AS TotalQuantity, MIN(bi.ExpiryDate) AS EarliestExpiry
          FROM BloodInventory bi
          LEFT JOIN groupblood gb ON bi.IDBlood = gb.IDBlood
          GROUP BY bi.IDBlood, COALESCE(gb.BloodType, 'Không xác định');
        `);
      console.log("Kết quả kiểm kê kho máu:", result.recordset);
      return result.recordset;
    } catch (error) {
      console.error("Lỗi SQL khi kiểm kê kho máu:", error);
      throw error;
    }
  },

  checkAlerts: async () => {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request().query(`
          SELECT 
            bi.IDBlood, COALESCE(gb.BloodType, 'Không xác định') AS BloodType, 
            SUM(bi.Quantity) AS TotalQuantity, MIN(bi.ExpiryDate) AS EarliestExpiry
          FROM BloodInventory bi
          LEFT JOIN groupblood gb ON bi.IDBlood = gb.IDBlood
          GROUP BY bi.IDBlood, COALESCE(gb.BloodType, 'Không xác định')
          HAVING SUM(bi.Quantity) < 5 OR MIN(bi.ExpiryDate) <= DATEADD(day, 7, GETDATE());
        `);
      console.log("Kết quả cảnh báo kho máu:", result.recordset);
      return result.recordset;
    } catch (error) {
      console.error("Lỗi SQL khi kiểm tra cảnh báo:", error);
      throw error;
    }
  },

  getTransactionHistory: async (idBlood) => {
    try {
      if (!idBlood || isNaN(parseInt(idBlood))) {
        throw new Error("IDBlood không hợp lệ!");
      }
      const pool = await sql.connect(config);
      const result = await pool
        .request()
        .input("IDBlood", sql.Int, parseInt(idBlood)).query(`
          SELECT 
            bit.IDTransaction, bit.TransactionDate, bit.TransactionType, bit.Quantity, bit.Purpose,
            bi.IDBlood, gb.BloodType, bi.ExpiryDate
          FROM BloodInventoryTransaction bit
          LEFT JOIN BloodInventory bi ON bit.IDInventory = bi.IDInventory
          LEFT JOIN groupblood gb ON bi.IDBlood = gb.IDBlood
          WHERE bi.IDBlood = @IDBlood
          ORDER BY bit.TransactionDate DESC;
        `);
      console.log("Kết quả lịch sử giao dịch:", result.recordset);
      if (result.recordset.length === 0) {
        throw new Error("Không tìm thấy lịch sử giao dịch cho IDBlood này");
      }
      return result.recordset;
    } catch (error) {
      console.error("Lỗi SQL khi lấy lịch sử giao dịch:", error);
      throw error;
    }
  },
};

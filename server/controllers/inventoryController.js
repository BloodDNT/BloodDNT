const inventoryModel = require("../models/inventoryModel");

// Add debug log to verify module loading
console.log("Inventory Model:", inventoryModel);

exports.addInventory = async (req, res) => {
  const { idBlood, quantity, donationDate, expiryDate, finalTestResult } =
    req.body;
  try {
    await inventoryModel.addInventory(
      idBlood,
      quantity,
      donationDate,
      expiryDate,
      finalTestResult
    );
    res.json({ message: "Nhập kho máu thành công" });
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ error: "Lỗi khi nhập kho máu" });
  }
};

exports.removeInventory = async (req, res) => {
  const { idBlood } = req.params;
  const { quantity, purpose } = req.body;
  try {
    await inventoryModel.removeInventory(idBlood, quantity, purpose);
    res.json({ message: "Xuất kho máu thành công" });
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ error: "Lỗi khi xuất kho máu" });
  }
};

exports.getInventorySummary = async (req, res) => {
  try {
    const summary = await inventoryModel.getInventorySummary();
    res.json(summary);
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ error: "Lỗi khi kiểm kê kho máu" });
  }
};

exports.checkAlerts = async (req, res) => {
  try {
    const alerts = await inventoryModel.checkAlerts();
    res.json(alerts);
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ error: "Lỗi khi kiểm tra cảnh báo" });
  }
};

exports.getTransactionHistory = async (req, res) => {
  const { idBlood } = req.params;
  try {
    const history = await inventoryModel.getTransactionHistory(idBlood);
    res.json(history);
  } catch (error) {
    console.error("Lỗi server:", error);
    res
      .status(500)
      .json({ error: error.message || "Lỗi khi lấy lịch sử giao dịch" });
  }
};

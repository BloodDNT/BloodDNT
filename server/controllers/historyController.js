const historyModel = require("../models/historyModel");

exports.getDonationHistory = async (req, res) => {
  try {
    const history = await historyModel.getByUserId();
    res.json(history);
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ error: "Lỗi khi lấy lịch sử hiến máu" });
  }
};

exports.getAllDonationHistory = async (req, res) => {
  try {
    const history = await historyModel.getAll();
    res.json(history);
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ error: "Lỗi khi lấy tất cả lịch sử hiến máu" });
  }
};

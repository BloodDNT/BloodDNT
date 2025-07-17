const healthModel = require("../models/healthModel");

exports.addHealthCheck = async (req, res) => {
  const { idUser } = req.params;
  const healthData = req.body;
  console.log("idUser từ req.params:", idUser); // Kiểm tra giá trị idUser
  console.log("Dữ liệu từ req.body:", healthData); // Kiểm tra dữ liệu gửi đến
  if (!idUser || isNaN(parseInt(idUser))) {
    return res.status(400).json({ error: "IDUser không hợp lệ" });
  }
  try {
    await healthModel.addHealthCheck(parseInt(idUser), healthData);
    res.json({ message: "Cập nhật kiểm tra sức khỏe thành công" });
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ error: "Lỗi khi cập nhật kiểm tra sức khỏe" });
  }
};

exports.getHealthCheckHistory = async (req, res) => {
  try {
    const history = await healthModel.getHealthCheckHistory();
    res.json(history);
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ error: "Lỗi khi lấy lịch sử kiểm tra sức khỏe" });
  }
};

exports.getAllHealthCheckHistory = async (req, res) => {
  try {
    const history = await healthModel.getAllHealthCheckHistory();
    res.json(history);
  } catch (error) {
    console.error("Lỗi server:", error);
    res
      .status(500)
      .json({ error: "Lỗi khi lấy tất cả lịch sử kiểm tra sức khỏe" });
  }
};

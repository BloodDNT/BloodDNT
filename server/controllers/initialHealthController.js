const initialHealthModel = require("../models/initialHealthModel");

exports.getInitialHealthDeclaration = async (req, res) => {
  try {
    const declarations = await initialHealthModel.getByIdRequest();
    res.json(declarations);
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ error: "Lỗi khi lấy thông tin khai báo sức khỏe" });
  }
};

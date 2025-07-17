const userModel = require("../models/userModel");

exports.checkUserExists = async (req, res) => {
  const { idUser } = req.params;
  try {
    const exists = await userModel.checkExists(idUser);
    res.json({ exists });
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ error: "Lỗi khi kiểm tra IDUser" });
  }
};

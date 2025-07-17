const bloodDonationModel = require("../models/bloodDonationModel");

exports.addBloodDonation = async (req, res) => {
  const { idUser } = req.params;
  const { volume, postDonationStatus } = req.body;
  try {
    await bloodDonationModel.addBloodDonation(
      idUser,
      volume,
      postDonationStatus
    );
    res.json({ message: "Ghi nhận thông tin hiến máu thành công" });
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ error: "Lỗi khi ghi nhận thông tin hiến máu" });
  }
};

exports.getBloodDonationHistory = async (req, res) => {
  try {
    const history = await bloodDonationModel.getBloodDonationHistory();
    res.json(history);
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ error: "Lỗi khi lấy lịch sử hiến máu" });
  }
};

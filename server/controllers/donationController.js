const donationModel = require("../models/donationModel");

exports.getDonationRequests = async (req, res) => {
  try {
    const requests = await donationModel.getAll();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy đơn đăng ký" });
  }
};

exports.updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { trangThai, lyDo } = req.body;
  try {
    await donationModel.updateStatus(id, trangThai, lyDo);
    res.json({ message: "Cập nhật trạng thái thành công" });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi cập nhật trạng thái" });
  }
};

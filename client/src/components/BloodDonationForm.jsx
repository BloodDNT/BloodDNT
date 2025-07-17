import React, { useState, useEffect } from "react";
import axios from "axios";

const BloodDonationForm = () => {
  const [donationData, setDonationData] = useState({
    idUser: "",
    volume: "",
    postDonationStatus: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [donationHistory, setDonationHistory] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/blood-donation/history")
      .then((response) => {
        setDonationHistory(response.data);
        console.log("Lịch sử hiến máu:", response.data);
      })
      .catch((error) => console.error("Lỗi khi lấy lịch sử hiến máu:", error));
  }, []);

  const handleSubmit = async () => {
    const idUserNum = parseInt(donationData.idUser, 10);
    if (!donationData.idUser || isNaN(idUserNum) || idUserNum <= 0) {
      setErrorMessage("Vui lòng nhập IDUser là một số nguyên dương hợp lệ!");
      return;
    }
    if (
      !donationData.volume ||
      isNaN(parseInt(donationData.volume)) ||
      parseInt(donationData.volume) <= 0
    ) {
      setErrorMessage("Vui lòng nhập số lượng máu hợp lệ!");
      return;
    }

    // Kiểm tra IDUser tồn tại trong database
    try {
      const response = await axios.get(
        `http://localhost:3001/api/users/check/${idUserNum}`
      );
      if (!response.data.exists) {
        setErrorMessage("IDUser không tồn tại trong hệ thống!");
        return;
      }
    } catch (error) {
      setErrorMessage("Lỗi khi kiểm tra IDUser: " + error.message);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3001/api/blood-donation/${idUserNum}`,
        {
          volume: parseInt(donationData.volume),
          postDonationStatus: donationData.postDonationStatus,
        }
      );
      if (response.status === 200) {
        setDonationData({
          idUser: idUserNum.toString(),
          volume: "",
          postDonationStatus: "",
        });
        setErrorMessage("");
        alert("Ghi nhận thông tin hiến máu thành công");
        // Cập nhật lịch sử sau khi thêm
        const updatedHistory = await axios.get(
          "http://localhost:3001/api/blood-donation/history"
        );
        setDonationHistory(updatedHistory.data);
      }
    } catch (error) {
      console.error("Lỗi khi ghi nhận thông tin hiến máu:", error);
      setErrorMessage(
        "Lỗi khi gửi dữ liệu: " +
          (error.response ? error.response.data.error : error.message)
      );
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Ghi Nhận Thông Tin Hiến Máu
      </h2>
      <div className="flex flex-col gap-3">
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        <input
          type="text"
          placeholder="IDUser"
          value={donationData.idUser}
          onChange={(e) =>
            setDonationData({ ...donationData, idUser: e.target.value })
          }
          className="border p-2 rounded text-sm"
        />
        <input
          type="text"
          placeholder="Số lượng máu (ml)"
          value={donationData.volume}
          onChange={(e) =>
            setDonationData({ ...donationData, volume: e.target.value })
          }
          className="border p-2 rounded text-sm"
        />
        <input
          type="text"
          placeholder="Tình trạng sau hiến máu"
          value={donationData.postDonationStatus}
          onChange={(e) =>
            setDonationData({
              ...donationData,
              postDonationStatus: e.target.value,
            })
          }
          className="border p-2 rounded text-sm"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
          onClick={handleSubmit}
        >
          Ghi Nhận
        </button>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Lịch Sử Hiến Máu</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">ID</th>
                <th className="border p-2">Ngày Hiến</th>
                <th className="border p-2">Số lượng (ml)</th>
                <th className="border p-2">Tình trạng sau hiến</th>
              </tr>
            </thead>
            <tbody>
              {donationHistory.map((donation) => (
                <tr key={donation.IDDonation} className="hover:bg-gray-50">
                  <td className="border p-2">{donation.IDDonation}</td>
                  <td className="border p-2">
                    {new Date(donation.DonationDate).toLocaleDateString()}
                  </td>
                  <td className="border p-2">{donation.Volume}</td>
                  <td className="border p-2">
                    {donation.PostDonationStatus || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BloodDonationForm;

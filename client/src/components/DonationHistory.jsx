import React, { useState, useEffect } from "react";
import axios from "axios";

const DonationHistory = () => {
  const [lichSuHienMau, setLichSuHienMau] = useState([]);

  useEffect(() => {
    // Gọi API để lấy tất cả lịch sử hiến máu khi component mount
    axios
      .get("http://localhost:3001/api/lich-su-hien-mau/all")
      .then((response) => {
        setLichSuHienMau(response.data);
        console.log("Dữ liệu lịch sử hiến máu:", response.data); // Kiểm tra dữ liệu
      })
      .catch((error) => console.error("Lỗi khi lấy lịch sử hiến máu:", error));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Lịch Sử Hiến Máu</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID Lịch Sử</th>
              <th className="border p-2">ID Người Dùng</th>
              <th className="border p-2">Ngày Hiến Máu</th>
              <th className="border p-2">ID Yêu Cầu</th>
              <th className="border p-2">Nhóm Máu</th>
              <th className="border p-2">Mô Tả</th>
              <th className="border p-2">Ngày Hiến Tiếp Theo</th>
              <th className="border p-2">Dung Tích (ml)</th>
            </tr>
          </thead>
          <tbody>
            {lichSuHienMau.map((lichSu) => (
              <tr key={lichSu.IDHistory} className="hover:bg-gray-50">
                <td className="border p-2">{lichSu.IDHistory}</td>
                <td className="border p-2">{lichSu.IDUser}</td>
                <td className="border p-2">
                  {new Date(lichSu.DonateBloodDate).toLocaleDateString()}
                </td>
                <td className="border p-2">{lichSu.IDRequest || "N/A"}</td>
                <td className="border p-2">{lichSu.IDBlood}</td>
                <td className="border p-2">{lichSu.Description || "N/A"}</td>
                <td className="border p-2">
                  {new Date(lichSu.NextDonateDate).toLocaleDateString()}
                </td>
                <td className="border p-2">{lichSu.Volume || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationHistory;

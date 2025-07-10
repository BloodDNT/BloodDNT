import React, { useEffect, useState } from "react";
import "../styles/table.css";
import axios from "axios";

const SuccessfulDonationsTable = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/successful-donations")
      .then(res => {
        console.log("✅ Dữ liệu từ API:", res.data);
        if (Array.isArray(res.data)) {
          setDonations(res.data);
        } else {
          console.error("❌ Dữ liệu không phải mảng:", res.data);
        }
      })
      .catch(err => {
        console.error("❌ Lỗi khi gọi API Successful Donations:", err);
      });
  }, []);

  const totalVolume = donations.reduce((sum, d) => sum + parseInt(d.Pack || 0), 0);

  return (
    <div className="table-container">
      <h2>Danh sách hiến máu thành công (Tháng này)</h2>
      <p><strong>Tổng khối lượng máu:</strong> {totalVolume} ml</p>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Ngày hiến</th>
            <th>Khối lượng (ml)</th>
          </tr>
        </thead>
        <tbody>
          {donations.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: "16px" }}>
                Không có dữ liệu hiến máu trong tháng.
              </td>
            </tr>
          ) : (
            donations.map((donation, index) => (
              <tr key={index}>
                <td>{donation.FullName}</td>
                <td>{new Date(donation.DonateBloodDate).toLocaleDateString()}</td>
                <td style={{ fontWeight: "bold", color: (donation.Pack < 250 ? "red" : "#333") }}>
                  {donation.Pack} ml
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SuccessfulDonationsTable;

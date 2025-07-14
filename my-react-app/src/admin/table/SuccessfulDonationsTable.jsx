import React, { useEffect, useState } from "react";
import "../../styles/table.css";
import axios from "axios";

const ROWS_PER_PAGE = 1;

const SuccessfulDonationsTable = () => {
  const [donations, setDonations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/successful-donations")
      .then((res) => {
        console.log("✅ Dữ liệu từ API:", res.data);
        if (Array.isArray(res.data)) {
          setDonations(res.data);
        } else {
          console.error("❌ Dữ liệu không phải mảng:", res.data);
        }
      })
      .catch((err) => {
        console.error("❌ Lỗi khi gọi API Successful Donations:", err);
      });
  }, []);

  const totalVolume = donations.reduce((sum, d) => sum + parseInt(d.Pack || 0), 0);

  const totalPages = Math.ceil(donations.length / ROWS_PER_PAGE);
  const paginatedDonations = donations.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="table-container">
      <h2>✅ Danh sách hiến máu thành công (Tháng này)</h2>
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
          {paginatedDonations.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: "16px" }}>
                Không có dữ liệu hiến máu trong tháng.
              </td>
            </tr>
          ) : (
            paginatedDonations.map((donation, index) => (
              <tr key={index}>
                <td>{donation.FullName}</td>
                <td>{new Date(donation.DonateBloodDate).toLocaleDateString("vi-VN")}</td>
                <td style={{ fontWeight: "bold", color: donation.Pack < 250 ? "red" : "#333" }}>
                  {donation.Pack} ml
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {donations.length > ROWS_PER_PAGE && (
        <div
          className="pagination-controls"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          <button onClick={handlePrev} disabled={currentPage === 1}>
            ◀ Trang trước
          </button>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
          <button onClick={handleNext} disabled={currentPage === totalPages}>
            Trang sau ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default SuccessfulDonationsTable;

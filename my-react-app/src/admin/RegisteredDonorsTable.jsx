import React, { useState } from "react";
import "../styles/table.css";

const ROWS_PER_PAGE = 5;

export const RegisteredDonorsTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);

  const paginatedData = data.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="table-container">
      <h2>Danh sách người hiến máu đã đăng ký</h2>
      <table className="custom-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Ngày đăng ký</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "16px" }}>
                Không có dữ liệu người hiến máu.
              </td>
            </tr>
          ) : (
            paginatedData.map((donor, index) => (
              <tr key={index}>
                <td>{(currentPage - 1) * ROWS_PER_PAGE + index + 1}</td>
                <td>{donor.FullName}</td>
                <td>{donor.Email}</td>
                <td>{donor.PhoneNumber}</td>
                <td>{new Date(donor.DonateBloodDate).toLocaleDateString("vi-VN")}</td>
                <td>{donor.Status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {data.length > ROWS_PER_PAGE && (
        <div className="pagination-controls">
          <button onClick={handlePrev} disabled={currentPage === 1}>
            ◀ Trang trước
          </button>
          <span>
            Trang {currentPage}/{totalPages}
          </span>
          <button onClick={handleNext} disabled={currentPage === totalPages}>
            Trang sau ▶
          </button>
        </div>
      )}
    </div>
  );
};

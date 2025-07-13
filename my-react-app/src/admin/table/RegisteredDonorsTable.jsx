import React, { useState } from "react";
import "../../styles/table.css";

const ROWS_PER_PAGE = 1;

const RegisteredDonorsTable = ({ data }) => {
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

  const renderStatus = (status) => {
    const baseStyle = {
      padding: "4px 8px",
      borderRadius: "6px",
      fontWeight: "bold",
      fontSize: "0.9rem",
      display: "inline-block",
    };

    switch (status) {
      case "Approved":
        return <span style={{ ...baseStyle, background: "#d4edda", color: "#155724" }}>Đã duyệt</span>;
      case "Pending":
        return <span style={{ ...baseStyle, background: "#fff3cd", color: "#856404" }}>Chờ duyệt</span>;
      case "Rejected":
        return <span style={{ ...baseStyle, background: "#f8d7da", color: "#721c24" }}>Từ chối</span>;
      default:
        return <span style={baseStyle}>{status}</span>;
    }
  };

  return (
    <div className="table-container">
      <h2 style={{ marginBottom: "1rem" }}>📝 Danh sách người hiến máu đã đăng ký</h2>

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
              <tr key={index} className={index % 2 === 0 ? "even" : "odd"}>
                <td>{(currentPage - 1) * ROWS_PER_PAGE + index + 1}</td>
                <td>{donor.FullName}</td>
                <td>{donor.Email}</td>
                <td>{donor.PhoneNumber}</td>
                <td>{new Date(donor.DonateBloodDate).toLocaleDateString("vi-VN")}</td>
                <td>{renderStatus(donor.Status)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {data.length > ROWS_PER_PAGE && (
        <div className="pagination-controls"
         style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px",
            marginTop: "16px",
          }}>
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

export default RegisteredDonorsTable;

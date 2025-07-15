import React, { useState } from "react";
import "../../styles/table.css";
import { FaExclamationTriangle } from "react-icons/fa";

const ROWS_PER_PAGE = 5;

const BloodRecipientsTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("All");

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
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
        return <span style={baseStyle}>{status || "Không rõ"}</span>;
    }
  };

  const filteredData = data.filter((row) =>
    filterStatus === "All" ? true : row.Status === filterStatus
  );

  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  return (
    <div className="table-container">
      <h2 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
        📥 Danh sách đăng ký nhận máu
      </h2>

      {/* Bộ lọc trạng thái */}
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="filterStatus"><strong>Lọc theo trạng thái:</strong> </label>
        <select
          id="filterStatus"
          value={filterStatus}
          onChange={handleFilterChange}
          style={{ marginLeft: "8px", padding: "4px" }}
        >
          <option value="All">Tất cả</option>
          <option value="Approved">Đã duyệt</option>
          <option value="Pending">Chờ duyệt</option>
          <option value="Rejected">Từ chối</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Người nhận</th>
              <th>Nhóm máu</th>
              <th>Thành phần</th>
              <th>Số lượng</th>
              <th>Mức độ khẩn cấp</th>
              <th>Ngày yêu cầu</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "16px" }}>
                  Không có yêu cầu nhận máu nào.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => {
                const isUrgent = row.UrgencyLevel?.toLowerCase() === "cao";
                return (
                  <tr key={index} className={index % 2 === 0 ? "even" : "odd"}>
                    <td>{(currentPage - 1) * ROWS_PER_PAGE + index + 1}</td>
                    <td>{row.FullName}</td>
                    <td>{row.BloodType}</td>
                    <td>{row.ComponentName}</td>
                    <td>{row.Quantity}</td>
                    <td style={{ color: isUrgent ? "#e74c3c" : "#2c3e50", fontWeight: isUrgent ? "bold" : "normal" }}>
                      {row.UrgencyLevel}
                      {isUrgent && <FaExclamationTriangle title="Yêu cầu khẩn cấp" style={{ marginLeft: "6px" }} />}
                    </td>
                    <td>{new Date(row.RequestDate).toLocaleDateString("vi-VN")}</td>
                    <td>{renderStatus(row.Status)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {filteredData.length > ROWS_PER_PAGE && (
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

export default BloodRecipientsTable;

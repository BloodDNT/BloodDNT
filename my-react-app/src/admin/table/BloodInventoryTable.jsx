import React from "react";
import "../../styles/table.css";
import { FaExclamationTriangle } from "react-icons/fa"; // Cảnh báo nếu total < 10

const BloodInventoryTable = ({ data }) => {
  const totalAll = data.reduce((sum, row) => sum + (row.total || 0), 0);

  return (
    <div className="table-container">
      <h2 style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
        🩸 Chi tiết tồn kho máu
      </h2>

      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Nhóm máu</th>
              <th>Toàn phần</th>
              <th>Hồng cầu</th>
              <th>Huyết tương</th>
              <th>Tiểu cầu</th>
              <th>Tổng cộng</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "16px" }}>
                  Không có dữ liệu tồn kho.
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const total = row.total ?? 0;
                const isLow = total < 10;

                return (
                  <tr key={index} className={index % 2 === 0 ? "even" : "odd"}>
                    <td><strong>{row.BloodType || row.bloodType}</strong></td>
                    <td>{row.whole ?? 0}</td>
                    <td>{row.redCells ?? 0}</td>
                    <td>{row.plasma ?? 0}</td>
                    <td>{row.platelets ?? 0}</td>
                    <td style={{
                      fontWeight: "bold",
                      color: isLow ? "#e74c3c" : "#2c3e50",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}>
                      {total}
                      {isLow && <FaExclamationTriangle title="Tồn kho thấp" />}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="total-summary">
        <strong>Tổng số lượng máu: </strong> {totalAll} túi
      </div>
    </div>
  );
};

export default BloodInventoryTable;
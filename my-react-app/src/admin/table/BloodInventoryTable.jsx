import React from "react";
import "../../styles/table.css";

const BloodInventoryTable = ({ data }) => {
  const totalAll = data.reduce((sum, row) => sum + (row.total || 0), 0);

  return (
    <div className="table-container">
      <h2>Chi tiết tồn kho máu</h2>
      <table className="custom-table">
        <thead>
          <tr>
            <th>NHÓM MÁU</th>
            <th>TOÀN PHẦN</th>
            <th>HỒNG CẦU</th>
            <th>HUYẾT TƯƠNG</th>
            <th>TIỂU CẦU</th>
            <th>TỔNG CỘNG</th>
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
            data.map((row, index) => (
              <tr key={index}>
                <td>{row.BloodType || row.bloodType}</td>
                <td>{row.whole ?? 0}</td>
                <td>{row.redCells ?? 0}</td>
                <td>{row.plasma ?? 0}</td>
                <td>{row.platelets ?? 0}</td>
                <td style={{ fontWeight: "bold", color: (row.total ?? 0) < 10 ? "red" : "#333" }}>
                  {row.total ?? 0}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BloodInventoryTable;
import React, { useEffect, useState } from "react";
import "../../styles/table.css";
import axios from "axios";

const ROWS_PER_PAGE = 5;

const UpcomingAppointmentsTable = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/upcoming-appointments")
      .then((res) => {
        console.log("✅ Dữ liệu từ API (Upcoming):", res.data);
        if (Array.isArray(res.data)) {
          setAppointments(res.data);
        } else {
          console.error("❌ Dữ liệu không phải mảng:", res.data);
        }
      })
      .catch((err) => {
        console.error("❌ Lỗi khi gọi API Upcoming Appointments:", err);
      });
  }, []);

  // Tính tổng trang & dữ liệu theo trang
  const totalPages = Math.ceil(appointments.length / ROWS_PER_PAGE);
  const paginatedAppointments = appointments.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="table-container">
      <h2>📅 Lịch hẹn hiến máu sắp tới</h2>
      <p><strong>Tổng số lịch hẹn:</strong> {appointments.length}</p>

      <table className="custom-table">
        <thead>
          <tr>
            <th>Người hiến</th>
            <th>Ngày</th>
            <th>Giờ</th>
          </tr>
        </thead>
        <tbody>
          {paginatedAppointments.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: "16px" }}>
                Không có lịch hẹn nào sắp tới.
              </td>
            </tr>
          ) : (
            paginatedAppointments.map((appt, index) => (
              <tr key={index}>
                <td>{appt.Donor}</td>
                <td>{new Date(appt.Date).toLocaleDateString("vi-VN")}</td>
                <td>{appt.Time}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {appointments.length > ROWS_PER_PAGE && (
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

export default UpcomingAppointmentsTable;

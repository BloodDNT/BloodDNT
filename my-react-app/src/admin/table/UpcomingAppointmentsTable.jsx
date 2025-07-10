import React, { useEffect, useState } from "react";
import "../../styles/table.css";
import axios from "axios";

const UpcomingAppointmentsTable = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/upcoming-appointments")
      .then(res => {
        console.log("✅ Dữ liệu từ API (Upcoming):", res.data);
        if (Array.isArray(res.data)) {
          setAppointments(res.data);
        } else {
          console.error("❌ Dữ liệu không phải mảng:", res.data);
        }
      })
      .catch(err => {
        console.error("❌ Lỗi khi gọi API Upcoming Appointments:", err);
      });
  }, []);

  return (
    <div className="table-container">
      <h2>Lịch hẹn hiến máu sắp tới</h2>
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
          {appointments.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: "16px" }}>
                Không có lịch hẹn nào sắp tới.
              </td>
            </tr>
          ) : (
            appointments.map((appt, index) => (
              <tr key={index}>
                <td>{appt.Donor}</td>
                <td>{new Date(appt.Date).toLocaleDateString()}</td>
                <td>{appt.Time}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UpcomingAppointmentsTable;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/table.css";

const UpcomingAppointmentsTable = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true); // thêm trạng thái loading

  useEffect(() => {
    axios
       .get("http://localhost:5000/api/upcoming-donations")
      .then((res) => {
        console.log("✅ Dữ liệu từ API (Upcoming):", res.data);
        if (Array.isArray(res.data)) {
          setAppointments(res.data);
        } else {
          console.warn("❗ API không trả về dạng mảng:", res.data);
          setAppointments([]);
        }
      })
      .catch((err) => {
        console.error("❌ Lỗi khi gọi API Upcoming Appointments:", err);
        setAppointments([]); 
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="inventory-table">
      <h2>Upcoming Donation Appointments</h2>

      {loading ? (
        <p>⏳ Đang tải dữ liệu...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Donor</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appt, i) => (
                <tr key={i}>
                  <td>{appt.Donor}</td>
                  <td>{appt.Date}</td>
                  <td>{appt.Time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No upcoming appointments</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UpcomingAppointmentsTable;

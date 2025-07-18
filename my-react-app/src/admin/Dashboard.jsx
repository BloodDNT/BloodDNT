import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Card";
import BloodInventoryTable from "./table/BloodInventoryTable";
import RegisteredDonorsTable from "./table/RegisteredDonorsTable";
import SuccessfulDonationsTable from "./table/SuccessfulDonationsTable";
import UpcomingAppointmentsTable from "./table/UpcomingAppointmentsTable";
import UserManagement from "./table/UserManagement";
import BloodRecipientsTable from "./table/BloodRecipientsTable";

import "../styles/dashboard.css";

function Dashboard() {
  const [activeTable, setActiveTable] = useState(null);
  const [role, setRole] = useState("User");

  const [inventoryData, setInventoryData] = useState([]);
  const [donorsData, setDonorsData] = useState([]);
  const [successfulData, setSuccessfulData] = useState([]);
  const [upcomingData, setUpcomingData] = useState([]);
  const [users, setUsers] = useState([]);
  const [recipents, setRecipents] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setRole(user?.role || "User");

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [
          inventoryRes,
          donorsRes,
          successRes,
          upcomingRes,
          usersRes,
          recipientsRes
        ] = await Promise.all([
          axios.get("http://localhost:5000/api/blood-inventory", config),
          axios.get("http://localhost:5000/api/registered-donors", config),
          axios.get("http://localhost:5000/api/successful-donations", config),
          axios.get("http://localhost:5000/api/upcoming-appointments", config),
          axios.get("http://localhost:5000/api/users", config),
          axios.get("http://localhost:5000/api/blood-recipients", config)
        ]);

        setInventoryData(inventoryRes.data);
        setDonorsData(donorsRes.data);
        setSuccessfulData(successRes.data);
        setUpcomingData(upcomingRes.data);
        setRecipents(recipientsRes.data);

        const nonAdminUsers = usersRes.data.filter(u => u.Role !== "Admin");
        setUsers(nonAdminUsers);
      } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (key) => {
    setActiveTable((prev) => (prev === key ? null : key));
  };

  const totalUnits = inventoryData.reduce((sum, row) => sum + (row.total || 0), 0);
  const totalSuccessCount = successfulData.length;
  const totalUpcoming = upcomingData.length;
  const totalUser = users.length;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Blood Donation Support System</p>
        </div>
      </div>

      <div className="card-grid">
        <div onClick={() => handleCardClick("inventory")}>
          <Card icon="💧" title="Total Blood Units" value={totalUnits.toLocaleString()} color="#F44336" />
        </div>
        <div onClick={() => handleCardClick("registered")}>
          <Card icon="👥" title="Registered Donors" value={donorsData.length.toLocaleString()} color="#2196F3" />
        </div>
        <div onClick={() => handleCardClick("successful")}>
          <Card icon="✅" title="Successful Donations" value={totalSuccessCount.toLocaleString()} color="#4CAF50" />
        </div>
        <div onClick={() => handleCardClick("upcoming")}>
          <Card icon="📅" title="Upcoming Appointments" value={totalUpcoming.toLocaleString()} color="#4CAF50" />
        </div>
        <div onClick={() => handleCardClick("recipients")}>
          <Card icon="🩸" title="Blood Recipients" value={recipents.length.toLocaleString()} color="#FF9800" />
        </div>
        {role === "Admin" && (
          <div onClick={() => handleCardClick("users")}>
            <Card icon="🧑‍💼" title="Total Users" value={totalUser.toLocaleString()} color="#9C27B0" />
          </div>
        )}
      </div>

      {activeTable === "inventory" && <BloodInventoryTable data={inventoryData} />}
      {activeTable === "registered" && <RegisteredDonorsTable data={donorsData} />}
      {activeTable === "successful" && <SuccessfulDonationsTable />}
      {activeTable === "upcoming" && <UpcomingAppointmentsTable />}
      {activeTable === "recipients" && <BloodRecipientsTable data={recipents} />}
      {activeTable === "users" && role === "Admin" && <UserManagement />}
    </div>
  );
}

export default Dashboard;

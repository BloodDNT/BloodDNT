import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Card";
import BloodInventoryTable from "./table/BloodInventoryTable";
import RegisteredDonorsTable from "./table/RegisteredDonorsTable";
import SuccessfulDonationsTable from "./table/SuccessfulDonationsTable";
import UpcomingAppointmentsTable from "./table/UpcomingAppointmentsTable";



import "../styles/dashboard.css";

function Dashboard() {
  const [activeTable, setActiveTable] = useState(null);

  const [inventoryData, setInventoryData] = useState([]);
  const [donorsData, setDonorsData] = useState([]);
  const [successfulData, setSuccessfulData] = useState([]);
  const [upcomingData, setUpcomingData] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoryRes, donorsRes, successRes, upcomingRes] = await Promise.all([
          axios.get("http://localhost:5000/api/blood-inventory"),
          axios.get("http://localhost:5000/api/registered-donors"),
          axios.get("http://localhost:5000/api/successful-donations"),
          axios.get("http://localhost:5000/api/upcoming-appointments")
        ]);

        setInventoryData(inventoryRes.data);
        setDonorsData(donorsRes.data);
        setSuccessfulData(successRes.data);
        setUpcomingData(upcomingRes.data);

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


  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Blood Donation Support System</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn manage">Manage</button>
          <button className="btn add">Add Donor</button>
        </div>
      </div>

      {/* Cards */}
      <div className="card-grid">
        <div onClick={() => handleCardClick("inventory")}>
          <Card
            icon="💧"
            title="Total Blood Units (by Blood Type)"
            value={totalUnits.toLocaleString()}
            color="#F44336"
          />
        </div>
        <div onClick={() => handleCardClick("registered")}>
          <Card
            icon="👥"
            title="Registered Donors"
            value={donorsData.length.toLocaleString()}
            color="#2196F3"
          />
        </div>
        <div onClick={() => handleCardClick("successful")}>
          <Card
            icon="✅"
            title="Successful Donations"
            value={totalSuccessCount.toLocaleString()}
            color="#4CAF50"
          />
        </div>
        <div onClick={() => handleCardClick("upcoming")}>
          <Card
            icon="📅"
            title="Upcoming Appointments"
            value={totalUpcoming.toLocaleString()}
            color="#4CAF50"
          />
        </div>
      </div>

      {/* Tables */}
      {activeTable === "inventory" && <BloodInventoryTable data={inventoryData} />}
      {activeTable === "registered" && <RegisteredDonorsTable data={donorsData} />}
      {activeTable === "successful" && <SuccessfulDonationsTable />}
      {activeTable === "upcoming" && <UpcomingAppointmentsTable />}

    </div>
  );
}

export default Dashboard;

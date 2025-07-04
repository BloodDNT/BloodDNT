import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Card";
import BloodInventoryTable from "./BloodInventoryTable";
import { RegisteredDonorsTable } from "./RegisteredDonorsTable";
import "../styles/dashboard.css";

function Dashboard() {
  const [activeTable, setActiveTable] = useState(null);

  const [inventoryData, setInventoryData] = useState([]);
  const [donorsData, setDonorsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoryRes, donorsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/blood-inventory"),
          axios.get("http://localhost:5000/api/registered-donors"),
        ]);

        setInventoryData(inventoryRes.data);
        setDonorsData(donorsRes.data);
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
      </div>

      {/* Tables */}
      {activeTable === "inventory" && <BloodInventoryTable data={inventoryData} />}
      {activeTable === "registered" && <RegisteredDonorsTable data={donorsData} />}
    </div>
  );
}

export default Dashboard;

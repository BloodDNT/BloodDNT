import React, { useEffect, useState } from "react";
import axios from "axios";
import BloodPieChart from "./chart/BloodPieChart"; // Đảm bảo bạn đã tạo

const BloodChartPage = () => {
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/blood-inventory")
      .then((res) => {
        setInventoryData(res.data);
      })
      .catch((err) => {
        console.error("❌ Lỗi lấy dữ liệu Blood Inventory:", err);
      });
  }, []);

  const pieData = inventoryData.map(item => ({
    BloodType: item.BloodType, // tên nhóm máu
    total: item.total          // số lượng
  }));

  return (
    <div style={{
      padding: "2rem",
      maxWidth: "900px",
      width: "100%",
      margin: "0 auto",
    }}>
      <h2>📊 Blood Inventory Overview</h2>
      <BloodPieChart data={pieData} />
    </div>
  );
};

export default BloodChartPage;

import React, { useEffect, useState } from "react";
import axios from "axios";
import BloodPieChart from "./chart/BloodPieChart";
import CombinedDonorChart from "./chart/CombinedDonorChart";

const BloodChartPage = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [registeredDonors, setRegisteredDonors] = useState([]);
  const [successfulDonors, setSuccessfulDonors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [inventoryRes, registeredRes, successRes] = await Promise.all([
          axios.get("http://localhost:5000/api/blood-inventory"),
          axios.get("http://localhost:5000/api/registered-donors"),
          axios.get("http://localhost:5000/api/successful-donations"),
        ]);

        setInventoryData(inventoryRes.data);
        setRegisteredDonors(registeredRes.data);
        setSuccessfulDonors(successRes.data);
      } catch (error) {
        console.error("❌ Lỗi khi tải dữ liệu biểu đồ:", error);
      }
    };

    fetchData();
  }, []);

  // Chuẩn hóa dữ liệu cho biểu đồ Pie
  const pieData = inventoryData.map(item => ({
    BloodType: item.BloodType,
    total: item.total,
  }));

  // Chuẩn hóa dữ liệu cho biểu đồ kết hợp (số lượng theo tháng)
  const processDonorData = () => {
    const countByMonth = (data, label) => {
      const countMap = {};

      data.forEach(item => {
        const date = new Date(item.DonateBloodDate);
        const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!countMap[month]) countMap[month] = { month };
        countMap[month][label] = (countMap[month][label] || 0) + 1;
      });

      return countMap;
    };

    const registeredMap = countByMonth(registeredDonors, "Registered");
    const successMap = countByMonth(successfulDonors, "Successful");

    // Hợp hai Map lại
    const allMonths = new Set([...Object.keys(registeredMap), ...Object.keys(successMap)]);
    const mergedData = Array.from(allMonths).map(month => ({
      month,
      Registered: registeredMap[month]?.Registered || 0,
      Successful: successMap[month]?.Successful || 0,
    }));

    // Sort theo thời gian tăng dần
    return mergedData.sort((a, b) => new Date(a.month) - new Date(b.month));
  };

  const donorChartData = processDonorData();

  return (
  <div style={{
    padding: "2rem",
    width: "100%",
    display: "flex",
    flexDirection: "column",
  }}>
    <h2>📊 Tổng quan về kho máu</h2>
    <div style={{ width: "110%", maxWidth: "1000px", alignSelf: "center" }}>
      <BloodPieChart data={pieData} />
    </div>

    <hr style={{ margin: "2rem 0" }} />

    <h2>📈 Đã đăng ký so với quyên góp thành công</h2>
    <div style={{ width: "110%", maxWidth: "1000px", alignSelf: "center" }}>
      <CombinedDonorChart data={donorChartData} />
    </div>
  </div>
);

};

export default BloodChartPage;

import React, { useState, useEffect } from "react";
import axios from "axios";

const HealthCheckHistory = () => {
  const [healthChecks, setHealthChecks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/kiem-tra-suc-khoe/history")
      .then((response) => {
        setHealthChecks(response.data);
        console.log("Dữ liệu kiểm tra sức khỏe:", response.data);
      })
      .catch((error) =>
        console.error("Lỗi khi lấy lịch sử kiểm tra sức khỏe:", error)
      );
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Lịch Sử Kiểm Tra Sức Khỏe</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID Kiểm Tra</th>
              <th className="border p-2">Ngày Kiểm Tra</th>
              <th className="border p-2">Huyết Áp</th>
              <th className="border p-2">Cân Nặng (kg)</th>
              <th className="border p-2">Kết Quả Xét Nghiệm</th>
              <th className="border p-2">Đủ Điều Kiện</th>
            </tr>
          </thead>
          <tbody>
            {healthChecks.map((check) => (
              <tr key={check.IDCheck} className="hover:bg-gray-50">
                <td className="border p-2">{check.IDCheck}</td>
                <td className="border p-2">
                  {new Date(check.CheckDate).toLocaleDateString()}
                </td>
                <td className="border p-2">{check.BloodPressure || "N/A"}</td>
                <td className="border p-2">{check.Weight || "N/A"}</td>
                <td className="border p-2">{check.TestResults || "N/A"}</td>
                <td className="border p-2">
                  {check.Eligible ? "Có" : "Không"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HealthCheckHistory;

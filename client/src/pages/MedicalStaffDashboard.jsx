import React, { useState } from "react";
import DonationRequestList from "../components/DonationRequestList";
import HealthCheckForm from "../components/HealthCheckForm";
import DonationHistory from "../components/DonationHistory";
import BloodInventory from "../components/BloodInventory";
import HealthCheckHistory from "../components/HealthCheckHistory";
import BloodDonationForm from "../components/BloodDonationForm";

const MedicalStaffDashboard = () => {
  const [activeTab, setActiveTab] = useState("requests");

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-64 bg-blue-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-6">Blood System</h2>
        <ul>
          <li
            className={`p-2 mb-2 cursor-pointer rounded ${
              activeTab === "requests" ? "bg-blue-600" : "hover:bg-blue-700"
            }`}
            onClick={() => setActiveTab("requests")}
          >
            Đơn Đăng Ký
          </li>
          <li
            className={`p-2 mb-2 cursor-pointer rounded ${
              activeTab === "health" ? "bg-blue-600" : "hover:bg-blue-700"
            }`}
            onClick={() => setActiveTab("health")}
          >
            Kiểm Tra Sức Khỏe
          </li>
          <li
            className={`p-2 mb-2 cursor-pointer rounded ${
              activeTab === "history" ? "bg-blue-600" : "hover:bg-blue-700"
            }`}
            onClick={() => setActiveTab("history")}
          >
            Lịch Sử Hiến Máu
          </li>
          <li
            className={`p-2 mb-2 cursor-pointer rounded ${
              activeTab === "healthHistory"
                ? "bg-blue-600"
                : "hover:bg-blue-700"
            }`}
            onClick={() => setActiveTab("healthHistory")}
          >
            Lịch Sử Kiểm Tra Sức Khỏe
          </li>
          <li
            className={`p-2 mb-2 cursor-pointer rounded ${
              activeTab === "donation" ? "bg-blue-600" : "hover:bg-blue-700"
            }`}
            onClick={() => setActiveTab("donation")}
          >
            Ghi Nhận Hiến Máu
          </li>
          <li
            className={`p-2 mb-2 cursor-pointer rounded ${
              activeTab === "inventory" ? "bg-blue-600" : "hover:bg-blue-700"
            }`}
            onClick={() => setActiveTab("inventory")}
          >
            Kho Máu
          </li>
        </ul>
      </div>

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Bảng Điều Khiển Nhân Viên Y Tế
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeTab === "requests" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <DonationRequestList onSelectRequest={() => {}} />
            </div>
          )}
          {activeTab === "health" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <HealthCheckForm />
            </div>
          )}
          {activeTab === "history" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <DonationHistory />
            </div>
          )}
          {activeTab === "healthHistory" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <HealthCheckHistory />
            </div>
          )}
          {activeTab === "donation" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <BloodDonationForm />
            </div>
          )}
          {activeTab === "inventory" && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <BloodInventory />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalStaffDashboard;

import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import { Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/", { replace: true });
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      if (user.role !== "Admin" && user.role !== "Staff") {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("❌ Lỗi khi đọc user:", err);
      navigate("/", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

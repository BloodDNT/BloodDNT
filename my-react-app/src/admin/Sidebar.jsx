import React from "react";
import { FaTachometerAlt, FaTint, FaUser, FaHospital } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "../styles/sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="logo">🩸 Blood Admin</h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/dashboard" end className={({ isActive }) => isActive ? "active" : ""}>
              <FaTachometerAlt /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/chart" className={({ isActive }) => isActive ? "active" : ""}>
              <FaTint /> Chart
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

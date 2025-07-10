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
            <NavLink to="/dashboard/blood-inventory" className={({ isActive }) => isActive ? "active" : ""}>
              <FaTint /> Blood Inventory
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/donors" className={({ isActive }) => isActive ? "active" : ""}>
              <FaUser /> Donors
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/requests" className={({ isActive }) => isActive ? "active" : ""}>
              <FaHospital /> Requests
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

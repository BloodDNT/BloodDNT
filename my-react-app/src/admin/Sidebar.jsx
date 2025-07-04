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
            <NavLink to="/" exact="true" activeclassname="active">
              <FaTachometerAlt /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/blood-inventory" activeclassname="active">
              <FaTint /> Blood Inventory
            </NavLink>
          </li>
          <li>
            <NavLink to="/donors" activeclassname="active">
              <FaUser /> Donors
            </NavLink>
          </li>
          <li>
            <NavLink to="/requests" activeclassname="active">
              <FaHospital /> Requests
            </NavLink>
          </li>
          
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

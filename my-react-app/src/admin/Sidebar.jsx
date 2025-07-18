import React, { useContext } from "react";
import { FaTachometerAlt, FaTint, FaUser, FaHospital } from "react-icons/fa";
import { FaBlog } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../styles/sidebar.css";

const Sidebar = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleGoToUser = () => {
    navigate("/");
  };

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
          <li>
            <NavLink to="/dashboard/blogs" className={({ isActive }) => isActive ? "active" : ""}>
              <FaBlog /> Blog Management
            </NavLink>
          </li>

          <li>
          <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
            <FaUser /> Back to User
          </NavLink>
          </li>
        </ul>
      </nav>

    </div>
  );
};

export default Sidebar;

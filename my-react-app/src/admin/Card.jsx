import React from "react";
import "../styles/dashboard.css";

function Card({ icon, title, value, color }) {
  return (
    <div className="card" style={{ borderLeft: `5px solid ${color}` }}>
      <div className="icon" style={{ backgroundColor: color }}>{icon}</div>
      <div className="card-info">
        <div className="card-title">{title}</div>
        <div className="card-value">{value}</div>
      </div>
    </div>
  );
}

export default Card;

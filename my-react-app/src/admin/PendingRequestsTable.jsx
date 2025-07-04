import React from "react";

const PendingRequestsTable = () => {
  return (
    <div className="inventory-table">
    <div className="table-container">
      <h2>Pending Hospital Requests</h2>
      <table>
        <thead>
          <tr>
            <th>Hospital</th>
            <th>Requested Type</th>
            <th>Units</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>District 7 Hospital</td>
            <td>B+</td>
            <td>25</td>
            <td>2025-05-29</td>
          </tr>
          <tr>
            <td>City Health Center</td>
            <td>AB-</td>
            <td>15</td>
            <td>2025-05-30</td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default PendingRequestsTable;

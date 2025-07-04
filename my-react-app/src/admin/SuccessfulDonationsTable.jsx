import React, { useEffect, useState } from "react";
import axios from "axios";

const SuccessfulDonationsTable = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/successful-donations")
      .then(res => {
        console.log("✅ Dữ liệu từ API:", res.data);
        if (Array.isArray(res.data)) {
          setDonations(res.data);
        } else {
          console.error("❌ Dữ liệu không phải mảng:", res.data);
        }
      })
      .catch(err => {
        console.error("❌ Lỗi khi gọi API Successful Donations:", err);
      });
  }, []);

  const totalVolume = donations.reduce((sum, d) => sum + parseInt(d.Pack || 0), 0);

  return (
    <div className="inventory-table">
      <h2>Successful Donations (This Month)</h2>
      <p><strong>Total Volume:</strong> {totalVolume} ml</p>
      <table>
        <thead>
          <tr>
            <th>Donor Name</th>
            <th>Date</th>
            <th>Pack (ml)</th>
          </tr>
        </thead>
        <tbody>
          {donations.length === 0 ? (
            <tr>
              <td colSpan="3">No donations this month.</td>
            </tr>
          ) : (
            donations.map((donation, index) => (
              <tr key={index}>
                <td>{donation.FullName}</td>
                <td>{new Date(donation.DonateBloodDate).toLocaleDateString()}</td>
                <td>{donation.Pack}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SuccessfulDonationsTable;

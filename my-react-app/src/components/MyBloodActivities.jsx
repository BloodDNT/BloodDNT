import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function MyBloodActivities() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return navigate('/login');

    const fetchData = async () => {
      try {
        const [donationRes, requestRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/donation-history/${user.IDUser}`),
          axios.get(`http://localhost:5000/api/blood-request/${user.IDUser}`)
        ]);
        setDonations(donationRes.data || []);
        setRequests(requestRes.data || []);
      } catch (err) {
        console.error('❌ Lỗi lấy dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="activities-page">
      <h2>🩸 Danh sách hiến máu</h2>
      {donations.length === 0 ? <p>Chưa có hiến máu nào.</p> : (
        <ul>
          {donations.map(d => (
            <li key={d.IDRegister}>
              Ngày: {new Date(d.DonateBloodDate).toLocaleDateString('vi-VN')} - Nhóm: {d.BloodTypeName}
            </li>
          ))}
        </ul>
      )}

      <h2>🆘 Danh sách yêu cầu máu</h2>
      {requests.length === 0 ? <p>Không có yêu cầu máu nào.</p> : (
        <ul>
          {requests.map(r => (
            <li key={r.IDRequest}>
              Ngày yêu cầu: {new Date(r.RequestDate).toLocaleDateString('vi-VN')} - Mức độ: {r.EmergencyLevel}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

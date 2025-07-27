import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import './NotificationPage.css';

export default function NotificationPage() {
  const { user } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);

  // Phân trang
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (user?.IDUser) {
      axios.get(`http://localhost:5000/api/notifications/${user.IDUser}`)
        .then(res => setNotifications(res.data))
        .catch(err => console.error("Lỗi lấy thông báo:", err));
    }
  }, [user?.IDUser]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/read/${id}`);
      setNotifications(prev =>
        prev.map(n => n.IDNotification === id ? { ...n, Status: 'Read' } : n)
      );
    } catch (err) {
      console.error("Lỗi cập nhật thông báo:", err);
    }
  };

  // Phân trang dữ liệu
  const totalPages = Math.ceil(notifications.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = notifications.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="notification-page">
      <h2 className="title">🔔 Thông báo của bạn</h2>

      {notifications.length === 0 ? (
        <p>Không có thông báo nào.</p>
      ) : (
        <div className="table-area">
          <table className="table-custom">
            <thead>
              <tr>
                <th>#</th>
                <th>Loại</th>       
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
  {currentData.map((notif, index) => (
    <tr key={notif.IDNotification} className={notif.Status === 'Unread' ? 'unread-row' : ''}>
      <td>{startIdx + index + 1}</td>
      <td>{notif.Type}</td>
      <td>{new Date(notif.SendDate).toLocaleString('vi-VN')}</td>
      <td>
        {notif.Status === 'Unread' ? (
          <span
            className="clickable-status"
            onClick={() => markAsRead(notif.IDNotification)}
          >
            ❌Chưa đọc
          </span>
        ) : (
          <span className="read-status">✔️Đã đọc</span>
        )}
      </td>
    </tr>
  ))}
</tbody>

          </table>

          {/* Nút phân trang */}
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ⬅️ Trước
            </button>
            <span>Trang {currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Sau ➡️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import './NotificationPage.css';

export default function NotificationPage() {
  const { user } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);

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

  return (
    <div className="notification-page">
      <h2>🔔 Thông báo</h2>
      {notifications.length === 0 ? (
        <p>Không có thông báo.</p>
      ) : (
        <ul className="notification-list">
          {notifications.map(notif => (
            <li key={notif.IDNotification} className={notif.Status === 'Unread' ? 'unread' : 'read'}>
              <p><strong>{notif.Type}:</strong> {notif.Message}</p>
              <p className="date">{notif.SendDate}</p>
              {notif.Status === 'Unread' && (
                <button onClick={() => markAsRead(notif.IDNotification)}>Đánh dấu đã đọc</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './NotificationPage.css';

export default function NotificationPage() {
  const { user, logout } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

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

  const markAllAsRead = async () => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/read-all/${user.IDUser}`);
      setNotifications(prev => prev.map(n => ({ ...n, Status: 'Read' })));
    } catch (err) {
      console.error("Lỗi đánh dấu tất cả đã đọc:", err);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchType = typeFilter === 'All' || notif.Type === typeFilter;
    const matchStatus = statusFilter === 'All' || notif.Status === statusFilter;
    return matchType && matchStatus;
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout-wrapper">
      {/* HEADER */}
      <header className='header'>
        <div className='logo'>
          <Link to="/"><img src='/LogoPage.jpg' alt='Logo' /></Link>
          <div className='webname'>Hope Donnor🩸</div>
        </div>

        <nav className='menu'>
          <Link to='/bloodguide'>Blood Guide</Link>
          <div className='dropdown'>
            <Link to='/bloodknowledge' className='dropbtn'>Blood</Link>
          </div>
          <Link to='/news'>News & Events</Link>
          <Link to='/contact'>Contact</Link>
          <Link to='/about'>About Us</Link>
        </nav>

        <div className='actions'>
          {!user ? (
            <Link to='/login'><button className='login-btn'>👤 Login</button></Link>
          ) : (
            <div className="dropdown user-menu"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              <div className="dropbtn user-name">
                Xin chào, {user?.fullName || "User"} <span className="ml-2">▼</span>
              </div>
              {isOpen && (
                <div className="dropdown-content user-dropdown">
                  <Link to='/register/request-blood'>Register/Request</Link>
                  <Link to='/my-activities'>List res/req</Link>
                  <Link to='/history'>DonatationHistory</Link>
                  <Link to="/profile">👤UserProfile</Link>
                  {user?.role === 'Admin' && <Link to="/dashboard">🛠️Path to admin</Link>}
                  <Link to="/notifications">🔔Notification</Link>
                  <button className="logout-btn" onClick={handleLogout}>🚪Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* MAIN */}
      <main>
        <section className="notification-page">
          <h2>🔔 Thông báo</h2>

          <div className="filter-section">
            <label>
              Loại:
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="All">Tất cả</option>
                <option value="Nhắc nhở">Nhắc nhở</option>
                <option value="Cảnh báo">Cảnh báo</option>
                <option value="Thông báo hệ thống">Thông báo hệ thống</option>
              </select>
            </label>

            <label>
              Trạng thái:
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="All">Tất cả</option>
                <option value="Unread">Chưa đọc</option>
                <option value="Read">Đã đọc</option>
              </select>
            </label>

           
          </div>

          {filteredNotifications.length === 0 ? (
            <p>Không có thông báo phù hợp.</p>
          ) : (
            <ul className="notification-list">
              {filteredNotifications.map(notif => (
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
        </section>
      </main>

      {/* FOOTER */}
      <footer className="main-footer">
        <div className='footer-container'>
          <div className='footer-block location'>
            <h3>📍 Địa điểm</h3>
            <p>Trung tâm Hiến máu, Đại học FPT, Q9, TP.HCM</p>
          </div>
          <div className='footer-block hotline'>
            <h3>📞 Hotline</h3>
            <p>+84 123 456 789</p>
            <p>+84 123 456 987</p>
          </div>
          <div className='footer-block social-media'>
            <h3>🌐 Theo dõi chúng tôi</h3>
            <ul>
              <li><a href='https://facebook.com' target='_blank' rel='noreferrer'>Facebook</a></li>
              <li><a href='https://instagram.com' target='_blank' rel='noreferrer'>Instagram</a></li>
              <li><a href='https://twitter.com' target='_blank' rel='noreferrer'>Twitter</a></li>
            </ul>
          </div>
        </div>
        <p className='footer-copy'>© 2025 HopeDonor. All rights reserved.</p>
      </footer>
    </div>
  );
}

import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserActivityPage.css';

export default function UserActivityPage() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!user?.IDUser) return;

    axios
      .get(`http://localhost:5000/api/user-activities/${user.IDUser}`)
      .then((res) => {
        setDonations(res.data.donations || []);
        setRequests(res.data.requests || []);
      })
      .catch((err) => {
        console.error('❌ Lỗi lấy hoạt động:', err);
      });
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCancel = async (id) => {
    const confirm = window.confirm('Bạn có chắc muốn huỷ đơn này?');
    if (!confirm) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/blood-donations/${id}`,
        { Status: 'Cancelled' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Đã huỷ đơn!');
      setDonations((prev) =>
        prev.map((d) => (d.IDRegister === id ? { ...d, Status: 'Cancelled' } : d))
      );
    } catch (err) {
      alert('❌ Huỷ đơn thất bại!');
      console.error(err);
    }
  };

  const handleCancelRequest = async (id) => {
    const confirm = window.confirm('Bạn có chắc muốn huỷ đơn yêu cầu này?');
    if (!confirm) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/blood-requests/${id}`,
        { Status: 'Cancelled' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Đã huỷ đơn yêu cầu!');
      setRequests((prev) =>
        prev.map((r) => (r.IDRequest === id ? { ...r, Status: 'Cancelled' } : r))
      );
    } catch (err) {
      alert('❌ Huỷ đơn thất bại!');
      console.error(err);
    }
  };

  return (
    <div className="layout-wrapper">
      <header className="header">
        <div className="logo">
          <Link to="/">
            <img src="/LogoPage.jpg" alt="Logo" />
          </Link>
          <div className="webname">Hope Donnor🩸</div>
        </div>
        <nav className="menu">
          <Link to="/bloodguide">Blood Guide</Link>
          <div className="dropdown">
            <Link to="/blood" className="dropbtn">
              Blood ▼
            </Link>
            <div className="dropdown-content">
              <Link to="/blood/type">Type</Link>
              <Link to="/blood/red-cells">Red Cells</Link>
              <Link to="/blood/plasma">Plasma</Link>
              <Link to="/blood/white-cells">White Cells</Link>
              <Link to="/blood/knowledge">Blood Knowledge</Link>
            </div>
          </div>
          <Link to="/register/request-blood">Register/Request-Blood</Link>
          <Link to="/history">DonatationHistory</Link>
          <Link to="/news">News & Events</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/about">About Us</Link>
        </nav>
        <div className="actions">
          {!user ? (
            <Link to="/login">
              <button className="login-btn">👤 Login</button>
            </Link>
          ) : (
            <div
              className="dropdown user-menu"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              <div className="dropbtn user-name">
                Xin chào, {user?.fullName || user?.name || 'User'}{' '}
                <span className="ml-2">▼</span>
              </div>
              {isOpen && (
                <div className="dropdown-content user-dropdown">
                  <Link to="/profile">👤 Thông tin cá nhân</Link>
                  <Link to="/notifications">🔔 Thông báo</Link>
                  <button className="logout-btn" onClick={handleLogout}>
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <main>
        <section className="activity-page">
          <h2>📋 Lịch sử hoạt động của bạn</h2>

          <div className="activity-section">
            <h3>🩸 Đơn Đăng Ký Hiến Máu</h3>
            {donations.length === 0 ? (
              <p>Không có đơn nào.</p>
            ) : (
              <div className="donation-list">
                <div className="donation-header">
                  <span>Mã đơn</span>
                  <span>Trạng thái</span>
                  <span>Hành động</span>
                </div>
                {donations.map((d) => (
                  <div className="donation-row" key={d.IDRegister}>
                    <span>#{d.IDRegister}</span>
                    <span>{d.Status}</span>
                    <span className="action-buttons">
                      <button
                        onClick={() => navigate(`/donation/${d.IDRegister}`)}
                        className="view-btn"
                      >
                        Xem chi tiết
                      </button>
                      {d.Status !== 'Cancelled' && (
                        <>
                          <button
                            onClick={() => navigate(`/donation/edit/${d.IDRegister}`)}
                            className="edit-btn"
                          >
                            Chỉnh sửa
                          </button>
                          <button
                            onClick={() => handleCancel(d.IDRegister)}
                            className="cancel-btn"
                          >
                            Huỷ đơn
                          </button>
                        </>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="activity-section">
            <h3>🧾 Đơn Yêu Cầu Nhận Máu</h3>
            {requests.length === 0 ? (
              <p>Không có đơn nào.</p>
            ) : (
              <div className="donation-list">
                <div className="donation-header">
                  <span>Mã đơn</span>
                  <span>Trạng thái</span>
                  <span>Hành động</span>
                </div>
                {requests.map((r) => (
                  <div className="donation-row" key={r.IDRequest}>
                    <span>#{r.IDRequest}</span>
                    <span>{r.Status}</span>
                    <span className="action-buttons">
                      <button
                        onClick={() => navigate(`/request/${r.IDRequest}`)}
                        className="view-btn"
                      >
                        Xem chi tiết
                      </button>
                      {r.Status !== 'Cancelled' && (
                        <>
                          <button
                            onClick={() => navigate(`/request/edit/${r.IDRequest}`)}
                            className="edit-btn"
                          >
                            Chỉnh sửa
                          </button>
                          <button
                            onClick={() => handleCancelRequest(r.IDRequest)}
                            className="cancel-btn"
                          >
                            Huỷ đơn
                          </button>
                        </>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <section className="footer">
        <div className="footer-container">
          <div className="footer-block location">
            <h3>📍 Location</h3>
            <p>Blood Donation Center, FPT University, Q9, TP.HCM</p>
          </div>
          <div className="footer-block hotline">
            <h3>📞 Hotline</h3>
            <p>+84 123 456 789</p>
            <p>+84 123 456 987</p>
          </div>
          <div className="footer-block social-media">
            <h3>🌐 Follow Us</h3>
            <ul>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noreferrer">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="footer-copy">© 2025 HopeDonor. All rights reserved.</p>
      </section>
    </div>
  );
}

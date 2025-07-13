import React, { useState, useEffect, useContext } from 'react';
import './DonationHistoryPage.css';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';

export default function DonationHistoryPage() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user?.IDUser) return;

    const fetchDonationHistory = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/donation-history/${user.IDUser}`);
        if (Array.isArray(res.data)) {
          setHistory(res.data);
        } else {
          console.warn('Dữ liệu không đúng định dạng:', res.data);
          setHistory([]);
        }
      } catch (error) {
        console.error('Lỗi khi lấy lịch sử:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonationHistory();
  }, [user?.IDUser]);

  return (
    <>
      <header className='header'>
        <div className='logo'>
          <Link to="/">
            <img src='/LogoPage.jpg' alt='Logo' loading="lazy" />
          </Link>
          <div className='webname'>Hope Donor 🩸</div>
        </div>

        <nav className='menu'>
          <Link to='/bloodguide'>Blood Guide</Link>
          <div className='dropdown'>
            <Link to='/blood' className='dropbtn'>Blood ▼</Link>
            <div className='dropdown-content'>
              <Link to='/blood/type'>Blood Type</Link>
              <Link to='/blood/red-cells'>Red Cells</Link>
              <Link to='/blood/plasma'>Plasma</Link>
              <Link to='/blood/white-cells'>White Cells</Link>
              <Link to='/blood/knowledge'>Blood Knowledge</Link>
            </div>
          </div>
          <Link to='/register/request-blood'>Register/Request-Blood</Link>
          <Link to='/history'>Donation History</Link>
          <Link to='/news'>News & Events</Link>
          <Link to='/contact'>Contact</Link>
          <Link to='/about'>About Us</Link>
        </nav>

        <div className='actions'>
          {!user ? (
            <Link to='/login'><button className='login-btn'>👤 Login</button></Link>
          ) : (
            <div className="dropdown user-menu" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
              <div className="dropbtn user-name">
                Xin chào, {user?.FullName || user?.fullName || user?.name || 'User'} <span className="ml-2">▼</span>
              </div>
              {isOpen && (
                <div className="dropdown-content user-dropdown">
                  <Link to="/profile">👤 Thông tin cá nhân</Link>
                  <Link to="/notifications">🔔 Thông báo</Link>
                  <button className="logout-btn" onClick={() => { logout(); navigate('/login'); }}>🚪 Đăng xuất</button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <main className='donation-history-page'>
        <h2>Lịch sử hiến máu của bạn</h2>
        {loading ? (
          <div className='loading'>Đang tải dữ liệu...</div>
        ) : history.length === 0 ? (
          <div className='no-data'>Chưa có lịch sử hiến máu.</div>
        ) : (
          <div className='donation-list'>
            {history.map((item) => (
              <div className='donation-item' key={item.IDRegister}>
                <p><strong>Ngày hiến máu:</strong> {new Date(item.DonateBloodDate).toLocaleDateString('vi-VN')}</p>
                <p><strong>Nhóm máu:</strong> {item.BloodTypeName || item.IDBlood}</p>
                <p><strong>CMND/CCCD:</strong> {item.IdentificationNumber}</p>
                <p><strong>Ghi chú:</strong> {item.Note || 'Không có'}</p>
                <p><strong>Trạng thái:</strong> <span className={`donation-status ${item.Status?.toLowerCase() || 'unknown'}`}>{item.Status}</span></p>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className='footer'>
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
    </>
  );
}

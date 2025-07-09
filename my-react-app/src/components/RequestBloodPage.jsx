import React, { useContext, useState } from 'react';
import './homepage.css';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';

export default function Home() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDonateClick = () => {
    navigate('/register-donation');
  };

  const handleRequestClick = () => {
    navigate('/request-blood');
  };

  return (
    <>
      <header className='header'>
        <div className='logo'>
          <Link to="/">
            <img src='/LogoPage.jpg' alt='Logo' />
          </Link>
          <div className='webname'>Hope Donnor🩸</div>
        </div>
        <nav className='menu'>
          <Link to='/bloodguide'>Blood Guide</Link>
          <div className='dropdown'>
            <Link to='/blood' className='dropbtn'>Blood ▼</Link>
            <div className='dropdown-content'>
              <Link to='/blood/type'>Type</Link>
              <Link to='/blood/red-cells'>Red Cells</Link>
              <Link to='/blood/plasma'>Plasma</Link>
              <Link to='/blood/white-cells'>White Cells</Link>
              <Link to='/blood/knowledge'>Blood Knowledge</Link>
            </div>
          </div>
          <Link to='/register/request-blood'>Register/Request-Blood</Link>
          <Link to='/news'>News & Events</Link>
          <Link to='/contact'>Contact</Link>
          <Link to='/about'>About Us</Link>
        </nav>
        <div className='actions'>
          {!user ? (
            <Link to='/login'>
              <button className='login-btn'>👤 Login</button>
            </Link>
          ) : (
            <div 
              className="dropdown user-menu"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              <div className="dropbtn user-name">
                Xin chào, {user?.FullName || user?.fullName || user?.name || "User"} <span className="ml-2">▼</span>
              </div>
              {isOpen && (
                <div className="dropdown-content user-dropdown">
                  <Link to="/profile">👤 Thông tin cá nhân</Link>
                  <Link to="/notifications">🔔 Thông báo</Link>
                  <button
                    className="logout-btn"
                    onClick={handleLogout}
                  >
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header> 

      {user && (
        <section className='overview-section personal-info'>
          <h2>🧑 Thông Tin Người Dùng</h2>
          <ul>
            <li><strong>Họ tên:</strong> {user?.FullName || user?.fullName || user?.name || "Chưa đăng nhập"}</li>
            <li><strong>Email:</strong> {user?.email || "Không có thông tin"}</li>
            <li><strong>Số điện thoại:</strong> {user.phoneNumber || "Không có thông tin"}</li>
            <li><strong>Ngày sinh:</strong> {user.dateOfBirth || "Không có thông tin"}</li>
            <li><strong>Giới tính:</strong> {user?.gender || "Không có thông tin"}</li>
            <li><strong>Nhóm máu:</strong> {user?.bloodType || "Chưa cập nhật"}</li>
            <li><strong>Địa chỉ:</strong> {user?.address || "Không có thông tin"}</li>
          </ul>

          <div className="btn-group">
            <button className="btn-action donate" onClick={handleDonateClick}>🩸 Đăng ký hiến máu</button>
            <button className="btn-action request" onClick={handleRequestClick}>❤️ Yêu cầu nhận máu</button>
          </div>
        </section>
      )}

      <section className='footer'>
        <div className='footer-container'>
          <div className='footer-block location'>
            <h3>📍 Location</h3>
            <p>Blood Donation Center, FPT University, Q9, TP.HCM</p>
          </div>
          <div className='footer-block hotline'>
            <h3>📞 Hotline</h3>
            <p>+84 123 456 789</p>
            <p>+84 123 456 987</p>
          </div>
          <div className='footer-block social-media'>
            <h3>🌐 Follow Us</h3>
            <ul>
              <li><a href='https://facebook.com' target='_blank' rel='noreferrer'>Facebook</a></li> 
              <li><a href='https://instagram.com' target='_blank' rel='noreferrer'>Instagram</a></li>
              <li><a href='https://twitter.com' target='_blank' rel='noreferrer'>Twitter</a></li>
            </ul>
          </div>
        </div>
        <p className='footer-copy'>© 2025 HopeDonor. All rights reserved.</p>
      </section>
    </>
  );
}

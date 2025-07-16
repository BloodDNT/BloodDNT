import React, { useContext, useState, useEffect } from 'react';
import './requestBlood.css';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import axios from 'axios';

const getBloodID = (bloodType) => {
  const map = {
    'A+': 1, 'A-': 2,
    'B+': 3, 'B-': 4,
    'AB+': 5, 'AB-': 6,
    'O+': 7, 'O-': 8
  };
  return map[bloodType] || 1;
};

const getComponentID = (componentName) => {
  const map = {
    'Hồng cầu': 1,
    'Tiểu cầu': 2,
    'Huyết tương tươi đông lạnh': 3,
    'Bạch cầu': 4,
    'Toàn phần': 5
  };
  return map[componentName] || 1;
};

const getDefaultQuantity = (componentName) => {
  const defaultMap = {
    'Hồng cầu': 250,
    'Tiểu cầu': 250,
    'Huyết tương tươi đông lạnh': 200,
    'Bạch cầu': 50,
    'Toàn phần': 450
  };
  return defaultMap[componentName] || '';
};

export default function RequestBlood() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    IDComponents: '',
    IDBlood: '',
    Quantity: '',
    UrgencyLevel: '',
    IdentificationNumber: '',
    RequestDate: ''
  });
  const [qrImage, setQrImage] = useState('');

  useEffect(() => {
    console.log("👤 User:", user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'IDComponents') {
      const defaultQty = getDefaultQuantity(value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        Quantity: defaultQty
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      IDComponents: parseInt(getComponentID(formData.IDComponents)),
      IDBlood: parseInt(getBloodID(formData.IDBlood)),
      Quantity: parseInt(formData.Quantity),
      UrgencyLevel: formData.UrgencyLevel,
      IdentificationNumber: formData.IdentificationNumber,
      RequestDate: formData.RequestDate
    };

    console.log("📦 Payload gửi:", payload);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Bạn chưa đăng nhập. Vui lòng đăng nhập trước khi gửi yêu cầu.');
        return navigate('/login');
      }

      const res = await axios.post(
        'http://localhost:5000/api/blood-requests',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true
        }
      );

      alert('🩸 Gửi yêu cầu thành công!');
      setQrImage(res.data.data?.QRCode);
    } catch (err) {
      console.error('❌ Lỗi khi gửi yêu cầu:', err);
      const msg = err.response?.data?.message || err.response?.data?.error || 'Lỗi không xác định';
      alert(msg);
    }
  };

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);
  const formatDate = (date) => date.toISOString().split('T')[0];
  const minDateStr = formatDate(today);
  const maxDateStr = formatDate(maxDate);

  return (
    <div className="layout-wrapper">
      <header className="main-header">
        <div className='logo'>
          <Link to="/"><img src='/LogoPage.jpg' alt='Logo' loading="lazy" /></Link>
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
          <Link to='/history'>DonationHistory</Link>
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

      <main>
        <section className='form-section'>
          <h2>🆘 Gửi Yêu Cầu Nhận Máu</h2>
          <form onSubmit={handleSubmit} className="blood-request-form">
            <select name="IDComponents" required onChange={handleChange} value={formData.IDComponents}>
              <option value="">-- Chọn thành phần máu --</option>
              <option value="Hồng cầu">Hồng cầu</option>
              <option value="Tiểu cầu">Tiểu cầu</option>
              <option value="Huyết tương tươi đông lạnh">Huyết tương tươi đông lạnh</option>
              <option value="Bạch cầu">Bạch cầu</option>
              <option value="Toàn phần">Toàn phần</option>
            </select>

            <select name="IDBlood" required onChange={handleChange} value={formData.IDBlood}>
              <option value="">-- Chọn nhóm máu --</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>

            <input
              name="Quantity"
              type="number"
              value={formData.Quantity}
              placeholder={
                !formData.IDComponents
                  ? 'Số lượng'
                  : formData.IDComponents === 'Hồng cầu'
                  ? 'Số lượng (đơn vị)'
                  : 'Số lượng (ml)'
              }
              required
              onChange={handleChange}
            />

            <select name="UrgencyLevel" required onChange={handleChange} value={formData.UrgencyLevel}>
              <option value="">-- Mức độ khẩn cấp --</option>
              <option value="Urgent">Urgent</option>
              <option value="Normal">Normal</option>
            </select>

            <input
              name="IdentificationNumber"
              type="text"
              placeholder="Số CCCD người nhận"
              required
              value={formData.IdentificationNumber}
              onChange={handleChange}
            />

            <input
              name="RequestDate"
              type="date"
              required
              value={formData.RequestDate}
              onChange={handleChange}
              min={minDateStr}
              max={maxDateStr}
            />

            <button type="submit">📩 Gửi Yêu Cầu</button>
          </form>

          {qrImage && (
            <div className="qr-preview">
              <h3>📷 Mã QR Yêu Cầu:</h3>
              <img src={qrImage} alt="QR yêu cầu máu" />
            </div>
          )}
        </section>
      </main>

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

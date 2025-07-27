import React, { useContext, useState, useCallback } from 'react';
import './registerBlood.css';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import UserInfoTable from '../UserTable/UserInfoTable.jsx';
import UserActivityPage from './UserActivityPage.jsx';
import NotificationPage from './NotificationPage.jsx';
import BloodDonation from './BloodDonation.jsx';
import RequestBlood from './RequestBlood.jsx';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Home() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);

  const [form, setForm] = useState({
    donateBloodDate: '',
    bloodType: '',
    identificationNumber: '',
    note: '',
    bloodPressure: '',
    weight: '',
    medicalHistory: ''
  });

  const [formRequest, setFormRequest] = useState({
    IDComponents: '',
    IDBlood: '',
    Quantity: '',
    UrgencyLevel: '',
    IdentificationNumber: '',
    RequestDate: ''
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDonateClick = () => {
    setShowForm(true);
  };

  const handleRequestClick = () => {
    setShowRequestForm(true);
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleRequestChange = (e) => {
    const { name, value } = e.target;
    setFormRequest((prev) => ({ ...prev, [name]: value }));
  };

  const getBloodID = (bloodType) => {
    const map = {
      'A+': 1, 'A-': 2, 'B+': 3, 'B-': 4,
      'AB+': 5, 'AB-': 6, 'O+': 7, 'O-': 8
    };
    return map[bloodType] || 1;
  };

  const getComponentID = (component) => {
    const map = {
      'Hồng cầu': 1, 'Tiểu cầu': 2,
      'Huyết tương tươi đông lạnh': 3, 'Bạch cầu': 4, 'Toàn phần': 5
    };
    return map[component] || 1;
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const storedUser = user || JSON.parse(localStorage.getItem('user'));
    if (!storedUser?.IDUser) return Swal.fire('Bạn chưa đăng nhập');

    try {
      await axios.post('http://localhost:5000/api/blood-donations/register-blood', {
        IDUser: storedUser.IDUser,
        DonateBloodDate: form.donateBloodDate,
        IDBlood: getBloodID(form.bloodType),
        IdentificationNumber: form.identificationNumber,
        Note: form.note,
        BloodPressure: form.bloodPressure,
        Weight: parseFloat(form.weight),
        MedicalHistory: form.medicalHistory
      });

      Swal.fire('Đăng ký thành công!');
      setForm({
        donateBloodDate: '', bloodType: '', identificationNumber: '',
        note: '', bloodPressure: '', weight: '', medicalHistory: ''
      });
      setShowForm(false);
    } catch (err) {
      console.error('❌ Lỗi:', err);
      Swal.fire(err?.response?.data?.error || 'Đăng ký thất bại');
    }
  }, [form, user]);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Lấy JWT từ localStorage
  
    if (!token) return Swal.fire('Bạn chưa đăng nhập');
  
    try {
      await axios.post(
        'http://localhost:5000/api/request-blood',
        {
          IDComponents: getComponentID(formRequest.IDComponents),
          IDBlood: getBloodID(formRequest.IDBlood),
          Quantity: parseInt(formRequest.Quantity),
          UrgencyLevel: formRequest.UrgencyLevel,
          IdentificationNumber: formRequest.IdentificationNumber,
          RequestDate: formRequest.RequestDate
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      Swal.fire('Gửi yêu cầu thành công!');
  
      // ✅ Reset và đóng form
      setFormRequest({
        IDComponents: '',
        IDBlood: '',
        Quantity: '',
        UrgencyLevel: '',
        IdentificationNumber: '',
        RequestDate: ''
      });
  
      setShowRequestForm(false); // <-- đảm bảo đóng form sau khi gửi thành công
    } catch (err) {
      console.error('❌ Lỗi:', err);
      Swal.fire(err?.response?.data?.error || 'Gửi yêu cầu thất bại');
    }
  };
  

  return (
    <div className="layout-wrapper">
      <header className='header'>
        <div className='logo'>
          <Link to="/"><img src='/LogoPage.jpg' alt='Logo' /></Link>
          <div className='webname'>Hope Donnor🩸</div>
        </div>
        <nav className='menu'>
          <Link to='/bloodguide'>Blood Guide</Link>
          <Link to='/bloodknowledge'>Blood</Link>
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
              onMouseLeave={() => setIsOpen(false)}>
              <div className="dropbtn user-name">
                Xin chào, {user?.fullName || user?.name || "User"} <span>▼</span>
              </div>
              {isOpen && (
                <div className="dropdown-content user-dropdown">
                  <Link to='/register/request-blood'>Register/Request-Blood</Link>
                  <Link to="/profile">👤 Thông tin cá nhân</Link>
                  <button className="logout-btn" onClick={handleLogout}>🚪 Đăng xuất</button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <main>
        {user && (
          <section className="overview-grid">
            <div className="left-panel">
              <h2>🧑 Thông Tin Người Dùng</h2>
              <UserInfoTable user={user} />
              <NotificationPage />
            </div>

            <div className="right-panel">
              <div className="btn-group">
                <button className="btn-action donate" onClick={handleDonateClick}>🩸 Đăng ký hiến máu</button>
                <button className="btn-action request" onClick={handleRequestClick}>🆘 Đơn yêu cầu máu</button>
              </div>
              <h2>📜 Lịch Sử Hiến Máu</h2>
              <UserActivityPage showOnly="history" />
            </div>
          </section>
        )}
      </main>

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

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>🩸 Đăng ký hiến máu & khai báo sức khỏe</h2>
            <BloodDonation
              form={form}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
            <button className="close-btn" onClick={() => setShowForm(false)}>Đóng</button>
          </div>
        </div>
      )}

      {showRequestForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>🆘 Gửi yêu cầu máu</h2>
            <RequestBlood
              form={formRequest}
              onChange={handleRequestChange}
              onSubmit={handleRequestSubmit}
            />
            <button className="close-btn" onClick={() => setShowRequestForm(false)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
}

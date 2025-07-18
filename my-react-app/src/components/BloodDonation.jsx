import React, { useState, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import './BloodDonation.css';

const RegistrationForm = React.memo(({ form, onChange, onSubmit }) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!form.donateBloodDate) newErrors.donateBloodDate = 'Ngày hiến máu là bắt buộc';
    if (!form.bloodType) newErrors.bloodType = 'Nhóm máu là bắt buộc';
    if (!form.identificationNumber || !/^[0-9]{9,12}$/.test(form.identificationNumber)) {
      newErrors.identificationNumber = 'CMND/CCCD phải từ 9–12 chữ số';
    }
    if (!form.bloodPressure) newErrors.bloodPressure = 'Huyết áp bắt buộc';
    if (!form.weight || isNaN(form.weight)) newErrors.weight = 'Cân nặng bắt buộc và phải là số';

    const year = new Date(form.donateBloodDate).getFullYear();
    const currentYear = new Date().getFullYear();
    if (year !== currentYear) {
      newErrors.donateBloodDate = `Vui lòng chọn ngày trong năm ${currentYear}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <form className='register-form' onSubmit={handleSubmit}>
      <div className='form-group'>
        <input
          type='date'
          name='donateBloodDate'
          value={form.donateBloodDate}
          onChange={onChange}
          min={`${currentYear}-01-01`}
          max={`${currentYear}-12-31`}
        />
        {errors.donateBloodDate && <span className='error'>{errors.donateBloodDate}</span>}
      </div>

      <div className='form-group'>
        <select name='bloodType' value={form.bloodType} onChange={onChange}>
          <option value=''>Chọn nhóm máu</option>
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.bloodType && <span className='error'>{errors.bloodType}</span>}
      </div>

      <div className='form-group'>
        <input
          type='text'
          name='identificationNumber'
          value={form.identificationNumber}
          onChange={onChange}
          placeholder='CMND/CCCD'
        />
        {errors.identificationNumber && <span className='error'>{errors.identificationNumber}</span>}
      </div>

      <div className='form-group'>
        <input
          type='text'
          name='bloodPressure'
          value={form.bloodPressure}
          onChange={onChange}
          placeholder='Huyết áp (ví dụ: 120/80)'
        />
        {errors.bloodPressure && <span className='error'>{errors.bloodPressure}</span>}
      </div>

      <div className='form-group'>
        <input
          type='number'
          name='weight'
          value={form.weight}
          onChange={onChange}
          placeholder='Cân nặng (kg)'
        />
        {errors.weight && <span className='error'>{errors.weight}</span>}
      </div>

      <div className='form-group'>
        <textarea
          name='medicalHistory'
          value={form.medicalHistory}
          onChange={onChange}
          placeholder='Tiền sử bệnh (nếu có)'
        />
      </div>

      <div className='form-group'>
        <textarea
          name='note'
          value={form.note}
          onChange={onChange}
          placeholder='Ghi chú thêm (nếu có)'
        />
      </div>

      <button type='submit' className='submit-btn'>Đăng ký</button>
    </form>
  );
});

const getBloodID = (bloodType) => {
  const map = {
    'A+': 1, 'A-': 2, 'B+': 3, 'B-': 4,
    'AB+': 5, 'AB-': 6, 'O+': 7, 'O-': 8
  };
  return map[bloodType] || 1;
};

export default function BloodDonationPage() {
  const [form, setForm] = useState({
    donateBloodDate: '',
    bloodType: '',
    identificationNumber: '',
    note: '',
    bloodPressure: '',
    weight: '',
    medicalHistory: ''
  });
  const [qrCode, setQrCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => logout();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const storedUser = user || JSON.parse(localStorage.getItem('user'));
    if (!storedUser?.IDUser) return alert('Bạn chưa đăng nhập');

    try {
      setIsLoading(true);
      const res = await axios.post('http://localhost:5000/api/blood-donations/register-blood', {
        IDUser: storedUser.IDUser,
        DonateBloodDate: form.donateBloodDate,
        IDBlood: getBloodID(form.bloodType),
        IdentificationNumber: form.identificationNumber,
        Note: form.note,
        // Phần khai báo sức khỏe
        BloodPressure: form.bloodPressure,
        Weight: parseFloat(form.weight),
        MedicalHistory: form.medicalHistory
      });

      alert('Đăng ký thành công!');
      setQrCode(res.data.data.QRCode);
      setForm({
        donateBloodDate: '', bloodType: '', identificationNumber: '',
        note: '', bloodPressure: '', weight: '', medicalHistory: ''
      });
    } catch (err) {
      console.error('❌ Lỗi:', err);
      alert(err?.response?.data?.error || 'Đăng ký thất bại');
    } finally {
      setIsLoading(false);
    }
  }, [form, user]);

  return (
    <>
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
                Xin chào, {user?.fullName || "User"} <span>▼</span>
              </div>
              {isOpen && (
                <div className="dropdown-content user-dropdown">
                  <Link to='/register/request-blood'>Đăng ký/Yêu cầu máu</Link>
                  <Link to='/my-activities'>Hoạt động</Link>
                  <Link to='/history'>Lịch sử hiến</Link>
                  <Link to='/profile'>👤 Hồ sơ</Link>
                  <Link to='/notifications'>🔔 Thông báo</Link>
                  <button className="logout-btn" onClick={handleLogout}>🚪 Đăng xuất</button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <main className='body'>
        <section className='register-section'>
          <h2>Đăng ký hiến máu & khai báo sức khỏe</h2>
          <RegistrationForm
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
          {isLoading && <p>Đang xử lý...</p>}
          {qrCode && (
            <div className='qr-preview'>
              <h3>Mã QR của bạn</h3>
              <img src={qrCode} alt='QR Code' />
            </div>
          )}
        </section>
      </main>

      <footer className='footer'>
        <div className='footer-container'>
          <div className='footer-block location'>
            <h3>📍 Địa điểm</h3>
            <p>Trung tâm Hiến máu, ĐH FPT, Q9, TP.HCM</p>
          </div>
          <div className='footer-block hotline'>
            <h3>📞 Hotline</h3>
            <p>+84 123 456 789</p>
          </div>
          <div className='footer-block social-media'>
            <h3>🌐 Theo dõi</h3>
            <a href='https://facebook.com' target='_blank' rel='noreferrer'>Facebook</a>
          </div>
        </div>
        <p className='footer-copy'>© 2025 HopeDonor. All rights reserved.</p>
      </footer>
    </>
  );
}

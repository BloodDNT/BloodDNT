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
      newErrors.identificationNumber = 'CMND/CCCD phải là số từ 9-12 chữ số';
    }

    const selectedYear = new Date(form.donateBloodDate).getFullYear();
    const currentYear = new Date().getFullYear();
    if (selectedYear !== currentYear) {
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
          required
          min={`${currentYear}-01-01`}
          max={`${currentYear}-12-31`}
        />
        {errors.donateBloodDate && <span className='error'>{errors.donateBloodDate}</span>}
      </div>

      <div className='form-group'>
        <select name='bloodType' value={form.bloodType} onChange={onChange} required>
          <option value='' disabled>Chọn nhóm máu</option>
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
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
          required
        />
        {errors.identificationNumber && <span className='error'>{errors.identificationNumber}</span>}
      </div>

      <div className='form-group'>
        <textarea
          name='note'
          value={form.note}
          onChange={onChange}
          placeholder='Ghi chú (không bắt buộc)'
        />
      </div>

      <button type='submit' className='submit-btn'>Đăng ký</button>
    </form>
  );
});

const getBloodID = (bloodType) => {
  const map = {
    'A+': 1, 'A-': 2,
    'B+': 3, 'B-': 4,
    'AB+': 5, 'AB-': 6,
    'O+': 7, 'O-': 8
  };
  return map[bloodType] || 1;
};

export default function BloodDonationPage() {

  const [registerForm, setRegisterForm] = useState({
    donateBloodDate: '',
    bloodType: '',
    identificationNumber: '',
    note: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const { user, logout } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleRegisterChange = useCallback((e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleRegisterSubmit = useCallback(async (e) => {
    e.preventDefault();
    const storedUser = user || JSON.parse(localStorage.getItem('user'));
    if (!storedUser?.IDUser) {
      alert("Không tìm thấy ID người dùng, vui lòng đăng nhập lại.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:5000/api/blood-donations/register-blood', {

        IDUser: parseInt(storedUser.IDUser),
        DonateBloodDate: registerForm.donateBloodDate,
        IDBlood: getBloodID(registerForm.bloodType),
        IdentificationNumber: registerForm.identificationNumber,
        Note: registerForm.note
      });

      alert('Đăng ký thành công!');
      setQrCode(response.data.data.QRCode); // Lưu QR code trả về
      setRegisterForm({ donateBloodDate: '', bloodType: '', identificationNumber: '', note: '' });
    } catch (error) {
      console.error('❌ Lỗi khi gửi form:', error);
      const msg = error?.response?.data?.error || 'Lỗi khi đăng ký hiến máu';
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  }, [registerForm, user]);

  return (
    <>
       <header className='header'>
                   {/* logo */}
                   <div className='logo'>
                     <Link to="/">
                       <img src='/LogoPage.jpg' alt='Logo' />
                     </Link>
                     <div className='webname'>Hope Donnor🩸</div>
                   </div>
                   {/* menu */}
                   <nav className='menu'>
                     <Link to='/bloodguide'>Blood Guide</Link>
                     <div className='dropdown'>
                       <Link to='/bloodknowledge' className='dropbtn'>Blood</Link>
                     </div>
                     <Link to='/news'>News & Events</Link>
                     <Link to='/contact'>Contact</Link>
                     <Link to='/about'>About Us</Link>
                   </nav>
                   {/* login/user menu */}
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
                             <Link to='/register/request-blood'>Register/Request-Blood</Link>
                             <Link to='/my-activities'>List res/req</Link>
                             <Link to='/history'>DonatationHistory</Link>
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

      <main className='body'>
        <section className='register-section'>
          <h2>Đăng ký hiến máu</h2>
          <RegistrationForm
            form={registerForm}
            onChange={handleRegisterChange}
            onSubmit={handleRegisterSubmit}
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

import React, { useState, useCallback, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './BloodDonation.css';

// Component for Registration Form
const RegistrationForm = React.memo(({ form, onChange, onSubmit }) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!form.donateBloodDate) newErrors.donateBloodDate = 'Ngày hiến máu là bắt buộc';
    if (!form.bloodType) newErrors.bloodType = 'Nhóm máu là bắt buộc';
    if (!form.identificationNumber || !/^\d{9,12}$/.test(form.identificationNumber)) {
      newErrors.identificationNumber = 'CMND/CCCD phải là số từ 9-12 chữ số';
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

  return (
    <form className='register-form' onSubmit={handleSubmit}>
      <div className='form-group'>
        <input
          type='date'
          name='donateBloodDate'
          value={form.donateBloodDate}
          onChange={onChange}
          required
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

// Component for Request Form
const RequestForm = React.memo(({ form, onChange, onSubmit }) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!form.component) newErrors.component = 'Thành phần máu là bắt buộc';
    if (!form.bloodType) newErrors.bloodType = 'Nhóm máu là bắt buộc';
    if (!form.quantity || form.quantity < 1) newErrors.quantity = 'Số lượng phải lớn hơn 0';
    if (!form.identificationNumber || !/^\d{9,12}$/.test(form.identificationNumber)) {
      newErrors.identificationNumber = 'CMND/CCCD phải là số từ 9-12 chữ số';
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

  return (
    <form className='request-form' onSubmit={handleSubmit}>
      <div className='form-group'>
        <select name='component' value={form.component} onChange={onChange} required>
          <option value='' disabled>Chọn thành phần máu</option>
          {['Red Cells', 'Plasma', 'White Cells', 'Platelets'].map((comp) => (
            <option key={comp} value={comp}>{comp}</option>
          ))}
        </select>
        {errors.component && <span className='error'>{errors.component}</span>}
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
          type='number'
          name='quantity'
          value={form.quantity}
          onChange={onChange}
          placeholder='Số lượng (đơn vị)'
          min='1'
          required
        />
        {errors.quantity && <span className='error'>{errors.quantity}</span>}
      </div>
      <div className='form-group'>
        <select name='urgencyLevel' value={form.urgencyLevel} onChange={onChange} required>
          {['Normal', 'Urgent'].map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
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
      <button type='submit' className='submit-btn'>Gửi yêu cầu</button>
    </form>
  );
});

// List Item Display
const ListItem = React.memo(({ item, type }) => (
  <div className={`${type}-item`}>
    {type === 'register' ? (
      <>
        <p><strong>Ngày:</strong> {item.donateBloodDate}</p>
        <p><strong>Nhóm máu:</strong> {item.bloodType}</p>
        <p><strong>CMND/CCCD:</strong> {item.identificationNumber}</p>
        <p><strong>Ghi chú:</strong> {item.note || 'Không có'}</p>
        <p><strong>Trạng thái:</strong> {item.status}</p>
      </>
    ) : (
      <>
        <p><strong>Thành phần:</strong> {item.component}</p>
        <p><strong>Nhóm máu:</strong> {item.bloodType}</p>
        <p><strong>Số lượng:</strong> {item.quantity} đơn vị</p>
        <p><strong>Mức khẩn cấp:</strong> {item.urgencyLevel}</p>
        <p><strong>CMND/CCCD:</strong> {item.identificationNumber}</p>
        <p><strong>Ngày yêu cầu:</strong> {item.requestDate}</p>
        <p><strong>Trạng thái:</strong> {item.status}</p>
      </>
    )}
  </div>
));

export default function BloodDonation() {
  const [registerForm, setRegisterForm] = useState({
    donateBloodDate: '',
    bloodType: '',
    identificationNumber: '',
    note: '',
  });
  const [registerList, setRegisterList] = useState([]);
  const [requestForm, setRequestForm] = useState({
    component: '',
    bloodType: '',
    quantity: '',
    urgencyLevel: 'Normal',
    identificationNumber: '',
  });
  const [requestList, setRequestList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRegisterChange = useCallback((e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleRegisterSubmit = useCallback((e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const idRegister = Date.now().toString();
      setRegisterList((prev) => [
        ...prev,
        {
          idRegister,
          ...registerForm,
          status: 'Pending',
        },
      ]);
      setRegisterForm({ donateBloodDate: '', bloodType: '', identificationNumber: '', note: '' });
      setIsLoading(false);
    }, 500);
  }, [registerForm]);

  const handleRequestChange = useCallback((e) => {
    const { name, value } = e.target;
    setRequestForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleRequestSubmit = useCallback((e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const idRequest = Date.now().toString();
      setRequestList((prev) => [
        ...prev,
        {
          idRequest,
          ...requestForm,
          status: 'Pending',
          requestDate: new Date().toISOString().split('T')[0],
        },
      ]);
      setRequestForm({ component: '', bloodType: '', quantity: '', urgencyLevel: 'Normal', identificationNumber: '' });
      setIsLoading(false);
    }, 500);
  }, [requestForm]);

  return (
    <>
      {/* HEADER CẬP NHẬT */}
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
                Xin chào, {user?.FullName || user?.fullName || user?.name || 'User'} <span className="ml-2">▼</span>
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

      <main className='body'>
        {/* Form và danh sách đăng ký */}
        <section className='register-section'>
          <h2>Đăng ký hiến máu</h2>
          <RegistrationForm form={registerForm} onChange={handleRegisterChange} onSubmit={handleRegisterSubmit} />
          {registerList.length > 0 && (
            <div className='register-list'>
              <h3>Đăng ký của bạn</h3>
              <div className='list-container'>
                {isLoading ? <div className='skeleton'></div> : registerList.map((item) => (
                  <ListItem key={item.idRegister} item={item} type="register" />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Button khẩn cấp */}
        <div className='emergency-button-container'>
          <Link to='/emergency-blood'>
            <button className='emergency-btn'>🚨 Yêu cầu máu khẩn cấp</button>
          </Link>
        </div>

        {/* Form và danh sách yêu cầu */}
        <section className='request-section'>
          <h2>Yêu cầu nhận máu</h2>
          <RequestForm form={requestForm} onChange={handleRequestChange} onSubmit={handleRequestSubmit} />
          {requestList.length > 0 && (
            <div className='request-list'>
              <h3>Yêu cầu của bạn</h3>
              <div className='list-container'>
                {isLoading ? <div className='skeleton'></div> : requestList.map((item) => (
                  <ListItem key={item.idRequest} item={item} type="request" />
                ))}
              </div>
            </div>
          )}
        </section>

        {/* FOOTER */}
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
      </main>
    </>
  );
}

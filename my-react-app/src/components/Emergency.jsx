import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './emergency.css';

const EmergencyForm = React.memo(({ form, onChange, onSubmit }) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (form.contactPhone && !/^\d{10}$/.test(form.contactPhone)) {
      newErrors.contactPhone = 'Số điện thoại phải là 10 chữ số nếu được nhập';
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
    <form className='emergency-form' onSubmit={handleSubmit} aria-label="Yêu cầu máu khẩn cấp">
      <p className="form-note">* Bạn có thể gửi yêu cầu mà không cần điền đầy đủ thông tin nếu đang trong tình huống khẩn cấp.</p>

      <div className='form-group'>
        <select
          name='bloodType'
          value={form.bloodType}
          onChange={onChange}
          aria-label="Nhóm máu"
        >
          <option value=''>Chọn nhóm máu (tuỳ chọn)</option>
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      <div className='form-group'>
        <input
          type='number'
          name='quantity'
          value={form.quantity}
          onChange={onChange}
          placeholder='Số lượng (đơn vị - tuỳ chọn)'
          min='1'
          aria-label="Số lượng"
        />
      </div>
      <div className='form-group'>
    
      </div>
      <div className='form-group'>
        <input
          type='text'
          name='contactPhone'
          value={form.contactPhone}
          onChange={onChange}
          placeholder='Số điện thoại liên hệ (tuỳ chọn)'
          aria-label="Số điện thoại liên hệ"
        />
        {errors.contactPhone && <span className='error'>{errors.contactPhone}</span>}
      </div>
      <button type='submit' className='submit-btn'>Gửi yêu cầu khẩn cấp</button>
    </form>
  );
});

const ListItem = React.memo(({ item }) => (
  <div className='emergency-item' role="listitem">
    <p><strong>Nhóm máu:</strong> {item.bloodType || 'Không rõ'}</p>
    <p><strong>Số lượng:</strong> {item.quantity ? `${item.quantity} đơn vị` : 'Không rõ'}</p>
    <p><strong>Số điện thoại:</strong> {item.contactPhone || 'Ẩn danh'}</p>
    <p><strong>Ngày yêu cầu:</strong> {item.requestDate}</p>
    <p><strong>Trạng thái:</strong> {item.status}</p>
  </div>
));

export default function EmergencyBlood() {
  const [emergencyForm, setEmergencyForm] = useState({
    bloodType: '',
    quantity: '',
    contactPhone: '',
  });
  const [emergencyList, setEmergencyList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setEmergencyForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const idRequest = Date.now().toString();
      setEmergencyList((prev) => [
        ...prev,
        {
          idRequest,
          ...emergencyForm,
          status: 'Pending',
          requestDate: new Date().toISOString().split('T')[0],
        },
      ]);
      setEmergencyForm({
        bloodType: '',
        quantity: '',
        urgencyLevel: 'Urgent',
        contactPhone: '',
      });
      setIsLoading(false);
    }, 500);
  }, [emergencyForm]);

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
          <Link to='/news'>News & Events</Link>
          <Link to='/contact'>Contact</Link>
          <Link to='/about'>About Us</Link>
        </nav>
        <div className='actions'>
          <Link to='/login'>
            <button className='login-btn'>👤 Login</button>
          </Link>
        </div>
      </header>

      <main className='body'>
        <section className='emergency-section'>
          <h2>Yêu cầu máu khẩn cấp</h2>
          <EmergencyForm
            form={emergencyForm}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
          {emergencyList.length > 0 && (
            <div className='emergency-list'>
              <h3>Yêu cầu của bạn</h3>
              <div className='list-container'>
                {isLoading ? (
                  <div className='skeleton'></div>
                ) : (
                  emergencyList.map((item) => (
                    <ListItem key={item.idRequest} item={item} />
                  ))
                )}
              </div>
            </div>
          )}
        </section>

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

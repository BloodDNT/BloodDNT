import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import './UserProfile.css';

export default function UserProfile() {
  const { user, updateUser, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  console.log('user:', user);

  const [form, setForm] = useState({
  fullName: user?.fullName || user?.FullName || '',
  email: user?.email || user?.Email || '',
  phoneNumber: user?.phoneNumber || user?.PhoneNumber || '',
  address: user?.address || user?.Address || '',
  dateOfBirth: user?.dateOfBirth || user?.DateOfBirth || '',
  gender: user?.gender || user?.Gender || '',
});
 useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || user.FullName || '',
        email: user.email || user.Email || '',
        phoneNumber: user.phoneNumber || user.PhoneNumber || '',
        address: user.address || user.Address || '',
        dateOfBirth: user.dateOfBirth || user.DateOfBirth || '',
        gender: user.gender || user.Gender || '',
      });
    }
  }, [user]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
     if (!editMode) return;
    e.preventDefault();
      console.log('Đã nhấn Lưu');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form),
        credentials: 'include',
      });
      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser.user); // chú ý lấy đúng trường user từ response
        setEditMode(false);
        alert('Cập nhật thành công!');
      } else {
        alert('Cập nhật thất bại!');
      }
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra!');
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user) {
    return <div>Đang tải thông tin người dùng...</div>;
  }
  return (
    <>
      {/* Header */}
      <header className='header'>
        <div className='logo'>
          <Link to="/">
            <img src='/LogoPage.jpg' alt='Logo' />
          </Link>
          <div className='webname'>Hope Donor 🩸</div>
        </div>
        <nav className='menu'>
          <Link to='/bloodguide'>Blood Guide</Link>
          <div className='dropdown'>
            <Link to='/bloodknowledge' className='dropbtn'>Blood </Link>
          </div>
          <Link to='/register/request-blood'>Register/Request-Blood</Link>
          <Link to='/history'>DonatationHistory</Link>
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
                  <button className="logout-btn" onClick={handleLogout}>
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Body */}
      <div className="body">
        <div className="profile-container">
          <h2>Thông tin cá nhân</h2>
         
          <form className="profile-form" onSubmit={handleSave}>
            <div className="form-group">
              <label>Họ và tên</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
            <div className="form-group">
              <label>Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
            <div className="form-group">
              <label>Ngày sinh</label>
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
            <div className="form-group">
              <label>Giới tính</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                disabled={!editMode}
              >
                <option value="">Chọn</option>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
                <option value="Other">Khác</option>
              </select>
            </div>
            {editMode && (
      <div className="profile-actions">
        <button type="submit" className="save-btn">Lưu</button>
        <button
          type="button"
          className="cancel-btn"
          onClick={() => {
            setEditMode(false);
            setForm({
              fullName: user.fullName || user.FullName || '',
              email: user.email || user.Email || '',
              phoneNumber: user.phoneNumber || user.PhoneNumber || '',
              address: user.address || user.Address || '',
              dateOfBirth: user.dateOfBirth || user.DateOfBirth || '',
              gender: user.gender || user.Gender || '',
            });
          }}
        >
          Hủy
        </button>
      </div>
    )}
          </form>
           {!editMode && (
    <button
      type="button"
      className="edit-btn"
      style={{ marginBottom: 16 }}
      onClick={() => setEditMode(true)}
    >
      Chỉnh sửa
    </button>
  )}
        </div>
      </div>

      {/* Footer */}
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
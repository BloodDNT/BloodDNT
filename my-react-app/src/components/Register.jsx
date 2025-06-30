import React, { useState } from 'react';
import './Login-register.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    cccd: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    gender: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('Mật khẩu không khớp!');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        alert('Đăng ký thành công! Hãy đăng nhập.');
        navigate('/login');
      } else {
        alert('Lỗi: ' + data.message);
      }
    } catch (error) {
      alert('Lỗi server: ' + error.message);
    }
  };

  return (
    <section className="register-section">
      <div className="register-box">
        <h2 className="register-title">🩸 Đăng ký tài khoản</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Họ và tên" name="fullName" value={form.fullName} onChange={handleChange} required />
          <input type="email" placeholder="Email" name="email" value={form.email} onChange={handleChange} required />
          <input type="password" placeholder="Mật khẩu" name="password" value={form.password} onChange={handleChange} required />
          <input type="password" placeholder="Nhập lại mật khẩu" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
          <input type="tel" placeholder="Số điện thoại" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required />
          <input type="text" placeholder="Địa chỉ" name="address" value={form.address} onChange={handleChange} required />
          <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} required />

          <select name="gender" value={form.gender} onChange={handleChange} required>
            <option value="">Chọn giới tính</option>
            <option value="Male">Nam</option>
            <option value="Female">Nữ</option>
            <option value="Other">Khác</option>
          </select>

          <button type="submit" className="register-submit-button">Đăng ký</button>
        </form>

        <div className="login-link">
          <p>Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link></p>
        </div>
      </div>
    </section>
  );
}

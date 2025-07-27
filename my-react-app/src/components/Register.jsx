import React, { useState } from 'react';
import './Login-register.css';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

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

  const getCoordinatesFromAddress = async (address) => {
  const apiKey = 'fd3bc2af9e1b4ba8845bcf8e7c578336';
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.results && data.results.length > 0) {
    const { lat, lng } = data.results[0].geometry;
    return { latitude: lat, longitude: lng };
  } else {
    throw new Error('Không tìm được tọa độ từ địa chỉ.');
  }
};
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    Swal.fire('Mật khẩu không khớp!');
    return;
  }

  try {
    const { latitude, longitude } = await getCoordinatesFromAddress(form.address);

    const dataToSend = {
      ...form,
      latitude,
      longitude
    };

    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend)
    });

    const data = await res.json();

    if (res.ok) {
      Swal.fire('Đăng ký thành công! Hãy đăng nhập.');
      navigate('/login');
    } else {
      Swal.fire('Lỗi: ' + data.message);
    }
  } catch (error) {
   Swal.fire('Lỗi: ' + error.message);
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
          <input type="date" name="dateOfBirth" value={form.dateOfBirth}   max={new Date().toISOString().split("T")[0]} onChange={handleChange} required />

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

import React from 'react';
import './Login-register.css';
import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <section className="register-section">
      <div className="register-box">
        <h2 className="register-title">🩸 Đăng ký tài khoản</h2>
        <form className="register-form">
          <input type="text" placeholder="Họ và tên" name="fullname" required />
          <input type="email" placeholder="Email" name="email" required />
          <input type="password" placeholder="Mật khẩu" name="password" required />
          <input type="password" placeholder="Nhập lại mật khẩu" name="password" required />
          <input type="text" placeholder="Số CCCD" name="cccd" required />
          <input type="tel" placeholder="Số điện thoại" name="phone" required />
          <input type="text" placeholder="Địa chỉ" name="address" required />
          <input type="date" name="birthdate" required />

          <select name="gender" required>
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
          <button type="submit" className="register-submit-button">Đăng ký</button>
        </form>
        <div className="login-link">
          <p>
            Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

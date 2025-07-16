import { Link, useNavigate } from "react-router-dom";
import './Login-register.css';
import React, { useState, useContext } from "react";
import { UserContext } from '../context/UserContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        console.log('user trả về:', data.user);
        localStorage.setItem('token', data.token);
        login(data.user);
        alert('Đăng nhập thành công! Chào ' + data.user.fullName);
        navigate('/');
      } else {
        alert('Lỗi: ' + data.message);
      }
    } catch (error) {
      alert('Lỗi server: ' + error.message);
    }
  };

  return (
    <section className="login-section">
      <div className="login-box">
        <div className='logo-login'>
          <Link to="/">
            <div className='webname-login'>Hope Donnor🩸</div>
          </Link>
        </div>
        <h2 className="login-title">🔐 Đăng nhập</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email" className="login-label">Email</label>
          <input
            type="email"
            id="email"
            className="login-input"
            placeholder="Nhập Địa Chỉ Email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password" className="login-label">Mật khẩu</label>
          <input
            type="password"
            id="password"
            className="login-input"
            placeholder="Nhập mật khẩu..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="login-extra">  
            <label className="remember-me">
              <input type="checkbox" /> Nhớ mật khẩu
            </label>
            <a href="#" className="forgot-password">Quên mật khẩu?</a>
          </div>
        
          <button type="submit" className="login-button">Đăng nhập</button>
        </form>

        <div className="register-link">
          <p>
            Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
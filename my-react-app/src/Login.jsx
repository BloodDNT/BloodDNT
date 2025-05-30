import React from "react";
import { Link } from "react-router-dom";
import './Login-register.css';

export default function Login() {
  return (
    <section className="login-section">
      <div className="login-box">
        <div className='logo-login'>
          <Link to="/">
            <div className='webname-login'>Hope Donnor🩸</div>
          </Link>
        </div>
        <h2 className="login-title">🔐 Đăng nhập</h2>
        <form className="login-form">
          <label htmlFor="id" className="login-label">Số Căn Cước</label>
          <input
            type="text"
            id="id"
            className="login-input"
            placeholder="Nhập số căn cước..."
          />

          <label htmlFor="password" className="login-label">Mật khẩu</label>
          <input
            type="password"
            id="password"
            className="login-input"
            placeholder="Nhập mật khẩu..."
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

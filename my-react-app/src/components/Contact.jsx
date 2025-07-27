import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import './contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState({
    loading: false,
    success: null,
    error: null,
  });
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const contactSectionRef = useRef(null);
  const mapSectionRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (contactSectionRef.current) observer.observe(contactSectionRef.current);
    if (mapSectionRef.current) observer.observe(mapSectionRef.current);
    if (footerRef.current) observer.observe(footerRef.current);

    return () => {
      if (contactSectionRef.current) observer.unobserve(contactSectionRef.current);
      if (mapSectionRef.current) observer.unobserve(mapSectionRef.current);
      if (footerRef.current) observer.unobserve(footerRef.current);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormStatus({ loading: false, success: null, error: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({ loading: false, success: null, error: 'Vui lòng điền đầy đủ họ tên, email và tin nhắn.' });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setFormStatus({ loading: false, success: null, error: 'Email không hợp lệ.' });
      return;
    }

    setFormStatus({ loading: true, success: null, error: null });

    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      setFormStatus({ loading: false, success: 'Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm.', error: null });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      setFormStatus({
        loading: false,
        success: null,
        error: error.response?.data?.message || 'Có lỗi xảy ra khi gửi. Vui lòng thử lại.',
      });
    }
  };

  return (
    <>
      <header className="header">
        <div className="logo">
          <Link to="/">
            <img src="/LogoPage.jpg" alt="Hope Donor Logo" loading="lazy" decoding="async" />
          </Link>
          <div className="webname">Hope Donor 🩸</div>
        </div>
        <nav className="menu">
          <Link to="/bloodguide">Blood Guide</Link>
          <div className="dropdown">
            <Link to="/bloodknowledge" className="dropbtn">Blood</Link>
          </div>
          <Link to="/news">News & Events</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/about">About Us</Link>
        </nav>
        <div className="actions">
          {!user ? (
            <Link to="/login">
              <button className="login-btn">👤 Login</button>
            </Link>
          ) : (
            <div
              className="dropdown user-menu"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
            >
              <div className="dropbtn user-name">
                Xin chào, {(user && (user.FullName || user.fullName || user.name)) || 'User'} <span className="ml-2">▼</span>
              </div>
              {isOpen && (
                <div className="dropdown-content user-dropdown">
                  <Link to="/register/request-blood">Register/Request</Link>
                  <Link to="/my-activities">List res/req</Link>
                  <Link to="/history">Donation History</Link>
                  <Link to="/profile">👤 User Profile</Link>
                  {user?.role === 'Admin' && (
                    <Link to="/dashboard">🛠️ Path to admin</Link>
                  )}
                  <Link to="/notifications">🔔 Notification</Link>
                  <button className="logout-btn" onClick={handleLogout}>🚪 Đăng xuất</button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="body">
        <section className="contact-section scroll-reveal" ref={contactSectionRef}>
          <div className="contact-container">
            <div className="contact-form1">
              <h2 className="text-2xl font-semibold mb-4">Liên hệ với chúng tôi</h2>
              <form onSubmit={handleSubmit} className="contact-form-inner">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Họ tên</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Nhập họ tên"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Nhập email"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Số điện thoại</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Nhập số điện thoại (tùy chọn)"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message" className="form-label">Tin nhắn</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Nhập tin nhắn của bạn"
                    rows="5"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-button" disabled={formStatus.loading}>
                  {formStatus.loading ? 'Đang gửi...' : 'Gửi tin nhắn'}
                </button>
                {formStatus.success && <p className="form-message success">{formStatus.success}</p>}
                {formStatus.error && <p className="form-message error">{formStatus.error}</p>}
              </form>
            </div>
            <div className="contact-info">
              <h2 className="text-2xl font-semibold mb-4">Thông tin liên hệ</h2>
              <div className="info-item">
                <span className="icon">📍</span>
                <p>Trung tâm Hiến máu, Đại học FPT, Q9, TP.HCM</p>
              </div>
              <div className="info-item">
                <span className="icon">📞</span>
                <p>
                  +84 123 456 789
                  <br />
                  +84 123 456 987
                </p>
              </div>
              <div className="info-item">
                <span className="icon">📧</span>
                <p>contact@hopedonor.org</p>
              </div>
              <div className="info-item social">
                <h3>Theo dõi chúng tôi</h3>
                <div className="social-links">
                  <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="map-section scroll-reveal" ref={mapSectionRef}>
          <h2 className="text-2xl font-semibold mb-4">Vị trí của chúng tôi</h2>
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d823.7858255185719!2d106.80981358904828!3d10.841291799553385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752731176b07b1%3A0xb752b24b379bae5e!2z6IOh5b-X5piO5biCRlBU5aSn5a24!5e0!3m2!1szh-TW!2s!4v1748747124866!5m2!1szh-TW!2s"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="FPT University Location"
            ></iframe>
          </div>
        </section>

        <section className="footer scroll-reveal" ref={footerRef}>
          <div className="footer-container">
            <div className="footer-block location">
              <h3>📍 Vị trí</h3>
              <p>Trung tâm Hiến máu, Đại học FPT, Q9, TP.HCM</p>
            </div>
            <div className="footer-block hotline">
              <h3>📞 Hotline</h3>
              <p>+84 123 456 789</p>
              <p>+84 123 456 987</p>
            </div>
            <div className="footer-block social-media">
              <h3>🌐 Theo dõi chúng tôi</h3>
              <ul>
                <li>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a>
                </li>
                <li>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
                </li>
                <li>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
                </li>
              </ul>
            </div>
          </div>
          <p className="footer-copy">© 2025 HopeDonor. Mọi quyền được bảo lưu.</p>
        </section>
      </div>
    </>
  );
}
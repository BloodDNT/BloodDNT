import React, { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import './contact.css';
import axios from 'axios';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5000/api/contact', {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });
      console.log('Phản hồi từ server:', response.data);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Lỗi khi gửi form:', error.response?.data || error.message);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="header">
        <div className="logo">
          <Link to="/">
            <img src="/LogoPage.jpg" alt="Logo" />
          </Link>
          <div className="webname">Hope Donnor🩸</div>
        </div>
        <nav className="menu">
          <Link to="/bloodguide">Blood Guide</Link>
          <div className="dropdown">
            <Link to="/bloodknowledge" className="dropbtn">
              Blood
            </Link>
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
                Xin chào, {user?.FullName || user?.fullName || user?.name || 'User'}{' '}
                <span className="ml-2">▼</span>
              </div>
              {isOpen && (
                <div className="dropdown-content user-dropdown">
                  <Link to="/register/request-blood">Register/Request-Blood</Link>
                  <Link to="/my-activities">List res/req</Link>
                  <Link to="/history">DonatationHistory</Link>
                  <Link to="/profile">👤 Thông tin cá nhân</Link>
                  <Link to="/notifications">🔔 Thông báo</Link>
                  <button className="logout-btn" onClick={handleLogout}>
                    🚪 Đăng xuất
                  </button>
                </div>
<<<<<<< HEAD
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
                      <Link to='/register/request-blood'>Register/Request</Link>
                  <Link to='/my-activities'>List res/req</Link>
                  <Link to='/history'>DonatationHistory</Link>
                  <Link to="/profile">👤UserProfile</Link>
                  {user?.role === 'Admin' && (
      <Link to="/dashboard">🛠️Path to admin</Link>
    )}
                  <Link to="/notifications">🔔Notification</Link>
                  <button
                    className="logout-btn"
                    onClick={handleLogout}
                  >
                    🚪Logout
                  </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </header> 
      {/* Body */}
      <div className='body'>
        {/* Contact Section */}
        <section className='contact-section'>
          <div className='contact-container'>
            {/* Form */}
            <div className='contact-form'>
              <h2>Get in Touch</h2>
=======
              )}
            </div>
          )}
        </div>
      </header>
      <div className="body">
        <section className="contact-section" ref={contactSectionRef}>
          <div className="contact-container">
            <div className="contact-form">
              <h2>Liên hệ với chúng tôi</h2>
>>>>>>> f27524238d48e673c7bec76bbde795549a2088b0
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Họ và tên"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email của bạn"
                  required
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tin nhắn của bạn"
                  required
                />
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
                </button>
                {submitStatus === 'success' && (
                  <p className="form-status success">Gửi tin nhắn thành công!</p>
                )}
                {submitStatus === 'error' && (
                  <p className="form-status error">Vui lòng điền đầy đủ thông tin hoặc thử lại sau.</p>
                )}
              </form>
            </div>
            <div className="contact-info">
              <h2>Thông tin liên hệ</h2>
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
                  <a href="https://facebook.com" target="_blank" rel="noreferrer">
                    Facebook
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer">
                    Twitter
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="map-section" ref={mapSectionRef}>
          <h2>Vị trí của chúng tôi</h2>
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
        <section className="footer" ref={footerRef}>
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
                  <a href="https://facebook.com" target="_blank" rel="noreferrer">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer">
                    Twitter
                  </a>
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
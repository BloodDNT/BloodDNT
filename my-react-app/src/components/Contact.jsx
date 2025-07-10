import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext'; 
import { Link, useNavigate } from 'react-router-dom';
import './contact.css';


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

  const handleLogout = () => {
    logout(); // gọi hàm logout trong context
    navigate('/login'); // chuyển về trang login
  };
// Xử lý thay đổi input
const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  // Xử lý thay đổi input
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('error');
      return;
    }
  
    setIsSubmitting(true);
    try {
      // Thay vì gửi Firebase, log dữ liệu ra để kiểm tra:
      console.log("Dữ liệu form đã nhập:", formData);
  
      // Giả lập gửi thành công:
      setTimeout(() => {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setIsSubmitting(false);
      }, 1000); // mô phỏng delay 1 giây
    } catch (error) {
      console.error('Lỗi khi gửi form:', error);
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };
  

  return (
    <>
      <header className='header'>
        {/* Logo */}
        <div className='logo'>
          <Link to="/">
            <img src='/LogoPage.jpg' alt='Logo' loading="lazy" />
          </Link>
          <div className='webname'>Hope Donor 🩸</div>
        </div>
        {/* Menu */}
        <nav className='menu'>
          <Link to='/bloodguide'>Blood Guide</Link>
          <div className='dropdown'>
            <Link to='/blood' className='dropbtn'>Blood ▼</Link>
            <div className='dropdown-content'>
              <Link to='/blood/type'>Type</Link>
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
        {/* Login */}
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
                                <button
                                  className="logout-btn"
                                  onClick={handleLogout}
                                >
                                  🚪 Đăng xuất
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
              <form onSubmit={handleSubmit}>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder='Your Name'
                  required
                />
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder='Your Email'
                  required
                />
                <textarea
                  name='message'
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder='Your Message'
                  required
                />
                <button type='submit' className='submit-btn' disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                {submitStatus === 'success' && (
                  <p className='form-status success'>Message sent successfully!</p>
                )}
                {submitStatus === 'error' && (
                  <p className='form-status error'>Please fill all fields or try again later.</p>
                )}
              </form>
            </div>
            {/* Contact Info */}
            <div className='contact-info'>
              <h2>Contact Information</h2>
              <div className='info-item'>
                <span className='icon'>📍</span>
                <p>Blood Donation Center, FPT University, Q9, TP.HCM</p>
              </div>
              <div className='info-item'>
                <span className='icon'>📞</span>
                <p>+84 123 456 789<br />+84 123 456 987</p>
              </div>
              <div className='info-item'>
                <span className='icon'>📧</span>
                <p>contact@hopedonor.org</p>
              </div>
              <div className='info-item social'>
                <h3>Follow Us</h3>
                <div className='social-links'>
                  <a href='https://facebook.com' target='_blank' rel='noreferrer'>Facebook</a>
                  <a href='https://instagram.com' target='_blank' rel='noreferrer'>Instagram</a>
                  <a href='https://twitter.com' target='_blank' rel='noreferrer'>Twitter</a>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Map Section */}
        <section className='map-section'>
          <h2>Our Location</h2>
          <div className='map-container'>
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
      </div>
    </>
  );
}
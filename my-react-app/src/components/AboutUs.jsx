import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import './about.css';
 
export default function AboutUs() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const sectionRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    if (footerRef.current) {
      observer.observe(footerRef.current);
    }
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="logo">
          <Link to="/">
            <img src="/LogoPage.jpg" alt="Hope Donor Logo" />
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
          <Link to="/about" className="active">About Us</Link>
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
                Xin chào, {user?.FullName || user?.fullName || user?.name ||"User"} <span className="ml-2">▼</span>
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
        <section className="about-section" ref={sectionRef}>
          <h2>Giới thiệu về Hope Donor</h2>
          <div className="about-content">
            <div className="about-text">
              <h3>Sứ mệnh của chúng tôi</h3>
              <p>
                Hope Donor ra đời với mục tiêu kết nối những người hiến máu tình nguyện với những bệnh nhân cần máu, mang lại cơ hội sống cho hàng ngàn người tại Việt Nam. Chúng tôi xây dựng một nền tảng nhân đạo, an toàn và hiệu quả để hỗ trợ cộng đồng.
              </p>
              <h3>Tầm nhìn</h3>
              <p>
                Trở thành nền tảng hiến máu hàng đầu tại Việt Nam, cung cấp giải pháp nhanh chóng, minh bạch và đáng tin cậy để đáp ứng nhu cầu máu trong các trường hợp khẩn cấp và chăm sóc y tế.
              </p>
              <h3>Giá trị cốt lõi</h3>
              <ul>
                <li><strong>Nhân ái</strong>: Lan tỏa tinh thần sẻ chia, đặt con người làm trung tâm.</li>
                <li><strong>An toàn</strong>: Đảm bảo mọi quy trình hiến máu tuân thủ tiêu chuẩn y tế cao nhất.</li>
                <li><strong>Minh bạch</strong>: Cung cấp thông tin rõ ràng, chính xác về hiến máu và nhu cầu máu.</li>
                <li><strong>Cộng đồng</strong>: Xây dựng một cộng đồng gắn kết, khuyến khích mọi người tham gia hiến máu.</li>
              </ul>
            </div>
            <div className="about-image">
              <img src="/images/about-us.jpg" alt="Hope Donor Mission" />
            </div>
          </div>
          <div className="about-team">
            <h3>Đội ngũ của chúng tôi</h3>
            <p>
              Đội ngũ Hope Donor bao gồm các chuyên gia y tế, kỹ sư công nghệ, và tình nguyện viên nhiệt huyết, cùng nhau làm việc để tạo nên một hệ sinh thái hiến máu bền vững.
            </p>
          </div>
          <div className="about-cta">
            <h3>Hãy cùng chúng tôi cứu giúp cuộc sống!</h3>
            <p>Tham gia hiến máu hoặc liên hệ để biết thêm thông tin về cách bạn có thể đóng góp.</p>
            <div className="cta-buttons">
  {!user ? (
    <Link to="/login" className="cta-btn">Đăng nhập để hiến máu</Link>
  ) : (
    <Link to="/register/request-blood" className="cta-btn">Đăng ký hiến máu</Link>
  )}
  <Link to="/contact" className="cta-btn secondary">Liên hệ</Link>
</div>

          </div>
        </section>
      </div>

      {/* Footer */}
      <section className="footer" ref={footerRef}>
        <div className="footer-container">
          <div className="footer-block location">
            <h3>📍 Location</h3>
            <p>Blood Donation Center, FPT University, Q9, TP.HCM</p>
          </div>
          <div className="footer-block hotline">
            <h3>📞 Hotline</h3>
            <p>+84 123 456 789</p>
            <p>+84 123 456 987</p>
          </div>
          <div className="footer-block social-media">
            <h3>🌐 Follow Us</h3>
            <ul>
              <li><a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a></li>
            </ul>
          </div>
        </div>
        <p className="footer-copy">© 2025 Hope Donor. All rights reserved.</p>
      </section>
    </>
  );
}
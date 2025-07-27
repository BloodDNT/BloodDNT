import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import axios from 'axios';
import './newpost.css';

export default function BloodDonationBenefits() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const footerRef = useRef();
  const sectionRefs = useRef({});
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

  // Mục lục
  const tocItems = [
    { id: 'mental-wellbeing', title: 'Tinh thần tích cực' },
    { id: 'health-check', title: 'Kiểm tra sức khỏe' },
    { id: 'iron-balance', title: 'Giảm quá tải sắt' },
    { id: 'new-blood', title: 'Tăng tạo máu mới' },
    { id: 'cardiovascular', title: 'Giảm nguy cơ tim mạch' },
    { id: 'calorie-burn', title: 'Đốt cháy calo' },
    { id: 'blood-bank', title: 'Ngân hàng máu' },
    { id: 'contact', title: 'Liên hệ' },
  ];

  // Hàm cuộn đến section
  const scrollToSection = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth' });
  };

  // Hiệu ứng scroll-reveal
  useEffect(() => {
    const options = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, options);

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach((el) => observer.observe(el));

    if (footerRef.current) observer.observe(footerRef.current);

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      if (footerRef.current) observer.unobserve(footerRef.current);
    };
  }, []);

  // Xử lý đăng xuất
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Xử lý nút "Kiểm tra ngay"
  const handleCheck = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/register/request-blood');
    }
  };

  // Xử lý input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý gửi form
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
      setFormStatus({ loading: false, success: 'Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm.', error: null });
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
                Xin chào, {user?.FullName || user?.fullName || user?.name || 'User'} <span className="ml-2">▼</span>
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

      <div className="blood-donation-benefits p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Lợi Ích Của Hiến Máu</h1>
        <p className="text-lg mb-4 text-center">Ngày đăng: 22-01-2020</p>
        <img
          src="/news3.jpg"
          alt="Lợi ích hiến máu"
          className="hero-image scroll-reveal"
        />

        {/* Mục lục */}
        <div className="toc scroll-reveal">
          <h2 className="text-2xl font-semibold mb-4">Mục lục</h2>
          <ul className="list-disc ml-6">
            {tocItems.map((item) => (
              <li
                key={item.id}
                className="text-lg text-blue-600 hover:underline cursor-pointer"
                onClick={() => scrollToSection(item.id)}
              >
                {item.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Giới thiệu */}
        <section className="intro scroll-reveal" ref={(el) => (sectionRefs.current['intro'] = el)}>
          <p className="text-lg leading-relaxed mb-4">
            Nhiều nghiên cứu đã chỉ ra những lợi ích bất ngờ nếu bạn hiến máu thường xuyên. Hãy cùng tìm hiểu những lợi ích của hiến máu này.
          </p>
        </section>

        {/* 1. Tinh thần tích cực */}
        <section className="benefit-item scroll-reveal" ref={(el) => (sectionRefs.current['mental-wellbeing'] = el)}>
          <h2 className="text-2xl font-semibold mb-3">1. Tinh thần tích cực, tâm lý thoải mái</h2>
          <p className="text-lg leading-relaxed mb-4">
            Hiến máu đem lại cảm giác tự hào và hạnh phúc vì hành động của bạn có thể cứu giúp tính mạng của ai đó. Phần máu bạn hiến được tách thành nhiều thành phần theo nhu cầu của bệnh nhân, giúp nhiều người nhận khác nhau. Ngoài ra, hiến máu còn giúp bạn tự tin vào sức khỏe của bản thân, là biểu hiện của máu tốt và sức khỏe tốt.
          </p>
        </section>

        {/* 2. Kiểm tra sức khỏe */}
        <section className="benefit-item scroll-reveal" ref={(el) => (sectionRefs.current['health-check'] = el)}>
          <h2 className="text-2xl font-semibold mb-3">2. Kiểm tra và tư vấn sức khỏe</h2>
          <p className="text-lg leading-relaxed mb-4">
            Mỗi lần hiến máu, bạn được kiểm tra sơ bộ sức khỏe (huyết áp, nhịp tim) và xét nghiệm máu (viêm gan B, C, HIV, giang mai). Kết quả xét nghiệm được thông báo, giúp bạn theo dõi sức khỏe. Bộ Y tế cung cấp gói xét nghiệm thay quà tặng, hỗ trợ bạn tự giám sát sức khỏe và phát hiện sớm nguy cơ bệnh tật.
          </p>
        </section>

        {/* 3. Giảm quá tải sắt */}
        <section className="benefit-item scroll-reveal" ref={(el) => (sectionRefs.current['iron-balance'] = el)}>
          <h2 className="text-2xl font-semibold mb-3">3. Giảm quá tải sắt trong cơ thể</h2>
          <p className="text-lg leading-relaxed mb-4">
            Hiến máu giúp giảm lượng sắt dư thừa, hỗ trợ quá trình thải sắt tự nhiên. Điều này đặc biệt có lợi vì dư thừa sắt có thể gây hại cho cơ thể, và hiến máu thường xuyên giúp cân bằng lượng sắt.
          </p>
        </section>

        {/* 4. Tăng tạo máu mới */}
        <section className="benefit-item scroll-reveal" ref={(el) => (sectionRefs.current['new-blood'] = el)}>
          <h2 className="text-2xl font-semibold mb-3">4. Tăng tạo máu mới</h2>
          <p className="text-lg leading-relaxed mb-4">
            Hiến máu kích thích tủy xương sản sinh hồng cầu mới để bù lại lượng máu đã mất. Quá trình này giúp thanh thải các thành phần như cholesterol, sắt, kali, giảm gánh nặng cho cơ thể.
          </p>
        </section>

        {/* 5. Giảm nguy cơ tim mạch */}
        <section className="benefit-item scroll-reveal" ref={(el) => (sectionRefs.current['cardiovascular'] = el)}>
          <h2 className="text-2xl font-semibold mb-3">5. Giảm nguy cơ đột quỵ, tim mạch</h2>
          <p className="text-lg leading-relaxed mb-4">
            Hiến máu giảm lượng sắt trong máu, từ đó giảm quá trình oxy hóa cholesterol, hạn chế mảng xơ vữa mạch máu – nguyên nhân gây đau tim và đột quỵ. Các nghiên cứu cho thấy hiến máu thường xuyên giảm nguy cơ bệnh tim mạch.
          </p>
        </section>

        {/* 6. Đốt cháy calo */}
        <section className="benefit-item scroll-reveal" ref={(el) => (sectionRefs.current['calorie-burn'] = el)}>
          <h2 className="text-2xl font-semibold mb-3">6. Đốt cháy calo và hỗ trợ giảm cân</h2>
          <p className="text-lg leading-relaxed mb-4">
            Mỗi lần hiến 450 ml máu giúp đốt cháy khoảng 650 calo và giảm cholesterol. Đây là cách hữu ích để hỗ trợ giảm cân cho những người thừa cân.
          </p>
        </section>

        {/* 7. Ngân hàng máu */}
        <section className="benefit-item scroll-reveal" ref={(el) => (sectionRefs.current['blood-bank'] = el)}>
          <h2 className="text-2xl font-semibold mb-3">7. Gửi máu vào ngân hàng máu</h2>
          <p className="text-lg leading-relaxed mb-4">
            Mỗi lần hiến máu, bạn gửi máu vào ngân hàng máu. Nếu cần nhận máu, bạn có thể sử dụng giấy chứng nhận hiến máu để được bồi hoàn máu miễn phí tại các cơ sở y tế công lập trên toàn quốc.
          </p>
        </section>
 <div className="source-citation scroll-reveal">
          <p>Nguồn: Viện huyết học <a href="https://vienhuyethoc.vn/loi-ich-cua-hien-mau/" target="_blank" rel="noreferrer">Healthline, 2025</a></p>
        </div>
        {/* Form liên hệ */}
        <section className="contact-form scroll-reveal" ref={(el) => (sectionRefs.current['contact'] = el)}>
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
              {formStatus.loading ? 'Đang gửi...' : 'Gửi liên hệ'}
            </button>
            {formStatus.success && <p className="form-message success">{formStatus.success}</p>}
            {formStatus.error && <p className="form-message error">{formStatus.error}</p>}
          </form>
        </section>

        {/* CTA */}
        <div className="cta-container scroll-reveal">
          <button className="check-button" onClick={handleCheck}>
            Kiểm tra ngay
          </button>
        </div>      
      </div>
        <section ref={footerRef} className="footer">
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
        <p className="footer-copy">© 2025 HopeDonor. All rights reserved.</p>
      </section>
    </>
  );
}
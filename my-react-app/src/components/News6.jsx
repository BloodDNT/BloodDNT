import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import axios from 'axios';
import './newpost.css';

export default function RedJourneyEvent() {
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

  // Hàm xử lý cuộn đến section khi nhấp vào mục lục
  const scrollToSection = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth' });
  };

  // Hiệu ứng fade-in khi cuộn
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCheck = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/register/request-blood');
    }
  };

  // Xử lý thay đổi input trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormStatus({ loading: false, success: null, error: null });
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

  // Danh sách mục lục
  const tocItems = [
    { id: 'intro', title: 'Giới thiệu' },
    { id: 'results', title: 'Kết quả Hành trình Đỏ 2025' },
    { id: 'hanoi-activities', title: 'Hoạt động tại Hà Nội' },
    { id: 'volunteer-contributions', title: 'Đóng góp của tình nguyện viên' },
    { id: 'significance', title: 'Ý nghĩa chương trình' },
    { id: 'contact', title: 'Liên hệ' },
  ];

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

      <div className="red-journey-event p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Khai mạc Ngày hội hiến máu “Giọt hồng tri ân” lần thứ 15</h1>
        <p className="text-lg text-gray-600 mb-4 text-center">Ngày đăng: 21-07-2025</p>
        <img
          src="/red-journey-2025.jpg"
          alt="Ngày hội hiến máu Giọt hồng tri ân 2025"
          className="hero-image scroll-reveal"
        />
        <p className="text-sm text-gray-500 mb-4 text-center">Các tình nguyện viên tham gia hiến máu tại chương trình. Ảnh: Minh Quyết/TTXVN</p>

        {/* Mục lục */}
        <div className="toc scroll-reveal">
          <h2 className="text-2xl font-semibold mb-4">Mục lục</h2>
          <ul className="list-disc ml-6">
            {tocItems.map((item) => (
              <li key={item.id} className="text-lg text-blue-600 hover:underline cursor-pointer" onClick={() => scrollToSection(item.id)}>
                {item.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Giới thiệu */}
        <section className="intro scroll-reveal" ref={(el) => (sectionRefs.current['intro'] = el)}>
          <p className="text-lg leading-relaxed mb-4">
            Ngày 21/7/2025, tại Hà Nội, Viện Huyết học – Truyền máu Trung ương phối hợp với Hội Thanh niên Vận động hiến máu Việt Nam tổ chức lễ khai mạc Ngày hội hiến máu “Giọt hồng tri ân” lần thứ 15. Ngày hội diễn ra từ ngày 18 đến 27/7 tại Viện Huyết học – Truyền máu Trung ương và một số địa điểm khác, là sự kiện kéo dài nhất từ trước đến nay (10 ngày). Nằm trong chuỗi Hành trình Đỏ – Kết nối dòng máu Việt, chương trình nhằm huy động lượng máu lớn phục vụ cấp cứu và điều trị trong dịp hè. Năm nay, mục tiêu là tiếp nhận tối thiểu 4.000 đơn vị máu, với gần 3.000 người đã tham gia hiến máu tính đến trước lễ khai mạc (từ ngày 18/7).
          </p>
        </section>

        {/* Kết quả Hành trình Đỏ 2025 */}
        <section className="event-item scroll-reveal" ref={(el) => (sectionRefs.current['results'] = el)}>
          <h2 className="text-2xl font-semibold mb-3">Kết quả Hành trình Đỏ 2025</h2>
          <p className="text-lg leading-relaxed mb-4">
            Theo Phó Giáo sư, Tiến sĩ Nguyễn Hà Thanh, Viện trưởng Viện Huyết học – Truyền máu Trung ương, Hành trình Đỏ 2025 được tổ chức tại 32/34 tỉnh, thành phố (tương đương 44 tỉnh, thành phố trước sáp nhập) trong tháng 6 và 7. Đến nay, chương trình đã diễn ra tại 30 tỉnh, thành phố với 41 cuộc hiến máu cấp tỉnh, tiếp nhận trên 25.000 đơn vị máu. Ngoài ra, hàng chục ngàn đơn vị máu khác được tiếp nhận từ các ngày hội hưởng ứng Hành trình Đỏ, góp phần đảm bảo nguồn máu điều trị cho các cơ sở y tế trên toàn quốc.
          </p>
          <img
            src="/blood-donation-2025.jpg"
            alt="Tình nguyện viên hiến tiểu cầu"
            className="section-image scroll-reveal"
          />
          <p className="text-sm text-gray-500 mb-4 text-center">Tình nguyện viên tham gia hiến tiểu cầu tại chương trình. Ảnh: Minh Quyết/TTXVN</p>
        </section>

        {/* Hoạt động tại Hà Nội */}
        <section className="event-item scroll-reveal" ref={(el) => (sectionRefs.current['hanoi-activities'] = el)}>
          <h2 className="text-2xl font-semibold mb-3">Hoạt động tại Hà Nội</h2>
          <p className="text-lg leading-relaxed mb-4">
            Hành trình Đỏ tại Hà Nội có điểm nổi bật là lực lượng người hiến máu chủ yếu được vận động bởi các tình nguyện viên của Hội Thanh niên Vận động hiến máu Việt Nam. Trong 12 năm qua, ngày hội “Giọt hồng tri ân” tại Hà Nội đã tiếp nhận gần 45.000 đơn vị máu. Riêng năm nay, chương trình dự kiến tiếp nhận khoảng 4.000 đơn vị máu, góp phần quan trọng vào việc cung cấp máu cho các bệnh viện.
          </p>
        </section>

        {/* Đóng góp của tình nguyện viên */}
        <section className="event-item scroll-reveal" ref={(el) => (sectionRefs.current['volunteer-contributions'] = el)}>
          <h2 className="text-2xl font-semibold mb-3">Đóng góp của tình nguyện viên</h2>
          <p className="text-lg leading-relaxed mb-4">
            Hội Thanh niên Vận động hiến máu Việt Nam không chỉ tích cực trong ngày hội “Giọt hồng tri ân” mà còn tổ chức nhiều sự kiện hiến máu khác. Trong năm 2024, Hội đã vận động được trên 65.000 đơn vị máu, và trong 6 tháng đầu năm 2025 là hơn 32.000 đơn vị máu. Hơn 1.000 tình nguyện viên đã kêu gọi bạn bè, người thân tham gia hiến máu và lan tỏa thông điệp qua mạng xã hội. Trước lễ khai mạc, chương trình đã tiếp nhận trên 2.000 đơn vị máu.
          </p>
          <img
            src="/award-ceremony-2025.jpg"
            alt="Trao giấy khen cho tình nguyện viên"
            className="section-image scroll-reveal"
          />
          <p className="text-sm text-gray-500 mb-4 text-center">Ban tổ chức tặng Giấy khen cho các tập thể, cá nhân tiêu biểu. Ảnh: Minh Quyết/TTXVN</p>
        </section>

        {/* Ý nghĩa chương trình */}
        <section className="event-item scroll-reveal" ref={(el) => (sectionRefs.current['significance'] = el)}>
          <h2 className="text-2xl font-semibold mb-3">Ý nghĩa chương trình</h2>
          <p className="text-lg leading-relaxed mb-4">
            Được tổ chức lần đầu vào tháng 7/2011, ngày hội “Giọt hồng tri ân” mang thông điệp “Mỗi trái tim – Một ngọn lửa anh hùng”, khuyến khích cộng đồng, đặc biệt là giới trẻ, tham gia hiến máu tình nguyện như một hành động tri ân các anh hùng, liệt sĩ đã hy sinh vì độc lập, tự do của Tổ quốc. Qua 12 năm, chương trình đã thu hút hàng triệu người tham gia và tiếp nhận hơn 940.000 đơn vị máu, trở thành một trong những sự kiện hiến máu lớn nhất cả nước.
          </p>
        </section>

        {/* Form Liên hệ */}
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

      <section ref={footerRef} className="footer scroll-reveal">
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
              <li><a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a></li>
            </ul>
          </div>
        </div>
        <p className="footer-copy">© 2025 HopeDonor. Mọi quyền được bảo lưu.</p>
      </section>
    </>
  );
}
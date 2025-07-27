import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import axios from 'axios';
import './newpost.css'; 

export default function RedJourneyCP() {
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
    { id: 'overview', title: 'Tổng quan Hành trình Đỏ 2024' },
    { id: 'cp-contribution', title: 'Đóng góp của C.P. Việt Nam' },
    { id: 'mission', title: 'Sứ mệnh Kết nối dòng máu Việt' },
    { id: 'activities', title: 'Hoạt động nổi bật' },
    { id: 'impact', title: 'Tầm ảnh hưởng' },
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

      <div className="red-journey-cp p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">C.P. Việt Nam và Hành trình Đỏ: Hành trình Kết nối yêu thương</h1>
        <p className="text-lg mb-4 text-center">Ngày đăng: 02/03/2024</p>
        <img
          src="/bloodguide4.jpg"
          alt="Hành trình Đỏ 2024"
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

        {/* Tổng quan */}
        <section className="section scroll-reveal" ref={(el) => (sectionRefs.current['overview'] = el)}>
          <h2 className="text-2xl font-semibold mb-3">1. Tổng quan Hành trình Đỏ 2024</h2>
          <p className="text-lg leading-relaxed mb-4">
            Hành trình Đỏ 2024 đã khép lại với những con số ấn tượng: 58 ngày tổ chức tại 51 tỉnh/thành phố, tiếp nhận hơn 128.000 đơn vị máu tại 431 điểm hiến máu. Qua 12 năm (2013-2024), chương trình đã tổ chức 580 ngày hiến máu, với 3.048 điểm hiến máu, thu hút hàng triệu lượt người tham gia và tiếp nhận trên 938.000 đơn vị máu.
          </p>
        </section>

        {/* Đóng góp của C.P. Việt Nam */}
        <section className="section scroll-reveal" ref={(el) => (sectionRefs.current['cp-contribution'] = el)}>
          <h2 className="text-2xl font-semibold mb-3">2. Đóng góp của C.P. Việt Nam</h2>
          <p className="text-lg leading-relaxed mb-4">
            Là một trong những nhà tài trợ chính, C.P. Việt Nam tự hào đồng hành cùng Hành trình Đỏ suốt 11 năm (2013-2024). Công ty đã tích cực tham gia hiến máu, tổ chức các chương trình bên lề như diễu hành tuyên truyền, trao tặng quà thực phẩm cho người tham gia, và lan tỏa tinh thần nhân ái. Tại Lễ Tổng kết Hành trình Đỏ 2024 ở Khánh Hòa, chị Lê Nhật Thùy – Chủ tịch Quỹ Hỗ trợ Từ thiện C.P. Việt Nam – nhấn mạnh rằng Hành trình Đỏ là một phần không thể thiếu trong chuỗi hoạt động “Đền ơn Tổ quốc Việt Nam” của công ty.[](https://vir.com.vn/cp-vietnam-contributes-to-red-journey-104155.html)
          </p>
         
        </section>

        {/* Sứ mệnh Kết nối dòng máu Việt */}
        <section className="section scroll-reveal" ref={(el) => (sectionRefs.current['mission'] = el)}>
          <h2 className="text-2xl font-semibold mb-3">3. Sứ mệnh Kết nối dòng máu Việt</h2>
          <p className="text-lg leading-relaxed mb-4">
            Hành trình Đỏ mang sứ mệnh “Kết nối dòng máu Việt”, đem lại sức khỏe và sinh mạng cho hàng trăm ngàn người. C.P. Việt Nam, với triết lý “Đền ơn Tổ quốc Việt Nam”, đã cùng chương trình lan tỏa tinh thần nhân đạo, yêu thương, và trách nhiệm xã hội. Công ty không chỉ hỗ trợ tài chính mà còn khuyến khích nhân viên tham gia hiến máu và các hoạt động cộng đồng.
          </p>
        </section>

        {/* Hoạt động nổi bật */}
        <section className="section scroll-reveal" ref={(el) => (sectionRefs.current['activities'] = el)}>
          <h2 className="text-2xl font-semibold mb-3">4. Hoạt động nổi bật</h2>
          <p className="text-lg leading-relaxed mb-4">
            Nhân viên C.P. Việt Nam tích cực tham gia hiến máu tại nhiều điểm, tổ chức diễu hành tuyên truyền, và trao tặng quà thực phẩm. Công ty còn chào đón các tình nguyện viên Hành trình Đỏ đến thăm các nhà máy và chi nhánh, từ đó truyền cảm hứng cho nhiều sinh viên trở thành nhân viên C.P. Việt Nam, tiếp tục lan tỏa giá trị nhân ái.
          </p>
         
        </section>

        {/* Tầm ảnh hưởng */}
        <section className="section scroll-reveal" ref={(el) => (sectionRefs.current['impact'] = el)}>
          <h2 className="text-2xl font-semibold mb-3">5. Tầm ảnh hưởng</h2>
          <p className="text-lg leading-relaxed mb-4">
            Hành trình Đỏ không chỉ mang lại giá trị hữu hình qua lượng máu tiếp nhận mà còn lan tỏa tinh thần “Một giọt máu cho đi, một cuộc đời ở lại”. C.P. Việt Nam, qua sự đồng hành, đã góp phần kiến tạo những giá trị tốt đẹp, kết nối cộng đồng và tạo nên một hành trình nhân ái bền vững.
          </p>
         
        </section>
        <div className="source-citation scroll-reveal">
          <p>Nguồn:Hành trình đỏ<a href="https://hanhtrinhdo.vn/c-p-viet-nam-va-hanh-trinh-do-hanh-trinh-ket-noi-yeu-thuong/" target="_blank" rel="noreferrer">Healthline, 2025</a></p>
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
         {/* Footer */}
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
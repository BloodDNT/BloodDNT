import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import axios from 'axios';
import './newpost.css';
import Swal from 'sweetalert2';

export default function BloodDonationNews() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const footerRef = useRef();
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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    Swal.fire('Đã sao chép link bài viết!');
  };

  // Xử lý thay đổi input trong form
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

  // Dữ liệu bài viết tĩnh
  const article = {
    title: 'Hơn 600 đơn vị máu – Hành trình Đỏ Tuyên Quang 2025 về đích rực rỡ',
    date: '19-07-2025',
    source: 'Báo Tuyên Quang, 2025',
    sourceLink: 'https://vienhuyethoc.vn/hon-600-don-vi-mau-hanh-trinh-do-tuyen-quang-2025-ve-dich-ruc-ro/',
    content: [
      {
        text: 'Ngày 19/7, Ban Chỉ đạo Vận động hiến máu tình nguyện (HMTN) tỉnh Tuyên Quang đã phối hợp với Ban tổ chức Hành trình Đỏ Trung ương tổ chức Lễ khai mạc chương trình “Hành trình Đỏ” năm 2025, ngày hội hiến máu “Giọt hồng xứ Tuyên” và lễ tôn vinh người hiến máu tiêu biểu của tỉnh.',
        image: '/news2.jpg',
        imageAlt: 'Lễ khai mạc Hành trình Đỏ Tuyên Quang 2025',
      },
      {
        text: 'Ban tổ chức cùng các đại biểu, tình nguyện viên hô vang khẩu hiệu quyết tâm của Hành trình Đỏ. Dự lễ khai mạc có đồng chí Ma Thị Thúy, Tỉnh ủy viên, Phó trưởng đoàn chuyên trách Đoàn ĐBQH tỉnh Tuyên Quang; TS.BS. Nguyễn Bá Khanh – Phó Giám đốc Trung tâm Máu quốc gia, Viện Huyết học – Truyền máu Trung ương; lãnh đạo Hội Chữ thập đỏ tỉnh Tuyên Quang và đông đảo đoàn viên, thanh niên, tình nguyện viên, công nhân viên chức, lực lượng vũ trang và nhân dân đang sinh sống và làm việc trên địa bàn.',
      },
      {
        text: 'Đây là năm thứ 12 liên tiếp Tuyên Quang tham gia “Hành trình Đỏ” – chương trình vận động hiến máu lớn nhất vào dịp hè, với sự tham gia của hàng chục tỉnh, thành trên cả nước. Tại Tuyên Quang, ngày hội đã thu hút đông đảo cán bộ, viên chức, chiến sĩ lực lượng vũ trang, đoàn viên, thanh niên, công nhân, nhân dân cùng các Câu lạc bộ tình nguyện viên vận động hiến máu tham gia và hưởng ứng tích cực.',
      },
      {
        text: 'TS.BS Nguyễn Bá Khanh – Phó Giám đốc Trung tâm Máu quốc gia, Viện Huyết học – Truyền máu Trung ương, thay mặt ban tổ chức Hành trình Đỏ Trung ương trao cờ và biểu trưng lưu niệm Hành trình Đỏ 2025 cho Ban tổ chức Hành trình Đỏ tỉnh Tuyên Quang.',
        image: '/news2.1.jpg',
        imageAlt: 'Trao cờ Hành trình Đỏ 2025',
      },
      {
        text: 'Phát huy truyền thống quê hương cách mạng, phong trào HMTN tại Tuyên Quang trong những năm qua đã được triển khai sâu rộng, bài bản với nhiều hình thức tuyên truyền sáng tạo, hiệu quả. Các đợt hiến máu được tổ chức thường xuyên, thu hút hàng nghìn tình nguyện viên tham gia, đặc biệt là lực lượng đoàn viên thanh niên.',
        image: '/news2.2.jpg',
        imageAlt: 'Tình nguyện viên phong trào HMTN Tuyên Quang',
      },
      {
        text: 'Nhờ sự chung tay của cả hệ thống chính trị và người dân, đến nay, lượng máu tiếp nhận hàng năm đã đáp ứng được trên 60% nhu cầu cấp cứu và điều trị tại các cơ sở y tế trên địa bàn tỉnh.',
      },
      {
        text: 'Đồng chí Nguyễn Hoàng Long – Chủ tịch Hội Chữ thập đỏ tỉnh Tuyên Quang, Phó Trưởng ban thường trực BCĐ Vận động HMTN tỉnh Tuyên Quang tham gia hiến máu tại chương trình.',
      },
      {
        text: 'Ban tổ chức chuẩn bị quà lưu niệm tặng người hiến máu.',
      },
      {
        text: 'Nhân dịp này, đồng chí Ma Thị Thúy – Tỉnh ủy viên, Phó trưởng đoàn chuyên trách Đoàn ĐBQH tỉnh Tuyên Quang – thay mặt Chủ tịch UBND tỉnh trao bằng khen cho 11 cá nhân có thành tích xuất sắc trong phong trào HMTN năm 2025. Hội Chữ thập đỏ tỉnh cũng trao Giấy khen cho 18 cá nhân tiêu biểu khác vì những đóng góp tích cực trong công tác vận động và tham gia hiến máu nhân đạo.',
      },
      {
        text: 'Với hơn 600 đơn vị máu được tiếp nhận tại chương trình, “Hành trình Đỏ 2025 – Giọt hồng xứ Tuyên” không chỉ là ngày hội nhân ái, mà còn là nơi lan tỏa thông điệp “Mỗi giọt máu cho đi – Một cuộc đời ở lại”; khẳng định tinh thần đoàn kết, sẻ chia và trách nhiệm cộng đồng của người dân Tuyên Quang – mảnh đất giàu truyền thống cách mạng và nhân văn sâu sắc.',
      },
    ],
  };

  return (
    <>
      <header className="header">
        <div className="logo">
          <Link to="/">
            <img src="/LogoPage.jpg" alt="Logo" loading="lazy" decoding="async" />
          </Link>
          <div className="webname">Hope Donnor🩸</div>
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
                Xin chào, {user?.FullName || user?.fullName || user?.name || "User"} <span className="ml-2">▼</span>
              </div>
              {isOpen && (
                <div className="dropdown-content user-dropdown">
                  <Link to="/register/request-blood">Register/Request</Link>
                  <Link to="/my-activities">List res/req</Link>
                  <Link to="/history">DonatationHistory</Link>
                  <Link to="/profile">👤UserProfile</Link>
                  {user?.role === 'Admin' && (
                    <Link to="/dashboard">🛠️Path to admin</Link>
                  )}
                  <Link to="/notifications">🔔Notification</Link>
                  <button className="logout-btn" onClick={handleLogout}>🚪 Đăng xuất</button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="blood-flow-guide p-6">
        <h1 className="text-3xl font-bold mb-6 text-center scroll-reveal">{article.title}</h1>
        <div className="blog-meta scroll-reveal">
          <img
            className="blog-avatar"
            src={`https://ui-avatars.com/api/?name=Admin&background=fff0f0&color=b71c1c&size=64`}
            alt="avatar"
          />
          <span style={{ fontWeight: 600 }}>Admin</span>
          <span>•</span>
          <span>{article.date}</span>
          <button className="share-button" onClick={handleShare}>
            📤 Chia sẻ
          </button>
        </div>
        <section className="scroll-reveal">
          {article.content.map((section, index) => (
            <div key={index} className="blog-content">
              <p className="text-lg leading-relaxed mb-4">{section.text}</p>
              {section.image && (
                <img
                  src={section.image}
                  alt={section.imageAlt}
                  className="content-image scroll-reveal"
                  loading="lazy"
                  decoding="async"
                />
              )}
            </div>
          ))}
        </section>

        {/* Trích dẫn nguồn */}
        <div className="source-citation scroll-reveal">
          <p>Nguồn: <a href={article.sourceLink} target="_blank" rel="noreferrer">{article.source}</a></p>
        </div>

        {/* Form Liên hệ */}
        <section className="contact-form scroll-reveal">
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
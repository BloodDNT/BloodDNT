import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import axios from 'axios';
import './newpost.css';

export default function BloodDonationTips() {
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
    { id: 'before-donation', title: 'Trước khi hiến máu' },
    { id: 'after-donation', title: 'Ngay sau khi hiến máu' },
    { id: 'abnormal-symptoms', title: 'Biểu hiện bất thường' },
    { id: 'post-donation', title: 'Sau khi rời điểm hiến máu' },
    { id: 'needle-care', title: 'Chăm sóc vị trí chọc kim' },
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
                  <button className="logout-btn" on Click={handleLogout}>🚪 Đăng xuất</button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="blood-donation-tips p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Lưu ý trước và sau hiến máu</h1>
        <p className="text-lg text-gray-600 mb-4 text-center">Ngày đăng: 13-07-2021</p>
        <img
          src="/nhommau.jpg"
          alt="Lưu ý hiến máu"
          className="hero-image scroll-reveal"
        />

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
            Hiến máu là hành động cao đẹp, giúp mang đến món quà sức khỏe vô giá cho người bệnh. Những lưu ý dưới đây sẽ giúp bạn giữ sức khỏe và yên tâm hơn trong mỗi lần hiến máu.
          </p>
        </section>

        {/* 1. Trước khi hiến máu */}
        <section className="tip-item scroll-reveal" ref={(el) => (sectionRefs.current['before-donation'] = el)}>
          <h2 className="text-2xl font-semibold mb-3">1. Trước khi hiến máu</h2>
          <ul className="list-disc ml-6 text-lg leading-relaxed">
            <li>Đêm trước hiến máu không nên thức quá khuya (ngủ ít nhất 6 tiếng).</li>
            <li>Nên ăn nhẹ, KHÔNG ăn các đồ ăn có nhiều đạm, nhiều mỡ.</li>
            <li>KHÔNG uống rượu, bia.</li>
            <li>Chuẩn bị tâm lý thực sự thoải mái.</li>
            <li>Mang theo giấy tờ tùy thân (tốt nhất là căn cước gắn chip hoặc sử dụng VNeID định danh mức 2).</li>
            <li>Uống nhiều nước.</li>
          </ul>
        </section>

        {/* 2. Ngay sau khi hiến máu */}
        <section className="tip-item scroll-reveal" ref={(el) => (sectionRefs.current['after-donation'] = el)}>
          <h2 className="text-2xl font-semibold mb-3">2. Ngay sau khi hiến máu</h2>
          <ul className="list-disc ml-6 text-lg leading-relaxed">
            <li>Duỗi thẳng, hơi nâng cao cánh tay trong 15 phút.</li>
            <li>Hạn chế gập tay trong quá trình nghỉ sau hiến máu.</li>
            <li>Nghỉ tại điểm hiến máu tối thiểu 15 phút.</li>
            <li>Uống nhiều nước.</li>
            <li>Chỉ ra về khi cảm thấy thực sự thoải mái.</li>
            <li>Nếu xuất hiện chảy máu từ vết băng cầm máu:
              <ul className="list-circle ml-6">
                <li>Nâng cánh tay lên và ấn nhẹ vào vết bông.</li>
                <li>Ngồi xuống ghế và thông báo cho nhân viên y tế để được hỗ trợ.</li>
              </ul>
            </li>
          </ul>
        </section>

        {/* 3. Biểu hiện bất thường */}
        <section className="tip-item scroll-reveal" ref={(el) => (sectionRefs.current['abnormal-symptoms'] = el)}>
          <h2 className="text-2xl font-semibold mb-3">3. Nếu có biểu hiện bất thường về sức khỏe</h2>
          <ul className="list-disc ml-6 text-lg leading-relaxed">
            <li>Ngay lập tức ngồi xuống hoặc nằm ngay xuống, tốt nhất là nâng cao chân.</li>
            <li>Giữ bình tĩnh, hít sâu, thở ra chậm.</li>
            <li>Tìm kiếm sự giúp đỡ của bất kỳ ai xung quanh đang ở gần đó.</li>
            <li>Báo ngay cho nhân viên y tế hoặc tình nguyện viên.</li>
            <li>Chỉ ngồi dậy và đứng lên khi hết cảm giác chóng mặt, mệt mỏi.</li>
          </ul>
        </section>

        {/* 4. Sau khi rời điểm hiến máu */}
        <section className="tip-item scroll-reveal" ref={(el) => (sectionRefs.current['post-donation'] = el)}>
          <h2 className="text-2xl font-semibold mb-3">4. Sau khi rời điểm hiến máu</h2>
          <ul className="list-disc ml-6 text-lg leading-relaxed">
            <li>Tiếp tục uống nhiều nước để bổ sung lại thể tích bị mất khi hiến máu.</li>
            <li>Giữ chế độ ăn uống, sinh hoạt bình thường; tăng cường sử dụng các chất dinh dưỡng bổ máu: thịt, gan, trứng, sữa, dùng thêm các thuốc bổ máu nếu có thể.</li>
            <li>Trong vòng 48 tiếng sau hiến máu:
              <ul className="list-circle ml-6">
                <li>Tránh thức khuya, dùng các chất kích thích như rượu, bia.</li>
                <li>Không hút thuốc lá trong vòng 4 tiếng.</li>
                <li>Tránh nâng vật nặng bằng tay vừa hiến máu.</li>
                <li>Tránh các hoạt động đòi hỏi nhiều thể lực như: thi đấu thể thao, đá bóng, tập thể hình, leo trèo cao…; đề phòng bị bầm tím tay và chóng mặt.</li>
              </ul>
            </li>
          </ul>
        </section>

        {/* 5. Chăm sóc vị trí chọc kim */}
        <section className="tip-item scroll-reveal" ref={(el) => (sectionRefs.current['needle-care'] = el)}>
          <h2 className="text-2xl font-semibold mb-3">5. Chăm sóc vị trí chọc kim</h2>
          <ul className="list-disc ml-6 text-lg leading-relaxed">
            <li>Băng cầm máu cần được giữ ít nhất trong 4 – 6 giờ.</li>
            <li>Trong một số trường hợp ít gặp, nếu sau khi tháo băng, vẫn có máu tươi chảy ra, hãy ấn nhẹ tay vào vị trí bông băng. Đồng thời nâng cao cánh tay 3-5 phút, sau đó băng lại. Giữ băng thêm 6 giờ nữa.</li>
            <li>Nếu sau hiến máu, quý vị thấy xuất hiện vết bầm tím tại vị trí lấy máu, đừng quá lo lắng:
              <ul className="list-circle ml-6">
                <li>Trong ngày đầu, có thể dùng đá lạnh chườm lên vị trí bị bầm tím.</li>
                <li>Sau 1 ngày, chuyển sang chườm ấm (chườm 2-3 lần/ngày, mỗi lần 10 phút). Vết bầm tím thường sẽ tự tan và biến mất sau 1 tuần.</li>
              </ul>
            </li>
          </ul>
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
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import axios from 'axios';
import './newpost.css';

export default function BloodFlowGuide() {
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
    { id: 'cayenne', title: 'Tiêu Cayenne' },
    { id: 'pomegranate', title: 'Lựu' },
    { id: 'onion', title: 'Hành tây' },
    { id: 'cinnamon', title: 'Quế' },
    { id: 'garlic', title: 'Tỏi' },
    { id: 'fish', title: 'Cá' },
    { id: 'beetroot', title: 'Củ cải' },
    { id: 'turmeric', title: 'Nghệ' },
    { id: 'leafy-greens', title: 'Rau xanh' },
    { id: 'citrus', title: 'Trái cây họ cam' },
    { id: 'walnuts', title: 'Hạt óc chó' },
    { id: 'tomatoes', title: 'Cà chua' },
    { id: 'berries', title: 'Dâu' },
    { id: 'ginger', title: 'Gừng' },
    { id: 'tips', title: 'Mẹo bổ sung' },
    { id: 'contact', title: 'Liên hệ' },
  ];

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
        <h1 className="text-3xl font-bold mb-6 text-center">4 Thực phẩm tốt nhất để tăng lưu lượng máu</h1>
        <img
          src="/news1.jpg"
          alt="Thực phẩm tăng lưu lượng máu"
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
            Lưu thông máu kém có thể xuất hiện do các tình trạng như bệnh động mạch ngoại biên (PAD), tiểu đường, béo phì, hoặc hút thuốc. Lưu lượng máu giảm gây ra các triệu chứng như đau đầu, chuột rút, tê liệt, và các vấn đề tiêu hóa. Ngoài những người có tuần hoàn máu kém, vận động viên và những người tập luyện cường độ cao cũng có thể muốn tăng lưu lượng máu để cải thiện hiệu suất và phục hồi.
          </p>
        </section>

        {/* 1. Tiêu Cayenne */}
        <section className="food-item scroll-reveal" ref={(el) => (sectionRefs.current['cayenne'] = el)}>
          <h2 className="text-2xl font-semibold mb-3">1. Tiêu Cayenne</h2>
          <p className="text-lg leading-relaxed mb-4">
            Ớt cayenne có hương vị cay nhờ capsaicin, một chất hóa học giúp hạ huyết áp và kích thích giải phóng oxit nitric, tương tự các loại thuốc giãn mạch. Capsaicin cho phép máu chảy dễ dàng hơn qua tĩnh mạch và động mạch bằng cách thư giãn các sợi cơ nhỏ trong thành mạch máu. Nghiên cứu cho thấy tiêu cayenne có thể tăng lưu thông máu, giảm tích tụ mảng bám trong động mạch, và là thành phần trong các kem bôi giảm đau do khuyến khích lưu lượng máu đến khu vực bị ảnh hưởng.
          </p>
        </section>

        {/* 2. Lựu */}
        <section className="food-item scroll-reveal" ref={(el) => (sectionRefs.current['pomegranate'] = el)}>
          <h2 className="text-2xl font-semibold mb-3">2. Lựu</h2>
          <p className="text-lg leading-relaxed mb-4">
            Lựu chứa nhiều chất chống oxy hóa polyphenol và nitrat, giúp giãn mạch máu. Tiêu thụ lựu dưới dạng nước ép, trái cây tươi, hoặc chất bổ sung có thể cải thiện lưu lượng máu và oxy hóa mô cơ, đặc biệt hữu ích cho người tập luyện cường độ cao. Một nghiên cứu trên 19 vận động viên cho thấy 1.000 mg chiết xuất lựu 30 phút trước khi tập giúp tăng lưu lượng máu, đường kính mạch máu, và hiệu suất tập luyện. Uống 500 ml nước ép lựu hàng ngày cũng giảm đau nhức, tổn thương cơ, và viêm cơ.
          </p>
        </section>

        {/* 3. Hành tây */}
        <section className="food-item scroll-reveal" ref={(el) => (sectionRefs.current['onion'] = el)}>
          <h2 className="text-2xl font-semibold mb-3">3. Hành tây</h2>
          <p className="text-lg leading-relaxed mb-4">
            Hành tây giàu flavonoid, có lợi cho sức khỏe tim mạch. Chúng giúp động mạch và tĩnh mạch mở rộng khi lưu lượng máu tăng, cải thiện lưu thông. Một nghiên cứu trên 23 người đàn ông cho thấy 4,3 gram chiết xuất hành tây mỗi ngày cải thiện lưu lượng máu và giãn động mạch sau bữa ăn. Hành tây cũng có đặc tính chống viêm, giảm viêm trong tĩnh mạch và động mạch, tăng cường lưu lượng máu và sức khỏe tim.
          </p>
        </section>

        {/* 4. Quế */}
        <section className="food-item scroll-reveal" ref={(el) => (sectionRefs.current['cinnamon'] = el)}>
          <h2 className="text-2xl font-semibold mb-3">4. Quế</h2>
          <p className="text-lg leading-relaxed mb-4">
            Quế là gia vị tính ấm, cải thiện giãn nở mạch máu và lưu lượng máu trong động mạch vành, cung cấp máu cho tim. Nghiên cứu trên chuột cho thấy 200 mg/kg chiết xuất vỏ quế mỗi ngày trong 8 tuần cải thiện hiệu suất tim và lưu lượng máu sau khi tập luyện. Ở người, 1.200 mg quế mỗi ngày giảm huyết áp tâm thu trung bình 3,4 mmHg sau 12 tuần, cải thiện lưu thông và sức khỏe tim mạch.
          </p>
        </section>

        {/* Các thực phẩm bổ sung */}
        <section className="additional-foods scroll-reveal">
          <h2 className="text-2xl font-semibold mb-4">Các thực phẩm bổ sung</h2>

          <div className="food-grid">
            <div className="food-item scroll-reveal" ref={(el) => (sectionRefs.current['garlic'] = el)}>
              <h3 className="text-xl font-semibold mb-2">5. Tỏi</h3>
              <p className="text-lg leading-relaxed">
                Tỏi, đặc biệt là hợp chất allicin, tăng lưu lượng máu và hạ huyết áp. Một nghiên cứu trên 42 người mắc bệnh động mạch vành cho thấy 1.200 mg allicin hai lần mỗi ngày trong 3 tháng cải thiện 50% lưu lượng máu qua động mạch cánh tay.
              </p>
            </div>

            <div className="food-item scroll-reveal" ref={(el) => (sectionRefs.current['fish'] = el)}>
              <h3 className="text-xl font-semibold mb-2">6. Cá</h3>
              <p className="text-lg leading-relaxed">
                Cá béo như cá hồi và cá thu giàu omega-3, thúc đẩy giải phóng oxit nitric, giãn mạch máu, và ức chế kết tụ tiểu cầu, giảm nguy cơ cục máu đông. Dầu cá liều 4.2 gram mỗi ngày trong 4 tuần cải thiện lưu lượng máu sau tập luyện.
              </p>
            </div>

            <div className="food-item scroll-reveal" ref={(el) => (sectionRefs.current['beetroot'] = el)}>
              <h3 className="text-xl font-semibold mb-2">7. Củ cải</h3>
              <p className="text-lg leading-relaxed">
                Củ cải giàu nitrat, chuyển hóa thành oxit nitric, thư giãn mạch máu, và tăng lưu lượng máu đến mô cơ. Nước ép củ cải (140 ml mỗi ngày) giảm huyết áp, thời gian đông máu, và viêm mạch ở người lớn tuổi.
              </p>
            </div>

            <div className="food-item scroll-reveal" ref={(el) => (sectionRefs.current['turmeric'] = el)}>
              <h3 className="text-xl font-semibold mb-2">8. Nghệ</h3>
              <p className="text-lg leading-relaxed">
                Curcumin trong nghệ tăng sản xuất oxit nitric, giảm stress oxy hóa và viêm. Uống 2.000 mg curcumin mỗi ngày trong 12 tuần tăng 37% lưu lượng máu ở cẳng tay và 36% ở cánh tay.
              </p>
            </div>

            <div className="food-item scroll-reveal" ref={(el) => (sectionRefs.current['leafy-greens'] = el)}>
              <h3 className="text-xl font-semibold mb-2">9. Rau xanh</h3>
              <p className="text-lg leading-relaxed">
                Rau bina và collard giàu nitrat, giúp giãn mạch và cải thiện lưu lượng máu. Tiêu thụ 845 mg nitrat từ rau bina mỗi ngày trong 7 ngày cải thiện huyết áp và lưu thông.
              </p>
            </div>

            <div className="food-item scroll-reveal" ref={(el) => (sectionRefs.current['citrus'] = el)}>
              <h3 className="text-xl font-semibold mb-2">10. Trái cây họ cam</h3>
              <p className="text-lg leading-relaxed">
                Cam, chanh, bưởi giàu flavonoid, giảm viêm, huyết áp, và độ cứng động mạch. Uống 500 ml nước cam mỗi ngày trong 1 tuần cải thiện giãn động mạch và giảm dấu hiệu viêm.
              </p>
            </div>

            <div className="food-item scroll-reveal" ref={(el) => (sectionRefs.current['walnuts'] = el)}>
              <h3 className="text-xl font-semibold mb-2">11. Hạt óc chó</h3>
              <p className="text-lg leading-relaxed">
                Hạt óc chó chứa l-arginine, ALA, và vitamin E, kích thích oxit nitric, giảm huyết áp, và cải thiện lưu lượng máu, đặc biệt ở người mắc tiểu đường.
              </p>
            </div>

            <div className="food-item scroll-reveal" ref={(el) => (sectionRefs.current['tomatoes'] = el)}>
              <h3 className="text-xl font-semibold mb-2">12. Cà chua</h3>
              <p className="text-lg leading-relaxed">
                Cà chua ức chế enzyme ACE, mở rộng mạch máu, và cải thiện lưu lượng máu. Chiết xuất cà chua giảm viêm và phá vỡ kết tụ tiểu cầu.
              </p>
            </div>

            <div className="food-item scroll-reveal" ref={(el) => (sectionRefs.current['berries'] = el)}>
              <h3 className="text-xl font-semibold mb-2">13. Dâu</h3>
              <p className="text-lg leading-relaxed">
                Dâu giàu chất chống oxy hóa và chống viêm, giảm huyết áp, nhịp tim, và kết tụ tiểu cầu, cải thiện giãn động mạch và lưu lượng máu.
              </p>
            </div>

            <div className="food-item scroll-reveal" ref={(el) => (sectionRefs.current['ginger'] = el)}>
              <h3 className="text-xl font-semibold mb-2">14. Gừng</h3>
              <p className="text-lg leading-relaxed">
                Gừng giảm huyết áp và cải thiện lưu thông. Tiêu thụ 2-4 gram gừng mỗi ngày giảm nguy cơ huyết áp cao ở 4.628 người.
              </p>
            </div>
          </div>
        </section>

        {/* Mẹo bổ sung */}
        <section className="tips scroll-reveal" ref={(el) => (sectionRefs.current['tips'] = el)}>
          <h2 className="text-2xl font-semibold mb-4">Mẹo bổ sung để cải thiện lưu lượng máu</h2>
          <ul className="list-disc ml-6 text-lg leading-relaxed">
            <li><strong>Bỏ thuốc lá</strong>: Hút thuốc gây hại cho tuần hoàn và tăng nguy cơ bệnh mãn tính.</li>
            <li><strong>Tăng hoạt động thể chất</strong>: Tập thể dục kích thích lưu lượng máu và giảm nguy cơ bệnh tim.</li>
            <li><strong>Giảm cân</strong>: Giảm béo phì giúp giảm mảng bám trong động mạch và cải thiện lưu thông.</li>
            <li><strong>Ăn uống lành mạnh</strong>: Chọn rau, chất béo lành mạnh, và thực phẩm giàu chất xơ để hỗ trợ tuần hoàn.</li>
            <li><strong>Uống đủ nước</strong>: Hydrat hóa ngăn ngừa tổn thương tế bào nội mô và viêm, cải thiện lưu lượng máu.</li>
            <li><strong>Giảm căng thẳng</strong>: Yoga, thiền, hoặc thời gian trong tự nhiên giúp kiểm soát huyết áp và tuần hoàn.</li>
          </ul>
        </section>

        {/* Trích dẫn nguồn */}
        <div className="source-citation scroll-reveal">
          <p>Nguồn: Vinmec <a href="https://www.vinmec.com/vie/bai-viet/14-thuc-pham-tot-nhat-de-tang-luu-luong-mau-vi" target="_blank" rel="noreferrer">Healthline, 2025</a></p>
        </div>

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
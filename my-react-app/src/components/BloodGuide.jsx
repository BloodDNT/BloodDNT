import React, { useContext, useMemo, useEffect, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import './BloodGuide.css';

const guideItems = [
  {
    id: 1,
    title: "Ai có thể hiến máu?",
    icon: "/bloodguide1.jpg",
    content: [
      "Công dân từ 18 đến 60 tuổi",
      "Cân nặng ≥ 45kg (nữ), ≥ 50kg (nam)",
      "Không mắc bệnh truyền nhiễm (HIV, viêm gan B/C, giang mai...)",
      "Không đang dùng thuốc kháng sinh, không có bệnh mạn tính nặng",
      "Thời gian giữa hai lần hiến máu toàn phần tối thiểu 12 tuần",
    ],
  },
  {
    id: 2,
    title: "Các loại hình hiến máu",
    icon: "/bloodguide2.jpg",
    content: [
      "Hiến máu toàn phần: phổ biến, đơn giản, mỗi lần từ 250–450ml",
      "Hiến tiểu cầu: yêu cầu máy tách, thường tại bệnh viện lớn",
      "Hiến huyết tương: hiếm gặp, yêu cầu riêng biệt",
    ],
  },
  {
    id: 3,
    title: "Trước khi hiến máu",
    icon: "/bloodguide3.jpg",
    content: [
      "Ăn nhẹ trước khi hiến 1–2 giờ (không ăn đồ dầu mỡ, không nhịn đói)",
      "Uống đủ nước",
      "Không uống rượu/bia, không thức khuya",
      "Không vận động mạnh, không đang điều trị bệnh",
    ],
  },
  {
    id: 4,
    title: "Sau khi hiến máu",
    icon: "/bloodguide4.jpg",
    content: [
      "Nghỉ tại chỗ 10–15 phút, theo dõi sức khỏe",
      "Uống nước/sữa, ăn nhẹ theo hướng dẫn",
      "Tránh vận động mạnh trong 1 ngày",
      "Không leo cao, không điều khiển máy móc phức tạp trong vài giờ đầu",
      "Có thể trở lại sinh hoạt bình thường sau 24h",
    ],
  },
  {
    id: 5,
    title: "Lợi ích khi hiến máu",
    icon: "/bloodguide5.jpg",
    content: [
      "Cứu sống người khác trong tình huống nguy cấp",
      "Kích thích tủy xương tạo máu mới, kiểm tra sức khỏe miễn phí",
      "Nhận giấy chứng nhận và quà tặng từ chương trình",
      "Tăng cảm giác tích cực, kết nối cộng đồng",
    ],
  },
  {
    id: 6,
    title: "Các câu hỏi thường gặp",
    icon: "/bloodguide6.jpg",
    content: [
      "Hiến máu có đau không? → Chỉ như kim tiêm thông thường, không gây đau lâu.",
      "Sau bao lâu có thể hiến lại? → Khoảng 3 tháng với hiến máu toàn phần.",
      "Có bị lây bệnh khi hiến máu không? → KHÔNG! Tất cả dụng cụ đều vô trùng & dùng 1 lần.",
    ],
  },
];

const GuideItem = React.memo(({ id, title, icon, content }) => (
  <div className="guide-item scroll-reveal">
    <img src={icon} alt={title} className="guide-icon" loading="lazy" decoding="async" />
    <div className="guide-content">
      <h2>{id}️⃣ {title}</h2>
      <ul>
        {content.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </div>
  </div>
));

export default function BloodGuide() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const bloodGuideSectionRef = useRef(null);
  const registerCtaRef = useRef(null);
  const memoizedGuideItems = useMemo(() => guideItems, []);

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

    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
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
                Xin chào, {user?.FullName || user?.fullName || user?.name || "User"} <span>▼</span>
              </div>
              {isOpen && (
                <div className="dropdown-content user-dropdown">
                  <Link to="/register/request-blood">Register/Request-Blood</Link>
                  <Link to="/my-activities">List res/req</Link>
                  <Link to="/history">DonatationHistory</Link>
                  <Link to="/profile">👤 Thông tin cá nhân</Link>
                  <Link to="/notifications">🔔 Thông báo</Link>
                  <button className="logout-btn" onClick={handleLogout}>🚪 Đăng xuất</button>
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
      <section className="bloodguide-section">
=======
              )}
            </div>
          )}
        </div>
      </header>

      <section className="bloodguide-section scroll-reveal" ref={bloodGuideSectionRef}>
>>>>>>> f27524238d48e673c7bec76bbde795549a2088b0
        <h1 className="title">🩸 Blood Guide</h1>
        <div className="guide-list">
          {memoizedGuideItems.map((item) => (
            <GuideItem key={item.id} {...item} />
          ))}
        </div>
        <div className="register-cta scroll-reveal" ref={registerCtaRef}>
          <Link to="/register/request-blood" className="register-button">
            Đăng ký hiến máu ngay
          </Link>
        </div>
      </section>
    </>
  );
}
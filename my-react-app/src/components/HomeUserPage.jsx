import React, { useContext, useState, useEffect, useRef } from 'react';
import './homepage.css';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import Swal from 'sweetalert2';

export default function Home() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const bannerImages = ['/background11.png', '/background12.jpg', '/background13.jpg'];
  const [currentImage, setCurrentImage] = useState(0);

  const background2Ref = useRef();
  const exploreRef = useRef();
  const footerRef = useRef();

  // Danh sách bài viết cho Explore Donation
  const articles = [
    {
      id: 1,
      title: 'Hơn 600 đơn vị máu – Hành trình Đỏ Tuyên Quang 2025',
      summary: 'Tuyên Quang tổ chức thành công Hành trình Đỏ 2025, thu hơn 600 đơn vị máu, lan tỏa tinh thần nhân ái.',
      image: '/news2.jpg',
      link: '/news-news2',
    },
    {
      id: 2,
      title: '4 Thực phẩm tốt nhất để tăng lưu lượng máu',
      summary: 'Khám phá tiêu cayenne, lựu, hành tây, và quế giúp cải thiện tuần hoàn máu hiệu quả.',
      image: '/news1.jpg',
      link: '/news-news1',
    },
    {
      id: 3,
      title: 'Lợi ích của hiến máu tình nguyện',
      summary: 'Hiến máu không chỉ cứu người mà còn mang lại lợi ích sức khỏe cho người hiến.',
      image: '/post3.jpg',
      link: '/news-news3',
    },
    {
      id: 4,
      title: 'Hành trình Đỏ 2024 – Kết nối yêu thương',
      summary: 'Hành trình Đỏ 2024 lan tỏa tinh thần nhân ái với hàng ngàn đơn vị máu được tiếp nhận.',
      image: '/post4.jpg',
      link: '/news-news4  ',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev === bannerImages.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const options = { threshold: 0.1 };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, options);

    if (background2Ref.current) observer.observe(background2Ref.current);
    if (exploreRef.current) observer.observe(exploreRef.current);
    if (footerRef.current) observer.observe(footerRef.current);
    document.querySelectorAll('.article-card').forEach(el => observer.observe(el));

    return () => {
      if (background2Ref.current) observer.unobserve(background2Ref.current);
      if (exploreRef.current) observer.unobserve(exploreRef.current);
      if (footerRef.current) observer.unobserve(footerRef.current);
      document.querySelectorAll('.article-card').forEach(el => observer.unobserve(el));
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleReachOut = () => {
    if (!user) {
      Swal.fire("Vui lòng đăng nhập để tiếp tục");
      navigate('/login');
    } else {
      navigate('/register/request-blood');
    }
  };

  const handleCheck = () => {
    if (!user) {
      Swal.fire("Vui lòng đăng nhập để tiếp tục");
      navigate('/login');
    } else {
      navigate('/blood-compatibility');
    }
  };

  return (
    <>
      <header className='header'>
        <div className='logo'>
          <Link to="/">
            <img src='/LogoPage.jpg' alt='Logo' />
          </Link>
          <div className='webname'>Hope Donnor🩸</div>
        </div>
        <nav className='menu'>
          <Link to='/bloodguide'>Blood Guide</Link>
          <div className='dropdown'>
            <Link to='/bloodknowledge' className='dropbtn'>Blood</Link>
          </div>
          <Link to='/news'>News & Events</Link>
          <Link to='/contact'>Contact</Link>
          <Link to='/about'>About Us</Link>
        </nav>
        <div className='actions'>
          {!user ? (
            <Link to='/login'><button className='login-btn'>👤 Login</button></Link>
          ) : (
            <div className="dropdown user-menu" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
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
                  <button className="logout-btn" onClick={handleLogout}>🚪 Đăng xuất</button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
      <div className='body'>
        <section className='background-1'>
          <img src={bannerImages[currentImage]} alt='Blood' className='background1-image fade-in' />
          <div className='cta-overlay'>
            <h1 className="cta-title">Hiến máu - Cứu người</h1>
            <button className="btn-cta" onClick={handleReachOut}>❤️ Liên hệ với chúng tôi</button>
          </div>
        </section>
        <section ref={background2Ref} className='background-2'>
          <div className='background-2-container'>
            <img src='/background2.jpg' alt='Blood' className='background1-image' />
            <div className='right-content'>
              <div className='content1'>Xây dựng nguồn máu an toàn và đáng tin cậy hơn</div>
              <div className='content2'>
                Việc đảm bảo nguồn máu an toàn và ổn định là yếu tố then chốt trong việc cứu sống người bệnh và nâng cao chất lượng chăm sóc y tế. Để đạt được điều này, cần sự phối hợp chặt chẽ giữa các tổ chức y tế, cộng đồng và những người hiến máu tình nguyện. Thông qua các chương trình giáo dục, sàng lọc nghiêm ngặt và đầu tư vào hệ thống lưu trữ – phân phối máu, chúng ta có thể xây dựng một hệ thống cung cấp máu bền vững, sẵn sàng đáp ứng kịp thời trong mọi tình huống khẩn cấp. Một nguồn máu đáng tin cậy không chỉ là cứu cánh cho người bệnh mà còn là nền tảng cho một hệ thống y tế nhân đạo và hiện đại.
              </div>
              <button className="btn-check" onClick={handleCheck}>Kiểm tra tương thích</button>
            </div>
          </div>
        </section>
        <section ref={exploreRef} className='explore-donation'>
          <h2 className='scroll-reveal'>Bản tin</h2>
          <div className='articles-container'>
            {articles.map(article => (
              <article key={article.id} className='article-card scroll-reveal'>
                <img src={article.image} alt={article.title} />
                <h3>{article.title}</h3>
                <p>{article.summary}</p>
                <Link to={article.link} className='read-more'>Đọc thêm</Link>
              </article>
            ))}
          </div>
        </section>
        <section ref={footerRef} className='footer'>
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
import React, { useContext, useState, useEffect, useRef } from 'react';
import './news.css';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import BlogPostForm from './BlogPostForm';
import BlogList from './BlogList';

export default function NewsEvents() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const blogSectionRef = useRef(null);
  const newsSectionRef = useRef(null);
  const eventsSectionRef = useRef(null);
  const footerRef = useRef(null);

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

    if (blogSectionRef.current) observer.observe(blogSectionRef.current);
    if (newsSectionRef.current) observer.observe(newsSectionRef.current);
    if (eventsSectionRef.current) observer.observe(eventsSectionRef.current);
    if (footerRef.current) observer.observe(footerRef.current);

    return () => {
      if (blogSectionRef.current) observer.unobserve(blogSectionRef.current);
      if (newsSectionRef.current) observer.unobserve(newsSectionRef.current);
      if (eventsSectionRef.current) observer.unobserve(eventsSectionRef.current);
      if (footerRef.current) observer.unobserve(footerRef.current);
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
            <img src="/LogoPage.jpg" alt="Logo" />
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
                Xin chào, {user?.FullName || user?.fullName || user?.name || "User"}{' '}
                <span className="ml-2">▼</span>
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
      <div className="body">
        <section className="blog-section" ref={blogSectionRef}>
          <h2>Đăng bài chia sẻ cộng đồng</h2>
          <BlogPostForm onPostSuccess={() => setReload((r) => !r)} />
          <BlogList reload={reload} />
        </section>
        <section className="news-section" ref={newsSectionRef}>
          <h2>Latest News</h2>
          <div className="news-container">
            <article className="news-card">
              <img src="/news1.jpg" alt="News 1" />
              <div className="news-content">
                <h3>Các thực phẩm bổ sung lưu lượng máu</h3>
                <p className="news-date">22-07-2024</p>
                <p>Lưu thông máu kém xuất hiện bởi tác động của một số tình trạng như bệnh động mạch ngoại biên (PAD), tiểu đường, béo phì, hút thuốc.</p>
                <a href="/news-news1" className="read-more">
                  Đọc thêm
                </a>
              </div>
            </article>
            <article className="news-card">
              <img src="/new2.jpg" alt="News 2" />
              <div className="news-content">
                <h3>New Partnership with Local Hospital</h3>
                <p className="news-date">May 15, 2025</p>
                <p>We’ve partnered with City Hospital to improve blood supply chains and support emergency needs.</p>
                <a href="/news/hospital-partnership" className="read-more">
                  Read More
                </a>
              </div>
            </article>
            <article className="news-card">
              <img src="/new3.webp" alt="News 3" />
              <div className="news-content">
                <h3>Volunteer Training Program Launched</h3>
                <p className="news-date">May 10, 2025</p>
                <p>Our new training program equips volunteers with skills to promote blood donation awareness.</p>
                <a href="/news/volunteer-training" className="read-more">
                  Read More
                </a>
              </div>
            </article>
          </div>
        </section>
        <section className="events-section" ref={eventsSectionRef}>
          <h2>Upcoming Events</h2>
          <div className="events-container">
            <article className="event-card">
              <img src="/fptu.jpg" alt="Event 1" />
              <div className="event-content">
                <h3>Community Blood Drive</h3>
                <p className="event-date">June 15, 2025 | 9:00 AM - 3:00 PM</p>
                <p className="event-location">FPT University, Q9, TP.HCM</p>
                <p>Join us for our annual blood drive to support local hospitals. Free health check-ups for all donors!</p>
                <button className="register-btn">Register Now</button>
              </div>
            </article>
        
          </div>
        </section>
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
                <li>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer">
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <p className="footer-copy">© 2025 HopeDonor. All rights reserved.</p>
        </section>
      </div>
    </>
  );
}
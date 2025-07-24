// Home.jsx
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

    return () => {
      if (background2Ref.current) observer.unobserve(background2Ref.current);
      if (exploreRef.current) observer.unobserve(exploreRef.current);
      if (footerRef.current) observer.unobserve(footerRef.current);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleReachOut = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/register/request-blood');
    }
  };
  const handleCheck = () => {
    if (!user) {
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
              <div className='content1'>Building a Safer, More Reliable Blood Supply</div>
              <div className='content2'>
                Every day, countless lives are at risk in underserved communities because of limited access to safe blood. 
                GBF partners with local organizations to strengthen their capabilities—through funding, tools, and education—while 
                promoting voluntary blood donation for long-term impact.
              </div>
              <button className="btn-check" onClick={handleCheck}>Kiểm tra tương thích</button>

            </div>
          </div>
        </section>
        <section ref={exploreRef} className='explore-donation'>
          <h2>Explore Donation</h2>
          <div className='articles-container'>
            {[1,2,3,4].map(i => (
              <article key={i} className='article-card'>
                <img src={`post${i}.jpg`} alt={`Article ${i}`} />
                <h3>Article Title {i}</h3>
                <p>Brief summary or excerpt of the article {i}...</p>
                <a href={`link-to-full-article-${i}`} target="_blank" rel="noopener noreferrer">Read more</a>
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
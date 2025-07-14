import React, { useContext, useState } from 'react';
import './homepage.css';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';

export default function Home() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout(); // gọi hàm logout trong context
    navigate('/login'); // chuyển về trang login
  };

  return (
    <>
      <header className='header'>
        {/* logo */}
        <div className='logo'>
          <Link to="/">
            <img src='/LogoPage.jpg' alt='Logo' />
          </Link>
          <div className='webname'>Hope Donnor🩸</div>
        </div>
        {/* menu */}
        <nav className='menu'>
          <Link to='/bloodguide'>Blood Guide</Link>
          <div className='dropdown'>
            <Link to='/bloodknowledge' className='dropbtn'>Blood </Link>
           
          </div>
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
                  <Link to="/profile">👤 Thông tin cá nhân</Link>
                  <Link to="/notifications">🔔 Thông báo</Link>
                  <button
                    className="logout-btn"
                    onClick={handleLogout}
                  >
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
      {/* body */}
      <div className='body'>
        <section className='background-1'>
          <img src='/background11.png' alt='Blood' className='background1-image'/>
        </section>
        <section className='background-2'>
          <div className='background-2-container'>
            <img src='/background2.jpg' alt='Blood' className='background1-image'/>
            <div className='right-content'>
              <div className='content1'>Building a Safer, More Reliable Blood Supply</div>
              <div className='content2'>
                Every day, countless lives are at risk in underserved communities because of limited access to safe blood. 
                GBF partners with local organizations to strengthen their capabilities—through funding, tools, and education—while 
                promoting voluntary blood donation for long-term impact.
              </div>
              <Link to="/blood-donation">
                <button className="btn-donate">Reach out to us</button>
              </Link>
            </div>
          </div>
        </section>
        <section className='explore-donation'>
          <h2>Explore Donation</h2>
          <div className='articles-container'>
            <article className='article-card'>
              <img src="post1.jpg" alt="Article 1" />
              <h3>Who can donate blood</h3>
              <p>Brief summary or excerpt of the article 1...</p>
              <a href="link-to-full-article-1" target="_blank" rel="noopener noreferrer">Read more</a>
            </article>
            <article className='article-card'>
              <img src="post2.jpg" alt="Article 2" />
              <h3>Giving blood for the first time</h3>
              <p>Brief summary or excerpt of the article 2...</p>
              <a href="link-to-full-article-2" target="_blank" rel="noopener noreferrer">Read more</a>
            </article>
            <article className='article-card'>
              <img src="post3.jpg" alt="Article 3" />
              <h3>Save lives. Give plasma.</h3>
              <p>Brief summary or excerpt of the article 3...</p>
              <a href="link-to-full-article-3" target="_blank" rel="noopener noreferrer">Read more</a>
            </article>
            <article className='article-card'>
              <img src="post4.jpg" alt="Article 4" />
              <h3>Why we need more donors of Black heritage</h3>
              <p>Brief summary or excerpt of the article 4...</p>
              <a href="link-to-full-article-4" target="_blank" rel="noopener noreferrer">Read more</a>
            </article>
          </div>
        </section>
        <section className='footer'>
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
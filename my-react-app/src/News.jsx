import React from 'react';
import { Link } from 'react-router-dom';
import './news.css';

export default function NewsEvents() {
  return (
    <>
      <header className='header'>
        {/* Logo */}
        <div className='logo'>
          <Link to="/">
            <img src='/LogoPage.jpg' alt='Logo' />
          </Link>
          <div className='webname'>Hope Donor 🩸</div>
        </div>
        {/* Menu */}
        <nav className='menu'>
          <Link to='/bloodguide'>Blood Guide</Link>
          <div className='dropdown'>
            <Link to='/blood' className='dropbtn'>Blood ▼</Link>
            <div className='dropdown-content'>
              <Link to='/blood/type'>Type</Link>
              <Link to='/blood/red-cells'>Red Cells</Link>
              <Link to='/blood/plasma'>Plasma</Link>
              <Link to='/blood/white-cells'>White Cells</Link>
              <Link to='/blood/knowledge'>Blood Knowledge</Link>
            </div>
          </div>
          <Link to='/news'>News & Events</Link>
          <Link to='/contact'>Contact</Link>
          <Link to='/about'>About Us</Link>
        </nav>
        {/* Login */}
        <div className='actions'>
          <Link to='/login'>
            <button className='login-btn'>👤 Login</button>
          </Link>
        </div>
      </header>
      {/* Body */}
      <div className='body'>
        {/* News Section */}
        <section className='news-section'>
          <h2>Latest News</h2>
          <div className='news-container'>
            <article className='news-card'>
              <img src='/news1.jpg' alt='News 1' />
              <div className='news-content'>
                <h3>Blood Donation Drive Success</h3>
                <p className='news-date'>May 25, 2025</p>
                <p>Our recent blood donation drive collected over 200 units of blood, helping save countless lives in the community.</p>
                <a href='/news/blood-donation-drive' className='read-more'>Read More</a>
              </div>
            </article>
            <article className='news-card'>
              <img src='/news2.jpg' alt='News 2' />
              <div className='news-content'>
                <h3>New Partnership with Local Hospital</h3>
                <p className='news-date'>May 15, 2025</p>
                <p>We’ve partnered with City Hospital to improve blood supply chains and support emergency needs.</p>
                <a href='/news/hospital-partnership' className='read-more'>Read More</a>
              </div>
            </article>
            <article className='news-card'>
              <img src='/news3.jpg' alt='News 3' />
              <div className='news-content'>
                <h3>Volunteer Training Program Launched</h3>
                <p className='news-date'>May 10, 2025</p>
                <p>Our new training program equips volunteers with skills to promote blood donation awareness.</p>
                <a href='/news/volunteer-training' className='read-more'>Read More</a>
              </div>
            </article>
          </div>
        </section>
        {/* Events Section */}
        <section className='events-section'>
          <h2>Upcoming Events</h2>
          <div className='events-container'>
            <article className='event-card'>
              <img src='/event1.jpg' alt='Event 1' />
              <div className='event-content'>
                <h3>Community Blood Drive</h3>
                <p className='event-date'>June 15, 2025 | 9:00 AM - 3:00 PM</p>
                <p className='event-location'>FPT University, Q9, TP.HCM</p>
                <p>Join us for our annual blood drive to support local hospitals. Free health check-ups for all donors!</p>
                <button className='register-btn'>Register Now</button>
              </div>
            </article>
            <article className='event-card'>
              <img src='/event2.jpg' alt='Event 2' />
              <div className='event-content'>
                <h3>Blood Donation Awareness Workshop</h3>
                <p className='event-date'>June 20, 2025 | 2:00 PM - 5:00 PM</p>
                <p className='event-location'>Community Center, Q1, TP.HCM</p>
                <p>Learn about the importance of blood donation and how you can make a difference.</p>
                <button className='register-btn'>Register Now</button>
              </div>
            </article>
          </div>
        </section>
        {/* Footer */}
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
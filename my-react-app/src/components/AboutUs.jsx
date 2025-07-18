import React, { useContext, useState } from 'react';
import './about.css';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';

export default function AboutUs() { 
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
                 <Link to='/bloodknowledge' className='dropbtn'>Blood</Link>
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
</>
);
}
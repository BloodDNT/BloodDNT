import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import axios from 'axios';
import './bloodcomp.css';

const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
const components = ['whole', 'redCells', 'plasma', 'platelets'];

const compatibility = {
  whole: {
    'O-': ['O-'],
    'O+': ['O-', 'O+'],
    'A-': ['O-', 'A-'],
    'A+': ['O-', 'O+', 'A-', 'A+'],
    'B-': ['O-', 'B-'],
    'B+': ['O-', 'O+', 'B-', 'B+'],
    'AB-': ['O-', 'A-', 'B-', 'AB-'],
    'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  },
  redCells: {
    'O-': ['O-'],
    'O+': ['O-', 'O+'],
    'A-': ['O-', 'A-'],
    'A+': ['O-', 'O+', 'A-', 'A+'],
    'B-': ['O-', 'B-'],
    'B+': ['O-', 'O+', 'B-', 'B+'],
    'AB-': ['O-', 'A-', 'B-', 'AB-'],
    'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  },
  plasma: {
    'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    'O+': ['O+', 'A+', 'B+', 'AB+'],
    'A-': ['A-', 'A+', 'AB-', 'AB+'],
    'A+': ['A+', 'AB+'],
    'B-': ['B-', 'B+', 'AB-', 'AB+'],
    'B+': ['B+', 'AB+'],
    'AB-': ['AB-', 'AB+'],
    'AB+': ['AB+'],
  },
  platelets: {
    'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    'O+': ['O+', 'A+', 'B+', 'AB+'],
    'A-': ['A-', 'A+', 'AB-', 'AB+'],
    'A+': ['A+', 'AB+'],
    'B-': ['B-', 'B+', 'AB-', 'AB+'],
    'B+': ['B+', 'AB+'],
    'AB-': ['AB-', 'AB+'],
    'AB+': ['AB+'],
  }
};

export default function BloodGuide() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState('whole');
  const [inventory, setInventory] = useState([]);
  const footerRef = useRef();

  // Lấy dữ liệu kho máu
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/blood-inventory');
        setInventory(response.data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
        setInventory([]);
      }
    };
    fetchInventory();
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

    if (footerRef.current) observer.observe(footerRef.current);

    return () => {
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

  const handleSelect = (type) => {
    setSelectedType(type);
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

      <div className="blood-compatibility p-6">
        <h2 className="text-2xl font-bold mb-4">Kiểm tra tương thích nhóm máu</h2>

        <div className="comp-buttons mb-4 flex gap-4 flex-wrap">
          {components.map((comp) => (
            <button
              key={comp}
              onClick={() => setSelectedComponent(comp)}
              className={`comp-button px-4 py-2 rounded-md text-white font-semibold transition-all duration-200 flex items-center gap-2 ${
                selectedComponent === comp
                  ? 'bg-blue-600 border-2 border-blue-800 shadow-lg'
                  : 'bg-gray-500 hover:bg-gray-600'
              }`}
            >
              {selectedComponent === comp && <span className="text-yellow-300">✔</span>}
              {comp === 'whole' ? 'Toàn phần' :
               comp === 'redCells' ? 'Hồng cầu' :
               comp === 'plasma' ? 'Huyết tương' :
               'Tiểu cầu'}
            </button>
          ))}
        </div>

        <div className="blood-type-grid grid grid-cols-2 sm:grid-cols-4 gap-4">
          {bloodTypes.map((type) => {
            const canReceive = selectedType && compatibility[selectedComponent][selectedType].includes(type);
            const isSelected = selectedType === type;

            return (
              <button
                key={type}
                onClick={() => handleSelect(type)}
                className={`blood-type-button p-4 rounded-lg border-2 text-lg font-semibold inventory-card transition-all duration-300 ${
                  isSelected ? 'bg-blue-300 border-blue-700' :
                  canReceive ? 'bg-green-300 border-blue-700' :
                  'bg-gray-100 border-gray-400'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>

        {selectedType && (
          <div className="compatibility-list mt-6 text-lg">
            Nhóm máu <strong>{selectedType}</strong> có thể nhận <strong>{
              selectedComponent === 'whole' ? 'máu toàn phần' :
              selectedComponent === 'redCells' ? 'hồng cầu' :
              selectedComponent === 'plasma' ? 'huyết tương' :
              'tiểu cầu'
            }</strong> từ:
            <ul className="list-disc ml-6 mt-2">
              {compatibility[selectedComponent][selectedType].map((donor) => (
                <li key={donor}>{donor}</li>
              ))}
            </ul>
          </div>
        )}

        {selectedType && selectedComponent && (
          <div className="inventory-section mt-8">
            <h2 className="text-2xl font-bold mb-4">Tình trạng kho máu</h2>
            <div className="inventory-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {inventory
                .filter(item => item.BloodType === selectedType && item[selectedComponent] > 0)
                .length > 0 ? (
                inventory
                  .filter(item => item.BloodType === selectedType && item[selectedComponent] > 0)
                  .map((item, index) => (
                    <div
                      key={index}
                      className="inventory-card p-4 rounded-lg border-2 text-lg font-semibold bg-white border-gray-400 shadow-md"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-red-600">🩺</span>
                        <span>{item.BloodType}</span>
                      </div>
                      <div className="mt-2">
                        <div className="text-sm">
                          {selectedComponent === 'whole' ? 'Toàn phần' :
                           selectedComponent === 'redCells' ? 'Hồng cầu' :
                           selectedComponent === 'plasma' ? 'Huyết tương' :
                           'Tiểu cầu'}: 
                          <span className="font-bold"> {item[selectedComponent]} đơn vị</span>
                        </div>
                        <div className="text-sm mt-2">
                          Tổng: <span className="font-bold">{item.total} đơn vị</span>
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-lg col-span-full text-center">Không có dữ liệu kho máu cho {selectedType} ({selectedComponent === 'whole' ? 'Toàn phần' : selectedComponent === 'redCells' ? 'Hồng cầu' : selectedComponent === 'plasma' ? 'Huyết tương' : 'Tiểu cầu'}).</p>
              )}
            </div>
          </div>
        )}

        <div className="cta-container">
          <button className="check-button" onClick={handleCheck}>
            Đăng kí ngay!
          </button>
        </div>
      </div>

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
    </>
  );
}
import React, { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import './BloodKnowledge.css';

export default function BloodKnowledge() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);
  const footerRef = useRef(null);
  const timeoutRef = useRef(null); // Ref để quản lý timeout

  useEffect(() => {
    // Cuộn lên đầu trang khi render
    window.scrollTo(0, 0);

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

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
      sectionRefs.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev); // Toggle dropdown khi click
  };

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current); // Xóa timeout khi chuột vào
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    // Trì hoãn đóng dropdown 300ms
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  const handleDropdownMouseEnter = () => {
    clearTimeout(timeoutRef.current); // Giữ dropdown mở khi chuột ở trong
  };

  const handleDropdownMouseLeave = () => {
    // Đóng dropdown sau 300ms khi chuột rời
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
<<<<<<< HEAD
   
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
=======
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
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleToggleDropdown}
            >
              <div className="dropbtn user-name">
                Xin chào, {user?.FullName || user?.fullName || user?.name || 'User'}{' '}
                <span className="ml-2">▼</span>
              </div>
              {isOpen && (
                <div
                  className="dropdown-content user-dropdown"
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  <Link to="/register/request-blood">Register/Request-Blood</Link>
                  <Link to="/my-activities">List res/req</Link>
                  <Link to="/history">DonatationHistory</Link>
                  <Link to="/profile">👤 Thông tin cá nhân</Link>
                  <Link to="/notifications">🔔 Thông báo</Link>
                  <button className="logout-btn" onClick={handleLogout}>
                    🚪 Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
>>>>>>> f27524238d48e673c7bec76bbde795549a2088b0

      <div className="body">
        <main className="blood-knowledge-container" ref={containerRef}>
          <h2>Kiến Thức Về Máu</h2>
          <section
            className="blood-section"
            ref={(el) => (sectionRefs.current[0] = el)}
          >
            <h3>Các Nhóm Máu</h3>
            <figure>
              <img src="/tebaomau3.webp" alt="Tế bào máu" className="blood-img" loading="lazy" decoding="async" />
              <figcaption className="blood-caption">Tế bào máu.</figcaption>
            </figure>
            <ul>
              <li>
                <b>Nhóm máu A</b>: Có kháng nguyên A trên bề mặt hồng cầu.
              </li>
              <li>
                <b>Nhóm máu B</b>: Có kháng nguyên B trên bề mặt hồng cầu.
              </li>
              <li>
                <b>Nhóm máu AB</b>: Có cả kháng nguyên A và B.
              </li>
              <li>
                <b>Nhóm máu O</b>: Không có kháng nguyên A, B.
              </li>
            </ul>
            <p>
              Trong máu có chất gì? Thành phần của máu bao gồm huyết cầu (hồng cầu,
              bạch cầu, tiểu cầu) và huyết tương. Thành phần của huyết tương chủ yếu
              là nước (chiếm đến 92%) và các chất quan trọng khác như:
              <br />
              Yếu tố đông máu
              <br />
              Kháng thể
              <br />
              Đường glucoza
              <br />
              Hormone
              <br />
              Chất đạm (protein)
              <br />
              Muối khoáng
              <br />
              Chất béo
              <br />
              Vitamin
            </p>
          </section>
          <section
            className="blood-section"
            ref={(el) => (sectionRefs.current[1] = el)}
          >
            <h3>Hồng Cầu (Red Blood Cells)</h3>
            <figure>
              <img src="/hongcau.webp" alt="Hồng cầu" className="blood-img" loading="lazy" decoding="async" />
              <figcaption className="blood-caption">
                Hồng cầu chiếm số lượng nhiều nhất trong số các loại tế bào máu.
              </figcaption>
            </figure>
            <p>
              Các tế bào hồng cầu có màu đỏ tươi do chứa huyết sắc tố và chiếm hơn
              40% thể tích của máu. Số lượng hồng cầu bình thường là 4,5 – 6,2
              triệu/µL ở nam và 4,0 – 5,2 triệu/µL ở nữ.
              <br />
              Hồng cầu có hình dạng đĩa, hai mặt lõm với tâm dẹt. Việc sản xuất hồng
              cầu được kiểm soát bởi erythropoietin (hormone được sản xuất chủ yếu
              bởi thận). Các tế bào hồng cầu hình thành từ tế bào gốc đầu dòng hồng
              cầu trong tủy xương, sau khi trưởng thành (khoảng 7 ngày) sẽ được giải
              phóng vào máu.
              <br />
              Không giống như nhiều tế bào khác, hồng cầu không có nhân và có thể dễ
              dàng thay đổi hình dạng để đi qua các mạch máu khác nhau trong cơ thể.
              Việc thiếu nhân khiến tế bào hồng cầu trở nên linh hoạt hơn. Tuy nhiên,
              điều này gây ảnh hưởng tuổi thọ của tế bào khi hồng cầu di chuyển qua
              các mạch máu nhỏ nhất, phá hỏng màng tế bào và làm cạn kiệt nguồn cung
              cấp năng lượng cho tế bào.
              <br />
              Trung bình hồng cầu chỉ tồn tại được 120 ngày. Hồng cầu già bị tiêu hủy
              chủ yếu ở lách và gan. Tủy xương sản sinh các hồng cầu mới để thay thế
              và duy trì lượng hồng cầu ổn định trong cơ thể.
            </p>
          </section>
          <section
            className="blood-section"
            ref={(el) => (sectionRefs.current[2] = el)}
          >
            <h3>Bạch Cầu (White Blood Cells)</h3>
            <figure>
              <img src="/bachcau.jpg" alt="Bạch cầu" className="blood-img" loading="lazy" decoding="async" />
              <figcaption className="blood-caption">
                Tế bào bạch cầu chỉ chiếm khoảng 1% tổng lượng máu.
              </figcaption>
            </figure>
            <p>
              Tế bào bạch cầu trong máu là một phần quan trọng của hệ thống miễn dịch
              tự nhiên của cơ thể nhưng chỉ chiếm khoảng 1% tổng lượng máu. Số lượng
              bạch cầu trong một microlit máu thường dao động từ 3.700 -10.500/µL. Số
              lượng bạch cầu cao hơn hoặc thấp hơn so với lượng trung bình có thể là
              dấu hiệu của một bệnh lý nào đó.
            </p>
            <ul>
              Chức năng chính của bạch cầu bao gồm:
              <li>Chống lại các loại vi trùng khác nhau như vi khuẩn, virus</li>
              <li>
                Tạo kháng thể, là những protein đặc biệt có khả năng nhận biết và
                loại bỏ các vật thể lạ, có hại (như tế bào chết, mảnh vụn mô và tế
                bào hồng cầu cũ,…)
              </li>
              <li>
                Bảo vệ cơ thể khỏi các vật thể lạ xâm nhập vào máu như các chất gây
                dị ứng
              </li>
              <li>Chống lại các tế bào bị thay đổi (đột biến) như ung thư</li>
            </ul>
            <p>
              Thời gian tồn tại của bạch cầu thay đổi từ vài giờ đến nhiều năm. Các
              tế bào bạch cầu mới liên tục được hình thành – một số ở tủy xương và
              một số ở các bộ phận khác của cơ thể như lá lách, tuyến ức và các hạch
              bạch huyết.
            </p>
            <ul>
              Các loại tế bào bạch cầu bao gồm:
              <li>Tế bào lympho</li>
              <li>Bạch cầu đơn nhân</li>
              <li>Bạch cầu ái toan</li>
              <li>Bạch cầu ái kiềm</li>
              <li>Bạch cầu trung tính</li>
            </ul>
          </section>
          <section
            className="blood-section"
            ref={(el) => (sectionRefs.current[3] = el)}
          >
            <h3>Huyết Tương (Plasma)</h3>
            <figure>
              <img src="/huyetuong.jpg" alt="Huyết Tương" className="blood-img" loading="lazy" decoding="async" />
              <figcaption className="blood-caption">Huyết Tương.</figcaption>
            </figure>
            <p>
              Huyết tương là thành phần vô cùng quan trọng, kết cấu dạng chất lỏng
              màu vàng và chứa hơn 90% nước. Ngoài ra hỗn hợp huyết tương còn chứa
              đường, chất béo, protein và muối khoáng, các men,… Các tế bào máu sẽ
              lơ lửng trong huyết tương.
              <br />
              Nước trong huyết tương có thể trao đổi tự do với tế bào cơ thể và các
              dịch ngoại bào khác. Phần nước trong huyết tương luôn có sẵn để giúp các
              mô trong cơ thể duy trì trạng thái hydrat hóa bình thường.
              <br />
              Huyết tương có chức năng vận chuyển các tế bào máu đi khắp cơ thể cùng
              với các chất dinh dưỡng, chất thải, kháng thể, protein đông máu, chất
              truyền tin hóa học như hormone và protein giúp duy trì cân bằng chất
              lỏng của cơ thể.
              <br />
              Huyết tương chứa các protein, chiếm khoảng 7% trọng lượng. Sự khác biệt
              giữa huyết tương và dịch ngoại bào của mô là hàm lượng protein cao trong
              huyết tương. Protein huyết tương tạo ra hiệu ứng thẩm thấu khiến nước có
              xu hướng di chuyển từ dịch ngoại bào vào huyết tương. Phần lớn protein
              huyết tương được sản xuất ở gan.
              <br />
              Protein huyết tương chủ yếu là albumin, một phân tử tương đối nhỏ có
              chức năng chính là giữ nước trong máu nhờ tác dụng thẩm thấu. Lượng
              albumin trong máu là yếu tố quyết định tổng thể tích huyết tương. Sự suy
              giảm albumin làm cho chất lỏng rời khỏi tuần hoàn và tích tụ, gây sưng
              mô mềm (phù nề). Albumin liên kết với một số chất khác được vận chuyển
              trong huyết tương nên đóng vai trò là protein vận chuyển không đặc hiệu.
            </p>
          </section>
          <section
            className="blood-section"
            ref={(el) => (sectionRefs.current[4] = el)}
          >
            <h3>Tiểu Cầu (Platelets)</h3>
            <figure>
              <img src="/tieucau.png" alt="Tiểu cầu" className="blood-img" loading="lazy" decoding="async" />
              <figcaption className="blood-caption">Tiểu cầu.</figcaption>
            </figure>
            <p>
              Không giống như hồng cầu và bạch cầu, tiểu cầu thực chất không phải là
              tế bào mà là những mảnh tế bào nhỏ, có hình bầu dục. Có từ 150.000
              đến 400.000 tiểu cầu/µL. Tuy nhiên, tiểu cầu chỉ tồn tại khoảng 9 ngày
              trong máu và liên tục được thay thế bằng tiểu cầu mới do tủy xương tạo
              ra.
              <br />
              Chức năng chính của tiểu cầu là tham gia quá trình đông cầm máu. Ngoài
              ra, tiểu cầu còn làm cho thành mạch máu mềm mại, dẻo dai hơn nhờ chức
              năng làm “trẻ hóa” tế bào nội mạc.
              <br />
              Khi mạch máu bị vỡ, tiểu cầu sẽ tập trung tại vị trí vết thương, dính
              vào niêm mạc mạch máu bị thương nhằm bịt kín chỗ máu chảy. Tiểu cầu kết
              hợp với các protein tạo sự đông máu, kiểm soát chảy máu bên trong cơ thể
              và trên da.
              <br />
              Quá trình tập hợp các tiểu cầu tại một vị trí nhất định sẽ hình thành
              cục máu đông. Cục máu đông chính là nền tảng để hình thành mô mới và
              thúc đẩy quá trình lành vết thương.
              <br />
              Tuy nhiên, cần lưu ý số lượng tiểu cầu cao hơn bình thường có thể gây
              đông máu không cần thiết, dẫn đến những cơn đau tim và đột quỵ. Ngược
              lại, số lượng tiểu cầu thấp hơn bình thường có thể dẫn đến chảy máu
              nhiều, khó cầm máu.
            </p>
          </section>
        </main>
        <div className="external-link" style={{ textAlign: 'center', margin: '32px 0' }}>
          <a
            href="https://tamanhhospital.vn/co-the-nguoi/mau/"
            target="_blank"
            rel="noopener noreferrer"
            className="external-link-anchor"
          >
            Tìm hiểu thêm về máu tại Tâm Anh Hospital
          </a>
        </div>
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
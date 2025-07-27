import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditRegisterDonate.css'; // nếu có CSS riêng
import Swal from 'sweetalert2';

export default function EditRegisterDonate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    DonateBloodDate: '',
    IdentificationNumber: '',
    Note: '',
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/blood-donations/detail/${id}`)
      .then((res) => {
        const d = res.data.data;
        setFormData({
          DonateBloodDate: d.DonateBloodDate?.substring(0, 10),
          IdentificationNumber: d.IdentificationNumber,
          Note: d.Note || '',
        });
      })
      .catch((err) => {
        console.error('❌ Lỗi lấy dữ liệu:', err);
        alert('Không tìm thấy đơn hiến máu!');
        navigate('/history'); // hoặc điều hướng về trang khác nếu cần
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/blood-donations/${id}`, formData);
      Swal.fire('✅ Cập nhật thành công!');
      navigate(`/donation/${id}`);
    } catch (err) {
      Swal.fire('❌ Lỗi cập nhật!');
      console.error(err);
    }
  };

  return (
    <div className="layout-wrapper">
      <main>
        <section className="edit-form-section">
          <form onSubmit={handleSubmit} className="edit-form">
            <h2>✏️ Chỉnh sửa đơn hiến máu</h2>

            <label>📅 Ngày hiến máu:</label>
            <input
              type="date"
              name="DonateBloodDate"
              value={formData.DonateBloodDate}
              onChange={handleChange}
              required
            />

            <label>🆔 CCCD:</label>
            <input
              type="text"
              name="IdentificationNumber"
              value={formData.IdentificationNumber}
              onChange={handleChange}
              required
            />

            <label>📝 Ghi chú:</label>
            <textarea
              name="Note"
              value={formData.Note}
              onChange={handleChange}
              rows={4}
              placeholder="Nhập ghi chú (nếu có)..."
            ></textarea>

            <button type="submit" className="save-btn">💾 Lưu thay đổi</button>
          </form>
        </section>
      </main>

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
  );
}

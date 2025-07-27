import React, { useState } from 'react';
import './EditRegisterDonate.css';

export default function DonationEditForm({ donation, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    DonateBloodDate: donation.DonateBloodDate?.substring(0, 10),
    IdentificationNumber: donation.IdentificationNumber || '',
    Note: donation.Note || '',
    IDBlood: donation.IDBlood || '', // Thêm nhóm máu
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:5000/api/blood-donations/${donation.IDRegister}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      alert('✅ Cập nhật thành công!');
      onUpdated(); // callback để reload danh sách
      onClose();   // đóng form
    } catch (err) {
      console.error(err);
      alert('❌ Lỗi khi cập nhật đơn!');
    }
  };

  return (
    <div className="popup-edit-form">
      <h3>✏️ Chỉnh sửa đơn #{donation.IDRegister}</h3>
      <form onSubmit={handleSubmit}>
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

        <label>🩸 Nhóm máu:</label>
        <select
          name="IDBlood"
          value={formData.IDBlood}
          onChange={handleChange}
          required
        >
          <option value="">-- Chọn nhóm máu --</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>

        <label>📝 Ghi chú:</label>
        <textarea
          name="Note"
          value={formData.Note}
          onChange={handleChange}
          rows={3}
        />

        <div className="btn-group">
          <button type="submit" className="save-btn">💾 Lưu</button>
          <button type="button" className="cancel-btn" onClick={onClose}>❌ Hủy</button>
        </div>
      </form>
    </div>
  );
}

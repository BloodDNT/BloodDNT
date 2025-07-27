import React, { useState } from 'react';
import axios from 'axios';
import './EditRequestBlood.css';

export default function RequestEditForm({ request, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    RequestDate: request.RequestDate?.substring(0, 10) || '',
    IdentificationNumber: request.IdentificationNumber || '',
    EmergencyLevel: request.EmergencyLevel || 'Normal',
    IDBlood: request.IDBlood || '',
    IDBloodComponent: request.IDBloodComponent || '',
    Note: request.Note || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/blood-requests/${request.IDRequest}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('✅ Cập nhật đơn yêu cầu thành công!');
      onUpdated();
      onClose();
    } catch (err) {
      alert('❌ Cập nhật thất bại!');
      console.error(err);
    }
  };

  return (
    <div className="popup-edit-form">
      <h3>✏️ Chỉnh sửa đơn yêu cầu #{request.IDRequest}</h3>
      <form onSubmit={handleSubmit}>
        <label>📅 Ngày yêu cầu:</label>
        <input
          type="date"
          name="RequestDate"
          value={formData.RequestDate}
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

        <label>🚨 Mức độ khẩn cấp:</label>
        <select
          name="EmergencyLevel"
          value={formData.EmergencyLevel}
          onChange={handleChange}
        >
          <option value="Urgent">Khẩn cấp</option>
          <option value="Normal">Bình thường</option>
        </select>

        <select
  name="IDBlood"
  value={formData.IDBlood}
  onChange={handleChange}
  required
>
  <option value="">-- Chọn nhóm máu --</option>
  <option value="1">A+</option>
  <option value="2">A-</option>
  <option value="3">B+</option>
  <option value="4">B-</option>
  <option value="5">AB+</option>
  <option value="6">AB-</option>
  <option value="7">O+</option>
  <option value="8">O-</option>
</select>

<select
  name="IDBloodComponent"
  value={formData.IDBloodComponent}
  onChange={handleChange}
  required
>
  <option value="">-- Chọn thành phần --</option>
  <option value="1">Hồng cầu</option>
  <option value="3">Tiểu cầu</option>
  <option value="2">Huyết tương</option>
  <option value="4">Toàn phần</option>
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

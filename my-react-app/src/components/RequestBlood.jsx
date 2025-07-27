import React, { useContext, useState } from 'react';
import './requestBlood.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext.jsx';
import axios from 'axios';

const getBloodID = (bloodType) => {
  const map = {
    'A+': 1, 'A-': 2,
    'B+': 3, 'B-': 4,
    'AB+': 5, 'AB-': 6,
    'O+': 7, 'O-': 8
  };
  return map[bloodType] || 1;
};

const getComponentID = (componentName) => {
  const map = {
    'Hồng cầu': 1,
    'Tiểu cầu': 2,
    'Huyết tương tươi đông lạnh': 3,
    'Bạch cầu': 4,
    'Toàn phần': 5
  };
  return map[componentName] || 1;
};

const getDefaultQuantity = (componentName) => {
  const defaultMap = {
    'Hồng cầu': 250,
    'Tiểu cầu': 250,
    'Huyết tương tươi đông lạnh': 200,
    'Bạch cầu': 50,
    'Toàn phần': 450
  };
  return defaultMap[componentName] || '';
};

export default function RequestBlood() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [qrImage, setQrImage] = useState('');

  const [formData, setFormData] = useState({
    IDComponents: '',
    IDBlood: '',
    Quantity: '',
    UrgencyLevel: '',
    IdentificationNumber: '',
    RequestDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'IDComponents') {
      const defaultQty = getDefaultQuantity(value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        Quantity: defaultQty
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.IDComponents || !formData.IDBlood || !formData.Quantity ||
        !formData.UrgencyLevel || !formData.IdentificationNumber || !formData.RequestDate) {
      return alert('Vui lòng điền đầy đủ thông tin');
    }

    const payload = {
      IDComponents: getComponentID(formData.IDComponents),
      IDBlood: getBloodID(formData.IDBlood),
      Quantity: parseInt(formData.Quantity),
      UrgencyLevel: formData.UrgencyLevel,
      IdentificationNumber: formData.IdentificationNumber,
      RequestDate: formData.RequestDate
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Bạn chưa đăng nhập. Vui lòng đăng nhập trước.');
        return navigate('/login');
      }

      const res = await axios.post(
        'http://localhost:5000/api/blood-requests',
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );

      alert('🩸 Gửi yêu cầu thành công!');
      setQrImage(res.data.data?.QRCode);
      setFormData({
        IDComponents: '', IDBlood: '', Quantity: '',
        UrgencyLevel: '', IdentificationNumber: '', RequestDate: ''
      });
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Gửi yêu cầu thất bại';
      alert(msg);
    }
  };

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);
  const formatDate = (date) => date.toISOString().split('T')[0];
  const minDateStr = formatDate(today);
  const maxDateStr = formatDate(maxDate);

  return (
    <div className="form-container">
     
      <form onSubmit={handleSubmit} className="blood-request-form">
        <select name="IDComponents" required value={formData.IDComponents} onChange={handleChange}>
          <option value="">-- Chọn thành phần máu --</option>
          <option value="Hồng cầu">Hồng cầu</option>
          <option value="Tiểu cầu">Tiểu cầu</option>
          <option value="Huyết tương tươi đông lạnh">Huyết tương tươi đông lạnh</option>
          <option value="Bạch cầu">Bạch cầu</option>
          <option value="Toàn phần">Toàn phần</option>
        </select>

        <select name="IDBlood" required value={formData.IDBlood} onChange={handleChange}>
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

        <input
          name="Quantity"
          type="number"
          value={formData.Quantity}
          placeholder="Số lượng (ml)"
          readOnly
        />

        <select name="UrgencyLevel" required value={formData.UrgencyLevel} onChange={handleChange}>
          <option value="">-- Mức độ khẩn cấp --</option>
          <option value="Urgent">Urgent</option>
          <option value="Normal">Normal</option>
        </select>

        <input
          name="IdentificationNumber"
          type="text"
          placeholder="Số CCCD người nhận"
          required
          value={formData.IdentificationNumber}
          onChange={handleChange}
        />

        <input
          name="RequestDate"
          type="date"
          required
          min={minDateStr}
          max={maxDateStr}
          value={formData.RequestDate}
          onChange={handleChange}
        />

        <button type="submit">📩 Gửi Yêu Cầu</button>
      </form>

    </div>
  );
}

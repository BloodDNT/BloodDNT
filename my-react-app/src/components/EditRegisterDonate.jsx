import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditRegisterDonate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    DonateBloodDate: '',
    IdentificationNumber: '',
    Note: '',
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/api/blood-donation/detail/${id}`)
      .then((res) => {
        const d = res.data.data;
        setFormData({
          DonateBloodDate: d.DonateBloodDate?.substring(0, 10),
          IdentificationNumber: d.IdentificationNumber,
          Note: d.Note || '',
        });
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/blood-donation/${id}`, formData);
      alert('✅ Cập nhật thành công!');
      navigate(`/donation/${id}`);
    } catch (err) {
      alert('❌ Lỗi cập nhật!');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>✏️ Chỉnh sửa đơn hiến máu</h2>
      <label>Ngày hiến máu:</label>
      <input type="date" name="DonateBloodDate" value={formData.DonateBloodDate} onChange={handleChange} required />

      <label>CCCD:</label>
      <input type="text" name="IdentificationNumber" value={formData.IdentificationNumber} onChange={handleChange} required />

      <label>Ghi chú:</label>
      <textarea name="Note" value={formData.Note} onChange={handleChange}></textarea>

      <button type="submit">💾 Lưu thay đổi</button>
    </form>
  );
}

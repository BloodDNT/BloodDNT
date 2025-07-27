import React, { useState } from 'react';
import './BloodDonation.css';

const BloodDonation = ({ form, onChange, onSubmit }) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!form.donateBloodDate) newErrors.donateBloodDate = 'Ngày hiến máu là bắt buộc';
    if (!form.bloodType) newErrors.bloodType = 'Nhóm máu là bắt buộc';
    if (!form.identificationNumber || !/^[0-9]{9,12}$/.test(form.identificationNumber)) {
      newErrors.identificationNumber = 'CMND/CCCD phải từ 9–12 chữ số';
    }
    if (!form.bloodPressure) newErrors.bloodPressure = 'Huyết áp bắt buộc';
    if (!form.weight || isNaN(form.weight)) newErrors.weight = 'Cân nặng bắt buộc và phải là số';

    const year = new Date(form.donateBloodDate).getFullYear();
    const currentYear = new Date().getFullYear();
    if (year !== currentYear) {
      newErrors.donateBloodDate = `Vui lòng chọn ngày trong năm ${currentYear}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <form className='register-form' onSubmit={handleSubmit}>
      <div className='form-group'>
        <input
          type='date'
          name='donateBloodDate'
          value={form.donateBloodDate}
          onChange={onChange}
          min={`${currentYear}-01-01`}
          max={`${currentYear}-12-31`}
        />
        {errors.donateBloodDate && <span className='error'>{errors.donateBloodDate}</span>}
      </div>

      <div className='form-group'>
        <select name='bloodType' value={form.bloodType} onChange={onChange}>
          <option value=''>Chọn nhóm máu</option>
          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.bloodType && <span className='error'>{errors.bloodType}</span>}
      </div>

      <div className='form-group'>
        <input
          type='text'
          name='identificationNumber'
          value={form.identificationNumber}
          onChange={onChange}
          placeholder='CMND/CCCD'
        />
        {errors.identificationNumber && <span className='error'>{errors.identificationNumber}</span>}
      </div>

      <div className='form-group'>
        <input
          type='text'
          name='bloodPressure'
          value={form.bloodPressure}
          onChange={onChange}
          placeholder='Huyết áp (ví dụ: 120/80)'
        />
        {errors.bloodPressure && <span className='error'>{errors.bloodPressure}</span>}
      </div>

      <div className='form-group'>
        <input
          type='number'
          name='weight'
          value={form.weight}
          onChange={onChange}
          placeholder='Cân nặng (kg)'
        />
        {errors.weight && <span className='error'>{errors.weight}</span>}
      </div>

      <div className='form-group'>
        <textarea
          name='medicalHistory'
          value={form.medicalHistory}
          onChange={onChange}
          placeholder='Tiền sử bệnh (nếu có)'
        />
      </div>

      <div className='form-group'>
        <textarea
          name='note'
          value={form.note}
          onChange={onChange}
          placeholder='Ghi chú thêm (nếu có)'
        />
      </div>

      <button type='submit' className='submit-btn'>Đăng ký</button>
    </form>
  );
};

export default BloodDonation; 

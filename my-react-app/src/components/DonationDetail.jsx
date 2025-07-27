import React from 'react';
import './DonationDetail.css';

export default function DonationDetail({ donation, onClose }) {
  if (!donation) return null;

  // Map IDBlood sang tên nhóm máu
  const getBloodGroupName = (id) => {
    const groups = {
      1: 'A+',
      2: 'A-',
      3: 'B+',
      4: 'B-',
      5: 'AB+',
      6: 'AB-',
      7: 'O+',
      8: 'O-',
    };
    return groups[id] || 'Không rõ';
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <div className="popup-header">
          <h2>PHIẾU ĐĂNG KÝ HIẾN MÁU</h2>
          <button className="close-btn" onClick={onClose}>&#10006;</button>
        </div>

        <hr />

        <div className="section">
          <h3>🪘 Thông Tin Đăng Ký</h3>
          <p><strong>Mã đơn:</strong> {donation.IDRegister}</p>
          <p><strong>Ngày đăng ký:</strong> {new Date(donation.DonateBloodDate).toLocaleDateString()}</p>
          <p><strong>Trạng thái:</strong> {donation.Status}</p>
          <p><strong>Ghi chú:</strong> {donation.Note || 'Không có'}</p>
        </div>

        <div className="section">
          <h3>👤 Thông Tin Người Hiến</h3>
          <p><strong>ID người dùng:</strong> {donation.IDUser}</p>
          <p><strong>Nhóm máu:</strong> {donation.IDBlood} - {getBloodGroupName(donation.IDBlood)}</p>
          <p><strong>CCCD:</strong> {donation.IdentificationNumber}</p>
           <p><strong>SĐT:</strong> {donation.PhoneNumber}</p>
          {donation.User && (
            <>
              <p><strong>Họ tên:</strong> {donation.User.FullName}</p>
              {/* <p><strong>Email:</strong> {donation.User.Email}</p> */}
             
              <p><strong>Địa chỉ:</strong> {donation.User.Address}</p>
              <p><strong>Giới tính:</strong> {donation.User.Gender}</p>
            </>
          )}
        </div>

     
       
      </div>
    </div>
  );
}

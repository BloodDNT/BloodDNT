// RequestDetail.jsx
import React from 'react';
import './RequestDetail.css';

export default function RequestDetail({ request, onClose }) {
  if (!request) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <div className="popup-header">
          <h2>PHIẾU YÊU CẦU NHẬN MÁU</h2>
          <button className="close-btn" onClick={onClose}>\u2716</button>
        </div>

        <hr />

        <div className="section">
          <h3>📋 Thông Tin Đơn Yêu Cầu</h3>
          <p><strong>Mã đơn:</strong> {request.IDRequest}</p>
          <p><strong>Trạng thái:</strong> {request.Status}</p>
          <p><strong>Ngày yêu cầu:</strong> {new Date(request.RequestDate).toLocaleDateString()}</p>
          <p><strong>Số lượng:</strong> {request.Quantity}</p>
          <p><strong>Mức độ khẩn cấp:</strong> {request.UrgencyLevel}</p>
          <p><strong>CCCD người nhận:</strong> {request.IdentificationNumber}</p>
        </div>

        <div className="section">
          <h3>👤 Thông Tin Người Nhận</h3>
          <p><strong>ID người dùng:</strong> {request.IDUser}</p>
          <p><strong>Nhóm máu:</strong> {request.IDBlood}</p>
          <p><strong>Thành phần máu:</strong> {request.IDComponents}</p>
          {request.User && (
            <>
              <p><strong>Họ tên:</strong> {request.User.FullName}</p>
              <p><strong>Email:</strong> {request.User.Email}</p>
              <p><strong>SĐT:</strong> {request.User.PhoneNumber}</p>
              <p><strong>Địa chỉ thường trú:</strong> {request.User.Address}</p>
              <p><strong>Giới tính:</strong> {request.User.Gender}</p>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

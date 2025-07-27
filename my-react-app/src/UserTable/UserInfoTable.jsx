// src/components/UserInfoTable.jsx
import React from 'react';
import './UserInfoTable.css';

export default function UserInfoTable({ user }) {
  return (
    <table className="user-info-table">
      <tbody>
        <tr><th>Họ tên</th><td>{user?.fullName || user?.FullName || user?.name || "Chưa đăng nhập"}</td></tr>
        <tr><th>Email</th><td>{user?.email || user?.Email || "Không có thông tin"}</td></tr>
        <tr><th>Số điện thoại</th><td>{user?.phoneNumber || user?.PhoneNumber || "Không có thông tin"}</td></tr>
        <tr><th>Ngày sinh</th><td>{user?.dateOfBirth || user?.DateOfBirth || "Không có thông tin"}</td></tr>
        <tr><th>Giới tính</th><td>{user?.gender || user?.Gender || "Không có thông tin"}</td></tr>
        <tr><th>Nhóm máu</th><td>{user?.bloodType || user?.BloodType || "Chưa cập nhật"}</td></tr>
        <tr><th>Địa chỉ</th><td>{user?.address || user?.Address || "Không có thông tin"}</td></tr>
      </tbody>
    </table>
  );
}


import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './RequestDetail.css';

export default function RequestDetail() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const detailRef = useRef();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/blood-requests/detail/${id}`)
      .then((res) => {
        setRequest(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ Lỗi khi gọi API:', err);
        setLoading(false);
      });
  }, [id]);

  const exportPDF = async () => {
    const input = detailRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('Phieu_Yeu_Cau_Nhan_Mau.pdf');
  };

  if (loading) return <p>⏳ Đang tải thông tin đơn yêu cầu...</p>;
  if (!request) return <p>❌ Không tìm thấy đơn yêu cầu máu.</p>;

  return (
    <div className="request-wrapper">
      <div className="request-detail" ref={detailRef}>
        <div className="header-section">
          <img src="/LogoPage.jpg" alt="Logo" className="blood-logo" />
          <div>
            <h2>PHIẾU YÊU CẦU NHẬN MÁU</h2>
            <p className="sub-title">Blood Request Certificate</p>
          </div>
        </div>

        <hr className="divider" />

        <div className="section">
          <h3>📋 Thông Tin Đơn Yêu Cầu</h3>
          <p><strong>Mã đơn:</strong> {request.IDRequest}</p>
          <p><strong>Trạng thái:</strong> {request.Status}</p>
          <p><strong>Ngày yêu cầu:</strong> {request.RequestDate}</p>
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
              <p><strong>Ngày đăng ký:</strong> {new Date(request.RequestDate).toLocaleDateString()}</p>

              
            </>
          )}
        </div>

        {request.QRCodeValue && (
          <div className="qr-section">
            <h4>🔒 Mã Xác Nhận QR</h4>
            <img src={request.QRCodeValue} alt="QR Code" className="qr-code" />
          </div>
        )}
      </div>

      <button onClick={exportPDF} className="download-btn">
        📄 Tải PDF Phiếu Yêu Cầu
      </button>
    </div>
  );
}
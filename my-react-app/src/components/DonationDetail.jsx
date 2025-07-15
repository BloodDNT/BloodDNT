import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './DonationDetail.css';

export default function DonationDetail() {
  const { id } = useParams();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const detailRef = useRef();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/blood-donations/detail/${id}`)
      .then((res) => {
        setDonation(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ Lỗi khi gọi API:', err);
        setLoading(false);
      });
  }, [id]);

  const exportPDF = async () => {
    const input = detailRef.current;
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('Phieu_Dang_Ky_Hien_Mau.pdf');
  };

  const handleCancel = async () => {
    const confirmCancel = window.confirm("Bạn có chắc chắn muốn huỷ đơn hiến máu này?");
    if (!confirmCancel) return;

    try {
      await axios.put(`http://localhost:5000/api/blood-donations/cancel/${donation.IDRegister}`);
      alert('✅ Đơn hiến máu đã được huỷ thành công!');
      window.location.reload();
    } catch (error) {
      console.error("❌ Lỗi huỷ đơn:", error);
      alert("Không thể huỷ đơn, vui lòng thử lại.");
    }
  };

  if (loading) return <p>⏳ Đang tải thông tin đơn hiến máu...</p>;
  if (!donation) return <p>❌ Không tìm thấy đơn hiến máu.</p>;

  return (
    <div className="request-wrapper">
      <div className="request-detail" ref={detailRef}>
        <div className="header-section">
          <img src="/LogoPage.jpg" alt="Logo" className="blood-logo" />
          <div>
            <h2>PHIẾU ĐĂNG KÝ HIẾN MÁU</h2>
            <p className="sub-title">Blood Donation Certificate</p>
          </div>
        </div>

        <hr className="divider" />

        <div className="section">
          <h3>🩸 Thông Tin Đăng Ký</h3>
          <p><strong>Mã đơn:</strong> {donation.IDRegister}</p>
          <p><strong>Ngày đăng ký:</strong> {donation.DonateBloodDate}</p>
          <p><strong>Trạng thái:</strong> {donation.Status}</p>
          <p><strong>Ghi chú:</strong> {donation.Note}</p>
        </div>

        <div className="section">
          <h3>👤 Thông Tin Người Hiến</h3>
          <p><strong>ID người dùng:</strong> {donation.IDUser}</p>
          <p><strong>Nhóm máu:</strong> {donation.IDBlood}</p>
          <p><strong>CCCD:</strong> {donation.IdentificationNumber}</p>
          {donation.User && (
            <>
              <p><strong>Họ tên:</strong> {donation.User.FullName}</p>
              <p><strong>Email:</strong> {donation.User.Email}</p>
              <p><strong>SĐT:</strong> {donation.User.PhoneNumber}</p>
              <p><strong>Địa chỉ thường trú:</strong> {donation.User.Address}</p>
              <p><strong>Giới tính:</strong> {donation.User.Gender}</p>
              <p><strong>Ngày đăng ký:</strong> {new Date(donation.DonateBloodDate).toLocaleDateString()}</p>
            </>
          )}
        </div>

        {donation.QRCode && (
          <div className="qr-section">
            <h4>🔒 Mã Xác Nhận QR</h4>
            <img src={donation.QRCode} alt="QR Code" className="qr-code" />
          </div>
        )}
      </div>

      {donation.Status !== 'Cancelled' && (
        <div className="btn-group">
          <button onClick={handleCancel} className="cancel-btn">
            ❌ Huỷ đơn
          </button>
          <Link to={`/donation/edit/${donation.IDRegister}`}>
            <button className="edit-btn">✏️ Chỉnh sửa đơn</button>
          </Link>
        </div>
      )}

      <button onClick={exportPDF} className="download-btn">
        📄 Tải PDF Phiếu Hiến Máu
      </button>
    </div>
  );
}

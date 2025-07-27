import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserActivityPage.css';
import DonationDetail from './DonationDetail';
import RequestDetail from './RequestDetail';
import DonationEditForm from './DonationEditForm';
import RequestEditForm from './RequestEditForm';

export default function UserActivityPage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [realHistories, setRealHistories] = useState([]);
  const [activeTab, setActiveTab] = useState("donations");
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [editingDonation, setEditingDonation] = useState(null);
  const [editingRequest, setEditingRequest] = useState(null);

  const itemsPerPage = 5;
  const [donationPage, setDonationPage] = useState(1);
  const [requestPage, setRequestPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);

  const [donationFilter, setDonationFilter] = useState('All');
  const [requestFilter, setRequestFilter] = useState('All');
  const [historyFilter, setHistoryFilter] = useState('All');

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (!user?.IDUser) return;

    axios.get(`http://localhost:5000/api/user-activities/${user.IDUser}`)
      .then((res) => {
        setDonations(res.data.donations || []);
        setRequests(res.data.requests || []);
      })
      .catch((err) => console.error('❌ Lỗi lấy hoạt động:', err));

    axios.get(`http://localhost:5000/api/donation-history/${user.IDUser}`)
      .then((res) => setRealHistories(res.data || []))
      .catch((err) => console.error('❌ Lỗi lấy lịch sử hiến máu:', err));

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [user]);

  const getCountdownText = (nextDate) => {
    const target = new Date(nextDate);
    const diff = target - now;

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Bạn có chắc muốn huỷ đơn hiến máu này?')) return;
    try {
      await axios.put(`http://localhost:5000/api/blood-donations/${id}`, { Status: 'Cancelled' });
      alert('✅ Đã huỷ đơn!');
      setDonations(prev => prev.map(d => d.IDRegister === id ? { ...d, Status: 'Cancelled' } : d));
    } catch (err) {
      alert('❌ Huỷ đơn thất bại!');
    }
  };

  const handleCancelRequest = async (id) => {
    if (!window.confirm('Bạn có chắc muốn huỷ đơn yêu cầu máu này?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/blood-requests/cancel/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Đã huỷ đơn yêu cầu!');
      setRequests(prev => prev.map(r => r.IDRequest === id ? { ...r, Status: 'Cancelled' } : r));
    } catch (err) {
      alert('❌ Huỷ đơn yêu cầu thất bại!');
    }
  };

  const paginate = (data, page) => {
    const start = (page - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  };

  const filterData = (data, filter) => {
    if (filter === 'All') return data;
    return data.filter(item => item.Status === filter);
  };

  const renderPagination = (page, setPage, totalItems) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return (
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>⬅️ Trước</button>
        <span>Trang {page} / {totalPages}</span>
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Sau ➡️</button>
      </div>
    );
  };

  const renderDonationsTable = () => {
    const filtered = filterData(donations, donationFilter);
    const paginated = paginate(filtered, donationPage);
    return (
      <>
        <div className="filter-row">
          <label>Lọc trạng thái:</label>
          <select value={donationFilter} onChange={e => { setDonationFilter(e.target.value); setDonationPage(1); }}>
            <option value="All">Tất cả</option>
            <option value="Pending">Chờ duyệt</option>
            <option value="Approved">Đã duyệt</option>
            <option value="Completed">Hoàn thành</option>
            <option value="Cancelled">Đã huỷ</option>
          </select>
        </div>
        <table className="table-custom">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Ngày hiến</th>
              <th>Trạng thái</th>
              <th>Ghi chú</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(d => (
              <tr key={d.IDRegister}>
                <td>#{d.IDRegister}</td>
                <td>{new Date(d.DonateBloodDate).toLocaleDateString("vi-VN")}</td>
                <td>{d.Status}</td>
                <td>{d.Note || "Không có"}</td>
                <td>
                  <button onClick={() => setSelectedDonation(d)}>Xem</button>
                  {d.Status !== "Cancelled" && (
                    <>
                      <button onClick={() => setEditingDonation(d)}>Sửa</button>
                      <button onClick={() => handleCancel(d.IDRegister)}>Huỷ</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {renderPagination(donationPage, setDonationPage, filtered.length)}
      </>
    );
  };

  const renderRequestsTable = () => {
    const filtered = filterData(requests, requestFilter);
    const paginated = paginate(filtered, requestPage);
    return (
      <>
        <div className="filter-row">
          <label>Lọc trạng thái:</label>
          <select value={requestFilter} onChange={e => { setRequestFilter(e.target.value); setRequestPage(1); }}>
            <option value="All">Tất cả</option>
            <option value="Pending">Chờ duyệt</option>
            <option value="Approved">Đã duyệt</option>
            <option value="Completed">Hoàn thành</option>
            <option value="Cancelled">Đã huỷ</option>
          </select>
        </div>
        <table className="table-custom">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Ngày yêu cầu</th>
              <th>Trạng thái</th>
              <th>Ghi chú</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(r => (
              <tr key={r.IDRequest}>
                <td>#{r.IDRequest}</td>
                <td>{new Date(r.RequestDate).toLocaleDateString("vi-VN")}</td>
                <td>{r.Status}</td>
                <td>{r.Note || "Không có"}</td>
                <td>
                  <button onClick={() => setSelectedRequest(r)}>Xem</button>
                  {r.Status !== "Cancelled" && (
                    <>
                      <button onClick={() => setEditingRequest(r)}>Sửa</button>
                      <button onClick={() => handleCancelRequest(r.IDRequest)}>Huỷ</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {renderPagination(requestPage, setRequestPage, filtered.length)}
      </>
    );
  };

  const renderHistoryTable = () => {
    const filtered = filterData(realHistories, historyFilter);
    const paginated = paginate(filtered, historyPage);
    return (
      <>
        <div className="filter-row">
          <label>Lọc trạng thái:</label>
          <select value={historyFilter} onChange={e => { setHistoryFilter(e.target.value); setHistoryPage(1); }}>
            <option value="All">Tất cả</option>
            <option value="Approved">Đã duyệt</option>
            <option value="Completed">Hoàn thành</option>
            <option value="Cancelled">Đã huỷ</option>
          </select>
        </div>
        <table className="table-custom">
          <thead>
            <tr>
              <th>Mã lịch sử</th>
              <th>Ngày hiến</th>
              <th>Nhóm máu</th>
              <th>Thể tích</th>
              <th>CMND/CCCD</th>
              <th>Trạng thái</th>
              <th>Ghi chú</th>
              <th>Hiến lại</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(h => (
              <tr key={h.IDHistory}>
                <td>#{h.IDHistory}</td>
                <td>{new Date(h.DonateBloodDate).toLocaleDateString("vi-VN")}</td>
                <td>{h.BloodTypeName}</td>
                <td>{h.Volume}</td>
                <td>{h.IdentificationNumber}</td>
                <td>{h.Status}</td>
                <td>{h.Description || "Không có"}</td>
                <td>
                {h.NextDonateDate ? (
  new Date(h.NextDonateDate) <= now ? (
    <span style={{ color: 'green', fontWeight: 'bold' }}>
      ✅ Đã có thể hiến lại
    </span>
  ) : (
    <span style={{ color: 'Red', fontWeight: 'bold' }}>
       {getCountdownText(h.NextDonateDate)}
    </span>
  )
) : (
  <span style={{ color: 'gray' }}>Không rõ</span>
)}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {renderPagination(historyPage, setHistoryPage, filtered.length)}
      </>
    );
  };

  return (
    <div className="activity-wrapper">
      <h2 className="title">📊 Hoạt động của bạn</h2>

      <div className="tab-buttons">
        <button onClick={() => setActiveTab("donations")} className={activeTab === "donations" ? "active" : ""}>🩸 Đơn Hiến Máu</button>
        <button onClick={() => setActiveTab("requests")} className={activeTab === "requests" ? "active" : ""}>💉 Đơn Yêu Cầu</button>
        <button onClick={() => setActiveTab("history")} className={activeTab === "history" ? "active" : ""}>📜 Lịch Sử Hiến Máu</button>
      </div>

      <div className="table-area">
        {activeTab === "donations" && renderDonationsTable()}
        {activeTab === "requests" && renderRequestsTable()}
        {activeTab === "history" && renderHistoryTable()}
      </div>

      {selectedDonation && (
        <DonationDetail donation={selectedDonation} onClose={() => setSelectedDonation(null)} />
      )}
      {selectedRequest && (
        <RequestDetail request={selectedRequest} onClose={() => setSelectedRequest(null)} />
      )}

      {editingDonation && (
        <div className="overlay">
          <div className="popup">
            <DonationEditForm
              donation={editingDonation}
              onClose={() => setEditingDonation(null)}
              onUpdated={() => {
                axios.get(`http://localhost:5000/api/user-activities/${user.IDUser}`).then((res) => {
                  setDonations(res.data.donations || []);
                  setRequests(res.data.requests || []);
                  setEditingDonation(null);
                });
              }}
            />
          </div>
        </div>
      )}

      {editingRequest && (
        <div className="overlay">
          <div className="popup">
            <RequestEditForm
              request={editingRequest}
              onClose={() => setEditingRequest(null)}
              onUpdated={() => {
                axios.get(`http://localhost:5000/api/user-activities/${user.IDUser}`).then((res) => {
                  setDonations(res.data.donations || []);
                  setRequests(res.data.requests || []);
                  setEditingRequest(null);
                });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

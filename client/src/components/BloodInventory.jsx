import React, { useState, useEffect } from "react";
import axios from "axios";

const BloodInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [summary, setSummary] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [newInventory, setNewInventory] = useState({
    idBlood: "",
    quantity: "",
    donationDate: "",
    expiryDate: "",
    finalTestResult: "",
  });
  const [removeData, setRemoveData] = useState({
    idBlood: "",
    quantity: "",
    purpose: "",
  });
  const [message, setMessage] = useState("");
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [selectedBlood, setSelectedBlood] = useState(null);

  useEffect(() => {
    fetchSummary();
    fetchAlerts();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/kho-mau/summary"
      );
      const dataWithIdBlood = response.data.map((item) => ({
        ...item,
        IDBlood: item.IDBlood || item.idBlood,
      }));
      setInventory(dataWithIdBlood);
      console.log("Dữ liệu kiểm kê:", dataWithIdBlood);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin kho máu:", error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/kho-mau/alerts"
      );
      setAlerts(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy cảnh báo:", error);
    }
  };

  const fetchTransactionHistory = async (idBlood) => {
    if (!idBlood || isNaN(parseInt(idBlood))) {
      setMessage("IDBlood không hợp lệ!");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:3001/api/kho-mau/history/${idBlood}`
      );
      setTransactionHistory(response.data);
      setSelectedBlood(idBlood);
      setMessage("");
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử giao dịch:", error);
      setMessage(
        error.response?.data?.error || "Lỗi khi lấy lịch sử giao dịch"
      );
      setTransactionHistory([]);
      setSelectedBlood(null);
    }
  };

  const handleAddInventory = async () => {
    if (!newInventory.expiryDate) {
      setMessage("Vui lòng nhập hạn sử dụng!");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3001/api/kho-mau/", {
        idBlood: parseInt(newInventory.idBlood),
        quantity: parseInt(newInventory.quantity),
        donationDate: newInventory.donationDate,
        expiryDate: newInventory.expiryDate,
        finalTestResult: newInventory.finalTestResult,
      });
      if (response.status === 200) {
        setMessage("Nhập kho máu thành công!");
        setNewInventory({
          idBlood: "",
          quantity: "",
          donationDate: "",
          expiryDate: "",
          finalTestResult: "",
        });
        fetchSummary();
      }
    } catch (error) {
      console.error("Lỗi khi nhập kho máu:", error);
      setMessage(
        "Nhập kho máu không thành công: " +
          (error.response ? error.response.data.error : error.message)
      );
    }
  };

  const handleRemoveInventory = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3001/api/kho-mau/remove/${removeData.idBlood}`,
        {
          quantity: parseInt(removeData.quantity),
          purpose: removeData.purpose,
        }
      );
      if (response.status === 200) {
        setMessage("Xuất kho máu thành công!");
        setRemoveData({ idBlood: "", quantity: "", purpose: "" });
        fetchSummary();
      }
    } catch (error) {
      console.error("Lỗi khi xuất kho máu:", error);
      setMessage(
        "Xuất kho máu không thành công: " +
          (error.response ? error.response.data.error : error.message)
      );
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Quản Lý Kho Máu</h2>
      <div className="flex flex-col gap-6">
        {message && (
          <p
            className={
              message.includes("thành công") ? "text-green-500" : "text-red-500"
            }
          >
            {message}
          </p>
        )}

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Nhập Kho Máu</h3>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="IDBlood"
              value={newInventory.idBlood}
              onChange={(e) =>
                setNewInventory({ ...newInventory, idBlood: e.target.value })
              }
              className="border p-2 rounded text-sm"
            />
            <input
              type="text"
              placeholder="Số lượng"
              value={newInventory.quantity}
              onChange={(e) =>
                setNewInventory({ ...newInventory, quantity: e.target.value })
              }
              className="border p-2 rounded text-sm"
            />
            <input
              type="date"
              value={newInventory.donationDate}
              onChange={(e) =>
                setNewInventory({
                  ...newInventory,
                  donationDate: e.target.value,
                })
              }
              className="border p-2 rounded text-sm"
            />
            <input
              type="date"
              value={newInventory.expiryDate}
              onChange={(e) =>
                setNewInventory({ ...newInventory, expiryDate: e.target.value })
              }
              className="border p-2 rounded text-sm"
              required
            />
            <input
              type="text"
              placeholder="Kết quả xét nghiệm"
              value={newInventory.finalTestResult}
              onChange={(e) =>
                setNewInventory({
                  ...newInventory,
                  finalTestResult: e.target.value,
                })
              }
              className="border p-2 rounded text-sm"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
              onClick={handleAddInventory}
            >
              Nhập Kho
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Xuất Kho Máu</h3>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="IDBlood"
              value={removeData.idBlood}
              onChange={(e) =>
                setRemoveData({ ...removeData, idBlood: e.target.value })
              }
              className="border p-2 rounded text-sm"
            />
            <input
              type="text"
              placeholder="Số lượng"
              value={removeData.quantity}
              onChange={(e) =>
                setRemoveData({ ...removeData, quantity: e.target.value })
              }
              className="border p-2 rounded text-sm"
            />
            <input
              type="text"
              placeholder="Mục đích"
              value={removeData.purpose}
              onChange={(e) =>
                setRemoveData({ ...removeData, purpose: e.target.value })
              }
              className="border p-2 rounded text-sm"
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded text-sm"
              onClick={handleRemoveInventory}
            >
              Xuất Kho
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Kiểm Kê Kho Máu</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Nhóm Máu</th>
                  <th className="border p-2">Số lượng</th>
                  <th className="border p-2">Hạn sử dụng sớm nhất</th>
                  <th className="border p-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={`${item.IDBlood}`} className="hover:bg-gray-50">
                    <td className="border p-2">{item.BloodType}</td>
                    <td className="border p-2">{item.TotalQuantity}</td>
                    <td className="border p-2">
                      {item.EarliestExpiry
                        ? new Date(item.EarliestExpiry).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="border p-2">
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                        onClick={() => fetchTransactionHistory(item.IDBlood)}
                        disabled={!item.IDBlood}
                      >
                        Xem lịch sử
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selectedBlood && transactionHistory.length > 0 && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">
                Lịch Sử Giao Dịch (IDBlood: {selectedBlood})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">ID Giao dịch</th>
                      <th className="border p-2">Ngày giao dịch</th>
                      <th className="border p-2">Loại</th>
                      <th className="border p-2">Số lượng</th>
                      <th className="border p-2">Mục đích</th>
                      <th className="border p-2">Nhóm Máu</th>
                      <th className="border p-2">Hạn sử dụng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactionHistory.map((transaction) => (
                      <tr
                        key={transaction.IDTransaction}
                        className="hover:bg-gray-50"
                      >
                        <td className="border p-2">
                          {transaction.IDTransaction}
                        </td>
                        <td className="border p-2">
                          {new Date(
                            transaction.TransactionDate
                          ).toLocaleDateString()}
                        </td>
                        <td className="border p-2">
                          {transaction.TransactionType}
                        </td>
                        <td className="border p-2">{transaction.Quantity}</td>
                        <td className="border p-2">
                          {transaction.Purpose || "N/A"}
                        </td>
                        <td className="border p-2">
                          {transaction.BloodType || "N/A"}
                        </td>
                        <td className="border p-2">
                          {transaction.ExpiryDate
                            ? new Date(
                                transaction.ExpiryDate
                              ).toLocaleDateString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                className="bg-gray-500 text-white px-2 py-1 mt-2 rounded text-xs"
                onClick={() => setSelectedBlood(null)}
              >
                Đóng
              </button>
            </div>
          )}
          {selectedBlood && transactionHistory.length === 0 && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
              <p className="text-red-500 text-sm">
                Không có lịch sử giao dịch cho IDBlood: {selectedBlood}
              </p>
              <button
                className="bg-gray-500 text-white px-2 py-1 mt-2 rounded text-xs"
                onClick={() => setSelectedBlood(null)}
              >
                Đóng
              </button>
            </div>
          )}
        </div>

        {alerts.length > 0 && (
          <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Cảnh Báo Kho Máu</h3>
            <ul>
              {alerts.map((alert) => (
                <li key={`${alert.IDBlood}`} className="text-red-600">
                  {alert.BloodType}: Số lượng {alert.TotalQuantity} (Hạn sớm
                  nhất: {new Date(alert.EarliestExpiry).toLocaleDateString()})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodInventory;

import React, { useState, useEffect } from "react";
import axios from "axios";

const DonationRequestList = ({ onSelectRequest }) => {
  const [donDangKy, setDonDangKy] = useState([]);
  const [trangThai, setTrangThai] = useState("");
  const [lyDo, setLyDo] = useState("");
  const [donDuocChon, setDonDuocChon] = useState(null);
  const [healthDeclarations, setHealthDeclarations] = useState([]); // Lưu tất cả thông tin khai báo
  const [healthDeclaration, setHealthDeclaration] = useState(null); // State để hiển thị thông tin chi tiết
  const [noDeclarationMessage, setNoDeclarationMessage] = useState(""); // Thông báo nếu không có khai báo

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/don-dang-ky")
      .then((response) => setDonDangKy(response.data))
      .catch((error) => console.error("Lỗi khi lấy đơn đăng ký:", error));

    // Lấy tất cả thông tin khai báo sức khỏe khi component mount
    axios
      .get("http://localhost:3001/api/initial-health")
      .then((response) => {
        setHealthDeclarations(
          Array.isArray(response.data) ? response.data : []
        );
        console.log("Dữ liệu khai báo sức khỏe:", response.data);
      })
      .catch((error) =>
        console.error("Lỗi khi lấy thông tin khai báo sức khỏe:", error)
      );
  }, []);

  const xuLyHanhDongDon = (id, hanhDong, lyDo = "") => {
    axios
      .put(`http://localhost:3001/api/don-dang-ky/${id}`, {
        trangThai: hanhDong,
        lyDo,
      })
      .then(() => {
        setDonDangKy(
          donDangKy.map((don) =>
            don.IDRegister === id ? { ...don, Status: hanhDong } : don
          )
        );
        setTrangThai("");
        setLyDo("");
        setDonDuocChon(null);
        setHealthDeclaration(null); // Reset khi cập nhật trạng thái
        setNoDeclarationMessage(""); // Reset thông báo
      })
      .catch((error) => console.error("Lỗi khi cập nhật đơn:", error));
  };

  const handleViewHealthDeclaration = (id) => {
    const declaration = Array.isArray(healthDeclarations)
      ? healthDeclarations.find((decl) => decl.IDRequest === id)
      : null;
    if (!declaration) {
      setNoDeclarationMessage("Người đăng ký chưa khai báo!");
      setHealthDeclaration(null);
    } else {
      setNoDeclarationMessage("");
      setHealthDeclaration(declaration);
    }
    setDonDuocChon(id);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Đơn Đăng Ký Hiến Máu</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Người Dùng</th>
              <th className="border p-2">Ngày</th>
              <th className="border p-2">Nhóm Máu</th>
              <th className="border p-2">Trạng Thái</th>
              <th className="border p-2">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {donDangKy.map((don) => (
              <tr
                key={don.IDRegister}
                onClick={() => handleViewHealthDeclaration(don.IDRegister)}
                className="hover:bg-gray-50"
              >
                <td className="border p-2">{don.IDRegister}</td>
                <td className="border p-2">{don.IDUser}</td>
                <td className="border p-2">
                  {new Date(don.DonateBloodDate).toLocaleDateString()}
                </td>
                <td className="border p-2">{don.IDBlood}</td>
                <td className="border p-2">{don.Status}</td>
                <td className="border p-2 flex space-x-2">
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => xuLyHanhDongDon(don.IDRegister, "Approved")}
                  >
                    Phê duyệt
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => {
                      setDonDuocChon(don.IDRegister);
                      setTrangThai("Rejected");
                    }}
                  >
                    Từ chối
                  </button>
                  {donDuocChon === don.IDRegister &&
                    trangThai === "Rejected" && (
                      <div className="mt-2">
                        <input
                          type="text"
                          placeholder="Lý do"
                          value={lyDo}
                          onChange={(e) => setLyDo(e.target.value)}
                          className="border p-1 text-xs rounded"
                        />
                        <button
                          className="bg-blue-500 text-white px-2 py-1 mt-1 rounded text-xs"
                          onClick={() =>
                            xuLyHanhDongDon(don.IDRegister, "Rejected", lyDo)
                          }
                        >
                          Gửi
                        </button>
                      </div>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {donDuocChon && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">
            Thông Tin Khai Báo Sức Khỏe (IDRequest: {donDuocChon})
          </h3>
          {noDeclarationMessage ? (
            <p className="text-red-500 text-sm">{noDeclarationMessage}</p>
          ) : healthDeclaration ? (
            <>
              <p>
                <strong>Ngày Khai Báo:</strong>{" "}
                {new Date(
                  healthDeclaration.DeclarationDate
                ).toLocaleDateString()}
              </p>
              <p>
                <strong>Huyết Áp:</strong>{" "}
                {healthDeclaration.BloodPressure || "N/A"}
              </p>
              <p>
                <strong>Cân Nặng:</strong> {healthDeclaration.Weight || "N/A"}{" "}
                kg
              </p>
              <p>
                <strong>Tiền Sử Bệnh Lý:</strong>{" "}
                {healthDeclaration.MedicalHistory || "N/A"}
              </p>
              <p>
                <strong>Đủ Điều Kiện:</strong>{" "}
                {healthDeclaration.Eligible ? "Có" : "Không"}
              </p>
            </>
          ) : null}
          <button
            className="bg-gray-500 text-white px-2 py-1 mt-2 rounded text-xs"
            onClick={() => {
              setHealthDeclaration(null);
              setDonDuocChon(null);
              setNoDeclarationMessage("");
            }}
          >
            Đóng
          </button>
        </div>
      )}
    </div>
  );
};

export default DonationRequestList;

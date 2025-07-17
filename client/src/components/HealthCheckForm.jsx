import React, { useState } from "react";
import axios from "axios";

const HealthCheckForm = () => {
  const [duLieuSucKhoe, setDuLieuSucKhoe] = useState({
    idUser: "",
    huyetAp: "",
    canNang: "",
    ketQuaXetNghiem: "",
    duDieuKien: true,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const xuLyKiemTraSucKhoe = async () => {
    const { idUser, huyetAp, canNang, ketQuaXetNghiem, duDieuKien } =
      duLieuSucKhoe;
    const idUserNum = parseInt(idUser, 10); // Chuyển đổi thành số nguyên

    // Kiểm tra IDUser
    if (!idUser || isNaN(idUserNum) || idUserNum <= 0) {
      setErrorMessage("Vui lòng nhập IDUser là một số nguyên dương hợp lệ!");
      return;
    }

    // Kiểm tra IDUser tồn tại trong database
    try {
      const response = await axios.get(
        `http://localhost:3001/api/users/check/${idUserNum}`
      );
      if (!response.data.exists) {
        setErrorMessage("IDUser không tồn tại trong hệ thống!");
        return;
      }
    } catch (error) {
      setErrorMessage("Lỗi khi kiểm tra IDUser: " + error.message);
      return;
    }

    // Gửi dữ liệu kiểm tra sức khỏe
    try {
      const response = await axios.post(
        `http://localhost:3001/api/kiem-tra-suc-khoe/${idUserNum}`,
        { huyetAp, canNang, ketQuaXetNghiem, duDieuKien }
      );
      if (response.status === 200) {
        setDuLieuSucKhoe({
          idUser: idUserNum.toString(),
          huyetAp: "",
          canNang: "",
          ketQuaXetNghiem: "",
          duDieuKien: true,
        });
        setErrorMessage("");
        alert("Cập nhật kiểm tra sức khỏe thành công");
      }
    } catch (error) {
      console.error(
        "Lỗi khi gửi kiểm tra sức khỏe:",
        error.response ? error.response.data : error.message
      );
      setErrorMessage(
        "Lỗi khi gửi dữ liệu: " +
          (error.response ? error.response.data.error : error.message)
      );
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Kiểm Tra Sức Khỏe</h2>
      <div className="flex flex-col gap-3">
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        <input
          type="text"
          placeholder="IDUser"
          value={duLieuSucKhoe.idUser}
          onChange={(e) =>
            setDuLieuSucKhoe({ ...duLieuSucKhoe, idUser: e.target.value })
          }
          className="border p-2 rounded text-sm"
        />
        <input
          type="text"
          placeholder="Huyết Áp (mmHg)"
          value={duLieuSucKhoe.huyetAp}
          onChange={(e) =>
            setDuLieuSucKhoe({ ...duLieuSucKhoe, huyetAp: e.target.value })
          }
          className="border p-2 rounded text-sm"
        />
        <input
          type="text"
          placeholder="Cân Nặng (kg)"
          value={duLieuSucKhoe.canNang}
          onChange={(e) =>
            setDuLieuSucKhoe({ ...duLieuSucKhoe, canNang: e.target.value })
          }
          className="border p-2 rounded text-sm"
        />
        <input
          type="text"
          placeholder="Kết Quả Xét Nghiệm"
          value={duLieuSucKhoe.ketQuaXetNghiem}
          onChange={(e) =>
            setDuLieuSucKhoe({
              ...duLieuSucKhoe,
              ketQuaXetNghiem: e.target.value,
            })
          }
          className="border p-2 rounded text-sm"
        />
        <select
          value={duLieuSucKhoe.duDieuKien}
          onChange={(e) =>
            setDuLieuSucKhoe({
              ...duLieuSucKhoe,
              duDieuKien: e.target.value === "true",
            })
          }
          className="border p-2 rounded text-sm"
        >
          <option value={true}>Đủ điều kiện</option>
          <option value={false}>Không đủ điều kiện</option>
        </select>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
          onClick={xuLyKiemTraSucKhoe}
        >
          Gửi Kiểm Tra Sức Khỏe
        </button>
      </div>
    </div>
  );
};

export default HealthCheckForm;

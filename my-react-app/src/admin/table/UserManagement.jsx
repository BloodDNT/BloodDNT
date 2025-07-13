import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/table.css";

const ROWS_PER_PAGE = 2;

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [form, setForm] = useState({
        FullName: "",
        Email: "",
        Role: "User",
        Password: "",
    });
    const [filterRole, setFilterRole] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/users");
            const nonAdminUsers = res.data.filter(user => user.Role !== "Admin");
            setUsers(nonAdminUsers);
        } catch (err) {
            console.error("❌ Lỗi khi tải danh sách người dùng:", err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await axios.put(`http://localhost:5000/api/users/${editingUser.IDUser}`, form);
            } else {
                await axios.post("http://localhost:5000/api/users", form);
            }
            setForm({ FullName: "", Email: "", Role: "User", Password: "" });
            setEditingUser(null);
            fetchUsers();
        } catch (err) {
            console.error("❌ Lỗi khi gửi dữ liệu người dùng:", err);
        }
    };

    const handleEdit = (user) => {
        setForm({
            FullName: user.FullName,
            Email: user.Email,
            Role: user.Role,
            Password: "",
        });
        setEditingUser(user);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xoá người dùng này?")) {
            try {
                await axios.delete(`http://localhost:5000/api/users/${id}`);
                fetchUsers();
            } catch (err) {
                console.error("❌ Lỗi khi xoá người dùng:", err);
            }
        }
    };

    // Lọc và phân trang
    const filteredUsers = users.filter((user) => {
        if (filterRole === "All") return true;
        return user.Role === filterRole;
    });

    const totalPages = Math.ceil(filteredUsers.length / ROWS_PER_PAGE);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * ROWS_PER_PAGE,
        currentPage * ROWS_PER_PAGE
    );

    const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    return (
        <div className="table-container">
            <h2>👥 Quản lý Người dùng</h2>

            {/* Form Thêm/Sửa */}
            <form onSubmit={handleSubmit} className="user-form">
                <input
                    type="text"
                    name="FullName"
                    value={form.FullName}
                    onChange={handleInputChange}
                    placeholder="Họ và tên"
                    required
                />
                <input
                    type="email"
                    name="Email"
                    value={form.Email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="password"
                    name="Password"
                    value={form.Password}
                    onChange={handleInputChange}
                    placeholder="Mật khẩu"
                    required={!editingUser}
                />
                <select name="Role" value={form.Role} onChange={handleInputChange}>
                    <option value="User">Người hiến máu</option>
                    <option value="Staff">Nhân viên y tế</option>
                </select>
                <button type="submit">{editingUser ? "Cập nhật" : "Thêm mới"}</button>
            </form>

            {/* Bộ lọc */}
            <div style={{ margin: "1rem 0" }}>
                <label>Lọc theo vai trò: </label>
                <select
                    value={filterRole}
                    onChange={(e) => {
                        setFilterRole(e.target.value);
                        setCurrentPage(1); // Reset trang khi đổi filter
                    }}
                >
                    <option value="All">Tất cả</option>
                    <option value="User">Người hiến máu</option>
                    <option value="Staff">Nhân viên y tế</option>
                </select>
            </div>

            {/* Bảng dữ liệu */}
            <table className="custom-table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Họ và tên</th>
                        <th>Email</th>
                        <th>Vai trò</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedUsers.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: "center" }}>Không có người dùng.</td>
                        </tr>
                    ) : (
                        paginatedUsers.map((user, index) => (
                            <tr key={user.IDUser}>
                                <td>{(currentPage - 1) * ROWS_PER_PAGE + index + 1}</td>
                                <td>{user.FullName}</td>
                                <td>{user.Email}</td>
                                <td>{user.Role}</td>
                                <td>
                                    <button onClick={() => handleEdit(user)}>Sửa</button>
                                    <button onClick={() => handleDelete(user.IDUser)}>Xoá</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {filteredUsers.length > ROWS_PER_PAGE && (
                <div className="pagination-controls" style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "16px",
                    marginTop: "16px",
                }}>
                    <button onClick={handlePrev} disabled={currentPage === 1}>
                        ◀ Trang trước
                    </button>
                    <span>Trang {currentPage} / {totalPages}</span>
                    <button onClick={handleNext} disabled={currentPage === totalPages}>
                        Trang sau ▶
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserManagement;

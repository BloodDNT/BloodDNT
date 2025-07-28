import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import "../styles/table.css";
import Swal from 'sweetalert2';

const ROWS_PER_PAGE = 5;

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRole, setFilterRole] = useState("Tất cả");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset về trang 1 khi đổi filter
  }, [filterRole]);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/blog");
      setBlogs(res.data);
    } catch (error) {
      console.error("❌ Lỗi khi tải danh sách blog:", error);
    }
  };

  const handleCreate = async () => {
  if (!newTitle || !newContent) {
    Swal.fire("Vui lòng nhập tiêu đề và nội dung.");
    return;
  }

  


  const token = localStorage.getItem("token");
  console.log("🪪 Token lấy từ localStorage:", token);

  if (!token) {
Swal.fire("⚠️ Không tìm thấy token. Vui lòng đăng nhập lại.");
    return;
  }

  try {
    await axios.post(
      "http://localhost:5000/api/blog",
      {
        Title: newTitle,
        Content: newContent,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    await fetchBlogs();
    setNewTitle("");
    setNewContent("");
    setShowForm(false);
  } catch (error) {
    Swal.fire("Tạo bài viết thất bại: " + (error.response?.data?.message || error.message));
    console.error("❌ Tạo bài viết thất bại:", error);
  }
};
const handleDelete = async (id) => {
  const token = localStorage.getItem("token");

  if (!token) {
    Swal.fire("⚠️ Bạn chưa đăng nhập.");
    return;
  }

  if (!window.confirm("Bạn chắc chắn muốn xoá bài viết này?")) return;

  try {
    await axios.delete(`http://localhost:5000/api/blog/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchBlogs(); // Cập nhật lại danh sách
  } catch (error) {
    Swal.fire("❌ Xoá thất bại: " + (error.response?.data?.message || error.message));
    console.error("Xoá bài viết thất bại:", error);
  }
};

  const filteredBlogs = blogs.filter((b) =>
  filterRole === "Tất cả" ? true : b.AuthorRole === filterRole
);

  const totalPages = Math.ceil(filteredBlogs.length / ROWS_PER_PAGE);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="table-container">
      <h2>📝 Quản lý bài viết Blog</h2>

      <button
        onClick={() => setShowForm(!showForm)}
        style={{  
          marginBottom: "16px",
          padding: "8px 16px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {showForm ? "🔽 Đóng lại" : "➕ Tạo bài viết"}
      </button>

      {showForm && (
        <div style={{ marginBottom: "20px", padding: "16px", border: "1px solid #ccc", borderRadius: "8px", background: "#f9f9f9" }}>
          <h4>🆕 Thêm bài viết mới</h4>
          <input
            type="text"
            placeholder="Tiêu đề"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{ padding: "8px", width: "100%", marginBottom: "8px" }}
          />
          <textarea
            placeholder="Nội dung"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            style={{ padding: "8px", width: "100%", height: "120px", marginBottom: "8px" }}
          />
          <button
            onClick={handleCreate}
            style={{
              padding: "8px 16px",
              background: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px"
            }}
          >
            Đăng bài
          </button>
        </div>
      )}

      <div style={{ marginBottom: "16px" }}>
        <label style={{ marginRight: "8px" }}>Lọc theo người đăng:</label>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          style={{ padding: "6px", borderRadius: "4px" }}
        >
          <option value="Tất cả">Tất cả</option>
          <option value="Admin">Admin</option>
          <option value="Staff">Staff</option>
          <option value="User">User</option>
        </select>
      </div>

      <table className="custom-table">
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Ngày đăng</th>
            <th>Người đăng</th>
            <th>Nội dung</th>
            <th>Thích</th>
            <th>Bình luận</th>
            <th>Báo cáo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {paginatedBlogs.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center", padding: "16px" }}>
                Không có bài viết nào.
              </td>
            </tr>
          ) : (
            paginatedBlogs.map((blog) => (
              <tr key={blog.IDPost}>
                <td>{blog.Title}</td>
                <td>{new Date(blog.LastUpdated || blog.PostedAt).toLocaleDateString("vi-VN")}</td>
                <td>{blog.AuthorFullName}</td>
                <td>{blog.Content.length > 50 ? blog.Content.slice(0, 50) + "..." : blog.Content}</td>
                <td>{blog.likeCount || 0}</td>
                <td>{blog.commentCount || 0}</td>
                <td>{blog.reportCount || 0}</td>

                <td>
                  <button
                    onClick={() => handleDelete(blog.IDPost)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#e74c3c",
                      cursor: "pointer",
                    }}
                  >
                    <FaTrash title="Xoá" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {filteredBlogs.length > ROWS_PER_PAGE && (
        <div
          className="pagination-controls"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          <button onClick={handlePrev} disabled={currentPage === 1}>
            ◀ Trang trước
          </button>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
          <button onClick={handleNext} disabled={currentPage === totalPages}>
            Trang sau ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
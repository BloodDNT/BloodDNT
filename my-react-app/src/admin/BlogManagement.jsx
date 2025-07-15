import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import "../styles/table.css";

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [showForm, setShowForm] = useState(false); // ✅ đúng chỗ

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/blogs");
      setBlogs(res.data);
    } catch (error) {
      console.error("❌ Lỗi khi tải danh sách blog:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá bài viết này?")) {
      try {
        await axios.delete(`http://localhost:5000/api/blogs/${id}`);
        setBlogs(prev => prev.filter((b) => b.IDPost !== id));
      } catch (error) {
        console.error("❌ Xoá thất bại:", error);
      }
    }
  };

  const handleCreate = async () => {
    if (!newTitle || !newContent) {
      alert("Vui lòng nhập tiêu đề và nội dung.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/blogs", {
        Title: newTitle,
        Content: newContent,
        IDUser: 1,
      });
      await fetchBlogs();
      setNewTitle("");
      setNewContent("");
      setShowForm(false);
    } catch (error) {
      alert("Tạo bài viết thất bại: " + (error.response?.data?.message || error.message));
      console.error("❌ Tạo bài viết thất bại:", error);
    }
  };

  return (
    <div className="table-container">
      <h2>📝 Quản lý bài viết Blog</h2>

      {/* Nút mở/đóng form */}
      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          marginBottom: "16px",
          padding: "8px 16px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        {showForm ? "🔽 Đóng lại" : "➕ Tạo bài viết"}
      </button>

      {/* Form tạo mới */}
      {showForm && (
        <div style={{
          marginBottom: "20px",
          padding: "16px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          background: "#f9f9f9"
        }}>
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

      {/* Bảng blog */}
      <table className="custom-table">
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Ngày đăng</th>
            <th>Người đăng</th>
            <th>Nội dung</th>
            <th>Thích</th>
            <th>Bình luân</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {blogs.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>Chưa có bài viết nào.</td>
            </tr>
          ) : (
            blogs.map((blog) => (
              <tr key={blog.IDPost}>
                <td>{blog.Title}</td>
                <td>{new Date(blog.LastUpdated || blog.PostedAt).toLocaleDateString("vi-VN")}</td>
                <td>{blog.Author}</td>
                <td>{blog.Content.length > 50 ? blog.Content.slice(0, 50) + "..." : blog.Content}</td>
                <td>{blog.LikeCount || 0}</td>
                <td>{blog.CommentCount || 0}</td>
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
    </div>
  );
};

export default BlogManagement;

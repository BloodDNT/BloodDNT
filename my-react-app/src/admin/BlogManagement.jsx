import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import "../styles/table.css";

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);

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

  return (
    <div className="table-container">
      <h2>📝 Quản lý bài viết Blog</h2>

      <table className="custom-table">
        <thead>
          <tr>
            <th>Tiêu đề</th>
            <th>Ngày đăng</th>
            <th>Người đăng</th>
            <th>Nội dung</th>
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
                <td>{new Date(blog.LastUpdated).toLocaleDateString("vi-VN")}</td>
                <td>{blog.Author}</td>
                <td>{blog.Content.length > 50 ? blog.Content.slice(0, 50) + "..." : blog.Content}</td>
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

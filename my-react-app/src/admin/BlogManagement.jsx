import { useEffect, useState } from "react";
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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterRole]);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/blog");
      setBlogs(res.data);
    } catch (error) {
      console.error("❌ Lỗi khi tải danh sách blog:", error);
    }
  };

  const openConfirmDialog = (id) => {
    setSelectedId(id);
    setConfirmOpen(true);
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
    filterRole === "Tất cả" ? true : b.Role === filterRole
  );

  const totalPages = Math.ceil(filteredBlogs.length / ROWS_PER_PAGE);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        📝 Quản lý bài viết Blog
      </Typography>

      <Button
        variant="contained"
        color={showForm ? "secondary" : "success"}
        onClick={() => setShowForm(!showForm)}
        sx={{ mb: 2 }}
      >
        {showForm ? "🔽 Đóng lại" : "➕ Tạo bài viết"}
      </Button>

      {showForm && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            🆕 Thêm bài viết mới
          </Typography>
          <TextField
            fullWidth
            label="Tiêu đề"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Nội dung"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleCreate}>
            Đăng bài
          </Button>
        </Paper>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography component="label" sx={{ mr: 1 }}>
          Lọc theo người đăng:
        </Typography>
        <Select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          size="small"
        >
          <MenuItem value="Tất cả">Tất cả</MenuItem>
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="Staff">Staff</MenuItem>
          <MenuItem value="User">User</MenuItem>
        </Select>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f4f6fa' }}>
              <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.05rem' }}>Tiêu đề</TableCell>
           <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.05rem' }}>Ngày đăng</TableCell>
        <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.05rem' }}>Người đăng</TableCell>
        <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.05rem' }}>Nội dung</TableCell>
        <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.05rem' }}>Thích</TableCell>
        <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.05rem' }}>Bình luận</TableCell>
        <TableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.05rem' }}>Hành động</TableCell>
      </TableRow>
          </TableHead>
          <TableBody>
  {paginatedBlogs.length === 0 ? (
    <TableRow>
      <TableCell colSpan={7} align="center">
        Không có bài viết nào.
      </TableCell>
    </TableRow>
  ) : (
    paginatedBlogs.map((blog) => (
      <TableRow key={blog.IDPost}>
        <TableCell align="center">{blog.Title}</TableCell>
        <TableCell align="center">
          {new Date(blog.LastUpdated || blog.PostedAt).toLocaleDateString("vi-VN")}
        </TableCell>
        <TableCell align="center">{blog.Author}</TableCell>
        <TableCell align="center">
          {blog.Content.length > 50 ? blog.Content.slice(0, 50) + "..." : blog.Content}
        </TableCell>
        <TableCell align="center">{blog.LikeCount || 0}</TableCell>
        <TableCell align="center">{blog.CommentCount || 0}</TableCell>
        <TableCell align="center">
          <IconButton color="error" onClick={() => openConfirmDialog(blog.IDPost)}>
            <FaTrash />
          </IconButton>
        </TableCell>
      </TableRow>
    ))
  )}
</TableBody>

        </Table>
      </TableContainer>

      {filteredBlogs.length > ROWS_PER_PAGE && (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
          <Button
            variant="outlined"
            disabled={currentPage === 1}
            onClick={handlePrev}
          >
            ◀ Trang trước
          </Button>
          <Typography>
            Trang {currentPage} / {totalPages}
          </Typography>
          <Button
            variant="outlined"
            disabled={currentPage === totalPages}
            onClick={handleNext}
          >
            Trang sau ▶
          </Button>
        </Box>
      )}

      {/* 🔒 Hộp thoại xác nhận xoá */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Xác nhận xoá</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xoá bài viết này?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            Huỷ
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Xoá
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BlogManagement;

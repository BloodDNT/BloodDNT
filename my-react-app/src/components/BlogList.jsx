import React, { useEffect, useState, useCallback, useContext } from "react";
import './blog.css';
import { UserContext } from "../context/UserContext";
import Swal from 'sweetalert2';

export default function BlogList({ reload }) {
  const [fullComments, setFullComments] = useState({});
  const [expandedPosts, setExpandedPosts] = useState({});
  const [showReportBox, setShowReportBox] = useState(null);
  const [reportReasons, setReportReasons] = useState({});
  const [showCommentBox, setShowCommentBox] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [posts, setPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState(5); // Giới hạn 5 bài viết ban đầu
  const { user } = useContext(UserContext);

  const fetchPosts = useCallback(() => {
    fetch("http://localhost:5000/api/blog")
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [reload, fetchPosts]);

  // Gửi báo cáo bài viết
  const handleSubmitReport = async (post) => {
    const token = localStorage.getItem('token');
    const reason = reportReasons[post.IDPost];

    if (!token) {
      Swal.fire("Bạn cần đăng nhập để báo cáo.");
      return;
    }

    if (!reason || !reason.trim()) {
      Swal.fire("Vui lòng nhập lý do báo cáo.");
      return;
    }

    try {
      console.log("Đang gửi báo cáo với dữ liệu:", { IDPost: post.IDPost, Reason: reason });
      const res = await fetch('http://localhost:5000/api/blog/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          IDPost: post.IDPost,
          IDReporter: user?.IDUser,
          Reason: reason
        })
      });

      const data = await res.json();
      console.log("Kết quả trả về:", data);

      if (res.ok) {
        Swal.fire('Thành công', 'Báo cáo đã được gửi.', 'success');
        setShowReportBox(null);
        setReportReasons(prev => ({ ...prev, [post.IDPost]: '' }));
      } else {
        Swal.fire("Lỗi khi gửi báo cáo: " + (data.error || 'Không xác định.'));
      }
    } catch (error) {
      console.error("Lỗi gửi báo cáo:", error);
      Swal.fire("Đã xảy ra lỗi khi gửi báo cáo.");
    }
  };

  // Xử lý nút "Hiện thêm"
  const handleShowMore = () => {
    setVisiblePosts(prev => prev + 5); // Tăng thêm 5 bài viết
  };

  return (
    <div className="blog-section">
      <h2 style={{ marginTop: 0, marginBottom: 24, color: "#b71c1c" }}>Bài viết cộng đồng</h2>
      {posts.slice(0, visiblePosts).map(post => (
        <div key={post.IDPost} className="blog-post">
          <div className="blog-meta">
            <img
              className="blog-avatar"
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.User?.FullName || "U")}&background=fff0f0&color=b71c1c&size=64`}
              alt="avatar"
            />
            <span style={{ fontWeight: 600 }}>{post.User?.FullName}</span>
            <span>•</span>
            <span>{new Date(post.LastUpdated).toLocaleString()}</span>
          </div>

          <h3>{post.Title}</h3>
          <div className="blog-content">{post.Content}</div>

          {/* BÌNH LUẬN */}
          {post.previewComments && post.previewComments.length > 0 && (
            <div className="blog-comments">
              {(expandedPosts[post.IDPost] ? fullComments[post.IDPost] : post.previewComments).map((comment, index) => (
                <div key={index} className="comment-item">
                  <strong>{comment.User?.FullName || 'Ẩn danh'}:</strong> {comment.Content}
                </div>
              ))}
            </div>
          )}

          {!expandedPosts[post.IDPost] ? (
            <button
              className="see-more-btn"
              onClick={async () => {
                const res = await fetch(`http://localhost:5000/api/blog/${post.IDPost}/comments`);
                const data = await res.json();
                setFullComments(prev => ({ ...prev, [post.IDPost]: data }));
                setExpandedPosts(prev => ({ ...prev, [post.IDPost]: true }));
              }}
            >
              Xem thêm bình luận
            </button>
          ) : (
            <button
              className="see-more-btn"
              onClick={() => setExpandedPosts(prev => ({ ...prev, [post.IDPost]: false }))}
            >
              Ẩn bớt bình luận
            </button>
          )}

          <div className="blog-actions">
            {/* LIKE */}
            <button
              className="blog-action-btn"
              onClick={async () => {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user) return Swal.fire("Bạn cần đăng nhập để thích.");
                await fetch(`http://localhost:5000/api/blog/${post.IDPost}/like`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  },
                  body: JSON.stringify({ IDUser: user.IDUser })
                });
                fetchPosts();
              }}
            >
              👍 Thích <span style={{ color: '#b71c1c', fontWeight: 600 }}>({post.likeCount || 0})</span>
            </button>

            {/* COMMENT */}
            <button
              className="blog-action-btn"
              onClick={() => setShowCommentBox(showCommentBox === post.IDPost ? null : post.IDPost)}
            >
              💬 Bình luận <span style={{ color: '#b71c1c', fontWeight: 600 }}>({post.commentCount || 0})</span>
            </button>

            {/* BÁO CÁO */}
            <button
              className="blog-action-btn report-btn"
              onClick={() => setShowReportBox(showReportBox === post.IDPost ? null : post.IDPost)}
            >
              🚩 Báo cáo
            </button>

            {showReportBox === post.IDPost && (
              <div className="report-box">
                <textarea
                  placeholder="Nhập lý do báo cáo..."
                  value={reportReasons[post.IDPost] || ''}
                  onChange={(e) =>
                    setReportReasons(prev => ({ ...prev, [post.IDPost]: e.target.value }))
                  }
                />
                <button className="submit-report-btn" onClick={() => handleSubmitReport(post)}>
                  Gửi báo cáo
                </button>
              </div>
            )}

            {/* COMMENT BOX */}
            {showCommentBox === post.IDPost && (
              <div className="comment-box">
                <textarea
                  placeholder="Viết bình luận..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button
                  onClick={async () => {
                    const user = JSON.parse(localStorage.getItem('user'));
                    const token = localStorage.getItem('token');

                    if (!user || !token) {
                      return Swal.fire("Bạn cần đăng nhập để bình luận.");
                    }

                    const response = await fetch(`http://localhost:5000/api/blog/${post.IDPost}/comment`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify({ content: commentText, IDUser: user.IDUser })
                    });

                    if (response.ok) {
                      setCommentText('');
                      setShowCommentBox(null);
                      fetchPosts();
                    } else {
                      const data = await response.json();
                      Swal.fire("Lỗi khi gửi bình luận: " + (data.error || 'Không xác định.'));
                    }
                  }}
                >
                  Gửi bình luận
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
      {visiblePosts < posts.length && (
        <div className="show-more-container">
          <button className="show-more-btn" onClick={handleShowMore}>
            Hiện thêm
          </button>
        </div>
      )}
    </div>
  );
}
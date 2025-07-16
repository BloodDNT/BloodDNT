import React, { useEffect, useState, useCallback } from "react";
import './blog.css';


export default function BlogList({ reload }) {
  const [fullComments, setFullComments] = useState({});
const [expandedPosts, setExpandedPosts] = useState({});

  const [showCommentBox, setShowCommentBox] = useState(null);
const [commentText, setCommentText] = useState('');
  const [posts, setPosts] = useState([]);
  const fetchPosts = useCallback(() => {
    fetch("http://localhost:5000/api/blog")
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [reload, fetchPosts]);

  return (
    <div className="blog-section">
      <h2 style={{marginTop: 0, marginBottom: 24, color: "#b71c1c"}}>Bài viết cộng đồng</h2>
      {posts.map(post => (
        <div key={post.IDPost} className="blog-post">
          <div className="blog-meta">
            <img
              className="blog-avatar"
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.User?.FullName || "U")}&background=fff0f0&color=b71c1c&size=64`}
              alt="avatar"
            />
            <span style={{fontWeight: 600}}>{post.User?.FullName}</span>
            <span>•</span>
            <span>{new Date(post.LastUpdated).toLocaleString()}</span>
          </div>
          <h3>{post.Title}</h3>
          <div className="blog-content">{post.Content}</div>
          {post.previewComments && post.previewComments.length > 0 && (

 <div className="blog-comments">
  {(expandedPosts[post.IDPost] ? fullComments[post.IDPost] : post.previewComments || []).map((comment, index) => (
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
    onClick={() => {
      setExpandedPosts(prev => ({ ...prev, [post.IDPost]: false }));
    }}
  >
    Ẩn bớt bình luận
  </button>
)}

          {post.Category && <div className="blog-category">#{post.Category}</div>}
          <div className="blog-actions">
            <button
              className="blog-action-btn"
              onClick={async () => {
                const token = localStorage.getItem('token');
                await fetch(`http://localhost:5000/api/blog/${post.IDPost}/like`, {
                  method: 'POST',
                  headers: { 'Authorization': 'Bearer ' + token }
                });
                fetchPosts(); // Gọi lại fetch để cập nhật số like
              }}
            >
              👍 Thích <span style={{color:'#b71c1c', fontWeight:600}}>({post.likeCount || 0})</span>
            </button>
        <button className="blog-action-btn" onClick={() => setShowCommentBox(showCommentBox === post.IDPost ? null : post.IDPost)
  }
>
              💬 Bình luận <span style={{color:'#b71c1c', fontWeight:600}}>({post.commentCount || 0})</span>
            </button>
            {showCommentBox === post.IDPost && (
  <div className="comment-box">
    <textarea
      placeholder="Viết bình luận..."
      value={commentText}
      onChange={(e) => setCommentText(e.target.value)}
    />
    <button
      onClick={async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/blog/${post.IDPost}/comment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
          body: JSON.stringify({ content: commentText })
        });

        if (response.ok) {
          setCommentText('');
          setShowCommentBox(null);
          fetchPosts(); // Cập nhật lại comment count
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
    </div>
  );
}
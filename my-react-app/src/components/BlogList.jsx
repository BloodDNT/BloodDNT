import React, { useEffect, useState, useCallback } from "react";
import './blog.css';
export default function BlogList({ reload }) {
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
            <button className="blog-action-btn">
              💬 Bình luận <span style={{color:'#b71c1c', fontWeight:600}}>({post.commentCount || 0})</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function BlogPostForm({ onPostSuccess }) {
  const { user } = useContext(UserContext);
  const [form, setForm] = useState({ title: "", content: "", category: "" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch("http://localhost:5000/api/blog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setForm({ title: "", content: "", category: "" });
      if (onPostSuccess) onPostSuccess();
      alert("Đăng bài thành công!");
    } else {
      alert("Đăng bài thất bại!");
    }
  };

  if (!user) return <p style={{color: "red"}}>Bạn cần đăng nhập để đăng bài.</p>;

  return (
    <form className="blog-post-form" onSubmit={handleSubmit} style={{marginBottom: 32}}>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Tiêu đề" required />
      <textarea name="content" value={form.content} onChange={handleChange} placeholder="Nội dung" required />
      <input name="category" value={form.category} onChange={handleChange} placeholder="Chủ đề (tuỳ chọn)" />
      <button type="submit">Đăng bài</button>
    </form>
  );
}
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;
}

export default function RecoveryCountdown({ nextDate }) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = new Date(nextDate).getTime() - Date.now();
    return diff > 0 ? diff : 0;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1000) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!nextDate) return null;

  if (timeLeft <= 0) {
    return (
      <div className="recovered">
        <p>✅ Bạn đã có thể hiến máu lại.</p>
        <Link to="/register/donate" className="re-register-btn">🩸 Đăng ký hiến máu lại</Link>
      </div>
    );
  }

  return (
    <div className="countdown-box">
      <p><strong>🕒 Thời gian phục hồi máu còn lại:</strong></p>
      <p className="countdown-time">{formatTime(timeLeft)}</p>
    </div>
  );
}

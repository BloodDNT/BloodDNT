const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'my-secret-key';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Không có token' });
  }
  
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Gán IDUser vào req.user
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token không hợp lệ hoặc hết hạn' });
  }
}

module.exports = authenticateToken;

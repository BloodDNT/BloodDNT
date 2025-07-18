const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SECRET_KEY = process.env.JWT_SECRET || 'my-secret-key';

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  console.log("Authorization header:", req.headers.authorization);


  if (!token) {
    return res.status(401).json({ error: 'Không có token' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findByPk(decoded.IDUser);

    if (!user) {
      return res.status(401).json({ error: 'Không tìm thấy user' });
    }

    req.user = {
      IDUser: user.IDUser,
      Role: user.Role,
      FullName: user.FullName
    };

    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token không hợp lệ hoặc hết hạn' });
  }
}

module.exports = authenticateToken;

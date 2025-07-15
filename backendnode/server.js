const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth');
const registerRoute = require('./routes/registerBlood');
const requestDonateRoute = require('./routes/requestDonateBlood');
const publicBloodRequestRoutes = require('./routes/publicBloodRequestRoutes');
const userActivityRoutes = require('./routes/userActivities');
const donationHistoryRoute = require('./routes/donationHistory');
const notificationRoutes = require('./routes/notification');
const authenticateToken = require('./middlewares/authenticateToken');

const sequelize = require('./config/database');
require('./models/User');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// ✅ Mount route theo đúng thứ tự
app.use('/api/auth', authRoutes);
app.use('/api/blood-donations', registerRoute);

// 🟢 Route KHÔNG yêu cầu token (xem chi tiết đơn yêu cầu)
app.use('/api/public-blood-requests', publicBloodRequestRoutes);

// 🔒 Route yêu cầu token (tạo / sửa / xoá yêu cầu)
app.use('/api/blood-requests', authenticateToken, requestDonateRoute);

app.use('/api/user-activities', userActivityRoutes);
app.use('/api/donation-history', donationHistoryRoute);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync()
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ DB connection failed:', err);
  });

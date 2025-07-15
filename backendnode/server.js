const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth');
const registerRoute = require('./routes/registerBlood');
const requestDonateRoute = require('./routes/requestDonateBlood');
const userActivityRoutes = require('./routes/userActivities');
const sequelize = require('./config/database');
const donationHistoryRoute = require('./routes/donationHistory');
const notificationRoutes = require('./routes/notification');
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

// Mount real routes
app.use('/api/auth', authRoutes);
app.use('/api/blood-donations', registerRoute);
app.use('/api/blood-requests', requestDonateRoute);
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

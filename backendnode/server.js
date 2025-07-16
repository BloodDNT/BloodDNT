const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

const app = express();
dotenv.config();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Routers
const authRoutes = require('./routes/auth');
const blogRoutes = require("./routes/blog");
const registerRoute = require('./routes/registerBlood');
const requestDonateRoute = require('./routes/requestDonateBlood');
const userActivityRoutes = require('./routes/userActivities');
const donationHistoryRoute = require('./routes/donationHistory');
const notificationRoutes = require('./routes/notification');
const authenticateToken = require('./middlewares/authenticateToken');
const bloodInventoryRoutes = require('./routes/bloodInventory');
const registeredDonorsRoutes = require('./routes/registeredDonors');
const upcomingAppointmentsRoutes = require('./routes/upcomingAppointments');
const successfulDonationsRoutes = require('./routes/successfulDonations');
const bloodRecipientsRoutes = require('./routes/bloodRecipients');
const userRoutes = require('./routes/users');
const publicBloodRequestRoutes = require('./routes/publicBloodRequestRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use("/api/blog", blogRoutes);
app.use('/api/blood-donations', registerRoute);
app.use('/api/blood-requests', authenticateToken, requestDonateRoute);
app.use('/api/user-activities', userActivityRoutes);
app.use('/api/donation-history', donationHistoryRoute);
app.use('/api/notifications', notificationRoutes);
app.use('/api/blood-inventory', bloodInventoryRoutes);
app.use('/api/registered-donors', registeredDonorsRoutes);
app.use('/api/upcoming-appointments', upcomingAppointmentsRoutes);
app.use('/api/successful-donations', successfulDonationsRoutes);
app.use('/api/blood-recipients', bloodRecipientsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/public-blood-requests', publicBloodRequestRoutes);

// Start server
const PORT = process.env.PORT || 5000;
sequelize.sync()
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ DB connection failed:', err);
  });

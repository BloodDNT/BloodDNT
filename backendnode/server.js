const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const registerRoute = require('./routes/registerBlood');
const requestDonateRoute = require('./routes/requestDonateBlood');
const userActivityRoutes = require('./routes/userActivities');
const donationHistoryRoute = require('./routes/donationHistory');
const notificationRoutes = require('./routes/notification');
const authenticateToken = require('./middlewares/authenticateToken');
// Routes
const authRoutes = require('./routes/auth');


dotenv.config();

const app = express();


app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Only ONE require and ONE use per route
app.use('/api/auth', authRoutes);


const bloodInventoryRoutes = require('./routes/bloodInventory');
app.use('/api/blood-inventory', bloodInventoryRoutes);

const registeredDonorsRoutes = require('./routes/registeredDonors');
app.use('/api/registered-donors', registeredDonorsRoutes);

const upcomingAppointmentsRoutes = require('./routes/upcomingAppointments');
app.use('/api/upcoming-appointments', upcomingAppointmentsRoutes);

const successfulDonationsRoutes = require('./routes/successfulDonations');
app.use('/api/successful-donations', successfulDonationsRoutes);

const bloodRecipientsRoutes = require('./routes/bloodRecipients.js');
app.use('/api/blood-recipients', bloodRecipientsRoutes);

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const blogRoutes = require("./routes/blog");
app.use("/api/blogs", blogRoutes);



  

// Mount real routes
app.use('/api/auth', authRoutes);
app.use('/api/blood-donations', registerRoute);
app.use('/api/blood-requests', authenticateToken, requestDonateRoute);
app.use('/api/user-activities', userActivityRoutes);
app.use('/api/donation-history', donationHistoryRoute);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync()  
  .then(() => {
    app.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`)
    );
  })
  .catch(err => {
    console.error('❌ DB connection failed:', err);
  });

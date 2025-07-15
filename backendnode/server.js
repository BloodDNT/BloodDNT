const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const sequelize = require('./config/database');
const blogRoutes = require('./routes/blog'); 
const userRoutes = require('./routes/users');
const successfulDonationsRoutes = require('./routes/successfulDonations');
const upcomingAppointmentsRoutes = require('./routes/upcomingAppointments');
const registeredDonorsRoutes = require('./routes/registeredDonors');
const bloodInventoryRoutes = require('./routes/bloodInventory');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

const bloodInventoryRoutes = require('./routes/bloodInventory');
app.use('/api/blood-inventory', bloodInventoryRoutes);

const registeredDonorsRoutes = require('./routes/registeredDonors');
app.use('/api/registered-donors', registeredDonorsRoutes);

const upcomingAppointmentsRoutes = require('./routes/upcomingAppointments');
app.use('/api/upcoming-appointments', upcomingAppointmentsRoutes);

const successfulDonationsRoutes = require('./routes/successfulDonations');
app.use('/api/successful-donations', successfulDonationsRoutes);

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes); 
app.use('/api/users', userRoutes); 
app.use('/api/successful-donations', successfulDonationsRoutes);
app.use('/api/upcoming-appointments', upcomingAppointmentsRoutes);  
app.use('/api/registered-donors', registeredDonorsRoutes);
app.use('/api/blood-inventory', bloodInventoryRoutes);


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
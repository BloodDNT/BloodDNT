const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const registerRoute = require('./routes/register');
const sequelize = require('./config/database');
const donationHistoryRoute = require('./routes/donationHistory');
const requestDonateRoute = require('./routes/requestDonateBlood');
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

app.use('/api/auth', authRoutes);
app.use('/api', registerRoute);
app.use('/api', donationHistoryRoute);
app.use('/api/blood-requests', requestDonateRoute);

const PORT = process.env.PORT || 5000;
sequelize.sync()  
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ DB connection failed:', err);
  });

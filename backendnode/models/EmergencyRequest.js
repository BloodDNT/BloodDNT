const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmergencyRequest = sequelize.define('EmergencyRequest', {
  bloodType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  urgencyLevel: {
    type: DataTypes.ENUM('Urgent', 'Critical'),
    allowNull: false,
  },
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
  },
  requestDate: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
});

module.exports = EmergencyRequest;

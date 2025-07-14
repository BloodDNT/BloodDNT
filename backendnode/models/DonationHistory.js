const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DonationHistory = sequelize.define('DonationHistory', {
  IDDonation: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  IDUser: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  DonateBloodDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  Volume: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'DonationHistory',
  timestamps: false
});

module.exports = DonationHistory;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DonationHistory = sequelize.define('DonationHistory', {
  IDHistory: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  IDUser: {
    type: DataTypes.STRING,
    allowNull: false
  },
  DonateBloodDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  IDRequest: {
    type: DataTypes.STRING,
    allowNull: true
  },
  IDBlood: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  NextDonateDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  Volume: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
  // ❌ Đã xoá Note và Status
}, {
  tableName: 'DonationHistory',
  timestamps: false
});

module.exports = DonationHistory;

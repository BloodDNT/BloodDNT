const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DonationHistory = sequelize.define('DonationHistory', {

  IDHistory: {
 User
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  IDUser: {

    type: DataTypes.STRING,
User
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
  },
  Note: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Status: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'DonationHistory',
  timestamps: false
});

module.exports = DonationHistory;

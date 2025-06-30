// D:\SUMMER2025\SWP391\BloodDNT\backendnode\models\BloodDonation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const BloodDonation = sequelize.define('BloodDonation', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  donateBloodDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  bloodType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  identificationNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending',
  },
});

module.exports = BloodDonation;
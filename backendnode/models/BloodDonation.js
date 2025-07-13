// models/BloodDonation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RegisterDonateBlood = sequelize.define('RegisterDonateBlood', {
  IDRegister: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  IDUser: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  DonateBloodDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  IDBlood: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  IdentificationNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  Status: {
    type: DataTypes.STRING,
    defaultValue: 'Pendings',
  },
  QRCode: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'RegisterDonateBlood',
  timestamps: false, // nếu không có createdAt, updatedAt
});

module.exports = RegisterDonateBlood;

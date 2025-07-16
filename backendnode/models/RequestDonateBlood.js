const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const RequestDonateBlood = sequelize.define('RequestDonateBlood', {
  IDRequest: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  IDUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  IDComponents: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  IDBlood: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  Quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  UrgencyLevel: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  Status: {
    type: DataTypes.STRING(20),
    defaultValue: 'Pending',
  },
  IdentificationNumber: {
    type: DataTypes.STRING(40),
    allowNull: false,
  },
  RequestDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  QRCodeValue: {
    type: DataTypes.STRING(10000), // đủ dài để chứa base64
    allowNull: true
  },
}, {
  tableName: 'RequestDonateBlood',
  timestamps: false,
});
RequestDonateBlood.belongsTo(User, { foreignKey: 'IDUser' });
module.exports = RequestDonateBlood;
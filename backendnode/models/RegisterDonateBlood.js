const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RegisterDonateBlood = sequelize.define('RegisterDonateBlood', {
  IDRegister: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  IDUser: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  DonateBloodDate: DataTypes.DATE,
  Status: DataTypes.STRING
}, {
  tableName: 'RegisterDonateBlood',
  timestamps: false
});

module.exports = RegisterDonateBlood;

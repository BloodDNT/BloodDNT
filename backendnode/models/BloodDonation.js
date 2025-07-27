const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const GroupBlood = require('./GroupBlood');
const User = require('./User'); 

const RegisterDonateBlood = sequelize.define('RegisterDonateBlood', {
  IDRegister: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  IDUser: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  DonateBloodDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  IDBlood: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  IdentificationNumber: {
    type: DataTypes.STRING(40),
    allowNull: false,
  },
  Note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  Status: {
    type: DataTypes.STRING(20),
    defaultValue: 'Pending',
  }
}, {
  tableName: 'RegisterDonateBlood',
  timestamps: false,
});

// Quan hệ
RegisterDonateBlood.belongsTo(User, { foreignKey: 'IDUser' });
RegisterDonateBlood.belongsTo(GroupBlood, { foreignKey: 'IDBlood' });

module.exports = RegisterDonateBlood;

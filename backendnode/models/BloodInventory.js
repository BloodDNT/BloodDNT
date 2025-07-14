const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BloodInventory = sequelize.define('BloodInventory', {
  IDInventory: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  IDBlood: DataTypes.INTEGER,
  IDComponents: DataTypes.INTEGER,
  Quantity: DataTypes.INTEGER
}, {
  tableName: 'BloodInventory',
  timestamps: false
});

module.exports = BloodInventory;

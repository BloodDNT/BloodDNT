// backendnode/models/GroupBlood.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GroupBlood = sequelize.define('GroupBlood', {
  IDBlood: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  BloodType: DataTypes.STRING,
  Description: DataTypes.STRING,
  IDUserCreated: DataTypes.INTEGER
}, {
  tableName: 'GroupBlood',
  timestamps: false
});

module.exports = GroupBlood;
    
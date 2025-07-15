const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  IDNotification: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  IDUser: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Type: {
    type: DataTypes.STRING,
  },
  Message: {
    type: DataTypes.STRING,
  },
  Status: {
    type: DataTypes.STRING,
    defaultValue: 'Unread'
  },
  SendDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Notification',
  timestamps: false
});

module.exports = Notification;

// models/BlogReport.js
const sequelize = require('../config/database'); // hoặc nơi bạn init sequelize
const { DataTypes, Sequelize } = require('sequelize');

const BlogReport = sequelize.define('BlogReport', {
  IDReport: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  IDPost: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  IDReporter: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Reason: {
    type: DataTypes.STRING,
    allowNull: false
  },
  CreatedAt: {
    type: DataTypes.DATE, // ✅ dùng kiểu DATE hoặc DATETIME
    defaultValue: Sequelize.NOW
  }
}, {
   timestamps: true, // sẽ tự tạo createdAt, updatedAt
  createdAt: 'CreatedAt', // map tên cột createdAt thành CreatedAt
  updatedAt: false // nếu bạn không cần updatedAt
});

module.exports = BlogReport;

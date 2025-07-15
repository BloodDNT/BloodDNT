const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Blog = sequelize.define('Blog', {
  IDPost: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Title: { type: DataTypes.STRING, allowNull: false },
  Content: { type: DataTypes.TEXT, allowNull: false },
  Category: { type: DataTypes.STRING },
  LastUpdated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },


}, {
  tableName: 'Blog',
  timestamps: false
});

Blog.belongsTo(User, { foreignKey: 'IDUser' });

module.exports = Blog;
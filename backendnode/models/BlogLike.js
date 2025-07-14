const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Blog = require('./Blog');
const User = require('./User');

const BlogLike = sequelize.define('BlogLike', {
  IDLike: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  IDPost: { type: DataTypes.INTEGER, allowNull: false },
  IDUser: { type: DataTypes.INTEGER, allowNull: false },
  LikedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'BlogLike',
  timestamps: false
});

BlogLike.belongsTo(Blog, { foreignKey: 'IDPost' });
BlogLike.belongsTo(User, { foreignKey: 'IDUser' });

module.exports = BlogLike;
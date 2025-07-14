const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Blog = require('./Blog');
const User = require('./User');

const BlogComment = sequelize.define('BlogComment', {
  IDComment: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  IDPost: { type: DataTypes.INTEGER, allowNull: false },
  IDUser: { type: DataTypes.INTEGER, allowNull: false },
  Content: { type: DataTypes.STRING(1000), allowNull: false },
  CommentedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'BlogComment',
  timestamps: false
});

BlogComment.belongsTo(Blog, { foreignKey: 'IDPost' });
BlogComment.belongsTo(User, { foreignKey: 'IDUser' });

module.exports = BlogComment;
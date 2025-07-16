const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 
const User = sequelize.define('User', {
  VerificationToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  IsVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  IDUser: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  FullName: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  Email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  PhoneNumber: {
    type: DataTypes.STRING(15),
    allowNull: true,
  },
  Address: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  DateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  Gender: {
    type: DataTypes.STRING(10),
    allowNull: true,
    validate: {
      isIn: [['Male', 'Female', 'Other']],
    }
  },
  Role: {
    type: DataTypes.STRING(10),
    allowNull: false,
      defaultValue: 'User',
    validate: {
      isIn: [['User', 'Staff', 'Admin']],
    }
  },
  CreatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  Latitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  Longitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
 


}, {
  tableName: 'Users',
  timestamps: false, 
});

module.exports = User;

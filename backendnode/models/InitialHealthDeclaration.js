const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InitialHealthDeclaration = sequelize.define('InitialHealthDeclaration', {
  IDDeclaration: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  IDRequest: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  DeclarationDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  BloodPressure: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Weight: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  MedicalHistory: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  Eligible: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'InitialHealthDeclaration',
  timestamps: false
});

module.exports = InitialHealthDeclaration;

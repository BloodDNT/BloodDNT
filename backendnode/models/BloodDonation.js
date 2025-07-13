const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // ✅ Đảm bảo import sequelize
const GroupBlood = require('./GroupBlood');
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
    defaultValue: 'Pendings',
  },
  QRCode: {
    type: DataTypes.STRING(510),
    allowNull: true,
  },
}, {
  tableName: 'RegisterDonateBlood',
  timestamps: false,
});
RegisterDonateBlood.belongsTo(GroupBlood, { foreignKey: 'IDBlood' });
module.exports = RegisterDonateBlood;

const Sequelize = require('sequelize');
const sequelize = require('../config/database');

// Import các models
const RegisterDonateBlood = require('./BloodDonation');
const GroupBlood = require('./GroupBlood');
const DonationHistory = require('./DonationHistory');
const User = require('./User');

// Khởi tạo models
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Gán models vào object db
db.RegisterDonateBlood = RegisterDonateBlood;
db.GroupBlood = GroupBlood;
db.DonationHistory = DonationHistory;
db.User = User;

// Thiết lập mối quan hệ
RegisterDonateBlood.belongsTo(GroupBlood, { foreignKey: 'IDBlood' });
DonationHistory.belongsTo(User, { foreignKey: 'IDUser' });
DonationHistory.belongsTo(GroupBlood, { foreignKey: 'IDBlood' });

module.exports = db;

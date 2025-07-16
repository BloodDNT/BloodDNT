const Sequelize = require('sequelize');
const sequelize = require('../config/database');

// Import các models
const RegisterDonateBlood = require('./BloodDonation');
const GroupBlood = require('./GroupBlood');
const DonationHistory = require('./DonationHistory');
const User = require('./User');
const InitialHealthDeclaration = require('./InitialHealthDeclaration'); // ✅ Thêm dòng này

// Khởi tạo object db
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Gán models vào object db
db.RegisterDonateBlood = RegisterDonateBlood;
db.GroupBlood = GroupBlood;
db.DonationHistory = DonationHistory;
db.User = User;
db.InitialHealthDeclaration = InitialHealthDeclaration; // ✅ Thêm dòng này

// Thiết lập mối quan hệ
RegisterDonateBlood.belongsTo(GroupBlood, { foreignKey: 'IDBlood' });
DonationHistory.belongsTo(User, { foreignKey: 'IDUser' });
DonationHistory.belongsTo(GroupBlood, { foreignKey: 'IDBlood' });

// ✅ Thiết lập mối quan hệ giữa khai báo sức khỏe và đơn đăng ký
InitialHealthDeclaration.belongsTo(RegisterDonateBlood, { foreignKey: 'IDRequest' });

module.exports = db;

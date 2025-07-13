const RegisterDonateBlood = require('./BloodDonation');
// Nếu sau này có thêm model khác, bạn cũng require ở đây
const GroupBlood = require('./GroupBlood');

RegisterDonateBlood.belongsTo(GroupBlood, { foreignKey: 'IDBlood' });

module.exports = {
  RegisterDonateBlood,
  GroupBlood
};

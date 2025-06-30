const bcrypt = require('bcrypt');
const User = require('./models/User');
const sequelize = require('./config/database'); // Adjust the path to your database configuration

async function updateAllPasswords() {
  try {
    const users = await User.findAll();
    for (const user of users) {
      if (!user.Password.startsWith('$2b$') && !user.Password.startsWith('$2a$')) {
        const hashed = await bcrypt.hash(user.Password, 10);
        await User.update({ Password: hashed }, { where: { Email: user.Email } });
        console.log(`Updated ${user.Email}`);
      } else {
        console.log(`Skipped ${user.Email} (already hashed)`);
      }
    }
    console.log('Done');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

updateAllPasswords();
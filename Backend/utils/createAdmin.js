const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function ensureAdminExists() {
  try {
    const adminEmail = 'bnamitha57@gmail.com';
    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log('Admin exists');
      return;
    }
    const hashed = await bcrypt.hash('Chinnima@8050', 10);
    const admin = new User({
      name: 'Admin',
      username: 'admin',
      email: adminEmail,
      password: hashed,
      role: 'ADMIN',
      isApproved: true
    });
    await admin.save();
    console.log('Admin created with email bnamitha57@gmail.com and password Chinnima@8050');
  } catch (err) {
    console.error('Error ensuring admin exists', err);
  }
}

module.exports = { ensureAdminExists };

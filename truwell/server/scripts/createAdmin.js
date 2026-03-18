/**
 * Run this once to create an admin account:
 *
 *   node server/scripts/createAdmin.js
 *
 * Or to promote an existing user to admin:
 *
 *   node server/scripts/createAdmin.js promote your@email.com
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/truwell_pharmacy';

// ── Change these before running ──────────────────────────────────
const ADMIN_NAME     = 'Truwell Admin';
const ADMIN_EMAIL    = 'admin@truwellpharmacy.com';
const ADMIN_PASSWORD = 'Truwell@Admin123';   // ← change this!
// ─────────────────────────────────────────────────────────────────

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const args = process.argv.slice(2);

  // ── MODE: promote existing user ──────────────────────────────
  if (args[0] === 'promote' && args[1]) {
    const email = args[1];
    const result = await User.findOneAndUpdate(
      { email },
      { $set: { role: 'admin' } },
      { new: true }
    );
    if (!result) {
      console.error(`❌ No user found with email: ${email}`);
    } else {
      console.log(`✅ "${result.name}" (${result.email}) is now an admin!`);
      console.log('   → Log out and log back in to apply the new role.');
    }
    await mongoose.disconnect();
    return;
  }

  // ── MODE: promote to pharmacist ──────────────────────────────
  if (args[0] === 'pharmacist' && args[1]) {
    const email = args[1];
    const result = await User.findOneAndUpdate(
      { email },
      { $set: { role: 'pharmacist' } },
      { new: true }
    );
    if (!result) {
      console.error(`❌ No user found with email: ${email}`);
    } else {
      console.log(`✅ "${result.name}" (${result.email}) is now a pharmacist!`);
      console.log('   → Log out and log back in to apply the new role.');
    }
    await mongoose.disconnect();
    return;
  }

  // ── MODE: create fresh admin account ────────────────────────
  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    // If already exists, just promote it
    existing.role = 'admin';
    await existing.save();
    console.log(`ℹ️  User already exists. Promoted "${existing.name}" to admin.`);
  } else {
    const admin = await User.create({
      name:     ADMIN_NAME,
      email:    ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role:     'admin',
    });
    console.log(`✅ Admin account created!`);
    console.log(`   Name:     ${admin.name}`);
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Role:     ${admin.role}`);
  }

  console.log('\n🔑 You can now log in at http://localhost:3000/login');
  console.log('   The "⚕️ Medicines" button will appear in the navbar.');
  await mongoose.disconnect();
}

run().catch(err => {
  console.error('❌ Error:', err.message);
  mongoose.disconnect();
  process.exit(1);
});

// One-time bootstrap: creates the first admin account, so that
// POST /api/auth/register - which requires an existing admin's token - has
// someone to authenticate as.
//
// Usage:
//   npm run seed:admin -- you@example.com "your-password" "Your Name"

import '../src/config.js';
import bcrypt from 'bcryptjs';
import { connectDB, disconnectDB, isConfigured } from '../src/db/connect.js';
import { AdminUser } from '../src/db/models/AdminUser.js';

const BCRYPT_ROUNDS = 12;
const MIN_PASSWORD_LENGTH = 8;

async function main() {
  const [, , email, password, name] = process.argv;

  if (!email || !password) {
    console.error('Usage: npm run seed:admin -- <email> <password> ["Full Name"]');
    process.exit(1);
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }
  if (!isConfigured) {
    throw new Error('No database configured - set MONGODB_URI in .env.local first.');
  }

  await connectDB();

  const normalizedEmail = email.trim().toLowerCase();

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const existing = await AdminUser.findOne({ email: normalizedEmail });

  if (existing) {
    existing.passwordHash = passwordHash;
    if (name) existing.name = name;
    existing.role = 'Super Admin';
    await existing.save();
    console.log(`[seed-admin] Successfully updated Master Admin: ${normalizedEmail} with new password!`);
    return;
  }

  await AdminUser.create({
    email: normalizedEmail,
    passwordHash,
    name: name || 'Master Administrator',
    role: 'Super Admin'
  });

  console.log(`[seed-admin] Successfully created new Master Admin: ${normalizedEmail}`);
}

main()
  .then(async () => {
    await disconnectDB();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('Seeding failed:', err.message || err);
    await disconnectDB();
    process.exit(1);
  });

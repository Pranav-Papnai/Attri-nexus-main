// One-time bootstrap: creates the first Super Admin account (or resets an
// existing account's password and makes it Super Admin), so that
// POST /api/auth/register - which requires an existing admin's token - has
// someone to authenticate as.
//
// Usage:
//   npm run seed:admin -- you@example.com [--name "Your Name"]
//
// The password is typed at a hidden prompt (or piped on stdin), never passed
// as an argument, so it does not end up in shell history or the process list.

import '../src/config.js';
import readline from 'node:readline';
import { connectDB, disconnectDB, isConfigured } from '../src/db/connect.js';
import { AdminUser } from '../src/db/models/AdminUser.js';
import { hashPassword, isAcceptablePassword, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from '../src/lib/passwords.js';

function parseArgs(argv) {
  const positional = [];
  let name;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--name') name = argv[(i += 1)];
    else positional.push(argv[i]);
  }
  return { positional, name };
}

function ask(question, { hidden }) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: process.stdin.isTTY });
    if (hidden && process.stdin.isTTY) {
      // Echo nothing while the password is typed.
      rl._writeToOutput = (text) => {
        if (text.includes(question)) process.stdout.write(question);
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden && process.stdin.isTTY) process.stdout.write('\n');
      resolve(answer);
    });
  });
}

async function readPassword() {
  if (!process.stdin.isTTY) {
    // Piped input: first line is the password.
    return (await ask('', { hidden: false })).replace(/\r$/, '');
  }
  const first = await ask('New password: ', { hidden: true });
  const second = await ask('Repeat password: ', { hidden: true });
  if (first !== second) throw new Error('The two passwords do not match');
  return first;
}

async function main() {
  const { positional, name } = parseArgs(process.argv.slice(2));
  const [email] = positional;

  if (!email || positional.length > 1) {
    console.error('Usage: npm run seed:admin -- <email> [--name "Full Name"]');
    if (positional.length > 1) {
      console.error('Passwords are no longer accepted on the command line; you will be prompted for it.');
    }
    process.exit(1);
  }
  if (!isConfigured) {
    throw new Error('No database configured - set MONGODB_URI in .env.local first.');
  }

  const password = await readPassword();
  if (!isAcceptablePassword(password)) {
    throw new Error(`Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters`);
  }

  await connectDB();

  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await hashPassword(password);
  const existing = await AdminUser.findOne({ email: normalizedEmail });

  if (existing) {
    existing.passwordHash = passwordHash;
    existing.passwordChangedAt = new Date();
    if (name) existing.name = name;
    existing.role = 'Super Admin';
    await existing.save();
    console.log(`[seed-admin] Updated ${normalizedEmail}: new password set, role Super Admin, all old sessions ended.`);
    return;
  }

  await AdminUser.create({
    email: normalizedEmail,
    passwordHash,
    name: name || 'Master Administrator',
    role: 'Super Admin'
  });

  console.log(`[seed-admin] Created Super Admin ${normalizedEmail}`);
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

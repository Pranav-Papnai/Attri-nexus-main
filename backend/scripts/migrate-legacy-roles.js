// Renames the pre-roles value 'admin' to 'Commercial Admin'. Both grant the
// same access, so this only makes the stored data match ADMIN_ROLES.
//
// Usage: npm run migrate:roles            (shows what would change)
//        npm run migrate:roles -- --apply (makes the change)

import '../src/config.js';
import { connectDB, disconnectDB, isConfigured } from '../src/db/connect.js';
import { AdminUser, ADMIN_ROLES } from '../src/db/models/AdminUser.js';

const apply = process.argv.includes('--apply');

async function main() {
  if (!isConfigured) throw new Error('No database configured - set MONGODB_URI first.');
  await connectDB();

  const legacy = await AdminUser.find({ role: { $nin: ADMIN_ROLES } }, 'email role').lean();
  if (legacy.length === 0) {
    console.log('Every admin already has a current role. Nothing to do.');
    return;
  }

  for (const user of legacy) {
    console.log(`${apply ? 'Updating' : 'Would update'} ${user.email}: '${user.role}' -> 'Commercial Admin'`);
  }
  if (apply) {
    const result = await AdminUser.updateMany({ role: { $nin: ADMIN_ROLES } }, { $set: { role: 'Commercial Admin' } });
    console.log(`Done: ${result.modifiedCount} account(s) updated.`);
  } else {
    console.log('Dry run only. Re-run with --apply to make the change.');
  }
}

main()
  .then(async () => {
    await disconnectDB();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error('Migration failed:', err.message || err);
    await disconnectDB();
    process.exit(1);
  });

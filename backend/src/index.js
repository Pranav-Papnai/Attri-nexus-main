// config.js must be imported first: it loads .env.local before any other
// module reads process.env.
import { PORT, NODE_ENV, checkEnv } from './config.js';
import { connectDB, disconnectDB, isConfigured } from './db/connect.js';
import { createApp } from './app.js';

const { missingRequired, missingOptional } = checkEnv();

if (missingRequired.length > 0) {
  console.error('\nCannot start: required environment variables are missing.\n');
  for (const [key, why] of missingRequired) {
    console.error(`  ${key}  - ${why}`);
  }
  console.error('\nAdd them to .env.local in the project root, then start again.\n');
  process.exit(1);
}

for (const [key, why] of missingOptional) {
  console.warn(`[warn] ${key} is not set - ${why}`);
}

// Connect before listening so a bad URI surfaces at boot rather than on the
// first request. A failure here is not fatal: the data routes answer 503 and
// the frontend falls back to its local data, which is far more useful than a
// server that refuses to start.
if (isConfigured) {
  try {
    await connectDB();
    console.log('[db] connected');
  } catch (err) {
    console.error(`[db] connection failed - data routes will answer 503: ${err.message}`);
  }
}

const app = createApp();
const server = app.listen(PORT, () => {
  console.log(`\n  Attri Nexus API  ·  ${NODE_ENV}`);
  console.log(`  http://localhost:${PORT}/api/health\n`);
});

// Without this the process ignores container stop signals and gets SIGKILLed
// after a timeout, cutting off in-flight requests.
let shuttingDown = false;
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, async () => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`\n${signal} received - closing server.`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
    // Do not wait forever for a stuck connection to drain.
    setTimeout(() => process.exit(1), 10000).unref();
  });
}

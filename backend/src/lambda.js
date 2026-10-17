import serverless from 'serverless-http';
import { checkEnv } from './config.js';
import { createApp } from './app.js';
import { connectDB, isConfigured } from './db/connect.js';

// Same refusal as index.js: a missing or weak JWT_SECRET fails the cold start
// instead of serving requests that sign forgeable sessions.
const { missingRequired } = checkEnv();
if (missingRequired.length > 0) {
  throw new Error(`Cannot start: ${missingRequired.map(([key, why]) => `${key} (${why})`).join('; ')}`);
}

const app = createApp();
const serverlessHandler = serverless(app);

export const handler = async (event, context) => {
  // Prevent Lambda from waiting for Node.js event loop to drain
  // (Crucial for keeping persistent MongoDB connections warm)
  if (context) {
    context.callbackWaitsForEmptyEventLoop = false;
  }

  if (isConfigured) {
    try {
      await connectDB();
    } catch (err) {
      console.error('[lambda-db] Connection failed:', err.message);
    }
  }

  return serverlessHandler(event, context);
};

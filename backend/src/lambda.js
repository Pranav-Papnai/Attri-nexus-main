import serverless from 'serverless-http';
import { createApp } from './app.js';
import { connectDB, isConfigured } from './db/connect.js';

const app = createApp();
const serverlessHandler = serverless(app);

export const handler = async (event, context) => {
  // Prevent Lambda from waiting for Node.js event loop to drain
  // (Crucial for keeping persistent MongoDB connections warm)
  if (context) {
    context.callbackWaitsForEmptyEventLoop = false;
  }

  // Connect to database if not already connected
  if (isConfigured) {
    try {
      await connectDB();
    } catch (err) {
      console.error('[lambda-db] Connection failed:', err.message);
    }
  }

  return serverlessHandler(event, context);
};

import express from 'express';
import serverless from 'serverless-http';
import { registerRoutes } from './routes'; // Adjust this path

const app = express();
app.use(express.json());

let serverPromise;

async function setupServer() {
  if (!serverPromise) {
    serverPromise = registerRoutes(app);
  }
  return app;
}

export const handler = async (event, context) => {
  const app = await setupServer();
  const serverlessHandler = serverless(app);
  return serverlessHandler(event, context);
};

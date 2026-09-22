import { createServer } from 'http';
import { createApp } from './server/app';
import { startJobScheduler } from './server/jobs/scheduler';

async function startServer() {
  const app = createApp({ mode: 'dev', serveStatic: false });
  // Ignore invalid ambient PORT values (0/negative/NaN); fall back to 5000.
  // A platform-provided PORT (Render/Heroku/Fly) is always valid and wins.
  const portFromEnv = Number(process.env.PORT);
  const port = Number.isFinite(portFromEnv) && portFromEnv > 0 ? portFromEnv : 5000;

  const server = createServer(app);

  server.listen(port, '0.0.0.0', () => {
    console.log(`Disaster Intelligence Platform API listening on port ${port}`);
    // Automatic data-pipeline heartbeat: ingestion, reconciliation, lifecycle,
    // notifications, embeddings and past-discovery all run on intervals now.
    startJobScheduler();
  });
}

startServer().catch((error) => {
  console.error('Failed to start backend server:', error);
  process.exit(1);
});

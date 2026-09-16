const express = require('express');
const env = require('./config/env'); 
const { initDb, pool } = require('./config/db');
const { healthCheck } = require('./routes/health');

const app = express();
app.use(express.json());

// Register routes
app.get('/health', healthCheck);

const startService = async () => {
  // Ensure schema is built before accepting traffic
  await initDb();

  const server = app.listen(env.port, () => {
    console.log(`SwiftGate API running on port ${env.port}`);
  });

  // Graceful shutdown (A detail Lars will appreciate)
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      pool.end();
      process.exit(0);
    });
  });
};

startService();
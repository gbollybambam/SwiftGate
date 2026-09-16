const { Pool, Client } = require('pg');
const fs = require('fs');
const path = require('path');
const env = require('./env');
const { URL } = require('url');

// Parse the connection string to extract the target database name
const parsedUrl = new URL(env.dbUrl);
const targetDbName = parsedUrl.pathname.slice(1);

// Create the main application pool with a 5-second timeout (Fixes Finding 2)
const pool = new Pool({
  connectionString: env.dbUrl,
  connectionTimeoutMillis: 5000 
});

const initDb = async () => {
  // 1. Connect to the default 'postgres' database to create our DB if missing (Fixes Finding 1)
  const adminUrl = new URL(env.dbUrl);
  adminUrl.pathname = '/postgres';
  const adminClient = new Client({ connectionString: adminUrl.toString() });

  try {
    await adminClient.connect();
    const checkDb = await adminClient.query('SELECT datname FROM pg_catalog.pg_database WHERE datname = $1', [targetDbName]);
    if (checkDb.rowCount === 0) {
      await adminClient.query(`CREATE DATABASE "${targetDbName}"`);
      console.log(`Database "${targetDbName}" created automatically.`);
    }
  } catch (err) {
    console.error('Failed during database check/creation:', err.message);
    process.exit(1);
  } finally {
    await adminClient.end();
  }

  // 2. Connect to the target DB and apply schema using a version tracker (Fixes Finding 3)
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS schema_versions (version INT PRIMARY KEY, applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    const { rowCount } = await pool.query('SELECT version FROM schema_versions WHERE version = 1');
    
    if (rowCount === 0) {
      const schemaPath = path.join(__dirname, '../../db/schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(schema);
      await pool.query('INSERT INTO schema_versions (version) VALUES (1)');
      console.log('Database schema successfully applied (Version 1).');
    } else {
      console.log('Database schema is already up to date.');
    }
  } catch (err) {
    console.error('Failed to initialize database schema:', err.message);
    process.exit(1);
  }
};

module.exports = { pool, initDb };
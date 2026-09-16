const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const env = require('./env');

const pool = new Pool({
  connectionString: env.dbUrl
});

const initDb = async () => {
  try {
    const schemaPath = path.join(__dirname, '../../db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schema);
    console.log('Database schema successfully verified/built.');
  } catch (err) {
    console.error('Failed to initialize database schema:', err);
    process.exit(1);
  }
};

module.exports = { pool, initDb };
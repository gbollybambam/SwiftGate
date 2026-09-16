const { pool } = require('../config/db');

const healthCheck = async (req, res) => {
  try {
    // Actively reach out to the database
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    console.error('Database unreachable:', error.message);
    res.status(503).json({ status: 'unhealthy', database: 'disconnected' });
  }
};

module.exports = { healthCheck };
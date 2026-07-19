const { Pool } = require('pg');
const env = require('../config/env');

const pool = new Pool({
  connectionString: env.postgresUrl,
  max: 20, // Pool size per Node.js instance
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getPool: () => pool
};

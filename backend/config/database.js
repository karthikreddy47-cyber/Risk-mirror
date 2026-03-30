const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'riskmirror',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL connected successfully');
    client.release();
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = { pool, testConnection };

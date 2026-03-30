const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const initializeDatabase = async () => {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'riskmirror',
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
  });

  try {
    console.log('🔧 Connecting to PostgreSQL database...');
    await client.connect();
    console.log('✅ Connected to PostgreSQL');
    
    console.log('🔧 Initializing database schema...');
    
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    // Split by semicolon and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      try {
        await client.query(statement);
      } catch (err) {
        // Ignore "already exists" errors for idempotency
        if (!err.message.includes('already exists')) {
          throw err;
        }
        console.log(`⚠️  ${err.message}`);
      }
    }
    
    console.log('✅ Database schema initialized successfully!');
    await client.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    try {
      await client.end();
    } catch (e) {}
    process.exit(1);
  }
};

initializeDatabase();

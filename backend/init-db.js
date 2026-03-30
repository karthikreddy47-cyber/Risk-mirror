const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const initializeDatabase = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
  });

  try {
    console.log('🔧 Initializing database schema...');
    
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    // Split by semicolon and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      await connection.query(statement);
    }
    
    console.log('✅ Database schema initialized successfully!');
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    await connection.end();
    process.exit(1);
  }
};

initializeDatabase();

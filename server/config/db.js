const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'daily_utility_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Create database schema if it doesn't exist
const createSchema = async () => {
  const connection = await pool.getConnection();
  try {
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create claims table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS claims (
        id INT AUTO_INCREMENT PRIMARY KEY,
        claim_number VARCHAR(50) UNIQUE,
        description TEXT,
        amount DECIMAL(10, 2),
        status VARCHAR(50) DEFAULT 'Pending',
        submitted_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id INT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Create grocery_items table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS grocery_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        category VARCHAR(50),
        is_completed BOOLEAN DEFAULT FALSE,
        user_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Create saved_datasets table for charts
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS saved_datasets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        dataset_name VARCHAR(100),
        dataset_type VARCHAR(50),
        data JSON,
        user_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    console.log('✅ Database schema initialized successfully');
  } catch (error) {
    console.error('❌ Error creating schema:', error);
  } finally {
    connection.release();
  }
};

// Initialize schema on startup
createSchema().catch(console.error);

module.exports = pool;

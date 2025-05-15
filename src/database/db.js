const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  connectionLimit: 60,
  connectTimeout: 30000,      
  waitForConnections: true,   
  queueLimit: 0              
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Error connecting to the database:', err.message);
    return;
  }
  console.log('✅ Connected to the MySQL database');
  connection.release();
});

module.exports = pool;

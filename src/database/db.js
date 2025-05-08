const mysql = require('mysql2');
require('dotenv').config();

let pool;

function handleDisconnect() {
  // Creating a connection pool instead of a single connection
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    connectionLimit: 10,  // Max number of connections in the pool
    connectTimeout: 30000,  // 30 seconds timeout for connection
    acquireTimeout: 30000,  // 30 seconds timeout for acquiring a connection from the pool
    waitForConnections: true,  // Wait for a connection if the pool is full
  });

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('❌ Error connecting to MySQL:', err.message);
      console.log('🔁 Retrying in 3 seconds...');
      setTimeout(handleDisconnect, 3000);  // Retry connection after 3 seconds
    } else {
      console.log('✅ Connected to MySQL database');
      connection.release();  // Release the connection back to the pool
    }
  });

  pool.on('error', (err) => {
    console.error('💥 MySQL pool error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
      console.log('🔄 Connection lost. Reconnecting...');
      handleDisconnect();  // Re-establish the pool connection
    } else {
      throw err;
    }
  });
}

// Initialize connection pool
handleDisconnect();

module.exports = {
  query: (sql, params) => {
    return new Promise((resolve, reject) => {
      pool.query(sql, params, (err, results) => {
        if (err) {
          // Reject with an Error object to comply with SonarQube's rule
          reject(new Error(`Error executing query: ${err.message}`));  // Wrap the error message in an Error object
        } else {
          resolve(results);  // Resolve the promise with the query results
        }
      });
    });
  },
  pool,  // Export the pool for potential manual use
};

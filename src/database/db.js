// const mysql = require('mysql2');
// require('dotenv').config();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PWD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT || 3306,
//   connectionLimit: 50,
//   connectTimeout: 30000,      
//   waitForConnections: true,   
//   queueLimit: 0              
// });

// pool.getConnection((err, connection) => {
//   if (err) {
//     console.error('❌ Error connecting to the database:', err.message);
//     return;
//   }
//   console.log('✅ Connected to the MySQL database');
//   connection.release();
// });

// module.exports = pool;


require('dotenv-flow').config();
const mysql = require('mysql2');
const { getSecret } = require('../utilities/index');

let pool;

async function authenticate() {
  const secret = await getSecret(process.env.MYSQL_SECRET_PATH);
  const { DB_HOST: host, DB_USER: user, DB_PASSWORD: password, DB_NAME: database, DB_PORT } = secret;
  if (!user || !password || !host || !database) {
    throw new Error('Missing MySQL Vault creds');
  }

  pool = mysql.createPool({
    host,
    user,
    password,
    database,
    port: parseInt(DB_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  console.log('✅ MySQL pool created');
  return pool;
}

function getPool() {
  return pool; 
}

module.exports = {
  authenticate,
  getPool,
};

<<<<<<< HEAD
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
=======
const mysql = require('mysql2');

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'skolux_erp',
>>>>>>> a27f03adb5bc002110adda8f20d649269140288b
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

<<<<<<< HEAD
module.exports = pool;
=======
module.exports = db;
>>>>>>> a27f03adb5bc002110adda8f20d649269140288b

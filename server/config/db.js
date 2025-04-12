const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'posuma.mysql.database.azure.com',
  user: 'hamza_pos',
  password: 'hamzateam11Uma',
  database: 'pointofsale',
  ssl: { rejectUnauthorized: true },
  port: 3306,
});

// handle connection errors gracefully
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as ID', db.threadId);
});

db.on('error', err => {
  console.error('MySQL connection error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    // handle reconnection logic here
  }
});

module.exports = db;


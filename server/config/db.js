const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'posuma.mysql.database.azure.com',
  user: 'jason_pos',
  password: 'jasonposteam11',
  database: 'pointofsale',
  ssl: { rejectUnauthorized: true },
  port: 3306,
});


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
  }
});

module.exports = db;


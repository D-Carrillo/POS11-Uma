const mysql = require('mysql2');

// const db = mysql.createConnection({
//   host: 'possystem11.mysql.database.azure.com',
//   user: 'posadmin11',
//   password: 'Umateam11',
//   database: 'umateam11pos',
//   ssl: { rejectUnauthorized: true },
//   port: 3306,
// });
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '00178723@Dc',
  database: 'pointofsale',
  //ssl: { rejectUnauthorized: true },
  port: 3306,
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

module.exports = db;


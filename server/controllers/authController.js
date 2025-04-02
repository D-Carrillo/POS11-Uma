
const db = require('../config/db');

exports.login = (req, res) => {
    const { email, password, typeOfUser } = req.body;
  
    let table, idField;
    
    if (typeOfUser === 'customer') {
      table = 'customer';
      idField = 'Customer_ID'; // Column name for customer ID
    } else if (typeOfUser === 'supplier') {
      table = 'supplier';
      idField = 'Supplier_ID'; // Column name for supplier ID
    }
  
    const query = `SELECT first_name, last_Name, password, ${idField} FROM ${table} WHERE Email = ?`;
    
    db.query(query, [email], (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length === 0) return res.status(401).send('Account not found');
  
      const user = results[0];
      
      if (user.password !== password) {
        return res.status(401).send('Invalid credentials');
      }
  
      res.json({
        success: true,
        user: {
          first_name: user.first_name,
          last_Name: user.last_Name,
          id: user[idField],
          type: table
        }
      });
    });
  };
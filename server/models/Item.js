const db = require('../config/db');

class Item {
    static getAll(callback) {
        db.query('SELECT Item_ID, Name, price, description, stock_quantity From Item Where is_deleted = 0 and stock_quantity > 0', (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    }

    static findItem(itemName, callback) {
        db.query(`Select Name From item Where name = ?`, [itemName], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    }

    static create(itemData, callback) {
        const { itemName, itemDescription, price, quantity, reorderThreshold, id, category  } = itemData;
        
        db.query(
          'INSERT INTO item SET ?', 
          {
            Name: itemName,
            description: itemDescription,
            Price: price,
            stock_quantity: quantity,
            reorder_Threshold: reorderThreshold,
            supplier_ID: id,
            category_ID: category
          },
          callback
        );
    }

}

module.exports = Item;
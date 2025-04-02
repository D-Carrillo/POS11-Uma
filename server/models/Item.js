const db = require('../config/db');

class Item {
    static getAll(callback) {
        db.query('SELECT Item_ID, Name, price, stock_quantity From Item', (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    }
}

module.exports = Item;
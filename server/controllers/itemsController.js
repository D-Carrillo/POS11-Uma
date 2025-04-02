const Item = require('../models/Item');

const getAllItems = (req, res) => {
    Item.getAll((err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({error: 'Failed to fetch products'});
        }
        console.log('Raw database results: ', results);
        res.json(results);
    });
};

module.exports = {
    getAllItems
};
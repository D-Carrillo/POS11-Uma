const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');

router.get('/', itemsController.getAllItems);
router.post('/item-entry', itemsController.itemEntry);
router.get('/supplier/:supplierId',itemsController.getSupplierItems);
router.post('/deleteitem/:itemId', itemsController.itemdelete);
router.put('/modify/:itemId', itemsController.modify);

module.exports = router;
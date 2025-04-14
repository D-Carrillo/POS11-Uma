const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.post('/transaction', transactionController.createTransaction);
router.post('/transaction-item', transactionController.createTransactionItem);
router.get('/userTransactions/:userId', transactionController.getUserTransactions);
router.post('/returns', transactionController.returnItem);
router.get('/getReturns', transactionController.getreturnItem);

module.exports = router;
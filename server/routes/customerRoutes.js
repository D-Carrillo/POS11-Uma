const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/customer-entry-form', customerController.register);

module.exports = router;
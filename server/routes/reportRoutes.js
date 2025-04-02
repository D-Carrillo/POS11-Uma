const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/reports/:period/:customerId', reportController.getCustomerReports);
router.get('/supplier/:supplierID', reportController.getSupplierReport);

module.exports = router;
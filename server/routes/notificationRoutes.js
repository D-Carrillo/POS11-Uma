const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

//get all notifications for a supplier
router.get('/supplier/:supplierId', notificationController.getSupplierNotifications);

//mark notification as read
router.put('/:notificationId/read', notificationController.markNotificationAsRead);

module.exports = router;
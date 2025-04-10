const db = require('../config/db');

const getSupplierNotifications = async (req, res) => {
  const supplierId = req.params.supplierId;
  
  try {
    //debug
    const testNotifications = [
      {
        notification_id: 1,
        supplier_id: supplierId,
        item_id: 123,
        message: "Test notification for debugging",
        created_at: new Date(),
        is_read: 0
      }
    ];
    
    res.status(200).json(testNotifications);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
};

// mark notification as read
const markNotificationAsRead = async (req, res) => {
  const { notificationId } = req.params;
  
  try {
    const query = `
      UPDATE supplier_notification 
      SET is_read = 1 
      WHERE notification_id = ?
    `;
    
    await db.query(query, [notificationId]);
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ message: 'Failed to update notification' });
  }
};

module.exports = {
  getSupplierNotifications,
  markNotificationAsRead
};
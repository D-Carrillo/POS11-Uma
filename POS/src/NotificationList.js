import React from 'react';
import { useNotifications } from './NotificationContext';
import './Notifications.css';

const NotificationList = ({ onClose }) => {
  const { notifications, loading, error, markAsRead } = useNotifications();

  if (loading) {
    return <div className="notification-list-container">Loading notifications...</div>;
  }

  if (error) {
    return <div className="notification-list-container error">{error}</div>;
  }

  if (notifications.length === 0) {
    return <div className="notification-list-container">No notifications</div>;
  }

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markAsRead(notification.notification_id);
    }
  };

  return (
    <div className="notification-list-container">
      <div className="notification-header">
        <h3>Notifications</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <ul className="notification-list">
        {notifications.map((notification) => (
          <li 
            key={notification.notification_id} 
            className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="notification-content">
              {notification.message}
            </div>
            <div className="notification-time">
              {new Date(notification.created_at).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
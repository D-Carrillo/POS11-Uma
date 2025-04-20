import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminSettings = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user || !user.is_admin) {
    return <Navigate to="/" />;
  }
  
  return (
    <div>
      <h1>System Settings</h1>
      <p>This page will allow configuration of system settings.</p>
    </div>
  );
};

export default AdminSettings;
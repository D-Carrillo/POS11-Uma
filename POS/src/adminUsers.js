import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminUsers = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user || !user.is_admin) {
    return <Navigate to="/" />;
  }
  
  return (
    <div>
      <h1>User Management</h1>
      <p>This page will allow management of users.</p>
    </div>
  );
};

export default AdminUsers;
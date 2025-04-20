import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProducts = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user || !user.is_admin) {
    return <Navigate to="/" />;
  }
  
  return (
    <div>
      <h1>Product Management</h1>
      <p>This page will allow management of products.</p>
    </div>
  );
};

export default AdminProducts;
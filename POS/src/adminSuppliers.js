import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminSuppliers = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user || !user.is_admin) {
    return <Navigate to="/" />;
  }
  
  return (
    <div>
      <h1>Supplier Management</h1>
      <p>This page will allow management of suppliers.</p>
    </div>
  );
};

export default AdminSuppliers;
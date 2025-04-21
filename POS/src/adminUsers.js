import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import './adminUsers.css'; // We'll create this CSS file

const AdminUsers = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('/api/admin/customers');
        if (response.data.success) {
          setCustomers(response.data.data);
        } else {
          setError('Failed to fetch customers');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (!user || !user.is_admin) {
    return <Navigate to="/" />;
  }

  if (loading) {
    return <div className="loading">Loading customers...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="admin-users-container">
      <h1>Customer Management</h1>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Date of Birth</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.Customer_ID}>
                <td>{customer.first_name}</td>
                <td>{customer.last_Name}</td>
                <td>{customer.Email}</td>
                <td>{customer.DOB ? new Date(customer.DOB).toLocaleDateString() : 'N/A'}</td>
                <td>{customer.Phone_Number || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
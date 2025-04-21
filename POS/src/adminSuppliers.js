import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const AdminSuppliers = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  if (!user || !user.is_admin) {
    return <Navigate to="/" />;
  }

  const fetchSuppliers = async () => {

    try {
      const response = await axios.get(`http://localhost:5000/api/supplier-list/`);

      if (response.data.success) {
        setSuppliers(response.data.data.supplierData);
      } else {
        throw new Error(response.data.error || 'Failed to fetch report');
      }
    } catch (err) {
      console.error('Error fetching supplier report:', err);
    }
  };
  return (
    <div className="admin-users-container" >
      <h1>Supplier Management</h1>
      <div className="users-table-container">
      {suppliers && suppliers.length > 0 && (
        <table className="users-table">
          <thead>
            <tr>
              <th>Supplier ID</th>
              <th>Company Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Deleted?</th>
            </tr>
          </thead>
          <tbody>
          {suppliers.map((supplier, index) => (
            <tr key={index}>
              <td>{supplier.supplier_id}</td>
              <td>{supplier.company_name}</td>
              <td>{supplier.email}</td>
              <td>{supplier.phone_number}</td>
              <td>{supplier.is_deleted === 1 ? "Yes" : "No"}</td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
      </div>
    </div>
  );
};

export default AdminSuppliers;
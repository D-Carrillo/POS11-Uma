import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your backend base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  // Auth endpoints
  login: (email, password, userType) => 
    api.post('/auth/login', { email, password, typeOfUser: userType }),

  // Customer endpoints
  registerCustomer: (customerData) => 
    api.post('/customer-entry-form', customerData),

  // Supplier endpoints
  registerSupplier: (supplierData) => 
    api.post('/supplier-entry-form', supplierData),
};
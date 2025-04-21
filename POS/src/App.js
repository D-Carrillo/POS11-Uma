import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Landing from './landing-page';
import ShoppingCart from './shopping-cart';
import Checkout from './checkout';
import CustomerEntryForm from './customer-entry-form';
import Login from './login';
import UserPage from './user-page';
import SupplierForm from './SupplierForm';
import SupplierPage from './supplier-page';
import ItemEntryForm from './item-entry';
import { NotificationProvider } from './NotificationContext';
import AdminUsers from './adminUsers';
import AdminProducts from './adminProducts';
import AdminSuppliers from './adminSuppliers';
import AdminLayout from './adminLayout';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <NotificationProvider>
      <Router>
        <Routes>
          <Route path="/" element={user ? <Landing /> : <Navigate to="/login" />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/user-page" element={user ? <UserPage /> : <Navigate to="/login" />} />
          <Route path="/supplier-page" element={user ? <SupplierPage /> : <Navigate to="/login" />} />
          <Route path="/customer-entry-form" element={!user ? <CustomerEntryForm /> : <Navigate to="/" />} />
          <Route path="/shopping-cart" element={<ShoppingCart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/supplier-entry-form" element={!user ? <SupplierForm /> : <Navigate to="/" />} />
          <Route path="/item-entry" element={<ItemEntryForm />} />
          
          {/* Admin Routes */}
          <Route element={<AdminLayout />}>
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/products" element={<AdminProducts />} />
            <Route path="/suppliers" element={<AdminSuppliers />} />
          </Route>
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;
import './App.css';
import React from 'react';
import Landing from './landing-page';
import ShoppingCart from './shopping-cart';
import Checkout from './checkout';
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import CustomerEntryForm from './customer-entry-form';
import Login from './login';
import UserPage from './user-page';
import SupplierForm from './SupplierForm';
import SupplierPage from './supplier-page';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Router>
      <Routes>
        <Route path = "/" element = { user ? <Landing /> : <Navigate to = "/login" /> } />
        <Route path = "/login" element = {!user ? <Login /> : <Navigate to = "/"/>} />
        <Route path = "/user-page" element = {<UserPage />} />
        <Route path = "/supplier-page" element = {<SupplierPage/>} />
        <Route path = "/customer-entry-form" element = {!user ? <CustomerEntryForm /> : <Navigate to = "/"/>} />
        <Route path = "/shopping-cart"  element = {<ShoppingCart/>} />
        <Route path = "/checkout"  element = {<Checkout/>} />
        <Route path = "/supplier-entry-form" element = {!user ? <SupplierForm /> : <Navigate to = "/"/>} />

      </Routes>
    </Router>
  );
}

export default App;

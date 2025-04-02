import React, { useState, useEffect } from 'react';
import { useNavigate , Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import './checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [product, setProduct] = useState(null);

  const [totals, setTotals] = useState({
    subtotal: 0,
    tax: 0,
    total: 0
  });

  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  // Calculate totals on component mount
  useEffect(() => {
    const selectedProduct = JSON.parse(localStorage.getItem('selectedProduct'));
    if(!selectedProduct) {
      navigate('/');
      return;
    }
    setProduct(selectedProduct);

    const subtotal = selectedProduct.price;
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    setTotals({
      subtotal: parseFloat(subtotal).toFixed(2),
      tax: tax.toFixed(2),
      total: parseFloat(total).toFixed(2)
    });
}, [navigate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Format card number as user types
  const formatCardNumber = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.substring(0, 16);
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setFormData(prev => ({
      ...prev,
      cardNumber: value
    }));
  };

  // Format expiry date as user types
  const formatExpiry = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.substring(0, 4);
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    setFormData(prev => ({
      ...prev,
      expiry: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic field validation
    if (!formData.cardName || !formData.cardNumber || !formData.expiry || !formData.cvv) {
      alert('Please fill in all payment fields.');
      return;
    }
    
    // Validate card number (digits only, 16 digits)
    const cardNumber = formData.cardNumber.replace(/\s+/g, '');
    if (!/^\d{16}$/.test(cardNumber)) {
      alert('Please enter a valid 16-digit card number.');
      return;
    }
    
    // Validate expiration date (MM/YY)
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry)) {
      alert('Please enter a valid expiration date in MM/YY format.');
      return;
    }
    
    // Validate CVV (3 digits)
    if (!/^\d{3}$/.test(formData.cvv)) {
      alert('Please enter a valid 3-digit CVV.');
      return;
    }
    
    // Simulate successful payment processing
    alert('Payment successful! Your order has been placed.');
    localStorage.removeItem('selectedProduct');
    navigate('/');
  };

  if(!product) return <div>Loading...</div>
  return (
    <div className='bodies'>
          <div className='top-user-nav'>
            <div className="logo">
              <FontAwesomeIcon icon={faShoppingCart} />
              RetailPro
            </div>
            <div className="user-controls">             
                 {/* <Link to="/shopping-cart">
                  <button className="cart-button" title="View Shopping Cart">
                  <FontAwesomeIcon icon={faShoppingCart} />
                  </button>
              </Link> */}
              <div className="user-info">
                <Link to={user.type === 'customer' ? "/user-page" : "/supplier-page"}>
                  <button className="user-button">{user.first_name}</button>
                </Link>
              </div>
            </div>
          </div>      
        <div className="checkout-container">
        {/* Order Summary Section */}
        <div className="order-summary">
            <h2>Order Summary</h2>
            <div id="summary-items">
            <div className="summary-item">
              <span>{product.Name} x 1</span>
              <span>${parseFloat(product.price).toFixed(2)}</span>
            </div>
            </div>
            <div className="summary-row">
            <span>Subtotal</span>
            <span id="subtotal">${totals.subtotal}</span>
            </div>
            <div className="summary-row">
            <span>Tax (8%)</span>
            <span id="tax">${totals.tax}</span>
            </div>
            <div className="summary-row total">
            <span>Total</span>
            <span id="total">${totals.total}</span>
            </div>
        </div>
        
        {/* Payment Form Section */}
        <form id="payment-form" onSubmit={handleSubmit}>
            <h2>Payment Information</h2>
            
            <label htmlFor="card-name">Cardholder Name</label>
            <input 
            type="text" 
            id="card-name" 
            placeholder="John Doe" 
            value={formData.cardName}
            onChange={handleInputChange}
            required 
            />
            
            <label htmlFor="card-number">Card Number</label>
            <input 
            type="text" 
            id="card-number" 
            placeholder="1234 5678 9012 3456" 
            maxLength="19" 
            value={formData.cardNumber}
            onChange={formatCardNumber}
            required 
            />
            
            <label htmlFor="expiry">Expiration Date</label>
            <input 
            type="text" 
            id="expiry" 
            placeholder="MM/YY" 
            maxLength="5" 
            value={formData.expiry}
            onChange={formatExpiry}
            required 
            />
            
            <label htmlFor="cvv">CVV</label>
            <input 
            type="text" 
            id="cvv" 
            placeholder="123" 
            maxLength="3" 
            value={formData.cvv}
            onChange={handleInputChange}
            required 
            />
            
            <button type="submit" className="checkout-button">
            <FontAwesomeIcon icon={faLock} /> Place Order
            </button>
        </form>
        </div>
    </div>
  );
};

export default Checkout;
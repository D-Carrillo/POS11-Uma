import React, { useState, useEffect } from 'react';
import "./shopping-cart.css";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faExpand, 
  faShoppingCart,   
  faTrash, 
  faArrowLeft, 
  faMinus, 
  faPlus, 
  faTimes, 
  faLock 
} from '@fortawesome/free-solid-svg-icons';
import { 
  faCcVisa, 
  faCcMastercard, 
  faCcAmex, 
  faCcPaypal 
} from '@fortawesome/free-brands-svg-icons';

const ShoppingCart = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);
    

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const continueShopping = () => {
    // Navigate to index page
    window.location.href = '/';
  };

  const updateQuantity = (Item_ID, newQuantity) => {
    setCartItems(cartItems.map(item => 
      item.Item_ID === Item_ID ? { ...item, quantity:
         Math.max(1, Math.min(item.maxQuantity, newQuantity || 99, newQuantity)) 
        } : item
    ));
  };

  const removeItem = (Item_ID) => {
    setCartItems(cartItems.filter(item => item.Item_ID !== Item_ID));
  };

  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setCartItems([]);
    }
  };

  const calculateTotals = () => {
    console.log(JSON.parse(localStorage.getItem('cart')));

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    
    return {
      subtotal: Number(subtotal).toFixed(2),
      tax: Number(tax).toFixed(2),
      total: Number(total).toFixed(2)
    };
  };

  const { subtotal, tax, total } = calculateTotals();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your card is empty!');
      return;
    }

    localStorage.setItem('checkoutCart', JSON.stringify({
      items: cartItems,
      totals:calculateTotals()
    }));

    window.location.href ='/checkout';
  }


  return (
    <div className="shopping-container">
      {/* Top Navigation */}
      <div className="top-nav">
        <button className="toggle-sidebar" id="toggle-sidebar" title="Toggle Sidebar" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={sidebarCollapsed ? faExpand : faBars} />
        </button>
        <div className="logo">
          <FontAwesomeIcon icon={faShoppingCart} />
          RetailPro
        </div>
        

        
        {/* User Controls */}
        <div className="user-controls">
          <button className="cart-button active" id="cart-button" title="View Shopping Cart">
            <FontAwesomeIcon icon={faShoppingCart} />
            <span className="cart-count">{cartItems.length}</span>
          </button>
          <div className="user-info">
            <Link to = "/user-page">
              <button className = "user-button">{user.first_name}</button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main Area */}
    <div className="landing-main-area">
        
        
        {/* Main Content */}
        <div className = "main-content-container">
            <main className={`main-content ${sidebarCollapsed ? 'full-width' : ''}`} id="main-content">
            <div className="cart-header">
                <h1><FontAwesomeIcon icon={faShoppingCart} /> Shopping Cart</h1>
                <div className="cart-actions">
                <button className="btn-secondary" onClick = {clearCart}><FontAwesomeIcon icon={faTrash} /> Clear Cart</button>
                <button className="btn-primary continue-shopping" onClick={continueShopping}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Continue Shopping
                </button>
                </div>
            </div>
            
            <div className="Cart-container">
                <div className="cart-items">
                {cartItems.length === 0 && (
                  <div className = "empty-cart">
                    <p>Your cart is empty</p>
                    <button onClick = {continueShopping}>Continue Shopping</button>
                  </div>
                )}
                {cartItems.map(item => (
                    <div className="cart-item" key={item.Item_ID}>
                    <div className="item-image">
                        <img src={item.image} alt={item.Name} />
                    </div>
                    <div className="item-details">
                        <div className="item-name">{item.Name}</div>
                        {/* <div className="item-sku">SKU: {item.sku}</div> */}
                    </div>
                    <div className="item-price">${Number(item.price).toFixed(2)}</div>
                    <div className="item-quantity">
                        <button 
                        className="quantity-btn decrease" 
                        onClick={() => updateQuantity(item.Item_ID, item.quantity - 1)}
                        >
                        <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <input 
                        type="number" 
                        value={item.quantity} 
                        min="1" 
                        max={item.maxQuantity}
                        onChange={(e) => updateQuantity(item.Item_ID, parseInt(e.target.value) || 1)}
                        />
                        <button 
                        className="quantity-btn increase" 
                        onClick={() => updateQuantity(item.Item_ID, item.quantity + 1)}
                        >
                        <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
                    <div className="item-total">${Number(item.price * item.quantity).toFixed(2)}</div>
                    <div className="item-actions">
                        <button className="remove-item" onClick={() => removeItem(item.Item_ID)}>
                        <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                    </div>
                ))}
                </div>
                
                <div className="cart-summary">
                <h2>Order Summary</h2>
                <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${subtotal}</span>
                </div>
                <div className="summary-row">
                    <span>Shipping</span>
                    <span>Free</span>
                </div>
                <div className="summary-row">
                    <span>Tax (8%)</span>
                    <span>${tax}</span>
                </div>
                <div className="summary-row discount">
                    <div className="discount-input">
                    <input type="text" placeholder="Discount Code" />
                    <button>Apply</button>
                    </div>
                </div>
                <div className="summary-row total">
                    <span>Total</span>
                    <span>${total}</span>
                </div>
                <Link to="/checkout" onClick={handleCheckout}>
                    <button className="checkout-page">
                        <FontAwesomeIcon icon={faLock} /> Proceed to Checkout
                    </button>
                </Link>
                <div className="payment-methods">
                    <FontAwesomeIcon icon={faCcVisa} />
                    <FontAwesomeIcon icon={faCcMastercard} />
                    <FontAwesomeIcon icon={faCcAmex} />
                    <FontAwesomeIcon icon={faCcPaypal} />
                </div>
                </div>
            </div>
            </main>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
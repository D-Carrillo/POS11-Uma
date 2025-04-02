import React, { useState } from 'react';
import "./shopping-cart.css";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, 
  faExpand, 
  faShoppingCart, 
  faSearch, 
  faHome, 
  faTag, 
  faUsers, 
  faChartBar, 
  faBoxes, 
  faPercent, 
  faCog, 
  faQuestionCircle, 
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
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Wireless Headphones",
      sku: "WH-2023-BLK",
      price: 129.99,
      quantity: 1,
      maxQuantity: 24,
      image: "/api/placeholder/80/80"
    },
    {
      id: 2,
      name: "Smart Watch",
      sku: "SW-2023-SLV",
      price: 199.99,
      quantity: 1,
      maxQuantity: 12,
      image: "/api/placeholder/80/80"
    },
    {
      id: 3,
      name: "Smartphone Case",
      sku: "SC-2023-BLU",
      price: 24.99,
      quantity: 2,
      maxQuantity: 56,
      image: "/api/placeholder/80/80"
    },
    {
      id: 4,
      name: "Wireless Mouse",
      sku: "WM-2023-BLK",
      price: 34.99,
      quantity: 1,
      maxQuantity: 32,
      image: "/api/placeholder/80/80"
    }
  ]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const continueShopping = () => {
    // Navigate to index page
    window.location.href = '/';
  };

  const updateQuantity = (id, newQuantity) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, Math.min(item.maxQuantity, newQuantity)) } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    
    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const { subtotal, tax, total } = calculateTotals();

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
        
        {/* Searchbar */}
        <div className="search-container">
          <div className="search-bar">
            <input type="text" className="search-input" placeholder="Search products by name, SKU, or barcode..." />
            <button className="search-button"><FontAwesomeIcon icon={faSearch} /> Search</button>
          </div>
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
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`} id="sidebar">
          <ul className="sidebar-menu">
            <li>
              <FontAwesomeIcon icon={faHome} />
              Dashboard
            </li>
            <li>
              <FontAwesomeIcon icon={faTag} />
              Products
            </li>
            <li className="active">
              <FontAwesomeIcon icon={faShoppingCart} />
              Shopping Cart
            </li>
            <li>
              <FontAwesomeIcon icon={faUsers} />
              Customers
            </li>
            <li>
              <FontAwesomeIcon icon={faChartBar} />
              Reports
            </li>
            <li>
              <FontAwesomeIcon icon={faBoxes} />
              Inventory
            </li>
            <li>
              <FontAwesomeIcon icon={faPercent} />
              Discounts
            </li>
            <li>
              <FontAwesomeIcon icon={faCog} />
              Settings
            </li>
            <li>
              <FontAwesomeIcon icon={faQuestionCircle} />
              Help
            </li>
          </ul>
        </aside>
        
        {/* Main Content */}
        <div className = "main-content-container">
            <main className={`main-content ${sidebarCollapsed ? 'full-width' : ''}`} id="main-content">
            <div className="cart-header">
                <h1><FontAwesomeIcon icon={faShoppingCart} /> Shopping Cart</h1>
                <div className="cart-actions">
                <button className="btn-secondary"><FontAwesomeIcon icon={faTrash} /> Clear Cart</button>
                <button className="btn-primary continue-shopping" onClick={continueShopping}>
                    <FontAwesomeIcon icon={faArrowLeft} /> Continue Shopping
                </button>
                </div>
            </div>
            
            <div className="Cart-container">
                <div className="cart-items">
                {cartItems.map(item => (
                    <div className="cart-item" key={item.id}>
                    <div className="item-image">
                        <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-details">
                        <div className="item-name">{item.name}</div>
                        <div className="item-sku">SKU: {item.sku}</div>
                    </div>
                    <div className="item-price">${item.price.toFixed(2)}</div>
                    <div className="item-quantity">
                        <button 
                        className="quantity-btn decrease" 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                        <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <input 
                        type="number" 
                        value={item.quantity} 
                        min="1" 
                        max={item.maxQuantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        />
                        <button 
                        className="quantity-btn increase" 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                        <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
                    <div className="item-total">${(item.price * item.quantity).toFixed(2)}</div>
                    <div className="item-actions">
                        <button className="remove-item" onClick={() => removeItem(item.id)}>
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
                <Link to="/checkout" onClick={() => alert('Redirecting to checkout...')}>
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
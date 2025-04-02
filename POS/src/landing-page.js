import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './landing-page.css'; // Import your CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faExpand,
  faShoppingCart,
  faHome,
  faTag,
  faUsers,
  faChartBar,
  faBoxes,
  faPercent,
  faCog,
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';

function Landing() {
  const user = JSON.parse(localStorage.getItem('user'));
  // Load the sidebar state from localStorage (or default to false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    JSON.parse(localStorage.getItem('sidebarCollapsed')) || false
  );

  // Update localStorage whenever the sidebar state changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const [activeCategory, setActiveCategory] = useState('All Products');
  const [activeMenuItem, setActiveMenuItem] = useState('Dashboard');

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
  };

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };


  const handleProductClick = () => {
    alert('Item added to cart!');
  };

  return (
    <div className="landing-container">
      {/* Top Navigation Bar */}
      <div className="top-nav">
        <button className="toggle-sidebar" onClick={toggleSidebar} title="Toggle Sidebar">
          <FontAwesomeIcon icon={sidebarCollapsed ? faExpand : faBars} />
        </button>
        <div className="logo">
          <FontAwesomeIcon icon={faShoppingCart} />
          RetailPro
        </div>
        <div className="search-container">
          <div className="search-bar">
            <input type="text" className="search-input" placeholder="Search products by name, SKU, or barcode..." />
            <button className="search-button">
              <FontAwesomeIcon icon="search" />
              <span>Search</span>
            </button>
          </div>
        </div>
        <div className="user-controls">
          <Link to="/shopping-cart">
            <button className="cart-button" title="View Shopping Cart">
              <FontAwesomeIcon icon={faShoppingCart} />
            </button>
          </Link>
          <div className="user-info">
            <Link to = {user.type === 'customer' ? "user-page" : "supplier-page"}>
              <button className = "user-button">{user.first_name}</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="categories-bar">
        {['All Products', 'Electronics', 'Clothing', 'Home & Kitchen', 'Toys', 'Sporting Goods', 'Business & Industrial', 'Jewelry & Watches', 'Refurbished'].map((category) => (
          <div
            key={category}
            className={`category-tab ${activeCategory === category ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </div>
        ))}
      </div>

      {/* Main Area (Sidebar + Main Content) */}
      <div className="main-area">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <ul className="sidebar-menu">
            {[
              { icon: faHome, label: 'Dashboard' },
              { icon: faTag, label: 'Products' },
              { icon: faShoppingCart, label: 'Shopping Cart' },
              { icon: faUsers, label: 'Customers' },
              { icon: faChartBar, label: 'Reports' },
              { icon: faBoxes, label: 'Inventory' },
              { icon: faPercent, label: 'Discounts' },
              { icon: faCog, label: 'Settings' },
              { icon: faQuestionCircle, label: 'Help' },
            ].map((item) => (
              <li
                key={item.label}
                className={`${activeMenuItem === item.label ? 'active' : ''}`}
                onClick={() => handleMenuItemClick(item.label)}
              >
                <FontAwesomeIcon icon={item.icon} />
                {!sidebarCollapsed && item.label}
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <div className = "main-content-wrapper">
            <main className={`main-content ${sidebarCollapsed ? 'full-width' : ''}`}>
            <div className="filter-options">
                <div className="filter-label">Sort by:</div>
                <select className="filter-select">
                <option>Newest First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Best Selling</option>
                </select>
                <div className="filter-label">In Stock:</div>
                <select className="filter-select">
                <option>All Items</option>
                <option>In Stock Only</option>
                <option>Out of Stock</option>
                </select>
            </div>
            <div className="product-grid">
                {[
                { id: 1, name: 'Wireless Headphones', price: 129.99, inventory: 24 },
                { id: 2, name: 'Smart Watch', price: 199.99, inventory: 12 },
                { id: 3, name: 'Bluetooth Speaker', price: 79.99, inventory: 18 },
                { id: 4, name: 'Smartphone Case', price: 24.99, inventory: 56 },
                { id: 5, name: 'Laptop Bag', price: 49.99, inventory: 9 },
                { id: 6, name: 'Wireless Mouse', price: 34.99, inventory: 32 },
                ].map((product) => (
                <div key={product.id} className="product-card" onClick={handleProductClick}>
                    <div className="product-image">
                    <img src="/api/placeholder/150/150" alt={product.name} />
                    </div>
                    <div className="product-details">
                    <div className="product-title">{product.name}</div>
                    <div className="product-price">${product.price.toFixed(2)}</div>
                    <div className="product-inventory">In stock: {product.inventory}</div>
                    </div>
                </div>
                ))}
            </div>
            </main>
        </div>
      </div>
    </div>
  );
}

export default Landing;
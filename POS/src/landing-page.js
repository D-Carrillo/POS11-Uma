import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './landing-page.css';
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
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';

function Landing() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    JSON.parse(localStorage.getItem('sidebarCollapsed')) || false
  );
  const [activeCategory, setActiveCategory] = useState('All Products');
  const [activeMenuItem, setActiveMenuItem] = useState('Dashboard');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState('default');
  const [displayProducts, setDisplayProducts] = useState(products);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/items');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/items/search?query=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Failed to fetch search results');
      const data = await response.json();
      console.log('Search results:', data);
      setProducts(data);
      setDisplayProducts(data); // Update the displayed products
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };



  const getSortedProducts = useCallback(() => {
    const productsToSort = products.slice();

    let sortedProducts = [];

    switch (sortOption) {
      case 'lowToHigh':
        sortedProducts = productsToSort.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'highToLow':
        sortedProducts = productsToSort.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      default:
        sortedProducts = products.slice();
    }

    if (activeCategory !== 'All Products') {
      sortedProducts = sortedProducts.filter(product => product.Category_name === activeCategory);
    }

    console.log(sortedProducts);
    return sortedProducts;
  }, [products, sortOption, activeCategory]);

  const sortProducts = useCallback(() => {
    const sorted = getSortedProducts();
    setDisplayProducts(sorted);
  }, [getSortedProducts]);

  useEffect(() => {
    sortProducts();

  }, [sortOption, products, activeCategory, sortProducts]);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const handleCategoryClick = (category) => setActiveCategory(category);
  const handleMenuItemClick = (menuItem) => setActiveMenuItem(menuItem);
  const handleProductClick = (product) => {
    if (user.type === "customer") {

      const normalizedProduct = {
        ...product,
        price: product.price || product.Price,
      };

      localStorage.setItem('selectedProduct', JSON.stringify(normalizedProduct));
      window.location.href = '/checkout';
    } else {
      alert('Need to be a customer for Checkout!');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="landing-container">
      <div className="top-nav">
        <button className="toggle-sidebar" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={sidebarCollapsed ? faExpand : faBars} />
        </button>
        <div className="logo">
          <FontAwesomeIcon icon={faShoppingCart} />
          RetailPro
        </div>
        <div className="search-container">
          <div className="search-bar">
            <input type="text" className="search-input" placeholder="Search products..."
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { handleSearch(); } }} />
            <button className="search-button" onClick={() => handleSearch()}>
              <FontAwesomeIcon icon="search" />
              <span>Search</span>
            </button>
          </div>
        </div>
        <div className="user-controls">

          <div className="user-info">
            <Link to={user.type === 'customer' ? "/user-page" : "/supplier-page"}>
              <button className="user-button">{user.first_name}</button>
            </Link>
          </div>
        </div>
      </div>

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

      <div className="main-area">
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

        <div className="main-content-wrapper">
          <main className={`main-content ${sidebarCollapsed ? 'full-width' : ''}`}>
            <div className="filter-options">
              <div className="filter-label">Sort by:</div>
              <select className="filter-select"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="default">Select</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
                {/*<option>Best Selling</option>
                <option>Newest First</option>*/}
              </select>
              <div className="filter-label">In Stock:</div>
              <select className="filter-select">
                <option>All Items</option>
                <option>In Stock Only</option>
                <option>Out of Stock</option>
              </select>
            </div>
            <div className="product-grid">
              {displayProducts.map((product) => (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="product-details">
                    <div className="product-title">{product.Name}</div>
                    <div className="product-price">${product.price || product.Price}</div>
                    <div className="description">{product.description}</div>
                    <div className="product-inventory">In stock: {product.stock_quantity}</div>
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
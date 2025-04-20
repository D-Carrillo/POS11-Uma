import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './adminDashboard.css';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    todaySales: 0,
    totalProducts: 0,
    lowStockItems: 0,
    activeSuppliers: 0,
    recentTransactions: [],
    inventoryStatus: [],
    salesTrend: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        
        const [
          todaySalesRes,
          productsRes,
          lowStockRes,
          suppliersRes,
          transactionsRes,
          inventoryRes,
          salesTrendRes
        ] = await Promise.all([
          axios.get('/api/dashboard/today-sales'),
          axios.get('/api/dashboard/total-products'),
          axios.get('/api/dashboard/low-stock-items'),
          axios.get('/api/dashboard/active-suppliers'),
          axios.get('/api/dashboard/recent-transactions'),
          axios.get('/api/dashboard/inventory-status'),
          axios.get('/api/dashboard/sales-trend')
        ]);

        setDashboardData({
          todaySales: todaySalesRes.data.todaySales || 0,
          totalProducts: productsRes.data.totalProducts || 0,
          lowStockItems: lowStockRes.data.lowStockItems || 0,
          activeSuppliers: suppliersRes.data.activeSuppliers || 0,
          recentTransactions: transactionsRes.data.recentTransactions || [],
          inventoryStatus: inventoryRes.data.inventoryStatus || [],
          salesTrend: salesTrendRes.data.salesTrend || []
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  
  const salesChange = dashboardData.salesTrend.length > 1 
    ? ((dashboardData.salesTrend[0].total - dashboardData.salesTrend[1].total) / 
       dashboardData.salesTrend[1].total * 100).toFixed(2)
    : 0;

  return (
    <div className="dashboard-container">
      <h1>POS Dashboard Overview</h1>
      
      <div className="stats-grid">
        {/* Today's Sales */}
        <div className="stat-card sales">
          <div className="stat-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-info">
            <h3>Today's Sales</h3>
            <p>${dashboardData.todaySales.toFixed(2)}</p>
            <span className={`stat-trend ${salesChange >= 0 ? 'positive' : 'negative'}`}>
              {salesChange >= 0 ? '+' : ''}{salesChange}% from yesterday
            </span>
          </div>
        </div>

        {/* Total Products */}
        <div className="stat-card products">
          <div className="stat-icon">
            <i className="fas fa-boxes"></i>
          </div>
          <div className="stat-info">
            <h3>Total Products</h3>
            <p>{dashboardData.totalProducts}</p>
            <span className="stat-trend">
              {dashboardData.inventoryStatus.length} categories
            </span>
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="stat-card stock">
          <div className="stat-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="stat-info">
            <h3>Low Stock</h3>
            <p>{dashboardData.lowStockItems}</p>
            <Link to="/products" className="stat-trend warning">
              Needs restocking
            </Link>
          </div>
        </div>

        {/* Active Suppliers */}
        <div className="stat-card suppliers">
          <div className="stat-icon">
            <i className="fas fa-truck"></i>
          </div>
          <div className="stat-info">
            <h3>Active Suppliers</h3>
            <p>{dashboardData.activeSuppliers}</p>
            <Link to="/suppliers" className="stat-trend">
              View all suppliers
            </Link>
          </div>
        </div>
      </div>

      <div className="dashboard-panels">
        {/* Recent Transactions */}
        <div className="panel recent-transactions">
          <h2>Recent Transactions</h2>
          <div className="panel-content">
            {dashboardData.recentTransactions.length > 0 ? (
              dashboardData.recentTransactions.map(transaction => (
                <div key={transaction.Transaction_ID} className="transaction-item">
                  <div className="transaction-details">
                    <span className="transaction-id">#{transaction.Transaction_ID}</span>
                    <span className="transaction-time">
                      {new Date(transaction.sale_time).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="transaction-amount">
                    ${transaction.Total_cost.toFixed(2)}
                  </div>
                  <div className="transaction-method">
                    {transaction.Payment_method}
                  </div>
                </div>
              ))
            ) : (
              <p>No recent transactions</p>
            )}
            <Link to="/transactions" className="view-all">
              View All Transactions
            </Link>
          </div>
        </div>

        {/* Inventory Status */}
        <div className="panel inventory-status">
          <h2>Inventory Status</h2>
          <div className="panel-content">
            {dashboardData.inventoryStatus.map(item => (
              <div key={item.Item_ID} className="inventory-item">
                <div className="inventory-name">
                  {item.Name} ({item.stock_quantity} left)
                </div>
                <div className={`inventory-level ${
                  item.stock_quantity <= item.reorder_Threshold ? 'low' : 'ok'
                }`}>
                  {item.stock_quantity <= item.reorder_Threshold ? 'Reorder' : 'In Stock'}
                </div>
              </div>
            ))}
            <Link to="/products" className="view-all">
              View Full Inventory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SupplierPage = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [reportData, setReportData] = useState([]);
    const [period, setPeriod] = useState('weekly');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to handle period change
    const handlePeriodChange = (e) => {
        setPeriod(e.target.value);
    };

    // Fetch supplier report data based on period
    const fetchSupplierReport = async () => {
        if (!user?.id) {
            setError('Supplier ID not available');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`http://localhost:5000/api/reports/supplier/${user.id}`, {
                params: { period }
            });
            setReportData(response.data);
        } catch (err) {
            console.error('Error fetching supplier report:', err);
            setError('Failed to fetch report');
        } finally {
            setLoading(false);
        }
    };

    // Fetch the report when the page loads or when the period changes
    useEffect(() => {
        fetchSupplierReport();
    }, [period]);

    const handleSignOut = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="user-page">
            <div className='top-user-nav'>
                <div className="logo">
                    <FontAwesomeIcon icon={faShoppingCart} />
                    RetailPro
                </div>
                <div className="user-controls">
                    <Link to="/shopping-cart">
                        <button className="cart-button" title="View Shopping Cart">
                            <FontAwesomeIcon icon={faShoppingCart} />
                        </button>
                    </Link>
                    <div className="user-info">
                        <button className="user-button">{user.first_name}</button>
                    </div>
                </div>
            </div>

            <h1>Welcome, {user.first_name} {user.last_Name}</h1>

            {/* Period Selector */}
            <div className="period-selector">
                <label htmlFor="period">Select Period:</label>
                <select id="period" value={period} onChange={handlePeriodChange}>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>

            {/* Report Table */}
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && reportData.length > 0 && (
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Times Sold</th>
                            <th>Total Quantity</th>
                            <th>Total Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.item_name}</td>
                                <td>{item.times_sold}</td>
                                <td>{item.total_quantity}</td>
                                <td>${item.total_revenue.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <button onClick={handleSignOut} className="signout-button">Sign Out</button>
        </div>
    );
};

export default SupplierPage;

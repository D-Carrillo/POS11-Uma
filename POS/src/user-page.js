import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Bar} from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';
import './user-page.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingCart,

} from '@fortawesome/free-solid-svg-icons';

Chart.register(...registerables);

const UserPage = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [period, setPeriod] = useState('weekly');
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    console.log('USER OBJECT:', user); 

    useEffect(() => {
        if (user?.id) {
            fetchCustomerReports();
        }
    }, [period, user?.id]);

    const fetchCustomerReports = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:5000/api/reports/${period}/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setReportData(response.data);
        }catch (err) {
            setError(err.response?.data?.message || 'Failed to load reports');
            console.error('Report error: ', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        localStorage.removeItem('user');
        window.location.href = '/login';

    };

    const chartData = {
        labels: reportData.map(r => r.period), 
        datasets: [
            {
                label: 'Total Spent ($)',
                data: reportData.map(r => r.total_spent),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }
        ]
    }

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
                    <button className = "user-button">{user.first_name}</button>
                </div>
                </div>
            </div>

            <h1>Welcome, {user.first_name} {user.last_Name}</h1>

            <div className='report-section'>
                <h2>Purchase History</h2>

                <div className='period-selector'>
                    <button onClick = {() => setPeriod('weekly')} className= {period === 'weekly' ? 'active':''}>
                        Weekly 
                    </button>
                    <button onClick = {() => setPeriod('monthly')} className= {period === 'monthly' ? 'active':''}>
                        Monthly
                    </button>
                    <button onClick = {() => setPeriod('yearly')} className= {period === 'yearly' ? 'active':''}>
                        Yearly
                    </button>
                </div>
            </div>

            {loading && <p>Loading your reports...</p>}
            {error && <p className='error'>{error}</p>}

            {!loading && !error && (
                <div className='report-content'>
                    <div className='chart-container'>
                        <Bar 
                            data = {chartData}
                            options = {{
                                responsive: true,
                                plugins: {
                                    title: {
                                        display: true, 
                                        text: `Your ${period} spending`
                                    }
                                }
                            }}
                        />
                    </div>

                    <table className='report-table'>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Transactions</th>
                                <th>Total Spent</th>
                                <th>Items</th>
                                <th>Avg. Order</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.map((report, index) => (
                                <tr key = {index}>
                                    <td>{report.period}</td>
                                    <td>{report.transaction_count}</td>
                                    <td>${Number(report.total_spent).toFixed(2)}</td>
                                    <td>{report.total_items}</td>
                                    <td>${Number(report.average_order_value).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <button onClick = {handleSignOut} className='signout-button'>Sign Out</button>
        </div>
    );
};

export default UserPage;
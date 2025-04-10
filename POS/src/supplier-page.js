import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import DiscountModal from './discountModal';
import axios from 'axios';
import "./supplier-page.css";


const SupplierPage = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [reportData, setReportData] = useState([]);
    const [period, setPeriod] = useState('weekly');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [productsError, setProductsError] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [tempItemData, setTempItemData] = useState({
    Name: '',
    description: '',
    price: 0,
    quantity: 0
    });
    const [userData, setUserData] = useState({
        Company_Name: '',
        first_name: '',
        middle_Initial: '',
        last_Name: '',
        Phone_Number: '',
        Email: '',
        Apt_number: '',
        House_num: '',
        Street: '',
        City: '',
        State: '',
        Country: '',
        Zip_code: '',
        DOB: ''
    });

    const handlePeriodChange = (e) => {
        setPeriod(e.target.value);
    };

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

    useEffect(() => {
        fetchSupplierReport();
        fetchUserData();
        fetchSupplierProducts();
    }, [period, user?.id]);

    const fetchSupplierProducts = async () => {
        if (!user?.id) {
            setProductsError('Supplier ID not available');
            return;
        }

        setProductsLoading(true);
        setProductsError(null);

        try {
            const response = await axios.get(`http://localhost:5000/api/items/supplier/${user.id}`);
            setProducts(response.data);
        } catch (err) {
            console.error('Error fetching supplier products:', err);
            setProductsError('Failed to fetch products');
        } finally {
            setProductsLoading(false);
        }
    };

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/auth/user/${user.type}/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUserData(response.data);
        } catch (err) {
            console.error('Failed to fetch user data:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSave = async () => {
        try {
            const updateData = {
                ...userData,
                DOB: userData.DOB ? userData.DOB.split('T')[0] : null,
                dob: userData.dob ? userData.DOB.split('T')[0] : null
            };
    
            Object.keys(updateData).forEach(key => {
                if (updateData[key] === undefined || updateData[key] === '') {
                    delete updateData[key];
                }
            });
    
            const response = await axios.put(
                `http://localhost:5000/auth/update/${user.type}/${user.id}`,
                updateData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
    
            const updatedUser = {
                ...user,
                first_name: updateData.first_name,
                last_Name: updateData.last_Name,
                Company_Name: updateData.Company_Name
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setEditMode(false);
            alert('Profile updated successfully!');
    
        } catch (err) {
            console.error('Update error:', err);
            alert(err.response?.data?.error || 'Failed to update profile');
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    const handleItemAdd = () => {
        window.location.href = "/item-entry";
    }


    const handleDeleteAccount = async () => {

        if (!window.confirm(`Delete your ${user.type} account?`)) return;

            
        try {
            const endpoint = `http://localhost:5000/auth/deletion/${user.type}/${user.id}`;

            const response = await axios.patch(endpoint, {
                headers: {  'Authorization': `Bearer ${localStorage.getItem('token')}`}
            });

            if(response.data.success) {
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }catch (err){
            console.error('Failed delete account:', err);
            alert("Unable to delete account");

        };
    }

    const handleDelete = async (item_Id) => {
        if (!window.confirm('Are you sure you want to delete this Product?')) return;

        try {
            await axios.post(`http://localhost:5000/api/items/deleteitem/${item_Id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });
            
            fetchSupplierProducts();
            alert('Item deleted successfully');
          } catch (err) {
            console.error('Delete failed:', err);
            alert('Failed to delete item');
          }
    };
    
    const startEditing = (product) => {
        setEditingItem(product.item_id);
        setTempItemData({
          Name: product.Name,
          description: product.description,
          price: product.price,
          quantity: product.quantity
        });
    };
      
    const cancelEditing = () => {
        setEditingItem(null);
    };
      
    const handleTempChange = (e) => {
        const { name, value } = e.target;
        setTempItemData(prev => ({
          ...prev,
          [name]: name === 'price' || name === 'quantity' ? Number(value) : value
        }));
    };

      
      const saveChanges = async () => {
        try {
          await axios.put(
            `http://localhost:5000/api/items/modify/${editingItem}`,
            tempItemData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          fetchSupplierProducts(); // Refresh the list
          setEditingItem(null);
          alert('Item updated successfully!');
        } catch (err) {
          console.error('Update failed:', err);
          alert('Failed to update item');
        }
      };

    const handleCreateDiscount = (discountData) => {
        console.log(discountData)
    };

    return (
        <div className="user-page">
            <div className='top-user-nav'>
                <div className="logo">
                    <FontAwesomeIcon icon={faShoppingCart} />
                    RetailPro
                </div>
                <div className="user-controls">
                    <div className="user-info">
                        <Link to={user.type === 'customer' ? "/user-page" : "/supplier-page"}>
                          <button className="user-button">{user.first_name}</button>
                        </Link>
                    </div>
                </div>
            </div>

            <h1>Welcome, {userData.Company_Name || `${user.first_name} ${user.last_Name}`}</h1>

            <div className="profile-section">
                <h2>Your Profile</h2>
                {editMode ? (
                    <div className="edit-profile-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Company Name*</label>
                                <input
                                    type="text"
                                    name="Company_Name"
                                    value={userData.Company_Name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name*</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={userData.first_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Middle Initial</label>
                                <input
                                    type="text"
                                    name="middle_Initial"
                                    value={userData.middle_Initial}
                                    onChange={handleInputChange}
                                    maxLength="1"
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name*</label>
                                <input
                                    type="text"
                                    name="last_Name"
                                    value={userData.last_Name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Email*</label>
                                <input
                                    type="email"
                                    name="Email"
                                    value={userData.Email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number*</label>
                                <input
                                    type="tel"
                                    name="Phone_Number"
                                    value={userData.Phone_Number}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Date of Birth</label>
                                <input
                                    type="date"
                                    name="DOB"
                                    value={userData.dob}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>House Number*</label>
                                <input
                                    type="text"
                                    name="House_num"
                                    value={userData.House_num}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Apartment Number</label>
                                <input
                                    type="text"
                                    name="Apt_number"
                                    value={userData.Apt_number}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Street*</label>
                                <input
                                    type="text"
                                    name="Street"
                                    value={userData.Street}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>City*</label>
                                <input
                                    type="text"
                                    name="City"
                                    value={userData.City}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>State*</label>
                                <input
                                    type="text"
                                    name="State"
                                    value={userData.State}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Zip Code*</label>
                                <input
                                    type="text"
                                    name="Zip_code"
                                    value={userData.Zip_code}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Country*</label>
                                <input
                                    type="text"
                                    name="Country"
                                    value={userData.Country}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="button" onClick={() => setEditMode(false)} className="cancel-button">
                                Cancel
                            </button>
                            <button type="button" onClick={handleSave} className="save-button">
                                Save Changes
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="profile-info">
                        <div className="info-section">
                            <h3>Company Information</h3>
                            <p><strong>Company Name:</strong> {userData.Company_Name}</p>
                            <p><strong>Contact Person:</strong> {userData.first_name} {userData.middle_Initial && `${userData.middle_Initial}. `}{userData.last_Name}</p>
                            <p><strong>Email:</strong> {userData.Email}</p>
                            <p><strong>Phone:</strong> {userData.Phone_Number}</p>
                            <p><strong>Date of Birth:</strong> {userData.dob?.split('T')[0] || 'Not specified'}</p>
                        </div>
                        <div className="info-section">
                            <h3>Address</h3>
                            <p>
                                {userData.House_num}
                                {userData.Apt_number && `, Apt ${userData.Apt_number}`}
                                {userData.Street && `, ${userData.Street}`}
                            </p>
                            <p>
                                {userData.City && `${userData.City}, `}
                                {userData.State} {userData.Zip_code}
                            </p>
                            <p>{userData.Country}</p>
                        </div>
                        <button 
                            onClick={() => setEditMode(true)} 
                            className="edit-profile-button"
                        >
                            Edit Profile
                        </button>
                    </div>
                )}
            </div>

            <div className="products-section">
                <h2>Your Products</h2>
                {productsLoading && <p>Loading products...</p>}
                {productsError && <p className="error">{productsError}</p>}
                {!productsLoading && !productsError && products.length > 0 ? (
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Modify</th>
                                <th>Add Discount</th>
                                <th>Delete </th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.item_id}>
                                <td>
                                    {editingItem === product.item_id ? (
                                    <input
                                        type="text"
                                        name="Name"
                                        value={tempItemData.Name || ''}
                                        onChange={handleTempChange}
                                        className="edit-input"
                                    />
                                    ) : (
                                    product.Name
                                    )}
                                </td>
                                <td>
                                    {editingItem === product.item_id ? (
                                    <input
                                        type="text"
                                        name="description"
                                        value={tempItemData.description || ''}
                                        onChange={handleTempChange}
                                        className="edit-input"
                                    />
                                    ) : (
                                    product.description
                                    )}
                                </td>
                                <td>
                                    {editingItem === product.item_id ? (
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="price"
                                        value={tempItemData.price || ''}
                                        onChange={handleTempChange}
                                        className="edit-input"
                                    />
                                    ) : (
                                    `$${Number(product.price).toFixed(2)}`
                                    )}
                                </td>
                                <td>
                                    {editingItem === product.item_id ? (
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={tempItemData.quantity || ''}
                                        onChange={handleTempChange}
                                        className="edit-input"
                                    />
                                    ) : (
                                    product.quantity
                                    )}
                                </td>
                                <td className='action-buttons'>
                                    {editingItem === product.item_id ? (
                                    <>
                                        <button 
                                        onClick={saveChanges} 
                                        className="save-button"
                                        >
                                        Save
                                        </button>
                                        <button 
                                        onClick={cancelEditing} 
                                        className="cancel-button"
                                        >
                                        Cancel
                                        </button>
                                    </>
                                    ) : (
                                    <button 
                                        onClick={() => startEditing(product)} 
                                        className="modify-button"
                                    >
                                        Modify
                                    </button>
                                    )}

                                </td>
                                <td className="action-buttons">
                                    <button
                                        onClick = {() => {setSelectedItemId(product.item_id);
                                            setIsModalOpen(true);
                                        }}
                                        className="discount-button"
                                    >
                                    Discount
                                    </button>

                                    <DiscountModal
                                        isOpen = {isModalOpen}
                                        onClose = {() => setIsModalOpen(false)}
                                        onSubmit={handleCreateDiscount}
                                        itemId={selectedItemId}
                                    />
                                </td>

                                

                                <td className='action-buttons'>
                                    <button 
                                    onClick={() => handleDelete(product.item_id)} 
                                    className="delete-button"
                                    disabled={editingItem === product.item_id} 
                                    >
                                    Delete
                                    </button>
                                </td>
                                </tr>
                            ))}
                            </tbody>
                    </table>
                ) : (
                    !productsLoading && <p>No products found.</p>
                )}
            </div>

            <button className="Add-item-button" onClick={handleItemAdd}>Add Item</button>


            <div className="period-selector">
                <label htmlFor="period">Select Period:</label>
                <select id="period" value={period} onChange={handlePeriodChange}>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>

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
            <button onClick={handleDeleteAccount} className="signout-button">
                Delete Acount
            </button>
        </div>
    );
};

export default SupplierPage;
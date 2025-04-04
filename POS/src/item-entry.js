import { useState } from "react";
import axios from 'axios';
import './item-entry.css';

const ItemEntryForm = () => {
    {/* Variables that the customer would contain */ }
    const [itemName, setItemName] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [quantity, setItemQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [reorderThreshold, setReorderThreshold] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    {/* Function to place all the values into item once submit  is hit */ }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/supplier-entry-form', {
                itemName, itemDescription, quantity, price, reorderThreshold
            });
            if (response.data?.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                window.location.href = '/';
            } else {
                throw new Error('No user data received');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Sign up failed';
            setError(errorMessage);
        }
    }

    return (
        <div className="first">
            <div className="customerEntryForm">
                <h1>Create Item</h1>
                <form onSubmit={handleSubmit}>

                    {/* Item Section */}
                    <div className="form-section">
                        <div className="form-group">
                            <label>Item Name</label>
                            <input
                                type="text"
                                required
                                maxLength={20}
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Item Description</label>
                            <input
                                type="text"
                                required
                                maxLength={50}
                                value={itemDescription}
                                onChange={(e) => setItemDescription(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Quantity</label>
                            <input
                                type="number"
                                required
                                value={quantity}
                                onChange={(e) => setItemQuantity(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Price</label>
                            <input
                                type="number"
                                required
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Reorder Threshold</label>
                            <input
                                type="number"
                                value={reorderThreshold}
                                onChange={(e) => setReorderThreshold(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    {/* Submit Button */}
                    <div className="form-group">
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ItemEntryForm;

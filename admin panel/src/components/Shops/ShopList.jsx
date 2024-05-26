import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ShopList.css'; // Import your CSS file for styling

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    const fetchShopsByAdmin = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const response = await axios.get(`http://localhost:8000/api/shops/admin/${userInfo._id}`, {
          headers: {
            'auth-token': `${userInfo.token}` // Send authorization token
          }
        });
        setShops(response.data);
        setAdminName(userInfo.username); // Set admin name
      } catch (error) {
        console.error('Error fetching shops:', error);
      }
    };
    fetchShopsByAdmin();
  }, []);

  const handleUpdateShop = (id) => {
    // Handle update shop logic
    console.log('Update shop with ID:', id);
  };

  const handleDeleteShop = async (id) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      await axios.delete(`http://localhost:8000/api/shops/${id}`, {
        headers: {
          'auth-token': `${userInfo.token}` // Send authorization token
        }
      });
      // Remove deleted shop from the state
      setShops(shops.filter(shop => shop._id !== id));
    } catch (error) {
      console.error('Error deleting shop:', error);
    }
  };

  return (
    <div className="shop-container mx-auto">
      <h2 className="text-3xl mb-4 text-center">Shops Added by Admin</h2>
      <div className="admin-name text-center">{adminName}</div> {/* Display admin name */}
      {shops.length === 0 && <p className="no-shops text-center">No shops added by you. Add some shops!</p>}
      <ul className="shop-list">
        {shops.map(shop => (
          <li key={shop._id} className="shop-item">
            <div className="shop-name">{shop.name}</div>
            <div className="shop-actions">
              <button className="update-btn" onClick={() => handleUpdateShop(shop._id)}>Update</button>
              <button className="delete-btn" onClick={() => handleDeleteShop(shop._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShopList;

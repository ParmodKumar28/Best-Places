import { useState, useEffect } from 'react';
import axios from 'axios';
import './ShopList.css'; // Import your CSS file for styling
import Base_Url from '../../services/api';
import { toast } from 'react-toastify';
import { Oval } from 'react-loader-spinner'; // Import the Oval loader

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [adminName, setAdminName] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchShopsByAdmin = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const response = await axios.get(`${Base_Url}/shops/admin/${userInfo._id}`, {
          headers: {
            'auth-token': `${userInfo.token}` // Send authorization token
          }
        });

        if (response.statusText === "OK") {
          setShops(response.data);
          setAdminName(userInfo.username); // Set admin name
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          toast.error(error.response.data.error); // Display the error message in a toast
        } else {
          toast.error("An error occurred. Please try again later.");
        }
      } finally {
        setLoading(false); // Set loading to false after data fetching is done
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
      const response = await axios.delete(`${Base_Url}/shops/${id}`, {
        headers: {
          'auth-token': `${userInfo.token}` // Send authorization token
        }
      });

      if (response.statusText === "OK") {
        // Remove deleted shop from the state
        setShops(shops.filter(shop => shop._id !== id));
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error); // Display the error message in a toast
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="shop-container mx-auto">
      <h2 className="text-3xl mb-4 text-center">Shops Added by Admin</h2>
      <div className="admin-name text-center">{adminName}</div> {/* Display admin name */}
      {loading ? ( // Render loader if loading is true
        <div className="loader-container flex justify-center items-center">
          <Oval color="#4F46E5" height={40} width={40} />
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default ShopList;

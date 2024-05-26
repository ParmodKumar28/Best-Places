import { useState, useEffect } from 'react';
import axios from 'axios';
import './ShopList.css'; // Import your CSS file for styling
import Base_Url from '../../services/api';
import { toast } from 'react-toastify';
import { Oval } from 'react-loader-spinner'; // Import the Oval loader
import { format } from 'date-fns'; // Import date-fns for date formatting

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [admin, setAdmin] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchAdmin = async () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      setAdmin(userInfo);
    };

    fetchAdmin();
  }, []);

  useEffect(() => {
    const fetchShopsByAdmin = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const response = await axios.get(`${Base_Url}/shops/admin/${userInfo._id}`, {
          headers: {
            'auth-token': `${userInfo.token}` // Send authorization token
          }
        });

        if (response.status === 201) {
          // console.log("Shops Data:", response.data); // Log the shops data
          setShops(response.data.shops);
          // toast.success(response.data.msg);
        }
      } catch (error) {
        // console.error("API Error:", error); // Log any API errors
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
      const response = await axios.delete(`${Base_Url}/shops/${id}`, {
        headers: {
          'auth-token': `${admin.token}` // Send authorization token
        }
      });

      if (response.status === 200) {
        toast.success(response.data.msg);
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

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<span key={i} className={i <= rating ? "star-filled" : "star-empty"}>{i <= rating ? '★' : '☆'}</span>);
    }
    return stars;
  };

  return (
    <div className="shop-container mx-auto">
      <h2 className="text-3xl mb-4 text-center">Shops Added by Admin</h2>
      <div className="admin-name text-center">{admin.username}</div> {/* Display admin name */}
      {loading ? ( // Render loader if loading is true
        <div className="loader-container flex justify-center items-center">
          <Oval color="#4F46E5" height={40} width={40} />
        </div>
      ) : (
        <>
          {shops.length === 0 && <p className="no-shops text-center">No shops added by you. Add some shops!</p>}
          <div className="shop-list">
            {shops.map(shop => (
              <div key={shop._id} className="shop-item">
                <div className="shop-image">
                  <img src={shop.images[0]} alt={shop.name} />
                </div>
                <div className="shop-details">
                  <h3 className='text-xl my-1 md:text-6xl md:mb-6 text-green-600'>{shop.name}</h3>
                  <p><strong>Address:</strong> {shop.address}</p>
                  <p><strong>Description:</strong> {shop.description}</p>
                  <p><strong>Rating:</strong> {renderStars(shop.rating)}</p> {/* Render stars for rating */}
                  <p><strong>Shop added on:</strong> {format(new Date(shop.createdAt), 'MMM dd, yyyy')}</p> {/* Display shop added date */}
                </div>
                <div className="shop-actions">
                  <button className="update-btn" onClick={() => handleUpdateShop(shop._id)}>Update</button>
                  <button className="delete-btn" onClick={() => handleDeleteShop(shop._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ShopList;

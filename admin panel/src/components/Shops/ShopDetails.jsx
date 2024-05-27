import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Base_Url from '../../services/api';
import { Oval } from 'react-loader-spinner';

const ShopDetails = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const response = await axios.get(`${Base_Url}/shops/${id}`, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'auth-token': `${userInfo.token}`, // Include token in the request headers
          }
        });
        setShop(response.data);
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          toast.error(error.response.data.error); // Display the error message in a toast
        } else {
          toast.error("An error occurred. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [id]);

  if (loading) {
    return <div className="loader-container flex justify-center items-center my-5">
      <Oval color="#4F46E5" height={40} width={40} />
    </div>
  }

  const formattedDate = new Date(shop.createdAt).toLocaleDateString();

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-cover bg-center relative h-56" style={{ backgroundImage: `url(${shop.images[0]})` }}>
          <div className="bg-black bg-opacity-50 absolute inset-0 flex items-center justify-center">
            <h2 className="text-4xl text-white font-bold">{shop.name}</h2>
          </div>
        </div>
        <div className="p-6">
          <p className="text-2xl text-green-800 mb-6">{shop.description}</p>
          <div className="flex flex-wrap gap-4 mb-4">
            {shop.images.map((image, index) => (
              <img key={index} src={image} alt={`Image ${index}`} className="w-32 h-32 object-cover rounded-lg shadow-md transition-transform transform hover:scale-105" />
            ))}
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Category</h3>
            <p className="text-gray-600">{shop.category}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-700">City</h3>
            <p className="text-gray-600">{shop.city}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Address</h3>
            <p className="text-gray-600">{shop.address}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Rating</h3>
            <div className="flex items-center">
              {[...Array(5)].map((star, index) => (
                <svg
                  key={index}
                  className={`w-6 h-6 ${index < shop.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.905c.969 0 1.371 1.24.588 1.81l-3.98 2.89a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.98-2.89a1 1 0 00-1.175 0l-3.98 2.89c-.784.57-1.838-.197-1.54-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.097 9.1c-.784-.57-.38-1.81.588-1.81h4.905a1 1 0 00.95-.69l1.518-4.674z" />
                </svg>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Date Created</h3>
            <p className="text-gray-600">{formattedDate}</p>
          </div>
          <div className="flex justify-end mt-6">
            <a
              href={`https://maps.google.com/?q=${shop.location.lat},${shop.location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-all transform hover:-translate-y-1"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;

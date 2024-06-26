import { useState } from 'react';
import axios from 'axios';
import { toast} from 'react-toastify';
import Base_Url from '../../services/api';
import { Oval } from 'react-loader-spinner'; // Import the Oval loader

const AddShopForm = () => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState({ lat: "", lng: "" })
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const categories = [
    'Electronics',
    'Clothing',
    'Food',
    'Furniture',
    'Books',
    'Health',
    'Beauty',
    'Sports',
    'Toys',
    'Jewelry',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Validate required fields
      if (!name || !city || !address || !category || !description || !location.lat || !location.lng) {
        toast.error("All fields are required")
        throw new Error('All fields are required');
      }

      const formData = new FormData();
      formData.append('name', name);
      formData.append('city', city);
      formData.append('address', address);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('rating', rating);
      formData.append('location', JSON.stringify(location)); // Stringify location object
      images.forEach((image) => {
        formData.append('images', image);
      });

      const userInfo = JSON.parse(localStorage.getItem('userInfo')); // Get token from localStorage
      const response = await axios.post(`${Base_Url}/shops`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'auth-token': `${userInfo.token}`, // Include token in the request headers
        },
      });

      if (response.status === 201) {
        toast.success(response.data.msg);
        // Reset form fields
        setName('');
        setCity('');
        setAddress('');
        setCategory('');
        setDescription('');
        setImages([]);
        setLocation({ lat: "", lng: "" }); // Reset location state
      }

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


  const handleImageChange = (e) => {
    if (images.length < 5) {
      setImages([...images, ...Array.from(e.target.files)]);
    } else {
      toast.warn('You can only upload up to 5 images');
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Update location state when latitude or longitude changes
  const handleLatChange = (e) => {
    setLocation({ ...location, lat: e.target.value });
  };

  const handleLngChange = (e) => {
    setLocation({ ...location, lng: e.target.value });
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  return (
    <div className="max-w-md mx-auto my-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Add Shop</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Shop Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter shop name"
            required
            className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm focus:outline-indigo-400 text-indigo-600 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
            Rating
          </label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`text-3xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                onClick={() => handleRatingChange(star)}
              >
                &#9733;
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
            required
            className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm focus:outline-indigo-400 text-indigo-600 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
            required
            className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm focus:outline-indigo-400 text-indigo-600 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm focus:outline-indigo-400 text-indigo-600 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="" disabled>Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            required
            className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm focus:outline-indigo-400 text-indigo-600 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700">
            Images
          </label>
          <input
            type="file"
            id="images"
            multiple
            onChange={handleImageChange}
            required
            className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm focus:outline-indigo-400 text-indigo-600 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(image)}
                alt={`Preview ${index}`}
                className="w-20 h-20 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        <div>
          <label htmlFor="lat" className="block text-sm font-medium text-gray-700">
            Latitude
          </label>
          <input
            type="number"
            id="lat"
            value={location.lat}
            onChange={handleLatChange}
            placeholder="Enter latitude"
            className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm focus:outline-indigo-400 text-indigo-600 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="lng" className="block text-sm font-medium text-gray-700">
            Longitude
          </label>
          <input
            type="number"
            id="lng"
            value={location.lng}
            onChange={handleLngChange}
            placeholder="Enter longitude"
            className="mt-1 p-2 w-full border-gray-300 rounded-md shadow-sm focus:outline-indigo-400 text-indigo-600 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 w-full"
          disabled={loading}
        >
          {loading ? <Oval color="#FFF" height={20} width={20} className="absolute inset-0 m-auto" /> : 'Add Shop'}
        </button>
      </form>
    </div>
  );
};

export default AddShopForm;

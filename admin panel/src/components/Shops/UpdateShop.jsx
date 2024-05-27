import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Base_Url from '../../services/api';
import { Oval } from 'react-loader-spinner';

const UpdateShop = () => {
    const { shopId } = useParams();
    const [shop, setShop] = useState({
        name: '',
        city: '',
        address: '',
        category: '',
        description: '',
        images: [],
        location: { lat: '', lng: '' },
        rating: 0
    });
    const [newImages, setNewImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const navigate = useNavigate();

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

    useEffect(() => {
        if (!shopId) {
            toast.error("Invalid Shop ID");
            setLoading(false);
            return;
        }
        const fetchShopDetails = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const response = await axios.get(`${Base_Url}/shops/${shopId}`, {
                    headers: {
                        'auth-token': `${userInfo.token}`
                    }
                });
                if (response.status === 200) {
                    setShop(response.data);
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.error) {
                    toast.error(error.response.data.error);
                } else {
                    toast.error("An error occurred. Please try again later.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchShopDetails();
    }, [shopId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);

        try {
            if (!shop.name || !shop.city || !shop.address || !shop.category || !shop.description || !shop.location.lat || !shop.location.lng) {
                toast.error("All fields are required");
                throw new Error('All fields are required');
            }

            const formData = new FormData();
            formData.append('name', shop.name);
            formData.append('city', shop.city);
            formData.append('address', shop.address);
            formData.append('category', shop.category);
            formData.append('description', shop.description);
            formData.append('rating', shop.rating);
            formData.append('location', JSON.stringify(shop.location)); // Stringify location object
            newImages.forEach((image) => {
                formData.append('images', image);
            });

            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const response = await axios.put(`${Base_Url}/shops/${shopId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'auth-token': `${userInfo.token}`
                }
            });
            if (response.status === 201) {
                toast.success('Shop updated successfully!');
                navigate('/shops');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("An error occurred. Please try again later.");
            }
        } finally {
            setUpdating(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShop({ ...shop, [name]: value });
    };

    const handleImageChange = (e) => {
        if (newImages.length < 5) {
            setNewImages([...newImages, ...Array.from(e.target.files)]);
        } else {
            toast.warn('You can only upload up to 5 images');
        }
    };

    const removeImage = (index) => {
        if (index < shop.images.length) {
            // Remove previously fetched image
            const updatedImages = [...shop.images];
            updatedImages.splice(index, 1);
            setShop({ ...shop, images: updatedImages });
        } else {
            // Remove newly added image
            setNewImages(newImages.filter((_, i) => i !== index - shop.images.length));
        }
    };

    const handleLatChange = (e) => {
        setShop({ ...shop, location: { ...shop.location, lat: e.target.value } });
    };

    const handleLngChange = (e) => {
        setShop({ ...shop, location: { ...shop.location, lng: e.target.value } });
    };

    const handleRatingChange = (value) => {
        setShop({ ...shop, rating: value });
    };

    return (
        <div className="flex flex-col items-center justify-center my-6">
            {loading ? (
                <div className="flex justify-center items-center">
                    <Oval color="#4F46E5" height={40} width={40} />
                </div>
            ) : (
                <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                    {updating && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                            <Oval
                                height={40}
                                width={40}
                                color="#4F46E5"
                                visible={true}
                                ariaLabel="oval-loading"
                                secondaryColor="#a0a0a0"
                                strokeWidth={2}
                                strokeWidthSecondary={2}
                            />
                        </div>
                    )}
                    <h2 className="text-3xl font-semibold mb-4 text-center">Update Shop</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={shop.name}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md shadow-sm focus:outline-indigo-400 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                                Rating
                            </label>
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`text-3xl ${star <= shop.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                        onClick={() => handleRatingChange(star)}
                                    >
                                        &#9733;
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                City
                            </label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                value={shop.city}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md shadow-sm focus:outline-indigo-400 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Address
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={shop.address}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md shadow-sm focus:outline-indigo-400 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <select
                                id="category"
                                name="category"
                                value={shop.category}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md shadow-sm focus:outline-indigo-400 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            >
                                <option value="" disabled>Select category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={shop.description}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border rounded-md shadow-sm focus:outline-indigo-400 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            ></textarea>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                                Images
                            </label>
                            <input
                                type="file"
                                id="images"
                                multiple
                                onChange={handleImageChange}
                                className="mt-1 p-2 w-full border rounded-md shadow-sm focus:outline-indigo-400 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {/* Display previous images */}
                            {shop.images.map((image, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={`${image}`} // Assuming Base_Url is the base URL for image retrieval
                                        alt={`Previous ${index}`}
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                    {/* Button to remove previous images */}
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                            {/* Display newly selected images */}
                            {newImages.map((image, index) => (
                                <div key={index + shop.images.length} className="relative">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Preview ${index}`}
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                    {/* Button to remove newly selected images */}
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

                        <div className="mb-4">
                            <label htmlFor="lat" className="block text-sm font-medium text-gray-700">
                                Latitude
                            </label>
                            <input
                                type="number"
                                id="lat"
                                name="lat"
                                value={shop.location.lat}
                                onChange={handleLatChange}
                                className="mt-1 p-2 w-full border rounded-md shadow-sm focus:outline-indigo-400 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="lng" className="block text-sm font-medium text-gray-700">
                                Longitude
                            </label>
                            <input
                                type="number"
                                id="lng"
                                name="lng"
                                value={shop.location.lng}
                                onChange={handleLngChange}
                                className="mt-1 p-2 w-full border rounded-md shadow-sm focus:outline-ind
                                indigo-400 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 w-full"
                            disabled={updating}
                        >
                            {updating ? 'Updating...' : 'Update Shop'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UpdateShop;

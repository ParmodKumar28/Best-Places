import { useState, useEffect } from 'react';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import { FiUser, FiCamera } from 'react-icons/fi';
import { format } from 'date-fns';
import Base_Url from '../services/api';
import { toast } from 'react-toastify';

const AdminProfilePage = () => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newProfileImage, setNewProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const fetchAdminProfile = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const response = await axios.get(`${Base_Url}/users/profile`, {
                headers: {
                    'auth-token': userInfo.token,
                },
            });
            if (response.status === 200) {
                setAdmin(response.data.user);
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

    useEffect(() => {
        fetchAdminProfile();
    }, []);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setNewProfileImage(file);

        const reader = new FileReader();
        reader.onload = () => {
            setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const updateProfilePicture = async () => {
        try {
            if (!newProfileImage) {
                toast.error('No profile image selected');
                return;
            }

            const formData = new FormData();
            formData.append('profilePicture', newProfileImage);

            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const response = await axios.put(`${Base_Url}/users/profile/picture`, formData, {
                headers: {
                    'auth-token': userInfo.token,
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200 || response.status === 201) {
                const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                // Update profile picture URL in userInfo object
                userInfo.profile = response.data.user.profile;
                // Update userInfo object in localStorage
                localStorage.setItem('userInfo', JSON.stringify(userInfo));

                setAdmin(response.data.user);
                setPreviewImage(null);
                setNewProfileImage(null);
                toast.success(response.data.msg);
                fetchAdminProfile();
            } else {
                toast.error('Failed to update profile picture');
            }

        } catch (error) {
            console.error("Update Error:", error); // More detailed logging
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("An error occurred. Please try again later.");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Oval color="#4F46E5" height={40} width={40} />
            </div>
        );
    }

    if (!admin) {
        return <div>Error fetching admin profile</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <div className="flex flex-col items-center space-y-4 mb-8">
                <div className="relative">
                    <img
                        src={previewImage || admin.profile || <FiUser size={64} />}
                        alt="Profile"
                        className="w-40 h-40 rounded-full border-4 border-indigo-500 shadow-lg"
                    />
                    <label
                        htmlFor="profileImageInput"
                        className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow cursor-pointer transform transition hover:scale-110"
                    >
                        <FiCamera size={24} className="text-indigo-500" />
                    </label>
                    <input
                        type="file"
                        id="profileImageInput"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                    />
                </div>
                <button
                    className="bg-indigo-500 text-white px-6 py-2 rounded-md mt-8 hover:bg-indigo-600 transition duration-300"
                    onClick={updateProfilePicture}
                >
                    Update Profile Picture
                </button>
                <div className="text-center">
                    <p className="text-4xl text-gray-600 font-bold my-2">{admin.username}</p>
                    <p className="text-gray-500">{admin.email}</p>
                    <p className="text-gray-500">Joined: {format(new Date(admin.createdAt), 'MMM dd, yyyy')}</p>
                    <p className="text-gray-500">Total Shops Added: {admin.shops.length}</p>
                </div>
            </div>
            <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-6">Shops Added By You</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {admin.shops.length > 0 ? admin.shops.map((shop) => (
                        <li key={shop._id} className="p-6 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition duration-300">
                            <p className="text-lg font-semibold">{shop.name}</p>
                            <p className="text-gray-500">{shop.address}</p>
                            <p className="text-gray-500">Category: {shop.category}</p>
                        </li>
                    )) : <p>No shops added by you!</p>}
                </ul>
            </div>
        </div>
    );
};

export default AdminProfilePage;

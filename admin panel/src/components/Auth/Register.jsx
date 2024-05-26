import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Oval } from 'react-loader-spinner';
import Base_Url from '../../services/api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${Base_Url}/users/register`, {
        username,
        email,
        password,
        isAdmin: true
      });

      if (response.status === 201) {
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        toast.success('Registration successful!');
        navigate('/');

        // Clear fields
        setUsername("");
        setEmail("");
        setPassword("");
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

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 w-80 relative">
        {loading && (
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
        <h2 className="text-3xl font-semibold mb-4 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md shadow-sm focus:outline-indigo-400 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md shadow-sm focus:outline-indigo-400 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md shadow-sm focus:outline-indigo-400 focus:ring-indigo-500 focus:border-indigo-500"
              required
              minLength={8} // Minimum password length
            />
            {/* Password strength meter (you can use a library for this) */}
            {/* Display strength feedback based on password complexity */}
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 w-full"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

import { Link } from 'react-router-dom';
import "./HomePage.css"

const HomePage = () => {
  // Retrieve admin information from localStorage
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const isAdmin = userInfo && userInfo.isAdmin;
  const adminName = userInfo && userInfo.username;
  const adminProfileImage = userInfo && userInfo.profile;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <h1 className="text-5xl text-center font-extrabold mb-8 animate__animated animate__fadeInDown">
        Welcome to Best Places!
      </h1>
      {isAdmin && (
        <div className="flex flex-col items-center mb-6 animate__animated animate__fadeInUp">
          {adminProfileImage && (
            <img
              src={adminProfileImage}
              alt="Admin Profile"
              className="w-52 h-52 rounded-full border-4 border-white mb-4 shadow-lg transform transition-transform hover:scale-105"
            />
          )}
          <p className="text-xl">
            Hello, <span className="text-green-500">{adminName}</span>! You're logged in as an admin.
          </p>
        </div>
      )}
      <p className="text-lg mb-8 text-center animate__animated animate__fadeInUp">
        Explore the best shops, outlets, and food counters in your city.
      </p>
      {isAdmin && (
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 animate__animated animate__fadeInUp">
          <Link
            to="/add-shop"
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-full transition duration-300 ease-in-out flex-1 md:flex-none text-center transform transition-transform hover:scale-105 shadow-lg"
          >
            Add New Shop
          </Link>
          <Link
            to="/shops"
            className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-full transition duration-300 ease-in-out flex-1 md:flex-none text-center transform transition-transform hover:scale-105 shadow-lg"
          >
            View Shops
          </Link>
          <Link
            to="/profile"
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-full transition duration-300 ease-in-out flex-1 md:flex-none text-center transform transition-transform hover:scale-105 shadow-lg"
          >
            Profile
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;

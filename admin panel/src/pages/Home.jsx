import { Link } from 'react-router-dom';

const HomePage = () => {
  // Retrieve admin information from localStorage
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const isAdmin = userInfo && userInfo.isAdmin;
  const adminName = userInfo && userInfo.username;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <h1 className="text-5xl text-center font-extrabold mb-8 animate__animated animate__fadeInDown">Welcome to Best Places!</h1>
      {isAdmin && (
        <p className="text-xl mb-6 animate__animated animate__fadeInUp">
          Hello, <span className="text-green-500">{adminName}</span>! You're logged in as an admin.
        </p>
      )}
      <p className="text-lg mb-8 text-center animate__animated animate__fadeInUp">
        Explore the best shops, outlets, and food counters in your city.
      </p>
      {isAdmin && (
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 animate__animated animate__fadeInUp">
          <Link
            to="/add-shop"
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-full transition duration-300 ease-in-out flex-1 md:flex-none"
          >
            Add New Shop
          </Link>
          <Link
            to="/shops"
            className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-full transition duration-300 ease-in-out flex-1 md:flex-none"
          >
            View Shops
          </Link>
          <Link
            to="/profile"
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded-full transition duration-300 ease-in-out flex-1 md:flex-none"
          >
            Profile
          </Link> {/* Add link to profile page */}
        </div>
      )}
    </div>
  );
};

export default HomePage;

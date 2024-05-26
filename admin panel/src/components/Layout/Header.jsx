import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'react-feather'; // Import Menu and X icons from Feather Icons
import { toast } from 'react-toastify';

const Header = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const [showMenu, setShowMenu] = useState(false); // State to toggle menu visibility

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    toast.success("Logout Successful!")
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 text-white py-5 px-4 md:px-10">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-semibold md:mr-10">Best Places</Link>
          <Menu className="block md:hidden cursor-pointer" onClick={() => setShowMenu(!showMenu)} />
        </div>
        <nav className={`mt-4 md:mt-0 ${showMenu ? 'block' : 'hidden'} md:block`}>
          <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
            {userInfo ? (
              <>
                <li><Link to="/shops" className="hover:text-gray-300">Shops</Link></li>
                <li><Link to="/add-shop" className="hover:text-gray-300">Add Shop</Link></li>
                <li><Link to="/profile" className="hover:text-gray-300">Profile</Link></li> {/* Add link to profile page */}
                <li>
                  <button onClick={handleLogout} className="hover:text-gray-300">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="hover:text-gray-300">Login</Link></li>
                <li><Link to="/register" className="hover:text-gray-300">Register</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );

};

export default Header;

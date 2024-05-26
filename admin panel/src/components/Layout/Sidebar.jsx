import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="bg-gray-800 text-white h-full w-48 flex-shrink-0">
      <nav className="flex flex-col h-full">
        <Link to="/dashboard" className="py-4 px-6 hover:bg-gray-700">Dashboard</Link>
        <Link to="/shops" className="py-4 px-6 hover:bg-gray-700">Shops</Link>
        <Link to="/users" className="py-4 px-6 hover:bg-gray-700">Users</Link>
        <Link to="/settings" className="py-4 px-6 hover:bg-gray-700">Settings</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;

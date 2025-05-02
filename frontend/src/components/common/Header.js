import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock notifications - in a real app, these would come from your backend
  const notifications = [
    { id: 1, message: "New appointment scheduled", time: "5 min ago" },
    { id: 2, message: "Transaction completed", time: "1 hour ago" },
    { id: 3, message: "New patient registered", time: "2 hours ago" }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchTerm);
  };

  const renderUserMenu = () => {
    if (!isAuthenticated) return null;

    return (
      <div className="relative">
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex items-center space-x-2 focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <span className="hidden md:block">{user?.name || 'User'}</span>
        </button>

        {showProfileMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Your Profile
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Settings
            </Link>
            <button
              onClick={logout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderNotifications = () => {
    if (!isAuthenticated) return null;

    return (
      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="p-2 hover:bg-gray-100 rounded-full relative"
        >
          <i className="fas fa-bell"></i>
          <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs">
            {notifications.length}
          </span>
        </button>

        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50">
            <div className="px-4 py-2 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
            </div>
            {notifications.map(notification => (
              <div
                key={notification.id}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
              >
                <p className="text-sm text-gray-700">{notification.message}</p>
                <p className="text-xs text-gray-500">{notification.time}</p>
              </div>
            ))}
            <div className="px-4 py-2 border-t border-gray-200">
              <Link
                to="/notifications"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View all notifications
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Klinik UNKLAB
            </Link>
          </div>

          {/* Search Bar */}
          {isAuthenticated && (
            <div className="hidden md:block flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <i className="fas fa-search text-gray-400"></i>
                </button>
              </form>
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {renderNotifications()}
            {renderUserMenu()}
            
            {!isAuthenticated && (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ title, navLinks, user, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 h-full bg-white shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {user && (
          <div className="mt-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                {user.profile?.fullName?.charAt(0) || user.email?.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-800">
                  {user.profile?.fullName || user.email}
                </p>
                <p className="text-sm text-gray-500 capitalize">
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `
                flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-500'
                }
              `}
              onClick={() => onClose?.()}
            >
              <div className="flex items-center flex-1">
                <i className={`${link.icon} w-6`}></i>
                <span className="ml-3">{link.label}</span>
              </div>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors duration-200"
        >
          <i className="fas fa-sign-out-alt w-6"></i>
          <span className="ml-3">Logout</span>
        </button>
      </div>

      {/* Mobile close button */}
      <button
        onClick={() => onClose?.()}
        className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
      >
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default Sidebar;

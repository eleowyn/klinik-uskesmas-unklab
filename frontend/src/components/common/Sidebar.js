import React from 'react';
import { Link, useLocation } from 'react-router-dom';


const Sidebar = ({ title, navLinks, user, onLogout }) => {
  const location = useLocation();

  // Add transactions and appointments links if user is staff
  if (user && user.role === 'staff') {
    const extraLinks = [
      { path: '/staff/transactions', label: 'Transactions', icon: 'fas fa-receipt' },
      { path: '/staff/appointments', label: 'Appointments', icon: 'fas fa-calendar-alt' },
    ];
    // Prevent duplicates
    const existingPaths = navLinks.map(link => link.path);
    const filteredExtraLinks = extraLinks.filter(link => !existingPaths.includes(link.path));
    navLinks = [...navLinks, ...filteredExtraLinks];
  }

  return (
    <div className="w-64 min-h-screen bg-blue-900 text-white">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        
        {user && (
          <div className="mb-6 pb-6 border-b border-blue-800">
            <p className="text-sm text-blue-300">Welcome,</p>
            <p className="font-semibold">{user.name}</p>
          </div>
        )}

        <nav>
          <ul className="space-y-2">
            {navLinks.map((link) => {
              const isActive = location.pathname.includes(link.path);
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-800 text-white'
                        : 'text-blue-300 hover:bg-blue-800 hover:text-white'
                    }`}
                  >
                    <i className={`${link.icon} w-6`}></i>
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="absolute bottom-0 w-64 p-6">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center p-3 text-blue-300 hover:text-white hover:bg-blue-800 rounded-lg transition-colors"
        >
          <i className="fas fa-sign-out-alt w-6"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

import { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/patients', label: 'Patients' },
    { path: '/medical-records', label: 'Medical Records' },
    { path: '/prescriptions', label: 'Prescriptions' },
    { path: '/transactions', label: 'Transactions' },
  ];

  if (!user) return null;

  return (
    <div>
      {/* Hamburger Menu for Mobile */}
      <button
        className="md:hidden fixed top-16 left-4 z-20 bg-light-green-500 hover:bg-light-green-600 text-white p-2 rounded transition-colors duration-200"
        onClick={toggleSidebar}
      >
        {isOpen ? 'Close' : 'Menu'}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 h-full bg-light-blue-500 text-white w-64 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-10`}
      >
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4 text-white">Navigation</h2>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `block p-2 rounded transition-colors duration-200 ${
                      isActive ? 'bg-light-green-500 hover:bg-light-green-600' : 'hover:bg-light-blue-400'
                    }`
                  }
                  onClick={() => setIsOpen(false)} // Close sidebar on mobile click
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
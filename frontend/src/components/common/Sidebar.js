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
    <div className="relative">
      {/* Sidebar */}
      <div
        className={`fixed top-12 left-0 h-[calc(100vh-48px)] bg-light-blue-500 text-white w-64 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-10 shadow-lg`}
      >
        <div className="p-6">
          <div className="md:hidden mb-4">
            <button
              className="w-full bg-light-green-500 hover:bg-light-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              onClick={toggleSidebar}
            >
              ☰ Menu
            </button>
          </div>
          <h2 className="text-lg font-semibold mb-6 text-white tracking-wide">Navigation</h2>
          <ul className="space-y-3">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                      isActive 
                        ? 'bg-light-green-500 hover:bg-light-green-600 font-medium' 
                        : 'hover:bg-light-blue-400'
                    }`
                  }
                  onClick={() => setIsOpen(false)}
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

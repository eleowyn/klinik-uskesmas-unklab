import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-light-blue-500 text-white fixed w-full top-0 z-10">
      <div className="container mx-auto flex justify-between items-center px-6 py-3">
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-bold tracking-wide">Clinic App</span>
        </div>
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-sm">Welcome, {user.username}</span>
            <button
              onClick={handleLogout}
            className="bg-light-green-500 hover:bg-light-green-600 px-4 py-2 rounded text-sm font-medium transition-colors duration-200 focus:ring-2 focus:ring-light-green-400 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
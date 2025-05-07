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
    <nav className="bg-blue-600 text-white p-4 shadow-md fixed w-full top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img
            src="/logo.png"
            alt="Clinic Logo"
            className="h-8 w-8 mr-2"
            onError={(e) => (e.target.src = 'https://via.placeholder.com/32')}
          />
          <span className="text-xl font-bold">Clinic App</span>
        </div>
        {user && (
          <div className="flex items-center space-x-4">
            <span className="text-sm">Welcome, {user.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
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
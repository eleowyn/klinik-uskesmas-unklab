import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-lg border border-light-blue-100">
      <h2 className="text-2xl font-bold mb-6 text-light-blue-700 text-center tracking-wide">Staff Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-light-blue-600 font-medium mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-light-blue-200 rounded-md focus:ring-2 focus:ring-light-blue-400 focus:border-light-blue-400 transition-colors duration-200"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-light-blue-600 font-medium mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-light-blue-200 rounded-md focus:ring-2 focus:ring-light-blue-400 focus:border-light-blue-400 transition-colors duration-200"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-light-green-500 text-white py-3 rounded-md hover:bg-light-green-600 focus:ring-2 focus:ring-light-green-400 focus:ring-offset-2 transition-colors duration-200 font-medium mt-6"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
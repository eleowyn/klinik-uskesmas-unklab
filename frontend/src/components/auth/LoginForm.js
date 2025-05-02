import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const { showAlert } = useContext(AlertContext);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const result = await login(formData);

      if (result.success) {
        const { user } = result.data;
        
        // Add debug logging
        console.log('Login successful:', {
          user,
          role: user.role,
          profile: user.staffProfile || user.doctorProfile || user.patientProfile
        });

        // Show welcome message with proper name
        const profileName = 
          user.staffProfile?.fullName || 
          user.doctorProfile?.name || 
          user.patientProfile?.fullName || 
          user.username;

        showAlert(`Welcome back, ${profileName}!`, 'success');
        
        // Small delay to ensure auth state is set
        setTimeout(() => {
          // Redirect based on role
          switch (user.role) {
            case 'doctor':
              console.log('Navigating to doctor portal');
              navigate('/doctor');
              break;
            case 'staff':
              console.log('Navigating to staff portal');
              navigate('/staff');
              break;
            case 'patient':
              console.log('Navigating to patient portal');
              navigate('/patient');
              break;
            default:
              console.log('Navigating to home');
              navigate('/');
          }
        }, 100);
      } else {
        showAlert(result.error || 'Login failed', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      showAlert(error.message || 'Login failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Login to Your Account</h2>
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            placeholder="Enter your email"
            autoComplete="email"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </div>
        <div>
          <button
            className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </button>
        </div>
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:text-blue-700 font-medium">
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;

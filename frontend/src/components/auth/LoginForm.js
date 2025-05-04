import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const { showAlert } = useAlert();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login({ email: formData.email, password: formData.password });
    } catch (error) {
      showAlert(error.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background with multiple gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,150,255,0.3),rgba(255,255,255,0))]"></div>
      </div>

      <div className="w-full max-w-md mx-4 relative z-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/20">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-white/90 to-white/70 w-20 h-20 rounded-2xl mx-auto mb-6 
                          flex items-center justify-center shadow-lg transform hover:scale-105 
                          transition-all duration-300 hover:shadow-xl">
              <img src="/logo192.png" alt="Logo" className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-blue-100/80 text-sm">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-2 ml-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white 
                           placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-1 
                           focus:ring-white/40 transition-all duration-200 hover:bg-white/20"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-blue-100 mb-2 ml-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white 
                           placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-1 
                           focus:ring-white/40 transition-all duration-200 hover:bg-white/20"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="pt-2 space-y-4">
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full h-12 rounded-xl text-sm font-semibold transition-all duration-300 
                          overflow-hidden ${loading 
                            ? 'bg-white/50 text-white/70 cursor-not-allowed'
                            : 'bg-gradient-to-r from-white to-blue-50 text-blue-600 hover:shadow-lg hover:scale-[1.02] transform'}`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 
                               group-hover:opacity-20 transition-opacity duration-300"></span>
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>

              <button
                type="button"
                onClick={() => window.location.href = '/register'}
                className="group relative w-full h-12 rounded-xl text-sm font-semibold text-white 
                         border border-white/30 overflow-hidden transition-all duration-300 
                         hover:scale-[1.02] transform"
              >
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                Create new account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

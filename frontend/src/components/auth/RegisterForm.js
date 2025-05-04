import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'doctor',
    username: '',
    fullName: '',
    gender: 'male',
    no_sip: '',
    specialization: '',
    address: '',
    // Staff specific fields
    position: '',
    phone: ''
  });

  const validateEmail = (email, role) => {
    if (role === 'staff' && !email.includes('@staff')) {
      throw new Error('Staff email must contain "@staff"');
    }
    return true;
  };

  const validateForm = (formData) => {
    if (formData.password !== formData.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    if (formData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    if (!formData.gender) {
      throw new Error('Gender is required');
    }
    if (formData.role === 'doctor') {
      if (!formData.no_sip) {
        throw new Error('NO_SIP is required for doctor registration');
      }
      if (!formData.specialization) {
        throw new Error('Specialization is required for doctor registration');
      }
      if (!formData.address) {
        throw new Error('Address is required for doctor registration');
      }
    }
    if (formData.role === 'staff') {
      if (!formData.position) {
        throw new Error('Position is required for staff registration');
      }
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      validateEmail(formData.email, formData.role);
      validateForm(formData);

      const { confirmPassword, ...data } = formData;

      await register(data);
    } catch (error) {
      showAlert(error.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-800 via-blue-700 to-teal-600">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,150,255,0.2),rgba(255,255,255,0))]"></div>
      </div>

      <div className="w-full max-w-md mx-4 relative z-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/20">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-br from-white/90 to-white/70 w-20 h-20 rounded-2xl mx-auto mb-6 
                          flex items-center justify-center shadow-lg transform hover:scale-105 
                          transition-all duration-300 hover:shadow-xl">
              <img src="/logo192.png" alt="Logo" className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-blue-100/80 text-sm">Register as Doctor or Staff</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-blue-100 mb-2 ml-1">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white 
                           placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-1 
                           focus:ring-white/40 transition-all duration-200 hover:bg-white/20"
                  style={{ color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                >
                  <option value="doctor" style={{ backgroundColor: '#1e40af', color: 'white' }}>Doctor</option>
                  <option value="staff" style={{ backgroundColor: '#1e40af', color: 'white' }}>Staff</option>
                </select>
              </div>

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
                  placeholder={formData.role === 'staff' ? "Email (must contain @staff)" : "Email address"}
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-blue-100 mb-2 ml-1">
                  Username (optional)
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white 
                           placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-1 
                           focus:ring-white/40 transition-all duration-200 hover:bg-white/20"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-blue-100 mb-2 ml-1">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white 
                           placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-1 
                           focus:ring-white/40 transition-all duration-200 hover:bg-white/20"
                  placeholder="Enter your full name"
                  value={formData.fullName}
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
                  minLength={6}
                  className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white 
                           placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-1 
                           focus:ring-white/40 transition-all duration-200 hover:bg-white/20"
                  placeholder="Password (min. 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-100 mb-2 ml-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white 
                           placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-1 
                           focus:ring-white/40 transition-all duration-200 hover:bg-white/20"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-blue-100 mb-2 ml-1">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white 
                           placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-1 
                           focus:ring-white/40 transition-all duration-200 hover:bg-white/20"
                  style={{ color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                >
                  <option value="male" style={{ backgroundColor: '#1e40af', color: 'white' }}>Male</option>
                  <option value="female" style={{ backgroundColor: '#1e40af', color: 'white' }}>Female</option>
                  <option value="other" style={{ backgroundColor: '#1e40af', color: 'white' }}>Other</option>
                </select>
              </div>

              {formData.role === 'staff' ? (
                <>
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-blue-100 mb-2 ml-1">
                      Position
                    </label>
                    <select
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white 
                               placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-1 
                               focus:ring-white/40 transition-all duration-200 hover:bg-white/20"
                      style={{ color: 'white', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    >
                      <option value="" style={{ backgroundColor: '#1e40af', color: 'white' }}>Select position</option>
                      <option value="receptionist" style={{ backgroundColor: '#1e40af', color: 'white' }}>Receptionist</option>
                      <option value="nurse" style={{ backgroundColor: '#1e40af', color: 'white' }}>Nurse</option>
                      <option value="admin" style={{ backgroundColor: '#1e40af', color: 'white' }}>Admin</option>
                      <option value="other" style={{ backgroundColor: '#1e40af', color: 'white' }}>Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-blue-100 mb-2 ml-1">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white 
                               placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-1 
                               focus:ring-white/40 transition-all duration-200 hover:bg-white/20"
                      placeholder="Enter phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-blue-100 mb-2 ml-1">
                      Address
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white 
                               placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-1 
                               focus:ring-white/40 transition-all duration-200 hover:bg-white/20"
                      placeholder="Enter address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </>
              ) : formData.role === 'doctor' && (
                <>
                  <div>
                    <label htmlFor="no_sip" className="block text-sm font-medium text-blue-100 mb-2 ml-1">
                      NO_SIP
                    </label>
                    <input
                      id="no_sip"
                      name="no_sip"
                      type="text"
                      required
                      className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white 
                               placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-1 
                               focus:ring-white/40 transition-all duration-200 hover:bg-white/20"
                      placeholder="Enter your NO_SIP"
                      value={formData.no_sip}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="specialization" className="block text-sm font-medium text-blue-100 mb-2 ml-1">
                      Specialization
                    </label>
                    <input
                      id="specialization"
                      name="specialization"
                      type="text"
                      required
                      className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white 
                               placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-1 
                               focus:ring-white/40 transition-all duration-200 hover:bg-white/20"
                      placeholder="Enter your specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-blue-100 mb-2 ml-1">
                      Address
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      required
                      className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white 
                               placeholder-white/40 focus:outline-none focus:border-white/40 focus:ring-1 
                               focus:ring-white/40 transition-all duration-200 hover:bg-white/20"
                      placeholder="Enter your address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
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
                    <span>Registering...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>

              <button
                type="button"
                onClick={() => window.location.href = '/login'}
                className="group relative w-full h-12 rounded-xl text-sm font-semibold text-white 
                         border border-white/30 overflow-hidden transition-all duration-300 
                         hover:scale-[1.02] transform"
              >
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;

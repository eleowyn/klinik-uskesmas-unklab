import React, { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/common/Sidebar';

const PatientPortal = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: 'dashboard', icon: 'fas fa-tachometer-alt', label: 'Dashboard' },
    { path: 'clinic-info', icon: 'fas fa-info-circle', label: 'Clinic Info' },
    { path: 'appointments', icon: 'fas fa-calendar-alt', label: 'My Appointments' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar 
        title="Patient Portal" 
        navLinks={navLinks} 
        user={user} 
        onLogout={handleLogout} 
      />
      
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PatientPortal;
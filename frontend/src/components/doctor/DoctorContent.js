import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useDoctorContext } from '../../context/DoctorContext';
import DoctorDashboard from './DoctorDashboard';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="flex justify-center items-center h-64">
    <div className="text-red-500 bg-red-100 p-4 rounded-lg shadow flex items-center">
      <i className="fas fa-exclamation-circle mr-2 text-xl"></i>
      <span>{message}</span>
    </div>
  </div>
);

const DoctorContent = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { loading, error, dashboardData, refreshDashboardData } = useDoctorContext();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'doctor') {
      refreshDashboardData();

      // Auto-refresh data every 30 seconds
      const refreshInterval = setInterval(refreshDashboardData, 30000);
      return () => clearInterval(refreshInterval);
    }
  }, [isAuthenticated, user, refreshDashboardData]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return <DoctorDashboard dashboardData={dashboardData} />;
};

export default DoctorContent;

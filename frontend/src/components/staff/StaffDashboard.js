import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';
import { getPatients, getTransactions, getAppointments } from '../../services/staffService';

const StaffDashboard = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { showAlert } = useContext(AlertContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    patients: 0,
    transactions: 0,
    appointments: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is authenticated and has staff role
    if (!isAuthenticated || !user || user.role !== 'staff') {
      navigate('/login');
      return;
    }

    let isMounted = true;

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const [patientsRes, transactionsRes, appointmentsRes] = await Promise.all([
          getPatients(),
          getTransactions(),
          getAppointments(),
        ]);
        
        if (!isMounted) return;

        // Calculate total revenue from transactions
        const totalRevenue = Array.isArray(transactionsRes) ? 
          transactionsRes.reduce((sum, t) => sum + (t.totalAmount || 0), 0) : 0;
        
        setStats({
          patients: Array.isArray(patientsRes) ? patientsRes.length : 0,
          transactions: Array.isArray(transactionsRes) ? transactionsRes.length : 0,
          appointments: Array.isArray(appointmentsRes) ? appointmentsRes.length : 0,
          revenue: totalRevenue,
        });
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching stats:', err);
        setError(err.message || 'Failed to fetch dashboard data');
        showAlert(err.message || 'Failed to fetch dashboard data', 'error');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    fetchStats();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user, navigate, showAlert]);

  if (!isAuthenticated || !user || user.role !== 'staff') {
    return null; // Let the useEffect handle redirection
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Welcome, {user.staffProfile?.fullName || 'Staff Member'}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <i className="fas fa-procedures text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Patients</h3>
              <p className="text-2xl font-bold">{stats.patients}</p>
            </div>
          </div>
          <Link 
            to="/staff/patients" 
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            View Patients
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <i className="fas fa-receipt text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Transactions</h3>
              <p className="text-2xl font-bold">{stats.transactions}</p>
            </div>
          </div>
          <Link 
            to="/staff/transactions" 
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            View Transactions
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <i className="fas fa-calendar-alt text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Appointments</h3>
              <p className="text-2xl font-bold">{stats.appointments}</p>
            </div>
          </div>
          <Link 
            to="/staff/appointments" 
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            View Appointments
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <i className="fas fa-money-bill-wave text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Revenue</h3>
              <p className="text-2xl font-bold">Rp{stats.revenue.toLocaleString()}</p>
            </div>
          </div>
          <Link 
            to="/staff/transactions" 
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            View Details
          </Link>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/staff/transactions/new" 
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-4 rounded-lg text-center transition"
          >
            <i className="fas fa-cash-register text-2xl mb-2"></i>
            <p>Create Transaction</p>
          </Link>
          <Link 
            to="/staff/patients/new" 
            className="bg-green-100 hover:bg-green-200 text-green-800 p-4 rounded-lg text-center transition"
          >
            <i className="fas fa-user-plus text-2xl mb-2"></i>
            <p>Register Patient</p>
          </Link>
          <Link 
            to="/staff/appointments/new" 
            className="bg-purple-100 hover:bg-purple-200 text-purple-800 p-4 rounded-lg text-center transition"
          >
            <i className="fas fa-calendar-plus text-2xl mb-2"></i>
            <p>Schedule Appointment</p>
          </Link>
          <Link 
            to="/staff/reports" 
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 p-4 rounded-lg text-center transition"
          >
            <i className="fas fa-file-invoice-dollar text-2xl mb-2"></i>
            <p>Generate Report</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;

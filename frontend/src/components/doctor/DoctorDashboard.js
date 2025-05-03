import React from 'react';
import { Link } from 'react-router-dom';

const DoctorDashboard = ({ dashboardData }) => {
  // Use data passed from parent instead of making API calls
  const stats = {
    patients: dashboardData?.patients?.length || 0,
    prescriptions: dashboardData?.prescriptions?.length || 0,
    appointments: dashboardData?.appointments?.length || 0,
  };

  // If no profile is loaded, show loading state
  if (!dashboardData?.doctorProfile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Welcome, Dr. {dashboardData.doctorProfile.name || 'Doctor'}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            to="/doctor/patients" 
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            View Patients
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <i className="fas fa-prescription text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Prescriptions</h3>
              <p className="text-2xl font-bold">{stats.prescriptions}</p>
            </div>
          </div>
          <Link 
            to="/doctor/prescriptions" 
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            View Prescriptions
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
            to="/doctor/appointments" 
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            View Schedule
          </Link>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/doctor/prescriptions/new" 
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-4 rounded-lg text-center transition"
          >
            <i className="fas fa-file-prescription text-2xl mb-2"></i>
            <p>Create Prescription</p>
          </Link>
          <Link 
            to="/doctor/patients" 
            className="bg-green-100 hover:bg-green-200 text-green-800 p-4 rounded-lg text-center transition"
          >
            <i className="fas fa-user-plus text-2xl mb-2"></i>
            <p>View Patients</p>
          </Link>
          <Link 
            to="/doctor/appointments/new" 
            className="bg-purple-100 hover:bg-purple-200 text-purple-800 p-4 rounded-lg text-center transition"
          >
            <i className="fas fa-calendar-plus text-2xl mb-2"></i>
            <p>Schedule Appointment</p>
          </Link>
          <Link 
            to="/doctor/reports" 
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 p-4 rounded-lg text-center transition"
          >
            <i className="fas fa-file-medical text-2xl mb-2"></i>
            <p>View Reports</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DoctorDashboard);

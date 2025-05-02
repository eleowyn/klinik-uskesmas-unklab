import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/patientService';

const PatientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [patient, setPatient] = useState(null);
  const [stats, setStats] = useState({
    prescriptions: 0,
    appointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, prescriptionsRes] = await Promise.all([
          api.get('/api/patients/profile'),
          api.get('/api/patients/prescriptions'),
        ]);
        
        setPatient(profileRes.data.data);
        setStats({
          prescriptions: prescriptionsRes.data.data.length,
          appointments: Math.floor(prescriptionsRes.data.data.length / 2), // Mock data
        });
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Patient Dashboard</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <i className="fas fa-user text-3xl text-blue-600"></i>
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-800">{patient?.fullName}</h2>
            <p className="text-gray-600">{patient?.gender}, {patient?.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Phone</h3>
            <p className="text-gray-800">{patient?.phoneNumber || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Address</h3>
            <p className="text-gray-800">{patient?.address || 'N/A'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Blood Type</h3>
            <p className="text-gray-800">{patient?.bloodType || 'Unknown'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Allergies</h3>
            <p className="text-gray-800">{patient?.allergies?.join(', ') || 'None'}</p>
          </div>
        </div>
        
        <Link 
          to="profile/edit" 
          className="text-blue-600 hover:text-blue-800"
        >
          Edit Profile
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <i className="fas fa-prescription text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Prescriptions</h3>
              <p className="text-2xl font-bold">{stats.prescriptions}</p>
            </div>
          </div>
          <Link 
            to="#" 
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
            to="appointments" 
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            View Appointments
          </Link>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="appointments/new" 
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-4 rounded-lg text-center transition"
          >
            <i className="fas fa-calendar-plus text-2xl mb-2"></i>
            <p>Book Appointment</p>
          </Link>
          <Link 
            to="#" 
            className="bg-green-100 hover:bg-green-200 text-green-800 p-4 rounded-lg text-center transition"
          >
            <i className="fas fa-prescription text-2xl mb-2"></i>
            <p>Request Prescription</p>
          </Link>
          <Link 
            to="clinic-info" 
            className="bg-purple-100 hover:bg-purple-200 text-purple-800 p-4 rounded-lg text-center transition"
          >
            <i className="fas fa-info-circle text-2xl mb-2"></i>
            <p>Clinic Information</p>
          </Link>
          <Link 
            to="#" 
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 p-4 rounded-lg text-center transition"
          >
            <i className="fas fa-file-medical text-2xl mb-2"></i>
            <p>Medical Records</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
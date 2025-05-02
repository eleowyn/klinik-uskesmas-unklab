import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { 
  getDoctorProfile,
  getDoctorPrescriptions,
  createPrescription,
  getPrescriptionDetails,
  updatePrescription
} from '../../services/doctorService';

const DoctorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    patients: 0,
    prescriptions: 0,
    appointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/doctors/prescriptions');
        const prescriptions = res.data.data.length;
        
        // Count unique patients
        const patients = new Set(res.data.data.map(p => p.patient._id)).size;
        
        // For demo purposes, we'll assume appointments are 1/3 of prescriptions
        const appointments = Math.floor(prescriptions / 3);
        
        setStats({
          patients,
          prescriptions,
          appointments,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Doctor Dashboard</h1>
      
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
            to="patients" 
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
            to="prescriptions" 
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
            to="#" 
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
            to="prescriptions/new" 
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-4 rounded-lg text-center transition"
          >
            <i className="fas fa-file-prescription text-2xl mb-2"></i>
            <p>Create Prescription</p>
          </Link>
          <Link 
            to="patients" 
            className="bg-green-100 hover:bg-green-200 text-green-800 p-4 rounded-lg text-center transition"
          >
            <i className="fas fa-user-plus text-2xl mb-2"></i>
            <p>Add Patient</p>
          </Link>
          <Link 
            to="#" 
            className="bg-purple-100 hover:bg-purple-200 text-purple-800 p-4 rounded-lg text-center transition"
          >
            <i className="fas fa-calendar-plus text-2xl mb-2"></i>
            <p>Schedule Appointment</p>
          </Link>
          <Link 
            to="#" 
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

export default DoctorDashboard;
import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import DoctorDashboard from '../components/doctor/DoctorDashboard';
import Sidebar from '../components/common/Sidebar';
import doctorService from '../services/doctorService';

const DoctorPortal = () => {
  const { user, isAuthenticated, isLoading } = useContext(AuthContext);
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        const data = await doctorService.getDoctorProfile();
        setDoctorData(data);
      } catch (err) {
        setError('Failed to load doctor profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user && user.role === 'doctor') {
      fetchDoctorData();
    }
  }, [isAuthenticated, user]);

  // Show loading state
  if (isLoading || loading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  // Redirect if not authenticated or not a doctor
  if (!isAuthenticated || (user && user.role !== 'doctor')) {
    return <Navigate to="/login" replace />;
  }

  // Show error if any
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="doctor-portal">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <Sidebar 
              userRole="doctor"
              menuItems={[
                { label: 'Dashboard', path: '/doctor' },
                { label: 'Patients', path: '/doctor/patients' },
                { label: 'Prescriptions', path: '/doctor/prescriptions' },
                { label: 'Schedule', path: '/doctor/schedule' }
              ]}
            />
          </div>
          <div className="col-md-9">
            <DoctorDashboard doctorData={doctorData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPortal;
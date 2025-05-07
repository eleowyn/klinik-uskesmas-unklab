import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAppointmentDetails } from '../../services/doctorService';
import { AlertContext } from '../../context/AlertContext';

const AppointmentDetails = () => {
  const { id } = useParams();
  const { showAlert } = useContext(AlertContext);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const data = await getAppointmentDetails(id);
        setAppointment(data);
      } catch (error) {
        showAlert('Failed to load appointment details: ' + error, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id, showAlert]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-800">Appointment not found</h2>
        <Link to="/doctor/appointments" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          Back to Appointments List
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <Link to="/doctor/appointments" className="text-gray-600 hover:text-gray-800">
          <i className="fas fa-arrow-left"></i>
          <span className="ml-2">Back to Appointments</span>
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-4">Appointment Details</h1>

      <div className="space-y-4">
        <p><span className="font-medium">Patient:</span> {appointment.patient?.fullName || 'N/A'}</p>
        <p><span className="font-medium">Date:</span> {appointment.date ? new Date(appointment.date).toLocaleDateString() : 'N/A'}</p>
        <p><span className="font-medium">Time:</span> {appointment.time || 'N/A'}</p>
        <p><span className="font-medium">Reason:</span> {appointment.reason || 'N/A'}</p>
        <p><span className="font-medium">Status:</span> {appointment.status || 'N/A'}</p>
        <p><span className="font-medium">Notes:</span> {appointment.notes || 'None'}</p>
      </div>
    </div>
  );
};

export default AppointmentDetails;

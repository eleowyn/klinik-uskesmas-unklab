import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { AlertContext } from '../../context/AlertContext';
import { getPatientDetails } from '../../services/doctorService';

const PatientDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { showAlert } = useContext(AlertContext);
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const patientData = await getPatientDetails(id);
        setPatient(patientData);
      } catch (err) {
        console.error('Error fetching patient details:', err);
        showAlert('Failed to load patient details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, [id, showAlert]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-800">Patient not found</h2>
        <Link to="/doctor/patients" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          Back to Patients List
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{patient.fullName}</h1>
            <p className="text-gray-600">
              {patient.gender}, {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'DOB not provided'}
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              to={`/doctor/prescriptions/new?patientId=${patient._id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              <i className="fas fa-prescription mr-2"></i>
              New Prescription
            </Link>
            <Link
              to={`/doctor/appointments/new?patientId=${patient._id}`}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
            >
              <i className="fas fa-calendar-plus mr-2"></i>
              Schedule Appointment
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b">
          <nav className="flex">
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'prescriptions'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('prescriptions')}
            >
              Prescriptions
            </button>
            <button
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'appointments'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('appointments')}
            >
              Appointments
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <p><span className="font-medium">Phone:</span> {patient.phoneNumber || 'Not provided'}</p>
                  <p><span className="font-medium">Address:</span> {patient.address || 'Not provided'}</p>
                  <p><span className="font-medium">Emergency Contact:</span> {patient.emergencyContact || 'Not provided'}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Medical Information</h3>
                <div className="space-y-3">
                  <p><span className="font-medium">Blood Type:</span> {patient.bloodType || 'Not provided'}</p>
                  <p><span className="font-medium">Allergies:</span> {patient.allergies?.join(', ') || 'None reported'}</p>
                  <p><span className="font-medium">Medical Conditions:</span> {patient.medicalConditions?.join(', ') || 'None reported'}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Prescription History</h3>
              {patient.prescriptions?.length > 0 ? (
                <div className="space-y-4">
                  {patient.prescriptions.map(prescription => (
                    <div key={prescription._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{prescription.medications.join(', ')}</p>
                          <p className="text-sm text-gray-600">{new Date(prescription.date).toLocaleDateString()}</p>
                        </div>
                        <Link
                          to={`/doctor/prescriptions/${prescription._id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No prescriptions found</p>
              )}
            </div>
          )}

          {activeTab === 'appointments' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Appointment History</h3>
              {patient.appointments?.length > 0 ? (
                <div className="space-y-4">
                  {patient.appointments.map(appointment => (
                    <div key={appointment._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{appointment.reason}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">Status: {appointment.status}</p>
                        </div>
                        <Link
                          to={`/doctor/appointments/${appointment._id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No appointments found</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
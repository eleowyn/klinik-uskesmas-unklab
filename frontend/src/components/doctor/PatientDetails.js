import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertContext } from '../../context/AlertContext';
import { getPatientDetails } from '../../services/doctorService';

const PatientDetails = () => {
  const { id } = useParams();
  const { showAlert } = useContext(AlertContext);
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const patientData = await getPatientDetails(id);
        console.log('Patient data received:', patientData);
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

  if (!patient?.data) {
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
          <div className="flex items-center space-x-4">
            <Link
              to="/doctor/patients"
              className="text-gray-600 hover:text-gray-800"
            >
              <i className="fas fa-arrow-left"></i>
              <span className="ml-2">Back to Patients</span>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{patient.data.fullName}</h1>
              <p className="text-gray-600">
                {patient.data.gender}, {patient.data.dateOfBirth ? new Date(patient.data.dateOfBirth).toLocaleDateString() : 'DOB not provided'}
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link
              to={`/doctor/prescriptions/new?patientId=${patient.data._id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              <i className="fas fa-prescription mr-2"></i>
              New Prescription
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
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <p><span className="font-medium">Phone:</span> {patient.data.phoneNumber || 'Not provided'}</p>
                  <p><span className="font-medium">Address:</span> {patient.data.address || 'Not provided'}</p>
                  <p><span className="font-medium">Emergency Contact:</span> {patient.data.emergencyContact ? 
                    `${patient.data.emergencyContact.name} (${patient.data.emergencyContact.relationship}) - ${patient.data.emergencyContact.phoneNumber}` 
                    : 'Not provided'}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Medical Information</h3>
                <div className="space-y-3">
                  <p><span className="font-medium">Blood Type:</span> {patient.data.bloodType || 'Not provided'}</p>
                  <p><span className="font-medium">Allergies:</span> {patient.data.allergies || 'None reported'}</p>
                  <p><span className="font-medium">Medical Conditions:</span> {patient.data.medicalConditions || 'None reported'}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Prescription History</h3>
              {patient.data.prescriptions?.length > 0 ? (
                <div className="space-y-4">
                  {patient.data.prescriptions.map(prescription => (
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
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;

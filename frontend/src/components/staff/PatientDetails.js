import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertContext } from '../../context/AlertContext';
import { getPatientDetails } from '../../services/staffService';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useContext(AlertContext);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientDetails();
  }, [id]);

  const fetchPatientDetails = async () => {
    try {
      setLoading(true);
      const data = await getPatientDetails(id);
      setPatient(data);
    } catch (err) {
      showAlert('Failed to load patient details: ' + err.message, 'error');
      navigate('/staff/patients');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!patient) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Patient Details</h1>
        <button
          onClick={() => navigate('/staff/patients')}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Back to Patients
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600">Full Name</label>
                <p className="mt-1 text-gray-900">{patient.fullName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <p className="mt-1 text-gray-900">{patient.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Phone Number</label>
                <p className="mt-1 text-gray-900">{patient.phoneNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                <p className="mt-1 text-gray-900">
                  {new Date(patient.dateOfBirth).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Gender</label>
                <p className="mt-1 text-gray-900 capitalize">{patient.gender}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Blood Type</label>
                <p className="mt-1 text-gray-900">{patient.bloodType || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Medical Information</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600">Medical History</label>
                <p className="mt-1 text-gray-900 whitespace-pre-line">
                  {patient.medicalHistory || 'No medical history recorded'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Allergies</label>
                <p className="mt-1 text-gray-900">
                  {patient.allergies || 'No allergies recorded'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Current Medications</label>
                <p className="mt-1 text-gray-900">
                  {patient.currentMedications || 'No current medications recorded'}
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Emergency Contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600">Contact Name</label>
                <p className="mt-1 text-gray-900">
                  {patient.emergencyContact?.name || 'Not specified'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Contact Phone</label>
                <p className="mt-1 text-gray-900">
                  {patient.emergencyContact?.phone || 'Not specified'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Relationship</label>
                <p className="mt-1 text-gray-900">
                  {patient.emergencyContact?.relationship || 'Not specified'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;

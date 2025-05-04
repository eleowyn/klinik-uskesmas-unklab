import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AlertContext } from '../../context/AlertContext';
import { getPrescriptionDetails } from '../../services/doctorService';

const PrescriptionDetail = () => {
  const { id } = useParams();
  const { showAlert } = useContext(AlertContext);
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasErrorRef = useRef(false);

  useEffect(() => {
    if (!id) {
      showAlert('Invalid prescription ID', 'error');
      setLoading(false);
      return;
    }

    const fetchPrescriptionDetails = async () => {
      try {
        const response = await getPrescriptionDetails(id);
        console.log('Prescription details response:', response);
        setPrescription(response); // Remove .data since response is already formatted
        hasErrorRef.current = false;
      } catch (err) {
        if (!hasErrorRef.current) {
          console.error('Error fetching prescription details:', err);
          showAlert('Failed to load prescription details', 'error');
          hasErrorRef.current = true;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptionDetails();
  }, [id, showAlert]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!prescription?.medications) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-800">Prescription not found</h2>
        <Link to="/doctor/prescriptions" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          Back to Prescriptions
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <Link
            to={`/doctor/patients/${prescription.patient._id}`}
            className="text-gray-600 hover:text-gray-800"
          >
            <i className="fas fa-arrow-left"></i>
            <span className="ml-2">Back to Patient</span>
          </Link>
          <div className="text-sm text-gray-500">
            {prescription.date ? new Date(prescription.date).toLocaleDateString() : 'Date not available'}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Prescription Details</h2>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Patient Information</h3>
            <p><span className="font-medium">Name:</span> {prescription.patient?.fullName || 'Not available'}</p>
            <p><span className="font-medium">Gender:</span> {prescription.patient?.gender || 'Not available'}</p>
            {prescription.patient?.dateOfBirth && (
              <p><span className="font-medium">Age:</span> {
                new Date().getFullYear() - new Date(prescription.patient.dateOfBirth).getFullYear()
              } years</p>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Diagnosis</h3>
            <p className="text-gray-700">{prescription.diagnosis}</p>
          </div>

          {prescription.notes && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Notes</h3>
              <p className="text-gray-700">{prescription.notes}</p>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Medications</h3>
            <div className="space-y-4">
              {prescription.medications.map((med, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-gray-800">{med.name}</p>
                      <p className="text-gray-600">Dosage: {med.dosage}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Frequency: {med.frequency}</p>
                      <p className="text-gray-600">Duration: {med.duration}</p>
                    </div>
                  </div>
                  {med.instructions && (
                    <div className="mt-2 text-gray-700">
                      <p className="font-medium">Instructions:</p>
                      <p>{med.instructions}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionDetail;

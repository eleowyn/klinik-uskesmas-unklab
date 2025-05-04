import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertContext } from '../../context/AlertContext';
import { getPrescriptionDetails } from '../../services/doctorService';

const PrescriptionDetail = () => {
  const { id } = useParams();
  const { showAlert } = useContext(AlertContext);
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Print button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 print:hidden"
        >
          <i className="fas fa-print"></i>
          <span>Print Prescription</span>
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6 print:shadow-none">
          <div className="flex justify-between items-start mb-6 print:hidden">
            <Link
              to={`/doctor/patients/${prescription.patient._id}`}
              className="text-gray-600 hover:text-gray-800"
            >
              <i className="fas fa-arrow-left"></i>
              <span className="ml-2">Back to Patient</span>
            </Link>
          </div>

          {/* Header with clinic info - visible only in print */}
          <div className="hidden print:block mb-8 text-center border-b pb-4">
            <h1 className="text-2xl font-bold text-gray-900">Klinik Uskesmas Unklab</h1>
            <p className="text-gray-600">Jl. Arnold Mononutu, Airmadidi Bawah, Kec. Airmadidi</p>
            <p className="text-gray-600">Kabupaten Minahasa Utara, Sulawesi Utara 95371</p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Prescription Details</h2>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  Prescription ID: #{prescription._id?.slice(-6).toUpperCase()}
                </p>
                <p className="text-sm text-gray-500">
                  Date: {prescription.date ? new Date(prescription.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Date not available'}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Patient Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {prescription.patient?.fullName || 'Not available'}</p>
                  <p><span className="font-medium">Gender:</span> {prescription.patient?.gender || 'Not available'}</p>
                  {prescription.patient?.dateOfBirth && (
                    <p><span className="font-medium">Age:</span> {
                      new Date().getFullYear() - new Date(prescription.patient.dateOfBirth).getFullYear()
                    } years</p>
                  )}
                  <p><span className="font-medium">Patient ID:</span> {prescription.patient?._id?.slice(-6).toUpperCase() || 'N/A'}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Doctor Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Doctor:</span> Dr. {prescription.doctor?.fullName || 'Not available'}</p>
                  <p><span className="font-medium">Specialization:</span> {prescription.doctor?.specialization || 'Not available'}</p>
                  <p><span className="font-medium">License No:</span> {prescription.doctor?.no_sip || 'Not available'}</p>
                </div>
              </div>
            </div>

          <div className="space-y-6">
            <div className="bg-white border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Diagnosis</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{prescription.diagnosis}</p>
            </div>

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
                      <div className="mt-3 text-gray-700 bg-white p-3 rounded border">
                        <p className="font-medium">Instructions:</p>
                        <p className="mt-1">{med.instructions}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {prescription.notes && (
              <div className="bg-yellow-50 border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Additional Notes</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{prescription.notes}</p>
              </div>
            )}

            {/* Doctor's Signature - visible only in print */}
            <div className="hidden print:block mt-12">
              <div className="border-t pt-6">
                <div className="flex justify-end">
                  <div className="text-center">
                    <div className="h-20"></div>
                    <p className="font-medium">Dr. {prescription.doctor?.fullName || 'Not available'}</p>
                    <p className="text-sm text-gray-600">License No: {prescription.doctor?.no_sip || 'Not available'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionDetail;

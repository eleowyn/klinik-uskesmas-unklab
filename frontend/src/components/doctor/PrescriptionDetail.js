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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 print:hidden"
          >
            <i className="fas fa-print"></i>
            <span>Print Prescription</span>
          </button>
        </div>
        <div className="space-x-2 print:hidden">
          <button
            onClick={() => {
              // Navigate to edit form
              window.location.href = `/doctor/prescriptions/edit/${prescription._id}`;
            }}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
          >
            <i className="fas fa-edit"></i> Edit
          </button>
          <button
            onClick={async () => {
              if (window.confirm('Are you sure you want to delete this prescription?')) {
                try {
                  await import('../../services/doctorService').then(({ deletePrescription }) => deletePrescription(prescription._id));
                  alert('Prescription deleted successfully');
                  window.location.href = '/doctor/prescriptions';
                } catch (error) {
                  alert('Failed to delete prescription: ' + error);
                }
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            <i className="fas fa-trash"></i> Delete
          </button>
        </div>
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
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Prescription Details</h2>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    prescription.isFulfilled 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    <span className={`w-2 h-2 mr-2 rounded-full ${
                      prescription.isFulfilled 
                        ? 'bg-green-400' 
                        : 'bg-yellow-400'
                    }`}></span>
                    {prescription.isFulfilled ? 'Fulfilled' : 'Pending'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  Prescription ID: #{prescription._id?.slice(-6).toUpperCase()}
                </p>
                <p className="text-sm text-gray-500">
                  Date: {prescription.datePrescribed ? new Date(prescription.datePrescribed).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'Date not available'}
                </p>
              </div>
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
            <div className="bg-white border rounded-lg p-6 mt-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Diagnosis
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{prescription.diagnosis}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Medications</h3>
              <div className="space-y-4">
                {prescription.medications.map((med, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="border-b pb-3 mb-3">
                      <h4 className="text-xl font-semibold text-blue-800">{med.name}</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-600 font-medium mb-1">Dosage</p>
                        <p className="text-lg font-semibold text-gray-800">{med.dosage}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-600 font-medium mb-1">Frequency</p>
                        <p className="text-lg font-semibold text-gray-800">{med.frequency}</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-sm text-purple-600 font-medium mb-1">Duration</p>
                        <p className="text-lg font-semibold text-gray-800">{med.duration}</p>
                      </div>
                    </div>
                    {med.instructions && (
                      <div className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                        <p className="font-medium text-yellow-800 mb-2">Special Instructions:</p>
                        <p className="text-gray-700">{med.instructions}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {prescription.notes && (
              <div className="bg-yellow-50 border rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Additional Notes
                </h3>
                <div className="bg-white p-4 rounded-lg border border-yellow-100">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{prescription.notes}</p>
                </div>
              </div>
            )}

            {/* Timeline - visible only in non-print */}
            <div className="print:hidden bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Prescription Timeline
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Prescription Created</p>
                    <p className="text-sm text-gray-500">
                      {prescription.datePrescribed ? new Date(prescription.datePrescribed).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Date not available'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`h-8 w-8 rounded-full ${prescription.isFulfilled ? 'bg-green-100' : 'bg-gray-100'} flex items-center justify-center`}>
                      <svg className={`w-4 h-4 ${prescription.isFulfilled ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Prescription Status</p>
                    <p className={`text-sm ${prescription.isFulfilled ? 'text-green-600' : 'text-yellow-600'}`}>
                      {prescription.isFulfilled ? 'Fulfilled' : 'Pending Fulfillment'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

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
  );
};

export default PrescriptionDetail;

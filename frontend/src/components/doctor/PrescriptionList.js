import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDoctorContext } from '../../context/DoctorContext';
import { useAlert } from '../../context/AlertContext';

const PrescriptionList = () => {
  const { dashboardData, refreshDashboardData } = useDoctorContext();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await refreshDashboardData();
      } catch (error) {
        showAlert('Failed to load prescriptions: ' + error.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [refreshDashboardData, showAlert]);

  const filteredPrescriptions = dashboardData.prescriptions
    .filter(prescription => {
      return prescription.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             prescription.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             prescription.doctor?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Prescriptions</h1>
        <Link
          to="/doctor/prescriptions/new"
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <i className="fas fa-plus mr-2"></i>
          New Prescription
        </Link>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by patient name, diagnosis, or doctor..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredPrescriptions.length > 0 ? (
          <div className="divide-y">
            {filteredPrescriptions.map((prescription) => (
              <div
                key={prescription._id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-800">
                        {prescription.patientName}
                      </h3>
                      <span className="text-sm text-gray-500">
                        (ID: #{prescription._id?.slice(-6).toUpperCase()})
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">
                          <i className="fas fa-user-md mr-2"></i>
                          Dr. {prescription.doctor?.fullName || 'Unknown Doctor'}
                        </p>
                        <p className="text-sm text-gray-600">
                          <i className="fas fa-hospital mr-2"></i>
                          {prescription.doctor?.specialization || 'General Practice'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          <i className="far fa-calendar-alt mr-2"></i>
                          {isNaN(new Date(prescription.date).getTime()) ? 'Date not available' : new Date(prescription.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-sm text-gray-600">
                          <i className="far fa-clock mr-2"></i>
                          {isNaN(new Date(prescription.date).getTime()) ? 'Time not available' : new Date(prescription.date).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    {prescription.diagnosis && (
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <p className="text-sm text-gray-700 flex items-start">
                          <i className="fas fa-stethoscope mt-1 mr-2 text-blue-500"></i>
                          <span>{prescription.diagnosis}</span>
                        </p>
                      </div>
                    )}
                    {prescription.medications && prescription.medications.length > 0 && (
                      <div className="mt-3 text-sm text-gray-600">
                        <i className="fas fa-pills mr-2 text-gray-400"></i>
                        {prescription.medications.length} medication(s) prescribed
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/doctor/prescriptions/${prescription._id}`}
                      className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <i className="fas fa-eye mr-2"></i>
                      View Details
                    </Link>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/doctor/prescriptions/edit/${prescription._id}`}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        title="Edit Prescription"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <i className="fas fa-prescription-bottle text-4xl"></i>
            </div>
            <p className="text-gray-500">No prescriptions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionList;

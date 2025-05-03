import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDoctorContext } from '../../context/DoctorContext';
import { useAlert } from '../../context/AlertContext';

const PrescriptionList = () => {
  const { dashboardData, refreshDashboardData } = useDoctorContext();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

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
      const matchesSearch = prescription.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          prescription.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || prescription.status === filterStatus;
      return matchesSearch && matchesFilter;
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

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search prescriptions..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Prescriptions List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredPrescriptions.length > 0 ? (
          <div className="divide-y">
            {filteredPrescriptions.map((prescription) => (
              <div
                key={prescription._id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-800">
                      {prescription.patientName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(prescription.date).toLocaleDateString()}
                    </p>
                    {prescription.diagnosis && (
                      <p className="mt-1 text-gray-600">{prescription.diagnosis}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      prescription.status === 'active' ? 'bg-green-100 text-green-700' :
                      prescription.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {prescription.status}
                    </span>
                    <Link
                      to={`/doctor/prescriptions/${prescription._id}`}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </Link>
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

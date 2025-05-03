import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AlertContext } from '../../context/AlertContext';
import { getAllPatients, deletePatient } from '../../services/staffService';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const { showAlert } = useContext(AlertContext);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await getAllPatients();
      setPatients(data);
    } catch (err) {
      showAlert('Failed to load patients: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await deletePatient(id);
        showAlert('Patient deleted successfully', 'success');
        fetchPatients();
      } catch (err) {
        showAlert('Failed to delete patient: ' + err.message, 'error');
      }
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.includes(searchTerm);
    const matchesFilter = filterGender === 'all' || patient.gender === filterGender;
    return matchesSearch && matchesFilter;
  });

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
        <h1 className="text-2xl font-bold text-gray-800">Patients</h1>
        <Link
          to="/staff/patients/new"
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <i className="fas fa-plus mr-2"></i>
          Add New Patient
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search patients..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterGender}
          onChange={(e) => setFilterGender(e.target.value)}
        >
          <option value="all">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Patients List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredPatients.length > 0 ? (
          <div className="divide-y">
            {filteredPatients.map((patient) => (
              <div
                key={patient._id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-800">
                      {patient.fullName}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span>
                        <i className="fas fa-envelope mr-1"></i>
                        {patient.email}
                      </span>
                      <span>
                        <i className="fas fa-phone mr-1"></i>
                        {patient.phone}
                      </span>
                      <span>
                        <i className="fas fa-calendar mr-1"></i>
                        {new Date(patient.dateOfBirth).toLocaleDateString()}
                      </span>
                      <span className="capitalize">
                        <i className="fas fa-venus-mars mr-1"></i>
                        {patient.gender}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link
                      to={`/staff/patients/${patient._id}/edit`}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <i className="fas fa-edit"></i>
                    </Link>
                    <button
                      onClick={() => handleDelete(patient._id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <i className="fas fa-user-injured text-4xl"></i>
            </div>
            <p className="text-gray-500">No patients found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientManagement;

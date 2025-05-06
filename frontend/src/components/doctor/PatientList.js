import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDoctorContext } from '../../context/DoctorContext';
import { useAlert } from '../../context/AlertContext';

const PatientList = () => {
  const { dashboardData, refreshDashboardData } = useDoctorContext();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await refreshDashboardData();
      } catch (error) {
        showAlert('Failed to load patients: ' + error.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [refreshDashboardData, showAlert]);

  const filteredPatients = dashboardData.patients
    .filter(patient => {
      const matchesSearch = 
        patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterGender === 'all' || patient.gender === filterGender;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (!a.fullName || !b.fullName) return 0;
      return a.fullName.localeCompare(b.fullName);
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
        <div className="text-sm text-gray-600">
          Total Patients: {dashboardData.patients.length}
        </div>
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
              <Link
                key={patient._id}
                to={`/doctor/patients/${patient._id}`}
                className="block p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-semibold">
                    {patient.fullName.charAt(0)}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium text-gray-800">
                      {patient.fullName}
                      {patient.bloodType && patient.bloodType !== 'unknown' && (
                        <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          {patient.bloodType}
                        </span>
                      )}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      {patient.email && (
                        <span>
                          <i className="fas fa-envelope mr-1"></i>
                          {patient.email}
                        </span>
                      )}
                      {patient.phoneNumber && (
                        <span>
                          <i className="fas fa-phone mr-1"></i>
                          {patient.phoneNumber}
                        </span>
                      )}
                      <span className="capitalize">
                        <i className="fas fa-venus-mars mr-1"></i>
                        {patient.gender}
                      </span>
                      <span>
                        <i className="fas fa-calendar-alt mr-1"></i>
                        {new Date(patient.dateOfBirth).toLocaleDateString()}
                      </span>
                      {patient.lastVisit && (
                        <span className="text-blue-600">
                          <i className="fas fa-clock mr-1"></i>
                          Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-blue-500">
                    <i className="fas fa-chevron-right"></i>
                  </div>
                </div>
              </Link>
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

export default PatientList;

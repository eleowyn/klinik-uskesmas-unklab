import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDoctorContext } from '../../context/DoctorContext';

const PatientList = () => {
  const { dashboardData } = useDoctorContext();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = dashboardData.patients?.filter(patient =>
    patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phoneNumber?.includes(searchTerm)
  ) || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Patients</h1>
        <div className="flex space-x-4">
          <Link 
            to="/doctor/appointments/new" 
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
          >
            <i className="fas fa-calendar-plus mr-2"></i>
            Schedule Appointment
          </Link>
          <Link 
            to="/doctor/prescriptions/new" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            <i className="fas fa-prescription mr-2"></i>
            New Prescription
          </Link>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search patients by name or phone..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="fas fa-search absolute right-3 top-3 text-gray-400"></i>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPatients.length > 0 ? (
              filteredPatients.map(patient => (
                <tr key={patient._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <i className="fas fa-user text-blue-600"></i>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{patient.fullName}</div>
                        <div className="text-sm text-gray-500">{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                      {patient.gender}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.phoneNumber || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    <Link 
                      to={`/doctor/patients/${patient._id}`} 
                      className="text-blue-600 hover:text-blue-900"
                      title="View Patient Details"
                    >
                      <i className="fas fa-eye"></i>
                    </Link>
                    <Link 
                      to={`/doctor/prescriptions/new?patientId=${patient._id}`} 
                      className="text-green-600 hover:text-green-900"
                      title="Create Prescription"
                    >
                      <i className="fas fa-prescription"></i>
                    </Link>
                    <Link 
                      to={`/doctor/appointments/new?patientId=${patient._id}`} 
                      className="text-purple-600 hover:text-purple-900"
                      title="Schedule Appointment"
                    >
                      <i className="fas fa-calendar-plus"></i>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  {searchTerm ? 'No patients found matching your search' : 'No patients found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientList;

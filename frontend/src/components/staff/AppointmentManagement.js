import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AlertContext } from '../../context/AlertContext';
import { useStaffContext } from '../../context/StaffContext';
import { deleteAppointment } from '../../services/staffService';

const AppointmentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { showAlert } = useContext(AlertContext);
  const { dashboardData, refreshDashboardData, loading } = useStaffContext();
  const { appointments } = dashboardData;

  useEffect(() => {
    refreshDashboardData();
  }, [refreshDashboardData]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await deleteAppointment(id);
        showAlert('Appointment deleted successfully', 'success');
        refreshDashboardData();
      } catch (err) {
        showAlert('Failed to delete appointment: ' + err.message, 'error');
      }
    }
  };

  const filteredAppointments = (appointments || []).filter(appointment => {
    const matchesSearch = 
      appointment.patient?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || appointment.status === filterStatus;
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
        <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
        <Link
          to="/staff/appointments/new"
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <i className="fas fa-plus mr-2"></i>
          New Appointment
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search appointments..."
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
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no-show">No Show</option>
        </select>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredAppointments.length > 0 ? (
          <div className="divide-y">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment._id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-800">
                      {appointment.patient?.fullName}
                      <span className="text-gray-500 text-sm ml-2">
                        with Dr. {appointment.doctor?.fullName}
                      </span>
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span>
                        <i className="fas fa-calendar mr-1"></i>
                        {appointment.date}
                      </span>
                      <span>
                        <i className="fas fa-clock mr-1"></i>
                        {appointment.time}
                      </span>
                      <span>
                        <i className="fas fa-comment mr-1"></i>
                        {appointment.reason}
                      </span>
                      {appointment.staff && (
                        <span>
                          <i className="fas fa-user-nurse mr-1"></i>
                          {appointment.staff.fullName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                      appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      appointment.status === 'no-show' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {appointment.status}
                    </span>
                    <Link
                      to={`/staff/appointments/${appointment._id}/edit`}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <i className="fas fa-edit"></i>
                    </Link>
                    <button
                      onClick={() => handleDelete(appointment._id)}
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
              <i className="fas fa-calendar-times text-4xl"></i>
            </div>
            <p className="text-gray-500">No appointments found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentManagement;

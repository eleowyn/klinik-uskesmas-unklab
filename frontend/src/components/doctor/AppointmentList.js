import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDoctorContext } from '../../context/DoctorContext';
import { useAlert } from '../../context/AlertContext';

const AppointmentList = () => {
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
        showAlert('Failed to load appointments: ' + error.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [refreshDashboardData, showAlert]);

  const filteredAppointments = dashboardData.appointments
    .filter(appointment => {
      const matchesSearch = 
        appointment.patient?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.reason?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || appointment.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

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
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search appointments..."
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Appointment List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredAppointments.length > 0 ? (
          <div className="divide-y">
            {filteredAppointments.map(appointment => (
              <Link
                key={appointment._id}
                to={`/doctor/appointments/${appointment._id}`}
                className="block p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">{appointment.patient?.fullName}</h3>
                    <p className="text-sm text-gray-500">{new Date(appointment.date).toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{appointment.reason}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                    appointment.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {appointment.status}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            No appointments found
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentList;

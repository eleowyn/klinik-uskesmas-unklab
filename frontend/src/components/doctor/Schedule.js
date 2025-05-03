import React, { useState, useEffect } from 'react';
import { useDoctorContext } from '../../context/DoctorContext';
import { useAlert } from '../../context/AlertContext';

const Schedule = () => {
  const { dashboardData, refreshDashboardData, updateAppointment } = useDoctorContext();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('day'); // 'day' or 'week'

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await refreshDashboardData();
      } catch (error) {
        showAlert('Failed to load schedule: ' + error.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [refreshDashboardData, showAlert]);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await updateAppointment(appointmentId, { status: newStatus });
      showAlert('Appointment status updated successfully', 'success');
    } catch (error) {
      showAlert('Failed to update appointment status: ' + error.message, 'error');
    }
  };

  const filterAppointmentsByDate = (appointments, date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.toDateString() === date.toDateString();
    });
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    return slots;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  const timeSlots = getTimeSlots();
  const todayAppointments = filterAppointmentsByDate(dashboardData.appointments, selectedDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Schedule</h1>
        <div className="flex items-center gap-4">
          <input
            type="date"
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
          />
          <div className="flex rounded-lg border overflow-hidden">
            <button
              className={`px-4 py-2 ${viewMode === 'day' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
              onClick={() => setViewMode('day')}
            >
              Day
            </button>
            <button
              className={`px-4 py-2 ${viewMode === 'week' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
              onClick={() => setViewMode('week')}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-[100px_1fr] divide-x">
          {/* Time Column */}
          <div className="divide-y">
            <div className="h-16 bg-gray-50"></div>
            {timeSlots.map((time) => (
              <div key={time} className="h-20 p-2 text-sm text-gray-500">
                {time}
              </div>
            ))}
          </div>

          {/* Appointments Column */}
          <div className="divide-y">
            <div className="h-16 bg-gray-50 p-4">
              <h3 className="font-medium text-gray-800">
                {selectedDate.toLocaleDateString(undefined, { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
            </div>
            {timeSlots.map((time) => {
              const slotAppointments = todayAppointments.filter(apt => {
                const aptTime = new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return aptTime === time;
              });

              return (
                <div key={time} className="h-20 p-2 relative">
                  {slotAppointments.map((apt) => (
                    <div
                      key={apt._id}
                      className={`absolute inset-x-2 rounded-lg p-2 ${
                        apt.status === 'completed' ? 'bg-green-100' :
                        apt.status === 'cancelled' ? 'bg-red-100' :
                        'bg-blue-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{apt.patientName}</p>
                          <p className="text-sm text-gray-600">{apt.type}</p>
                        </div>
                        <select
                          value={apt.status}
                          onChange={(e) => handleStatusChange(apt._id, e.target.value)}
                          className="text-sm border rounded px-2 py-1"
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;

import React, { useState, useEffect } from 'react';
import { useDoctorContext } from '../../context/DoctorContext';
import { useAlert } from '../../context/AlertContext';

const Schedule = () => {
  const { dashboardData, refreshDashboardData, updateAppointment } = useDoctorContext();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'day' or 'week'
  const [draggedAppointment, setDraggedAppointment] = useState(null);
  const [hoveredTimeSlot, setHoveredTimeSlot] = useState(null);

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
      await refreshDashboardData();
    } catch (error) {
      showAlert('Failed to update appointment status: ' + error.message, 'error');
    }
  };

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start from Sunday

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) { // 30-minute intervals
        slots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
    }
    return slots;
  };

  const filterAppointmentsByDate = (appointments, date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.toDateString() === date.toDateString();
    });
  };

  const handleDragStart = (appointment) => {
    setDraggedAppointment(appointment);
  };

  const handleDragOver = (e, timeSlot, date) => {
    e.preventDefault();
    setHoveredTimeSlot({ time: timeSlot, date });
  };

  const handleDrop = async (e, timeSlot, date) => {
    e.preventDefault();
    if (!draggedAppointment) return;

    try {
      const [hours, minutes] = timeSlot.split(':');
      const newDate = new Date(date);
      newDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      await updateAppointment(draggedAppointment._id, {
        ...draggedAppointment,
        date: newDate.toISOString()
      });

      showAlert('Appointment rescheduled successfully', 'success');
      await refreshDashboardData();
    } catch (error) {
      showAlert('Failed to reschedule appointment: ' + error.message, 'error');
    } finally {
      setDraggedAppointment(null);
      setHoveredTimeSlot(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  const timeSlots = getTimeSlots();
  const weekDates = viewMode === 'week' ? getWeekDates() : [selectedDate];

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

      {/* Calendar Grid */}
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

          {/* Days Columns */}
          <div className="grid grid-cols-1 md:grid-cols-7 divide-x">
            {/* Day Headers */}
            <div className="col-span-full grid grid-cols-1 md:grid-cols-7 divide-x">
              {weekDates.map((date) => (
                <div key={date.toISOString()} className="h-16 bg-gray-50 p-4">
                  <h3 className="font-medium text-gray-800">
                    {date.toLocaleDateString(undefined, { 
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </h3>
                </div>
              ))}
            </div>

            {/* Time Slots Grid */}
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-1 md:grid-cols-7 divide-x">
                {weekDates.map((date) => {
                  const dayAppointments = filterAppointmentsByDate(dashboardData.appointments, date);
                  const slotAppointments = dayAppointments.filter(apt => {
                    const aptTime = new Date(apt.date).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: false 
                    });
                    return aptTime === time;
                  });

                  return (
                    <div 
                      key={`${date.toISOString()}-${time}`}
                      className={`h-20 p-2 relative ${
                        hoveredTimeSlot?.time === time && 
                        hoveredTimeSlot?.date.toDateString() === date.toDateString() 
                          ? 'bg-blue-50' 
                          : ''
                      }`}
                      onDragOver={(e) => handleDragOver(e, time, date)}
                      onDrop={(e) => handleDrop(e, time, date)}
                    >
                      {slotAppointments.map((apt) => (
                        <div
                          key={apt._id}
                          draggable
                          onDragStart={() => handleDragStart(apt)}
                          className={`absolute inset-x-2 rounded-lg p-2 cursor-move transition-all duration-200 hover:shadow-lg ${
                            apt.status === 'completed' ? 'bg-green-100' :
                            apt.status === 'cancelled' ? 'bg-red-100' :
                            draggedAppointment?._id === apt._id ? 'bg-blue-200 opacity-50' :
                            'bg-blue-100'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-800 text-sm truncate">{apt.patient?.fullName}</p>
                              <p className="text-xs text-gray-600 truncate">{apt.reason}</p>
                            </div>
                            <select
                              value={apt.status}
                              onChange={(e) => handleStatusChange(apt._id, e.target.value)}
                              className="text-xs border rounded px-1 py-0.5"
                              onClick={(e) => e.stopPropagation()}
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;

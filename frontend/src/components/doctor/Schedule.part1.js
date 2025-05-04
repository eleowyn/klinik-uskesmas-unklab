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

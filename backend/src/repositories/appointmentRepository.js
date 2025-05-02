const Appointment = require('../models/Appointment');

const createAppointment = async (appointmentData) => {
  try {
    console.log('Creating appointment with data:', appointmentData);
    const appointment = new Appointment(appointmentData);
    await appointment.save();
    console.log('Appointment created successfully:', appointment._id);
    return appointment;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

const findAppointmentById = async (id) => {
  try {
    console.log('Finding appointment by ID:', id);
    const appointment = await Appointment.findById(id)
      .populate('patient')
      .populate('doctor');
    console.log('Appointment found:', appointment ? appointment._id : 'none');
    return appointment;
  } catch (error) {
    console.error('Error finding appointment by ID:', error);
    throw error;
  }
};

const findAppointmentsByPatient = async (patientId) => {
  try {
    console.log('Finding appointments for patient:', patientId);
    const appointments = await Appointment.find({ patient: patientId })
      .populate('patient')
      .populate('doctor');
    console.log('Found', appointments.length, 'appointments for patient');
    return appointments;
  } catch (error) {
    console.error('Error finding appointments by patient:', error);
    throw error;
  }
};

const findAppointmentsByDoctor = async (doctorId) => {
  try {
    console.log('Finding appointments for doctor:', doctorId);
    const appointments = await Appointment.find({ doctor: doctorId })
      .populate('patient')
      .populate('doctor');
    console.log('Found', appointments.length, 'appointments for doctor');
    return appointments;
  } catch (error) {
    console.error('Error finding appointments by doctor:', error);
    throw error;
  }
};

const findUpcomingAppointments = async () => {
  try {
    console.log('Finding upcoming appointments');
    const appointments = await Appointment.find({ 
      date: { $gte: new Date() },
      status: 'scheduled'
    })
    .populate('patient')
    .populate('doctor');
    console.log('Found', appointments.length, 'upcoming appointments');
    return appointments;
  } catch (error) {
    console.error('Error finding upcoming appointments:', error);
    throw error;
  }
};

const updateAppointment = async (id, updateData) => {
  try {
    console.log('Updating appointment:', id, 'with data:', updateData);
    const appointment = await Appointment.findByIdAndUpdate(id, updateData, { new: true })
      .populate('patient')
      .populate('doctor');
    console.log('Appointment updated:', appointment ? appointment._id : 'none');
    return appointment;
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};

const deleteAppointment = async (id) => {
  try {
    console.log('Deleting appointment:', id);
    const appointment = await Appointment.findByIdAndDelete(id);
    console.log('Appointment deleted:', appointment ? appointment._id : 'none');
    return appointment;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
};

module.exports = {
  createAppointment,
  findAppointmentById,
  findAppointmentsByPatient,
  findAppointmentsByDoctor,
  findUpcomingAppointments,
  updateAppointment,
  deleteAppointment,
};

import api from './authService';

// Doctor Profile
export const getDoctorProfile = async () => {
  try {
    const response = await api.get('/doctors/profile');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    throw error.response?.data?.message || 'Failed to fetch doctor profile';
  }
};

// Patient Management
export const getDoctorPatients = async () => {
  try {
    console.log('Fetching doctor patients...');
    const response = await api.get('/doctors/patients');
    console.log('Doctor patients response:', response.data);
    
    // Extract patients from the response data and ensure it's an array
    const patients = Array.isArray(response.data?.data) ? response.data.data : [];
    
    console.log('Processed patients:', {
      count: patients.length,
      samplePatient: patients[0] ? {
        id: patients[0]._id,
        name: patients[0].fullName,
        fields: Object.keys(patients[0])
      } : null
    });
    
    return patients;
  } catch (error) {
    console.error('Error fetching patients:', error);
    console.error('Full error object:', error);
    throw error.response?.data?.message || 'Failed to fetch patients';
  }
};

export const getPatientDetails = async (patientId) => {
  try {
    const response = await api.get(`/doctors/patients/${patientId}`);
    console.log('API Response:', response);
    return { data: response.data.data };  // Wrap in data property to match frontend expectation
  } catch (error) {
    console.error('Error fetching patient details:', error);
    throw error.response?.data?.message || 'Failed to fetch patient details';
  }
};

export const addPatient = async (patientData) => {
  try {
    const response = await api.post('/doctors/patients', patientData);
    return response.data.data;
  } catch (error) {
    console.error('Error adding patient:', error);
    throw error.response?.data?.message || 'Failed to add patient';
  }
};

// Prescription Management
export const getDoctorPrescriptions = async () => {
  try {
    const response = await api.get('/doctors/prescriptions');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    throw error.response?.data?.message || 'Failed to fetch prescriptions';
  }
};

export const getPrescriptionDetails = async (prescriptionId) => {
  try {
    const response = await api.get(`/doctors/prescriptions/${prescriptionId}`);
    console.log('Raw prescription response:', response);
    // Check if the response has data property and unwrap accordingly
    const prescriptionData = response.data?.data || response.data;
    if (!prescriptionData) {
      throw new Error('No prescription data received');
    }
    return prescriptionData;
  } catch (error) {
    console.error('Error fetching prescription details:', error);
    throw error.response?.data?.message || 'Failed to fetch prescription details';
  }
};

export const createPrescription = async (prescriptionData) => {
  try {
    const response = await api.post('/doctors/prescriptions', prescriptionData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating prescription:', error);
    throw error.response?.data?.message || 'Failed to create prescription';
  }
};

export const updatePrescription = async (prescriptionId, updateData) => {
  try {
    const response = await api.put(`/doctors/prescriptions/${prescriptionId}`, updateData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating prescription:', error);
    throw error.response?.data?.message || 'Failed to update prescription';
  }
};

export const deletePrescription = async (prescriptionId) => {
  try {
    const response = await api.delete(`/doctors/prescriptions/${prescriptionId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error deleting prescription:', error);
    throw error.response?.data?.message || 'Failed to delete prescription';
  }
};

// Appointment Management
export const getDoctorAppointments = async () => {
  try {
    const response = await api.get('/doctors/appointments');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error.response?.data?.message || 'Failed to fetch appointments';
  }
};

export const getAppointmentDetails = async (appointmentId) => {
  try {
    const response = await api.get(`/doctors/appointments/${appointmentId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching appointment details:', error);
    throw error.response?.data?.message || 'Failed to fetch appointment details';
  }
};

export const createAppointment = async (appointmentData) => {
  try {
    const response = await api.post('/doctors/appointments', appointmentData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error.response?.data?.message || 'Failed to create appointment';
  }
};

export const updateAppointment = async (appointmentId, updateData) => {
  try {
    const response = await api.put(`/doctors/appointments/${appointmentId}`, updateData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error.response?.data?.message || 'Failed to update appointment';
  }
};

export const deleteAppointment = async (appointmentId) => {
  try {
    const response = await api.delete(`/doctors/appointments/${appointmentId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error deleting appointment:', error);
    throw error.response?.data?.message || 'Failed to delete appointment';
  }
};

// Schedule Management
export const getDoctorSchedule = async (startDate, endDate) => {
  try {
    const response = await api.get('/doctors/schedule', {
      params: { startDate, endDate }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    throw error.response?.data?.message || 'Failed to fetch schedule';
  }
};

export const updateSchedule = async (scheduleData) => {
  try {
    const response = await api.put('/doctors/schedule', scheduleData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating schedule:', error);
    throw error.response?.data?.message || 'Failed to update schedule';
  }
};

const doctorService = {
  getDoctorProfile,
  getDoctorPatients,
  getPatientDetails,
  addPatient,
  getDoctorPrescriptions,
  getPrescriptionDetails,
  createPrescription,
  updatePrescription,
  deletePrescription,
  getDoctorAppointments,
  getAppointmentDetails,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getDoctorSchedule,
  updateSchedule
};

export default doctorService;

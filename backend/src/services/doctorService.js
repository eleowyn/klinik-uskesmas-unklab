const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');

class DoctorService {
  // Profile Management
  async getDoctorByUserId(userId) {
    try {
      const doctor = await Doctor.findOne({ user: userId })
        .populate('user', '-password')
        .populate('patients', 'fullName email phone')
        .populate('appointments')
        .populate('prescriptions');
      
      if (!doctor) {
        throw new Error('Doctor not found');
      }
      
      return doctor;
    } catch (error) {
      console.error('Error in getDoctorByUserId:', error);
      throw error;
    }
  }

  async getDoctorById(doctorId) {
    try {
      const doctor = await Doctor.findById(doctorId)
        .populate('user', '-password');
      
      if (!doctor) {
        throw new Error('Doctor not found');
      }
      
      return doctor;
    } catch (error) {
      console.error('Error in getDoctorById:', error);
      throw error;
    }
  }

  async updateDoctorProfile(doctorId, updateData) {
    try {
      const doctor = await Doctor.findByIdAndUpdate(
        doctorId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!doctor) {
        throw new Error('Doctor not found');
      }

      return doctor;
    } catch (error) {
      console.error('Error in updateDoctorProfile:', error);
      throw error;
    }
  }

  // Patient Management
  async getDoctorPatients(doctorId) {
    try {
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        throw new Error('Doctor not found');
      }

      const patients = await Patient.find({ doctors: doctorId })
        .populate('user', '-password')
        .sort({ fullName: 1 });

      return patients;
    } catch (error) {
      console.error('Error in getDoctorPatients:', error);
      throw error;
    }
  }

  async getPatientDetails(doctorId, patientId) {
    try {
      const patient = await Patient.findOne({
        _id: patientId,
        doctors: doctorId
      }).populate('user', '-password');

      if (!patient) {
        throw new Error('Patient not found or not associated with this doctor');
      }

      return patient;
    } catch (error) {
      console.error('Error in getPatientDetails:', error);
      throw error;
    }
  }

  // Prescription Management
  async createPrescription(doctorId, prescriptionData) {
    try {
      const prescription = new Prescription({
        ...prescriptionData,
        doctor: doctorId,
        date: new Date()
      });

      await prescription.save();

      // Update doctor's prescriptions array
      await Doctor.findByIdAndUpdate(doctorId, {
        $push: { prescriptions: prescription._id }
      });

      return prescription;
    } catch (error) {
      console.error('Error in createPrescription:', error);
      throw error;
    }
  }

  async getDoctorPrescriptions(doctorId) {
    try {
      const prescriptions = await Prescription.find({ doctor: doctorId })
        .populate('patient', 'fullName')
        .sort({ date: -1 });

      return prescriptions;
    } catch (error) {
      console.error('Error in getDoctorPrescriptions:', error);
      throw error;
    }
  }

  async updatePrescription(doctorId, prescriptionId, updateData) {
    try {
      const prescription = await Prescription.findOneAndUpdate(
        { _id: prescriptionId, doctor: doctorId },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!prescription) {
        throw new Error('Prescription not found or not associated with this doctor');
      }

      return prescription;
    } catch (error) {
      console.error('Error in updatePrescription:', error);
      throw error;
    }
  }

  // Appointment Management
  async getDoctorAppointments(doctorId, query = {}) {
    try {
      const appointments = await Appointment.find({ 
        doctor: doctorId,
        ...query 
      })
      .populate('patient', 'fullName')
      .sort({ date: 1 });

      return appointments;
    } catch (error) {
      console.error('Error in getDoctorAppointments:', error);
      throw error;
    }
  }

  async updateAppointment(doctorId, appointmentId, updateData) {
    try {
      const appointment = await Appointment.findOneAndUpdate(
        { _id: appointmentId, doctor: doctorId },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!appointment) {
        throw new Error('Appointment not found or not associated with this doctor');
      }

      return appointment;
    } catch (error) {
      console.error('Error in updateAppointment:', error);
      throw error;
    }
  }

  // Schedule Management
  async getDoctorSchedule(doctorId, startDate, endDate) {
    try {
      const query = {
        doctor: doctorId,
        date: {}
      };

      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);

      const appointments = await Appointment.find(query)
        .populate('patient', 'fullName')
        .sort({ date: 1 });

      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        throw new Error('Doctor not found');
      }

      return {
        appointments,
        workingHours: doctor.workingHours
      };
    } catch (error) {
      console.error('Error in getDoctorSchedule:', error);
      throw error;
    }
  }

  async updateWorkingHours(doctorId, workingHours) {
    try {
      const doctor = await Doctor.findByIdAndUpdate(
        doctorId,
        { $set: { workingHours } },
        { new: true, runValidators: true }
      );

      if (!doctor) {
        throw new Error('Doctor not found');
      }

      return doctor;
    } catch (error) {
      console.error('Error in updateWorkingHours:', error);
      throw error;
    }
  }

  // New method to get all doctors
  async getAllDoctors() {
    try {
      const doctors = await Doctor.find()
        .populate('user', '-password')
        .sort({ fullName: 1 });
      return doctors;
    } catch (error) {
      console.error('Error in getAllDoctors:', error);
      throw error;
    }
  }
}

module.exports = new DoctorService();

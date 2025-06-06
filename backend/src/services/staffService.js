const Staff = require('../models/Staff');
const Patient = require('../models/Patient');
const Transaction = require('../models/Transaction');
const Appointment = require('../models/Appointment');
const patientRepository = require('../repositories/patientRepository');

const assignDoctorToPatient = require('../scripts/assignAllPatientsToDoctor').assignDoctorToPatient;

class StaffService {
  // Staff Profile Management
  async getStaffProfile(userId) {
    try {
      const staff = await Staff.findOne({ user: userId })
        .populate('user', '-password')
        .populate('transactions')
        .populate('appointments');
      
      if (!staff) {
        throw new Error('Staff profile not found');
      }
      
      return staff;
    } catch (error) {
      console.error('Error in getStaffProfile:', error);
      throw error;
    }
  }

  async getStaffById(staffId) {
    try {
      const staff = await Staff.findById(staffId)
        .populate('user', '-password');
      
      if (!staff) {
        throw new Error('Staff member not found');
      }
      
      return staff;
    } catch (error) {
      console.error('Error in getStaffById:', error);
      throw error;
    }
  }

  async getAllStaff() {
    try {
      const staffMembers = await Staff.find()
        .populate('user', '-password')
        .sort({ fullName: 1 });
      return staffMembers;
    } catch (error) {
      console.error('Error in getAllStaff:', error);
      throw error;
    }
  }

  async updateStaffProfile(staffId, updateData) {
    try {
      const staff = await Staff.findByIdAndUpdate(
        staffId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!staff) {
        throw new Error('Staff member not found');
      }

      return staff;
    } catch (error) {
      console.error('Error in updateStaffProfile:', error);
      throw error;
    }
  }

  // Patient Management
  async getAllPatients() {
    try {
      const patients = await Patient.find()
        .populate('user', '-password')
        .populate('doctors', 'fullName')
        .sort({ fullName: 1 });
      return patients;
    } catch (error) {
      console.error('Error in getAllPatients:', error);
      throw error;
    }
  }

  async getPatientDetails(patientId) {
    try {
      const patient = await Patient.findById(patientId)
        .populate('user', '-password')
        .populate('doctors', 'fullName');

      if (!patient) {
        throw new Error('Patient not found');
      }

      return patient;
    } catch (error) {
      console.error('Error in getPatientDetails:', error);
      throw error;
    }
  }

  async createNewPatient(patientData, doctorUserId) {
    try {
      const patient = new Patient(patientData);
      await patient.save();

      if (doctorUserId) {
        await assignDoctorToPatient(patient._id.toString(), doctorUserId);
      }

      return patient;
    } catch (error) {
      console.error('Error in createNewPatient:', error);
      throw error;
    }
  }

  async updatePatientDetails(patientId, updateData) {
    try {
      const patient = await Patient.findByIdAndUpdate(
        patientId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!patient) {
        throw new Error('Patient not found');
      }

      return patient;
    } catch (error) {
      console.error('Error in updatePatientDetails:', error);
      throw error;
    }
  }

  async deletePatientById(patientId) {
    try {
      const patient = await Patient.findByIdAndDelete(patientId);
      if (!patient) {
        throw new Error('Patient not found');
      }
      return patient;
    } catch (error) {
      console.error('Error in deletePatientById:', error);
      throw error;
    }
  }

  // Transaction Management
  async createNewTransaction(transactionData) {
    try {
      const transaction = new Transaction(transactionData);
      await transaction.save();

      // Update staff's transactions array
      await Staff.findByIdAndUpdate(transactionData.staff, {
        $push: { transactions: transaction._id }
      });

      return transaction;
    } catch (error) {
      console.error('Error in createNewTransaction:', error);
      throw error;
    }
  }

  async getStaffTransactions(staffId) {
    try {
      const transactions = await Transaction.find({ staff: staffId })
        .populate('patient', 'fullName')
        .sort({ date: -1 });
      return transactions;
    } catch (error) {
      console.error('Error in getStaffTransactions:', error);
      throw error;
    }
  }

  async getTransactionDetails(transactionId) {
    try {
      const transaction = await Transaction.findById(transactionId)
        .populate('patient', 'fullName')
        .populate('staff', 'fullName');

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      return transaction;
    } catch (error) {
      console.error('Error in getTransactionDetails:', error);
      throw error;
    }
  }

  async updateTransactionDetails(transactionId, updateData) {
    try {
      const transaction = await Transaction.findByIdAndUpdate(
        transactionId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).populate('patient', 'fullName')
        .populate('staff', 'fullName');

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      return transaction;
    } catch (error) {
      console.error('Error in updateTransactionDetails:', error);
      throw error;
    }
  }

  async deleteTransactionById(transactionId) {
    try {
      // Find the transaction first to get staff reference
      const transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // Remove transaction reference from staff
      if (transaction.staff) {
        await Staff.findByIdAndUpdate(transaction.staff, {
          $pull: { transactions: transactionId }
        });
      }

      // Delete the transaction
      await Transaction.findByIdAndDelete(transactionId);

      return transaction;
    } catch (error) {
      console.error('Error in deleteTransactionById:', error);
      throw error;
    }
  }

  // Appointment Management
  async getUpcomingAppointments() {
    try {
      const appointments = await Appointment.find()
        .populate('patient', 'fullName')
        .populate('doctor', 'fullName')
        .populate('staff', 'fullName')
        .sort({ date: 1 })
        .lean();

      // Format dates for all appointments
      appointments.forEach(appointment => {
        if (appointment.date) {
          appointment.date = new Date(appointment.date).toISOString().split('T')[0];
        }
      });

      return appointments;
    } catch (error) {
      console.error('Error in getUpcomingAppointments:', error);
      throw error;
    }
  }

  async createNewAppointment(appointmentData) {
    try {
      const appointment = new Appointment(appointmentData);
      await appointment.save();

      // Update staff's appointments array
      if (appointmentData.staff) {
        await Staff.findByIdAndUpdate(appointmentData.staff, {
          $push: { appointments: appointment._id }
        });
      }

      return appointment;
    } catch (error) {
      console.error('Error in createNewAppointment:', error);
      throw error;
    }
  }

  async getAppointmentDetails(appointmentId) {
    try {
      const appointment = await Appointment.findById(appointmentId)
        .populate('patient', 'fullName')
        .populate('doctor', 'fullName')
        .populate('staff', 'fullName')
        .lean();

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Format the date
      if (appointment.date) {
        appointment.date = new Date(appointment.date).toISOString().split('T')[0];
      }

      return appointment;
    } catch (error) {
      console.error('Error in getAppointmentDetails:', error);
      throw error;
    }
  }

  async updateAppointmentDetails(appointmentId, updateData) {
    try {
      const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { $set: updateData },
        { new: true, runValidators: true }
      )
      .populate('patient', 'fullName')
      .populate('doctor', 'fullName')
      .populate('staff', 'fullName')
      .lean();

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Format the date
      if (appointment.date) {
        appointment.date = new Date(appointment.date).toISOString().split('T')[0];
      }

      return appointment;
    } catch (error) {
      console.error('Error in updateAppointmentDetails:', error);
      throw error;
    }
  }

  async deleteAppointmentById(appointmentId) {
    try {
      // Find the appointment first to get staff reference
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Remove appointment reference from staff
      if (appointment.staff) {
        await Staff.findByIdAndUpdate(appointment.staff, {
          $pull: { appointments: appointmentId }
        });
      }

      // Delete the appointment
      await Appointment.findByIdAndDelete(appointmentId);

      return appointment;
    } catch (error) {
      console.error('Error in deleteAppointmentById:', error);
      throw error;
    }
  }

  async getPatientByUserId(userId) {
    try {
    const patient = await patientRepository.findPatientByUserId(userId);
    return patient;
    } catch (error) {
    console.error('Error in getPatientByUserId:', error);
    throw error;
    }
  }
}

module.exports = new StaffService();

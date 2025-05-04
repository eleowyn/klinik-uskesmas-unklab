import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AlertContext } from '../../context/AlertContext';
import { getPatientDetails, createPatient, updatePatient } from '../../services/staffService';

const PatientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useContext(AlertContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    medicalHistory: '',
    allergies: '',
    currentMedications: ''
  });

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const patientData = await getPatientDetails(id);
        setFormData({
          ...patientData,
          dateOfBirth: patientData.dateOfBirth?.split('T')[0] || '',
          address: patientData.address || '',
          emergencyContact: patientData.emergencyContact || {
            name: '',
            relationship: '',
            phone: ''
          }
        });
      } catch (err) {
        showAlert(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id, showAlert]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await updatePatient(id, formData);
        showAlert('Patient updated successfully', 'success');
      } else {
        await createPatient(formData);
        showAlert('Patient created successfully', 'success');
      }
      navigate('/staff/patients');
    } catch (err) {
      showAlert(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {id ? 'Edit Patient' : 'Add New Patient'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {/* Personal Information */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="fullName">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2" htmlFor="phoneNumber">
                Phone *
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2" htmlFor="dateOfBirth">
                Date of Birth *
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2" htmlFor="gender">
                Gender *
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Address</h2>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="address">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="2"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Emergency Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="emergencyContact.name">
                Contact Name
              </label>
              <input
                type="text"
                id="emergencyContact.name"
                name="emergencyContact.name"
                value={formData.emergencyContact.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2" htmlFor="emergencyContact.relationship">
                Relationship
              </label>
              <input
                type="text"
                id="emergencyContact.relationship"
                name="emergencyContact.relationship"
                value={formData.emergencyContact.relationship}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2" htmlFor="emergencyContact.phone">
                Contact Phone
              </label>
              <input
                type="tel"
                id="emergencyContact.phone"
                name="emergencyContact.phone"
                value={formData.emergencyContact.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Medical Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="medicalHistory">
                Medical History
              </label>
              <textarea
                id="medicalHistory"
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 mb-2" htmlFor="allergies">
                Allergies
              </label>
              <textarea
                id="allergies"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 mb-2" htmlFor="currentMedications">
                Current Medications
              </label>
              <textarea
                id="currentMedications"
                name="currentMedications"
                value={formData.currentMedications}
                onChange={handleChange}
                rows="2"
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/staff/patients')}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 transition"
          >
            {loading ? 'Saving...' : (id ? 'Update Patient' : 'Add Patient')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;

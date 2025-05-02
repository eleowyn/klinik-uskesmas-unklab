import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import AlertContext from '../../context/AlertContext';
import api from '../../services/doctorService';

const PrescriptionForm = () => {
  const { user } = useContext(AuthContext);
  const { showAlert } = useContext(AlertContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const patientId = queryParams.get('patientId');
  
  const [formData, setFormData] = useState({
    patient: patientId || '',
    diagnosis: '',
    notes: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
  });
  
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get('/api/doctors/prescriptions');
        
        // Get unique patients from prescriptions
        const patientMap = new Map();
        res.data.data.forEach(prescription => {
          if (!patientMap.has(prescription.patient._id)) {
            patientMap.set(prescription.patient._id, prescription.patient);
          }
        });
        
        setPatients(Array.from(patientMap.values()));
      } catch (err) {
        console.error('Error fetching patients:', err);
      }
    };
    
    if (!patientId) {
      fetchPatients();
    }
  }, [patientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMedicationChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMedications = [...formData.medications];
    updatedMedications[index][name] = value;
    
    setFormData({
      ...formData,
      medications: updatedMedications,
    });
  };

  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [
        ...formData.medications,
        { name: '', dosage: '', frequency: '', duration: '', instructions: '' },
      ],
    });
  };

  const removeMedication = (index) => {
    const updatedMedications = [...formData.medications];
    updatedMedications.splice(index, 1);
    
    setFormData({
      ...formData,
      medications: updatedMedications,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const prescriptionData = {
        patient: formData.patient,
        diagnosis: formData.diagnosis,
        notes: formData.notes,
        medications: formData.medications.filter(med => 
          med.name && med.dosage && med.frequency && med.duration
        ),
      };
      
      await api.post('/api/doctors/prescriptions', prescriptionData);
      showAlert('Prescription created successfully', 'success');
      navigate('/doctor/prescriptions');
    } catch (err) {
      showAlert(err.response?.data?.message || 'Failed to create prescription', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Prescription</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {!patientId && (
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="patient">
              Patient
            </label>
            <select
              id="patient"
              name="patient"
              value={formData.patient}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a patient</option>
              {patients.map(patient => (
                <option key={patient._id} value={patient._id}>
                  {patient.fullName} ({patient.phoneNumber})
                </option>
              ))}
            </select>
          </div>
        )}
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="diagnosis">
            Diagnosis
          </label>
          <input
            type="text"
            id="diagnosis"
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="notes">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Medications</h3>
            <button
              type="button"
              onClick={addMedication}
              className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200 transition"
            >
              <i className="fas fa-plus mr-1"></i> Add Medication
            </button>
          </div>
          
          {formData.medications.map((med, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-gray-700 mb-1">Medication Name</label>
                  <input
                    type="text"
                    name="name"
                    value={med.name}
                    onChange={(e) => handleMedicationChange(index, e)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    name="dosage"
                    value={med.dosage}
                    onChange={(e) => handleMedicationChange(index, e)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-gray-700 mb-1">Frequency</label>
                  <input
                    type="text"
                    name="frequency"
                    value={med.frequency}
                    onChange={(e) => handleMedicationChange(index, e)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={med.duration}
                    onChange={(e) => handleMedicationChange(index, e)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Special Instructions</label>
                <textarea
                  name="instructions"
                  value={med.instructions}
                  onChange={(e) => handleMedicationChange(index, e)}
                  rows="2"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              
              {formData.medications.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMedication(index)}
                  className="mt-2 text-red-600 hover:text-red-800 text-sm"
                >
                  <i className="fas fa-trash mr-1"></i> Remove Medication
                </button>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/doctor/prescriptions')}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400 transition"
          >
            {loading ? 'Saving...' : 'Save Prescription'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PrescriptionForm;
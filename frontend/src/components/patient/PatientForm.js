import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import patientService from '../services/patientService';

const PatientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    address: '',
    medicalHistory: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchPatient = async () => {
        try {
          const patient = await patientService.getById(id);
          setFormData({
            fullName: patient.fullName,
            dateOfBirth: new Date(patient.dateOfBirth).toISOString().split('T')[0],
            gender: patient.gender,
            phone: patient.phone,
            address: patient.address,
            medicalHistory: patient.medicalHistory.join(', '),
          });
        } catch (err) {
          setError('Failed to fetch patient');
        }
      };
      fetchPatient();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    const data = {
      ...formData,
      medicalHistory: formData.medicalHistory
        ? formData.medicalHistory.split(',').map((item) => item.trim())
        : [],
    };

    try {
      if (id) {
        await patientService.update(id, data);
      } else {
        await patientService.create(data);
      }
      navigate('/patients');
    } catch (err) {
      setError('Failed to save patient');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6">{id ? 'Edit Patient' : 'Add Patient'}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      {/* Preview Section */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Preview of Current Data</h3>
        <p><strong>Full Name:</strong> {formData.fullName || 'Not set'}</p>
        <p><strong>Date of Birth:</strong> {formData.dateOfBirth || 'Not set'}</p>
        <p><strong>Gender:</strong> {formData.gender || 'Not set'}</p>
        <p><strong>Phone:</strong> {formData.phone || 'Not set'}</p>
        <p><strong>Address:</strong> {formData.address || 'Not set'}</p>
        <p><strong>Medical History:</strong> {formData.medicalHistory || 'Not set'}</p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-700">Medical History (comma-separated)</label>
          <textarea
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="e.g., Hypertension, Diabetes"
          ></textarea>
        </div>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Saving...' : id ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/patients')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientForm;
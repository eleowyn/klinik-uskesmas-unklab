import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import patientService from '../services/patientService';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const data = await patientService.getById(id);
        setPatient(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch patient');
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!patient) return <div className="text-center mt-10">Patient not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6">Patient Details</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold">Full Name</label>
          <p>{patient.fullName}</p>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Date of Birth</label>
          <p>{new Date(patient.dateOfBirth).toLocaleDateString()}</p>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Gender</label>
          <p>{patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}</p>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Phone</label>
          <p>{patient.phone}</p>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Address</label>
          <p>{patient.address}</p>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Medical History</label>
          <p>{patient.medicalHistory.length > 0 ? patient.medicalHistory.join(', ') : 'None'}</p>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Created At</label>
          <p>{new Date(patient.createdAt).toLocaleString()}</p>
        </div>
      </div>
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => navigate(`/patients/edit/${id}`)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => navigate('/patients')}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default PatientDetail;
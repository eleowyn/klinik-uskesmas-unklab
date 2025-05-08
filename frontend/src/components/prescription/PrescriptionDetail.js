import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import prescriptionService from '../services/prescriptionService';

const PrescriptionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const data = await prescriptionService.getById(id);
        console.log('Data fetched for prescription detail:', data); // Tambahkan log
        setPrescription(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch prescription');
        setLoading(false);
      }
    };
    fetchPrescription();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!prescription) return <div className="text-center mt-10">Prescription not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6">Prescription Details</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold">Medical Record</label>
          <p className="text-gray-900">
            {prescription.medicalRecordId.patientId.fullName} -{' '}
            {prescription.medicalRecordId.diagnosis}
          </p>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Doctor</label>
          <p className="text-gray-900">{prescription.doctorId.username}</p>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Medications</label>
          <ul className="list-disc pl-5 text-gray-900">
            {prescription.medications.map((med, index) => (
              <li key={index}>
                {med.name} - {med.dosage}, {med.frequency} for {med.duration}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Issue Date</label>
          <p className="text-gray-900">{new Date(prescription.issueDate).toLocaleDateString()}</p>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Created At</label>
          <p className="text-gray-900">{new Date(prescription.createdAt).toLocaleString()}</p>
        </div>
      </div>
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => navigate(`/prescriptions/edit/${id}`)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          Edit
        </button>
        <button
          onClick={() => navigate('/prescriptions')}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default PrescriptionDetail;
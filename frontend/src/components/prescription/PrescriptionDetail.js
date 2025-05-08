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
        setPrescription(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch prescription');
        setLoading(false);
      }
    };
    fetchPrescription();
  }, [id]);

  if (loading) return <div className="text-center mt-10 text-light-green-700">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-600 font-semibold">{error}</div>;
  if (!prescription) return <div className="text-center mt-10 text-gray-500">Prescription not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-light-blue-700">Prescription Details</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-light-green-700 font-semibold">Medical Record</label>
          <p className="text-gray-900">
            {prescription.medicalRecordId ? `${prescription.medicalRecordId.patientId.fullName} - ${prescription.medicalRecordId.diagnosis}` : 'N/A'}
          </p>
        </div>
        <div>
          <label className="block text-light-green-700 font-semibold">Doctor</label>
          <p className="text-gray-900">{prescription.doctorId ? prescription.doctorId.username : 'N/A'}</p>
        </div>
        <div>
          <label className="block text-light-green-700 font-semibold">Medications</label>
          <ul className="list-disc pl-5 text-gray-900">
            {prescription.medications.map((med, index) => (
              <li key={index}>
                {med.name} - {med.dosage}, {med.frequency} for {med.duration}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <label className="block text-light-green-700 font-semibold">Issue Date</label>
          <p className="text-gray-900">{new Date(prescription.issueDate).toLocaleDateString()}</p>
        </div>
        <div>
          <label className="block text-light-green-700 font-semibold">Created At</label>
          <p className="text-gray-900">{new Date(prescription.createdAt).toLocaleString()}</p>
        </div>
      </div>
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => navigate(`/prescriptions/edit/${id}`)}
          className="bg-light-green-500 text-white px-4 py-2 rounded hover:bg-light-green-600 focus:outline-none focus:ring-2 focus:ring-light-green-400 focus:ring-offset-1"
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

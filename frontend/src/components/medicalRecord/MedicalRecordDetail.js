import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import medicalRecordService from '../services/medicalRecordService';

const MedicalRecordDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const data = await medicalRecordService.getById(id);
        setRecord(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch medical record');
        setLoading(false);
      }
    };
    fetchRecord();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!record) return <div className="text-center mt-10">Record not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6">Medical Record Details</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold">Patient</label>
          <p>{record.patientId.fullName}</p>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Doctor</label>
          <p>{record.doctorId.username}</p>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Diagnosis</label>
          <p>{record.diagnosis}</p>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Treatment</label>
          <p>{record.treatment}</p>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Visit Date</label>
          <p>{new Date(record.visitDate).toLocaleDateString()}</p>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Notes</label>
          <p>{record.notes || 'No notes'}</p>
        </div>
        <div>
          <label className="block text-gray-700 font-semibold">Created At</label>
          <p>{new Date(record.createdAt).toLocaleString()}</p>
        </div>
      </div>
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => navigate(`/medical-records/edit/${id}`)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={() => navigate('/medical-records')}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default MedicalRecordDetail;
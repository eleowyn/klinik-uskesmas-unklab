import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import medicalRecordService from '../services/medicalRecordService';

const MedicalRecordList = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await medicalRecordService.getAll();
        setRecords(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch medical records');
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await medicalRecordService.delete(id);
        setRecords(records.filter((record) => record._id !== id));
      } catch (err) {
        setError('Failed to delete medical record');
      }
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Medical Records</h2>
        <button
          onClick={() => navigate('/medical-records/new')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New
        </button>
      </div>
      {records.length === 0 ? (
        <p className="text-center text-gray-500">No medical records found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Patient</th>
                <th className="border p-3 text-left">Doctor</th>
                <th className="border p-3 text-left">Diagnosis</th>
                <th className="border p-3 text-left">Visit Date</th>
                <th className="border p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50">
                  <td className="border p-3">{record.patientId.fullName}</td>
                  <td className="border p-3">{record.doctorId.username}</td>
                  <td className="border p-3">{record.diagnosis}</td>
                  <td className="border p-3">
                    {new Date(record.visitDate).toLocaleDateString()}
                  </td>
                  <td className="border p-3 space-x-2">
                    <button
                      onClick={() => navigate(`/medical-records/${record._id}`)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/medical-records/edit/${record._id}`)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(record._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordList;
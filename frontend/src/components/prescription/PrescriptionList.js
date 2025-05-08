import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import prescriptionService from '../services/prescriptionService';

const PrescriptionList = () => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const data = await prescriptionService.getAll();
        setPrescriptions(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch prescriptions');
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      try {
        await prescriptionService.delete(id);
        setPrescriptions(prescriptions.filter((prescription) => prescription._id !== id));
      } catch (err) {
        setError('Failed to delete prescription');
      }
    }
  };

  if (loading) return <div className="text-center mt-10 text-light-green-700">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-600 font-semibold">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-light-blue-700">Prescriptions</h2>
        <button
          onClick={() => navigate('/prescriptions/new')}
          className="bg-light-green-500 text-white px-4 py-2 rounded hover:bg-light-green-600 focus:outline-none focus:ring-2 focus:ring-light-green-400 focus:ring-offset-1"
        >
          Add New
        </button>
      </div>
      {prescriptions.length === 0 ? (
        <p className="text-center text-gray-500">No prescriptions found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-light-green-100">
                <th className="border p-3 text-left text-light-blue-700">Medical Record</th>
                <th className="border p-3 text-left text-light-blue-700">Doctor</th>
                <th className="border p-3 text-left text-light-blue-700">Issue Date</th>
                <th className="border p-3 text-left text-light-blue-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((prescription) => (
                <tr key={prescription._id} className="hover:bg-light-blue-100">
                  <td className="border p-3">{prescription.medicalRecordId ? prescription.medicalRecordId.diagnosis : 'N/A'}</td>
                  <td className="border p-3">{prescription.doctorId ? prescription.doctorId.username : 'N/A'}</td>

                  <td className="border p-3">{new Date(prescription.issueDate).toLocaleDateString()}</td>
                  <td className="border p-3 space-x-2">
                    <button
                      onClick={() => navigate(`/prescriptions/${prescription._id}`)}
                      className="bg-light-green-500 text-white px-2 py-1 rounded hover:bg-light-green-600 focus:outline-none focus:ring-2 focus:ring-light-green-400 focus:ring-offset-1"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/prescriptions/edit/${prescription._id}`)}
                      className="bg-light-blue-500 text-white px-2 py-1 rounded hover:bg-light-blue-600 focus:outline-none focus:ring-2 focus:ring-light-blue-400 focus:ring-offset-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(prescription._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
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

export default PrescriptionList;

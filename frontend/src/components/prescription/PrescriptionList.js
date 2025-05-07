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
        console.log('Fetching prescriptions...');
        const data = await prescriptionService.getAll();
        console.log('Fetched prescriptions data:', data);
        setPrescriptions(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching prescriptions:', err.message);
        setError('Failed to fetch prescriptions');
        setLoading(false);
      }
    };
    fetchPrescriptions();
  }, []);

  const handleView = (id) => {
    console.log('Viewing prescription with ID:', id); // Tambahkan log
    navigate(`/prescriptions/${id}`);
  };

  const handleEdit = (id) => {
    console.log('Editing prescription with ID:', id); // Tambahkan log
    navigate(`/prescriptions/edit/${id}`);
  };

  const handleDelete = async (id) => {
    console.log('Deleting prescription with ID:', id); // Tambahkan log
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      try {
        await prescriptionService.delete(id);
        setPrescriptions(prescriptions.filter((prescription) => prescription._id !== id));
      } catch (err) {
        setError('Failed to delete prescription');
      }
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Prescriptions</h2>
      </div>
      {prescriptions.length === 0 ? (
        <p className="text-center text-gray-500">No prescriptions found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Patient</th>
                <th className="border p-3 text-left">Doctor</th>
                <th className="border p-3 text-left">Medications</th>
                <th className="border p-3 text-left">Issue Date</th>
                <th className="border p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((prescription) => (
                <tr key={prescription._id} className="hover:bg-gray-50">
                  <td className="border p-3">
                    {prescription.medicalRecordId?.patientId?.fullName || 'Unknown Patient'}
                  </td>
                  <td className="border p-3">
                    {prescription.doctorId?.username || 'Unknown Doctor'}
                  </td>
                  <td className="border p-3">
                    {prescription.medications
                      ?.map((med) => `${med?.name || 'Unknown'} (${med?.dosage || 'N/A'})`)
                      .join(', ') || 'No medications'}
                  </td>
                  <td className="border p-3">
                    {prescription.issueDate
                      ? new Date(prescription.issueDate).toLocaleDateString()
                      : 'Not set'}
                  </td>
                  <td className="border p-3 space-x-2">
                    <button
                      onClick={() => handleView(prescription._id)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(prescription._id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(prescription._id)}
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

export default PrescriptionList;
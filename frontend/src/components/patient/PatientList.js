import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import patientService from '../services/patientService';

const PatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await patientService.getAll();
        setPatients(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch patients');
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientService.delete(id);
        setPatients(patients.filter((patient) => patient._id !== id));
      } catch (err) {
        setError('Failed to delete patient');
      }
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Patients</h2>
        <button
          onClick={() => navigate('/patients/new')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New
        </button>
      </div>
      {patients.length === 0 ? (
        <p className="text-center text-gray-500">No patients found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Full Name</th>
                <th className="border p-3 text-left">Date of Birth</th>
                <th className="border p-3 text-left">Gender</th>
                <th className="border p-3 text-left">Phone</th>
                <th className="border p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient._id} className="hover:bg-gray-50">
                  <td className="border p-3">{patient.fullName}</td>
                  <td className="border p-3">
                    {new Date(patient.dateOfBirth).toLocaleDateString()}
                  </td>
                  <td className="border p-3">
                    {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
                  </td>
                  <td className="border p-3">{patient.phone}</td>
                  <td className="border p-3 space-x-2">
                    <button
                      onClick={() => navigate(`/patients/${patient._id}`)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      View
                    </button> 
                    <button
                      onClick={() => navigate(`/patients/edit/${patient._id}`)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(patient._id)}
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

export default PatientList;
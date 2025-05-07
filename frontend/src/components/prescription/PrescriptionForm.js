import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import prescriptionService from '../services/prescriptionService';

const PrescriptionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    medicalRecordId: '',
    doctorId: user ? user.id : '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
    issueDate: new Date().toISOString().split('T')[0],
  });
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Mengambil data untuk ID:', id);
        console.log('Pengguna saat ini:', user);
        const [recordData, doctorData] = await Promise.all([
          prescriptionService.getMedicalRecords(),
          prescriptionService.getDoctors(),
        ]);
        setMedicalRecords(recordData || []);
        setDoctors(doctorData || []);

        if (id) {
          const prescription = await prescriptionService.getById(id);
          setFormData({
            medicalRecordId: prescription.medicalRecordId?._id || '',
            doctorId: prescription.doctorId?._id || '',
            medications: prescription.medications || [{ name: '', dosage: '', frequency: '', duration: '' }],
            issueDate: new Date(prescription.issueDate).toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
          });
        }
      } catch (err) {
        console.error('Gagal mengambil data:', err.message);
        setError(`Gagal mengambil data: ${err.message}`);
      }
    };
    fetchData();
  }, [id, user]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name.startsWith('medications.')) {
      const field = name.split('.')[1];
      const updatedMedications = [...formData.medications];
      updatedMedications[index][field] = value;
      setFormData({ ...formData, medications: updatedMedications });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [...formData.medications, { name: '', dosage: '', frequency: '', duration: '' }],
    });
  };

  const removeMedication = (index) => {
    setFormData({
      ...formData,
      medications: formData.medications.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menyimpan resep ini?')) {
      return;
    }
    setLoading(true);
    setError('');
    try {
      console.log('Mengirimkan data formulir:', formData);
      console.log('Token yang digunakan:', localStorage.getItem('token'));
      if (id) {
        console.log('Memperbarui resep dengan ID:', id);
        await prescriptionService.update(id, formData);
      } else {
        console.log('Membuat resep baru');
        await prescriptionService.create(formData);
      }
      navigate('/prescriptions');
    } catch (err) {
      console.error('Gagal menyimpan resep:', err.message, err.response?.data);
      setError(`Gagal menyimpan resep: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6">{id ? 'Edit Resep' : 'Tambah Resep'}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700">Catatan Medis</label>
          <select
            name="medicalRecordId"
            value={formData.medicalRecordId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Pilih Catatan Medis</option>
            {medicalRecords.map((record) => (
              <option key={record._id} value={record._id}>
                {record.patientId?.fullName || 'Tidak Diketahui'} - {record.diagnosis || 'Tidak ada diagnosis'}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Dokter</label>
          <select
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Pilih Dokter</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.username || 'Dokter Tidak Diketahui'}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Obat-obatan</label>
          {formData.medications.map((med, index) => (
            <div key={index} className="border p-4 mb-2 rounded">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700">Nama</label>
                  <input
                    type="text"
                    name={`medications.name`}
                    value={med.name}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Dosis</label>
                  <input
                    type="text"
                    name={`medications.dosage`}
                    value={med.dosage}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Frekuensi</label>
                  <input
                    type="text"
                    name={`medications.frequency`}
                    value={med.frequency}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Durasi</label>
                  <input
                    type="text"
                    name={`medications.duration`}
                    value={med.duration}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
              {formData.medications.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMedication(index)}
                  className="mt-2 text-red-500 hover:text-red-700"
                >
                  Hapus
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addMedication}
            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Tambah Obat
          </button>
        </div>
        <div>
          <label className="block text-gray-700">Tanggal Penerbitan</label>
          <input
            type="date"
            name="issueDate"
            value={formData.issueDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Menyimpan...' : id ? 'Perbarui' : 'Buat'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/prescriptions')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionForm;
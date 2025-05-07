import { Routes, Route } from 'react-router-dom';
import MedicalRecordList from '../medicalRecord/MedicalRecordList';
import MedicalRecordDetail from '../medicalRecord/MedicalRecordDetail';
import MedicalRecordForm from '../medicalRecord/MedicalRecordForm';

const MedicalRecordPage = () => {
  return (
    <div className="flex-1 p-6 ml-0 md:ml-64">
      <Routes>
        <Route path="/" element={<MedicalRecordList />} />
        <Route path="/new" element={<MedicalRecordForm />} />
        <Route path="/edit/:id" element={<MedicalRecordForm />} />
        <Route path="/:id" element={<MedicalRecordDetail />} />
      </Routes>
    </div>
  );
};

export default MedicalRecordPage;
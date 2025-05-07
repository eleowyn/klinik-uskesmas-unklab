import { Routes, Route } from 'react-router-dom';
import PrescriptionList from '../prescription/PrescriptionList';
import PrescriptionDetail from '../prescription/PrescriptionDetail';
import PrescriptionForm from '../prescription/PrescriptionForm';

const PrescriptionPage = () => {
  return (
    <div className="flex-1 p-6 ml-0 md:ml-64">
      <Routes>
        <Route path="/" element={<PrescriptionList />} />
        <Route path="/new" element={<PrescriptionForm />} />
        <Route path="/edit/:id" element={<PrescriptionForm />} />
        <Route path="/:id" element={<PrescriptionDetail />} />
      </Routes>
    </div>
  );
};

export default PrescriptionPage;
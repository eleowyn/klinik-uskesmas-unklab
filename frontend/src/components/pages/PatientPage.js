import { Routes, Route } from 'react-router-dom';
import PatientList from '../patient/PatientList';
import PatientDetail from '../patient/PatientDetail';
import PatientForm from '../patient/PatientForm';

const PatientPage = () => {
  return (
    <div className="flex-1 p-6 ml-0 md:ml-64">
      <Routes>
        <Route path="/" element={<PatientList />} />
        <Route path="/new" element={<PatientForm />} />
        <Route path="/edit/:id" element={<PatientForm />} />
        <Route path="/:id" element={<PatientDetail />} />
      </Routes>
    </div>
  );
};

export default PatientPage;
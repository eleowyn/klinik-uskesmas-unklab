import { Routes, Route } from 'react-router-dom';
import TransactionList from '../transaction/TransactionList';
import TransactionDetail from '../transaction/TransactionDetail';
import TransactionForm from '../transaction/TransactionForm';

const TransactionPage = () => {
  return (
    <div className="flex-1 p-6 ml-0 md:ml-64">
      <Routes>
        <Route path="/" element={<TransactionList />} />
        <Route path="/new" element={<TransactionForm />} />
        <Route path="/edit/:id" element={<TransactionForm />} />
        <Route path="/:id" element={<TransactionDetail />} />
      </Routes>
    </div>
  );
};

export default TransactionPage;

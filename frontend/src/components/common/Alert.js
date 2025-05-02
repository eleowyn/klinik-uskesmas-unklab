import React, { useContext } from 'react';
import { AlertContext } from '../../context/AlertContext';

const Alert = () => {
  const { alert } = useContext(AlertContext);

  if (!alert) return null;

  const alertClasses = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
  };

  return (
    <div className={`fixed top-4 right-4 border-l-4 p-4 rounded shadow-lg ${alertClasses[alert.type]}`} role="alert">
      <p className="font-bold">{alert.type.toUpperCase()}</p>
      <p>{alert.message}</p>
    </div>
  );
};

export default Alert;
import React, { createContext, useContext, useState } from 'react';

export const AlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = (message, type = 'info') => {
    const id = Date.now();
    const newAlert = {
      id,
      message,
      type
    };

    setAlerts(prev => [...prev, newAlert]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      dismissAlert(id);
    }, 5000);

    return id;
  };

  const dismissAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  // Alert component
  const Alert = ({ alert }) => {
    const bgColor = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500'
    }[alert.type];

    return (
      <div
        className={`${bgColor} text-white px-4 py-3 rounded relative mb-2`}
        role="alert"
      >
        <span className="block sm:inline">{alert.message}</span>
        <button
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
          onClick={() => dismissAlert(alert.id)}
        >
          <span className="text-white">&times;</span>
        </button>
      </div>
    );
  };

  // Alerts container
  const AlertContainer = () => {
    if (alerts.length === 0) return null;

    return (
      <div className="fixed top-4 right-4 z-50 w-72">
        {alerts.map(alert => (
          <Alert key={alert.id} alert={alert} />
        ))}
      </div>
    );
  };

  return (
    <AlertContext.Provider value={{ showAlert, dismissAlert }}>
      <AlertContainer />
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

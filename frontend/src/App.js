import React from 'react';
import { BrowserRouter as Router, Routes, Route, useRoutes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import { DoctorProvider } from './context/DoctorContext';
import { StaffProvider } from './context/StaffContext';
import Alert from './components/common/Alert';
import routes from './routes';

const AppRoutes = () => {
  const routeElements = useRoutes(routes);
  return routeElements;
};

const App = () => {
  return (
    <Router>
      <AlertProvider>
        <AuthProvider>
          <DoctorProvider>
            <StaffProvider>
              <div className="min-h-screen bg-gray-50">
                <Alert />
                <AppRoutes />
              </div>
            </StaffProvider>
          </DoctorProvider>
        </AuthProvider>
      </AlertProvider>
    </Router>
  );
};

export default App;

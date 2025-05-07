import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './components/context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Home from './components/pages/Home';
import LoginPage from './components/pages/LoginPage';
import Dashboard from './components/pages/Dashboard';
import PatientPage from './components/pages/PatientPage';
import MedicalRecordPage from './components/pages/MedicalRecordPage';
import PrescriptionPage from './components/pages/PrescriptionPage';
import TransactionPage from './components/pages/TransactionPage';
import NotFound from './components/pages/NotFound';
import { useContext } from 'react';

const AppLayout = ({ children }) => {
  const { user } = useContext(AuthContext);
  return (
    <div className="flex flex-col min-h-screen">
      {user && <Navbar />}
      <div className="flex flex-1 pt-16">
        {user && <Sidebar />}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <AppLayout>
                <LoginPage />
              </AppLayout>
            }
          />
          <Route
            path="/login"
            element={
              <AppLayout>
                <LoginPage />
              </AppLayout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients/*"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PatientPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/medical-records/*"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <MedicalRecordPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/prescriptions/*"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <PrescriptionPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions/*"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <TransactionPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <AppLayout>
                <Home />
              </AppLayout>
            }
          />
          <Route
            path="*"
            element={
              <AppLayout>
                <NotFound />
              </AppLayout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
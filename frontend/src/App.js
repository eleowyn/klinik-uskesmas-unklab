import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import routes from './routes';
import Alert from './components/common/Alert';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import './styles/index.css';

function renderRoutes(routes) {
  return routes.map(({ path, element, children }, index) => {
    if (children) {
      return (
        <Route key={index} path={path} element={element}>
          {renderRoutes(children)}
        </Route>
      );
    }
    return <Route key={index} path={path} element={element} />;
  });
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AlertProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Alert />
              <Routes>
                {renderRoutes(routes)}
              </Routes>
            </main>
            <Footer />
          </div>
        </AlertProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

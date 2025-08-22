// App.tsx
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import { ToastProvider } from './components/ToastManager/ToastManager';
import { HiExclamationTriangle } from 'react-icons/hi2';
import { ToastInitializer } from './components/ToastManager';

// Lazy loading de páginas para mejor performance
const RegisterPage = React.lazy(() => import('./pages/Register/RegisterPage'));
const DashboardPage = React.lazy(() => import('./pages/Dashboard/DashboardPage'));

// Componente de Loading
const LoadingSpinner: React.FC = () => (
  <div className="loading">
    <div className="loading-spinner" />
    <p className="loading-text">Cargando...</p>
  </div>
);

// Componente de Error Boundary
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-wrapper">
          <HiExclamationTriangle className="error-icon" />
          <h1 className="error-title">¡Oops! Algo salió mal</h1>
          <p className="error-message">
            Ha ocurrido un error inesperado. Por favor, recarga la página o intenta nuevamente.
          </p>
          <button
            className="error-button"
            onClick={() => window.location.reload()}
          >
            Recargar Página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper para las páginas con animación
const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="page-wrapper">
    {children}
  </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <ToastInitializer /> 
        <Router>
          <div className="app-layout">
            <Navbar />

            <main className="main-content">
              <div className="container">
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route
                      path="/"
                      element={<Navigate to="/registro" replace />}
                    />
                    <Route
                      path="/registro"
                      element={
                        <PageWrapper>
                          <RegisterPage />
                        </PageWrapper>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <PageWrapper>
                          <DashboardPage />
                        </PageWrapper>
                      }
                    />
                    {/* Ruta 404 */}
                    <Route
                      path="*"
                      element={
                        <div className="error-wrapper">
                          <HiExclamationTriangle className="error-icon" />
                          <h1 className="error-title">Página no encontrada</h1>
                          <p className="error-message">
                            La página que buscas no existe o ha sido movida.
                          </p>
                          <button
                            className="error-button"
                            onClick={() => window.history.back()}
                          >
                            Volver Atrás
                          </button>
                        </div>
                      }
                    />
                  </Routes>
                </Suspense>
              </div>
            </main>
          </div>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
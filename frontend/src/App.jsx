import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import NavBar from './components/NavBar/NavBar';
import DashboardPage from './pages/DashboardPage';
import VisitsPage from './pages/VisitsPage';
import ProfilePage from './pages/ProfilePage';
import TasksPage from './pages/TasksPage';
import AuthPage from './pages/AuthPage';

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <main className={user ? 'pt-14 pb-20' : 'pt-14'}>
        <Routes>
          <Route
            path="/auth/signup"
            element={isLoggedIn ? <Navigate to="/dashboard" /> : <AuthPage />}
          />
          <Route
            path="/auth/login"
            element={isLoggedIn ? <Navigate to="/dashboard" /> : <AuthPage />}
          />

          <Route
            path="/dashboard"
            element={
              isLoggedIn ? <DashboardPage /> : <Navigate to="/auth/login" />
            }
          />
          <Route
            path="/profile"
            element={
              isLoggedIn ? <ProfilePage /> : <Navigate to="/auth/login" />
            }
          />

          <Route
            path="/visits"
            element={
              isLoggedIn && user?.role === 'patient' ? (
                <VisitsPage />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />
          <Route
            path="/tasks"
            element={
              isLoggedIn && user?.role === 'caregiver' ? (
                <TasksPage />
              ) : (
                <Navigate to="/dashboard" />
              )
            }
          />

          <Route
            path="/"
            element={
              <Navigate
                to={isLoggedIn ? '/dashboard' : '/auth/login'}
                replace
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;

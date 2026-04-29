import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

import NavBar from './components/NavBar/NavBar';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import VisitsPage from './pages/VisitsPage';
import TasksPage from './pages/TasksPage';
import ProfilePage from './pages/ProfilePage';

const App = () => {
  const { user, loading } = useContext(AuthContext);

  // Show loading while checking token
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
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
          <Route path="/auth/signup" element={<AuthPage />} />
          <Route path="/auth/login" element={<AuthPage />} />

          <Route
            path="/"
            element={
              <Navigate
                to={isLoggedIn ? '/dashboard' : '/auth/login'}
                replace
              />
            }
          />

          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <DashboardPage />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />
          <Route
            path="/visits"
            element={
              isLoggedIn ? (
                <VisitsPage />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />
          <Route
            path="/tasks"
            element={
              isLoggedIn ? <TasksPage /> : <Navigate to="/auth/login" replace />
            }
          />
          <Route
            path="/profile"
            element={
              isLoggedIn ? (
                <ProfilePage />
              ) : (
                <Navigate to="/auth/login" replace />
              )
            }
          />

          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;

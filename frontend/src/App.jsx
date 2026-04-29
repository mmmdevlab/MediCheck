import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

import NavBar from './components/NavBar/NavBar';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import VisitsPage from './pages/VisitsPage';
import TasksPage from './pages/TasksPage';
import ProfilePage from './pages/ProfilePage';
import SignupForm from './components/auth/SignupForm';
import LoginForm from './components/auth/LoginForm';

const App = () => {
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-[#EEF1F5]">
      <NavBar isLoggedIn={isLoggedIn} />

      <main className={user ? 'pt-14 pb-24' : ''}>
        <Routes>
          {/* Public routes - both use AuthPage */}
          <Route path="/auth/signup" element={<AuthPage />} />
          <Route path="/auth/login" element={<AuthPage />} />

          {/* redirects */}
          <Route
            path="/"
            element={
              <Navigate
                to={isLoggedIn ? '/dashboard' : '/auth/login'}
                replace
              />
            }
          />
          {/* Protected routes */}
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
          <Route path="*" element={<Navigate to="/auth/login" />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;

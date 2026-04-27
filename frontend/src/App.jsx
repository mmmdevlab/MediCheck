import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/auth/signin" />;
};

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/auth/signup" element={<SignupForm />} />
      <Route path="/auth/login" element={<LoginForm />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <div>Dashboard - You're logged in!</div>{' '}
            {/* Temporary placeholder */}
          </ProtectedRoute>
        }
      />

      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/auth/login" />} />
    </Routes>
  );
};

export default App;

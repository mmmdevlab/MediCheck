import { useAuth } from '../context/AuthContext';
import PatientDashboardPage from './PatientDashboardPage';
import CaregiverDashboardPage from './CaregiverDashboardPage';

const DashboardPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-600">Loading user data...</p>
      </div>
    );
  }

  if (user.role === 'caregiver') {
    return <CaregiverDashboardPage />;
  }

  return <PatientDashboardPage />;
};

export default DashboardPage;

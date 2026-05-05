import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import {
  useUpcomingAppointments,
  useCompleteAppointment,
  useUndoComplete,
} from '../hooks/useAppointments';

import { logFeeling } from '../api/medicalLogs';

import FeelingLogger from '../components/logs/FeelingLogger';
import FeelingHistoryCard from '../components/logs/FeelingHistoryCard';
import AppointmentCard from '../components/appointments/AppointmentCard';
import SupportRequestForm from '../components/appointments/SupportRequestForm';
import ActionButton from '../components/UI/ActionButton';

const PatientDashboardPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [lastLog, setLastLog] = useState(null);
  const [lastLoggedFeeling, setLastLoggedFeeling] = useState(null);
  const [isLogging, setIsLogging] = useState(false);
  const [helpAppointmentId, setHelpAppointmentId] = useState(null);
  const [logError, setLogError] = useState('');

  const { data: upcomingAppointments = [], isLoading: isLoadingAppointments } =
    useUpcomingAppointments(3);
  const { mutate: completeAppointment } = useCompleteAppointment();
  const { mutate: undoComplete } = useUndoComplete();

  const handleFeelingLog = async (feeling) => {
    if (isLogging) return;
    setIsLogging(true);
    setLogError('');

    try {
      const feelingScore = typeof feeling === 'number' ? feeling : feeling?.id;

      const normalizedScore = Number(feelingScore);

      if (
        !Number.isInteger(normalizedScore) ||
        normalizedScore < 1 ||
        normalizedScore > 5
      ) {
        throw new Error(`Invalid feelingScore: ${feelingScore}`);
      }

      setLastLoggedFeeling(normalizedScore);

      const data = await logFeeling({
        feelingScore: normalizedScore,
      });

      setLastLog({
        feelingScore: data.log.feelingScore,
        label: feeling.label,
        createdAt: data.log.createdAt,
      });

      setTimeout(() => setLastLoggedFeeling(null), 800);
    } catch (error) {
      setLogError('Failed to save feeling. Please try again.');
    } finally {
      setIsLogging(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#EEF1F5] min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <header>
          <p className="text-md text-black">
            Welcome back, <span className="font-bold">{user.fullName}</span>
          </p>
        </header>

        <section className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
          <FeelingLogger
            onFeelingLog={handleFeelingLog}
            lastLoggedFeeling={lastLoggedFeeling}
          />
          {logError && (
            <p className="text-sm text-red-600 font-medium mt-1">{logError}</p>
          )}
          <FeelingHistoryCard lastLog={lastLog} />
        </section>

        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-black">
              Upcoming Appointments
            </h3>
            <button
              onClick={() => navigate('/visits')}
              className="text-primary hover:opacity-80 font-semibold text-sm uppercase tracking-wider"
            >
              View All
            </button>
          </div>

          {isLoadingAppointments ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-gray-100">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : upcomingAppointments.length === 0 ? (
            <div className="items-center justify-between bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
              <p className="text-gray-500 mb-4">
                No upcoming appointments scheduled.
              </p>
              <ActionButton
                variant="action"
                onClick={() => navigate('/visits')}
                className="mx-auto"
              >
                Schedule Visit
              </ActionButton>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((apt) => (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  variant="dashboard"
                  showActions={true}
                  onReschedule={() => navigate('/visits')}
                  onMarkDone={() => completeAppointment(apt.id)}
                  onRequestHelp={(id) => setHelpAppointmentId(id)}
                  onUndoComplete={() => undoComplete(apt.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {helpAppointmentId && (
        <SupportRequestForm
          appointmentId={helpAppointmentId}
          appointmentTitle={
            upcomingAppointments.find((a) => a.id === helpAppointmentId)?.title
          }
          onClose={() => setHelpAppointmentId(null)}
        />
      )}
    </div>
  );
};

export default PatientDashboardPage;

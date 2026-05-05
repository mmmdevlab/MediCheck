import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  useAssignedSupportRequests,
  useCompleteSupportRequest,
} from '../hooks/useSupportRequests';
import {
  useAllPatientAppointments,
  usePatientHealthAlerts,
} from '../hooks/useCaregivers';

import { AlertList } from '../components/logs/HealthAlertCard';
import SupportRequestCard from '../components/caregiver/SupportRequestCard';
import AppointmentCardCaregiver from '../components/appointments/AppointmentCardCaregiver';
import ConfirmDialog from '../components/UI/ConfirmDialog';

const LoadingCard = () => (
  <div className="bg-white rounded-3xl border border-gray-100 p-12 flex justify-center">
    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
  </div>
);

const EmptyCard = ({ message }) => (
  <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center">
    <p className="text-gray-400 text-sm">{message}</p>
  </div>
);

const CaregiverDashboardPage = () => {
  const { user } = useAuth();
  const [dialog, setDialog] = useState({ open: false });

  const { data: acceptedRequests = [], isLoading: requestsLoading } =
    useAssignedSupportRequests('accepted');
  const { data: patientAppointments = [], isLoading: appointmentsLoading } =
    useAllPatientAppointments();
  const { data: healthAlerts = [], isLoading: alertsLoading } =
    usePatientHealthAlerts();

  const { mutate: complete } = useCompleteSupportRequest();

  const closeDialog = () => setDialog({ open: false });

  const handleComplete = (id) => {
    setDialog({
      open: true,
      title: 'Complete Task',
      message: 'Mark this task as complete?',
      onConfirm: () => complete(id),
      confirmLabel: 'Complete',
    });
  };

  const handleCheckIn = (_patientId, patientName) => {
    setDialog({
      open: false,
      title: 'Coming Soon',
      message: `Messaging feature coming soon — reach out to ${patientName} directly.`,
    });
  };

  return (
    <div className="bg-[#EEF1F5] min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <p className="text-md text-black">
            Welcome back, <span className="font-bold">{user?.fullName}</span>
          </p>
        </div>
        <div>
          {(alertsLoading || healthAlerts.length > 0) && (
            <section>
              {alertsLoading ? (
                <LoadingCard />
              ) : (
                <AlertList alerts={healthAlerts} onCheckIn={handleCheckIn} />
              )}
            </section>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-[10] font-extrabold text-gray-600 uppercase tracking-widest mb-1">
            Up Coming Tasks
          </p>
          <h1 className="text-3xl font-bold text-black">My Accepted Tasks</h1>
          {requestsLoading ? (
            <LoadingCard />
          ) : (
            <SupportRequestCard
              mode="accepted"
              requests={acceptedRequests}
              onComplete={handleComplete}
            />
          )}
        </div>

        <div className="space-y-4">
          <p className="text-[10] font-extrabold text-gray-600 uppercase tracking-widest mb-1">
            Upcoming Appointments
          </p>
          <h1 className="text-3xl font-bold text-black">
            Check in with your patients
          </h1>
          {appointmentsLoading ? (
            <LoadingCard />
          ) : patientAppointments.length === 0 ? (
            <EmptyCard message="No upcoming appointments from your patients." />
          ) : (
            <div className="grid grid-cols-2 gap-4 py-2">
              {patientAppointments.map((apt) => (
                <AppointmentCardCaregiver
                  key={`${apt.patientId}-${apt.id}`}
                  appointment={apt}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={dialog.open}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        onClose={closeDialog}
        confirmLabel={dialog.confirmLabel}
        danger={dialog.danger}
      />
    </div>
  );
};

export default CaregiverDashboardPage;

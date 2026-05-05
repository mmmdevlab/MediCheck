import { useState, useMemo } from 'react';
import { Calendar, Plus, ListEnd } from 'lucide-react';

import {
  useAppointments,
  useCreateAppointment,
  useUpdateAppointment,
  useDeleteAppointment,
  useCompleteAppointment,
  useUndoComplete,
} from '../hooks/useAppointments';

import AppointmentForm from '../components/appointments/AppointmentForm';
import AppointmentFilterBar from '../components/appointments/AppointmentFilterBar';
import AppointmentCard from '../components/appointments/AppointmentCard';
import SupportRequestForm from '../components/appointments/SupportRequestForm';
import CalendarView from '../components/appointments/CalendarView';
import PillToggle from '../components/UI/PillToggle';
import ConfirmDialog from '../components/UI/ConfirmDialog';
import ActiveButton from '../components/UI/ActionButton';

const VisitsPage = () => {
  const { data: appointments = [], isLoading } = useAppointments();
  const { mutate: createAppointment } = useCreateAppointment();
  const { mutate: updateAppointment } = useUpdateAppointment();
  const { mutate: deleteAppointment } = useDeleteAppointment();
  const { mutate: completeAppointment } = useCompleteAppointment();
  const { mutate: undoComplete } = useUndoComplete();

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [helpAppointmentId, setHelpAppointmentId] = useState(null);
  const [dialog, setDialog] = useState({ open: false });

  const closeDialog = () => setDialog({ open: false });
  const showError = (message) =>
    setDialog({ open: true, title: 'Error', message });

  const filteredAppointments = useMemo(() => {
    const normalizedFilter = String(activeFilter || 'ALL').toLowerCase();
    const now = new Date();
    const old = new Date();

    if (normalizedFilter === 'all') return appointments;

    if (normalizedFilter === 'scheduled') {
      return appointments.filter(
        (apt) =>
          new Date(apt.appointmentDate) >= now &&
          String(apt.status || '').toLowerCase() === 'scheduled'
      );
    }
    if (normalizedFilter === 'missed') {
      return appointments.filter(
        (apt) =>
          old.setDate(old.getDate() - 1) > new Date(apt.appointmentDate) &&
          String(apt.status || '').toLowerCase() === 'scheduled'
      );
    }

    return appointments.filter(
      (apt) => String(apt.status || '').toLowerCase() === normalizedFilter
    );
  }, [appointments, activeFilter]);

  const handleCreateNew = () => {
    setEditingAppointment(null);
    setIsFormOpen(true);
  };

  const handleEdit = (id) => {
    const appointment = appointments.find((apt) => apt.id === id);
    setEditingAppointment(appointment);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAppointment(null);
  };

  const handleFormSubmit = (formData) => {
    if (editingAppointment) {
      updateAppointment(
        { id: editingAppointment.id, data: formData },
        {
          onSuccess: () => handleCloseForm(),
          onError: () =>
            showError('Failed to save appointment. Please try again.'),
        }
      );
    } else {
      createAppointment(formData, {
        onSuccess: () => handleCloseForm(),
        onError: () =>
          showError('Failed to save appointment. Please try again.'),
      });
    }
  };

  const handleMarkDone = (id) => {
    completeAppointment(id, {
      onError: () =>
        showError('Failed to update appointment. Please try again.'),
    });
  };

  const handleUndoComplete = (id) => {
    setDialog({
      open: true,
      title: 'Revert Appointment',
      message: 'Revert this appointment back to scheduled?',
      onConfirm: () =>
        undoComplete(id, {
          onError: () => showError('Failed to undo completion.'),
        }),
      confirmLabel: 'Revert',
    });
  };

  const handleCancelAppointment = (id) => {
    setDialog({
      open: true,
      title: 'Cancel Appointment',
      message: 'Cancel this appointment?',
      onConfirm: () =>
        updateAppointment(
          { id, data: { status: 'cancelled' } },
          {
            onError: () =>
              showError('Failed to cancel appointment. Please try again.'),
          }
        ),
      confirmLabel: 'Cancel Appointment',
      danger: true,
    });
  };

  const handleReschedule = (id) => {
    handleEdit(id);
  };

  const handleDelete = (id) => {
    setDialog({
      open: true,
      title: 'Delete Appointment',
      message:
        'Are you sure you want to delete this appointment? This action cannot be undone.',
      onConfirm: () =>
        deleteAppointment(id, {
          onError: () =>
            showError('Failed to delete appointment. Please try again.'),
        }),
      confirmLabel: 'Delete',
      danger: true,
    });
  };

  const handleRequestHelp = (id) => {
    setHelpAppointmentId(id);
  };

  const handleDateClick = (date) => {
    setEditingAppointment({
      appointmentDate: date.toISOString().split('T')[0],
    });
    setIsFormOpen(true);
  };

  return (
    <div className="bg-[#EEF1F5] min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10] font-extrabold text-gray-600 uppercase tracking-widest mb-1">
                Your Health
              </p>
              <h1 className="text-3xl font-bold text-black">My Appointments</h1>
            </div>
            <div className="flex gap-2">
              <PillToggle
                options={[
                  {
                    value: 'list',
                    label: 'List',
                    icon: <ListEnd className="w-4 h-4" />,
                  },
                  {
                    value: 'calendar',
                    label: 'Calendar',
                    icon: <Calendar className="w-4 h-4" />,
                  },
                ]}
                active={viewMode}
                onSelect={setViewMode}
                variant="compact"
                className="bg-gray-100 p-1 rounded-full"
              />

              <ActiveButton
                variant="primary"
                onClick={handleCreateNew}
                className="mx-auto"
              >
                <Plus className="w-5 h-5" />
                New Appointment
              </ActiveButton>
            </div>
          </div>
        </div>

        {viewMode === 'list' && (
          <AppointmentFilterBar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        )}

        {viewMode === 'calendar' && (
          <CalendarView
            appointments={appointments}
            onDateClick={handleDateClick}
            onAppointmentClick={() => setViewMode('list')}
          />
        )}

        {viewMode === 'list' && (
          <>
            {isLoading && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">Loading appointments...</p>
              </div>
            )}

            {!isLoading && filteredAppointments.length === 0 && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
                <p className="text-gray-500 mb-4">
                  {activeFilter === 'ALL'
                    ? 'No appointments yet'
                    : `No ${activeFilter.toLowerCase()} appointments`}
                </p>
                <ActiveButton
                  variant="primary"
                  onClick={handleCreateNew}
                  className="mx-auto"
                >
                  Create Your First Appointment
                </ActiveButton>
              </div>
            )}

            {!isLoading && filteredAppointments.length > 0 && (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    variant="extended"
                    showActions={true}
                    onReschedule={handleReschedule}
                    onMarkDone={handleMarkDone}
                    onRequestHelp={handleRequestHelp}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onCancelAppointment={handleCancelAppointment}
                    onUndoComplete={handleUndoComplete}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {isFormOpen && (
        <AppointmentForm
          appointment={editingAppointment}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseForm}
        />
      )}

      {helpAppointmentId && (
        <SupportRequestForm
          appointmentId={helpAppointmentId}
          appointmentTitle={
            appointments.find((a) => a.id === helpAppointmentId)?.title
          }
          onClose={() => setHelpAppointmentId(null)}
        />
      )}

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

export default VisitsPage;

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import ConfirmDialog from '../components/UI/ConfirmDialog';

import { useAuth } from '../context/AuthContext';
import { useMedicalLogs } from '../hooks/useMedicalLogs';
import {
  caregiverKeys,
  useMyCaregivers,
  useMyPatients,
  useRevokeCaregiverAccess,
  useRevokePatientAccess,
  useGrantCaregiverAccess,
} from '../hooks/useCaregivers';

import { ROLES } from '../utils/constants';
import FeelingHistory from '../components/profile/FeelingHistory';
import HelpingStats from '../components/profile/HelpingStats';
import AddCaregiverForm from '../components/profile/AddCaregiverForm';
import ConnectionCard from '../components/profile/ConnectionCard';
import ActionButton from '../components/UI/ActionButton';
import ProfileCard from '../components/profile/ProfileCard';

const ProfileHeader = ({ user }) => (
  <div className="bg-white rounded-3xl p-6 shadow-sm">
    <div className="flex items-center gap-4">
      <div className="w-15 h-15 rounded-full bg-primary/10 flex items-center justify-center text-primary uppercase tracking-widest font-bold text-2xl">
        {user.fullName?.slice(0, 2).toUpperCase()}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-black tracking-wide">
            {user.fullName}
          </h1>
          <span className="px-4 py-1 bg-blue-500 text-[10px] font-bold uppercase tracking-widest text-white rounded-full">
            {user.role}
          </span>
        </div>
        <p className="text-gray-500 text-md font-medium">{user.email}</p>
      </div>
    </div>
  </div>
);

const ProfilePage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showAddCaregiverForm, setShowAddCaregiverForm] = useState(false);

  const { data: logs = [], isLoading: logsLoading } = useMedicalLogs(7);
  const { data: caregivers = [], isLoading: caregiversLoading } =
    useMyCaregivers();
  const { data: patients = [], isLoading: patientsLoading } = useMyPatients();

  const revokeCaregiver = useRevokeCaregiverAccess();
  const revokePatient = useRevokePatientAccess();
  const addCaregiver = useGrantCaregiverAccess();
  const [dialog, setDialog] = useState({ open: false });

  const isLoading = logsLoading || caregiversLoading || patientsLoading;
  const closeDialog = () => setDialog({ open: false });

  const handleRemoveCaregiver = (connection) => {
    setDialog({
      open: true,
      title: 'Remove Caregiver',
      message: `Stop caregiver access for ${connection.name}?`,
      onConfirm: () => revokeCaregiver.mutate(connection.assignmentId),
      confirmLabel: 'Remove',
      danger: true,
    });
  };

  const handleRemovePatient = (connection) => {
    setDialog({
      open: true,
      title: 'Stop Monitoring',
      message: `Stop monitoring patient ${connection.name}?`,
      onConfirm: () => revokePatient.mutate(connection.assignmentId),
      confirmLabel: 'Stop Monitoring',
      danger: true,
    });
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="bg-[#EEF1F5] min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-4">
        <div>
          <p className="text-[10] font-extrabold text-gray-600 uppercase tracking-widest mb-1">
            your profile
          </p>
        </div>
        <ProfileHeader user={user} />

        {user.role === ROLES.PATIENT && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-1 items-start">
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-widest">
                  Your Caregivers
                </h3>

                <ActionButton
                  variant="primary"
                  onClick={() => setShowAddCaregiverForm(true)}
                >
                  <Plus size={18} strokeWidth={3} />
                  ADD
                </ActionButton>
              </div>

              <div className="flex flex-col gap-4 py-2 w-full">
                {caregivers.length > 0 ? (
                  caregivers.map((cg) => (
                    <ConnectionCard
                      key={cg.assignmentId}
                      connection={{
                        ...cg,
                        fullName: cg.name,
                        relationshipType: cg.relationshipType || 'caregiver',
                      }}
                      userRole="patient"
                      onRemove={handleRemoveCaregiver}
                      onSuccess={() =>
                        queryClient.invalidateQueries({
                          queryKey: caregiverKeys.myCaregivers,
                        })
                      }
                    />
                  ))
                ) : (
                  <p className="flex flex-col w-full justify-center item-wrap text-center px-6 py-4 text-gray-600 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    No caregivers yet.
                    <br /> Add new caregiver or Invite someone to help track
                    your medical journey.
                  </p>
                )}
              </div>
            </section>
            <FeelingHistory logs={logs} />
          </div>
        )}

        {user.role === ROLES.CAREGIVER && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wider">
                  Your Patients
                </h3>
              </div>

              <div className="flex flex-col gap-4 w-full">
                {patients.length > 0 ? (
                  patients.map((p) => (
                    <ConnectionCard
                      key={p.assignmentId}
                      connection={{
                        ...p,
                        fullName: p.name,
                        relationshipType: p.relationshipType || 'patient',
                      }}
                      userRole="caregiver"
                      onRemove={handleRemovePatient}
                      onSuccess={() =>
                        queryClient.invalidateQueries({
                          queryKey: caregiverKeys.patients,
                        })
                      }
                    />
                  ))
                ) : (
                  <p className="flex flex-col items-center justify-center w-full text-center py-12 text-gray-600 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <span>You aren't monitoring any patients yet.</span>
                    <span className="text-xs mt-1 not-italic">
                      Ask your patients to add you as a caregiver to start
                      helping them track their recovery.
                    </span>
                  </p>
                )}
              </div>
            </section>
            <section className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
              <HelpingStats />
            </section>
          </div>
        )}
      </div>

      {showAddCaregiverForm && (
        <AddCaregiverForm
          onCancel={() => setShowAddCaregiverForm(false)}
          userName={user.fullName}
          onSubmit={async (formData) => {
            await addCaregiver.mutateAsync(formData.email);
            setShowAddCaregiverForm(false);
          }}
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

export default ProfilePage;

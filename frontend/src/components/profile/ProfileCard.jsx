import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Trash2 } from 'lucide-react';
import { ROLES } from '../../utils/constants';
import ConfirmDialog from '../UI/ConfirmDialog';
import { deleteAccount } from '../../api/users';
import ActionButton from '../UI/ActionButton';

const ProfileCard = ({ user, patientCount }) => {
  const { signout } = useAuth();
  const [dialog, setDialog] = useState({ open: false });
  const [isDeleting, setIsDeleting] = useState(false);

  const closeDialog = () => setDialog({ open: false });

  const handleDeleteAccount = () => {
    setDialog({
      open: true,
      title: 'Delete My Account',
      message:
        'Are you sure you want to delete your account? This will permanently delete all your appointments, medical logs, and caregiver connections. This action cannot be undone.',
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          await deleteAccount();
          signout();
        } catch (error) {
          setDialog({
            open: true,
            title: 'Error',
            message: 'Failed to delete account. Please try again.',
          });
        } finally {
          setIsDeleting(false);
        }
      },
      confirmLabel: 'Delete Account',
      danger: true,
    });
  };

  const getMemberSinceYear = (createdAt) => {
    if (!createdAt) return null;
    const date = new Date(createdAt);
    return date.getFullYear();
  };

  return (
    <div className="flex-1 bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
      <div className="px-6 py-6 border-b border-gray-100">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
          MY PROFILE
        </p>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl flex-shrink-0 border-2 border-blue-200">
            {user.fullName?.slice(0, 2).toUpperCase() || '??'}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-900 truncate mb-1">
              {user.fullName || 'User'}
            </h1>
            <p className="text-sm text-gray-500">
              {user.role === ROLES.PATIENT ? 'Patient' : 'Caregiver'}
              {user.createdAt && (
                <> • Member since {getMemberSinceYear(user.createdAt)}</>
              )}
              {user.role === ROLES.CAREGIVER && patientCount !== undefined && (
                <>
                  {' '}
                  • {patientCount} {patientCount === 1 ? 'Patient' : 'Patients'}
                </>
              )}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
              FULL NAME
            </label>
            <div className="px-6 py-3 bg-gray-50 rounded-full">
              <p className="text-gray-700">{user.fullName || 'Not provided'}</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
              EMAIL
            </label>
            <div className="px-6 py-3 bg-gray-50 rounded-full">
              <p className="text-gray-700 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </div>

      {user.role === ROLES.CAREGIVER && (
        <div className="px-6 py-4 bg-gray-50 flex justify-center gap-3">
          <ActionButton
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-full text-sm font-bold uppercase tracking-wide transition-colors"
          >
            <Trash2 size={16} />
            {isDeleting ? 'Deleting…' : 'Delete Account'}
          </ActionButton>
        </div>
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

export default ProfileCard;

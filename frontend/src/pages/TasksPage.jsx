import { useState, useMemo } from 'react';
import {
  useAssignedSupportRequests,
  useRespondToSupportRequest,
  useCompleteSupportRequest,
} from '../hooks/useSupportRequests';
import SupportRequestCard from '../components/caregiver/SupportRequestCard';
import ConfirmDialog from '../components/UI/ConfirmDialog';

const TasksPage = () => {
  const { data: requests = [], isLoading } = useAssignedSupportRequests();
  const { mutate: respond } = useRespondToSupportRequest();
  const { mutate: complete } = useCompleteSupportRequest();
  const [dialog, setDialog] = useState({ open: false });
  const [historyFilter, setHistoryFilter] = useState('completed');

  const closeDialog = () => setDialog({ open: false });

  const filteredRequests = useMemo(() => {
    const normalizedFilter = String(historyFilter || 'completed').toLowerCase();

    const historyRequests = requests.filter((request) => {
      const status = String(request.status || '').toLowerCase();
      return status === 'completed' || status === 'declined';
    });

    return historyRequests
      .filter(
        (request) =>
          String(request.status || '').toLowerCase() === normalizedFilter
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [requests, historyFilter]);

  const pendingRequests = useMemo(() => {
    return requests
      .filter((r) => r.status === 'pending')
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }, [requests]);

  const handleAccept = (id) => respond({ requestId: id, status: 'accepted' });

  const handleDecline = (id) => {
    setDialog({
      open: true,
      title: 'Decline Request',
      message: 'Decline this support request?',
      onConfirm: () => respond({ requestId: id, status: 'declined' }),
      confirmLabel: 'Decline',
      danger: true,
    });
  };

  const handleComplete = (id) => {
    setDialog({
      open: true,
      title: 'Complete Task',
      message: 'Mark this task as complete?',
      onConfirm: () => complete(id),
      confirmLabel: 'Complete',
    });
  };

  const handleUndo = (id) => {
    setDialog({
      open: true,
      title: 'Revert Request',
      message: 'Revert this request back to pending?',
      onConfirm: () => respond({ requestId: id, status: 'pending' }),
      confirmLabel: 'Revert',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="bg-[#EEF1F5] min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="space-y-4">
          <div>
            <p className="text-[10] font-extrabold text-gray-600 uppercase tracking-widest mb-1">
              Requests
            </p>
            <h1 className="text-3xl font-bold text-black">Support Requests</h1>
          </div>
          {!isLoading && pendingRequests.length === 0 ? (
            <div className="space-y-2">No pending requests</div>
          ) : (
            <SupportRequestCard
              mode="pending"
              requests={pendingRequests}
              onAccept={handleAccept}
              onDecline={handleDecline}
              onUndo={handleUndo}
            />
          )}
        </div>

        {!isLoading && filteredRequests.length > 0 && (
          <div className="space-y-4">
            <div>
              <p className="text-[10] font-extrabold text-gray-600 uppercase tracking-widest mb-1">
                History
              </p>
              <h1 className="text-3xl font-bold text-black">Task History</h1>
              <div className="mt-4 flex flex-wrap gap-2">
                {['completed', 'declined'].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setHistoryFilter(filter)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
                      historyFilter === filter
                        ? 'bg-primary text-white'
                        : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            <SupportRequestCard
              mode="history"
              requests={filteredRequests}
              onComplete={handleComplete}
              onUndo={handleUndo}
            />
          </div>
        )}
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

export default TasksPage;

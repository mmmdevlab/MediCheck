import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { REQUEST_TYPE_CONFIG } from '../../utils/constants';
import { useCreateSupportRequest } from '../../hooks/useSupportRequests';
import { useMyCaregivers } from '../../hooks/useCaregivers';
import ActionButton from '../UI/ActionButton';

const SupportRequestForm = ({ appointmentId, appointmentTitle, onClose }) => {
  const [requestType, setRequestType] = useState('');
  const [message, setMessage] = useState('');
  const [caregiverId, setCaregiverId] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: caregivers = [], isLoading: caregiversLoading } =
    useMyCaregivers();
  const { mutateAsync: createRequest, isPending } = useCreateSupportRequest();

  const pendingCaregivers = caregivers.filter((c) => c.status !== 'inactive');

  useEffect(() => {
    if (pendingCaregivers.length === 1) {
      const id = String(pendingCaregivers[0].caregiverId);
      const t = setTimeout(() => setCaregiverId(id), 0);
      return () => clearTimeout(t);
    }
  }, [pendingCaregivers]);

  const handleSubmit = async () => {
    if (!requestType || !caregiverId || isPending) return;

    setError(null);

    try {
      await createRequest({
        appointmentId: appointmentId || null,
        caregiverId: Number(caregiverId),
        requestType,
        message: (message ?? '').trim() || null,
      });
      onClose();
    } catch (err) {
      setError('Failed to send request. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Request Help</h2>
            {appointmentTitle && (
              <p className="text-md font-medium text-gray-500 mt-0.5">
                For{' '}
                <span className="text-blue-500 font-bold tracking-wide">
                  "{appointmentTitle}"
                </span>{' '}
                visit
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} className="text-gray-800" />
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-2xl bg-red-50 border border-red-200">
            <p className="text-sm font-semibold text-red-700">{error}</p>
          </div>
        )}

        {caregiversLoading ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : pendingCaregivers.length === 0 ? (
          <div className="px-10 py-10 text-center">
            <p className="text-bold font-bold text-xl mb-1">
              No caregivers connected.
            </p>
            <p className="text-gray-500 text-md">
              Go to your profile to add a caregiver first.
            </p>
          </div>
        ) : (
          <>
            {pendingCaregivers.length > 1 && (
              <div className="mb-5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Send request to
                </p>
                <div className="flex flex-wrap gap-2">
                  {pendingCaregivers.map((cg) => (
                    <button
                      key={cg.caregiverId}
                      onClick={() => setCaregiverId(String(cg.caregiverId))}
                      className={`px-4 py-2 rounded-2xl text-sm font-bold border-2 transition-all
                        ${
                          String(caregiverId) === String(cg.caregiverId)
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                    >
                      {cg.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                What do you need?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(REQUEST_TYPE_CONFIG).map(([type, config]) => {
                  const Icon = config.icon;
                  const selected = requestType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setRequestType(type)}
                      className={`p-3 rounded-2xl border-2 flex items-center gap-2 text-sm font-bold transition-all
                        ${
                          selected
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                    >
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${config.color}`}
                      >
                        <Icon size={16} />
                      </span>
                      {config.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a note for your caregiver (optional)"
              className="w-full p-3 rounded-2xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 mb-5"
              rows={3}
            />

            <div className="flex gap-2 justify-end pt-2">
              <div>
                <ActionButton variant="secondary" onClick={onClose}>
                  Cancel
                </ActionButton>
              </div>
              <div>
                <ActionButton
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={!requestType || !caregiverId || isPending}
                >
                  {isPending ? 'Sending…' : 'Send Request'}
                </ActionButton>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SupportRequestForm;

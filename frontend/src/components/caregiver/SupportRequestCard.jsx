import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ActionButton from '../UI/ActionButton';
import {
  REQUEST_TYPE_CONFIG,
  REQUEST_STATUS_BADGE,
  SUPPORT_REQUEST_MODE_CONFIG,
} from '../../utils/constants';
import { formatDate } from '../../utils/dateFormats';

const RequestItem = ({
  request,
  mode,
  onAccept,
  onDecline,
  onComplete,
  onUndo,
  loadingId,
  error,
}) => {
  const { id, status, requestType, patient, appointment, message } = request;
  const isLoading = loadingId === id;

  const config = REQUEST_TYPE_CONFIG[requestType] || REQUEST_TYPE_CONFIG.other;
  const Icon = config.icon;

  const handleAction = async (action) => {
    try {
      if (action === 'accept') await onAccept(id);
      if (action === 'decline') await onDecline(id);
      if (action === 'complete') await onComplete(id);
      if (action === 'undo') await onUndo(id);
    } catch (err) {
      // error handled by parent via returned promise
    }
  };

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6">
      {error === id && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-2">
          <p className="text-xs font-semibold text-red-700">
            Failed to update request. Please try again.
          </p>
        </div>
      )}

      <div className="mb-6 flex items-start gap-4">
        <div
          className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl ${config.color}`}
        >
          <Icon className="h-8 w-8" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="text-xl font-bold text-gray-900 md:text-2xl">
              {config.label} Request
            </span>
            <span className="rounded-full bg-black px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              {mode === 'accepted' || mode === 'history' ? 'For' : 'From'}{' '}
              {patient?.fullName || 'Unknown'}
            </span>
            <span
              className={`rounded-full px-4 py-1 text-[10px] uppercase tracking-wider font-bold capitalize ${
                REQUEST_STATUS_BADGE[status] || 'bg-gray-100 text-gray-600'
              }`}
            >
              {status}
            </span>
          </div>

          {appointment && (
            <p className="mb-1 text-sm font-semibold text-gray-600">
              {appointment.title} {formatDate(appointment.appointmentDate)}
            </p>
          )}

          {message && (
            <p className="text-sm italic text-gray-500">"{message}"</p>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        {mode === 'pending' && (
          <>
            <ActionButton
              variant="secondary"
              className="flex-1"
              onClick={() => handleAction('decline')}
              disabled={isLoading}
            >
              {isLoading ? 'Processing…' : 'Decline'}
            </ActionButton>
            <ActionButton
              variant="primary"
              className="flex-1"
              onClick={() => handleAction('accept')}
              disabled={isLoading}
            >
              {isLoading ? 'Processing…' : 'Accept'}
            </ActionButton>
          </>
        )}

        {mode === 'accepted' && (
          <ActionButton
            variant="primary"
            className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-40"
            onClick={() => handleAction('complete')}
            disabled={isLoading}
          >
            {isLoading ? 'Marking…' : 'Mark Done'}
          </ActionButton>
        )}

        {mode === 'history' && (
          <>
            {(status === 'completed' || status === 'declined') && (
              <ActionButton
                variant="secondary"
                className="flex-1"
                onClick={() => handleAction('undo')}
                disabled={isLoading}
              >
                {isLoading ? 'Undoing…' : 'Undo'}
              </ActionButton>
            )}

            {status === 'accepted' && (
              <ActionButton
                variant="primary"
                className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-40"
                onClick={() => handleAction('complete')}
                disabled={isLoading}
              >
                {isLoading ? 'Marking…' : 'Mark Done'}
              </ActionButton>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const SupportRequestCard = ({
  requests = [],
  mode = 'pending',
  onAccept,
  onDecline,
  onComplete,
  onUndo,
}) => {
  const [loadingId, setLoadingId] = useState(null);
  const [errorId, setErrorId] = useState(null);

  const hasRequests = requests.length > 0;
  const modeConfig =
    SUPPORT_REQUEST_MODE_CONFIG[mode] || SUPPORT_REQUEST_MODE_CONFIG.pending;

  const handleWithLoading = async (id, callback) => {
    setLoadingId(id);
    setErrorId(null);
    try {
      await callback();
    } catch (err) {
      setErrorId(id);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3
          className={`text-sm font-bold uppercase tracking-wider ${modeConfig.badgeColor}`}
        >
          {hasRequests ? modeConfig.badge(requests.length) : ''}
        </h3>
      </div>

      {!hasRequests ? (
        <p className="py-8 text-center text-sm text-gray-500">
          {modeConfig.emptyMessage}
        </p>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <RequestItem
              key={request.id}
              request={request}
              mode={mode}
              onAccept={(id) => handleWithLoading(id, () => onAccept(id))}
              onDecline={(id) => handleWithLoading(id, () => onDecline(id))}
              onComplete={(id) => handleWithLoading(id, () => onComplete(id))}
              onUndo={(id) => handleWithLoading(id, () => onUndo(id))}
              loadingId={loadingId}
              error={errorId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

RequestItem.propTypes = {
  request: PropTypes.shape({
    id: PropTypes.number.isRequired,
    requestType: PropTypes.string.isRequired,
    patient: PropTypes.object,
    appointment: PropTypes.object,
    message: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  mode: PropTypes.oneOf(['pending', 'accepted', 'history']).isRequired,
  onAccept: PropTypes.func,
  onDecline: PropTypes.func,
  onComplete: PropTypes.func,
  onUndo: PropTypes.func,
  loadingId: PropTypes.number,
  error: PropTypes.number,
};

SupportRequestCard.propTypes = {
  requests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      requestType: PropTypes.string.isRequired,
      patient: PropTypes.object,
      appointment: PropTypes.object,
      message: PropTypes.string,
      status: PropTypes.string,
    })
  ),
  mode: PropTypes.oneOf(['pending', 'accepted', 'history']),
  onAccept: PropTypes.func,
  onDecline: PropTypes.func,
  onComplete: PropTypes.func,
  onUndo: PropTypes.func,
};

export default SupportRequestCard;

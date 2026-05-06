import React from 'react';
import { REQUEST_STATUS, REQUEST_TYPE_CONFIG } from '../../utils/constants';
import { formatDate } from '../../utils/dateFormats';

const SupportRequestBox = ({ supportRequest }) => {
  if (!supportRequest) {
    return (
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-600">
          support request
        </div>
        <p className="text-sm text-gray-500">No support requested yet</p>
      </div>
    );
  }

  const { status, requestType, message, caregiver, createdAt } = supportRequest;

  const isPending = status === REQUEST_STATUS.PENDING;
  const isAccepted = status === REQUEST_STATUS.ACCEPTED;
  const isDeclined = status === REQUEST_STATUS.DECLINED;

  const requestConfig = REQUEST_TYPE_CONFIG[requestType] || {};
  const RequestIcon = requestConfig.icon;
  const requestLabel = requestConfig.label || requestType || 'Request';

  return (
    <div>
      <div className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-600">
        support request
      </div>

      <div
        className={[
          'rounded-3xl p-4',
          isPending ? 'border border-yellow-200 bg-yellow-50' : '',
          isAccepted ? 'border border-green-200 bg-green-50' : '',
          isDeclined ? 'border border-red-200 bg-red-50' : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div
          className={[
            'mb-2 flex items-center gap-2 text-sm font-bold',
            isPending ? 'text-yellow-900' : '',
            isAccepted ? 'text-green-900' : '',
            isDeclined ? 'text-red-900' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {RequestIcon && <RequestIcon className="h-4 w-4" />}
          <span>{requestLabel}</span>
          <span>·</span>
          <span>
            {isPending ? 'Pending' : isAccepted ? 'Confirmed' : 'Declined'}
          </span>
        </div>

        {message && <p className="mb-2 text-sm text-gray-600">"{message}"</p>}

        {isAccepted && caregiver && (
          <p className="text-sm text-gray-700">
            <strong>{caregiver.fullName}</strong> will help with {requestLabel}
          </p>
        )}

        {isPending && (
          <p className="text-sm text-gray-500">
            Requested {formatDate(createdAt)}
          </p>
        )}

        {isDeclined && (
          <p className="text-sm text-red-700">
            Declined by {caregiver?.fullName || 'caregiver'}
          </p>
        )}
      </div>
    </div>
  );
};

export default SupportRequestBox;

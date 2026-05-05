import React from 'react';
import PropTypes from 'prop-types';
import { REQUEST_TYPE_CONFIG } from '../../utils/constants';
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

  const isPending = status === 'pending';
  const isAccepted = status === 'accepted';

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
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div
          className={[
            'mb-2 flex items-center gap-2 text-sm font-bold',
            isPending ? 'text-yellow-900' : '',
            isAccepted ? 'text-green-900' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {RequestIcon && <RequestIcon className="h-4 w-4" />}
          <span>{requestLabel}</span>
          <span>·</span>
          <span>{isPending ? 'Pending' : 'Confirmed'}</span>
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
      </div>
    </div>
  );
};

SupportRequestBox.propTypes = {
  supportRequest: PropTypes.shape({
    status: PropTypes.string,
    requestType: PropTypes.string,
    message: PropTypes.string,
    createdAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    caregiver: PropTypes.shape({
      fullName: PropTypes.string,
    }),
  }),
};

export default SupportRequestBox;

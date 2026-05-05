import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../utils/dateFormats';

const AppointmentDateBadge = ({ date, status }) => {
  const appointmentDate = new Date(date);
  const now = new Date();

  const isPast = appointmentDate < now;
  const isCompleted = status === 'completed';
  const isCancelled = status === 'cancelled';
  const isMissed = isPast && !isCompleted && !isCancelled;

  const month = formatDate(date).split(' ')[1].toUpperCase();
  const day = appointmentDate.getDate();

  const getBadgeColors = () => {
    if (isCompleted) {
      return 'bg-green-200 text-green-900';
    }

    if (isCancelled) {
      return 'bg-gray-100 text-gray-400';
    }

    if (isPast && !isCompleted) {
      return 'bg-red-100 text-red-700';
    }

    return 'bg-blue-100 text-blue-900';
  };

  return (
    <div className="relative">
      <div
        className={`
        flex flex-col items-center justify-center
        w-20 h-20 rounded-xl
        flex-shrink-0
        ${getBadgeColors()}
      `}
      >
        <span className="text-lg font-bold uppercase tracking-wide">
          {month}
        </span>
        <span className="text-3xl font-bold">{day}</span>
      </div>

      {isMissed && (
        <span
          className="
          absolute -top-2 -right-2
          bg-red-500 text-white
          text-xs font-bold
          px-2 py-0.5 rounded-full
        "
        >
          !
        </span>
      )}
    </div>
  );
};

AppointmentDateBadge.propTypes = {
  date: PropTypes.string.isRequired,
  status: PropTypes.oneOf(['scheduled', 'completed', 'cancelled']),
};

AppointmentDateBadge.defaultProps = {
  status: 'scheduled',
};

export default AppointmentDateBadge;

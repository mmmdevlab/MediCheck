import PropTypes from 'prop-types';

const FeelingHistoryCard = ({ lastLog }) => {
  const formatTimestamp = (date) => {
    if (!date) return 'No logs yet';

    const now = new Date();
    const logDate = new Date(date);
    const isToday = now.toDateString() === logDate.toDateString();

    const timeString = logDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Singapore',
    });

    return isToday
      ? `Today at ${timeString}`
      : logDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          timeZone: 'Asia/Singapore',
        });
  };

  return (
    <div className="flex items-center gap-3 mt-4 px-2">
      <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
        LAST LOG
      </span>
      <div
        className={`
          w-2 h-2 rounded-full
          ${lastLog ? 'bg-green-500' : 'bg-gray-300'}
        `}
      />

      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-600">
          {formatTimestamp(lastLog?.createdAt)}
        </span>
        {lastLog?.label && (
          <span className="font-bold text-gray-900">"{lastLog.label}"</span>
        )}
      </div>
    </div>
  );
};

FeelingHistoryCard.propTypes = {
  lastLog: PropTypes.shape({
    feelingScore: PropTypes.number,
    label: PropTypes.string,
    createdAt: PropTypes.string,
  }),
};

export default FeelingHistoryCard;

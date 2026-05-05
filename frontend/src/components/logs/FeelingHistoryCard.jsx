import { useMedicalLogs } from '../../hooks/useMedicalLogs';
import { FEELING_SCORES } from '../../utils/constants';
import { formatDate } from '../../utils/dateFormats';
import { formatTime } from '../../utils/timeFormat';

const FeelingHistoryCard = ({ lastLog }) => {
  const { data } = useMedicalLogs(7);

  const logs = data?.logs || [];
  const latestLog = lastLog || logs[0] || null;
  const stats = data?.stats || {
    averageScore: null,
    trend: null,
    latestAlert: null,
    alertCount: 0,
  };

  const config = FEELING_SCORES[latestLog?.feelingScore];
  const latestAlert = stats?.latestAlert;

  return (
    <div>
      <div className="flex items-center gap-4 mt-2 p-4">
        <span className="text-[14px] text-gray-600 font-bold uppercase tracking-widest">
          last update
        </span>

        <div className="flex items-center gap-4">
          <div
            className={`w-4 h-4 rounded-full ${latestLog ? 'animate-pulse' : ''}`}
            style={{ backgroundColor: config?.color || '#D1D5DB' }}
          />

          <span className="text-md font-regular text-gray-400">
            {latestLog
              ? `Today at ${formatTime(latestLog.createdAt)}`
              : 'Click the card above, to log your feelings'}
          </span>

          {latestLog?.label && (
            <span className="text-md font-bold text-gray-900 ml-1">
              "
              {FEELING_SCORES[latestLog?.feelingScore]?.label ||
                latestLog?.label}
              "
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4 bg-[#EEF1F5] rounded-2xl border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pr-4 border-r border-gray-200">
          <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">
            Average
          </span>

          <span className="text-sm font-semibold text-black">
            {FEELING_SCORES[stats?.averageScore]?.label || 'N/A'}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pl-2">
          <span className="text-sm font-bold text-red-600 uppercase tracking-widest">
            Alerts Sent
          </span>

          <span className="text-sm font-semibold text-black">
            {latestAlert
              ? `${formatDate(latestAlert.createdAt)} (${
                  FEELING_SCORES[latestAlert.feelingScore]?.label || 'Unwell'
                })`
              : 'No alerts'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FeelingHistoryCard;

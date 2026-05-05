import PropTypes from 'prop-types';
import { FEELING_SCORES } from '../../utils/constants';
import { formatWeekday, formatDate } from '../../utils/dateFormats';

const FeelingHistory = ({ logs }) => {
  const safeLogs = Array.isArray(logs) ? logs : (logs?.logs ?? []);
  const stats = Array.isArray(logs) ? {} : (logs?.stats ?? {});

  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
        My Feeling History
      </h3>

      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
        <p className="text-[#3177FE] text-sm font-bold mb-4">Last 7 days</p>

        <div className="flex justify-between items-center gap-4">
          {last7Days.map((date, index) => {
            const logDateStr = date.toDateString();

            const logForDay = safeLogs.find(
              (l) =>
                new Date(l.loggedAt || l.createdAt).toDateString() ===
                logDateStr
            );

            const config = logForDay
              ? FEELING_SCORES[logForDay.feelingScore]
              : null;
            const Icon = config?.icon;

            return (
              <div
                key={index}
                className="flex flex-col items-center gap-2 flex-1"
              >
                <div
                  className={`w-full aspect-square rounded-2xl flex items-center justify-center transition-all
      ${config ? `${config.bgColor} ${config.textColor}` : 'bg-gray-100 text-gray-300'}`}
                >
                  {Icon ? (
                    <Icon size={32} strokeWidth={2} />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-200" />
                  )}
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {formatWeekday(date)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pr-4 border-r border-gray-200">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Average
          </span>
          <span className="text-sm font-bold text-gray-900">
            {FEELING_SCORES[stats?.averageScore]?.label || 'N/A'}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pl-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Alerts Sent
          </span>
          <span className="text-sm font-bold text-gray-900">
            {stats?.latestAlert
              ? `${formatDate(stats.latestAlert.createdAt)} (${FEELING_SCORES[stats.latestAlert.feelingScore]?.label || 'Unwell'})`
              : 'No alerts'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FeelingHistory;

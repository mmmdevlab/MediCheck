import { useMedicalLogs } from '../../hooks/useMedicalLogs';
import { AlertCircle, Phone } from 'lucide-react';
import { FEELING_SCORES } from '../../utils/constants';
import { formatDate } from '../../utils/dateFormats';

const HealthAlertCard = () => {
  const { data } = useMedicalLogs(7);

  const logs = data?.logs || [];
  const stats = data?.stats || {
    averageScore: null,
    trend: null,
    latestAlert: null,
    alertCount: 0,
  };

  const latestAlert = stats?.latestAlert;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-green-600" />
        </div>

        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
          Health Summary
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pr-4 border-r border-gray-200">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Average
          </span>

          <span className="text-sm font-bold text-gray-900">
            {FEELING_SCORES[stats?.averageScore]?.label || 'no updates yet'}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pl-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Latest Alert
          </span>

          <span className="text-sm font-bold text-gray-900">
            {latestAlert
              ? `${formatDate(latestAlert.createdAt)} (${
                  FEELING_SCORES[latestAlert.feelingScore]?.label || 'Unwell'
                })`
              : 'No alerts - which means your patient is doing well!'}
          </span>
        </div>
      </div>
    </div>
  );
};

const AlertList = ({ alerts, onCheckIn }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm p-6 mt-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#EE4444] flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-white" />
        </div>

        <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider">
          Health Alerts
        </h3>

        <span className="ml-auto px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase">
          {alerts.length} URGENT
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <AlertItem
            key={alert.patientId}
            alert={alert}
            onCheckIn={onCheckIn}
          />
        ))}
      </div>
    </div>
  );
};

const AlertItem = ({ alert, onCheckIn }) => {
  const {
    patientId,
    patientName,
    feelingScore,
    statusMessage,
    loggedAt,
    phoneNumber,
  } = alert;

  const feeling = FEELING_SCORES[feelingScore];
  const Icon = feeling?.icon;

  const getTimeAgo = (date) => {
    const now = new Date();
    const logDate = new Date(date);

    const diffMs = now - logDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return formatDate(logDate);
  };

  return (
    <div className="rounded-2xl bg-red-50 p-4">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
          {Icon && <Icon className="w-15 h-15 text-red-600" strokeWidth={1} />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-bold text-black mb-1">
            {patientName} logged "
            <span className="text-[#EE4444] font-bold">{feeling?.label}</span>"
          </div>

          {statusMessage && (
            <p className="text-sm text-gray-700 mb-2">"{statusMessage}"</p>
          )}

          <p className="text-xs text-gray-800">{getTimeAgo(loggedAt)}</p>
        </div>

        <a
          href={`tel:${phoneNumber}`}
          onClick={() => onCheckIn(patientId, patientName)}
          className="
            flex items-center gap-2 px-6 py-3 rounded-full
            bg-[#EE4444] hover:bg-red-700 text-white
            font-bold text-sm transition-colors
          "
        >
          <Phone className="w-4 h-4" />
          Check up on your patient
        </a>
      </div>
    </div>
  );
};

export { AlertList };
export default HealthAlertCard;

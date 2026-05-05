import { Clock } from 'lucide-react';
import AppointmentDateBadge from './AppointmentDateBadge';
import PatientBadge from './PatientBadge';
import { formatTime } from '../../utils/timeFormat';

const AppointmentCardCaregiver = ({ appointment }) => {
  const { title, appointmentDate, patientName } = appointment;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 flex gap-4 items-center">
      <AppointmentDateBadge date={appointmentDate} />

      <div className="flex-1 min-w-0 space-y-1">
        {patientName && <PatientBadge name={patientName} />}
        <h3 className="font-bold text-lg text-gray-900 truncate">{title}</h3>
        <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatTime(appointmentDate)}</span>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCardCaregiver;

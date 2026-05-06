import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';
import AppointmentDateBadge from './AppointmentDateBadge';
import SupportRequestBox from './SupportRequestBox';
import { useUndoComplete } from '../../hooks/useAppointments';
import { formatTime } from '../../utils/timeFormat';
import ActionButton from '../UI/ActionButton';

const AppointmentCard = ({
  appointment,
  variant = 'dashboard',
  showActions = true,
  onReschedule,
  onMarkDone,
  onRequestHelp,
  onEdit,
  onDelete,
  onCancelAppointment,
  onUndoComplete,
}) => {
  const {
    id,
    title,
    doctorName,
    clinicName,
    appointmentDate,
    location,
    status,
    notes,
    supportRequest,
  } = appointment;

  const [isExpanded, setIsExpanded] = useState(false);

  const isDashboard = variant === 'dashboard';
  const isExtended = variant === 'extended';

  const now = new Date();
  const appointmentDateTime = new Date(appointmentDate);
  const isPast = appointmentDateTime < now;
  const isUpcoming = appointmentDateTime >= now;

  const isCompleted = status === 'completed';
  const isCancelled = status === 'cancelled';
  const isScheduled = status === 'scheduled';
  const isMissed = isPast && isScheduled;

  const displayStatus = isMissed ? 'missed' : status;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div className="flex gap-4">
        <AppointmentDateBadge date={appointmentDate} status={displayStatus} />

        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-2xl text-gray-900">{title}</h3>

            {isExtended && (
              <span
                className={`
                px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                ${displayStatus === 'scheduled' ? 'bg-blue-100 text-blue-900' : ''}
                ${displayStatus === 'completed' ? 'bg-green-100 text-green-900' : ''}
                ${displayStatus === 'cancelled' ? 'bg-gray-100 text-gray-600' : ''}
                ${displayStatus === 'missed' ? 'bg-red-100 text-red-700' : ''}
              `}
              >
                {displayStatus}
              </span>
            )}

            {isDashboard && isMissed && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wide">
                <AlertCircle className="w-3 h-3" />
                MISSED
              </span>
            )}
          </div>

          {doctorName && (
            <p className="text-[#3177FE] text-md font-bold">{doctorName}</p>
          )}

          <div className="flex items-center gap-2 text-md text-gray-600 font-medium">
            <Clock className="w-4 h-4" />
            <span>{formatTime(appointmentDate)}</span>
          </div>

          {clinicName && (
            <div className="flex items-center gap-2 text-md text-gray-600 font-medium">
              <MapPin className="w-4 h-4" />
              <span>{clinicName}</span>
              {location && <span className="text-gray-400"> @ {location}</span>}
            </div>
          )}
        </div>

        {isExtended && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="
              w-9 h-9 rounded-xl border border-gray-200
              flex items-center justify-center
              hover:bg-gray-50 transition-colors
            "
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>
        )}
      </div>

      {isDashboard && supportRequest && (
        <div
          className={`
          p-3 rounded-xl flex items-center gap-3 text-sm
          ${supportRequest.status === 'accepted' ? 'bg-green-100 border border-green-200 text-green-900' : ''}
          ${supportRequest.status === 'pending' ? 'bg-yellow-100 border border-yellow-200 text-yellow-900' : ''}
          ${supportRequest.status === 'declined' ? 'bg-red-100 border border-red-200 text-red-900' : ''}
        `}
        >
          {supportRequest.status === 'accepted' && (
            <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">
              ✓
            </span>
          )}
          <span>
            <strong>{supportRequest.caregiver?.fullName}</strong>{' '}
            {supportRequest.status === 'accepted'
              ? 'accepted'
              : supportRequest.status === 'declined'
                ? 'declined'
                : 'pending'}{' '}
            {supportRequest.requestType}
          </span>
        </div>
      )}

      {isExtended && isExpanded && (
        <div className="space-y-4 pt-2 border-t border-dashed border-gray-200">
          {notes ? (
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-700">
                <span className="text-xs uppercase tracking-widest font-bold text-gray-600 block mb-2">
                  Notes
                </span>
                {notes}
              </p>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="text-xs uppercase tracking-widest font-bold text-gray-600 mb-1">
                Notes
              </p>
              <p className="text-sm text-gray-400 italic">No notes added</p>
            </div>
          )}

          <SupportRequestBox supportRequest={supportRequest} />
        </div>
      )}

      <div className="flex gap-3">
        {isDashboard && (
          <>
            {isUpcoming && isScheduled && (
              <>
                <button
                  onClick={() => onReschedule(id)}
                  className="
                    flex-1 px-4 py-3 rounded-full
                    bg-gray-100 hover:bg-gray-200
                    text-gray-900 font-semibold text-sm
                    transition-colors
                  "
                >
                  RESCHEDULE
                </button>

                <button
                  onClick={() => onMarkDone(id)}
                  className="
                    flex-1 px-4 py-3 rounded-full
                    bg-black hover:bg-gray-800 text-white
                    font-semibold text-sm
                    transition-colors
                  "
                >
                  DONE
                </button>

                {!supportRequest && (
                  <button
                    onClick={() => onRequestHelp(id)}
                    className="
                      flex-1 px-4 py-3 rounded-full
                      bg-blue-500 hover:bg-blue-600
                      text-white font-semibold text-sm
                      transition-colors
                    "
                  >
                    REQUEST HELP
                  </button>
                )}
              </>
            )}

            {isMissed && (
              <>
                <ActionButton
                  variant="action"
                  onClick={() => onReschedule(id)}
                  className="flex-1"
                >
                  RESCHEDULE
                </ActionButton>

                <button
                  onClick={() => onMarkDone(id)}
                  className="
                    flex-1 px-4 py-3 rounded-full
                    bg-black hover:bg-gray-800 text-white
                    font-semibold text-sm
                    transition-colors
                  "
                >
                  MARK DONE
                </button>

                {!supportRequest && (
                  <button
                    onClick={() => onRequestHelp(id)}
                    className="
                      flex-1 px-4 py-3 rounded-full
                      bg-blue-500 hover:bg-blue-600
                      text-white font-semibold text-sm
                      transition-colors
                    "
                  >
                    REQUEST HELP
                  </button>
                )}
              </>
            )}

            {isCompleted && (
              <>
                <button
                  disabled
                  className="flex-1 px-4 py-3 rounded-full
                    bg-green-500 text-white
                    font-semibold text-sm
                    cursor-not-allowed"
                >
                  COMPLETED
                </button>
                <button
                  onClick={() => onUndoComplete(id)}
                  className="flex-1 px-4 py-3 rounded-full
                    bg-gray-100 hover:bg-gray-200
                    text-gray-900 font-semibold text-sm
                    transition-colors"
                >
                  UNDO
                </button>
              </>
            )}

            {isCancelled && (
              <button
                disabled
                className="
                  flex-1 px-4 py-3 rounded-full
                  bg-gray-300 text-gray-500
                  font-semibold text-sm
                  cursor-not-allowed
                "
              >
                CANCELLED
              </button>
            )}
          </>
        )}

        {isExtended && isExpanded && (
          <>
            {isUpcoming && isScheduled && (
              <>
                <ActionButton
                  variant="secondary"
                  onClick={() => onEdit(id)}
                  className="flex-1"
                >
                  <Pencil className="w-4 h-4" />
                  EDIT
                </ActionButton>

                <button
                  onClick={() => onCancelAppointment?.(id)}
                  className="
                  flex-1 px-4 py-3 rounded-full
                  bg-[#EE4444] hover:bg-red-600
                  text-white font-semibold text-sm
                  transition-colors
                  flex items-center justify-center gap-2
                "
                >
                  <Trash2 className="w-4 h-4" />
                  CANCEL APPT
                </button>

                {!supportRequest && (
                  <button
                    onClick={() => onRequestHelp(id)}
                    className="
                    flex-1 px-4 py-3 rounded-full
                    bg-blue-500 hover:bg-blue-600
                    text-white font-semibold text-sm
                    transition-colors
                  "
                  >
                    REQUEST HELP
                  </button>
                )}
              </>
            )}

            {isMissed && (
              <>
                <ActionButton
                  variant="secondary"
                  onClick={() => onEdit(id)}
                  className="flex-1"
                >
                  <Pencil className="w-4 h-4" />
                  EDIT
                </ActionButton>

                <ActionButton
                  variant="action"
                  onClick={() => onReschedule(id)}
                  className="flex-1"
                >
                  RESCHEDULE
                </ActionButton>

                <ActionButton
                  variant="danger"
                  onClick={() => onDelete(id)}
                  className="
                  flex-1 px-4 py-3 rounded-full
                  bg-[#EE4444] hover:bg-red-600
                  text-white font-semibold text-sm
                  transition-colors
                  flex items-center justify-center gap-2
                "
                >
                  <Trash2 className="w-4 h-4" />
                  DELETE
                </ActionButton>
              </>
            )}

            {isCompleted && (
              <>
                <button
                  onClick={() => onEdit(id)}
                  className="
                  flex-1 px-4 py-3 rounded-full
                  bg-white hover:bg-gray-200
                  border-2 border-gray-200
                  text-gray-900 font-semibold text-sm
                  transition-colors
                  flex items-center justify-center gap-2
                "
                >
                  <Pencil className="w-4 h-4" />
                  EDIT
                </button>

                <ActionButton
                  variant="secondary"
                  onClick={() => onUndoComplete(id)}
                  className="flex-1"
                >
                  UNDO
                </ActionButton>
              </>
            )}

            {isCancelled && (
              <>
                <ActionButton
                  variant="secondary"
                  onClick={() => onUndoComplete(id)}
                  className="flex-1"
                >
                  UNDO
                </ActionButton>

                <ActionButton
                  variant="action"
                  onClick={() => onReschedule(id)}
                  className="flex-1"
                >
                  RESCHEDULE
                </ActionButton>

                <button
                  onClick={() => onDelete(id)}
                  className="
                  flex-1 px-4 py-3 rounded-full
                  bg-[#EE4444] hover:bg-red-600
                  text-white font-semibold text-sm
                  transition-colors
                  flex items-center justify-center gap-2
                "
                >
                  <Trash2 className="w-4 h-4" />
                  DELETE
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;

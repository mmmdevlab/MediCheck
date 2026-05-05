import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';
import { formatDate } from '../../utils/dateFormats';

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const CalendarView = ({
  appointments = [],
  onDateClick,
  onAppointmentClick,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentMonth = currentDate.getMonth(); // 0-11
  const currentYear = currentDate.getFullYear();

  const today = new Date();
  const todayStr = formatDateKey(today);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    const startDayOfWeek = firstDay.getDay();
    const totalDaysInMonth = lastDay.getDate();

    const days = [];

    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: prevMonthLastDay - i,
        isCurrentMonth: false,
        fullDate: new Date(currentYear, currentMonth - 1, prevMonthLastDay - i),
      });
    }

    for (let date = 1; date <= totalDaysInMonth; date++) {
      days.push({
        date,
        isCurrentMonth: true,
        fullDate: new Date(currentYear, currentMonth, date),
      });
    }

    const remainingCells = 42 - days.length;
    for (let date = 1; date <= remainingCells; date++) {
      days.push({
        date,
        isCurrentMonth: false,
        fullDate: new Date(currentYear, currentMonth + 1, date),
      });
    }

    return days;
  }, [currentMonth, currentYear]);

  const appointmentsByDate = useMemo(() => {
    return appointments.reduce((acc, apt) => {
      const dateKey = formatDateKey(new Date(apt.appointmentDate));
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(apt);
      return acc;
    }, {});
  }, [appointments]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (day) => {
    if (onDateClick) {
      onDateClick(day.fullDate);
    }
  };

  const handleAppointmentClick = (e, aptId) => {
    e.stopPropagation();
    if (onAppointmentClick) {
      onAppointmentClick(aptId);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-md font-bold text-gray-400 uppercase tracking-widest mb-1">
          {new Intl.DateTimeFormat('en-SG', {
            month: 'long',
            year: 'numeric',
            timeZone: 'Asia/Singapore',
          }).format(currentDate)}
        </h2>

        <div className="flex gap-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={goToToday}
            className="px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors text-sm font-semibold text-gray-700"
          >
            Today
          </button>

          <button
            onClick={goToNextMonth}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-bold text-blue-600 uppercase tracking-wider py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          const dateKey = formatDateKey(day.fullDate);
          const dayAppointments = appointmentsByDate[dateKey] || [];
          const isToday = dateKey === todayStr;
          const hasAppointments = dayAppointments.length > 0;

          return (
            <button
              key={index}
              onClick={() => handleDayClick(day)}
              disabled={!day.isCurrentMonth}
              className={`
                relative min-h-[80px] p-2 rounded-2xl transition-all
                ${day.isCurrentMonth ? 'bg-gray-50 hover:bg-gray-100' : 'bg-transparent opacity-30'}
                ${isToday ? 'bg-yellow-200 text-black' : ''}
                ${hasAppointments ? 'bg-blue-700' : ''}
              `}
            >
              <div
                className={`
                  text-sm font-bold mb-1
                  ${isToday ? 'text-black' : 'text-gray-900'}
                  ${!day.isCurrentMonth ? 'text-gray-400' : ''}
                `}
              >
                {day.date}
              </div>

              {hasAppointments && (
                <div className="space-y-1 bg-blue-600 rounded-lg p-1 text-white">
                  {dayAppointments.slice(0, 2).map((apt) => (
                    <div
                      key={apt.id}
                      onClick={(e) => handleAppointmentClick(e, apt.id)}
                      className="text-[10px] font-semibold text-white px-1 py-1 truncate hover:bg-blue-500 rounded cursor-pointer"
                      title={apt.title || apt.clinicName}
                    >
                      {apt.title || apt.clinicName || 'Appointment'}
                    </div>
                  ))}
                  {dayAppointments.length > 2 && (
                    <div className="text-[9px] font-bold text-gray-500 text-center">
                      +{dayAppointments.length - 2} more
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-6 text-xs font-bold text-gray-500 uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-200 "></div>
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-600"></div>
          <span>Has Appointments</span>
        </div>
      </div>
    </div>
  );
};

CalendarView.propTypes = {
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      appointmentDate: PropTypes.string.isRequired,
      doctorName: PropTypes.string,
      clinicName: PropTypes.string,
    })
  ),
  onDateClick: PropTypes.func,
  onAppointmentClick: PropTypes.func,
};

export default CalendarView;

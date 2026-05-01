import React, { useState, useEffect } from 'react';
import medicalLogsAPI from '../api/medicalLogs';
import FeelingLogger from '../components/logs/FeelingLogger';
import FeelingHistoryCard from '../components/logs/FeelingHistoryCard';
import AppointmentList from '../components/appointments/AppointmentList';

const DashboardPage = () => {
  const [lastLoggedFeeling, setLastLoggedFeeling] = useState(null);
  const [lastLog, setLastLog] = useState(null);
  const [isLogging, setIsLogging] = useState(false);

  const mockAppointments = [
    {
      id: 1,
      doctor_name: 'Annual Physical Checkup',
      clinic_name: 'City Health Clinic',
      appointment_date: '2026-05-20T10:00:00Z',
      support_status: null,
      is_completed: false,
    },
    {
      id: 2,
      doctor_name: 'Dental Cleaning',
      clinic_name: 'Bright Smiles Dental',
      appointment_date: '2026-06-15T14:30:00Z',
      support_status: 'MARK TAN ACCEPTED TRANSPORT',
      is_completed: false,
    },
  ];

  useEffect(() => {
    fetchTodayLog();
  }, []);

  const fetchTodayLog = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.log('No auth token - user not logged in');
        return;
      }

      const data = await medicalLogsAPI.getMyLogs(1);

      console.log(
        'All fetched logs:',
        data.logs.map((log) => ({
          id: log.id,
          score: log.feelingScore,
          time: new Date(log.createdAt).toLocaleString('en-US', {
            timeZone: 'Asia/Singapore',
          }),
        }))
      );
      const todayLog = data.logs[0];

      if (todayLog) {
        console.log('Setting lastLog:', {
          feeling_score: todayLog.feeling_score,
          label: getFeelingLabel(todayLog.feeling_score),
          created_at: todayLog.created_at,
        });

        setLastLog({
          feeling_score: todayLog.feeling_score,
          label: getFeelingLabel(todayLog.feeling_score),
          created_at: todayLog.created_at,
        });
      } else {
        console.log('No logs found');
        setLastLoggedFeeling(null);
        setLastLog(null);
      }
    } catch (error) {
      console.error("Failed to fetch today's log:", error);
      setLastLoggedFeeling(null);
      setLastLog(null);
    }
  };

  const getFeelingLabel = (score) => {
    const labels = {
      5: 'Very Well',
      4: 'Good',
      3: 'Okay',
      2: 'Unwell',
      1: 'Very Unwell',
    };
    return labels[score] || '';
  };

  const handleFeelingLog = async (feeling) => {
    if (isLogging) return;

    setIsLogging(true);

    try {
      setLastLoggedFeeling(feeling.id);

      const newLog = {
        feeling_score: feeling.id,
        label: feeling.label,
        created_at: new Date().toISOString(),
      };
      setLastLog(newLog);

      const data = await medicalLogsAPI.logFeeling(feeling.id);

      console.log('Log saved:', data);
      console.log('Backend response log:', data.log);

      const savedLog = {
        feeling_score: data.log.feeling_score || data.log.feelingScore,
        label: feeling.label,
        created_at: data.log.created_at || data.log.createdAt,
      };

      console.log('Setting lastLog to:', savedLog);

      setLastLog(savedLog);

      setTimeout(() => {
        setLastLoggedFeeling(null);
      }, 800);
    } catch (error) {
      console.error('Failed to log feeling:', error);

      fetchTodayLog();

      alert('Failed to save feeling. Please try again.');
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
        <FeelingLogger
          onFeelingLog={handleFeelingLog}
          lastLoggedFeeling={lastLoggedFeeling}
        />
        <FeelingHistoryCard lastLog={lastLog} />
      </div>

      <div>
        <AppointmentList
          appointments={mockAppointments}
          onReschedule={(id) => console.log('Reschedule', id)}
          onMarkDone={(id) => console.log('Mark Done', id)}
          onRequestHelp={(id) => console.log('Request Help', id)}
          showViewAll={true}
          onViewAll={() => console.log('View all clicked')}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
